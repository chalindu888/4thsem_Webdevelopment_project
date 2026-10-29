// API tests for the SecureAI backend.
// They run the real Express app (server.js) with in-memory stand-ins for MongoDB,
// so no database, network or credentials are needed:  npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

// ---------- In-memory stand-ins for the models and the DB connection ----------
const newId = () => new mongoose.Types.ObjectId();
const matches = (row, query) => Object.entries(query).every(([key, value]) => String(row[key]) === String(value));
const store = { users: [], assessments: [], dbUp: true };

const UserModel = {
  async findOne(query) { return store.users.find((u) => matches(u, query)) ?? null; },
  async create(doc) { const user = { _id: newId(), ...doc }; store.users.push(user); return user; },
  findById(id) {
    const user = store.users.find((u) => String(u._id) === String(id)) ?? null;
    return { select: async () => user };
  },
};

const AssessmentModel = {
  async create(doc) { const row = { _id: newId(), createdAt: new Date(), ...doc }; store.assessments.push(row); return row; },
  find(query) {
    const rows = store.assessments.filter((r) => matches(r, query)).sort((a, b) => b.createdAt - a.createdAt);
    return { sort: () => ({ limit: async (n) => rows.slice(0, n) }) };
  },
  findOne(query) {
    const rows = store.assessments.filter((r) => matches(r, query)).sort((a, b) => b.createdAt - a.createdAt);
    const result = Promise.resolve(rows[0] ?? null);
    result.sort = async () => rows[0] ?? null;
    return result;
  },
  async findOneAndUpdate(query, fields) { const row = store.assessments.find((r) => matches(r, query)); if (!row) return null; Object.assign(row, fields); return row; },
  async findOneAndDelete(query) { const i = store.assessments.findIndex((r) => matches(r, query)); return i < 0 ? null : store.assessments.splice(i, 1)[0]; },
};

const fakeDb = async () => { if (!store.dbUp) throw new Error('db down'); };
const stub = (relative, exports) => {
  const file = require.resolve(path.join(__dirname, '..', relative));
  require.cache[file] = { id: file, filename: file, loaded: true, exports };
};
stub('models/User.js', UserModel);
stub('models/Assessment.model.js', AssessmentModel);
stub('models/Item.js', { find: async () => [] });
stub('config/db.js', Object.assign(fakeDb, { connectDB: fakeDb, pingDB: fakeDb }));

const app = require('../server');

// ---------- Helpers ----------
let server;
let base;
before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const call = async (method, url, { body, token, headers = {} } = {}) => {
  const res = await fetch(base + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, headers: res.headers, body: text ? JSON.parse(text) : null };
};

const ANSWERS = { passwordHabits: 'weak', phishingAwareness: 'low', twoFactorAuth: 'none' };

