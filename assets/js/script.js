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
