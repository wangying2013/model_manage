var compareModels = [];
var highlightEnabled = false;
var selectedProviders = {};

function initComparePage() {
  initSidebar();

  var idsParam = new URLSearchParams(window.location.search).get('ids');

  if (idsParam) {
    compareModels = idsParam.split(',').map(function(id) {
      return findModelById(decodeURIComponent(id));
    }).filter(Boolean);
  }

  if (compareModels.length < 2) {
    var stored = getCompareList();
    if (stored.length > 0) {
      compareModels = stored.map(function(id) {
        return findModelById(id);
      }).filter(Boolean);
    }
  }

  if (compareModels.length >= 2) {
    setCompareList(compareModels.map(function(m) { return m.id; }));
  }

  renderAll();
}

function findModelById(id) {
  var m = getModelById(id);
  if (m) return m;
  var all = getModels();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) return all[i];
  }
  return undefined;
}

function renderAll() {
  renderHeader();
  renderBody();
  bindEvents();
}

function renderHeader() {
  var el = document.getElementById('compareHeader');
  if (!el) return;

  var html = '';
  html += '<div class="compare-topbar">';
  html += '<div class="compare-topbar-left">';
  html += '<button class="compare-back-btn" id="compareBackBtn" aria-label="返回模型广场">←</button>';
  html += '<span class="compare-page-title">返回模型广场</span>';
  html += '</div>';
  html += '</div>';

  html += '<div class="compare-hero">';
  html += '<div class="compare-heading">';
  html += '<h1 class="page-title">模型对比</h1>';
  html += '<div class="compare-subtitle">横向查看模型能力、成本、供应商性能和近 7 天调用次数，快速筛出适合生产负载的模型组合。</div>';
  html += '</div>';

  if (compareModels.length >= 1) {
    html += renderCompareSummary();
  }
  html += '</div>';

  el.innerHTML = html;
}

function renderCompareSummary() {
  var providerTotal = 0;
  var contextBest = 0;
  for (var i = 0; i < compareModels.length; i++) {
    providerTotal += compareModels[i].providers.length;
    if (compareModels[i].contextLength > contextBest) {
      contextBest = compareModels[i].contextLength;
    }
  }
  var contextText = contextBest > 0 ? formatContextLength(contextBest) : 'N/A';
  var controlsHtml = '<div class="compare-control-bar">';
  if (compareModels.length >= 2) {
    controlsHtml += '<label class="form-switch">';
    controlsHtml += '<input type="checkbox" id="highlightToggle"' + (highlightEnabled ? ' checked' : '') + '>';
    controlsHtml += '<span class="switch-track"></span>';
    controlsHtml += '<span class="switch-label">高亮最优</span>';
    controlsHtml += '</label>';
  }
  controlsHtml += '<button class="btn bp" id="addModelBtn">添加模型</button>';
  controlsHtml += '</div>';

  return '<div class="compare-summary">' +
    '<div class="summary-pills">' +
    '<span class="summary-pill"><span class="summary-dot"></span>已选 ' + compareModels.length + ' / 4 个模型</span>' +
    '<span class="summary-pill">供应商共 ' + providerTotal + ' 个</span>' +
    '<span class="summary-pill">最大上下文 ' + contextText + '</span>' +
    (highlightEnabled ? '<span class="summary-pill">已开启最优值高亮</span>' : '') +
    '</div>' +
    controlsHtml +
  '</div>';
}

