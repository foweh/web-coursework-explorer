/**
 * 星际探索 - 宇宙知识小测验
 * 功能：10 道选择题 + 即时反馈 + 评分 + 重试
 */

(function () {
  'use strict';

  // ============================================================
  //  题库
  // ============================================================
  var QUESTIONS = [
    {
      q: '太阳系中最大的行星是哪一颗？',
      opts: ['土星', '木星', '天王星', '海王星'],
      ans: 1
    },
    {
      q: '被称为"红色星球"的是哪颗行星？',
      opts: ['金星', '水星', '火星', '木星'],
      ans: 2
    },
    {
      q: '银河系属于什么类型的星系？',
      opts: ['椭圆星系', '旋涡星系', '不规则星系', '棒旋星系'],
      ans: 1
    },
    {
      q: '光年是什么单位？',
      opts: ['时间单位', '距离单位', '速度单位', '亮度单位'],
      ans: 1
    },
    {
      q: '人类首次登月是在哪一年？',
      opts: ['1965 年', '1967 年', '1969 年', '1971 年'],
      ans: 2
    },
    {
      q: '太阳系中最高的山脉位于哪颗行星/卫星上？',
      opts: ['地球', '火星', '金星', '木卫一'],
      ans: 1  // 火星的奥林匹斯山
    },
    {
      q: '什么是黑洞的"事件视界"？',
      opts: [
        '黑洞的物理表面',
        '光无法逃逸的边界',
        '黑洞的赤道线',
        '黑洞的自转轴'
      ],
      ans: 1
    },
    {
      q: '詹姆斯·韦伯太空望远镜主要观测什么波段？',
      opts: ['可见光', '射电波', '红外线', 'X射线'],
      ans: 2
    },
    {
      q: '太阳系中拥有最复杂环系统的是哪颗行星？',
      opts: ['木星', '天王星', '土星', '海王星'],
      ans: 2
    },
    {
      q: '宇宙大爆炸大约发生在多少年前？',
      opts: ['46 亿年', '100 亿年', '137 亿年', '200 亿年'],
      ans: 2
    }
  ];

  var LABELS = ['A', 'B', 'C', 'D'];

  // ============================================================
  //  状态
  // ============================================================
  var state = {
    index: 0,
    score: 0,
    answered: false,
    done: false
  };

  var quizEl, questionEl, optionsEl, progressEl, counterEl, footerEl, nextBtnEl, resultEl;

  // ============================================================
  //  初始化
  // ============================================================
  function init() {
    quizEl = document.getElementById('quiz');
    if (!quizEl) return;

    questionEl = document.getElementById('quiz-question');
    optionsEl = document.getElementById('quiz-options');
    progressEl = document.getElementById('quiz-progress');
    counterEl = document.getElementById('quiz-counter');
    footerEl = document.getElementById('quiz-footer');
    nextBtnEl = document.getElementById('quiz-next');
    resultEl = document.getElementById('quiz-result');

    // 下一题按钮
    if (nextBtnEl) {
      nextBtnEl.addEventListener('click', function () {
        if (state.done) {
          restartQuiz();
        } else {
          nextQuestion();
        }
      });
    }

    // 重新开始
    var restartBtn = document.getElementById('quiz-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', restartQuiz);
    }

    renderProgress();
    showQuestion(0);
  }

  // ============================================================
  //  渲染
  // ============================================================

  function renderProgress() {
    if (!progressEl) return;
    var html = '';
    for (var i = 0; i < QUESTIONS.length; i++) {
      var cls = 'quiz-progress-dot';
      if (i === state.index) cls += ' active';
      html += '<span class="' + cls + '" data-idx="' + i + '"></span>';
    }
    progressEl.innerHTML = html;
  }

  function showQuestion(index) {
    var q = QUESTIONS[index];
    if (!q) return;

    state.answered = false;
    questionEl.textContent = (index + 1) + '. ' + q.q;

    var html = '';
    for (var i = 0; i < q.opts.length; i++) {
      html +=
        '<button class="quiz-option" data-idx="' + i + '">' +
          '<span class="option-label">' + LABELS[i] + '</span>' +
          q.opts[i] +
        '</button>';
    }
    optionsEl.innerHTML = html;

    // 绑定选项点击
    optionsEl.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (state.answered) return;
        selectOption(parseInt(this.getAttribute('data-idx'), 10));
      });
    });

    // 更新计数器
    if (counterEl) {
      counterEl.textContent = (index + 1) + ' / ' + QUESTIONS.length;
    }

    // 下一题按钮文字
    if (nextBtnEl) {
      nextBtnEl.textContent = index < QUESTIONS.length - 1 ? '下一题 →' : '查看结果';
      nextBtnEl.style.display = 'none';
    }

    // 隐藏结果区
    if (resultEl) resultEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'flex';

    renderProgress();
  }

  function selectOption(idx) {
    var q = QUESTIONS[state.index];
    var correct = idx === q.ans;

    state.answered = true;
    if (correct) state.score++;

    // 标记选项
    optionsEl.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.classList.add('disabled');
      var btnIdx = parseInt(btn.getAttribute('data-idx'), 10);
      if (btnIdx === q.ans) btn.classList.add('correct');
      if (btnIdx === idx && !correct) btn.classList.add('wrong');
      if (btnIdx === idx && correct) btn.classList.add('selected');
    });

    // 更新进度点
    if (progressEl) {
      var dots = progressEl.querySelectorAll('.quiz-progress-dot');
      if (dots[state.index]) {
        dots[state.index].classList.remove('active');
        dots[state.index].classList.add(correct ? 'correct' : 'wrong');
      }
    }

    // 显示下一题按钮
    if (nextBtnEl) nextBtnEl.style.display = 'inline-block';
  }

  function nextQuestion() {
    state.index++;
    if (state.index >= QUESTIONS.length) {
      showResult();
    } else {
      showQuestion(state.index);
    }
  }

  // ============================================================
  //  结果
  // ============================================================
  function showResult() {
    state.done = true;

    if (questionEl) questionEl.textContent = '';
    if (optionsEl) optionsEl.innerHTML = '';
    if (progressEl) progressEl.innerHTML = '';
    if (footerEl) footerEl.style.display = 'none';
    if (resultEl) resultEl.style.display = 'block';

    var pct = Math.round((state.score / QUESTIONS.length) * 100);
    var stars, msg;

    if (pct >= 90) {
      stars = '🚀🚀🚀';
      msg = '天文大师！你对宇宙了如指掌！';
    } else if (pct >= 70) {
      stars = '🚀🚀';
      msg = '很棒！你是一个合格的太空爱好者！';
    } else if (pct >= 50) {
      stars = '🚀';
      msg = '基础不错，再加把劲就能成为天文达人了！';
    } else {
      stars = '🌌';
      msg = '看来还需要多逛逛星际探索网站学习哦！';
    }

    resultEl.innerHTML =
      '<div class="quiz-result">' +
        '<div class="score-stars">' + stars + '</div>' +
        '<div class="score">' + state.score + ' / ' + QUESTIONS.length + '</div>' +
        '<div class="score-label">正确率 ' + pct + '%</div>' +
        '<div class="score-msg">' + msg + '</div>' +
        '<button class="btn btn-primary mt-20" id="quiz-restart">再来一次</button>' +
      '</div>';

    // 重试按钮
    document.getElementById('quiz-restart').addEventListener('click', restartQuiz);
  }

  // ============================================================
  //  重新开始
  // ============================================================
  function restartQuiz() {
    state.index = 0;
    state.score = 0;
    state.answered = false;
    state.done = false;

    if (resultEl) resultEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'flex';
    if (nextBtnEl) nextBtnEl.style.display = 'none';

    renderProgress();
    showQuestion(0);
  }

  // ============================================================
  //  启动
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
