import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const c={window:{}};vm.runInNewContext(fs.readFileSync('dist/catalog.js','utf8'),c);const d=c.window.CATALOG;
const allowed=['id','brand','brandFull','name','spec','form','category','image','sourceRow'];
assert.equal(d.length,678);assert.equal(new Set(d.map(p=>p.brand)).size,38);assert.equal(new Set(d.map(p=>p.id)).size,d.length);
for(const p of d){assert.ok(p.name&&p.brand);assert.ok(Object.keys(p).every(k=>allowed.includes(k)));assert.ok(!/价格|含税运|报价|专票|普票|[¥￥]|\d+(?:\.\d+)?\s*元/.test(JSON.stringify(p)),p.id);if(p.image)assert.ok(fs.existsSync('dist/'+p.image),p.id)}
assert.equal(d.filter(p=>p.image).length,670);
assert.ok(!fs.readdirSync('dist').some(n=>/\.xlsx?$/.test(n)));
console.log('PASS: 678 records, 38 groups, 670 image references, unique IDs, allowed fields and no price text.');

assert.ok(!/贸易属性|资质资料|配送说明|p\.(trade|qualification|shipping)/.test(fs.readFileSync('dist/app.js','utf8')));

for(const file of ['dist/index.html','dist/app.js']) assert.ok(!/森菲马|senfeima/i.test(fs.readFileSync(file,'utf8')));
