let currentPage = 1;
const pageSize = 6;
let filteredModels = [...getModels()];
let scrollObserver = null;

let selectedFilters = {
  provider: [],
  serviceType: [],
  billing: [],
  context: [],
  capability: []
};

const CAPABILITY_TAGS = ['文本生成', '图像理解', '音频理解', '视频理解', '工具调用', '深度思考', '代码生成', '数学推理', '多语言', 'Agent'];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initModelsPage() {
  initSidebar();
  updateCompareButton();
  renderFilterPanel();
  bindEvents();
  applyFilters();
}

function renderFilterPanel() {
  const panel = document.getElementById('filterPanel');
  if (!panel) return;

  const providers = getModelProviderOptions(getModels());
  const categories = [...new Set(MODELS.flatMap(m => m.categories))].sort();

  const sections = [
    {
      id: 'provider',
      title: '模型提供方',
      items: providers.map(p => ({ value: p, label: p }))
    },
    {
      id: 'serviceType',
      title: '服务类型',
      items: [
        { value: 'hybrid', label: '混合服务' },
        { value: 'local', label: '本地部署' }
      ]
    },
    {
      id: 'billing',
      title: '服务成本',
      items: [
        { value: 'free', label: '免费' },
        { value: 'paid', label: '计费' }
      ]
    },
    {
      id: 'capability',
      title: '模型能力',
      items: categories.map(c => ({ value: c, label: c }))
    },
    {
      id: 'context',
      title: '上下文长度',
      items: [
        { value: 'under8k', label: '8k以下' },
        { value: '8k-16k', label: '8k-16k' },
        { value: '16-64k', label: '16-64k' },
        { value: '64-128k', label: '64k-128k' },
        { value: 'over128k', label: '128k以上' }
      ]
    }
  ];

  panel.innerHTML = '<div class="filter-panel-header">' +
    '<span class="filter-panel-title">模型筛选</span>' +
    '<button class="btn bc filter-reset" onclick="resetFilters()">重置筛选</button>' +
  '</div>' +
  sections.map(section => `
    <div class="filter-section" data-filter-id="${section.id}">
      <div class="filter-section-header" onclick="toggleFilterSection(this)">
        <span class="fs-title">${section.title}</span>
        <svg class="fs-arrow" width="16" height="16" viewBox="0 0 16 16" fill="#878F9B"><path d="M4 6l4 4 4-4" stroke="#878F9B" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="filter-section-body">
        ${section.items.map(item => `
          <label class="filter-checkbox">
            <input type="checkbox" value="${item.value}" data-filter="${section.id}" />
            ${item.label}
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleFilterSection(headerEl) {
  headerEl.classList.toggle('collapsed');
  const body = headerEl.nextElementSibling;
  if (body) body.classList.toggle('collapsed');
}

function resetFilters() {
  document.querySelectorAll('#filterPanel input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  Object.keys(selectedFilters).forEach(key => { selectedFilters[key] = []; });
  currentPage = 1;
  applyFilters();
}

function bindEvents() {
  document.getElementById('searchInput').addEventListener('input', debounce(function() {
    currentPage = 1;
    applyFilters();
  }, 300));

  document.getElementById('sortFilter').addEventListener('change', function() {
    currentPage = 1;
    applyFilters();
  });

  document.getElementById('compareBtn').addEventListener('click', goToCompare);

  document.getElementById('filterPanel').addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
      const filter = e.target.dataset.filter;
      const value = e.target.value;
      if (e.target.checked) {
        if (!selectedFilters[filter].includes(value)) selectedFilters[filter].push(value);
      } else {
        selectedFilters[filter] = selectedFilters[filter].filter(v => v !== value);
      }
      currentPage = 1;
      applyFilters();
    }
  });
}

function applyFilters() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const sort = document.getElementById('sortFilter').value;

  filteredModels = getModels().filter(m => {
    if (search && !m.name.toLowerCase().includes(search) && !m.id.toLowerCase().includes(search)) return false;

    if (selectedFilters.provider.length > 0 && !selectedFilters.provider.includes(getModelProvider(m))) return false;

    if (selectedFilters.serviceType.length > 0) {
      if (!selectedFilters.serviceType.includes(m.serviceType)) return false;
    }

    if (selectedFilters.billing.length > 0) {
      const matches = selectedFilters.billing.some(b =>
        (b === 'free' && m.billingType === 'free') || (b === 'paid' && m.billingType !== 'free')
      );
      if (!matches) return false;
    }

    if (selectedFilters.context.length > 0) {
      const cl = m.contextLength;
      const matches = selectedFilters.context.some(range => {
        if (range === 'under8k') return cl < 8192;
        if (range === '8k-16k') return cl >= 8192 && cl < 16384;
        if (range === '16-64k') return cl >= 16384 && cl < 65536;
        if (range === '64-128k') return cl >= 65536 && cl < 131072;
        if (range === 'over128k') return cl >= 131072;
        return false;
      });
      if (!matches) return false;
    }

    if (selectedFilters.capability.length > 0) {
      const matches = selectedFilters.capability.some(c => m.categories.includes(c));
      if (!matches) return false;
    }

    return true;
  });

  switch (sort) {
    case 'newest':
      filteredModels.sort((a, b) => new Date(b.releasedDate) - new Date(a.releasedDate));
      break;
    case 'price':
      filteredModels.sort((a, b) => (a.inputPrice + a.outputPrice) - (b.inputPrice + b.outputPrice));
      break;
    default:
      break;
  }

  renderModels();
}