function renderBody() {
  var el = document.getElementById('compareSections');
  if (!el) return;

  if (compareModels.length === 0) {
    el.innerHTML =
      '<div class="compare-empty">' +
        '<div class="compare-empty-copy">' +
          '<div class="compare-empty-title">先选择两个模型，开始做并排评估</div>' +
          '<div class="compare-empty-desc">对比页会保留当前的模型选择、供应商切换和最优值高亮能力。你可以先从任意占位卡添加模型，再继续扩展到最多 4 个。</div>' +
        '</div>' +
        '<div class="compare-placeholders">' +
          renderPlaceholderCard('选择第一个模型', '添加基础参照模型') +
          renderPlaceholderCard('选择第二个模型', '添加候选模型进行并排比较') +
        '</div>' +
      '</div>';
    return;
  }

  if (compareModels.length === 1) {
    el.innerHTML =
      '<div class="compare-cards">' +
        renderCompareCard(compareModels[0], 0) +
        renderPlaceholderCard('继续添加模型', '至少两个模型才能开启完整对比') +
      '</div>';
    return;
  }

  var html = '<div class="compare-cards">';
  for (var i = 0; i < compareModels.length; i++) {
    html += renderCompareCard(compareModels[i], i);
  }
  html += '</div>';
  el.innerHTML = html;

  for (var j = 0; j < compareModels.length; j++) {
    (function(idx) {
      setTimeout(function() {
        initUsageChart(compareModels[idx], idx);
      }, 100);
    })(j);
  }
}

function renderPlaceholderCard(title, hint) {
  return '<div class="placeholder-card" role="button" tabindex="0" aria-label="' + title + '">' +
    '<div class="placeholder-icon">+</div>' +
    '<div class="placeholder-text">' + title + '</div>' +
    '<div class="placeholder-hint">' + hint + '</div>' +
  '</div>';
}

