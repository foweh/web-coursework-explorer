/**
 * 星际探索 - 太空画廊
 * 功能：Tab标签筛选 / 卡片列表 / 灯箱放大查看
 */

document.addEventListener('DOMContentLoaded', function () {

  'use strict';

  // ============================================================
  //  1. Tab 筛选
  // ============================================================
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const category = this.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        galleryItems.forEach(function (item) {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            // 重新触发淡入动画
            item.classList.remove('fade-in-up');
            void item.offsetWidth; // reflow
            item.classList.add('fade-in-up', 'visible');
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ============================================================
  //  2. 灯箱（Lightbox）
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // 点击任何画廊图片打开灯箱
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.querySelector('.gallery-item-title');
      if (!img || !lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) {
        lightboxCaption.textContent = title ? title.textContent : img.alt;
      }
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // 关闭灯箱
  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // 点击灯箱背景（非图片区域）关闭
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === this) closeLightbox();
    });
  }

  // ESC 键关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // ============================================================
  //  3. 图片懒加载（如果浏览器不支持 loading=lazy 的降级）
  // ============================================================
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('.gallery-item img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    lazyImages.forEach(function (img) { imgObserver.observe(img); });
  }
});