function renderModels() {
  const total = filteredModels.length;
  const visibleCount = Math.min(currentPage * pageSize, total);
  const visibleModels = filteredModels.slice(0, visibleCount);

  document.getElementById('modelCount').textContent = '共 ' + total + ' 个模型';

  const grid = document.getElementById('modelGrid');
  if (visibleModels.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">未找到匹配的模型</div></div>';
    return;
  }

  grid.innerHTML = visibleModels.map(m => renderModelCard(m)).join('') +
    (visibleCount < total ? '<div id="scrollSentinel"></div>' : '');

  bindCardEvents();
  updateCompareButton();
  setupInfiniteScroll();
}

function setupInfiniteScroll() {
  const sentinel = document.getElementById('scrollSentinel');
  if (!sentinel) return;

  if (scrollObserver) scrollObserver.disconnect();
  scrollObserver = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      currentPage++;
      renderModels();
    }
  }, { rootMargin: '200px' });
  scrollObserver.observe(sentinel);
}

function renderModelCard(model) {
  const checked = isInCompare(model.id);
  const categoryTags = model.categories.map(c =>
    '<span class="tag ' + getCategoryTagClass(c) + '">' + c + '</span>'
  ).join('');
  const contextLabel = model.contextLength > 0 ? formatContextLength(model.contextLength) : 'N/A';

  const statusBadge = model.status !== 'online' ? renderStatusBadge(model.status) : '';

  let extraBadges = '';
  if (model.isHot) extraBadges += '<span class="card-badge card-badge-hot">热门</span>';
  if (model.isNew) extraBadges += '<span class="card-badge card-badge-new">上新</span>';

  const rightBadges = (statusBadge || extraBadges) ?
    '<div class="model-card-header-right">' + statusBadge + extraBadges + '</div>' : '';

  let actionHtml = '<button class="card-btn card-btn-primary auth-btn" data-id="' + model.id + '">申请授权</button>';
  if (model.status === 'deprecating' && model.deprecatingInfo) {
    actionHtml = '<div class="deprecation-card-note">' +
      '<div class="deprecation-note-row">' +
        '<span class="deprecation-note-label">预计下线</span>' +
        '<span class="deprecation-note-value">' + model.deprecatingInfo.scheduledOfflineDate + '</span>' +
      '</div>' +
      '<div class="deprecation-note-row">' +
        '<span class="deprecation-note-label">推荐替代</span>' +
        '<span class="deprecation-note-value" title="' + escapeHtml(model.deprecatingInfo.replacementModelName) + '">' + escapeHtml(model.deprecatingInfo.replacementModelName) + '</span>' +
      '</div>' +
    '</div>';
  }

  const serviceTypeLabel = model.serviceType === 'hybrid' ? '混合服务' : model.serviceType === 'local' ? '本地部署' : '';
  const modelSourceLabel = getModelSource(model);

  let priceTooltipItems = '<div class="tooltip-item">命中缓存单价：' + formatPrice(model.cacheHitPrice) + '</div>' +
    '<div class="tooltip-item">未命中缓存单价：' + formatPrice(model.cacheMissPrice) + '</div>';
  if (model.cacheWritePrice !== undefined) {
    priceTooltipItems += '<div class="tooltip-item">写入缓存单价：' + formatPrice(model.cacheWritePrice) + '</div>';
  }

  return '<div class="model-card card" data-id="' + model.id + '">' +
    '<div class="model-card-header">' +
      '<div class="model-card-header-left">' +
        '<div class="model-icon" style="background:' + model.iconColor + '">' + model.icon + '</div>' +
        '<div class="model-card-name-wrap">' +
          '<div class="model-card-name">' + model.name + '</div>' +
          '<div class="model-card-id-row">' +
            '<span class="model-id-text">模型 ID：' + model.id + '</span>' +
            '<span class="model-id-copy" data-id="' + model.id + '" title="复制模型 ID">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      rightBadges +
    '</div>' +
    '<div class="model-card-tags">' + categoryTags + '</div>' +
    '<div class="model-card-desc">' + model.description + '</div>' +
    '<div class="model-card-footer">' +
      '<div class="model-card-meta">' +
        '<div class="meta-item"><span class="meta-label">模型来源</span><span class="meta-value">' + modelSourceLabel + '</span></div>' +
        '<div class="meta-item"><span class="meta-label">服务类型</span><span class="meta-value">' + serviceTypeLabel + '</span></div>' +
        '<div class="meta-item"><span class="meta-label">上下文长度</span><span class="meta-value">' + contextLabel + '</span></div>' +
        '<div class="meta-item"><span class="meta-label">上线日期</span><span class="meta-value">' + model.releasedDate + '</span></div>' +
        '<div class="meta-item">' +
          '<span class="meta-label">' +
            '参考输入价格' +
            '<span class="price-info-wrap">' +
              '<svg class="price-info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' +
              '<div class="price-tooltip">' + priceTooltipItems + '</div>' +
            '</span>' +
          '</span>' +
          '<span class="meta-value">' + formatPrice(model.inputPrice) + '</span>' +
        '</div>' +
        '<div class="meta-item"><span class="meta-label">参考输出价格</span><span class="meta-value">' + formatPrice(model.outputPrice) + '</span></div>' +
      '</div>' +
      '<div class="model-card-actions">' +
        actionHtml +
      '</div>' +
    '</div>' +
  '</div>';
}

function bindCardEvents() {
  document.querySelectorAll('.model-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.card-btn')) return;
      const id = this.dataset.id;
      window.location.href = 'detail.html?id=' + encodeURIComponent(id);
    });
  });

  document.querySelectorAll('.auth-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = this.dataset.id;
      const model = MODELS.find(m => m.id === id);
      if (!model) return;
      alert('已提交授权申请，请等待模型提供方审核。\n模型：' + model.name);
    });
  });

  document.querySelectorAll('.model-id-copy').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = this.dataset.id;
      copyToClipboard(id);
    });
  });
}

document.addEventListener('DOMContentLoaded', initModelsPage);
