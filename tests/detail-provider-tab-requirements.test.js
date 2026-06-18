const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const detailHtml = fs.readFileSync(path.join(root, 'detail.html'), 'utf8');
const detailJs = fs.readFileSync(path.join(root, 'js', 'detail.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(root, 'js', 'data.js'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

[
  '输入单价',
  '命中缓存输入单价',
  '5m写入缓存输入单价',
  '1h写入缓存输入单价',
  '显式命中缓存输入单价',
  '输出单价'
].forEach(text => assertIncludes(detailJs, text, `provider card should render ${text}`));
[
  '延迟p99',
  '吞吐量',
  '近一天调用错误率'
].forEach(text => assertNotIncludes(detailJs, text, `provider card should remove ${text}`));

assertIncludes(detailJs, "'异常'", 'provider status should render abnormal copy');
assertNotIncludes(detailJs, "'不可用'", 'provider status should not render unavailable copy');
assertNotIncludes(detailJs, 'latencyP99', 'provider card should not render p99 latency');
assertNotIncludes(detailJs, 'currentThroughput', 'provider card should not render throughput');
assertNotIncludes(detailJs, 'availableThroughput', 'provider card should not render available throughput');
assertNotIncludes(detailJs, 'oneDayErrorRate', 'provider card should not render one-day error rate');

assertIncludes(detailJs, 'provider-status-abnormal', 'provider abnormal status should use a dedicated class');
assertIncludes(detailHtml, '.provider-status-abnormal', 'provider abnormal status style should exist');
assertIncludes(dataJs, 'status: "abnormal"', 'mock data should include abnormal provider status');
assertIncludes(dataJs, 'latencyP99', 'mock data should include p99 latency');
assertIncludes(dataJs, 'oneDayErrorRate', 'mock data should include one-day error rate');
assertIncludes(dataJs, 'cacheWrite5mInputPrice', 'mock data should include 5m cache write price');
assertIncludes(dataJs, 'cacheWrite1hInputPrice', 'mock data should include 1h cache write price');
assertIncludes(dataJs, 'explicitCacheHitInputPrice', 'mock data should include explicit cache hit price');
assertIncludes(dataJs, 'currentThroughput', 'mock data should include current throughput');
assertIncludes(dataJs, 'availableThroughput', 'mock data should include available throughput');
assertIncludes(detailJs, 'stat-card-label">模型来源', 'detail stats should render model source label');
assertIncludes(detailJs, 'getModelSource(m)', 'detail stats should render domestic/overseas model source');
assertNotIncludes(detailJs, 'stat-card-label">模型提供方', 'detail stats should not render model provider label');
assertNotIncludes(detailJs, '近 7日调用量', 'detail stats should remove recent call volume');
assertIncludes(detailJs, 'stat-card-label">服务类型', 'detail stats should render service type');
assertIncludes(detailJs, 'getModelServiceType(m)', 'detail stats should use service type helper');
[
  'stat-card-label">服务类型',
  'stat-card-label">模型来源',
  'stat-card-label">输入模态',
  'stat-card-label">输出模态',
  'stat-card-label">上下文长度',
  'stat-card-label">发布日期'
].reduce((cursor, text) => {
  const idx = detailJs.indexOf(text);
  assert(idx > cursor, `detail stats should render ${text} in requested order`);
  return idx;
}, -1);

console.log('detail provider tab requirement checks passed');
