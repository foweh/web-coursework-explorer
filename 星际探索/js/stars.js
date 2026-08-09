/**
 * 星际探索 - 交互式星空粒子（Canvas）
 * 功能：动态闪烁星空 + 鼠标交互（粒子跟随/扩散）
 */

(function () {
  'use strict';

  // ---------- 配置 ----------
  const CONFIG = {
    starCount: 300,        // 粒子数量
    maxSize: 2.5,          // 最大尺寸 (px)
    minSize: 0.3,          // 最小尺寸
    twinkleSpeed: 0.008,   // 闪烁速度
    driftSpeed: 0.03,      // 漂移速度
    mouseRadius: 120,      // 鼠标影响半径
    mouseForce: 0.8,       // 鼠标推离力度
    connectionDist: 130,   // 星点连线距离 (0 = 不连线)
    connectionOpacity: 0.15
  };

  // ---------- 状态 ----------
  const stars = [];
  let mouseX = -9999;
  let mouseY = -9999;
  let canvas, ctx, w, h, dpr;
  let animId = null;

  // ---------- 工具 ----------
  function rand(min, max) { return Math.random() * (max - min) + min; }

  // ---------- 初始化 ----------
  function init() {
    const container = document.querySelector('.stars-bg');
    if (!container) return;

    // 创建 Canvas
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    resize();
    createStars();
    bindEvents();
    animate();
  }

  // ---------- 尺寸适配 ----------
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------- 生成粒子 ----------
  function createStars() {
    stars.length = 0;
    for (let i = 0; i < CONFIG.starCount; i++) {
      stars.push({
        x: rand(0, w),
        y: rand(0, h),
        size: rand(CONFIG.minSize, CONFIG.maxSize),
        phase: rand(0, Math.PI * 2),      // 闪烁相位
        driftX: rand(-CONFIG.driftSpeed, CONFIG.driftSpeed),
        driftY: rand(-CONFIG.driftSpeed, CONFIG.driftSpeed),
        ox: 0, oy: 0,                      // 鼠标偏移
        vx: 0, vy: 0                       // 偏移速度
      });
    }
  }

  // ---------- 鼠标 / 触摸事件 ----------
  function bindEvents() {
    window.addEventListener('resize', function () {
      resize();
      // 重新分配粒子位置（按比例缩放）
      stars.forEach(function (s) {
        s.x = (s.x / (w || 1)) * canvas.width / dpr;
        s.y = (s.y / (h || 1)) * canvas.height / dpr;
      });
    });

    document.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    document.addEventListener('mouseleave', function () {
      mouseX = -9999;
      mouseY = -9999;
    });

    // 触摸支持
    document.addEventListener('touchmove', function (e) {
      const touch = e.touches[0];
      if (touch) {
        const rect = canvas.getBoundingClientRect();
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
      }
    }, { passive: true });

    document.addEventListener('touchend', function () {
      mouseX = -9999;
      mouseY = -9999;
    });
  }

  // ---------- 动画循环 ----------
  function animate() {
    ctx.clearRect(0, 0, w, h);

    const time = Date.now() * CONFIG.twinkleSpeed;

    // 更新粒子状态
    stars.forEach(function (s) {
      // 自然漂移
      s.x += s.driftX;
      s.y += s.driftY;

      // 边界回绕
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;
      if (s.y < -10) s.y = h + 10;
      if (s.y > h + 10) s.y = -10;

      // 鼠标交互 - 推离效果
      const dx = s.x - mouseX;
      const dy = s.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
        s.vx += (dx / dist) * force * 0.15;
        s.vy += (dy / dist) * force * 0.15;
      }

      // 阻尼（逐渐恢复）
      s.vx *= 0.92;
      s.vy *= 0.92;
      s.ox += s.vx;
      s.oy += s.vy;

      // 鼠标偏移归零阻尼（没鼠标时慢慢回去）
      if (dist > CONFIG.mouseRadius * 2) {
        s.ox *= 0.94;
        s.oy *= 0.94;
      }
    });

    // 绘制星点
    stars.forEach(function (s) {
      const alpha = 0.5 + 0.5 * Math.sin(time + s.phase);
      const x = s.x + s.ox;
      const y = s.y + s.oy;

      ctx.beginPath();
      ctx.arc(x, y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(2) + ')';
      ctx.fill();
    });

    // 连线（近的星点之间画细线）
    if (CONFIG.connectionDist > 0) {
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const ax = a.x + a.ox, ay = a.y + a.oy;
          const bx = b.x + b.ox, by = b.y + b.oy;
          const dx = ax - bx;
          const dy = ay - by;
          const dist = dx * dx + dy * dy;

          if (dist < CONFIG.connectionDist * CONFIG.connectionDist) {
            const alpha = (1 - dist / (CONFIG.connectionDist * CONFIG.connectionDist)) * CONFIG.connectionOpacity;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = 'rgba(0, 212, 255, ' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }

  // ---------- 启动 ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
