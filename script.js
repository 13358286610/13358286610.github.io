(() => {
  const data = window.homepageContent || {};
  const byId = (id) => document.getElementById(id);
  const node = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = String(value);
    return element;
  };
  const setText = (id, value) => { if (byId(id)) byId(id).textContent = value || ""; };
  const externalLink = (url, label) => {
    const anchor = node("a", "", label);
    anchor.href = url;
    if (/^https?:\/\//i.test(url)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    return anchor;
  };

  const name = data.nameEn || "Maojiang Lin";
  const chineseName = data.nameZh || "";
  document.title = data.siteTitle || `${name} | Academic Homepage`;
  byId("brand").replaceChildren(document.createTextNode(`${name} `), node("span", "", chineseName));
  byId("profile-name").replaceChildren(document.createTextNode(`${name} `), node("span", "", chineseName));
  setText("profile-role", data.role);
  setText("profile-location", [data.institution, data.location].filter(Boolean).join(" · "));
  setText("focus-text", data.focus);
  setText("about-copy", data.about);
  byId("profile-photo").src = data.photo || "assets/profile.jpg";
  byId("profile-photo").alt = `Portrait of ${name}`;
  const email = data.email || "";
  byId("email-link").href = `mailto:${email}`;
  byId("email-link").textContent = email ? `${email} ↗` : "Email address to be added";
  byId("github-link").href = data.github || "#top";
  setText("copyright", `© ${new Date().getFullYear()} ${name}`);
  byId("footer-email").href = `mailto:${email}`;
  setText("footer-email", email);

  const researchRoot = byId("research-list");
  if ((data.researchAreas || []).length === 0) {
    researchRoot.append(node("p", "empty-state", "Research interests will be added here."));
  } else {
    data.researchAreas.forEach((item, index) => {
      const card = node("article", "research-card");
      card.append(node("span", "item-number", String(index + 1).padStart(2, "0")), node("h3", "", item.title));
      researchRoot.append(card);
    });
  }

  function empty(root) {
    root.append(node("p", "empty-state", "Updates will be added here."));
  }

  function recordShell(index) {
    const record = node("article", "record");
    const body = node("div", "record-body");
    record.append(node("span", "record-index", String(index + 1).padStart(2, "0")), body);
    return { record, body };
  }

  const publicationsRoot = byId("publications-list");
  if (!(data.publications || []).length) empty(publicationsRoot);
  (data.publications || []).forEach((item, index) => {
    const { record, body } = recordShell(index);
    const tags = node("div", "record-tags");
    if (item.venue) tags.append(node("span", "record-tag", item.venue));
    if (item.year) tags.append(node("span", "record-tag subtle", item.year));
    if (tags.childElementCount) body.append(tags);
    body.append(node("h3", "", item.title));
    if (item.authors) body.append(node("p", "record-meta", item.authors));
    if ((item.links || []).length) {
      const links = node("div", "record-links");
      item.links.forEach(entry => { if (entry.url) links.append(externalLink(entry.url, `${entry.label} ↗`)); });
      body.append(links);
    }
    publicationsRoot.append(record);
  });

  function renderSimple(id, items, secondaryKey) {
    const root = byId(id);
    if (!(items || []).length) { empty(root); return; }
    items.forEach((item, index) => {
      const { record, body } = recordShell(index);
      if (item.period) {
        const tags = node("div", "record-tags");
        tags.append(node("span", "record-tag subtle", item.period));
        body.append(tags);
      }
      body.append(node("h3", "", item.title));
      const detail = item[secondaryKey] || item.description;
      if (detail) body.append(node("p", "record-meta", detail));
      if (item.url) {
        const links = node("div", "record-links");
        links.append(externalLink(item.url, "View details ↗"));
        body.append(links);
      }
      root.append(record);
    });
  }
  renderSimple("projects-list", data.projects, "description");
  renderSimple("honors-list", data.honors, "organization");
  renderSimple("education-list", data.education, "institution");

  const menuButton = byId("menu-toggle");
  const navigation = byId("site-nav");
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });
  navigation.querySelectorAll("a").forEach(anchor => anchor.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navigation.querySelectorAll("a").forEach(anchor => anchor.classList.toggle("active", anchor.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
  }
})();
