document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav");
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = [...document.querySelectorAll("main section[id]")];
  const form = document.getElementById("leadForm");
  const success = document.getElementById("formSuccess");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");

      // Make in-page navigation reliable, especially for the Videos section.
      if (targetId && targetId.startsWith("#")) {
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", targetId);
        }
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.remove("active"));
      const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
      active?.classList.add("active");
    });
  }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const age = document.getElementById("age").value.trim() || "Not provided";
    const level = document.getElementById("level").value;
    const program = document.getElementById("program").value;
    const message = document.getElementById("message").value.trim() || "No additional message";

    if (!name || !phone || !level || !program) {
      success.style.display = "block";
      success.style.background = "#fff1f1";
      success.style.color = "#a33131";
      success.textContent = "Please complete the required fields before continuing.";
      return;
    }

    const text =
`Hello Velocity Chess Academy,

I would like to enquire about chess coaching.

Name: ${name}
WhatsApp: ${phone}
Player Age: ${age}
Current Level: ${level}
Interested In: ${program}
Goal / Message: ${message}

Please let me know the suitable next step and trial session details.

Thank you.`;

    const whatsappUrl = `https://wa.me/918500564155?text=${encodeURIComponent(text)}`;
    success.style.display = "block";
    success.style.background = "#e8f8ef";
    success.style.color = "#197348";
    success.textContent = "Opening WhatsApp with your enquiry…";

    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }, 250);
  });

});
