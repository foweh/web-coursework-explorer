/**
 * 星际探索 - 全局脚本
 * 功能：实时时钟 / 返回顶部 / 导航下拉 / 滚动监听 / 滚动动画
 */

document.addEventListener('DOMContentLoaded', function () {

  'use strict';

  // ============================================================
  //  1. 隐藏页面加载动画
  // ============================================================
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    // 给一点最小展示时间让动画能看到，再淡出
    setTimeout(function () {
      pageLoader.classList.add('hidden');
      // 完全隐藏后从文档流移除
      setTimeout(function () {
        pageLoader.style.display = 'none';
      }, 600);
    }, 400);
  }

  // ============================================================
  //  2. 实时时钟
  // ============================================================
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    function updateClock() {
      const now = new Date();
      const y = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const h = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
      clockEl.textContent = `${y}年${mo}月${d}日 周${week} ${h}:${mi}:${s}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // ============================================================
  //  2. 主题切换 (暗/亮)
  // ============================================================
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeBtn) {
    themeBtn.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    themeBtn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      this.textContent = next === 'light' ? '☀️' : '🌙';
    });
  }

  // ============================================================
  //  3. 阅读进度条
  // ============================================================
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    });
  }

  // ============================================================
  //  4. 返回顶部
  // ============================================================
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    });
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  //  3. 导航：移动端汉堡菜单
  // ============================================================
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      mainNav.classList.toggle('open');
    });
    // 点击导航链接后自动关闭菜单
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mainNav.classList.remove('open');
      });
    });
  }

  // ============================================================
  //  4. 导航：移动端下拉菜单展开
  // ============================================================
  document.querySelectorAll('.main-nav > li.has-dropdown > a').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });

  // ============================================================
  //  5. 滚动监听：高亮当前页面导航
  // ============================================================
  const navLinks = document.querySelectorAll('.main-nav > li > a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ============================================================
  //  6. Header 滚动阴影
  // ============================================================
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ============================================================
  //  7. 滚动淡入动画 (IntersectionObserver)
  // ============================================================
  const fadeEls = document.querySelectorAll('.fade-in-up');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // 降级：直接显示
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }
});
