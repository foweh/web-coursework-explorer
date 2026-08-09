/**
 * 星际探索 - 探索页面
 * 功能：Tab切换 / 视频播放控制 / 行星列表展示
 */

document.addEventListener('DOMContentLoaded', function () {

  'use strict';

  // ============================================================
  //  1. Tab 切换（行星分类）
  // ============================================================
  const tabBtns = document.querySelectorAll('.explore-tab-btn');
  const panels = document.querySelectorAll('.explore-panel');

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
  //  2. 视频播放控制（自定义 controls）
  // ============================================================
  const video = document.getElementById('explore-video');
  const playBtn = document.getElementById('video-play-btn');
  const progressBar = document.getElementById('video-progress');
  const progressFill = document.getElementById('video-progress-fill');
  const timeDisplay = document.getElementById('video-time');
  const volumeSlider = document.getElementById('video-volume');

  if (video && playBtn) {
    // 播放 / 暂停
    playBtn.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        playBtn.textContent = '⏸';
        playBtn.setAttribute('aria-label', '暂停');
      } else {
        video.pause();
        playBtn.textContent = '▶';
        playBtn.setAttribute('aria-label', '播放');
      }
    });

    // 更新进度条
    video.addEventListener('timeupdate', function () {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
      }
      if (timeDisplay) {
        timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
      }
    });

    // 点击进度条跳转
    if (progressBar) {
      progressBar.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        video.currentTime = pct * video.duration;
      });
    }

    // 音量控制
    if (volumeSlider) {
      volumeSlider.addEventListener('input', function () {
        video.volume = parseFloat(this.value);
      });
    }

    // 视频结束时恢复
    video.addEventListener('ended', function () {
      playBtn.textContent = '▶';
      playBtn.setAttribute('aria-label', '重新播放');
    });
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // ============================================================
  //  3. 行星卡片悬浮 3D 倾斜效果
  // ============================================================
  const planetCards = document.querySelectorAll('.planet-card');
  planetCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      this.style.transform =
        'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
});
