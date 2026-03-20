/* ===== Urban Design Lab – Main JS ===== */

/* ── Alumni Data ── */
const alumniData = [
  { name: '박태리', degree: 'ms', year: 2024, thesis: '공개공지 설계기준 비교 및 실증분석', affiliation: 'PMA 주임' },
  { name: '임현석', degree: 'ms', year: 2020, thesis: '저층주거지 가로환경 개선을 위한 노상주차 배치방식에 관한 연구', affiliation: '(주)양지 도시건축연구소 연구원' },
  { name: '홍진기', degree: 'ms', year: 2018, thesis: '지역 특성에 따른 가로환경개선사업 효과분석', affiliation: '(주)제이와이엔코 도시계획부 과장' },
];

/* ── Navbar: active link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ── Navbar background opacity on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(15,28,20,0.98)'
    : 'rgba(15,28,20,0.96)';
});

/* ── Publication Year Filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const yearGroups = document.querySelectorAll('.pub-year-group');
const pubCountEl = document.getElementById('pubCount');

function countVisiblePubs(year) {
  if (year === 'all') return 20;
  let count = 0;
  yearGroups.forEach(g => {
    if (g.dataset.year === year) {
      count += g.querySelectorAll('.pub-item').length;
    }
  });
  return count;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const year = btn.dataset.year;

    yearGroups.forEach(group => {
      if (year === 'all' || group.dataset.year === year) {
        group.classList.remove('hidden');
      } else {
        group.classList.add('hidden');
      }
    });

    pubCountEl.textContent = countVisiblePubs(year);
  });
});

/* ── Member Tabs ── */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) {
      target.classList.add('active');
      // Trigger count-up animation when alumni tab is activated
      if (btn.dataset.tab === 'alumni') {
        runCountUp();
      }
    }
  });
});

/* ── Alumni Render ── */
function renderAlumni(data) {
  const grid = document.getElementById('alumniGrid');
  grid.innerHTML = '';
  if (data.length === 0) {
    grid.innerHTML = '<p style="color:rgba(255,255,255,0.45);text-align:center;padding:32px;">표시할 졸업생 정보가 없습니다.</p>';
    return;
  }
  data.forEach(a => {
    const card = document.createElement('div');
    card.className = 'alumni-card';
    card.dataset.degree = a.degree;
    const degreeLabel = a.degree === 'phd' ? 'Ph.D.' : 'M.S.';
    const degreeClass = a.degree === 'phd' ? 'degree-phd' : 'degree-ms';
    card.innerHTML = `
      <div class="alumni-avatar"><i class="fas fa-user-graduate"></i></div>
      <div class="alumni-info">
        <h4>${a.name}</h4>
        <span class="alumni-degree-badge ${degreeClass}">${degreeLabel}</span>
        <div class="alumni-year">${a.year}년 졸업</div>
        ${a.thesis ? `<div class="alumni-thesis"><i class="fas fa-book"></i> ${a.thesis}</div>` : ''}
        ${a.affiliation ? `<div class="alumni-affiliation"><i class="fas fa-briefcase"></i> ${a.affiliation}</div>` : ''}
      </div>`;
    grid.appendChild(card);
  });
}

function getSortedAlumni(degree, sort) {
  let list = alumniData.filter(a => degree === 'all' || a.degree === degree);
  if (sort === 'newest') list = [...list].sort((a, b) => b.year - a.year);
  else if (sort === 'oldest') list = [...list].sort((a, b) => a.year - b.year);
  else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  return list;
}

let currentDegree = 'all';
let currentSort = 'newest';

document.querySelectorAll('.alumni-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.alumni-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentDegree = btn.dataset.degree;
    renderAlumni(getSortedAlumni(currentDegree, currentSort));
  });
});

const alumniSortEl = document.getElementById('alumniSort');
if (alumniSortEl) {
  alumniSortEl.addEventListener('change', () => {
    currentSort = alumniSortEl.value;
    renderAlumni(getSortedAlumni(currentDegree, currentSort));
  });
}

// Initial render
renderAlumni(getSortedAlumni('all', 'newest'));

/* ── Count-Up Animation ── */
let countUpDone = false;
function runCountUp() {
  if (countUpDone) return;
  countUpDone = true;
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target) || 0;
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 40);
  });
}

/* ── Scroll Fade In ── */
const scrollFadeEls = document.querySelectorAll('.scroll-fade');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

scrollFadeEls.forEach(el => observer.observe(el));

/* ── Contact Form (EmailJS) ── */
emailjs.init('Y-jr2np6b_TvYmDY9');

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '전송 중...';
    btn.disabled = true;

    emailjs.send('service_gdid5ba', 'template_rz80j2b', {
      from_name: document.getElementById('cName').value,
      from_email: document.getElementById('cEmail').value,
      message: document.getElementById('cMsg').value,
    }).then(() => {
      btn.textContent = '전송 완료!';
      btn.style.background = '#2d7a40';
      setTimeout(() => {
        btn.innerHTML = '보내기 <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    }).catch((err) => {
      btn.textContent = '전송 실패 - 다시 시도해주세요';
      btn.style.background = '#a03030';
      btn.disabled = false;
      console.error('EmailJS Error:', err);
      setTimeout(() => {
        btn.innerHTML = '보내기 <i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
      }, 3000);
    });
  });
}
