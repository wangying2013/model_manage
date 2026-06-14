const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const compareJs = fs.readFileSync(path.join(root, 'js', 'compare.js'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

const overviewIdx = compareJs.indexOf('card-section-title">概览');
const featuresIdx = compareJs.indexOf('card-section-title">模型特征');
const pricingIdx = compareJs.indexOf('card-section-title"><div class="vendor-row"><span>定价</span>');
const usageIdx = compareJs.indexOf('card-section-title">近 7 天调用次数');

assert(overviewIdx >= 0, 'compare card should include overview section');
assert(featuresIdx > overviewIdx, 'model features should follow overview');
assert(pricingIdx > featuresIdx, 'pricing should follow model features');
assert(usageIdx > pricingIdx, 'usage should follow pricing');

assertNotIncludes(compareJs, 'card-section-title">供应商', 'supplier should not be its own module');

[
  '输入单价',
  '命中缓存输入单价',
  '5m写入缓存输入单价',
  '1h写入缓存输入单价',
  '显式命中缓存输入单价',
  '输出单价'
].forEach(text => assertIncludes(compareJs, text, `pricing should include ${text}`));

assertIncludes(compareJs, 'getProviderPrice', 'pricing should read selected provider price with fallback');
assertIncludes(compareJs, 'cacheWrite5mInputPrice', 'pricing should support 5m cache write price');
assertIncludes(compareJs, 'cacheWrite1hInputPrice', 'pricing should support 1h cache write price');
assertIncludes(compareJs, 'explicitCacheHitInputPrice', 'pricing should support explicit cache hit price');

assertIncludes(compareJs, '模型能力', 'model features should include model capabilities');
assertIncludes(compareJs, 'model.categories || []', 'model capabilities should render from categories');
assertIncludes(compareJs, '近 7 天调用次数', 'usage title should be recent 7 day call count');
assertNotIncludes(compareJs, '使用情况（近7日）', 'old usage title should be removed');
assertNotIncludes(compareJs, '近 7 日使用趋势', 'old usage trend copy should be removed');

console.log('compare page requirement checks passed');
