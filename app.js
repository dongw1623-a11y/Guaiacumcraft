/* ============================================================
   燃造物博客 · JavaScript 交互
   ============================================================ */

// ---- NAV 滚动效果 ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ---- 移动端菜单 ----
const toggle = document.getElementById('navToggle');
let menuOpen = false;
toggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  const links = document.querySelector('.nav-links');
  if (menuOpen) {
    links.style.display = 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '70px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'rgba(13,11,8,0.98)';
    links.style.padding = '20px 40px';
    links.style.gap = '20px';
    links.style.borderBottom = '1px solid rgba(200,169,110,0.18)';
    links.style.backdropFilter = 'blur(12px)';
  } else {
    links.style.display = '';
  }
});

// ---- 平滑导航到各锚点，关闭移动菜单 ----
document.querySelectorAll('.nav-links a, .hero-cta a, .footer-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navH = nav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // 关闭移动菜单
      if (menuOpen) { toggle.click(); }
    }
  });
});

// ---- FAQ 手风琴 ----
const faqItems = document.querySelectorAll('.faq-item');
const faqCats = document.querySelectorAll('.faq-cat');
let currentCat = 'material';

function filterFaq(cat) {
  currentCat = cat;
  faqItems.forEach(item => {
    const itemCat = item.getAttribute('data-cat');
    if (itemCat === cat) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
      // 关闭被隐藏的已展开项
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      if (q && q.classList.contains('open')) {
        q.classList.remove('open');
        a.style.maxHeight = '0';
      }
    }
  });
}

faqCats.forEach(btn => {
  btn.addEventListener('click', () => {
    faqCats.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterFaq(btn.getAttribute('data-cat'));
  });
});

// 初始化 FAQ
filterFaq('material');

faqItems.forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = q.classList.contains('open');
    // 关闭所有同级
    faqItems.forEach(i => {
      i.querySelector('.faq-q').classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = '0';
    });
    if (!isOpen) {
      q.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ---- Gallery 标签切换 ----
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.gallery-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

// ---- 留言表单标签选择 ----
const tagBtns = document.querySelectorAll('.tag-select .tag-btn');
let selectedTag = '盘玩心得';
tagBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tagBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedTag = btn.textContent.trim();
  });
});

// ---- 字符计数 ----
const msgContent = document.getElementById('msgContent');
const charCount = document.getElementById('charCount');
if (msgContent) {
  msgContent.addEventListener('input', () => {
    charCount.textContent = msgContent.value.length + ' / 500';
  });
}

// ---- 留言提交 ----
const msgForm = document.getElementById('msgForm');
const msgList = document.getElementById('msgList');
const msgCountEl = document.getElementById('msgCount');
let msgTotal = 3;

const tagColorMap = {
  '盘玩心得': '#c8a96e',
  '购前咨询': '#7aafca',
  '养护求助': '#a07ad4',
  '晒单分享': '#88c476',
  '其他': '#888'
};

function getAvatarChar(name) {
  if (!name) return '客';
  return name.charAt(0);
}

function getTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

if (msgForm) {
  msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('msgName').value.trim() || '匿名旅者';
    const content = msgContent.value.trim();
    if (!content) {
      showToast('请留下你的文字 ✦');
      return;
    }
    if (content.length < 5) {
      showToast('内容太短，多说两句吧～');
      return;
    }

    msgTotal++;
    msgCountEl.textContent = '共 ' + msgTotal + ' 条';

    const card = document.createElement('div');
    card.className = 'msg-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-10px)';
    card.innerHTML = `
      <div class="msg-meta">
        <span class="msg-avatar">${getAvatarChar(name)}</span>
        <span class="msg-name">${escapeHtml(name)}</span>
        <span class="msg-tag-label">${escapeHtml(selectedTag)}</span>
        <span class="msg-time">${getTodayStr()}</span>
      </div>
      <p class="msg-text">${escapeHtml(content)}</p>
      <div class="msg-likes">
        <button class="like-btn" onclick="likeMsg(this)">♡ 0</button>
      </div>
    `;
    msgList.prepend(card);
    requestAnimationFrame(() => {
      card.style.transition = 'opacity 0.4s, transform 0.4s';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

    // 重置表单
    msgForm.reset();
    charCount.textContent = '0 / 500';
    tagBtns.forEach(b => b.classList.remove('active'));
    tagBtns[0].classList.add('active');
    selectedTag = '盘玩心得';

    showToast('留言已发布，感谢你的分享 ✦');
  });
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- 点赞 ----
window.likeMsg = function(btn) {
  if (btn.classList.contains('liked')) return;
  btn.classList.add('liked');
  const match = btn.textContent.match(/(\d+)/);
  const num = match ? parseInt(match[1]) + 1 : 1;
  const symbol = btn.classList.contains('liked') ? '♥' : '♡';
  btn.textContent = '♥ ' + num;
};

// ---- Toast 提示 ----
let toastTimer;
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- Intersection Observer 淡入动画 ----
const fadeEls = document.querySelectorAll('.sci-card, .aroma-card, .g-card, .tip-item, .care-item, .about-grid, .compare-table-wrap');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ---- 藏风粒子背景（Hero区域） ----
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  hero.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // 粒子数组
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -Math.random() * 0.2 - 0.05,
    a: Math.random() * 0.6 + 0.1,
    phase: Math.random() * Math.PI * 2
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      const flicker = Math.sin(frame * 0.02 + p.phase) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${p.a * flicker})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ---- 偶尔出现的经文装饰 ----
const mantras = ['OM MANI PADME HUM', '༄༅། །ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།', '一切有为法，如梦幻泡影'];
let mantraIndex = 0;
setInterval(() => {
  const strip = document.querySelector('.strip-inner');
  if (!strip) return;
  // 仅在桌面端显示装饰文字
  if (window.innerWidth < 768) return;
  mantraIndex = (mantraIndex + 1) % mantras.length;
}, 8000);
