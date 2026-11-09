(function () {
  const data = window.homepageContent || {};
  const $ = (id) => document.getElementById(id);
  const set = (id, value) => { const element = $(id); if (element) element.textContent = value || ""; };
  const el = (tag, className, text) => { const element = document.createElement(tag); if (className) element.className = className; if (text) element.textContent = text; return element; };
  const link = (url, label) => { const a = el("a", "", label); a.href = url; if (/^https?:\/\//i.test(url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } return a; };
  const nameEn = data.nameEn || "Your Name";
  const nameZh = data.nameZh || "";
  document.title = data.siteTitle || `${nameEn} | ${nameZh}`;
  document.querySelector('meta[name="description"]').content = `Academic homepage of ${nameEn}: research, publications, projects, and news.`;
  $("brand").replaceChildren(document.createTextNode(`${nameEn} `), el("span", "", `| ${nameZh}`));
  set("profile-name", nameEn);
  set("profile-role", data.profileTitle || data.title);
  set("page-heading", nameEn);
  set("hero-institution", data.institution);
  $("hero-name").replaceChildren(document.createTextNode(`${nameEn} `), el("span", "", nameZh));
  set("hero-role", data.title);
  set("hero-unit", data.unit);
  set("about-text", data.about);
  set("footer-name", `${nameEn} (${nameZh})`);
  set("footer-year", new Date().getFullYear());

  set("initials", nameEn.split(/\s+/).map(part => part[0] || "").join("").slice(0, 3).toUpperCase());
  if (data.photo) {
    const img = el("img"); img.src = data.photo; img.alt = `Portrait of ${nameEn}`;
    img.onerror = () => { img.remove(); $("initials").hidden = false; };
    $("initials").hidden = true; $("avatar").prepend(img);
  }

  const profile = $("profile-links");
  const addProfile = (icon, label, url) => { if (!label) return; const li = el("li"); li.append(el("span", "icon", icon), url ? link(url, label) : el("span", "", label)); profile.append(li); };
  addProfile("⌖", data.city, "");
  addProfile("⌂", data.institution, "");
  addProfile("✉", data.email ? "Email" : "", data.email ? `mailto:${data.email}` : "");
  addProfile("⌘", data.github ? "GitHub" : "", data.github);
  addProfile("◈", data.scholar ? "Google Scholar" : "", data.scholar);
  addProfile("◎", data.orcid ? "ORCID" : "", data.orcid);

  const research = $("research-grid");
  (data.researchAreas || []).forEach(item => { const card = el("article", "research-card"); card.append(el("span", "mark"), el("h3", "", item.title), el("p", "", item.description)); research.append(card); });
  if (!research.children.length) research.hidden = true;

  function renderEntries(id, items, dateKey) {
    const root = $(id);
    if (!items || !items.length) { root.append(el("p", "empty-state", "Details will be added as they become available.")); return; }
    items.forEach(item => {
      const row = el("article", "entry"); const body = el("div");
      body.append(el("h3", "", item.title || item.name));
      const details = [item.authors, item.venue, item.description].filter(Boolean).join(" · ");
      if (details) body.append(el("p", "", details));
      if (item.url) body.append(link(item.url, "View details ↗"));
      row.append(el("span", "entry-date", item[dateKey] || ""), body); root.append(row);
    });
  }
  function renderCards(id, items, metaKey) {
    const root = $(id);
    if (!items || !items.length) { root.append(el("p", "empty-state", "Details will be added as they become available.")); return; }
    items.forEach(item => {
      const card = el("article", "project-card");
      if (item[metaKey]) card.append(el("span", "meta", item[metaKey]));
      card.append(el("h3", "", item.title || item.name));
      if (item.description) card.append(el("p", "", item.description));
      if (item.url) card.append(link(item.url, "View details ↗"));
      root.append(card);
    });
  }
  renderEntries("publications-list", data.publications, "year");
  renderCards("projects-list", data.projects, "period");
  renderEntries("achievements-list", data.achievements, "year");
  renderCards("team-list", data.team, "role");
  renderEntries("news-list", data.news, "date");

  const menu = document.querySelector(".menu-toggle");
  const nav = $("site-nav");
  menu.addEventListener("click", () => { const open = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", String(open)); menu.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu"); });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }));
  const sections = document.querySelectorAll("main section[id], .layout[id]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (!entry.isIntersecting) return; nav.querySelectorAll("a").forEach(a => a.classList.toggle("active", a.hash === `#${entry.target.id}`)); }); }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(section => observer.observe(section));
  }

})();
