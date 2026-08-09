/**
 * 星际探索 - 登录 / 注册表单验证
 * 功能：Tab切换 / 非空验证 / 邮箱格式 / 密码匹配 / 实时反馈
 */

document.addEventListener('DOMContentLoaded', function () {

  'use strict';

  // ============================================================
  //  1. Tab 切换：登录 ↔ 注册
  // ============================================================
  const tabBtns = document.querySelectorAll('.auth-tab-btn');
  const panels = {
    login: document.getElementById('login-panel'),
    register: document.getElementById('register-panel')
  };

  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = this.getAttribute('data-tab');
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        Object.keys(panels).forEach(function (key) {
          if (panels[key]) {
            panels[key].classList.toggle('active', key === target);
          }
        });
      });
    });
  }

  // ============================================================
  //  2. 工具：显示 / 清除错误
  // ============================================================
  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = input ? input.closest('.form-group').querySelector('.form-error') : null;
    if (input) input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = message ? 'block' : 'none';
    }
  }

  function clearError(inputId) {
    showError(inputId, '');
  }

  // ============================================================
  //  3. 验证规则
  // ============================================================

  /** 非空验证 */
  function validateRequired(inputId, label) {
    const input = document.getElementById(inputId);
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      showError(inputId, label + '不能为空');
      return false;
    }
    clearError(inputId);
    return true;
  }

  /** 邮箱格式验证 */
  function validateEmail(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      showError(inputId, '请输入邮箱地址');
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) {
      showError(inputId, '请输入正确的邮箱格式');
      return false;
    }
    clearError(inputId);
    return true;
  }

  /** 密码长度验证（≥6位） */
  function validatePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      showError(inputId, '请输入密码');
      return false;
    }
    if (val.length < 6) {
      showError(inputId, '密码至少6位字符');
      return false;
    }
    clearError(inputId);
    return true;
  }

  /** 确认密码匹配 */
  function validateConfirm(inputId, pwdId) {
    const input = document.getElementById(inputId);
    const pwd = document.getElementById(pwdId);
    if (!input || !pwd) return true;
    const val = input.value.trim();
    const pwdVal = pwd.value.trim();
    if (!val) {
      showError(inputId, '请再次输入密码');
      return false;
    }
    if (val !== pwdVal) {
      showError(inputId, '两次密码输入不一致');
      return false;
    }
    clearError(inputId);
    return true;
  }

  /** 用户名验证（2-20位） */
  function validateUsername(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      showError(inputId, '请输入用户名');
      return false;
    }
    if (val.length < 2 || val.length > 20) {
      showError(inputId, '用户名需为2-20个字符');
      return false;
    }
    clearError(inputId);
    return true;
  }

  // ============================================================
  //  4. 实时输入校验（blur + input）
  // ============================================================
  const realtimeRules = [
    { id: 'login-email',     validate: function () { return validateEmail('login-email'); } },
    { id: 'login-password',  validate: function () { return validateRequired('login-password', '密码'); } },
    { id: 'reg-username',    validate: function () { return validateUsername('reg-username'); } },
    { id: 'reg-email',       validate: function () { return validateEmail('reg-email'); } },
    { id: 'reg-password',    validate: function () { return validatePassword('reg-password'); } },
    { id: 'reg-confirm',     validate: function () { return validateConfirm('reg-confirm', 'reg-password'); } }
  ];

  realtimeRules.forEach(function (rule) {
    const el = document.getElementById(rule.id);
    if (el) {
      el.addEventListener('blur', rule.validate);
      el.addEventListener('input', function () {
        // 输入时清除错误样式
        this.classList.remove('error');
        const errEl = this.closest('.form-group').querySelector('.form-error');
        if (errEl) errEl.style.display = 'none';
      });
    }
  });

  // ============================================================
  //  5. 提交处理
  // ============================================================

  /** 登录提交 */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const validEmail = validateEmail('login-email');
      const validPwd = validateRequired('login-password', '密码');
      if (validEmail && validPwd) {
        showFeedback('login-feedback', '登录成功！欢迎回来', 'success');
        this.reset();
      } else {
        showFeedback('login-feedback', '请检查表单中的错误', 'error');
      }
    });
  }

  /** 注册提交 */
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const validUser = validateUsername('reg-username');
      const validEmail = validateEmail('reg-email');
      const validPwd = validatePassword('reg-password');
      const validConfirm = validateConfirm('reg-confirm', 'reg-password');
      if (validUser && validEmail && validPwd && validConfirm) {
        showFeedback('register-feedback', '注册成功！欢迎加入星际探索', 'success');
        this.reset();
      } else {
        showFeedback('register-feedback', '请检查表单中的错误', 'error');
      }
    });
  }

  // ============================================================
  //  6. 反馈提示
  // ============================================================
  function showFeedback(elId, message, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = message;
    el.className = 'form-feedback ' + type;
    el.style.display = 'block';
    // 3秒后自动隐藏
    setTimeout(function () {
      el.style.display = 'none';
    }, 3000);
  }

  // 如果 URL 带 ?register 参数，自动切换到注册 tab
  if (window.location.search.includes('register')) {
    const regTab = document.querySelector('.auth-tab-btn[data-tab="register"]');
    if (regTab) regTab.click();
  }

  // ============================================================
  //  7. "切换到注册/登录" 链接
  // ============================================================
  const switchToReg = document.getElementById('switch-to-reg');
  const switchToLogin = document.getElementById('switch-to-login');
  if (switchToReg) {
    switchToReg.addEventListener('click', function (e) {
      e.preventDefault();
      const regTab = document.querySelector('.auth-tab-btn[data-tab="register"]');
      if (regTab) regTab.click();
    });
  }
  if (switchToLogin) {
    switchToLogin.addEventListener('click', function (e) {
      e.preventDefault();
      const loginTab = document.querySelector('.auth-tab-btn[data-tab="login"]');
      if (loginTab) loginTab.click();
    });
  }
});
