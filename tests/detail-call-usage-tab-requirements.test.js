const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const detailHtml = fs.readFileSync(path.join(root, 'detail.html'), 'utf8');
const detailJs = fs.readFileSync(path.join(root, 'js', 'detail.js'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

assertIncludes(detailHtml, 'data-tab="apps">调用情况', 'apps tab should be renamed to call usage');
assertNotIncludes(detailHtml, 'data-tab="apps">应用', 'old apps tab label should be removed');

assertNotIncludes(detailJs, '使用量 Top 5', 'call usage tab should remove usage top 5');
assertNotIncludes(detailJs, 'app-rank-list', 'call usage tab should not render app ranking list');
assertNotIncludes(detailJs, 'metric-tab', 'call usage charts should render without metric tabs');
assertNotIncludes(detailHtml, 'metric-tab', 'call usage styles should not keep metric tab styles');

[
  '调用次数',
  '调用成功率',
  'P90 延迟趋势',
  'TPS 吞吐趋势'
].forEach(text => assertIncludes(detailJs, text, `call usage chart should include ${text}`));

[
  'callCountChart',
  'successRateChart',
  'p90LatencyChart',
  'tpsThroughputChart'
].forEach(id => assertIncludes(detailJs, id, `call usage chart should render ${id}`));

assertIncludes(detailJs, 'apps-chart-grid', 'call usage charts should use grid layout');
assertIncludes(detailHtml, '.apps-chart-grid', 'call usage chart grid style should exist');
assertIncludes(detailJs, "'5/30'", 'call usage chart should use recent 7 day data');
assertIncludes(detailJs, "'6/5'", 'call usage chart should use recent 7 day data');

console.log('detail call usage tab requirement checks passed');
