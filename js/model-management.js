let currentPage = 1;
let pageSize = 10;
let editingModelId = null;

const SERVICE_TYPE_TEXT = { hybrid: '外部采购', local: '本地部署' };
const MM_STATUS_TEXT = { online: '已上线', testing: '未上线', deprecating: '即将下线', offline: '已下线' };
const MM_CAPABILITY_TAGS = ['工具调用', '深度思考', '结构化输出'];
const MM_MODALITY_OPTIONS = [
  { value: 'text', label: '文本' },
  { value: 'image', label: '图片' },
  { value: 'audio', label: '音频' },
  { value: 'video', label: '视频' }
];
const MOCK_OPERATORS = ['张三', '李四', '王五', '赵六'];
const MM_MODALITY_LABELS = { text: '文本', image: '图片', audio: '语音', video: '视频' };
const MM_PROTOCOL_LABELS = { claude: 'Claude协议', openai: 'OpenAI协议' };
const MM_PRICE_ITEMS = [
  { field: 'inputPrice', label: '输入单价' },
  { field: 'cacheHitInputPrice', label: '命中缓存输入单价' },
  { field: 'cacheWrite5mInputPrice', label: '5m写入缓存输入单价', legacyField: 'cacheWriteInputPrice' },
  { field: 'cacheWrite1hInputPrice', label: '1h写入缓存输入单价' },
  { field: 'explicitCacheHitInputPrice', label: '显式命中缓存输入单价' },
  { field: 'outputPrice', label: '输出单价' }
];