function renderCompareCard(model, index) {
  var iconChar = model.icon || model.name.charAt(0);
  var iconColor = model.iconColor || '#6366F1';
  var contextStr = model.contextLength > 0 ? formatContextLength(model.contextLength) : 'N/A';

  var providerName = selectedProviders[model.id];
  if (!providerName && model.providers.length > 0) {
    providerName = model.providers[0].name;
  }
  var selProvider = null;
  for (var p = 0; p < model.providers.length; p++) {
    if (model.providers[p].name === providerName) {
      selProvider = model.providers[p];
      break;
    }
  }
  if (!selProvider && model.providers.length > 0) {
    selProvider = model.providers[0];
  }
  var latency = selProvider ? selProvider.latency : 'N/A';
  var throughput = selProvider ? selProvider.throughput : 'N/A';

  var allModels = getModels();
  var selectOpts = '';
  for (var i = 0; i < allModels.length; i++) {
    var taken = false;
    for (var j = 0; j < compareModels.length; j++) {
      if (j !== index && compareModels[j] && compareModels[j].id === allModels[i].id) {
        taken = true;
        break;
      }
    }
    if (!taken) {
      selectOpts += '<option value="' + allModels[i].id + '"' +
        (allModels[i].id === model.id ? ' selected' : '') + '>' +
        allModels[i].name + '</option>';
    }
  }

  var provOpts = '';
  for (var k = 0; k < model.providers.length; k++) {
    provOpts += '<option value="' + model.providers[k].name + '"' +
      (model.providers[k].name === providerName ? ' selected' : '') + '>' +
      model.providers[k].name + '</option>';
  }

  var featLabels = { text: '文字', image: '图片', audio: '语音', video: '视频' };

  function featHtml(modalities, featList) {
    var h = '<span class="feature-list">';
    for (var f = 0; f < featList.length; f++) {
      var present = false;
      for (var m = 0; m < modalities.length; m++) {
        if (modalities[m] === featList[f]) { present = true; break; }
      }
      h += '<span class="feature-chip' + (present ? ' on' : '') + '">';
      h += featLabels[featList[f]] || featList[f];
      h += '</span>';
    }
    h += '</span>';
    return h;
  }

  function capabilityHtml(capabilities) {
    if (!capabilities || capabilities.length === 0) return '<span class="muted">暂无</span>';
    var h = '<span class="feature-list">';
    for (var c = 0; c < capabilities.length; c++) {
      h += '<span class="feature-chip on">' + capabilities[c] + '</span>';
    }
    h += '</span>';
    return h;
  }

  var providersCountVals = getModelValues('providersCount');
  var latencyVals = getModelValues('latency');
  var throughputVals = getModelValues('throughput');
  var inputPriceVals = getModelValues('inputPrice');
  var cacheHitVals = getModelValues('cacheHitInputPrice');
  var cacheWrite5mVals = getModelValues('cacheWrite5mInputPrice');
  var cacheWrite1hVals = getModelValues('cacheWrite1hInputPrice');
  var explicitCacheHitVals = getModelValues('explicitCacheHitInputPrice');
  var outputPriceVals = getModelValues('outputPrice');
  var contextVals = getModelValues('contextLength');

  var latencyVal = selProvider ? selProvider.latency : 0;
  var throughputVal = selProvider ? selProvider.throughput : 0;
  var inputPrice = getProviderPrice(model, selProvider, 'inputPrice');
  var cacheHitPrice = getProviderPrice(model, selProvider, 'cacheHitInputPrice');
  var cacheWrite5mPrice = getProviderPrice(model, selProvider, 'cacheWrite5mInputPrice');
  var cacheWrite1hPrice = getProviderPrice(model, selProvider, 'cacheWrite1hInputPrice');
  var explicitCacheHitPrice = getProviderPrice(model, selProvider, 'explicitCacheHitInputPrice');
  var outputPrice = getProviderPrice(model, selProvider, 'outputPrice');

  var html = '';
  html += '<div class="compare-card">';
  html += '<div class="card-topbar">';
  html += '<div class="model-icon" style="background:' + iconColor + '">' + iconChar + '</div>';
  html += '<div class="card-title-stack">';
  html += '<select class="card-model-select" data-idx="' + index + '" aria-label="切换对比模型">' + selectOpts + '</select>';
  html += '</div>';
  html += '<button class="compare-card-remove" data-idx="' + index + '" title="移除" aria-label="移除 ' + model.name + '">×</button>';
  html += '</div>';

  html += '<div class="card-section">';
  html += '<div class="card-section-title">概览</div>';
  html += '<div class="section-item"><span class="item-label">模型提供方</span><span class="item-value">' + getModelProvider(model) + '</span></div>';
  html += '<div class="section-item"><span class="item-label">上下文长度</span><span class="item-value bold' + hl(contextVals, model.contextLength, false) + '">' + contextStr + '</span></div>';
  html += '<div class="section-item"><span class="item-label">供应商数量</span><span class="item-value bold' + hl(providersCountVals, model.providers.length, false) + '">' + model.providers.length + '</span></div>';
  html += '</div>';

  html += '<div class="card-section">';
  html += '<div class="card-section-title">模型特征</div>';
  html += '<div class="section-item"><span class="item-label">输入支持</span><span class="item-value">' + featHtml(model.inputModalities || [], ['text', 'image', 'audio', 'video']) + '</span></div>';
  html += '<div class="section-item"><span class="item-label">输出支持</span><span class="item-value">' + featHtml(model.outputTypes || [], ['text', 'image', 'audio', 'video']) + '</span></div>';
  html += '<div class="section-item"><span class="item-label">模型能力</span><span class="item-value">' + capabilityHtml(model.categories || []) + '</span></div>';
  html += '</div>';

  html += '<div class="card-section">';
  html += '<div class="card-section-title"><div class="vendor-row"><span>定价</span><select class="provider-select" data-model="' + model.id + '" aria-label="切换供应商">' + provOpts + '</select></div></div>';
  html += '<div class="section-item"><span class="item-label">输入单价</span><span class="item-value bold' + hl(inputPriceVals, inputPrice, true) + '">' + formatPrice(inputPrice) + '/1M</span></div>';
  html += '<div class="section-item"><span class="item-label">命中缓存输入单价</span><span class="item-value bold' + hl(cacheHitVals, cacheHitPrice, true) + '">' + formatPrice(cacheHitPrice) + '/1M</span></div>';
  html += '<div class="section-item"><span class="item-label">5m写入缓存输入单价</span><span class="item-value bold' + hl(cacheWrite5mVals, cacheWrite5mPrice, true) + '">' + formatPrice(cacheWrite5mPrice) + '/1M</span></div>';
  html += '<div class="section-item"><span class="item-label">1h写入缓存输入单价</span><span class="item-value bold' + hl(cacheWrite1hVals, cacheWrite1hPrice, true) + '">' + formatPrice(cacheWrite1hPrice) + '/1M</span></div>';
  html += '<div class="section-item"><span class="item-label">显式命中缓存输入单价</span><span class="item-value bold' + hl(explicitCacheHitVals, explicitCacheHitPrice, true) + '">' + formatPrice(explicitCacheHitPrice) + '/1M</span></div>';
  html += '<div class="section-item"><span class="item-label">输出单价</span><span class="item-value bold' + hl(outputPriceVals, outputPrice, true) + '">' + formatPrice(outputPrice) + '/1M</span></div>';
  html += '<div class="section-item"><span class="item-label">延迟</span><span class="item-value bold' + hl(latencyVals, latencyVal, true) + '">' + latency + ' ms</span></div>';
  html += '<div class="section-item"><span class="item-label">吞吐量</span><span class="item-value bold' + hl(throughputVals, throughputVal, false) + '">' + throughput + ' req/s</span></div>';
  html += '</div>';

  html += '<div class="card-section" style="flex:1;min-height:0">';
  html += '<div class="card-section-title">近 7 天调用次数</div>';
  html += '<div class="usage-chart-wrap"><div id="usageChart_' + index + '" style="width:100%;height:100%"></div></div>';
  html += '</div>';

  html += '</div>';
  return html;
}

