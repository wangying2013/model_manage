const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const detailJs = fs.readFileSync(path.join(root, 'js', 'detail.js'), 'utf8');
const detailHtml = fs.readFileSync(path.join(root, 'detail.html'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

assertIncludes(detailJs, '<th>使用类型</th><th>名称</th><th>负责人</th>', 'quota table should rename usage detail and add owner column after name');
assertNotIncludes(detailJs, '<th>使用详情</th>', 'quota table should not keep old usage detail header');

assertIncludes(detailJs, "type: 'API Key'", 'quota mock should include API Key usage type');
assertIncludes(detailJs, "type: '工作空间'", 'quota mock should include workspace usage type');
assertNotIncludes(detailJs, "type: '应用'", 'quota mock should not use app as usage type');

assertIncludes(detailJs, 'item.name', 'quota table should render name field');
assertIncludes(detailJs, 'item.owner', 'quota table should render owner field');
assertIncludes(detailJs, '智能招聘助手 API Key', 'API Key name should be represented as name');
assertIncludes(detailJs, '默认空间', 'workspace name should be represented as name');
assertNotIncludes(detailJs, "detail: '负责人：", 'API Key detail should not contain owner copy');

assertIncludes(detailHtml, '.quota-type.workspace', 'workspace quota type style should exist');
assertIncludes(detailHtml, '.quota-type.api', 'API Key quota type style should exist');

console.log('detail quota tab requirement checks passed');
