/**
 * 星际探索 - 航天资讯
 * 功能：Tab切换 / 卡片列表 / 倒计时
 */

document.addEventListener('DOMContentLoaded', function () {

  'use strict';

  // ============================================================
  //  1. Tab 切换（资讯分类）
  // ============================================================
  const tabBtns = document.querySelectorAll('.news-tab-btn');
  const panels = document.querySelectorAll('.news-panel');

  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = this.getAttribute('data-target');
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        panels.forEach(function (panel) {
          panel.classList.toggle('active', panel.id === target);
        });
      });
    });
  }

  // ============================================================
  //  2. 倒计时 - 下次重大航天事件
  // ============================================================
  const countdownEl = document.getElementById('countdown-timer');
  if (countdownEl) {
    // 设定目标时间：2026年1月1日（可更新为真实发射日期）
    const targetDate = new Date('2026-01-01T00:00:00+08:00').getTime();

    function updateCountdown() {
      const now = Date.now();
      let diff = targetDate - now;

      if (diff <= 0) {
        countdownEl.textContent = '🎉 该事件已开始！';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdownEl.textContent =
        days + '天 ' +
        String(hours).padStart(2, '0') + '时 ' +
        String(minutes).padStart(2, '0') + '分 ' +
        String(seconds).padStart(2, '0') + '秒';
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});
