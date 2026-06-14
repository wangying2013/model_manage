const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const supplierHtml = fs.readFileSync(path.join(root, 'supplier.html'), 'utf8');
const supplierJs = fs.readFileSync(path.join(root, 'js', 'supplier.js'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

assertNotIncludes(supplierHtml, '<th style="width:120px">状态</th>', 'supplier table should not render status column');
assertNotIncludes(supplierJs, 'supplier-status-tag', 'supplier rows should not render status cells');
assertNotIncludes(supplierHtml, 'id="filterStatus"', 'supplier filters should not include status filter');
assertNotIncludes(supplierJs, 'filterStatus', 'supplier filter logic should not keep status filter state');

const openSupplierModalStart = supplierJs.indexOf('function openSupplierModal');
const openSupplierInfoStart = supplierJs.indexOf('function openSupplierInfoDrawer');
assert(openSupplierModalStart >= 0 && openSupplierInfoStart > openSupplierModalStart, 'supplier modal functions should exist');
const addSupplierDrawer = supplierJs.slice(openSupplierModalStart, openSupplierInfoStart);

assertNotIncludes(addSupplierDrawer, '供应商信息', 'add supplier drawer should not show supplier info section title');
assertNotIncludes(addSupplierDrawer, '供应商模型配置', 'add supplier drawer should not include model config section');
assertIncludes(supplierJs, 'type="radio"', 'supplier type should use radio controls');
assertIncludes(supplierJs, 'value="external"', 'external supplier type should be available');
assertIncludes(supplierJs, '<textarea', 'supplier description should use textarea');
assertIncludes(supplierJs, 'rows="3"', 'supplier description textarea should show at least three rows');

assertNotIncludes(supplierJs, 'API endpoint 中的模型名称', 'model config should remove endpoint model name field');
assertNotIncludes(supplierJs, '供应商模型配置', 'model drawer should not show supplier model config title');

[
  '上下文长度',
  '最大输入',
  '最大输出',
  '输入模态',
  '输出模态',
  '协议类型',
  'Claude协议',
  'OpenAI协议',
  '命中缓存输入单价',
  '5m写入缓存输入单价',
  '1h写入缓存输入单价',
  '显式命中缓存输入单价',
  '梯度计费',
  '折扣'
].forEach(text => assertIncludes(supplierJs, text, `model drawer should include ${text}`));

assertIncludes(supplierJs, "cacheWrite5mInputPrice", 'model billing should include 5m cache write input price field');
assertIncludes(supplierJs, "cacheWrite1hInputPrice", 'model billing should include 1h cache write input price field');
assertIncludes(supplierJs, "renderPriceConfig", 'model billing should render price config as a reusable group');
assertIncludes(supplierJs, "renderPriceItem", 'each price item should render its own discount controls');
assertIncludes(supplierJs, "togglePriceDiscount", 'each price item should support independent discount toggles');
assertIncludes(supplierJs, "basePriceConfig", 'non-gradient billing should store one base price config');
assertIncludes(supplierJs, "priceConfig", 'gradient billing tiers should store a full price config per tier');
assertNotIncludes(supplierJs, '计费单价', 'gradient tiers should no longer use a single tier price');
assertIncludes(supplierJs, '<select class="form-input" data-protocol-usage', 'protocol usage config should use select');
assertIncludes(supplierJs, 'renderUsageConfigOptions(protocolUsage', 'protocol usage select should use usage config options');
assertNotIncludes(supplierJs, 'data-field="usageConfigId"', 'supplier model drawer should not keep standalone usage config select');
assertIncludes(supplierJs, 'billing-switch-row', 'billing and gradient switches should share one row');
assertIncludes(supplierJs, 'price-item-row', 'price item controls should use a one-line layout');
assertNotIncludes(supplierJs, '费用折扣', 'discount label should use shorter copy');

['工具调用', '深度思考', '格式化输出'].forEach(text => {
  assertIncludes(supplierJs, text, `model capabilities should keep ${text}`);
});

['文本生成', '图像理解', '音频理解', '视频理解', '代码生成', '数学推理', '多语言', 'Agent'].forEach(text => {
  assertNotIncludes(supplierJs, `'${text}'`, `model capabilities should remove ${text}`);
});

console.log('supplier page requirement checks passed');