function initUsageChart(model, index) {
  if (!window.G2) return;
  var containerId = 'usageChart_' + index;
  var container = document.getElementById(containerId);
  if (!container) return;

  var data = generateSimpleTimeSeries(7, 50 + Math.random() * 100, 40);
  var chart = renderBarChart(containerId, data, 'date', 'value', null, {
    height: 150,
    legend: false,
    color: '#1C64F2'
  });
  if (chart) {
    chartInstances.push(chart);
  }
}

function getModelValues(field) {
  var vals = [];
  for (var i = 0; i < compareModels.length; i++) {
    var m = compareModels[i];
    if (field === 'providersCount') {
      vals.push(m.providers.length);
    } else if (
      field === 'latency' ||
      field === 'throughput' ||
      field === 'inputPrice' ||
      field === 'cacheHitInputPrice' ||
      field === 'cacheWrite5mInputPrice' ||
      field === 'cacheWrite1hInputPrice' ||
      field === 'explicitCacheHitInputPrice' ||
      field === 'outputPrice'
    ) {
      var pName = selectedProviders[m.id];
      if (!pName && m.providers.length > 0) {
        pName = m.providers[0].name;
      }
      var prov = null;
      for (var j = 0; j < m.providers.length; j++) {
        if (m.providers[j].name === pName) {
          prov = m.providers[j];
          break;
        }
      }
      if (field === 'latency' || field === 'throughput') {
        vals.push(prov ? prov[field] : 0);
      } else {
        vals.push(getProviderPrice(m, prov, field));
      }
    } else {
      vals.push(m[field]);
    }
  }
  return vals;
}

function getProviderPrice(model, provider, field) {
  var modelFallbackMap = {
    inputPrice: 'inputPrice',
    cacheHitInputPrice: 'cacheHitPrice',
    cacheWrite5mInputPrice: 'cacheWrite5mInputPrice',
    cacheWrite1hInputPrice: 'cacheWrite1hInputPrice',
    explicitCacheHitInputPrice: 'explicitCacheHitInputPrice',
    outputPrice: 'outputPrice'
  };

  if (provider) {
    if (typeof provider[field] === 'number') return provider[field];
    if (provider.basePriceConfig && provider.basePriceConfig[field] && typeof provider.basePriceConfig[field].amount === 'number') {
      return provider.basePriceConfig[field].amount;
    }
  }

  var fallbackField = modelFallbackMap[field] || field;
  if (typeof model[fallbackField] === 'number') return model[fallbackField];
  if (model.basePriceConfig && model.basePriceConfig[field] && typeof model.basePriceConfig[field].amount === 'number') {
    return model.basePriceConfig[field].amount;
  }
  return 0;
}

