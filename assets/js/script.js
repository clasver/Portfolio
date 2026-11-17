'use strict';



/**
 * navbar toggle
 */

const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const scrollProgress = document.querySelector(".scroll-progress");

function setNavOpen(isOpen) {
  header.classList.toggle("nav-active", isOpen);
  navToggleBtn.classList.toggle("active", isOpen);
  navToggleBtn.setAttribute("aria-expanded", String(isOpen));
}

navToggleBtn.addEventListener("click", function () {
  setNavOpen(!header.classList.contains("nav-active"));
});

/**
 * toggle the navbar when click any navbar link
 */

const navbarLinks = document.querySelectorAll("[data-nav-link]");

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    setNavOpen(false);
  });
}

const localClock = document.querySelector("[data-local-clock]");

if (localClock) {
  const hourHand = localClock.querySelector("[data-clock-hour]");
  const minuteHand = localClock.querySelector("[data-clock-minute]");
  const secondHand = localClock.querySelector("[data-clock-second]");
  const clockTime = localClock.querySelector("[data-clock-time]");
  const clockDate = localClock.querySelector("[data-clock-date]");
  const timeZone = "Asia/Manila";
  const timePartsFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const timeFormatter = new Intl.DateTimeFormat("en-PH", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  const dateFormatter = new Intl.DateTimeFormat("en-PH", {
    timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const startedAt = new Date();
  const initialTime = timePartsFormatter.formatToParts(startedAt).reduce(function (parts, part) {
    if (part.type !== "literal") parts[part.type] = Number(part.value);
    return parts;
  }, {});
  const startingSeconds = initialTime.hour * 3600 + initialTime.minute * 60 + initialTime.second;
  const startTimestamp = startedAt.getTime();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateClockHands() {
    const elapsedSeconds = (startingSeconds + (Date.now() - startTimestamp) / 1000) % 43200;
    hourHand.style.transform = "translateX(-50%) rotate(" + elapsedSeconds / 120 + "deg)";
    minuteHand.style.transform = "translateX(-50%) rotate(" + (elapsedSeconds % 3600) / 10 + "deg)";
    secondHand.style.transform = "translateX(-50%) rotate(" + (elapsedSeconds % 60) * 6 + "deg)";

    if (!prefersReducedMotion) window.requestAnimationFrame(updateClockHands);
  }

  function updateClockReadout() {
    const now = new Date();
    clockTime.textContent = timeFormatter.format(now);
    clockTime.dateTime = now.toISOString();
    clockDate.textContent = dateFormatter.format(now);
  }

  updateClockHands();
  updateClockReadout();

  if (prefersReducedMotion) {
    window.setInterval(updateClockHands, 1000);
  }
  window.setInterval(updateClockReadout, 1000);
}



/**
 * back to top & header
 */

const backTopBtn = document.querySelector("[data-back-to-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
    // Scroll progress
    if (scrollProgress) {
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / height) * 100;
      scrollProgress.style.width = scrolled + "%";
      scrollProgress.setAttribute("aria-label", "Scroll progress: " + Math.round(scrolled) + "%");
    }
  });



/**
 * contact form -> Formspree
 */

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = this.elements["name"].value.trim();
    const email = this.elements["email"].value.trim();
    const message = this.elements["message"].value.trim();

    fetch("https://formspree.io/f/meaepgbl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    })
    .then(response => {
      if (response.ok) {
        alert("Message sent successfully!");
        this.reset();
      } else {
        alert("Failed to send message. Please try again.");
      }
    })
    .catch(error => {
      alert("Error sending message: " + error);
    });
  });
}

/*
   ENHANCEMENTS
*/

/* Project category filter */
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) { btn.classList.remove("active"); });
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    portfolioItems.forEach(function (item) {
      const matches = filter === "all" || item.getAttribute("data-category") === filter;
      item.classList.toggle("hidden", !matches);
    });
  });
});

const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const allowsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hasFinePointer && allowsMotion) {
  document.querySelectorAll(".project-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", (event.clientX - bounds.left) + "px");
      card.style.setProperty("--pointer-y", (event.clientY - bounds.top) + "px");
    });
  });
}

/* Scroll-reveal on view */
const revealElements = document.querySelectorAll("[data-reveal]");

if (revealElements.length > 0 && "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach(function (element) { revealObserver.observe(element); });
} else {
  revealElements.forEach(function (element) { element.classList.add("revealed"); });
}

/* Active nav link on scroll (scrollspy) */
const spyLinks = document.querySelectorAll("[data-nav-link]");
const spySections = Array.prototype.map.call(spyLinks, function (link) {
  return document.querySelector(link.getAttribute("href"));
}).filter(Boolean);

function setActiveSpyLink() {
  let current = spySections[0];
  const scrollPosition = window.scrollY + 140;

  spySections.forEach(function (section) {
    if (section.offsetTop <= scrollPosition) current = section;
  });

  spyLinks.forEach(function (link) {
    const isActive = link.getAttribute("href") === "#" + current.id;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (spyLinks.length > 0 && spySections.length > 0) {
  window.addEventListener("scroll", setActiveSpyLink, { passive: true });
  setActiveSpyLink();
}

/* Scroll progress indicator */
