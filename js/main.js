const username = 'alvluann';
const container = document.getElementById('projects-container');
const toggle = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Fetch repos and init charts
async function fetchRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork);
    displayProjects(filtered);
    initLanguageChart(filtered);
    initSkillsChart();
  } catch (e) { container.innerHTML = '<p>Erro ao carregar projetos.</p>'; }
}

// Projects modal
function displayProjects(list) {
  container.innerHTML = '';
  list.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'Sem descrição'}</p>
      <div class="repo-info">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count}</span>
        <span>📦 ${repo.language || '—'}</span>
      </div>
      <a href="${repo.html_url}" target="_blank" class="btn">Ver no GitHub</a>
    `;
    container.appendChild(card);
  });
}

function openModal(repo) {
  document.getElementById('modal-title').textContent = repo.name;
  document.getElementById('modal-desc').textContent = repo.description || 'Sem descrição';
  const link = document.getElementById('modal-link'); link.href = repo.html_url;
  document.getElementById('project-modal').classList.add('active');
}
document.getElementById('modal-close').onclick = () => document.getElementById('project-modal').classList.remove('active');

// Theme toggle
(function() {
  const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.className = saved;
  toggle.textContent = saved === 'light' ? '🌙' : '☀️';
  toggle.onclick = () => {
    const next = document.documentElement.className === 'light' ? 'dark' : 'light';
    document.documentElement.className = next;
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'light' ? '🌙' : '☀️';
  };
})();

// Scroll reveal & spy
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { threshold: 0.3 });
sections.forEach(sec => observer.observe(sec));

// Chart initialization
function initSkillsChart() {
  const skillEls = document.querySelectorAll('.skill');
  const labels = [], data = [];
  skillEls.forEach(el => { labels.push(el.querySelector('.skill-name').innerText); data.push(Number(el.dataset.skill)); });
  new Chart(document.getElementById('skillsChart'), {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF'] }] },
    options: { responsive:true, plugins:{ legend:{ position:'bottom' } } }
  });
}
function initLanguageChart(repos) {
  const langCount = {};
  repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language]||0)+1; });
  new Chart(document.getElementById('langChart'), {
    type: 'bar',
    data: { labels: Object.keys(langCount), datasets: [{ label:'Repositórios', data: Object.values(langCount) }] },
    options: { responsive:true, scales:{ y:{ beginAtZero:true } } }
  });
}

document.addEventListener('DOMContentLoaded', fetchRepos);
