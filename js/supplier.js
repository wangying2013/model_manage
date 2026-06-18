const CAPABILITY_TAGS = ['工具调用', '深度思考', '格式化输出'];
const MODALITY_OPTIONS = [
  { value: 'text', label: '文本' },
  { value: 'image', label: '图片' },
  { value: 'audio', label: '语音' },
  { value: 'video', label: '视频' }
];
const PROTOCOL_OPTIONS = [
  { value: 'claude', label: 'Claude协议' },
  { value: 'openai', label: 'OpenAI协议' }
];
const PRICE_ITEMS = [
  { field: 'inputPrice', label: '输入单价' },
  { field: 'outputPrice', label: '输出单价' },
  { field: 'cacheHitInputPrice', label: '命中缓存输入单价' },
  { field: 'explicitCacheHitInputPrice', label: '显式命中缓存输入单价' },
  { field: 'cacheWrite5mInputPrice', label: '5m写入缓存输入单价', legacyField: 'cacheWriteInputPrice' },
  { field: 'cacheWrite1hInputPrice', label: '1h写入缓存输入单价' }
];

let currentPage = 1;
let pageSize = 10;
let filterName = '';
let filterType = '';
let editingSupplierModels = [];

function initSupplierPage() {
  initSidebar();
  renderSuppliers();
}

function getSuppliers() {
  try {
    const stored = localStorage.getItem('muses_suppliers');
    if (stored) return JSON.parse(stored);
  } catch(e) {}
  return [...SUPPLIERS];
}

function saveSuppliers(suppliers) {
  localStorage.setItem('muses_suppliers', JSON.stringify(suppliers));
}

function getFilteredSuppliers() {
  let list = getSuppliers();
  if (filterName) list = list.filter(s => s.name.includes(filterName));
  if (filterType) list = list.filter(s => s.type === filterType);
  return list;
}

function applyFilters() {
  filterName = document.getElementById('filterName').value.trim();
  filterType = document.getElementById('filterType').value;
  currentPage = 1;
  renderSuppliers();
}

function renderSuppliers() {
  const allSuppliers = getSuppliers();
  const filtered = getFilteredSuppliers();
  const tbody = document.getElementById('supplierTableBody');
  if (!tbody) return;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  tbody.innerHTML = pageData.map(s => {
    const idx = allSuppliers.findIndex(item => item.id === s.id);
    const modelCount = s.models ? s.models.length : (s.modelCount || 0);
    return '<tr><td>' + escapeHtml(s.name || '') + '</td>' +
      '<td><span class="supplier-type-tag ' + s.type + '">' + (s.type === 'internal' ? '内部' : '外部') + '</span></td>' +
      '<td>' + escapeHtml(s.description || '-') + '</td>' +
      '<td>' + modelCount + '</td>' +
      '<td><div class="table-actions"><span class="table-action-link" onclick="openSupplierInfoDrawer(' + idx + ')">编辑信息</span><span class="table-action-link" onclick="openSupplierModelsDrawer(' + idx + ')">管理模型</span><span class="table-action-link table-action-link-del" onclick="deleteSupplier(' + idx + ')">删除</span></div></td></tr>';
  }).join('');
  renderPagination(filtered.length);
}

function renderPagination(total) {
  const totalText = document.getElementById('paginationTotal');
  const pagesEl = document.getElementById('paginationPages');
  if (!totalText || !pagesEl) return;
  totalText.textContent = '共 ' + total + ' 条';
  const totalPages = Math.ceil(total / pageSize) || 1;
  const range = getPageRange(currentPage, totalPages);
  let html = '<li class="ant-pagination-prev' + (currentPage <= 1 ? ' ant-pagination-disabled' : '') + '" onclick="goToPage(' + (currentPage - 1) + ')">‹</li>';
  for (let i = range[0]; i <= range[1]; i++) html += '<li class="' + (i === currentPage ? 'ant-pagination-item-active' : '') + '" onclick="goToPage(' + i + ')">' + i + '</li>';
  html += '<li class="ant-pagination-next' + (currentPage >= totalPages ? ' ant-pagination-disabled' : '') + '" onclick="goToPage(' + (currentPage + 1) + ')">›</li>';
  pagesEl.innerHTML = html;
}

function getPageRange(current, total) {
  if (total <= 7) return [1, total];
  if (current <= 4) return [1, 7];
  if (current >= total - 3) return [total - 6, total];
  return [current - 3, current + 3];
}

function goToPage(page) {
  const totalPages = Math.ceil(getFilteredSuppliers().length / pageSize) || 1;
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderSuppliers();
}

