/**
 * 星际探索 - 全局搜索功能
 * 用法：在页面中调用 SearchRegistry.add(...) 注册搜索项
 *       按 🔍 按钮打开搜索覆盖层
 */

(function () {
  'use strict';

  // ============================================================
  //  搜索数据注册中心
  // ============================================================
  var SearchRegistry = window.SearchRegistry = {
    _items: [],
    add: function (item) {
      this._items.push({
        title: item.title || '',
        desc: item.desc || '',
        url: item.url || '#',
        tags: (item.tags || []).concat([item.title || ''])
      });
    },
    search: function (query) {
      if (!query || query.length < 1) return [];
      var q = query.toLowerCase();
      return this._items.filter(function (item) {
        return item.title.toLowerCase().indexOf(q) !== -1 ||
               item.desc.toLowerCase().indexOf(q) !== -1 ||
               item.tags.some(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
      }).slice(0, 12);
    }
  };

  // ============================================================
  //  搜索覆盖层 UI
  // ============================================================

  var overlay, searchInput, resultsList, closeBtn;

  function createOverlay() {
    if (document.getElementById('search-overlay')) return;

    overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.className = 'search-overlay';
    overlay.innerHTML =
      '<div class="search-panel">' +
        '<div class="search-header">' +
          '<input type="text" class="search-input" id="search-input" placeholder="搜索行星、星云、新闻…" autofocus>' +
          '<button class="search-close" id="search-close" aria-label="关闭搜索">✕</button>' +
        '</div>' +
        '<div class="search-results" id="search-results">' +
          '<div class="search-hint">输入关键词开始搜索</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    searchInput = document.getElementById('search-input');
    resultsList = document.getElementById('search-results');
    closeBtn = document.getElementById('search-close');

    // 关闭按钮
    closeBtn.addEventListener('click', closeSearch);

    // 点击背景关闭
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
    });

    // 输入搜索
    var timer = null;
    searchInput.addEventListener('input', function () {
      var _this = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        doSearch(_this.value);
      }, 150);
    });

    // 回车选中第一个结果
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var firstLink = resultsList.querySelector('.search-result-link');
        if (firstLink) {
          window.location.href = firstLink.getAttribute('href');
          closeSearch();
        }
      }
    });
  }

  function openSearch() {
    createOverlay();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      searchInput.focus();
      searchInput.select();
    }, 200);
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (resultsList) {
      resultsList.innerHTML = '<div class="search-hint">输入关键词开始搜索</div>';
    }
  }

  function doSearch(query) {
    var results = SearchRegistry.search(query);
    if (!resultsList) return;

    if (!query || query.length < 1) {
      resultsList.innerHTML = '<div class="search-hint">输入关键词开始搜索</div>';
      return;
    }

    if (results.length === 0) {
      resultsList.innerHTML = '<div class="search-hint search-no-result">未找到相关内容 😕</div>';
      return;
    }

    var html = '';
    results.forEach(function (item) {
      html +=
        '<a href="' + item.url + '" class="search-result-item" onclick="SearchRegistry._closeOnNav()">' +
          '<div class="search-result-title">' + highlight(item.title, query) + '</div>' +
          '<div class="search-result-desc">' + highlight(item.desc, query) + '</div>' +
        '</a>';
    });
    resultsList.innerHTML = html;
  }

  function highlight(text, query) {
    if (!text) return '';
    var q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + q + ')', 'gi'), '<mark>$1</mark>');
  }

  SearchRegistry._closeOnNav = function () {
    closeSearch();
  };

  // ============================================================
  //  绑定搜索按钮
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {
    var searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch();
      });
    }
  });

  // ============================================================
  //  页面搜索数据注册
  // ============================================================
  // 首页
  SearchRegistry.add({ title: '首页', desc: '星际探索首页 — 轮播图、特色板块、热门探索、宇宙数字', url: 'index.html', tags: ['首页','轮播','热门','数据'] });
  // 探索页
  SearchRegistry.add({ title: '太阳系探索', desc: '太阳、行星与小行星带全览', url: 'explore.html', tags: ['太阳系','探索','行星'] });
  SearchRegistry.add({ title: '太阳', desc: '恒星 — 太阳系的中心', url: 'explore.html#sun', tags: ['太阳','恒星','日冕','耀斑'] });
  SearchRegistry.add({ title: '水星', desc: '最靠近太阳的行星', url: 'explore.html#planets', tags: ['水星','行星','岩石行星'] });
  SearchRegistry.add({ title: '金星', desc: '地球的"姊妹星"', url: 'explore.html#planets', tags: ['金星','行星','温室效应'] });
  SearchRegistry.add({ title: '地球', desc: '我们的蓝色家园', url: 'explore.html#planets', tags: ['地球','行星','生命'] });
  SearchRegistry.add({ title: '火星', desc: '红色星球 — 人类的下一个目标', url: 'explore.html#planets', tags: ['火星','行星','移民'] });
  SearchRegistry.add({ title: '木星', desc: '太阳系最大的行星', url: 'explore.html#planets', tags: ['木星','气态巨行星','大红斑'] });
  SearchRegistry.add({ title: '土星', desc: '壮观的环系统', url: 'explore.html#planets', tags: ['土星','行星','光环'] });
  SearchRegistry.add({ title: '谷神星', desc: '小行星带中的矮行星', url: 'explore.html#planets', tags: ['谷神星','矮行星','小行星带'] });
  SearchRegistry.add({ title: '小行星带', desc: '火星与木星之间的小行星区域', url: 'explore.html#asteroids', tags: ['小行星','小行星带'] });
  SearchRegistry.add({ title: '星际视频', desc: '太空探索视频播放', url: 'explore.html#video', tags: ['视频','太空','探索'] });
  // 画廊页
  SearchRegistry.add({ title: '太空画廊', desc: '精选太空摄影作品', url: 'gallery.html', tags: ['画廊','摄影','太空'] });
  SearchRegistry.add({ title: '鹰状星云', desc: '创生之柱所在的著名星云', url: 'gallery.html', tags: ['鹰状星云','星云','创生之柱'] });
  SearchRegistry.add({ title: '猎户座星云', desc: '最亮的星云之一', url: 'gallery.html', tags: ['猎户座','星云'] });
  SearchRegistry.add({ title: '玫瑰星云', desc: '玫瑰般绽放的星云', url: 'gallery.html', tags: ['玫瑰星云','星云'] });
  SearchRegistry.add({ title: '银河系', desc: '我们所在的星系', url: 'gallery.html', tags: ['银河','星系','银河系'] });
  SearchRegistry.add({ title: '仙女座星系', desc: '最近的螺旋星系', url: 'gallery.html', tags: ['仙女座','星系'] });
  SearchRegistry.add({ title: '旋涡星系', desc: '壮丽的旋涡结构', url: 'gallery.html', tags: ['旋涡','星系'] });
  SearchRegistry.add({ title: '星轨摄影', desc: '长时间曝光的星轨照片', url: 'gallery.html', tags: ['星轨','摄影','长曝光'] });
  SearchRegistry.add({ title: '月面', desc: '月球表面细节特写', url: 'gallery.html', tags: ['月球','月面','摄影'] });
  SearchRegistry.add({ title: '日食', desc: '日全食奇观', url: 'gallery.html', tags: ['日食','太阳','天文现象'] });
  // 资讯页
  SearchRegistry.add({ title: '航天资讯', desc: '最新航天新闻与天文发现', url: 'news.html', tags: ['资讯','新闻','航天'] });
  SearchRegistry.add({ title: '韦伯望远镜发现', desc: '詹姆斯·韦伯望远镜最新发现', url: 'news.html', tags: ['韦伯','JWST','望远镜','发现'] });
  SearchRegistry.add({ title: '火星发现水', desc: '火星表面发现液态水证据', url: 'news.html', tags: ['火星','水','生命'] });
  SearchRegistry.add({ title: 'FAST 天眼', desc: '中国天眼 FAST 最新成果', url: 'news.html', tags: ['FAST','天眼','射电望远镜'] });
  SearchRegistry.add({ title: 'SpaceX 星舰', desc: 'SpaceX Starship 最新进展', url: 'news.html', tags: ['SpaceX','星舰','Starship','马斯克'] });
  SearchRegistry.add({ title: '长征火箭', desc: '中国长征系列火箭发射', url: 'news.html', tags: ['长征','火箭','中国航天'] });
  SearchRegistry.add({ title: '阿尔忒弥斯计划', desc: 'NASA 重返月球计划', url: 'news.html', tags: ['阿尔忒弥斯','Artemis','NASA','月球'] });
  SearchRegistry.add({ title: '系外行星发现', desc: '新发现的宜居带系外行星', url: 'news.html', tags: ['系外行星','宜居','发现'] });
  SearchRegistry.add({ title: '暗物质研究', desc: '暗物质研究最新进展', url: 'news.html', tags: ['暗物质','宇宙学','研究'] });
  SearchRegistry.add({ title: '木星新卫星', desc: '天文学家发现木星新卫星', url: 'news.html', tags: ['木星','卫星','发现'] });
  // 测验
  SearchRegistry.add({ title: '宇宙知识测验', desc: '10 道天文选择题，测试你的宇宙知识水平', url: 'quiz.html', tags: ['测验','问答','题目','天文'] });
  // 登录
  SearchRegistry.add({ title: '登录 / 注册', desc: '用户登录与账号注册', url: 'login.html', tags: ['登录','注册','账号'] });

  // 热门主题
  SearchRegistry.add({ title: '火星移民计划', desc: '人类何时能踏上红色星球？', url: 'index.html', tags: ['火星','移民','Starship','马斯克'] });
  SearchRegistry.add({ title: '黑洞的奥秘', desc: '首张黑洞照片与黑洞内部秘密', url: 'index.html', tags: ['黑洞','事件视界','引力'] });
  SearchRegistry.add({ title: '韦伯太空望远镜', desc: '史上最强望远镜正在改写认知', url: 'index.html', tags: ['韦伯','JWST','望远镜'] });

  // ============================================================
  //  导出
  // ============================================================
  SearchRegistry.open = openSearch;
  SearchRegistry.close = closeSearch;

})();
