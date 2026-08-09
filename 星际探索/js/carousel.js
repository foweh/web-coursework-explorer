/**
 * 星际探索 - 轮播图组件
 * 功能：自动轮播 + 左右按钮切换 + 底部指示器切换
 */

function initCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const dots = carousel.querySelectorAll('.carousel-dot');
  let currentIndex = 0;
  let autoTimer = null;
  const INTERVAL = 4000; // 自动轮播间隔（毫秒）

  // ---------- 切换到指定 slide ----------
  function goTo(index) {
    // 边界处理（循环）
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    // 更新 slides
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });

    // 更新 dots
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  // ---------- 下一张 / 上一张 ----------
  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  // ---------- 自动轮播 ----------
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL);
  }
  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }
  function resetAuto() {
    stopAuto();
    startAuto();
  }

  // ---------- 绑定事件 ----------
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prev();
      resetAuto();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      next();
      resetAuto();
    });
  }

  // 底部指示器点击
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-index'), 10);
      if (!isNaN(idx) && idx !== currentIndex) {
        goTo(idx);
        resetAuto();
      }
    });
  });

  // 鼠标悬停暂停自动轮播
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  // 触摸设备支持
  carousel.addEventListener('touchstart', stopAuto, { passive: true });
  carousel.addEventListener('touchend', startAuto, { passive: true });

  // ---------- 初始化 ----------
  goTo(0);
  startAuto();
}

// DOM 就绪后初始化所有轮播
document.addEventListener('DOMContentLoaded', function () {
  initCarousel('main-carousel');
});