function changePageSize(size) {
  pageSize = parseInt(size);
  currentPage = 1;
  renderSuppliers();
}

function openSupplierModal(editIdx) {
  const suppliers = getSuppliers();
  const supplier = editIdx !== undefined ? suppliers[editIdx] : null;
  editingSupplierModels = supplier && supplier.models ? supplier.models.map(normalizeModel) : [];
  openDrawer(
    supplier ? '编辑供应商' : '添加供应商',
    renderSupplierInfoForm(supplier),
    '<button class="btn bc" onclick="closeSupplierModal()">取消</button><button class="btn bp" onclick="saveSupplierModal(' + (editIdx !== undefined ? editIdx : -1) + ')">' + (supplier ? '保存' : '添加') + '</button>'
  );
}

function openSupplierInfoDrawer(editIdx) {
  const supplier = getSuppliers()[editIdx];
  if (!supplier) { showToast('供应商不存在'); return; }
  openDrawer(
    '编辑供应商信息',
    renderSupplierInfoForm(supplier),
    '<button class="btn bc" onclick="closeSupplierModal()">取消</button><button class="btn bp" onclick="saveSupplierInfo(' + editIdx + ')">保存</button>'
  );
}

function openSupplierModelsDrawer(editIdx) {
  const supplier = getSuppliers()[editIdx];
  if (!supplier) { showToast('供应商不存在'); return; }
  editingSupplierModels = supplier.models ? supplier.models.map(normalizeModel) : [];
  openDrawer(
    '管理供应商模型',
    '<div id="supplierModelsContainer" class="supplier-models-container"></div><button type="button" class="btn bc supplier-add-model-btn" onclick="addSupplierModel()">+ 添加模型</button>',
    '<button class="btn bc" onclick="closeSupplierModal()">取消</button><button class="btn bp" onclick="saveSupplierModels(' + editIdx + ')">保存</button>'
  );
  renderSupplierModels();
}

function openDrawer(title, body, footer) {
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'supplierOverlay';
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.id = 'supplierDrawer';
  drawer.innerHTML = '<div class="drawer-header"><h3>' + title + '</h3><button class="drawer-close" onclick="closeSupplierModal()">✕</button></div><div class="drawer-body">' + body + '</div><div class="drawer-footer">' + footer + '</div>';
  overlay.appendChild(drawer);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSupplierModal(); });
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.classList.add('open');
    drawer.classList.add('open');
  });
}

function renderSupplierInfoForm(supplier) {
  const type = supplier && supplier.type === 'internal' ? 'internal' : 'external';
  return '<div class="form-group"><label class="form-label">供应商类型 <span class="required">*</span></label><div class="radio-card-group"><label class="radio-card"><input type="radio" name="supplierType" value="external"' + (type === 'external' ? ' checked' : '') + ' />外部</label><label class="radio-card"><input type="radio" name="supplierType" value="internal"' + (type === 'internal' ? ' checked' : '') + ' />内部</label></div></div>' +
    '<div class="form-group"><label class="form-label">供应商名称 <span class="required">*</span></label><input type="text" class="form-input" id="supplierName" value="' + escapeAttr(supplier ? supplier.name || '' : '') + '" placeholder="请输入供应商名称" /></div>' +
    '<div class="form-group"><label class="form-label">API Endpoint URL <span class="required">*</span></label><input type="text" class="form-input" id="supplierApiUrl" value="' + escapeAttr(supplier ? supplier.apiUrl || '' : '') + '" placeholder="https://api.example.com/v1" /></div>' +
    '<div class="form-group"><label class="form-label">API Key <span class="required">*</span></label><input type="text" class="form-input" id="supplierApiKey" value="' + escapeAttr(supplier ? supplier.apiKey || '' : '') + '" placeholder="sk-xxxx" /></div>' +
    '<div class="form-group"><label class="form-label">供应商描述 <span class="required">*</span></label><textarea class="form-input form-textarea" id="supplierDesc" rows="3" placeholder="请输入供应商描述">' + escapeHtml(supplier ? supplier.description || '' : '') + '</textarea></div>';
}

function closeSupplierModal() {
  const overlay = document.getElementById('supplierOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  const drawer = document.getElementById('supplierDrawer');
  if (drawer) drawer.classList.remove('open');
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 250);
}

function renderSupplierModels() {
  const container = document.getElementById('supplierModelsContainer');
  if (!container) return;
  container.innerHTML = editingSupplierModels.map((model, idx) => renderSupplierModelCard(model, idx)).join('');
}