function hl(values, current, lowerIsBetter) {
  if (!highlightEnabled || compareModels.length < 2) return '';
  var best = lowerIsBetter
    ? Math.min.apply(null, values)
    : Math.max.apply(null, values);
  return current === best ? ' highlight-best' : '';
}

function openModelSelector() {
  if (compareModels.length >= 4) {
    showToast('最多可对比 4 个模型');
    return;
  }

  var compareIds = {};
  for (var i = 0; i < compareModels.length; i++) {
    compareIds[compareModels[i].id] = true;
  }

  var allModels = getModels();
  var available = [];
  for (var j = 0; j < allModels.length; j++) {
    if (!compareIds[allModels[j].id]) {
      available.push(allModels[j]);
    }
  }

  var overlay = document.createElement('div');
  overlay.className = 'model-selector-overlay';
  overlay.id = 'modelSelectorOverlay';
  overlay.setAttribute('role', 'presentation');

  var modalHtml = '';
  modalHtml += '<div class="model-selector-modal" role="dialog" aria-modal="true" aria-labelledby="modelSelectorTitle">';
  modalHtml += '<div class="model-selector-header">';
  modalHtml += '<h3 id="modelSelectorTitle">选择模型</h3>';
  modalHtml += '<button class="model-selector-close" id="modelSelectorClose" aria-label="关闭模型选择器">×</button>';
  modalHtml += '</div>';
  modalHtml += '<div class="model-selector-search">';
  modalHtml += '<input type="text" id="modelSelectorSearch" placeholder="搜索模型名称...">';
  modalHtml += '</div>';
  modalHtml += '<div class="model-selector-list" id="modelSelectorList">';

  if (available.length === 0) {
    modalHtml += '<div class="model-selector-empty">没有更多可添加的模型</div>';
  } else {
    for (var k = 0; k < available.length; k++) {
      var m = available[k];
      modalHtml += '<div class="model-selector-item" data-id="' + m.id + '" role="button" tabindex="0" aria-label="选择 ' + m.name + '">';
      modalHtml += '<div class="ms-icon" style="background:' + (m.iconColor || '#6366F1') + '">' + (m.icon || m.name.charAt(0)) + '</div>';
      modalHtml += '<div class="ms-info">';
      modalHtml += '<div class="ms-name">' + m.name + '</div>';
      modalHtml += '<div class="ms-author">' + (m.author || '') + '</div>';
      modalHtml += '</div>';
      modalHtml += '<div class="ms-status" style="color:var(--primary);font-weight:500;font-size:13px">选择</div>';
      modalHtml += '</div>';
    }
  }

  modalHtml += '</div>';
  modalHtml += '</div>';
  overlay.innerHTML = modalHtml;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeModelSelector();
    }
  });

  overlay.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModelSelector();
    }
  });

  document.getElementById('modelSelectorClose').addEventListener('click', function() {
    closeModelSelector();
  });

  var searchInput = document.getElementById('modelSelectorSearch');
  if (searchInput) {
    searchInput.focus();
    searchInput.addEventListener('input', function() {
      var query = this.value.toLowerCase().trim();
      var items = overlay.querySelectorAll('.model-selector-item');
      var found = false;
      for (var i = 0; i < items.length; i++) {
        var nameEl = items[i].querySelector('.ms-name');
        var authorEl = items[i].querySelector('.ms-author');
        var name = nameEl ? nameEl.textContent.toLowerCase() : '';
        var author = authorEl ? authorEl.textContent.toLowerCase() : '';
        if (name.indexOf(query) !== -1 || author.indexOf(query) !== -1) {
          items[i].style.display = '';
          found = true;
        } else {
          items[i].style.display = 'none';
        }
      }
      var existingEmpty = overlay.querySelector('.model-selector-empty');
      if (!found && available.length > 0) {
        if (!existingEmpty) {
          var listEl = document.getElementById('modelSelectorList');
          var emptyEl = document.createElement('div');
          emptyEl.className = 'model-selector-empty';
          emptyEl.textContent = '没有匹配的模型';
          listEl.appendChild(emptyEl);
        }
      } else if (existingEmpty) {
        existingEmpty.remove();
      }
    });
  }

  var items = overlay.querySelectorAll('.model-selector-item');
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', function() {
      var id = this.getAttribute('data-id');
      if (id) {
        addModelToCompare(id);
        closeModelSelector();
      }
    });
    items[i].addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var id = this.getAttribute('data-id');
        if (id) {
          addModelToCompare(id);
          closeModelSelector();
        }
      }
    });
  }
}