// ---------- Health ----------
test('GET /api/health returns the expected payload', async () => {
  const res = await call('GET', '/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.message, 'SecureAI Backend API is running');
});

test('GET /api/health/db reflects the real database state', async () => {
  assert.equal((await call('GET', '/api/health/db')).status, 200);
  store.dbUp = false;
  const down = await call('GET', '/api/health/db');
  store.dbUp = true;
  assert.equal(down.status, 503);
  assert.equal(down.body.database, 'disconnected');
});

test('Database outage gives 503 JSON instead of crashing', async () => {
  store.dbUp = false;
  const res = await call('POST', '/api/auth/login', { body: { email: 'a@b.c', password: 'x' } });
  store.dbUp = true;
  assert.equal(res.status, 503);
  assert.equal(res.body.success, false);
});

test('Unknown API routes give a JSON 404', async () => {
  const res = await call('GET', '/api/does-not-exist');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});

// ---------- Auth ----------
test('Register, then log in with the same credentials', async () => {
  const reg = await call('POST', '/api/auth/register', { body: { name: 'Test User', email: 'Test@Example.com', password: 'secret123' } });
  assert.equal(reg.status, 201);
  assert.ok(reg.body.token);
  assert.equal(reg.body.user.email, 'test@example.com');
  assert.equal(store.users[0].password === 'secret123', false, 'password must be hashed');
  assert.ok(await bcrypt.compare('secret123', store.users[0].password));

  const dupe = await call('POST', '/api/auth/register', { body: { name: 'X', email: 'test@example.com', password: 'secret123' } });
  assert.equal(dupe.status, 409);

  const good = await call('POST', '/api/auth/login', { body: { email: ' TEST@example.com ', password: 'secret123' } });
  assert.equal(good.status, 200);
  assert.equal(jwt.verify(good.body.token, 'test-secret').id, String(store.users[0]._id));

  const bad = await call('POST', '/api/auth/login', { body: { email: 'test@example.com', password: 'wrong' } });
  assert.equal(bad.status, 401);
  assert.equal(bad.body.message, 'Invalid email or password.');
});

test('Protected routes reject missing, invalid and expired tokens', async () => {
  assert.equal((await call('GET', '/api/assessment')).status, 401);
  assert.equal((await call('GET', '/api/assessment', { token: 'not-a-jwt' })).status, 401);
  const expired = jwt.sign({ id: String(store.users[0]._id) }, 'test-secret', { expiresIn: -10 });
  const res = await call('GET', '/api/assessment', { token: expired });
  assert.equal(res.status, 401);
  assert.match(res.body.message, /expired/);
});

// ---------- Assessments ----------
test('Assessment lifecycle: validate, create, list, latest, get, update, delete', async () => {
  const token = jwt.sign({ id: String(store.users[0]._id) }, 'test-secret');

  const missing = await call('POST', '/api/assessment', { token, body: { passwordHabits: 'weak' } });
  assert.equal(missing.status, 400);

  const invalid = await call('POST', '/api/assessment', { token, body: { ...ANSWERS, twoFactorAuth: 'maybe' } });
  assert.equal(invalid.status, 400);

  const created = await call('POST', '/api/assessment', { token, body: { ...ANSWERS, notes: '  Baseline check  ' } });
  assert.equal(created.status, 201);
  const a = created.body.assessment;
  assert.equal(a.riskScore, 23);
  assert.equal(a.riskLevel, 'HIGH RISK');
  assert.equal(a.notes, 'Baseline check');
  assert.equal(String(store.assessments[0].user), String(store.users[0]._id), 'saved against the logged-in user');

  const list = await call('GET', '/api/assessments', { token }); // plural path works too
  assert.equal(list.status, 200);
  assert.equal(list.body.assessments.length, 1);

  const latest = await call('GET', '/api/assessment/latest', { token });
  assert.equal(latest.status, 200);
  assert.equal(latest.body.assessment.id, a.id);

  assert.equal((await call('GET', `/api/assessment/${a.id}`, { token })).status, 200);
  assert.equal((await call('GET', '/api/assessment/not-an-id', { token })).status, 404);

  const updated = await call('PUT', `/api/assessment/${a.id}`, { token, body: { passwordHabits: 'strong', phishingAwareness: 'high', twoFactorAuth: 'enabled' } });
  assert.equal(updated.status, 200);
  assert.ok(updated.body.assessment.riskScore > a.riskScore);

  assert.equal((await call('DELETE', `/api/assessment/${a.id}`, { token })).status, 200);
  assert.equal((await call('GET', '/api/assessment/latest', { token })).status, 404);
});

test("Users can't read, edit or delete someone else's assessment", async () => {
  const owner = await UserModel.create({ name: 'Owner', email: 'owner@example.com', password: 'x' });
  const theirs = await AssessmentModel.create({ ...ANSWERS, user: owner._id, riskScore: 23, riskLevel: 'HIGH RISK' });
  const token = jwt.sign({ id: String(store.users[0]._id) }, 'test-secret');

  assert.equal((await call('GET', `/api/assessment/${theirs._id}`, { token })).status, 404);
  assert.equal((await call('PUT', `/api/assessment/${theirs._id}`, { token, body: ANSWERS })).status, 404);
  assert.equal((await call('DELETE', `/api/assessment/${theirs._id}`, { token })).status, 404);
  assert.ok(store.assessments.includes(theirs), 'still there');
});

// ---------- CORS ----------
test('CORS allows the frontend and blocks unknown sites', async () => {
  const preflight = (origin) => call('OPTIONS', '/api/auth/login', {
    headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,authorization' },
  });
  const frontend = await preflight('https://4thsem-webdevelopment-project-c48i.vercel.app');
  assert.equal(frontend.headers.get('access-control-allow-origin'), 'https://4thsem-webdevelopment-project-c48i.vercel.app');

  const previewOrigin = 'https://4thsem-webdevelopment-project-c48i-abc123-chalindu888.vercel.app';
  assert.equal((await preflight(previewOrigin)).headers.get('access-control-allow-origin'), previewOrigin);

  const evil = await preflight('https://evil.example.com');
  assert.equal(evil.status, 403);
  assert.equal(evil.headers.get('access-control-allow-origin'), null);
});

// ---------- Vercel compatibility ----------
test('server.js exports the app and does not listen when imported', () => {
  assert.equal(typeof app, 'function');
  assert.equal(typeof app.handle, 'function');
});