function renderSupplierModelCard(model, idx) {
  const billingDisplay = model.billingEnabled ? '' : 'display:none;';
  const basePriceDisplay = model.gradientBillingEnabled ? 'display:none;' : '';
  const tierDisplay = model.gradientBillingEnabled ? '' : 'display:none;';
  const priceUnit = model.priceUnit || 'CNY';
  const priceUnitSuffix = priceUnit === 'USD' ? '$' : '￥';
  return '<div class="supplier-model-card" data-model-idx="' + idx + '">' +
    '<div class="supplier-model-card-header"><span class="supplier-model-card-title">模型 #' + (idx + 1) + '</span><button type="button" class="supplier-model-del-btn" onclick="removeSupplierModel(' + idx + ')">删除</button></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">模型 ID</label><input type="text" class="form-input" data-field="id" value="' + escapeAttr(model.id || '') + '" placeholder="例如：muses-cloud-qwen3" onchange="updateModelField(' + idx + ', \'id\', this.value)" /></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">TPM</label><input type="number" class="form-input" data-field="tpm" value="' + (model.tpm || 0) + '" onchange="updateModelField(' + idx + ', \'tpm\', parseInt(this.value) || 0)" /></div><div class="form-group"><label class="form-label">QPS</label><input type="number" class="form-input" data-field="qps" value="' + (model.qps || 0) + '" onchange="updateModelField(' + idx + ', \'qps\', parseInt(this.value) || 0)" /></div><div class="form-group"><label class="form-label">并发</label><input type="number" class="form-input" data-field="concurrency" value="' + (model.concurrency || 0) + '" onchange="updateModelField(' + idx + ', \'concurrency\', parseInt(this.value) || 0)" /></div><div class="form-group"><label class="form-label">最大可用金额</label><input type="number" class="form-input" data-field="maxAvailableAmount" value="' + (model.maxAvailableAmount || 0) + '" step="0.01" onchange="updateModelField(' + idx + ', \'maxAvailableAmount\', parseFloat(this.value) || 0)" /></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">上下文长度</label><input type="number" class="form-input" data-field="contextLength" value="' + (model.contextLength || 0) + '" onchange="updateModelField(' + idx + ', \'contextLength\', parseInt(this.value) || 0)" /></div><div class="form-group"><label class="form-label">最大输入</label><input type="number" class="form-input" data-field="maxInput" value="' + (model.maxInput || 0) + '" onchange="updateModelField(' + idx + ', \'maxInput\', parseInt(this.value) || 0)" /></div><div class="form-group"><label class="form-label">最大输出</label><input type="number" class="form-input" data-field="maxOutput" value="' + (model.maxOutput || model.maxOutputLength || 0) + '" onchange="updateModelField(' + idx + ', \'maxOutput\', parseInt(this.value) || 0)" /></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">输入模态</label><div class="capability-grid">' + renderOptionChecks(model.inputModalities || [], idx, 'inputModalities', MODALITY_OPTIONS) + '</div></div><div class="form-group"><label class="form-label">输出模态</label><div class="capability-grid">' + renderOptionChecks(model.outputModalities || model.outputTypes || [], idx, 'outputModalities', MODALITY_OPTIONS) + '</div></div></div>' +
    '<div class="form-group"><label class="form-label">模型能力 Feature</label><div class="capability-grid">' + renderCapabilityOptions(model, idx) + '</div></div>' +
    '<div class="form-group"><label class="form-label">协议类型</label><div class="capability-grid">' + renderProtocolOptions(model, idx) + '</div></div>' +
    '<div class="billing-controls-row"><div class="form-group" style="flex:0 0 auto"><label class="form-switch"><input type="checkbox"' + (model.billingEnabled ? ' checked' : '') + ' data-field="billingEnabled" onchange="toggleModelBilling(' + idx + ')" /><span class="switch-track"></span><span class="switch-label">是否计费</span></label></div><div class="supplier-model-billing-controls" style="' + billingDisplay + '"><div class="form-group" style="flex:0 0 auto"><label class="form-switch"><input type="checkbox"' + (model.gradientBillingEnabled ? ' checked' : '') + ' data-field="gradientBillingEnabled" onchange="toggleGradientBilling(' + idx + ')" /><span class="switch-track"></span><span class="switch-label">梯度计费</span></label></div><div class="form-group price-unit-field"><label class="form-label">单价单位</label><select class="form-input price-unit" data-field="priceUnit" onchange="updateModelPriceUnit(' + idx + ', this.value)"><option value="CNY"' + (priceUnit === 'CNY' ? ' selected' : '') + '>人民币</option><option value="USD"' + (priceUnit === 'USD' ? ' selected' : '') + '>美元</option></select></div></div></div>' +
    '<div class="supplier-model-billing-fields" style="' + billingDisplay + '"><div class="form-row model-discount-row"><div class="form-group"><label class="form-label">成本折扣系数</label><input type="number" class="form-input" data-field="costDiscountFactor" value="' + escapeAttr(model.costDiscountFactor ?? '') + '" step="0.01" placeholder="不配置则无" onchange="updateModelField(' + idx + ', \'costDiscountFactor\', parseOptionalFloat(this.value))" /></div><div class="form-group"><label class="form-label">用户折扣系数</label><input type="number" class="form-input" data-field="userDiscountFactor" value="' + escapeAttr(model.userDiscountFactor ?? '') + '" step="0.01" placeholder="不配置则无" onchange="updateModelField(' + idx + ', \'userDiscountFactor\', parseOptionalFloat(this.value))" /></div></div><div class="base-price-config" style="' + basePriceDisplay + '">' + renderPriceConfig(model.basePriceConfig, idx, 'base', undefined, priceUnitSuffix) + '</div><div class="supplier-model-tier-fields" style="' + tierDisplay + '"><div class="supplier-models-header" style="font-size:13px;margin-bottom:10px">Token 阶梯</div><div class="billing-tiers-container">' + renderBillingTiers(model, idx, priceUnitSuffix) + '</div><button type="button" class="btn bc supplier-add-model-btn" onclick="addBillingTier(' + idx + ')">+ 添加阶梯</button></div></div>' +
  '</div>';
}

