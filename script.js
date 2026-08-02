// ===========================================================
// ERIK BERG — FOTOGRAF
// ===========================================================

// Byt bara denna rad till din riktiga Calendly-länk.
const CALENDLY_URL = "https://calendly.com/DIN-CALENDLY-LANK";

/* Årtal i sidfoten */
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* Mobilmeny */
const burger = document.getElementById("burger");
const navLinks = document.querySelector(".nav__links");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    const menuIsOpen = navLinks.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(menuIsOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* Aktiv sektion i navigationen */
const nav = document.getElementById("nav");
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(
  '.nav__links a[href^="#"]:not(.js-book)'
);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const currentId = entry.target.id;

        navAnchors.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${currentId}`;
          link.classList.toggle("active", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    {
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* Header-effekt */
const hero = document.querySelector(".hero");

if (hero && nav && "IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle("scrolled", !entry.isIntersecting);
    },
    {
      rootMargin: "-10px 0px 0px 0px",
      threshold: 0
    }
  );

  navObserver.observe(hero);
}

/* Till toppen-knapp */
const toTopButton = document.getElementById("toTop");

if (hero && toTopButton && "IntersectionObserver" in window) {
  const toTopObserver = new IntersectionObserver(
    ([entry]) => {
      toTopButton.classList.toggle("visible", !entry.isIntersecting);
    },
    {
      threshold: 0
    }
  );

  toTopObserver.observe(hero);
}

if (toTopButton) {
  toTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* Calendly-bokning */
const bookingButtons = document.querySelectorAll(".js-book");

bookingButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    if (navLinks && burger) {
      navLinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }

    if (CALENDLY_URL.includes("DIN-CALENDLY-LANK")) {
      alert(
        "Lägg in din riktiga Calendly-länk högst upp i script.js först."
      );
      return;
    }

    if (window.Calendly && window.Calendly.initPopupWidget) {
      window.Calendly.initPopupWidget({
        url: CALENDLY_URL
      });
    } else {
      window.open(
        CALENDLY_URL,
        "_blank",
        "noopener,noreferrer"
      );
    }
  });
});

/* Escape stänger mobilmenyn */
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !navLinks || !burger) return;

  navLinks.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
});