const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const modelManagementJs = fs.readFileSync(path.join(root, 'js', 'model-management.js'), 'utf8');
const modelManagementHtml = fs.readFileSync(path.join(root, 'model-management.html'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

assertIncludes(modelManagementJs, '服务来源', 'model source section should be renamed to service source');
assertNotIncludes(modelManagementJs, '模型来源', 'old model source label should be removed');
assertIncludes(modelManagementHtml, '<th>服务类型</th>', 'model management list should show service type column');
assertNotIncludes(modelManagementHtml, '<th>模型类型</th>', 'model management list should not show old model type column');

assertIncludes(modelManagementJs, '<label class="form-label">模型提供方', 'basic info should include model provider before model name');
assertIncludes(modelManagementJs, 'renderModelProviderOptions', 'model provider should render from shared provider options');
assertIncludes(modelManagementJs, '<select class="form-input form-select" style="appearance:auto" id="modelProvider"', 'model provider should reuse existing form dropdown styling');
assertNotIncludes(modelManagementJs, '<input type="text" class="form-input" id="modelProvider"', 'model provider should not be a free text input');
assertIncludes(modelManagementJs, 'getModelProviderOptions(getModels())', 'model provider options should match marketplace provider options');
assertIncludes(modelManagementJs, '<label class="form-label">输入模态', 'basic info should include input modality before capabilities');
assertIncludes(modelManagementJs, '<label class="form-label">输出模态', 'basic info should include output modality before capabilities');
assertIncludes(modelManagementJs, 'MM_MODALITY_OPTIONS', 'input and output modalities should use tag multi-select options');

assertIncludes(modelManagementJs, "const MM_CAPABILITY_TAGS = ['工具调用', '深度思考', '结构化输出'];", 'capabilities should only include requested tags');
['文本生成', '图像理解', '音频理解', '视频理解', '代码生成', '数学推理', '多语言', 'Agent'].forEach(text => {
  assertNotIncludes(modelManagementJs, `'${text}'`, `capabilities should not include ${text}`);
});

assertIncludes(modelManagementJs, '<label class="form-label">模型 ID</label>', 'supplier config should label supplier model as model ID');
assertIncludes(modelManagementJs, 'formatSupplierModelOption', 'supplier model select should show structured model info');
assertIncludes(modelManagementJs, 'supplier-model-info-card', 'supplier model info should use a readable structured display');
assertIncludes(modelManagementHtml, '.supplier-model-info-card', 'supplier model info card style should exist');
const supplierInfoStart = modelManagementJs.indexOf('function renderSupplierModelBillingInfo');
const supplierInfoEnd = modelManagementJs.indexOf('function formatBillingPrice', supplierInfoStart);
const supplierInfoBlock = modelManagementJs.slice(supplierInfoStart, supplierInfoEnd);
assertNotIncludes(supplierInfoBlock, 'disabled', 'supplier model info should not rely on disabled input styling');
assertNotIncludes(supplierInfoBlock, '<input', 'supplier model info should render as readable structured content');

assertIncludes(modelManagementJs, 'inputModalities:', 'collected model data should include input modalities from form');
assertIncludes(modelManagementJs, 'outputTypes:', 'collected model data should include output modalities from form');

console.log('model management form requirement checks passed');
