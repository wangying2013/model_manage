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
assertIncludes(modelManagementJs, '<label class="form-label">模型来源', 'basic info should include domestic/overseas model source');
assertIncludes(modelManagementJs, 'name="modelSource"', 'model source should use radio controls');
assertIncludes(modelManagementJs, 'value="domestic"', 'model source should support domestic option');
assertIncludes(modelManagementJs, 'value="overseas"', 'model source should support overseas option');
assertIncludes(modelManagementJs, '<label class="form-label">模型发布时间', 'basic info should include model release date');
assertIncludes(modelManagementJs, 'type="date"', 'model release date should use day picker');
assertIncludes(modelManagementJs, 'openNativeDatePicker(this)', 'model release date should actively open the native picker when clicked');
assertIncludes(modelManagementJs, 'function openNativeDatePicker', 'date picker open helper should exist');
assertIncludes(modelManagementHtml, '.date-picker-field', 'date picker should have explicit clickable affordance styling');
assertIncludes(modelManagementJs, '<label class="form-label">应用精选模型', 'basic info should include featured model flag');
assertIncludes(modelManagementJs, 'name="featuredModel"', 'featured model should use radio controls');
assertIncludes(modelManagementJs, 'value="false"', 'featured model should default/support no option');
assertIncludes(modelManagementHtml, '<th>服务类型</th>', 'model management list should show service type column');
assertNotIncludes(modelManagementHtml, '<th>模型类型</th>', 'model management list should not show old model type column');
assertIncludes(modelManagementHtml, '<th>创建时间</th>', 'model management list should show created time column');
assertNotIncludes(modelManagementHtml, '<th>更新时间</th>', 'model management list should not show updated time column');
assertIncludes(modelManagementJs, 'formatModelCreatedAt', 'model management list should format created time');
assertIncludes(modelManagementJs, 'formatDateTimeToSecond', 'model management list time should show seconds');
assertIncludes(modelManagementHtml, '.mm-table-scroll', 'model management table should support horizontal scrolling');
assertIncludes(modelManagementHtml, 'position: sticky', 'model management action column should be sticky');
assertIncludes(modelManagementHtml, '.mm-table th.action-col', 'model management action header should be fixed');
assertIncludes(modelManagementHtml, '.mm-table td.action-col', 'model management action cells should be fixed');
assertIncludes(modelManagementJs, "const SERVICE_TYPE_TEXT = { hybrid: '外部采购', local: '本地部署' };", 'hybrid service type should display as external purchase');
assertNotIncludes(modelManagementJs, '混合服务', 'hybrid service type copy should be removed from model management logic');

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
assertIncludes(modelManagementJs, 'supplier-model-info-toggle', 'supplier model info should be collapsed behind a toggle button');
assertIncludes(modelManagementJs, 'toggleSupplierModelInfo', 'supplier model info should expand on demand');
assertIncludes(modelManagementHtml, '.supplier-model-info-card', 'supplier model info card style should exist');
const supplierInfoStart = modelManagementJs.indexOf('function renderSupplierModelBillingInfo');
const supplierInfoEnd = modelManagementJs.indexOf('function formatBillingPrice', supplierInfoStart);
const supplierInfoBlock = modelManagementJs.slice(supplierInfoStart, supplierInfoEnd);
assertNotIncludes(supplierInfoBlock, 'disabled', 'supplier model info should not rely on disabled input styling');
assertNotIncludes(supplierInfoBlock, '<input', 'supplier model info should render as readable structured content');

assertIncludes(modelManagementJs, 'inputModalities:', 'collected model data should include input modalities from form');
assertIncludes(modelManagementJs, 'outputTypes:', 'collected model data should include output modalities from form');
assertIncludes(modelManagementJs, 'modelSource:', 'collected model data should include model source');
assertIncludes(modelManagementJs, 'releasedDate:', 'collected model data should include selected release date');
assertIncludes(modelManagementJs, 'featuredModel:', 'collected model data should include featured model flag');
assertIncludes(modelManagementJs, 'isOnlineStatusForVisibility', 'visibility fields should render only for online models');
assertIncludes(modelManagementJs, '工作空间可见范围', 'application visibility should be renamed to workspace visibility');
assertNotIncludes(modelManagementJs, '应用可见范围', 'old application visibility label should be removed from model form');
assertNotIncludes(modelManagementJs, 'form-section-title">其他信息', 'other info section should be removed');
assertIncludes(modelManagementJs, 'renderUsageInfo(model)', 'stream separator should be merged into usage info section');
assertIncludes(modelManagementJs, 'renderUsageInfo({ status: \'online\', streamSeparator: model.streamSeparator, hideStreamSeparator: true })', 'online dialog should hide stream separator');
assertIncludes(modelManagementJs, 'runOnlineModelTest', 'online dialog should provide a test action');
assertIncludes(modelManagementJs, 'onlineTestResult', 'online dialog should display test result');
assertIncludes(modelManagementJs, 'onlineConfirmBtn', 'online confirm button should be gated by test result');
assertIncludes(modelManagementJs, 'disabled', 'online confirm button should be disabled before successful test');
assertIncludes(modelManagementJs, '测试通过', 'online test should support pass result');
assertIncludes(modelManagementJs, '测试不通过', 'online test should support fail result');
assertIncludes(modelManagementHtml, '.online-test-result', 'online test result should have styling');

console.log('model management form requirement checks passed');
