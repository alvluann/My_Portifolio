// js/main.js
const username = "alvluann";
const container = document.getElementById("projects-container");
const toggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll('section, header');
const overlay = document.getElementById("overlay");

async function fetchRepos() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=6&sort=updated`
    );
    if (!res.ok) throw new Error("GitHub API error");
    const repos = await res.json();
    const filtered = repos.filter((r) => !r.fork);
    displayProjects(filtered);
  } catch (e) {
    container.innerHTML = "<p>Erro ao carregar projetos.</p>";
    console.error(e);
  }
}

function displayProjects(list) {
  container.innerHTML = "";
  list.forEach((repo) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "Sem descrição"}</p>
      <div class="repo-info">
        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
        <span><i class="fas fa-circle"></i> ${repo.language || "—"}</span>
      </div>
      <a href="${repo.html_url}" target="_blank" class="btn">Ver no GitHub</a>
    `;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRepos();

  // tema
  const saved =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  document.documentElement.className = saved;
  toggle.addEventListener("click", () => {
    const next =
      document.documentElement.className === "light" ? "dark" : "light";
    document.documentElement.className = next;
    localStorage.setItem("theme", next);
    toggle.innerHTML =
      next === "light"
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    overlay.classList.toggle("active", isOpen);
    menuToggle.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
  overlay.addEventListener("click", () => {
    navList.classList.remove("open");
    overlay.classList.remove("active");
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      overlay.classList.remove("active");
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting && id) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  {
    threshold: 0.5,
    rootMargin: '-50% 0px -45% 0px'
  }
);
sections.forEach(section => observer.observe(section));
} 
);
