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
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
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


  // Cinematic Velocity video reel: one player, three videos, continuous playback.
  const velocityVideos = [
    "Ai_6k0K2uIs",
    "Y8B9Qj0PVYA",
    "ax3_Ryae_GY"
  ];
  const videoCards = [...document.querySelectorAll(".video-card")];
  const videoCurrent = document.getElementById("videoCurrent");
  let velocityPlayer = null;
  let currentVideoIndex = 0;
  let playerReady = false;

  function setActiveVideo(index) {
    currentVideoIndex = (index + velocityVideos.length) % velocityVideos.length;
    videoCards.forEach((card, i) => card.classList.toggle("active", i === currentVideoIndex));
    if (videoCurrent) videoCurrent.textContent = String(currentVideoIndex + 1).padStart(2, "0");
  }

  function playVelocityVideo(index, userSelected = false) {
    setActiveVideo(index);
    if (!velocityPlayer || !playerReady) return;
    velocityPlayer.loadVideoById(velocityVideos[currentVideoIndex]);
    // Muted autoplay is intentionally used so the reel can start automatically.
    velocityPlayer.mute();
    velocityPlayer.playVideo();
    if (userSelected) {
      // The viewer can turn sound on using YouTube's own controls after interacting.
      velocityPlayer.unMute();
    }
  }

  window.onYouTubeIframeAPIReady = function () {
    const target = document.getElementById("velocityVideoPlayer");
    if (!target) return;
    velocityPlayer = new YT.Player("velocityVideoPlayer", {
      videoId: velocityVideos[0],
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          playerReady = true;
          event.target.mute();
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            playVelocityVideo(currentVideoIndex + 1);
          }
        }
      }
    });
  };

  videoCards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.videoIndex || 0);
      playVelocityVideo(index, true);
    });
  });

});