function closeModelSelector() {
  var overlay = document.getElementById('modelSelectorOverlay');
  if (overlay) {
    overlay.remove();
  }
}

function addModelToCompare(id) {
  var model = findModelById(id);
  if (!model) return;

  compareModels.push(model);
  setCompareList(compareModels.map(function(m) { return m.id; }));
  destroyAllCharts();
  renderAll();
}

function bindEvents() {
  var backBtn = document.getElementById('compareBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  var toggle = document.getElementById('highlightToggle');
  if (toggle) {
    toggle.addEventListener('change', function() {
      highlightEnabled = this.checked;
      renderHeader();
      renderBody();
      bindEvents();
    });
  }

  var addBtn = document.getElementById('addModelBtn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      openModelSelector();
    });
  }

  var placeholders = document.querySelectorAll('.placeholder-card');
  for (var i = 0; i < placeholders.length; i++) {
    placeholders[i].addEventListener('click', function() {
      openModelSelector();
    });
    placeholders[i].addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModelSelector();
      }
    });
  }

  var removeBtns = document.querySelectorAll('.compare-card-remove');
  for (var j = 0; j < removeBtns.length; j++) {
    removeBtns[j].addEventListener('click', function() {
      var idx = parseInt(this.getAttribute('data-idx'), 10);
      compareModels.splice(idx, 1);
      if (compareModels.length < 2) {
        compareModels = [];
        setCompareList([]);
      } else {
        setCompareList(compareModels.map(function(m) { return m.id; }));
      }
      destroyAllCharts();
      renderAll();
    });
  }

  var cardSelects = document.querySelectorAll('.card-model-select');
  for (var k = 0; k < cardSelects.length; k++) {
    cardSelects[k].addEventListener('change', function() {
      var idx = parseInt(this.getAttribute('data-idx'), 10);
      var newId = this.value;
      if (!newId) return;

      var newModel = findModelById(newId);
      if (!newModel) return;

      var oldModel = compareModels[idx];
      var oldProvider = selectedProviders[oldModel.id];
      if (oldProvider) {
        var hasMatch = false;
        for (var p = 0; p < newModel.providers.length; p++) {
          if (newModel.providers[p].name === oldProvider) {
            hasMatch = true;
            break;
          }
        }
        if (hasMatch) {
          selectedProviders[newModel.id] = oldProvider;
        }
        delete selectedProviders[oldModel.id];
      }

      compareModels[idx] = newModel;
      setCompareList(compareModels.map(function(m) { return m.id; }));
      destroyAllCharts();
      renderAll();
    });
  }

  var providerSelects = document.querySelectorAll('.provider-select');
  for (var l = 0; l < providerSelects.length; l++) {
    providerSelects[l].addEventListener('change', function() {
      var modelId = this.getAttribute('data-model');
      selectedProviders[modelId] = this.value;
      renderBody();
      bindEvents();
    });
  }
}

document.addEventListener('DOMContentLoaded', initComparePage);
