const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const files = [
  'index.html',
  'detail.html',
  'model-management.html',
  'supplier.html',
  'compare.html',
  'js/data.js',
  'js/models.js',
  'js/detail.js',
  'js/model-management.js',
  'js/supplier.js',
  'js/compare.js'
];

const allSource = files.map(read).join('\n');
const dataJs = read('js/data.js');
const modelsJs = read('js/models.js');
const detailHtml = read('detail.html');
const supplierJs = read('js/supplier.js');
const modelManagementJs = read('js/model-management.js');

assert(!allSource.includes('multi/'), 'project should not keep old multi prefix');
assert(!allSource.includes('inner/'), 'project should not keep old inner prefix');
assert(allSource.includes('vend/'), 'project should use vend prefix');
assert(allSource.includes('prem/'), 'project should use prem prefix');

assert(supplierJs.includes('最大可用金额'), 'supplier model management should include max available amount');
assert(supplierJs.includes('maxAvailableAmount'), 'supplier model management should persist max available amount');
assert(modelManagementJs.includes('最大可用金额'), 'model management supplier model display should include max available amount');
assert(modelManagementJs.includes('maxAvailableAmount'), 'model management should carry supplier max available amount');
assert(dataJs.includes('maxAvailableAmount'), 'mock supplier models should include max available amount');

assert(modelsJs.includes('模型来源'), 'marketplace card should render model source');
assert(modelsJs.includes('getModelSource(model)'), 'marketplace card should use domestic/overseas model source');
assert(dataJs.includes("return '国内'"), 'model source helper should support domestic source copy');
assert(dataJs.includes("return '海外'"), 'model source helper should support overseas source copy');
assert(!modelsJs.includes('<span class="meta-label">提供方</span>'), 'marketplace card should remove provider meta item');
assert(modelsJs.includes('<span class="meta-label">服务类型</span>'), 'marketplace card should use service type copy');
assert(!modelsJs.includes('<span class="meta-label">模型类型</span>'), 'marketplace card should remove model type copy');
assert(modelsJs.includes('发布日期'), 'marketplace card should use release date copy');
assert(detailHtml.includes('data-tab="providers">供应商'), 'detail should keep provider tab');
assert(modelManagementJs.includes("testing: '未上线'") || read('js/common.js').includes("testing: '未上线'"), 'status copy should support testing as not online');

const tabOrder = [
  'data-tab="providers">供应商',
  'data-tab="apps">调用情况',
  'data-tab="changelog">变更记录',
  'data-tab="quota">模型配额'
];
let cursor = -1;
tabOrder.forEach(text => {
  const idx = detailHtml.indexOf(text);
  assert(idx > cursor, `detail tabs should contain ${text} in requested order`);
  cursor = idx;
});
assert(!detailHtml.includes('data-tab="capability">能力测试'), 'detail tabs should remove capability test tab');

console.log('global content requirement checks passed');