function initModelManagementPage() {
  initSidebar();
  renderModelTable();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderModelProviderOptions(selectedProvider) {
  const providers = getModelProviderOptions(getModels());
  const selected = selectedProvider || providers[0] || '';
  return ['<option value="">请选择模型提供方</option>'].concat(providers.map(provider => {
    const safeProvider = escapeHtml(provider);
    return '<option value="' + safeProvider + '"' + (provider === selected ? ' selected' : '') + '>' + safeProvider + '</option>';
  })).join('');
}

function getOperatorForModel(model) {
  // Use a deterministic "random" operator based on model ID
  let hash = 0;
  for (let i = 0; i < model.id.length; i++) {
    hash = ((hash << 5) - hash) + model.id.charCodeAt(i);
    hash |= 0;
  }
  return MOCK_OPERATORS[Math.abs(hash) % MOCK_OPERATORS.length];
}

function getFilteredModels() {
  let list = getModels();
  const name = document.getElementById('filterName').value.trim().toLowerCase();
  const type = document.getElementById('filterType').value;
  const status = document.getElementById('filterStatus').value;

  if (name) list = list.filter(m => m.name.toLowerCase().includes(name) || m.id.toLowerCase().includes(name));
  if (type) list = list.filter(m => m.serviceType === type);
  if (status) list = list.filter(m => m.status === status);

  return list;
}

function applyFilters() {
  currentPage = 1;
  renderModelTable();
}

function renderModelTable() {
  const filtered = getFilteredModels();
  const tbody = document.getElementById('modelTableBody');
  if (!tbody) return;

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  tbody.innerHTML = pageData.map(m => {
    const typeClass = m.serviceType || 'hybrid';
    const typeLabel = SERVICE_TYPE_TEXT[m.serviceType] || '外部采购';
    const statusClass = m.status || 'testing';
    const statusLabel = MM_STATUS_TEXT[m.status] || m.status;
    const operator = getOperatorForModel(m);

    let actionsHtml = '<span class="table-action-link" onclick="viewDetail(\'' + m.id + '\')">详情</span>';
    actionsHtml += '<span class="table-action-link" onclick="openEditDrawer(\'' + m.id + '\')">编辑</span>';

    if (m.status === 'testing') {
      actionsHtml += '<span class="table-action-link" onclick="showOnlineConfirm(\'' + m.id + '\')">上线</span>';
    } else if (m.status === 'online') {
      actionsHtml += '<span class="table-action-link" onclick="showOfflineConfig(\'' + m.id + '\')">发起下线</span>';
    } else if (m.status === 'deprecating') {
      actionsHtml += '<span class="table-action-link" onclick="confirmFinalOffline(\'' + m.id + '\')">完成下线</span>';
    }
    if (m.status === 'testing') {
      actionsHtml += '<span class="table-action-link table-action-link-del" onclick="showDeleteConfirm(\'' + m.id + '\')">删除</span>';
    } else {
      actionsHtml += '<span class="table-action-link table-action-link-disabled" title="当前状态不可删除">删除</span>';
    }

    return '<tr>' +
      '<td>' + escapeHtml(m.name) + '</td>' +
      '<td class="mono">' + escapeHtml(m.id) + '</td>' +
      '<td><span class="type-tag ' + typeClass + '">' + typeLabel + '</span></td>' +
      '<td><span class="status-tag ' + statusClass + '">' + statusLabel + '</span></td>' +
      '<td>' + formatModelCreatedAt(m) + '</td>' +
      '<td>' + operator + '</td>' +
      '<td class="action-col"><div class="table-actions">' + actionsHtml + '</div></td>' +
    '</tr>';
  }).join('');

  renderPagination(filtered.length);
}

function formatModelCreatedAt(model) {
  return formatDateTimeToSecond(model.createdAt || model.releasedDate || model.updatedAt);
}

function formatDateTimeToSecond(value) {
  if (!value) return '-';
  const date = new Date(String(value).includes('T') ? value : String(value).replace(/-/g, '/') + ' 00:00:00');
  if (Number.isNaN(date.getTime())) return String(value);
  const pad = n => String(n).padStart(2, '0');
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

function renderPagination(total) {
  const totalText = document.getElementById('paginationTotal');
  const pagesEl = document.getElementById('paginationPages');
  if (!totalText || !pagesEl) return;

  totalText.textContent = '共 ' + total + ' 条';
  const totalPages = Math.ceil(total / pageSize) || 1;

  let html = '';
  html += '<li class="' + (currentPage <= 1 ? 'disabled' : '') + '" onclick="goToPage(' + (currentPage - 1) + ')">‹</li>';

  const range = getPageRange(currentPage, totalPages);
  for (let i = range[0]; i <= range[1]; i++) {
    html += '<li class="' + (i === currentPage ? 'active' : '') + '" onclick="goToPage(' + i + ')">' + i + '</li>';
  }

  html += '<li class="' + (currentPage >= totalPages ? 'disabled' : '') + '" onclick="goToPage(' + (currentPage + 1) + ')">›</li>';
  pagesEl.innerHTML = html;
}

function getPageRange(current, total) {
  if (total <= 7) return [1, total];
  if (current <= 4) return [1, 7];
  if (current >= total - 3) return [total - 6, total];
  return [current - 3, current + 3];
}

function goToPage(page) {
  const totalPages = Math.ceil(getFilteredModels().length / pageSize) || 1;
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderModelTable();
}

/* ====== 查看详情 ====== */
function viewDetail(id) {
  window.location.href = 'detail.html?id=' + encodeURIComponent(id);
}

/* ====== 编辑抽屉 ====== */
function openEditDrawer(id) {
  const models = getModels();
  const model = models.find(m => m.id === id);
  if (!model) { showToast('模型不存在'); return; }

  editingModelId = id;
  renderModelFormContent(model, 'editDrawerBody', true);

  document.getElementById('editDrawerOverlay').classList.add('open');
  document.getElementById('editDrawer').classList.add('open');
}

function closeEditDrawer() {
  document.getElementById('editDrawerOverlay').classList.remove('open');
  document.getElementById('editDrawer').classList.remove('open');
  editingModelId = null;
}

function toggleEditCapability(el) {
  toggleCapability(null, el);
}

function saveEditForm() {
  if (!editingModelId) return;
  if (!validateModelForm(editingModelId)) return;
  const updateData = collectModelFormData(editingModelId);

  const success = updateModelInStorage(editingModelId, updateData);
  if (success) {
    showToast('模型已更新');
  } else {
    showToast('模型不存在，请刷新后重试');
    return;
  }

  closeEditDrawer();
  renderModelTable();
}

/* ====== 添加模型抽屉 ====== */
let selectedWorkspaces = [];
let selectedMarketplaceUsers = [];
let selectedMarketplaceDepts = [];

function openAddModelDrawer() {
  renderModelFormContent(null, 'addDrawerBody', false);
  document.getElementById('addDrawerOverlay').classList.add('open');
  document.getElementById('addDrawer').classList.add('open');
}

function closeAddModelDrawer() {
  document.getElementById('addDrawerOverlay').classList.remove('open');
  document.getElementById('addDrawer').classList.remove('open');
  selectedWorkspaces = [];
  selectedMarketplaceUsers = [];
  selectedMarketplaceDepts = [];
}

function renderAddModelDrawerContent() {
  renderModelFormContent(null, 'addDrawerBody', false);
}

function renderModelFormContent(model, bodyId, isEdit) {
  const body = document.getElementById(bodyId);
  const serviceType = model && model.serviceType === 'local' ? 'local' : 'hybrid';
  const nameParts = splitModelDisplayName(model ? model.name : '', serviceType);
  const supplierDeploy = normalizeSupplierDeploy(model);
  const modelSource = model && (model.modelSource || model.region || model.sourceRegion) === 'overseas' ? 'overseas' : 'domestic';
  const releasedDate = model && (model.releasedDate || model.publishDate) ? (model.releasedDate || model.publishDate) : '';
  const featuredModel = model && model.featuredModel === true ? 'true' : 'false';
  selectedWorkspaces = model && model.applicationVisibility ? [...model.applicationVisibility] : [];
  selectedMarketplaceUsers = model && model.marketplaceVisibility && model.marketplaceVisibility.users ? [...model.marketplaceVisibility.users] : [];
  selectedMarketplaceDepts = model && model.marketplaceVisibility && model.marketplaceVisibility.departments ? [...model.marketplaceVisibility.departments] : [];

  body.innerHTML = `
    <div class="form-section">
      <div class="form-section-title">服务来源</div>
      <div class="form-group">
        <label class="form-label">服务类型</label>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="serviceType" value="hybrid" ${serviceType === 'hybrid' ? 'checked' : ''} onchange="onServiceTypeChange()">
            外部采购
          </label>
          <label class="radio-option">
            <input type="radio" name="serviceType" value="local" ${serviceType === 'local' ? 'checked' : ''} onchange="onServiceTypeChange()">
            本地部署
          </label>
        </div>
      </div>
      <div>
        <div id="supplierGroupsContainer">
          ${(supplierDeploy.length ? supplierDeploy : [null]).map((item, idx) => renderSupplierGroup(item, idx)).join('')}
        </div>
        <button type="button" class="add-supplier-btn" onclick="addSupplierGroup()">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          添加供应商配置
        </button>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">基本信息</div>
      <div class="form-group">
        <label class="form-label">模型提供方 <span class="required">*</span></label>
        <select class="form-input form-select" style="appearance:auto" id="modelProvider">
          ${renderModelProviderOptions(model ? (model.modelProvider || model.author || '') : '')}
        </select>
        <div class="form-error" id="modelProviderError">请输入模型提供方</div>
      </div>
      <div class="form-group">
        <label class="form-label">模型名称 <span class="required">*</span></label>
        <div class="prefixed-input">
          <span class="input-prefix" id="modelNamePrefix">${nameParts.prefix}</span>
          <input type="text" class="form-input" id="modelNameSuffix" value="${escapeHtml(nameParts.suffix)}" placeholder="例如：my-custom-model" oninput="syncModelIdFromName()">
        </div>
        <div class="form-error" id="modelNameError">请输入模型名称</div>
      </div>
      <div class="form-group">
        <label class="form-label">模型 ID <span class="required">*</span></label>
        <input type="text" class="form-input" id="modelId" value="${escapeHtml(nameParts.prefix + nameParts.suffix)}" disabled style="background:var(--bg-surface);color:var(--text-tertiary)" placeholder="根据模型名称自动生成">
        <div class="form-error" id="modelIdError">请输入模型 ID</div>
        <div class="form-error" id="modelIdDuplicateError">模型 ID 已存在</div>
      </div>
      <div class="form-group">
        <label class="form-label">模型介绍 <span class="required">*</span></label>
        <textarea class="form-textarea" id="modelDescription" placeholder="描述模型的功能和特点">${model ? escapeHtml(model.description || '') : ''}</textarea>
        <div class="form-error" id="modelDescriptionError">请输入模型介绍</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">模型来源</label>
          <div class="radio-group">
            <label class="radio-option"><input type="radio" name="modelSource" value="domestic" ${modelSource === 'domestic' ? 'checked' : ''}>国内</label>
            <label class="radio-option"><input type="radio" name="modelSource" value="overseas" ${modelSource === 'overseas' ? 'checked' : ''}>海外</label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">模型发布时间</label>
          <div class="date-picker-field">
            <input type="date" class="form-input" id="modelReleaseDate" value="${escapeHtml(releasedDate)}" onclick="openNativeDatePicker(this)" onfocus="openNativeDatePicker(this)">
            <button type="button" class="date-picker-button" onclick="openNativeDatePicker(document.getElementById('modelReleaseDate'))">选择</button>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">应用精选模型</label>
        <div class="radio-group">
          <label class="radio-option"><input type="radio" name="featuredModel" value="true" ${featuredModel === 'true' ? 'checked' : ''}>是</label>
          <label class="radio-option"><input type="radio" name="featuredModel" value="false" ${featuredModel === 'false' ? 'checked' : ''}>否</label>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">输入模态</label>
          <div class="capability-grid" id="inputModalitiesGrid">
            ${renderModalitiesOptions(model ? model.inputModalities || [] : ['text'], 'inputModalities')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">输出模态</label>
          <div class="capability-grid" id="outputModalitiesGrid">
            ${renderModalitiesOptions(model ? model.outputTypes || model.outputModalities || [] : ['text'], 'outputModalities')}
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">能力标签 <span class="required">*</span></label>
        <div class="capability-grid" id="capabilityGrid">
          ${MM_CAPABILITY_TAGS.map(tag => {
            const checked = model && model.categories && model.categories.includes(tag);
            return `
            <label class="capability-check${checked ? ' checked' : ''}" onclick="toggleCapability(event, this)">
              <input type="checkbox" value="${tag}" ${checked ? 'checked' : ''}>
              ${tag}
            </label>`;
          }).join('')}
        </div>
        <div class="form-error" id="capabilityError">请至少选择一个能力标签</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">上下文长度（token）<span class="required">*</span></label>
          <input type="number" class="form-input" id="contextLength" value="${model && model.contextLength ? model.contextLength : ''}" placeholder="例如：131072">
          <div class="form-error" id="contextLengthError">请输入上下文长度</div>
        </div>
        <div class="form-group">
          <label class="form-label">最大输出长度（token）<span class="required">*</span></label>
          <input type="number" class="form-input" id="maxOutputLength" value="${model && model.maxOutputLength ? model.maxOutputLength : ''}" placeholder="例如：32768">
          <div class="form-error" id="maxOutputLengthError">请输入最大输出长度</div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">使用信息</div>
      ${renderUsageInfo(model)}
    </div>
  `;
}

function renderSupplierGroup(data, idx) {
  const suppliers = getSuppliers();
  const selectedSupplier = data ? data.supplierId : '';
  const selectedModelId = data ? data.supplierModelId : '';
  const supplier = suppliers.find(s => s.id === selectedSupplier);
  const supplierModels = getSupplierModels(selectedSupplier);
  const supplierModel = supplierModels.find(m => m.id === selectedModelId);

  return `<div class="supplier-group" data-group-index="${idx}">
    <div class="supplier-group-header">
      <span class="supplier-group-title">供应商配置 ${idx + 1}</span>
      <button type="button" class="supplier-group-remove" onclick="removeSupplierGroup(this)" ${idx === 0 ? 'style="display:none"' : ''}>✕</button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">供应商</label>
        <select class="form-input supplier-select" style="appearance:auto" onchange="onSupplierChange(this, ${idx})">
          <option value="">请选择供应商</option>
          ${suppliers.map(s => `<option value="${escapeHtml(s.id)}" ${s.id === selectedSupplier ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">模型 ID</label>
        <select class="form-input supplier-model-select" style="appearance:auto" id="supplierModelName_${idx}" onchange="onSupplierModelNameChange(this, ${idx})" ${selectedSupplier ? '' : 'disabled'}>
          <option value="">请选择模型</option>
          ${supplierModels.map(m => `<option value="${escapeHtml(m.id)}" ${m.id === selectedModelId ? 'selected' : ''}>${formatSupplierModelOption(m)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="billing-fields" id="supplierBillingFields_${idx}">
      ${renderSupplierModelBillingInfo(supplierModel, idx)}
    </div>
  </div>`;
}

function renderModalitiesOptions(selectedValues, field) {
  const selected = selectedValues || [];
  return MM_MODALITY_OPTIONS.map(option => {
    const checked = selected.includes(option.value);
    return `
      <label class="capability-check${checked ? ' checked' : ''}" onclick="toggleCapability(event, this)">
        <input type="checkbox" data-modality-field="${field}" value="${option.value}" ${checked ? 'checked' : ''}>
        ${option.label}
      </label>`;
  }).join('');
}

function formatSupplierModelOption(model) {
  const modelId = model.id || model.modelName || '';
  const provider = model.modelProvider ? ' / ' + model.modelProvider : '';
  const context = model.contextLength ? ' / ' + formatContextLength(model.contextLength) : '';
  return escapeHtml(modelId + provider + context);
}

function renderUsageInfo(model) {
  const ws = getWorkspaces();
  const streamSeparator = model && model.streamSeparator !== undefined ? model.streamSeparator : '\\n\\n';
  const workspaceTags = selectedWorkspaces.map(wsId => {
    const w = ws.find(x => x.id === wsId);
    return w ? `<span class="tag-item">${escapeHtml(w.name)}<span class="tag-remove" onclick="removeWorkspaceTag('${wsId}')">✕</span></span>` : '';
  }).join('');
  const marketplaceTags = renderMarketplaceSelectedTags();
  const visibilityHtml = isOnlineStatusForVisibility(model) ? `
      <div class="form-group">
        <label class="form-label">工作空间可见范围</label>
      <div class="tag-selector-wrap" onfocusout="handleTagSelectorBlur(event, 'workspaceDropdown')">
        <div class="tag-selector" id="workspaceSelector" onclick="document.getElementById('workspaceSearchInput').focus()">
          ${workspaceTags}
          <input type="text" class="tag-selector-input" id="workspaceSearchInput" placeholder="${selectedWorkspaces.length === 0 ? '搜索工作空间...' : ''}" oninput="filterWorkspaceOptions(this.value)" onfocus="showWorkspaceDropdown()">
        </div>
        <div class="tag-selector-dropdown" id="workspaceDropdown">
          ${ws.map(w => `<div class="tag-selector-option" onclick="selectWorkspace('${w.id}')">${escapeHtml(w.name)}</div>`).join('')}
        </div>
      </div>
    </div>
      <div class="form-group">
        <label class="form-label">模型广场可见范围</label>
      <div class="tag-selector-wrap" onfocusout="handleTagSelectorBlur(event, 'marketplaceDropdown')">
        <div class="tag-selector" id="marketplaceSelector" onclick="document.getElementById('marketplaceSearchInput').focus()">
          ${marketplaceTags}
          <input type="text" class="tag-selector-input" id="marketplaceSearchInput" placeholder="${selectedMarketplaceUsers.length === 0 && selectedMarketplaceDepts.length === 0 ? '搜索人员或部门...' : ''}" oninput="filterMarketplaceOptions(this.value)" onfocus="showMarketplaceDropdown()">
        </div>
        <div class="tag-selector-dropdown" id="marketplaceDropdown"></div>
      </div>
    </div>
  ` : '';
  return `
    ${visibilityHtml}
    ${model && model.hideStreamSeparator ? '' : `<div class="form-group">
      <label class="form-label">流式输出结果分隔符</label>
      <input type="text" class="form-input" id="streamSeparator" value="${escapeHtml(streamSeparator)}" placeholder="例如：\\n\\n">
    </div>`}
  `;
}

function isOnlineStatusForVisibility(model) {
  return !!model && model.status === 'online';
}

function renderMarketplaceSelectedTags() {
  let tags = '';
  selectedMarketplaceUsers.forEach(uId => {
    const u = MOCK_USERS.find(x => x.id === uId);
    if (u) tags += `<span class="tag-item">${escapeHtml(u.name)}<span class="tag-type">人员</span><span class="tag-remove" onclick="removeMarketplaceTag('user', '${uId}')">✕</span></span>`;
  });
  selectedMarketplaceDepts.forEach(dId => {
    const d = MOCK_DEPARTMENTS.find(x => x.id === dId);
    if (d) tags += `<span class="tag-item">${escapeHtml(d.name)}<span class="tag-type">部门</span><span class="tag-remove" onclick="removeMarketplaceTag('dept', '${dId}')">✕</span></span>`;
  });
  return tags;
}

function splitModelDisplayName(name, serviceType) {
  const prefix = serviceType === 'local' ? 'prem/' : 'vend/';
  if (!name) return { prefix: prefix, suffix: '' };
  if (name.indexOf('vend/') === 0) return { prefix: 'vend/', suffix: name.slice(6) };
  if (name.indexOf('prem/') === 0) return { prefix: 'prem/', suffix: name.slice(6) };
  return { prefix: prefix, suffix: name };
}

function normalizeSupplierDeploy(model) {
  if (!model) return [];
  if (Array.isArray(model.supplierDeploy) && model.supplierDeploy.length) return model.supplierDeploy;
  if (Array.isArray(model.externalDeploy) && model.externalDeploy.length) return model.externalDeploy;
  if (Array.isArray(model.localDeploy) && model.localDeploy.length) return model.localDeploy;
  if (model.localDeploy && !Array.isArray(model.localDeploy)) return [model.localDeploy];
  if (model.providers && model.providers.length) {
    return model.providers.map(provider => {
      const supplier = getSuppliers().find(s => s.name === provider.name);
      return supplier ? { supplierId: supplier.id, supplierName: supplier.name, supplierModelId: '', modelName: '' } : null;
    }).filter(Boolean);
  }
  return [];
}

function onServiceTypeChange() {
  const prefixEl = document.getElementById('modelNamePrefix');
  if (prefixEl) prefixEl.textContent = getSelectedServiceType() === 'local' ? 'prem/' : 'vend/';
  syncModelIdFromName();
}

function getSelectedServiceType() {
  const checked = document.querySelector('input[name="serviceType"]:checked');
  return checked ? checked.value : 'hybrid';
}

function getSelectedRadioValue(name, fallback) {
  const checked = document.querySelector('input[name="' + name + '"]:checked');
  return checked ? checked.value : fallback;
}

function openNativeDatePicker(input) {
  if (!input) return;
  input.focus();
  if (typeof input.showPicker === 'function') {
    try { input.showPicker(); } catch (e) {}
  }
}

function getComposedModelName() {
  const serviceType = getSelectedServiceType();
  const prefix = serviceType === 'local' ? 'prem/' : 'vend/';
  const suffix = document.getElementById('modelNameSuffix') ? document.getElementById('modelNameSuffix').value.trim() : '';
  return prefix + suffix;
}

function syncModelIdFromName() {
  const modelId = document.getElementById('modelId');
  if (modelId) modelId.value = getComposedModelName();
}

function addSupplierGroup() {
  const container = document.getElementById('supplierGroupsContainer');
  const nextIdx = container.querySelectorAll('.supplier-group').length;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderSupplierGroup(null, nextIdx);
  container.appendChild(wrapper.firstElementChild);
}

function removeSupplierGroup(btn) {
  const groups = document.querySelectorAll('#supplierGroupsContainer .supplier-group');
  if (groups.length <= 1) return;
  btn.closest('.supplier-group').remove();
}

function getSupplierModels(supplierId) {
  const supplier = getSuppliers().find(s => s.id === supplierId);
  if (!supplier) return [];
  return supplier.models || [];
}

function renderSupplierModelBillingInfo(model, idx) {
  if (!model) return '<div class="billing-empty">选择供应商模型后展示供应商模型信息</div>';
  const enabledText = model.billingEnabled ? '计费' : '免费';
  const basePriceConfig = getSupplierModelBasePriceConfig(model);
  const inputModalities = formatModelArray(model.inputModalities, MM_MODALITY_LABELS);
  const outputModalities = formatModelArray(model.outputModalities || model.outputTypes, MM_MODALITY_LABELS);
  const protocols = formatModelArray(model.protocols, MM_PROTOCOL_LABELS);
  const features = (model.features || []).join('、') || '无';
  const usageConfig = model.usageConfigId || model.usageConfig || '未配置';
  return `
    <button type="button" class="supplier-model-info-toggle" onclick="toggleSupplierModelInfo(this)">展开供应商模型详细信息</button>
    <div class="supplier-model-info-card supplier-model-info-detail" id="supplierModelInfo_${idx}" hidden>
      <div class="supplier-model-info-head">
        <div>
          <div class="supplier-model-info-title">${escapeHtml(model.id || model.modelName || '-')}</div>
          <div class="supplier-model-info-subtitle">模型提供方：${escapeHtml(model.modelProvider || inferModelProvider(model.modelName || model.id) || '-')}</div>
        </div>
        <span class="supplier-model-info-badge">${enabledText}</span>
      </div>
      <div class="supplier-model-info-grid">
        <div><span>上下文长度</span><strong>${model.contextLength || 0}</strong></div>
        <div><span>最大输入</span><strong>${model.maxInput || 0}</strong></div>
        <div><span>最大输出</span><strong>${model.maxOutput || model.maxOutputLength || 0}</strong></div>
        <div><span>TPM</span><strong>${model.tpm || 0}</strong></div>
        <div><span>QPS</span><strong>${model.qps || 0}</strong></div>
        <div><span>并发</span><strong>${model.concurrency || 0}</strong></div>
        <div><span>最大可用金额</span><strong>${formatMaxAvailableAmount(model.maxAvailableAmount)}</strong></div>
      </div>
      <div class="supplier-model-info-section">
        <div><span>输入模态</span><strong>${inputModalities}</strong></div>
        <div><span>输出模态</span><strong>${outputModalities}</strong></div>
        <div><span>模型能力 Feature</span><strong>${escapeHtml(features)}</strong></div>
        <div><span>协议类型</span><strong>${protocols}</strong></div>
        <div><span>用量配置</span><strong>${escapeHtml(usageConfig)}</strong></div>
      </div>
      <div class="supplier-model-price-grid">
        ${MM_PRICE_ITEMS.map(item => `
          <div>
            <span>${item.label}</span>
            <strong>${formatBillingPrice(getPriceAmount(basePriceConfig, item, model))}</strong>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleSupplierModelInfo(btn) {
  const fields = btn.closest('.billing-fields');
  const detail = fields ? fields.querySelector('.supplier-model-info-detail') : null;
  if (!detail) return;
  const nextHidden = !detail.hidden;
  detail.hidden = nextHidden;
  btn.textContent = nextHidden ? '展开供应商模型详细信息' : '收起供应商模型详细信息';
}

function formatBillingPrice(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n.toFixed(3) : '0.000';
}

function formatMaxAvailableAmount(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
}

function formatModelArray(values, labelMap) {
  return (values || []).map(value => labelMap[value] || value).join('、') || '无';
}

function getSupplierModelBasePriceConfig(model) {
  return model && model.basePriceConfig ? model.basePriceConfig : {};
}

function getPriceAmount(priceConfig, item, legacySource) {
  const priceItem = priceConfig[item.field];
  if (priceItem && typeof priceItem === 'object') return priceItem.amount;
  if (priceItem !== undefined) return priceItem;
  if (legacySource[item.field] !== undefined) return legacySource[item.field];
  if (item.legacyField && legacySource[item.legacyField] !== undefined) return legacySource[item.legacyField];
  if (item.field === 'inputPrice' && legacySource.cacheMissInputPrice !== undefined) return legacySource.cacheMissInputPrice;
  return 0;
}

function onSupplierChange(select, idx) {
  const modelSelect = document.getElementById('supplierModelName_' + idx);
  if (modelSelect) {
    const models = getSupplierModels(select.value);
    modelSelect.disabled = !select.value;
    modelSelect.innerHTML = '<option value="">请选择模型</option>' +
      models.map(m => '<option value="' + escapeHtml(m.id) + '">' + formatSupplierModelOption(m) + '</option>').join('');
  }
  updateSupplierBillingInfo(idx, null);
}

function onSupplierModelNameChange(select, idx) {
  const group = select.closest('.supplier-group');
  const supplierId = group ? group.querySelector('.supplier-select').value : '';
  const model = getSupplierModels(supplierId).find(m => m.id === select.value);
  updateSupplierBillingInfo(idx, model);
}

function updateSupplierBillingInfo(idx, model) {
  const fields = document.getElementById('supplierBillingFields_' + idx);
  if (fields) fields.innerHTML = renderSupplierModelBillingInfo(model, idx);
}

function toggleCapability(event, el) {
  if (event) event.preventDefault();
  const checkbox = el.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
  el.classList.toggle('checked');
}

function showWorkspaceDropdown() {
  const dd = document.getElementById('workspaceDropdown');
  if (dd) dd.classList.add('show');
}

function filterWorkspaceOptions(val) {
  const dd = document.getElementById('workspaceDropdown');
  if (!dd) return;
  const ws = getWorkspaces().filter(w => w.name.includes(val));
  dd.innerHTML = ws.map(w => `<div class="tag-selector-option" onclick="selectWorkspace('${w.id}')">${escapeHtml(w.name)}</div>`).join('');
  dd.classList.add('show');
}

function selectWorkspace(id) {
  const ws = getWorkspaces().find(w => w.id === id);
  if (!ws) return;
  if (!selectedWorkspaces.includes(id)) selectedWorkspaces.push(id);
  renderWorkspaceTags();
  const input = document.getElementById('workspaceSearchInput');
  if (input) input.value = '';
  const dd = document.getElementById('workspaceDropdown');
  if (dd) dd.classList.remove('show');
}

function removeWorkspaceTag(id) {
  selectedWorkspaces = selectedWorkspaces.filter(w => w !== id);
  renderWorkspaceTags();
}

function renderWorkspaceTags() {
  const selector = document.getElementById('workspaceSelector');
  if (!selector) return;
  const ws = getWorkspaces();
  const tags = selectedWorkspaces.map(id => {
    const w = ws.find(x => x.id === id);
    return w ? `<span class="tag-item">${escapeHtml(w.name)}<span class="tag-remove" onclick="removeWorkspaceTag('${id}')">✕</span></span>` : '';
  }).join('');
  const placeholder = selectedWorkspaces.length === 0 ? '搜索工作空间...' : '';
  selector.innerHTML = tags + `<input type="text" class="tag-selector-input" id="workspaceSearchInput" placeholder="${placeholder}" oninput="filterWorkspaceOptions(this.value)" onfocus="showWorkspaceDropdown()">`;
}

function showMarketplaceDropdown() {
  const dd = document.getElementById('marketplaceDropdown');
  if (dd) {
    dd.classList.add('show');
    filterMarketplaceOptions('');
  }
}

function filterMarketplaceOptions(val) {
  const dd = document.getElementById('marketplaceDropdown');
  if (!dd) return;
  const filteredUsers = MOCK_USERS.filter(u => u.name.includes(val));
  const filteredDepts = MOCK_DEPARTMENTS.filter(d => d.name.includes(val));
  let html = '';
  filteredUsers.forEach(u => {
    const already = selectedMarketplaceUsers.includes(u.id);
    html += `<div class="tag-selector-option" onclick="selectMarketplaceUser('${u.id}')" style="${already ? 'opacity:0.4' : ''}">${escapeHtml(u.name)}<span class="option-type">人员 · ${escapeHtml(u.department)}</span></div>`;
  });
  filteredDepts.forEach(d => {
    const already = selectedMarketplaceDepts.includes(d.id);
    html += `<div class="tag-selector-option" onclick="selectMarketplaceDept('${d.id}')" style="${already ? 'opacity:0.4' : ''}">${escapeHtml(d.name)}<span class="option-type">部门</span></div>`;
  });
  dd.innerHTML = html || '<div class="tag-selector-option" style="color:#999">无匹配结果</div>';
  dd.classList.add('show');
}

function selectMarketplaceUser(id) {
  if (!selectedMarketplaceUsers.includes(id)) selectedMarketplaceUsers.push(id);
  renderMarketplaceTagsInline();
  const input = document.getElementById('marketplaceSearchInput');
  if (input) input.value = '';
  const dd = document.getElementById('marketplaceDropdown');
  if (dd) dd.classList.remove('show');
}

function selectMarketplaceDept(id) {
  if (!selectedMarketplaceDepts.includes(id)) selectedMarketplaceDepts.push(id);
  renderMarketplaceTagsInline();
  const input = document.getElementById('marketplaceSearchInput');
  if (input) input.value = '';
  const dd = document.getElementById('marketplaceDropdown');
  if (dd) dd.classList.remove('show');
}

function removeMarketplaceTag(type, id) {
  if (type === 'user') {
    selectedMarketplaceUsers = selectedMarketplaceUsers.filter(u => u !== id);
  } else {
    selectedMarketplaceDepts = selectedMarketplaceDepts.filter(d => d !== id);
  }
  renderMarketplaceTagsInline();
}

function renderMarketplaceTagsInline() {
  const selector = document.getElementById('marketplaceSelector');
  if (!selector) return;
  const tags = renderMarketplaceSelectedTags();
  const placeholder = selectedMarketplaceUsers.length === 0 && selectedMarketplaceDepts.length === 0 ? '搜索人员或部门...' : '';
  selector.innerHTML = tags + `<input type="text" class="tag-selector-input" id="marketplaceSearchInput" placeholder="${placeholder}" oninput="filterMarketplaceOptions(this.value)" onfocus="showMarketplaceDropdown()">`;
}

function handleTagSelectorBlur(event, dropdownId) {
  const next = event.relatedTarget;
  if (next && event.currentTarget.contains(next)) return;
  setTimeout(() => {
    const wrap = event.currentTarget;
    if (wrap && wrap.contains(document.activeElement)) return;
    const dd = document.getElementById(dropdownId);
    if (dd) dd.classList.remove('show');
  }, 120);
}

function validateModelForm(editingId) {
  let valid = true;

  function validateField(id, errorId) {
    const el = document.getElementById(id);
    const err = document.getElementById(errorId);
    const val = el ? el.value.trim() : '';
    if (!val) {
      if (el) el.classList.add('error');
      if (err) err.classList.add('show');
      valid = false;
    } else {
      if (el) el.classList.remove('error');
      if (err) err.classList.remove('show');
    }
  }

  validateField('modelNameSuffix', 'modelNameError');
  validateField('modelProvider', 'modelProviderError');
  validateField('modelId', 'modelIdError');
  validateField('modelDescription', 'modelDescriptionError');
  validateField('contextLength', 'contextLengthError');
  validateField('maxOutputLength', 'maxOutputLengthError');

  const idVal = getComposedModelName();
  const exists = getModels().some(m => m.id === idVal && m.id !== editingId);
  const duplicateErr = document.getElementById('modelIdDuplicateError');
  if (idVal && exists) {
    document.getElementById('modelId').classList.add('error');
    duplicateErr.classList.add('show');
    valid = false;
  } else {
    duplicateErr.classList.remove('show');
  }

  const checkedCaps = document.querySelectorAll('#capabilityGrid input:checked');
  if (checkedCaps.length === 0) {
    document.getElementById('capabilityError').classList.add('show');
    valid = false;
  } else {
    document.getElementById('capabilityError').classList.remove('show');
  }

  return valid;
}

function collectModelFormData(forceId) {
  const existingModel = forceId ? getModels().find(m => m.id === forceId) : null;
  const serviceType = getSelectedServiceType();
  const isLocal = serviceType === 'local';
  const categories = Array.from(document.querySelectorAll('#capabilityGrid input:checked')).map(cb => cb.value);
  const inputModalities = Array.from(document.querySelectorAll('#inputModalitiesGrid input:checked')).map(cb => cb.value);
  const outputModalities = Array.from(document.querySelectorAll('#outputModalitiesGrid input:checked')).map(cb => cb.value);
  const supplierDeploy = collectSupplierDeployData();
  const primarySupplier = getPrimarySupplierName(supplierDeploy);
  const primarySupplierModel = getPrimarySupplierModelData(supplierDeploy);
  const modelProvider = document.getElementById('modelProvider').value.trim();
  const billing = getPrimaryBillingData(supplierDeploy);
  const modelNamePrefix = isLocal ? 'prem/' : 'vend/';
  const modelName = modelNamePrefix + document.getElementById('modelNameSuffix').value.trim();
  const nowDate = new Date().toISOString().split('T')[0];
  const releaseDate = document.getElementById('modelReleaseDate') ? document.getElementById('modelReleaseDate').value : '';
  const streamSeparatorEl = document.getElementById('streamSeparator');

  return {
    name: modelName,
    id: modelName,
    description: document.getElementById('modelDescription').value.trim(),
    categories: categories,
    contextLength: parseInt(document.getElementById('contextLength').value, 10) || 0,
    maxOutputLength: parseInt(document.getElementById('maxOutputLength').value, 10) || 0,
    source: isLocal ? 'local' : 'external',
    modelSource: getSelectedRadioValue('modelSource', 'domestic'),
    serviceType: serviceType,
    applicationVisibility: [...selectedWorkspaces],
    marketplaceVisibility: {
      users: [...selectedMarketplaceUsers],
      departments: [...selectedMarketplaceDepts],
    },
    streamSeparator: streamSeparatorEl ? streamSeparatorEl.value.trim() : '\\n\\n',
    author: modelProvider,
    modelProvider: modelProvider,
    icon: modelProvider.slice(0, 1) || 'M',
    iconColor: '#6366F1',
    outputTypes: outputModalities.length ? outputModalities : (primarySupplierModel.outputModalities || primarySupplierModel.outputTypes || ['text']),
    inputModalities: inputModalities.length ? inputModalities : (primarySupplierModel.inputModalities || ['text']),
    weeklyTokens: '0',
    parameters: '',
    architecture: '',
    releasedDate: releaseDate || nowDate,
    featuredModel: getSelectedRadioValue('featuredModel', 'false') === 'true',
    license: 'Proprietary',
    status: existingModel ? existingModel.status : 'testing',
    updatedAt: nowDate,
    externalSourcing: !isLocal,
    billingType: billing.enabled ? 'pay-per-use' : 'free',
    inputPrice: billing.cacheMissInputPrice || 0,
    cacheHitPrice: billing.cacheHitInputPrice || 0,
    cacheMissPrice: billing.cacheMissInputPrice || 0,
    cacheWritePrice: billing.cacheWriteInputPrice || 0,
    outputPrice: billing.outputPrice || 0,
    providers: primarySupplier ? [{ name: primarySupplier, status: 'online', latency: 0, throughput: 0, uptime: 99.9, errorRate: 0 }] : [],
    supplierDeploy: supplierDeploy,
    externalDeploy: isLocal ? [] : supplierDeploy,
    localDeploy: isLocal ? supplierDeploy : null,
    benchmarks: {},
    changelog: existingModel && existingModel.changelog ? existingModel.changelog : [],
    apps: existingModel && existingModel.apps ? existingModel.apps : [],
  };
}

function collectSupplierDeployData() {
  const groups = document.querySelectorAll('#supplierGroupsContainer .supplier-group');
  return Array.from(groups).map(group => {
    const select = group.querySelector('.supplier-select');
    const modelSelect = group.querySelector('[id^="supplierModelName_"]');
    const supplierId = select ? select.value : '';
    const supplier = getSuppliers().find(s => s.id === supplierId);
    const supplierModelId = modelSelect ? modelSelect.value : '';
    const supplierModel = getSupplierModels(supplierId).find(m => m.id === supplierModelId);
    const result = {
      supplierId: supplierId,
      supplierName: supplier ? supplier.name : '',
      supplierModelId: supplierModelId,
      modelName: supplierModel ? supplierModel.modelName : '',
      modelProvider: supplierModel ? (supplierModel.modelProvider || inferModelProvider(supplierModel.modelName)) : '',
      billingEnabled: supplierModel ? !!supplierModel.billingEnabled : false,
    };
    if (supplierModel) {
      const basePriceConfig = getSupplierModelBasePriceConfig(supplierModel);
      const cacheHitInputPrice = getPriceAmount(basePriceConfig, { field: 'cacheHitInputPrice' }, supplierModel);
      const cacheMissInputPrice = supplierModel.cacheMissInputPrice !== undefined ? supplierModel.cacheMissInputPrice : getPriceAmount(basePriceConfig, { field: 'inputPrice' }, supplierModel);
      result.cacheHitInputPrice = parseFloat(cacheHitInputPrice) || 0;
      result.cacheMissInputPrice = parseFloat(cacheMissInputPrice) || 0;
      result.inputPrice = getPriceAmount(basePriceConfig, { field: 'inputPrice' }, supplierModel);
      result.outputPrice = getPriceAmount(basePriceConfig, { field: 'outputPrice' }, supplierModel);
      result.cacheWriteInputPrice = getPriceAmount(basePriceConfig, { field: 'cacheWrite5mInputPrice', legacyField: 'cacheWriteInputPrice' }, supplierModel);
      result.cacheWrite5mInputPrice = getPriceAmount(basePriceConfig, { field: 'cacheWrite5mInputPrice', legacyField: 'cacheWriteInputPrice' }, supplierModel);
      result.cacheWrite1hInputPrice = getPriceAmount(basePriceConfig, { field: 'cacheWrite1hInputPrice' }, supplierModel);
      result.explicitCacheHitInputPrice = getPriceAmount(basePriceConfig, { field: 'explicitCacheHitInputPrice' }, supplierModel);
      result.isDiscount = !!supplierModel.isDiscount;
      result.tpm = parseInt(supplierModel.tpm, 10) || 0;
      result.qps = parseInt(supplierModel.qps, 10) || 0;
      result.concurrency = parseInt(supplierModel.concurrency, 10) || 0;
      result.maxAvailableAmount = parseFloat(supplierModel.maxAvailableAmount) || 0;
      result.contextLength = parseInt(supplierModel.contextLength, 10) || 0;
      result.maxInput = parseInt(supplierModel.maxInput, 10) || 0;
      result.maxOutput = parseInt(supplierModel.maxOutput || supplierModel.maxOutputLength, 10) || 0;
      result.inputModalities = [...(supplierModel.inputModalities || [])];
      result.outputModalities = [...(supplierModel.outputModalities || supplierModel.outputTypes || [])];
      result.protocols = [...(supplierModel.protocols || [])];
      result.protocolUsage = { ...(supplierModel.protocolUsage || {}) };
      result.usageConfigId = supplierModel.usageConfigId || '';
      result.usageConfig = supplierModel.usageConfig || '';
      result.features = supplierModel.features || [];
      result.basePriceConfig = supplierModel.basePriceConfig || {};
      result.gradientBillingEnabled = !!supplierModel.gradientBillingEnabled;
      result.billingTiers = supplierModel.billingTiers ? [...supplierModel.billingTiers] : [];
    }
    return result;
  });
}

function getPrimarySupplierName(supplierDeploy) {
  const first = supplierDeploy.find(item => item.supplierName);
  return first ? first.supplierName : '';
}

function getPrimaryBillingData(supplierDeploy) {
  const item = supplierDeploy.find(group => group.supplierModelId);
  return item ? {
    enabled: !!item.billingEnabled,
    cacheHitInputPrice: item.cacheHitInputPrice || 0,
    cacheMissInputPrice: item.cacheMissInputPrice || 0,
    outputPrice: item.outputPrice || 0,
    cacheWriteInputPrice: item.cacheWriteInputPrice || 0,
    cacheWrite5mInputPrice: item.cacheWrite5mInputPrice || 0,
    cacheWrite1hInputPrice: item.cacheWrite1hInputPrice || 0,
    explicitCacheHitInputPrice: item.explicitCacheHitInputPrice || 0,
  } : { enabled: false };
}

function getPrimarySupplierModelData(supplierDeploy) {
  return supplierDeploy.find(group => group.supplierModelId) || {};
}

function getPrimaryModelProvider(supplierDeploy) {
  const item = getPrimarySupplierModelData(supplierDeploy);
  return item.modelProvider || inferModelProvider(item.modelName);
}

function inferModelProvider(modelName) {
  const name = String(modelName || '').toLowerCase();
  if (name.includes('qwen')) return '通义';
  if (name.includes('deepseek')) return 'DeepSeek';
  if (name.includes('doubao')) return 'Doubao';
  if (name.includes('gpt') || name.includes('openai') || name.includes('o3')) return 'OpenAI';
  if (name.includes('claude')) return 'Anthropic';
  if (name.includes('gemini')) return 'Gemini';
  if (name.includes('glm') || name.includes('chatglm')) return '智谱';
  if (name.includes('llama')) return 'Meta';
  if (name.includes('mistral')) return 'Mistral';
  if (name.includes('minimax')) return 'MiniMax';
  return '';
}

function submitAddModelForm() {
  if (!validateModelForm()) return;
  saveModelToStorage(collectModelFormData());
  closeAddModelDrawer();
  renderModelTable();
  showToast('模型已添加');
}

/* ====== 上线确认 ====== */
function showOnlineConfirm(id) {
  const models = getModels();
  const model = models.find(m => m.id === id);
  if (!model) return;

  selectedWorkspaces = model.applicationVisibility ? [...model.applicationVisibility] : [];
  selectedMarketplaceUsers = model.marketplaceVisibility && model.marketplaceVisibility.users ? [...model.marketplaceVisibility.users] : [];
  selectedMarketplaceDepts = model.marketplaceVisibility && model.marketplaceVisibility.departments ? [...model.marketplaceVisibility.departments] : [];

  const mo = document.createElement('div');
  mo.className = 'mo';
  mo.id = 'onlineConfirmMo';
  mo.innerHTML =
    '<div class="md" style="width:560px">' +
      '<div class="md-h"><h3>上线模型</h3><button class="md-c" onclick="closeOnlineConfirm()">✕</button></div>' +
      '<div class="md-b">' +
        '<p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px">配置 <strong>' + escapeHtml(model.name) + '</strong> 的上线可见范围</p>' +
        renderUsageInfo({ status: 'online', streamSeparator: model.streamSeparator, hideStreamSeparator: true }) +
      '</div>' +
      '<div class="md-f md-f-split">' +
        '<div class="online-test-actions">' +
          '<button class="btn bc" onclick="runOnlineModelTest()">测试</button>' +
          '<span class="online-test-result" id="onlineTestResult">请先测试</span>' +
        '</div>' +
        '<div class="md-f-actions">' +
          '<button class="btn bc" onclick="closeOnlineConfirm()">取消</button>' +
          '<button class="btn bp" id="onlineConfirmBtn" onclick="confirmOnline(\'' + id + '\')" disabled>确认上线</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(mo);
  requestAnimationFrame(() => { mo.style.display = 'flex'; });
}

function runOnlineModelTest() {
  const passed = Math.random() >= 0.5;
  const result = document.getElementById('onlineTestResult');
  const confirmBtn = document.getElementById('onlineConfirmBtn');
  if (result) {
    result.textContent = passed ? '测试通过' : '测试不通过';
    result.className = 'online-test-result ' + (passed ? 'pass' : 'fail');
  }
  if (confirmBtn) confirmBtn.disabled = !passed;
}

function closeOnlineConfirm() {
  const mo = document.getElementById('onlineConfirmMo');
  if (mo) mo.remove();
  selectedWorkspaces = [];
  selectedMarketplaceUsers = [];
  selectedMarketplaceDepts = [];
}

function confirmOnline(id) {
  const models = getModels();
  const model = models.find(m => m.id === id);
  if (model) {
    model.status = 'online';
    model.applicationVisibility = [...selectedWorkspaces];
    model.marketplaceVisibility = {
      users: [...selectedMarketplaceUsers],
      departments: [...selectedMarketplaceDepts],
    };
    model.updatedAt = new Date().toISOString().split('T')[0];
    updateModelInStorage(id, model);
  }
  closeOnlineConfirm();
  renderModelTable();
  showToast('模型已上线，已发送上线通知');
}

/* ====== 下线配置 ====== */
function showOfflineConfig(id) {
  const models = getModels();
  const model = models.find(m => m.id === id);
  if (!model) return;

  const replacementOptions = models
    .filter(m => m.id !== id && m.status === 'online')
    .map(m => '<option value="' + m.id + '">' + escapeHtml(m.author) + ': ' + escapeHtml(m.name) + '</option>')
    .join('');

  const mo = document.createElement('div');
  mo.className = 'mo';
  mo.id = 'offlineConfigMo';
  mo.setAttribute('data-model-id', id);
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  const defaultOfflineDate = defaultDate.toISOString().split('T')[0];
  const usageUsers = getModelUsageUsers(model);
  const defaultMessage = generateOfflineNotifyMessage(model, defaultOfflineDate, '');
  mo.innerHTML =
    '<div class="md" style="width:760px">' +
      '<div class="md-h"><h3>下线模型</h3><button class="md-c" onclick="closeOfflineConfig()">✕</button></div>' +
      '<div class="md-b">' +
        '<p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px">确定模型<strong>' + escapeHtml(model.name) + '</strong>发起下线？</p>' +
        '<div class="dialog-field">' +
          '<label class="dialog-label">预计下线时间</label>' +
          '<input type="date" class="dialog-select dialog-date" id="offlineDate" value="' + defaultOfflineDate + '" onchange="updateOfflineNotifyMessage()">' +
        '</div>' +
        '<div class="dialog-field">' +
          '<label class="dialog-label">替代模型</label>' +
          '<select class="dialog-select" id="offlineReplacement" onchange="updateOfflineNotifyMessage()">' +
            '<option value="">不设置替代模型</option>' +
            replacementOptions +
          '</select>' +
        '</div>' +
        '<div class="dialog-field">' +
          '<label class="dialog-check">' +
            '<input type="checkbox" id="offlineNotify" checked onchange="toggleOfflineMessageField()" /> 将使用用户发起 BossHi 群聊' +
          '</label>' +
        '</div>' +
        '<div class="dialog-field" id="offlineMessageField">' +
          '<label class="dialog-label">消息内容</label>' +
          '<textarea class="dialog-select dialog-textarea" id="offlineNotifyMessage">' + escapeHtml(defaultMessage) + '</textarea>' +
        '</div>' +
        '<div class="dialog-field">' +
          '<h4 class="offline-usage-title">模型使用名单</h4>' +
          '<table class="mm-table offline-usage-table">' +
            '<thead><tr><th>使用类型</th><th>使用详情</th><th>负责人</th><th>最近一次使用时间</th></tr></thead>' +
            '<tbody>' + usageUsers.map(u => '<tr><td>' + escapeHtml(u.type) + '</td><td>' + escapeHtml(u.detail) + '</td><td>' + escapeHtml(u.owner) + '</td><td>' + escapeHtml(u.lastUsedAt) + '</td></tr>').join('') + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
      '<div class="md-f md-f-split">' +
        '<span></span>' +
        '<div class="md-f-actions">' +
          '<button class="btn bc" onclick="closeOfflineConfig()">取消</button>' +
          '<button class="btn bp" onclick="confirmOffline(\'' + id + '\')">确定下线</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(mo);
  requestAnimationFrame(() => { mo.style.display = 'flex'; });
}

function generateOfflineNotifyMessage(model, offlineDate, replacementId) {
  const models = getModels();
  const replacement = replacementId ? models.find(m => m.id === replacementId) : null;
  const replacementText = replacement ? '，替代模型为 ' + replacement.name : '，暂无替代模型';
  return '模型 ' + model.name + ' 计划于 ' + offlineDate + ' 下线' + replacementText + '。请相关使用方提前完成切换，如有问题请联系模型管理团队。';
}

function updateOfflineNotifyMessage() {
  const id = document.getElementById('offlineConfigMo')?.getAttribute('data-model-id');
  const model = getModels().find(m => m.id === id);
  const offlineDate = document.getElementById('offlineDate')?.value || '';
  const replacement = document.getElementById('offlineReplacement')?.value || '';
  const textarea = document.getElementById('offlineNotifyMessage');
  if (model && textarea) textarea.value = generateOfflineNotifyMessage(model, offlineDate, replacement);
}

function toggleOfflineMessageField() {
  const checked = document.getElementById('offlineNotify')?.checked;
  const field = document.getElementById('offlineMessageField');
  if (field) field.style.display = checked ? '' : 'none';
}

function closeOfflineConfig() {
  const mo = document.getElementById('offlineConfigMo');
  if (mo) mo.remove();
}

function getModelUsageUsers(model) {
  const usageDetails = [
    { type: '应用', detail: '默认空间 / 智能招聘助手' },
    { type: 'API Key', detail: '个人' },
    { type: '应用', detail: '招聘助手空间 / 面试官 Copilot' },
    { type: 'API Key', detail: '空间（招聘助手空间）' },
    { type: '应用', detail: '数据分析空间 / Offer 风险看板' }
  ];
  const seed = model.id.length;
  return MOCK_USERS.slice(0, 5).map((user, idx) => {
    const day = ((seed + idx * 3) % 27) + 1;
    return {
      owner: user.name,
      type: usageDetails[idx].type,
      detail: usageDetails[idx].detail,
      lastUsedAt: '2026-05-' + String(day).padStart(2, '0') + ' ' + String(10 + idx).padStart(2, '0') + ':30',
    };
  });
}

function confirmOffline(id) {
  const offlineDate = document.getElementById('offlineDate').value;
  const replacement = document.getElementById('offlineReplacement').value;
  const notify = document.getElementById('offlineNotify').checked;
  closeOfflineConfig();

  const models = getModels();
  const model = models.find(m => m.id === id);
  if (model) {
    model.status = 'deprecating';
    model.updatedAt = new Date().toISOString().split('T')[0];
    model.deprecatingInfo = {
      scheduledOfflineDate: offlineDate,
      replacementModel: replacement || '',
      replacementModelName: replacement ? (models.find(x => x.id === replacement)?.name || '') : '',
    };
    updateModelInStorage(id, model);
  }

  let msg = '模型 ' + id;
  msg += ' 计划于 ' + offlineDate + ' 下线';
  if (notify) msg += '，已发起使用用户群聊';
  if (replacement) {
    const m = models.find(x => x.id === replacement);
    msg += '，替代模型：' + (m ? m.name : replacement);
  }
  renderModelTable();
  showToast(msg);
}

/* ====== 确认最终下线（从即将下线到已下线） ====== */
function confirmFinalOffline(id) {
  showFinalOfflineConfirm(id);
}

function showFinalOfflineConfirm(id) {
  const models = getModels();
  const model = models.find(m => m.id === id);
  if (!model) return;

  const mo = document.createElement('div');
  mo.className = 'mo';
  mo.id = 'finalOfflineMo';
  mo.innerHTML =
    '<div class="md">' +
      '<div class="md-h"><h3>完成下线</h3><button class="md-c" onclick="closeFinalOfflineConfirm()">✕</button></div>' +
      '<div class="md-b">' +
        '<p style="font-size:14px;color:var(--text-secondary);margin:0">确认将模型 <strong>' + escapeHtml(model.name) + '</strong> 正式下线？下线后模型将不可使用。</p>' +
      '</div>' +
      '<div class="md-f">' +
        '<button class="btn bc" onclick="closeFinalOfflineConfirm()">取消</button>' +
        '<button class="btn bp" onclick="applyFinalOffline(\'' + id + '\')">完成下线</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(mo);
  requestAnimationFrame(() => { mo.style.display = 'flex'; });
}

function closeFinalOfflineConfirm() {
  const mo = document.getElementById('finalOfflineMo');
  if (mo) mo.remove();
}

function applyFinalOffline(id) {
  const models = getModels();
  const model = models.find(m => m.id === id);
  if (model) {
    model.status = 'offline';
    model.updatedAt = new Date().toISOString().split('T')[0];
    delete model.deprecatingInfo;
    updateModelInStorage(id, model);
  }
  closeFinalOfflineConfirm();
  renderModelTable();
  showToast('模型已正式下线，已通知相关用户');
}

/* ====== 删除模型 ====== */
function showDeleteConfirm(id) {
  const models = getModels();
  const model = models.find(m => m.id === id);
  if (!model) return;

  const mo = document.createElement('div');
  mo.className = 'mo';
  mo.id = 'deleteConfirmMo';
  mo.innerHTML =
    '<div class="md">' +
      '<div class="md-h"><h3>删除模型</h3><button class="md-c" onclick="closeDeleteConfirm()">✕</button></div>' +
      '<div class="md-b">' +
        '<p style="font-size:14px;color:var(--text-secondary);margin:0">确定要删除模型 <strong>' + escapeHtml(model.name) + '</strong> 吗？此操作不可撤销。</p>' +
      '</div>' +
      '<div class="md-f">' +
        '<button class="btn bc" onclick="closeDeleteConfirm()">取消</button>' +
        '<button class="btn btn-danger" onclick="applyDeleteModel(\'' + id + '\')">确认删除</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(mo);
  requestAnimationFrame(() => { mo.style.display = 'flex'; });
}

function closeDeleteConfirm() {
  const mo = document.getElementById('deleteConfirmMo');
  if (mo) mo.remove();
}

function applyDeleteModel(id) {
  const success = deleteModelFromStorage(id);
  closeDeleteConfirm();
  if (success) {
    showToast('模型已删除');
  } else {
    showToast('无法删除内置模型');
  }
  renderModelTable();
}

/* ====== Toast ====== */
function showToast(msg) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = 'padding:12px 20px;background:#1F2937;color:#fff;border-radius:8px;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:fadeIn 0.3s;max-width:400px;';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', initModelManagementPage);
