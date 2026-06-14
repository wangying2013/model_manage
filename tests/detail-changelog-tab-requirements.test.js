const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const detailJs = fs.readFileSync(path.join(root, 'js', 'detail.js'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

[
  '模型上线',
  '新增供应商',
  '去除供应商',
  '模型信息更新',
  '发起下线'
].forEach(text => assertIncludes(detailJs, text, `changelog mock should include ${text}`));

[
  '调整模型广场可见范围',
  '调整应用可见范围',
  '更新计费信息',
  '修改流式输出结果分隔符',
  '添加模型',
  '确认下线',
  '删除模型'
].forEach(text => assertNotIncludes(detailJs, text, `changelog mock should not include ${text}`));

const returnStart = detailJs.indexOf('return [', detailJs.indexOf('function getModelManagementChangeLogs'));
const returnEnd = detailJs.indexOf('];', returnStart);
const changelogMock = detailJs.slice(returnStart, returnEnd);
const entryCount = (changelogMock.match(/desc:/g) || []).length;
assert.strictEqual(entryCount, 5, 'changelog mock should contain exactly five entries');

console.log('detail changelog tab requirement checks passed');