function renderUsageConfigOptions(selectedId) {
  const configs = typeof getUsageConfigs === 'function' ? getUsageConfigs() : [];
  let html = '<option value="">请选择用量配置</option>';
  html += configs.map(config => '<option value="' + escapeAttr(config.id) + '"' + (config.id === selectedId ? ' selected' : '') + '>' + escapeHtml(config.name) + '</option>').join('');
  return html;
}

function renderCapabilityOptions(model, idx) {
  return CAPABILITY_TAGS.map(tag => {
    const checked = (model.features || []).includes(tag);
    return '<label class="capability-check' + (checked ? ' checked' : '') + '"><input type="checkbox" onchange="toggleCapabilityTag(this, ' + idx + ', \'' + tag + '\')"' + (checked ? ' checked' : '') + ' />' + tag + '</label>';
  }).join('');
}

function renderOptionChecks(selectedValues, modelIdx, field, options) {
  return options.map(option => {
    const checked = selectedValues.includes(option.value);
    return '<label class="capability-check' + (checked ? ' checked' : '') + '"><input type="checkbox" data-array-field="' + field + '" value="' + option.value + '" onchange="toggleModelArrayValue(this, ' + modelIdx + ', \'' + field + '\', \'' + option.value + '\')"' + (checked ? ' checked' : '') + ' />' + option.label + '</label>';
  }).join('');
}

function renderProtocolOptions(model, idx) {
  const protocols = model.protocols || [];
  const protocolUsage = model.protocolUsage || {};
  return PROTOCOL_OPTIONS.map(option => {
    const checked = protocols.includes(option.value);
    return '<div class="protocol-option' + (checked ? ' checked' : '') + '"><label class="protocol-option-label"><input type="checkbox" data-protocol="' + option.value + '" onchange="toggleProtocolType(this, ' + idx + ', \'' + option.value + '\')"' + (checked ? ' checked' : '') + ' />' + option.label + '</label><div class="protocol-usage"><select class="form-input" data-protocol-usage="' + option.value + '" onchange="updateProtocolUsage(' + idx + ', \'' + option.value + '\', this.value)">' + renderUsageConfigOptions(protocolUsage[option.value]) + '</select></div></div>';
  }).join('');
}

function renderPriceConfig(priceConfig, modelIdx, scope, tierIdx, unitSuffix) {
  const config = normalizePriceConfig(priceConfig);
  return '<div class="price-config price-grid" data-price-scope="' + scope + '"' + (tierIdx !== undefined ? ' data-tier-idx="' + tierIdx + '"' : '') + '>' + PRICE_ITEMS.map(item => renderPriceItem(config, modelIdx, scope, item, tierIdx, unitSuffix)).join('') + '</div>';
}

