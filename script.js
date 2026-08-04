document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // CHANGE THIS TO THE PHOTOGRAPHER'S REAL EMAIL ADDRESS
  const BOOKING_EMAIL = "hej@erikbergfoto.se";

  // =========================================================
  // VIDEO SLIDER
  // =========================================================

  const videos = [
    {
      src: "videos/event.mp4",
      poster: "images/event.jpg",
      category: "Event",
      title: "Event & aftermovies",
      description: "Känslan från kvällen, koncentrerad till film."
    },
    {
      src: "videos/lifestyle.mp4",
      poster: "images/lifestyle.jpg",
      category: "Sociala medier",
      title: "Innehåll som stannar kvar",
      description: "Korta format skapade för Reels och sociala medier."
    }
  ];

  const slider = document.querySelector(".motion-slider");
  const sliderCenter = document.querySelector(".motion-slider__center");
  const videoElement = document.getElementById("motionVideo");
  const previousButton = document.getElementById("previousVideo");
  const nextButton = document.getElementById("nextVideo");
  const videoTitle = document.getElementById("motionVideoTitle");
  const videoDescription = document.getElementById(
    "motionVideoDescription"
  );
  const videoCategory = document.getElementById(
    "motionVideoCategory"
  );
  const videoNumber = document.getElementById("motionVideoNumber");
  const videoDots = document.getElementById("motionVideoDots");

  let currentVideoIndex = 0;
  let sliderBusy = false;

  function createVideoDots() {
    if (!videoDots) return;

    videoDots.innerHTML = "";

    videos.forEach((videoItem, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "motion-slider__dot";
      dot.setAttribute(
        "aria-label",
        `Visa videon ${videoItem.title}`
      );

      dot.addEventListener("click", () => {
        changeVideo(index);
      });

      videoDots.appendChild(dot);
    });
  }

  function updateVideoDots() {
    if (!videoDots) return;

    const dots = videoDots.querySelectorAll(
      ".motion-slider__dot"
    );

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "is-active",
        index === currentVideoIndex
      );
    });
  }

  function changeVideo(newIndex, animate = true) {
    if (!videoElement || sliderBusy) return;

    sliderBusy = true;

    const normalizedIndex =
      (newIndex + videos.length) % videos.length;

    if (animate) {
      sliderCenter?.classList.add("is-changing");
    }

    window.setTimeout(() => {
      currentVideoIndex = normalizedIndex;

      const selectedVideo = videos[currentVideoIndex];

      videoElement.pause();
      videoElement.src = selectedVideo.src;
      videoElement.poster = selectedVideo.poster;
      videoElement.muted = true;
      videoElement.load();

      videoElement.play().catch(() => {
        // Some browsers may block autoplay.
      });

      if (videoCategory) {
        videoCategory.textContent = selectedVideo.category;
      }

      if (videoTitle) {
        videoTitle.textContent = selectedVideo.title;
      }

      if (videoDescription) {
        videoDescription.textContent =
          selectedVideo.description;
      }

      if (videoNumber) {
        const currentNumber = String(
          currentVideoIndex + 1
        ).padStart(2, "0");

        const totalNumber = String(
          videos.length
        ).padStart(2, "0");

        videoNumber.textContent =
          `${currentNumber} / ${totalNumber}`;
      }

      updateVideoDots();

      sliderCenter?.classList.remove("is-changing");

      sliderBusy = false;
    }, animate ? 220 : 0);
  }

  if (slider && videoElement) {
    createVideoDots();
    changeVideo(0, false);

    previousButton?.addEventListener("click", () => {
      changeVideo(currentVideoIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
      changeVideo(currentVideoIndex + 1);
    });

    document.addEventListener("keydown", (event) => {
      const sliderPosition =
        slider.getBoundingClientRect();

      const sliderIsVisible =
        sliderPosition.top < window.innerHeight &&
        sliderPosition.bottom > 0;

      if (!sliderIsVisible) return;

      if (event.key === "ArrowLeft") {
        changeVideo(currentVideoIndex - 1);
      }

      if (event.key === "ArrowRight") {
        changeVideo(currentVideoIndex + 1);
      }
    });
  }

  // =========================================================
  // MOBILE MENU
  // =========================================================

  const navigation = document.getElementById("nav");
  const burgerButton = document.getElementById("burger");
  const navigationLinks =
    document.getElementById("navLinks");
  const scrollProgress =
    document.getElementById("scrollProgress");
  const toTopButton = document.getElementById("toTop");

  function closeMobileMenu() {
    navigationLinks?.classList.remove("open");

    burgerButton?.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove("menu-open");
  }

  burgerButton?.addEventListener("click", () => {
    const menuIsOpen =
      navigationLinks?.classList.toggle("open") ?? false;

    burgerButton.setAttribute(
      "aria-expanded",
      String(menuIsOpen)
    );

    document.body.classList.toggle(
      "menu-open",
      menuIsOpen
    );
  });

  navigationLinks
    ?.querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) {
      closeMobileMenu();
    }
  });

  // =========================================================
  // SCROLL EFFECTS
  // =========================================================

  function updateScrollEffects() {
    const scrollPosition = window.scrollY;

    const maximumScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (scrollProgress) {
      const progressValue = maximumScroll
        ? Math.min(
            scrollPosition / maximumScroll,
            1
          )
        : 0;

      scrollProgress.style.transform =
        `scaleX(${progressValue})`;
    }

    navigation?.classList.toggle(
      "scrolled",
      scrollPosition > 20
    );

    toTopButton?.classList.toggle(
      "visible",
      scrollPosition > 500
    );
  }

  window.addEventListener(
    "scroll",
    updateScrollEffects,
    {
      passive: true
    }
  );

  updateScrollEffects();

  toTopButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // =========================================================
  // ACTIVE NAVIGATION LINK
  // =========================================================

  const navigationSectionLinks = [
    ...document.querySelectorAll(
      '.nav__links a[href^="#"]'
    )
  ];

  const sections = navigationSectionLinks
    .map((link) => {
      return document.querySelector(
        link.getAttribute("href")
      );
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver =
      new IntersectionObserver(
        (entries) => {
          const visibleSection = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (firstEntry, secondEntry) =>
                secondEntry.intersectionRatio -
                firstEntry.intersectionRatio
            )[0];

          if (!visibleSection) return;

          navigationSectionLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") ===
              `#${visibleSection.target.id}`;

            link.classList.toggle(
              "active",
              isActive
            );
          });
        },
        {
          rootMargin: "-35% 0px -55%",
          threshold: [0.01, 0.2, 0.5]
        }
      );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // =========================================================
  // REVEAL ANIMATIONS
  // =========================================================

  if ("IntersectionObserver" in window) {
    const revealObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "is-visible"
            );

            revealObserver.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.12
        }
      );

    document
      .querySelectorAll(".reveal")
      .forEach((element) => {
        revealObserver.observe(element);
      });
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((element) => {
        element.classList.add("is-visible");
      });
  }

  // =========================================================
  // BOOKING MODAL
  // =========================================================

  const bookingModal =
    document.getElementById("bookingModal");

  const bookingForm =
    document.getElementById("bookingForm");

  const bookingName =
    document.getElementById("bookingName");

  function openBookingModal() {
    if (!bookingModal) return;

    bookingModal.classList.add("is-open");

    bookingModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      bookingName?.focus();
    }, 50);
  }

  function closeBookingModal() {
    if (!bookingModal) return;

    bookingModal.classList.remove("is-open");

    bookingModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove("modal-open");
  }

  document
    .querySelectorAll(".js-book")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openBookingModal();
      });
    });

  bookingModal
    ?.querySelectorAll("[data-close-booking]")
    .forEach((element) => {
      element.addEventListener(
        "click",
        closeBookingModal
      );
    });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      bookingModal?.classList.contains("is-open")
    ) {
      closeBookingModal();
    }
  });

  bookingForm?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      const name =
        document
          .getElementById("bookingName")
          ?.value.trim() || "";

      const email =
        document
          .getElementById("bookingEmail")
          ?.value.trim() || "";

      const assignmentType =
        document.getElementById(
          "bookingType"
        )?.value || "";

      const date =
        document.getElementById(
          "bookingDate"
        )?.value || "Inte angivet";

      const message =
        document
          .getElementById("bookingMessage")
          ?.value.trim() ||
        "Inget extra meddelande.";

      const subject = encodeURIComponent(
        `Bokningsförfrågan – ${assignmentType} – ${name}`
      );

      const emailBody = encodeURIComponent(
`Hej!

Jag vill skicka en bokningsförfrågan.

Namn: ${name}
E-post: ${email}
Typ av uppdrag: ${assignmentType}
Önskat datum: ${date}

Meddelande:
${message}`
      );

      window.location.href =
        `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${emailBody}`;

      closeBookingModal();
    }
  );

  // =========================================================
  // CURRENT YEAR
  // =========================================================

  const yearElement =
    document.getElementById("year");

  if (yearElement) {
    yearElement.textContent =
      new Date().getFullYear();
  }
});