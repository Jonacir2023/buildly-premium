'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8'),scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]),box={window:{}};vm.runInNewContext(scripts[0],box);const d=JSON.parse(JSON.stringify(box.window.BUILDLY_DATA));
const m=d.meetings[0],topic=d.meetingTopics.find(x=>x.meeting===m.id);assert.ok(Array.isArray(m.participants)&&m.participants.length>1);assert.ok(m.agenda&&m.minutes);assert.ok(topic.owner&&topic.due&&topic.taskId===null);assert.match(scripts[1],/TOPICO_CONVERTIDO_EM_TAREFA/);assert.match(scripts[1],/if\(t\.taskId\)return/);
assert.ok(d.documents.length&&d.documentRevisions.length);assert.ok(d.documentLinks.every(x=>/^https?:\/\//.test(x.url)));assert.ok(d.bulletinBoard.some(x=>x.pinned));assert.ok(d.documentNotes.every(x=>d.documents.some(y=>y.id===x.document)));assert.match(scripts[1],/NOTA_ADICIONADA/);
assert.deepEqual([...new Set(d.periodicReports.map(x=>x.frequency))].sort(),['anual','mensal','semanal']);for(const x of ['Premium executivo','csvFinancial','csvRdo'])assert.match(scripts[1],new RegExp(x));
for(const k of ['rdos','people','epis','equipment','tasks','occurrences','alerts','invoices','measurements'])assert.ok(Array.isArray(d[k])&&d[k].length,`${k} preservado`);
console.log('OK: módulos recuperados e guardas de regressão validados com dados TESTE.');