function renderPriceItem(priceConfig, modelIdx, scope, item, tierIdx, unitSuffix) {
  const priceItem = priceConfig[item.field] || createPriceItem();
  const updateArgs = tierIdx !== undefined ? modelIdx + ', \'' + scope + '\', \'' + item.field + '\', ' + tierIdx : modelIdx + ', \'' + scope + '\', \'' + item.field + '\'';
  return '<div class="price-item" data-price-field="' + item.field + '"><div class="price-item-row"><label class="form-label">' + item.label + '</label><div class="price-input-wrap"><input type="number" class="form-input" data-price-prop="amount" value="' + escapeAttr(priceItem.amount ?? '') + '" step="0.001" onchange="updatePriceItem(' + updateArgs + ', \'amount\', parseOptionalFloat(this.value))" /><span class="price-unit-suffix">' + unitSuffix + ' / Mtoken</span></div></div></div>';
}

function renderBillingTiers(model, idx, unitSuffix) {
  if (!model.billingTiers || !model.billingTiers.length) model.billingTiers = [createBillingTier()];
  return model.billingTiers.map((tier, tierIdx) => renderBillingTier(tier, idx, tierIdx, unitSuffix)).join('');
}

function renderBillingTier(tier, modelIdx, tierIdx, unitSuffix) {
  return '<div class="supplier-tier-card" data-tier-idx="' + tierIdx + '"><div class="supplier-tier-header"><span>阶梯 #' + (tierIdx + 1) + '</span><button type="button" class="supplier-tier-remove" onclick="removeBillingTier(' + modelIdx + ', ' + tierIdx + ')">删除</button></div><div class="form-row"><div class="form-group"><label class="form-label">起始 token</label><input type="number" class="form-input" data-tier-field="startToken" value="' + (tier.startToken || 0) + '" onchange="updateBillingTierField(' + modelIdx + ', ' + tierIdx + ', \'startToken\', parseInt(this.value) || 0)" /></div><div class="form-group"><label class="form-label">结束 token</label><input type="number" class="form-input" data-tier-field="endToken" value="' + (tier.endToken || 0) + '" onchange="updateBillingTierField(' + modelIdx + ', ' + tierIdx + ', \'endToken\', parseInt(this.value) || 0)" /></div></div>' + renderPriceConfig(tier.priceConfig, modelIdx, 'tier', tierIdx, unitSuffix) + '</div>';
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function updateModelField(idx, field, value) {
  if (editingSupplierModels[idx]) editingSupplierModels[idx][field] = value;
}

function toggleModelBilling(idx) {
  syncModelCardFields(idx);
  const model = editingSupplierModels[idx];
  const card = getModelCard(idx);
  const checkbox = card && card.querySelector('input[data-field="billingEnabled"]');
  if (!model || !checkbox) return;
  model.billingEnabled = checkbox.checked;
  const billingFields = card.querySelector('.supplier-model-billing-fields');
  if (billingFields) billingFields.style.display = checkbox.checked ? '' : 'none';
  const billingControls = card.querySelector('.supplier-model-billing-controls');
  if (billingControls) billingControls.style.display = checkbox.checked ? '' : 'none';
}

function toggleGradientBilling(idx) {
  syncModelCardFields(idx);
  const model = editingSupplierModels[idx];
  const card = getModelCard(idx);
  const checkbox = card && card.querySelector('input[data-field="gradientBillingEnabled"]');
  if (!model || !checkbox) return;
  model.gradientBillingEnabled = checkbox.checked;
  if (checkbox.checked && (!model.billingTiers || !model.billingTiers.length)) model.billingTiers = [createBillingTier()];
  renderSupplierModels();
}

function toggleModelArrayValue(checkbox, modelIdx, field, value) {
  const model = editingSupplierModels[modelIdx];
  if (!model) return;
  if (!model[field]) model[field] = [];
  toggleArrayValue(model[field], value, checkbox.checked);
  checkbox.parentNode.classList.toggle('checked', checkbox.checked);
}

function toggleProtocolType(checkbox, modelIdx, protocol) {
  const model = editingSupplierModels[modelIdx];
  if (!model) return;
  if (!model.protocols) model.protocols = [];
  if (!model.protocolUsage) model.protocolUsage = {};
  toggleArrayValue(model.protocols, protocol, checkbox.checked);
  if (!model.protocolUsage[protocol]) model.protocolUsage[protocol] = '';
  const option = checkbox.closest('.protocol-option');
  if (option) option.classList.toggle('checked', checkbox.checked);
}

function updateProtocolUsage(modelIdx, protocol, value) {
  const model = editingSupplierModels[modelIdx];
  if (!model) return;
  if (!model.protocolUsage) model.protocolUsage = {};
  model.protocolUsage[protocol] = value;
}

function createPriceItem(amount) {
  return { amount: amount ?? '' };
}

function createPriceConfig(source) {
  const config = {};
  PRICE_ITEMS.forEach(item => {
    const existing = source && source[item.field];
    if (existing && typeof existing === 'object') {
      config[item.field] = {
        amount: existing.amount ?? ''
      };
    } else {
      const amount = source ? source[item.field] ?? source[item.legacyField] : '';
      config[item.field] = createPriceItem(amount ?? '');
    }
  });
  return config;
}

function normalizePriceConfig(config, legacySource) {
  return createPriceConfig(config || legacySource || {});
}

function getPriceConfigTarget(modelIdx, scope, tierIdx) {
  const model = editingSupplierModels[modelIdx];
  if (!model) return null;
  if (scope === 'tier') {
    if (!model.billingTiers) model.billingTiers = [];
    if (!model.billingTiers[tierIdx]) model.billingTiers[tierIdx] = createBillingTier();
    if (!model.billingTiers[tierIdx].priceConfig) model.billingTiers[tierIdx].priceConfig = createPriceConfig(model.billingTiers[tierIdx]);
    return model.billingTiers[tierIdx].priceConfig;
  }
  if (!model.basePriceConfig) model.basePriceConfig = createPriceConfig(model);
  return model.basePriceConfig;
}

function updatePriceItem(modelIdx, scope, field, tierIdxOrProp, propOrValue, maybeValue) {
  const isTier = scope === 'tier';
  const tierIdx = isTier ? tierIdxOrProp : undefined;
  const prop = isTier ? propOrValue : tierIdxOrProp;
  const value = isTier ? maybeValue : propOrValue;
  const priceConfig = getPriceConfigTarget(modelIdx, scope, tierIdx);
  if (!priceConfig) return;
  if (!priceConfig[field]) priceConfig[field] = createPriceItem();
  priceConfig[field][prop] = value;
}

function toggleCapabilityTag(checkbox, modelIdx, tag) {
  const model = editingSupplierModels[modelIdx];
  if (!model) return;
  if (!model.features) model.features = [];
  toggleArrayValue(model.features, tag, checkbox.checked);
  checkbox.parentNode.classList.toggle('checked', checkbox.checked);
}

function createBillingTier() {
  return { startToken: 0, endToken: 0, priceConfig: createPriceConfig() };
}

function addBillingTier(modelIdx) {
  syncModelCardFields(modelIdx);
  const model = editingSupplierModels[modelIdx];
  if (!model) return;
  if (!model.billingTiers) model.billingTiers = [];
  model.billingTiers.push(createBillingTier());
  renderSupplierModels();
}

function removeBillingTier(modelIdx, tierIdx) {
  syncModelCardFields(modelIdx);
  const model = editingSupplierModels[modelIdx];
  if (!model || !model.billingTiers) return;
  model.billingTiers.splice(tierIdx, 1);
  if (!model.billingTiers.length) model.billingTiers.push(createBillingTier());
  renderSupplierModels();
}

function updateBillingTierField(modelIdx, tierIdx, field, value) {
  const model = editingSupplierModels[modelIdx];
  if (!model) return;
  if (!model.billingTiers) model.billingTiers = [];
  if (!model.billingTiers[tierIdx]) model.billingTiers[tierIdx] = createBillingTier();
  model.billingTiers[tierIdx][field] = value;
}

function syncModelCardFields(idx) {
  const card = getModelCard(idx);
  const model = editingSupplierModels[idx];
  if (!card || !model) return;
  ['id'].forEach(field => {
    const input = card.querySelector('input[data-field="' + field + '"]');
    if (input) model[field] = input.value;
  });
  ['tpm', 'qps', 'concurrency', 'contextLength', 'maxInput', 'maxOutput'].forEach(field => {
    const input = card.querySelector('input[data-field="' + field + '"]');
    if (input) model[field] = parseInt(input.value) || 0;
  });
  const maxAvailableAmount = card.querySelector('input[data-field="maxAvailableAmount"]');
  if (maxAvailableAmount) model.maxAvailableAmount = parseFloat(maxAvailableAmount.value) || 0;
  ['costDiscountFactor', 'userDiscountFactor'].forEach(field => {
    const input = card.querySelector('input[data-field="' + field + '"]');
    if (input) model[field] = parseOptionalFloat(input.value);
  });
  const priceUnit = card.querySelector('[data-field="priceUnit"]');
  if (priceUnit) model.priceUnit = priceUnit.value;
  const billingEnabled = card.querySelector('input[data-field="billingEnabled"]');
  const gradientBillingEnabled = card.querySelector('input[data-field="gradientBillingEnabled"]');
  if (billingEnabled) model.billingEnabled = billingEnabled.checked;
  if (gradientBillingEnabled) model.gradientBillingEnabled = gradientBillingEnabled.checked;
  const basePriceConfigEl = card.querySelector('.price-config[data-price-scope="base"]');
  if (basePriceConfigEl) model.basePriceConfig = readPriceConfigFromElement(basePriceConfigEl);
  model.inputModalities = Array.from(card.querySelectorAll('input[data-array-field="inputModalities"]:checked')).map(input => input.value);
  model.outputModalities = Array.from(card.querySelectorAll('input[data-array-field="outputModalities"]:checked')).map(input => input.value);
  model.features = Array.from(card.querySelectorAll('.capability-check input[type="checkbox"]:checked')).map(input => input.parentNode.textContent.trim()).filter(text => CAPABILITY_TAGS.includes(text));
  model.protocols = Array.from(card.querySelectorAll('input[data-protocol]:checked')).map(input => input.getAttribute('data-protocol'));
  if (!model.protocolUsage) model.protocolUsage = {};
  card.querySelectorAll('[data-protocol-usage]').forEach(input => {
    model.protocolUsage[input.getAttribute('data-protocol-usage')] = input.value;
  });
  model.billingTiers = Array.from(card.querySelectorAll('.supplier-tier-card')).map(tierEl => {
    const tier = createBillingTier();
    const start = tierEl.querySelector('input[data-tier-field="startToken"]');
    const end = tierEl.querySelector('input[data-tier-field="endToken"]');
    const tierPriceConfig = tierEl.querySelector('.price-config[data-price-scope="tier"]');
    if (start) tier.startToken = parseInt(start.value) || 0;
    if (end) tier.endToken = parseInt(end.value) || 0;
    if (tierPriceConfig) tier.priceConfig = readPriceConfigFromElement(tierPriceConfig);
    return tier;
  });
}

function readPriceConfigFromElement(priceConfigEl) {
  const config = {};
  PRICE_ITEMS.forEach(item => {
    const itemEl = priceConfigEl.querySelector('.price-item[data-price-field="' + item.field + '"]');
    const amount = itemEl && itemEl.querySelector('input[data-price-prop="amount"]');
    config[item.field] = {
      amount: parseOptionalFloat(amount ? amount.value : '')
    };
  });
  return config;
}

function syncAllModelCardFields() {
  editingSupplierModels.forEach((_, idx) => syncModelCardFields(idx));
}

function addSupplierModel() {
  editingSupplierModels.push(normalizeModel({}));
  renderSupplierModels();
}

function removeSupplierModel(idx) {
  editingSupplierModels.splice(idx, 1);
  renderSupplierModels();
}

function getSelectedSupplierType() {
  const checked = document.querySelector('input[name="supplierType"]:checked');
  return checked ? checked.value : 'external';
}

function saveSupplierModal(editIdx) {
  const supplierData = readSupplierInfoForm();
  if (!supplierData) return;
  syncAllModelCardFields();
  const suppliers = getSuppliers();
  const existingSupplier = editIdx >= 0 ? suppliers[editIdx] : null;
  const newSupplier = {
    id: existingSupplier ? existingSupplier.id : supplierData.name.toLowerCase().replace(/\s+/g, '-'),
    ...supplierData,
    modelName: 'auto',
    status: existingSupplier ? existingSupplier.status : 'active',
    models: [...editingSupplierModels],
    modelCount: editingSupplierModels.length
  };
  if (editIdx >= 0) suppliers[editIdx] = newSupplier;
  else suppliers.push(newSupplier);
  saveSuppliers(suppliers);
  closeSupplierModal();
  renderSuppliers();
  showToast(editIdx >= 0 ? '供应商已更新' : '供应商已添加');
}

function saveSupplierInfo(editIdx) {
  const supplierData = readSupplierInfoForm();
  if (!supplierData) return;
  const suppliers = getSuppliers();
  const supplier = suppliers[editIdx];
  if (!supplier) { showToast('供应商不存在'); return; }
  suppliers[editIdx] = { ...supplier, ...supplierData };
  saveSuppliers(suppliers);
  closeSupplierModal();
  renderSuppliers();
  showToast('供应商信息已更新');
}

function saveSupplierModels(editIdx) {
  syncAllModelCardFields();
  const suppliers = getSuppliers();
  const supplier = suppliers[editIdx];
  if (!supplier) { showToast('供应商不存在'); return; }
  suppliers[editIdx] = { ...supplier, models: [...editingSupplierModels], modelCount: editingSupplierModels.length };
  saveSuppliers(suppliers);
  closeSupplierModal();
  renderSuppliers();
  showToast('供应商模型已更新');
}

function readSupplierInfoForm() {
  const name = document.getElementById('supplierName').value.trim();
  if (!name) { showToast('请输入供应商名称'); return null; }
  const apiUrl = document.getElementById('supplierApiUrl').value.trim();
  if (!apiUrl) { showToast('请输入 API Endpoint URL'); return null; }
  const apiKey = document.getElementById('supplierApiKey').value.trim();
  if (!apiKey) { showToast('请输入 API Key'); return null; }
  const description = document.getElementById('supplierDesc').value.trim();
  if (!description) { showToast('请输入供应商描述'); return null; }
  return { name, type: getSelectedSupplierType(), apiUrl, apiKey, description };
}

function deleteSupplier(idx) {
  if (!confirm('确定要删除该供应商吗？')) return;
  const suppliers = getSuppliers();
  suppliers.splice(idx, 1);
  saveSuppliers(suppliers);
  const totalPages = Math.ceil(getFilteredSuppliers().length / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  renderSuppliers();
  showToast('供应商已删除');
}

function normalizeModel(model) {
  return {
    id: model.id || '',
    tpm: model.tpm || 0,
    qps: model.qps || 0,
    concurrency: model.concurrency || 0,
    contextLength: model.contextLength || 0,
    maxInput: model.maxInput || 0,
    maxOutput: model.maxOutput || model.maxOutputLength || 0,
    maxAvailableAmount: parseFloat(model.maxAvailableAmount) || 0,
    inputModalities: [...(model.inputModalities || [])],
    outputModalities: [...(model.outputModalities || model.outputTypes || [])],
    features: (model.features || []).filter(tag => CAPABILITY_TAGS.includes(tag)),
    protocols: [...(model.protocols || [])],
    protocolUsage: { ...(model.protocolUsage || {}) },
    usageConfigId: model.usageConfigId || findUsageConfigIdByLegacyValue(model.usageConfig),
    billingEnabled: !!model.billingEnabled,
    priceUnit: model.priceUnit || findLegacyPriceUnit(model) || 'CNY',
    costDiscountFactor: model.costDiscountFactor ?? '',
    userDiscountFactor: model.userDiscountFactor ?? '',
    basePriceConfig: createPriceConfig(model.basePriceConfig || model),
    gradientBillingEnabled: !!model.gradientBillingEnabled,
    billingTiers: model.billingTiers && model.billingTiers.length ? model.billingTiers.map(tier => ({
      startToken: tier.startToken || 0,
      endToken: tier.endToken || 0,
      priceConfig: createPriceConfig(tier.priceConfig || tier)
    })) : [createBillingTier()]
  };
}

function findLegacyPriceUnit(model) {
  const sources = [model.basePriceConfig, model, ...(model.billingTiers || []).map(tier => tier.priceConfig || tier)];
  for (const source of sources) {
    if (!source) continue;
    for (const item of PRICE_ITEMS) {
      const value = source[item.field];
      if (value && typeof value === 'object' && value.unit) return value.unit;
      if (source[item.field + 'Unit']) return source[item.field + 'Unit'];
      if (item.legacyField && source[item.legacyField + 'Unit']) return source[item.legacyField + 'Unit'];
    }
  }
  return '';
}

function updateModelPriceUnit(idx, value) {
  syncModelCardFields(idx);
  updateModelField(idx, 'priceUnit', value);
  renderSupplierModels();
}

function parseOptionalFloat(value) {
  if (value === '') return '';
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : '';
}

function findUsageConfigIdByLegacyValue(value) {
  if (!value || typeof getUsageConfigs !== 'function') return '';
  const configs = getUsageConfigs();
  const matched = configs.find(config => config.id === value || config.name === value);
  return matched ? matched.id : '';
}

function toggleArrayValue(arr, value, shouldInclude) {
  const idx = arr.indexOf(value);
  if (shouldInclude && idx < 0) arr.push(value);
  if (!shouldInclude && idx >= 0) arr.splice(idx, 1);
}

function getModelCard(idx) {
  return document.querySelector('.supplier-model-card[data-model-idx="' + idx + '"]');
}

document.addEventListener('DOMContentLoaded', initSupplierPage);
