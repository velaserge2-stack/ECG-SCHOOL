/* ECG School · ecg-db.js — capa de almacenamiento local con IndexedDB.
 *
 * Guarda en el navegador del estudiante: respuestas, intentos, sesiones,
 * resultados de cuestionarios, estado de cada flashcard (FSRS) y su historial.
 * No sincroniza entre dispositivos: si el navegador o el sistema borran los
 * datos del sitio, se pierden (para eso existe exportar/importar).
 *
 * Uso:  ECGDB.ready().then(info => ...)   info = {mode:'idb'|'memory', persisted}
 *       ECGDB.get(store, key) · getAll(store, index?, range?) · put(store, obj)
 *       ECGDB.putMany(store, arr) · del(store, key) · clear(store) · count(...)
 *       ECGDB.tx(stores, 'readwrite', fn(t) => ...)   transacción multi-almacén
 *       ECGDB.exportAll() · ECGDB.importAll(obj) · ECGDB.summary()
 *
 * Para ampliar el esquema: sube VERSION y agrega una función a MIGRATIONS.
 */
(function (root) {
  'use strict';
  if (root.ECGDB) return;

  var DB_NAME = 'ecg-school';
  var VERSION = 1;
  var FORMAT = 'ecg-school-backup';
  var DAY_ROLLOVER_HOUR = 4; // como Anki: el "día de estudio" cambia a las 4:00

  /* Almacenes de la versión 1:
   *  meta      clave-valor (ajustes, mazo, banderas de migración)
   *  answers   última respuesta por pregunta            key: qid
   *  attempts  historial de intentos (nunca se edita)   key: qid|ts
   *  sessions  estado reanudable de vistas/cuestionarios key: id
   *  results   cuestionarios terminados                  key: id
   *  cards     estado FSRS de cada flashcard             key: cid
   *  reviews   historial de repasos de flashcards        key: cid|ts
   */
  var MIGRATIONS = {
    1: function (db) {
      function store(name, keyPath, indexes) {
        if (db.objectStoreNames.contains(name)) return;
        var s = db.createObjectStore(name, { keyPath: keyPath });
        (indexes || []).forEach(function (ix) { s.createIndex(ix, ix, { unique: false }); });
      }
      store('meta', 'key');
      store('answers', 'qid', ['topic', 'ts']);
      store('attempts', 'key', ['qid', 'ts', 'topic', 'day', 'source']);
      store('sessions', 'id');
      store('results', 'id', ['ts', 'source']);
      store('cards', 'cid', ['due', 'state']);
      store('reviews', 'key', ['cid', 'ts', 'day']);
    }
  };
  var STORES = ['meta', 'answers', 'attempts', 'sessions', 'results', 'cards', 'reviews'];
  var KEYS = { meta: 'key', answers: 'qid', attempts: 'key', sessions: 'id', results: 'id', cards: 'cid', reviews: 'key' };

  var db = null, mode = 'idb', opening = null, persisted = false, lastError = null;
  var mem = null; // respaldo en memoria si IndexedDB no está disponible

  function err(where, e) {
    lastError = (e && (e.message || e.name)) || String(e);
    try { console.warn('[ECGDB] ' + where + ': ' + lastError); } catch (_) {}
    return e instanceof Error ? e : new Error(lastError);
  }

  /* ---------- utilidades públicas ---------- */
  function dayKey(ts) {
    var d = new Date((ts == null ? Date.now() : ts) - DAY_ROLLOVER_HOUR * 3600e3);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function endOfStudyDay(ts) {
    var d = new Date(ts == null ? Date.now() : ts);
    var e = new Date(d.getFullYear(), d.getMonth(), d.getDate(), DAY_ROLLOVER_HOUR, 0, 0, 0);
    if (e.getTime() <= d.getTime()) e.setDate(e.getDate() + 1);
    return e.getTime();
  }
  // Identificador estable a partir del contenido (FNV-1a de 32 bits en base 36).
  function hashId(prefix, text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return prefix + (h >>> 0).toString(36);
  }

  /* ---------- memoria (respaldo) ---------- */
  function memInit() {
    mem = {};
    STORES.forEach(function (s) { mem[s] = new Map(); });
  }
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }

  /* ---------- apertura con migraciones ---------- */
  function open() {
    if (db || mode === 'memory') return Promise.resolve();
    if (opening) return opening;
    opening = new Promise(function (resolve) {
      var idb;
      try { idb = root.indexedDB; } catch (e) { idb = null; }
      if (!idb) { mode = 'memory'; memInit(); err('open', new Error('IndexedDB no disponible; se usa memoria')); return resolve(); }
      var req;
      try { req = idb.open(DB_NAME, VERSION); } catch (e) { mode = 'memory'; memInit(); err('open', e); return resolve(); }
      req.onupgradeneeded = function (ev) {
        var d = req.result, from = ev.oldVersion || 0;
        for (var v = from + 1; v <= VERSION; v++) {
          if (MIGRATIONS[v]) MIGRATIONS[v](d, req.transaction);
        }
      };
      req.onblocked = function () { err('open', new Error('Otra pestaña usa una versión anterior de la base; ciérrala para actualizar.')); };
      req.onsuccess = function () {
        db = req.result;
        // Si otra pestaña necesita actualizar el esquema, cerramos para no bloquearla.
        db.onversionchange = function () { try { db.close(); } catch (_) {} db = null; opening = null; };
        db.onclose = function () { db = null; opening = null; };
        resolve();
      };
      req.onerror = function () { mode = 'memory'; memInit(); err('open', req.error); resolve(); };
    });
    return opening;
  }

  function ready() {
    return open().then(function () {
      if (mode === 'idb' && root.navigator && navigator.storage && navigator.storage.persist) {
        return navigator.storage.persisted().then(function (p) {
          if (p) return p;
          return navigator.storage.persist().catch(function () { return false; });
        }).catch(function () { return false; }).then(function (p) { persisted = !!p; });
      }
    }).then(function () { return { mode: mode, persisted: persisted, error: lastError }; });
  }

  /* ---------- transacciones ---------- */
  function wrap(r) {
    var p = new Promise(function (res, rej) { r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; });
    p.catch(function () {}); // el error se informa por el abort de la transacción
    return p;
  }
  // fn(t) recibe {get,getAll,put,del,clear,count}; todo ocurre en UNA transacción.
  function tx(stores, rw, fn) {
    stores = [].concat(stores);
    return open().then(function () {
      if (mode === 'memory') return memTx(stores, rw, fn);
      return new Promise(function (resolve, reject) {
        var t;
        try { t = db.transaction(stores, rw === 'readwrite' ? 'readwrite' : 'readonly'); }
        catch (e) { db = null; opening = null; return reject(err('tx', e)); }
        var out, api = {
          get: function (s, k) { return wrap(t.objectStore(s).get(k)); },
          getAll: function (s, ix, range) { var o = t.objectStore(s); return wrap((ix ? o.index(ix) : o).getAll(range)); },
          put: function (s, v) { return wrap(t.objectStore(s).put(v)); },
          del: function (s, k) { return wrap(t.objectStore(s).delete(k)); },
          clear: function (s) { return wrap(t.objectStore(s).clear()); },
          count: function (s, ix, range) { var o = t.objectStore(s); return wrap((ix ? o.index(ix) : o).count(range)); }
        };
        t.oncomplete = function () { resolve(out); };
        t.onabort = function () { reject(err('tx abort', t.error || new Error('transacción abortada'))); };
        t.onerror = function (ev) { /* el abort trae el detalle */ };
        try { out = fn(api); if (out && out.then) out.then(function (v) { out = v; }, function (e) { try { t.abort(); } catch (_) {} reject(err('tx fn', e)); }); }
        catch (e) { try { t.abort(); } catch (_) {} reject(err('tx fn', e)); }
      });
    });
  }
  function inRange(v, r) { return !r || ((r.lower === undefined || (r.lowerOpen ? v > r.lower : v >= r.lower)) && (r.upper === undefined || (r.upperOpen ? v < r.upper : v <= r.upper))); }
  function memTx(stores, rw, fn) {
    var api = {
      get: function (s, k) { return Promise.resolve(clone(mem[s].get(k))); },
      getAll: function (s, ix, range) {
        var all = Array.from(mem[s].values()).map(clone);
        if (ix) { all = all.filter(function (o) { return o[ix] !== undefined && inRange(o[ix], range); }); all.sort(function (a, b) { return a[ix] < b[ix] ? -1 : a[ix] > b[ix] ? 1 : 0; }); }
        else if (range) all = all.filter(function (o) { return inRange(o[KEYS[s]], range); });
        return Promise.resolve(all);
      },
      put: function (s, v) { mem[s].set(v[KEYS[s]], clone(v)); return Promise.resolve(v[KEYS[s]]); },
      del: function (s, k) { mem[s].delete(k); return Promise.resolve(); },
      clear: function (s) { mem[s].clear(); return Promise.resolve(); },
      count: function (s, ix, range) { return api.getAll(s, ix, range).then(function (a) { return a.length; }); }
    };
    return Promise.resolve().then(function () { return fn(api); });
  }

  /* ---------- CRUD ---------- */
  function get(s, k) { return tx(s, 'readonly', function (t) { return t.get(s, k); }); }
  function getAll(s, ix, range) { return tx(s, 'readonly', function (t) { return t.getAll(s, ix, range); }); }
  function count(s, ix, range) { return tx(s, 'readonly', function (t) { return t.count(s, ix, range); }); }
  function put(s, v) { return tx(s, 'readwrite', function (t) { return t.put(s, v); }).then(function (k) { notify(s); return k; }); }
  function putMany(s, arr) { return tx(s, 'readwrite', function (t) { return Promise.all(arr.map(function (v) { return t.put(s, v); })); }).then(function (k) { notify(s); return k; }); }
  function del(s, k) { return tx(s, 'readwrite', function (t) { return t.del(s, k); }).then(function () { notify(s); }); }
  function clear(s) { return tx(s, 'readwrite', function (t) { return t.clear(s); }).then(function () { notify(s); }); }
  function getMeta(k, dflt) { return get('meta', k).then(function (r) { return r ? r.value : dflt; }); }
  function setMeta(k, v) { return put('meta', { key: k, value: v, updated: Date.now() }); }
  function range(lo, hi) {
    var K = root.IDBKeyRange;
    if (mode === 'memory' || !K) return { lower: lo, upper: hi };
    if (lo != null && hi != null) return K.bound(lo, hi);
    if (lo != null) return K.lowerBound(lo);
    return K.upperBound(hi);
  }

  /* ---------- avisos de cambio (para el contador de pendientes) ---------- */
  var chan = null;
  try { chan = new BroadcastChannel('ecg-db'); } catch (_) {}
  var listeners = [];
  function notify(s) {
    var msg = { type: 'ecg-db-change', store: s, ts: Date.now() };
    listeners.forEach(function (f) { try { f(msg); } catch (_) {} });
    try { if (chan) chan.postMessage(msg); } catch (_) {}
  }
  function onChange(f) { listeners.push(f); if (chan) chan.addEventListener('message', function (e) { if (e.data && e.data.type === 'ecg-db-change') f(e.data); }); }

  /* ---------- respaldo: exportar ---------- */
  function exportAll() {
    return tx(STORES, 'readonly', function (t) {
      var out = {};
      return Promise.all(STORES.map(function (s) { return t.getAll(s).then(function (a) { out[s] = a; }); })).then(function () { return out; });
    }).then(function (data) {
      return { format: FORMAT, schema: VERSION, app: 'ECG School', exportedAt: new Date().toISOString(), stores: data };
    });
  }

  /* ---------- respaldo: importar con reconciliación ----------
   * Nunca borra lo existente. Reglas por almacén:
   *  attempts, reviews  historial inmutable: se agregan los que falten (clave única).
   *  answers            gana el registro con fecha (ts) más reciente.
   *  cards              gana el que tenga el repaso más reciente (o más repasos).
   *  sessions, results  gana el más reciente (updated / ts).
   *  meta               sólo se importan ajustes ausentes; nunca banderas internas.
   */
  function newer(a, b, f) { return (a && a[f] || 0) > (b && b[f] || 0); }
  function validate(obj) {
    if (!obj || typeof obj !== 'object') throw new Error('El archivo no es un respaldo válido.');
    if (obj.format !== FORMAT) throw new Error('Este archivo no es un respaldo de ECG School.');
    if (!obj.stores || typeof obj.stores !== 'object') throw new Error('El respaldo no contiene datos.');
    if (obj.schema > VERSION) throw new Error('El respaldo viene de una versión más nueva de la app. Actualiza la página e inténtalo de nuevo.');
    STORES.forEach(function (s) {
      var a = obj.stores[s];
      if (a == null) return;
      if (!Array.isArray(a)) throw new Error('Datos dañados en «' + s + '».');
      a.forEach(function (r) { if (!r || typeof r !== 'object' || r[KEYS[s]] == null) throw new Error('Registro sin clave en «' + s + '».'); });
    });
  }
  function importAll(obj) {
    try { validate(obj); } catch (e) { return Promise.reject(e); }
    var rep = {};
    return tx(STORES, 'readwrite', function (t) {
      return Promise.all(STORES.map(function (s) {
        var incoming = obj.stores[s] || [];
        rep[s] = { added: 0, updated: 0, kept: 0 };
        return t.getAll(s).then(function (cur) {
          var byKey = new Map(cur.map(function (r) { return [r[KEYS[s]], r]; }));
          return Promise.all(incoming.map(function (r) {
            var k = r[KEYS[s]], have = byKey.get(k), take = false;
            if (!have) take = true;
            else if (s === 'answers') take = newer(r, have, 'ts');
            else if (s === 'cards') take = newer(r, have, 'lastReview') || ((r.lastReview || 0) === (have.lastReview || 0) && (r.card && r.card.reps || 0) > (have.card && have.card.reps || 0));
            else if (s === 'sessions') take = newer(r, have, 'updated');
            else if (s === 'results') take = newer(r, have, 'ts');
            if (s === 'meta' && (/^_|^migrated/.test(k))) take = false;
            if (!take) { rep[s].kept++; return; }
            rep[s][have ? 'updated' : 'added']++;
            return t.put(s, r);
          }));
        });
      }));
    }).then(function () { notify('*'); return rep; });
  }

  /* ---------- resumen de repaso (lo usan el banco y el menú) ----------
   * Pendientes hoy = aprendizaje vencido + repasos que vencen antes del fin
   * del día de estudio + nuevas disponibles según el límite diario.
   */
  function summary(now) {
    now = now || Date.now();
    var eod = endOfStudyDay(now), today = dayKey(now);
    return tx(['cards', 'reviews', 'meta'], 'readonly', function (t) {
      return Promise.all([t.getAll('cards'), t.getAll('reviews', 'day', range(today, today)), t.get('meta', 'srs-settings'), t.get('meta', 'deck')]);
    }).then(function (r) {
      var cards = r[0] || [], todays = r[1] || [], st = (r[2] && r[2].value) || {}, deck = (r[3] && r[3].value) || {};
      var newPerDay = st.newPerDay != null ? st.newPerDay : 20;
      var s = { total: deck.total || 0, seen: 0, newAvail: 0, learning: 0, review: 0, dueLearning: 0, dueReview: 0, suspended: 0, reviewedToday: 0, newToday: 0, dueToday: 0, nextDue: null };
      var known = {};
      cards.forEach(function (c) {
        known[c.cid] = 1;
        if (c.suspended) { s.suspended++; return; }
        var st0 = c.card ? c.card.state : 0;
        if (st0 === 0) return;
        s.seen++;
        var due = c.card.due;
        if (st0 === 2) { s.review++; if (due <= eod) s.dueReview++; }
        else { s.learning++; if (due <= now) s.dueLearning++; else if (due <= eod) s.dueLearning++; }
        if (due > now && (s.nextDue == null || due < s.nextDue)) s.nextDue = due;
      });
      todays.forEach(function (v) { s.reviewedToday++; if (v.stateBefore === 0) s.newToday++; });
      var ids = deck.ids || [];
      // nuevas = tarjetas del mazo sin estado o en estado 0, no suspendidas
      var byId = cardsById(cards), newCount = 0;
      ids.forEach(function (id) { var c = byId[id]; if (!c || ((!c.card || c.card.state === 0) && !c.suspended)) newCount++; });
      s.newAvail = Math.max(0, Math.min(newCount, newPerDay - s.newToday));
      s.dueToday = s.dueLearning + s.dueReview + s.newAvail;
      return s;
    });
  }
  var _cbCache = null, _cbSrc = null;
  function cardsById(cards) { if (_cbSrc !== cards) { _cbSrc = cards; _cbCache = {}; cards.forEach(function (c) { _cbCache[c.cid] = c; }); } return _cbCache; }

  root.ECGDB = {
    VERSION: VERSION, NAME: DB_NAME, STORES: STORES.slice(), FORMAT: FORMAT,
    ready: ready, tx: tx, get: get, getAll: getAll, count: count, put: put, putMany: putMany, del: del, clear: clear,
    getMeta: getMeta, setMeta: setMeta, range: range,
    exportAll: exportAll, importAll: importAll, summary: summary, onChange: onChange, notify: notify,
    dayKey: dayKey, endOfStudyDay: endOfStudyDay, hashId: hashId,
    get mode() { return mode; }, get persisted() { return persisted; }, get lastError() { return lastError; }
  };
})(typeof window !== 'undefined' ? window : this);
