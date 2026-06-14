const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const modelsJs = fs.readFileSync(path.join(root, 'js', 'models.js'), 'utf8');
const detailJs = fs.readFileSync(path.join(root, 'js', 'detail.js'), 'utf8');
const modelManagementJs = fs.readFileSync(path.join(root, 'js', 'model-management.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(root, 'js', 'data.js'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

assertIncludes(modelsJs, 'getModelProviderOptions', 'marketplace provider filters should be derived from model data');
assertNotIncludes(modelsJs, "const providers = ['OpenAI'", 'marketplace provider filters should not use a stale hardcoded provider list');
assertIncludes(modelsJs, 'getModelProvider(m)', 'marketplace provider filters should still use the normalized provider value');
assertNotIncludes(modelsJs, 'm.providers.map', 'marketplace provider filters should not use service supplier names');
assertIncludes(modelsJs, '模型来源', 'model cards should render model source instead of provider');
assertNotIncludes(modelsJs, '<span class="meta-label">提供方</span>', 'model cards should not render provider meta item');
assertIncludes(detailJs, 'getModelSource(m)', 'model detail stats should render domestic/overseas model source');

const allowedModelProviders = ['智谱', '通义', '深度思索', '月之暗面', 'MiniMax', 'Anthropic', 'Gemini', 'OpenAI'];
const providerPattern = /\b(?:author|modelProvider):\s*"([^"]+)"/g;
const modelProviderValues = [...dataJs.matchAll(providerPattern)].map(match => match[1]);
assert(modelProviderValues.length > 0, 'mock data should include model provider values');
modelProviderValues.forEach(provider => {
  assert(
    allowedModelProviders.includes(provider),
    `mock model provider should be limited to allowed set, found ${provider}`
  );
});
['Muses Cloud', 'AliCloud', 'Volcengine', 'DeepSeek API', 'OpenAI Proxy', 'Zhipu API', '本地部署'].forEach(supplierName => {
  assert(
    !modelProviderValues.includes(supplierName),
    `service supplier ${supplierName} should not be used as model provider`
  );
});

[
  '模型 ID',
  '上下文长度',
  '最大输入',
  '最大输出',
  '输入模态',
  '输出模态',
  '模型能力 Feature',
  '协议类型',
  '用量配置',
  '输入单价',
  '命中缓存输入单价',
  '5m写入缓存输入单价',
  '1h写入缓存输入单价',
  '显式命中缓存输入单价',
  '输出单价'
].forEach(text => assertIncludes(modelManagementJs, text, `add model supplier selection should display supplier model field ${text}`));

[
  'contextLength',
  'maxInput',
  'maxOutput',
  'inputModalities',
  'outputModalities',
  'protocols',
  'usageConfigId',
  'basePriceConfig',
  'cacheWrite5mInputPrice',
  'cacheWrite1hInputPrice',
  'explicitCacheHitInputPrice'
].forEach(field => assertIncludes(modelManagementJs, field, `model management should carry supplier model field ${field}`));

[
  'vend/gpt-5',
  'vend/claude-4-sonnet',
  'vend/deepseek-r1-0528',
  'prem/qwen3-235b-a22b'
].forEach(modelId => assertIncludes(dataJs, `id: "${modelId}"`, `management and marketplace should share model ${modelId}`));

assertIncludes(dataJs, 'modelProvider', 'mock models should support an explicit model provider when author is not enough');

console.log('mock consistency requirement checks passed');
