'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const storage = new Map();
const sandbox = {
  window: {},
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  Intl, Date, console, setTimeout, clearTimeout
};
vm.runInNewContext(scripts[0], sandbox);
let app = scripts[1]
  .replace("function renderAll(){persist();renderSelectors();renderTree();breadcrumb();renderPage()}", 'function renderAll(){persist()}')
  .replace(/function toast\(msg\)\{[^\n]+\}/, 'function toast(msg){globalThis.__lastToast=msg}')
  .replace('init();\n})();', 'globalThis.__app={D,state,normalizeData,documentsPage,meetingsPage,reportsPage,handleAction,financial,persist};\n})();');
vm.runInNewContext(app, sandbox);
const { D, state, normalizeData, documentsPage, meetingsPage, reportsPage, handleAction, financial, persist } = sandbox.__app;

// Renderização funcional dos módulos recuperados.
state.page = 'reunioes'; state.context = 'M-001';
const meetingHtml = meetingsPage();
for (const text of ['Participantes', 'Pauta', 'Ata', 'Responsável', 'Prazo', 'Criar tarefa']) assert.match(meetingHtml, new RegExp(text));
state.page = 'documentos'; state.context = null;
for (const tab of ['documentos', 'links', 'mural']) { state.documentTab = tab; assert.ok(documentsPage().length > 100); }
state.context = 'DOC-004'; assert.match(documentsPage(), /Notas vinculadas[\s\S]+Rastreabilidade de revisões/);
state.page = 'relatorios'; state.context = null;
for (const tab of ['premium', 'semanal', 'mensal', 'anual']) { state.reportTab = tab; assert.ok(reportsPage(financial()).includes('Relat')); }

// Conversão real do tópico em tarefa e idempotência.
const topic = D.meetingTopics.find(item => !item.taskId);
const before = D.tasks.length;
handleAction(`topic-task:${topic.id}`);
assert.equal(D.tasks.length, before + 1);
assert.equal(D.tasks.at(-1).originId, topic.id);
assert.equal(D.tasks.at(-1).due, topic.due);
handleAction(`topic-task:${topic.id}`);
assert.equal(D.tasks.length, before + 1);
assert.match(sandbox.__lastToast, /já possui tarefa/);

// Migração de uma base 2.2 artificial após importação.
const legacy = { meta: {}, meetings: [{ participants: 'PESSOA TESTE 01, PESSOA TESTE 02', decisions: 'DECISÃO TESTE' }], meetingTopics: [{}] };
normalizeData(legacy);
assert.deepEqual([...legacy.meetings[0].participants], ['PESSOA TESTE 01', 'PESSOA TESTE 02']);
assert.equal(legacy.meetings[0].minutes, 'DECISÃO TESTE');
for (const key of ['documentLinks', 'bulletinBoard', 'documentNotes', 'periodicReports']) assert.ok(Array.isArray(legacy[key]));
assert.equal(legacy.meta.version, '2.3.0-depth-recovery');

// Persistência e guardas de regressão dos módulos protegidos.
persist();
assert.equal(JSON.parse(storage.get('buildly-premium-v2::demo-state::2.3')).version, '2.3');
for (const key of ['rdos', 'people', 'epis', 'equipment', 'tasks', 'occurrences', 'alerts', 'invoices', 'measurements']) assert.ok(Array.isArray(D[key]) && D[key].length, `${key} preservado`);
console.log('OK: renderização, conversão idempotente, migração, persistência e regressão TESTE validadas.');
