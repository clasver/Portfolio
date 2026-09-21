'use strict';



/**
 * navbar toggle
 */

const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");

navToggleBtn.addEventListener("click", function () {
  header.classList.toggle("nav-active");
  this.classList.toggle("active");
});

/**
 * toggle the navbar when click any navbar link
 */

const navbarLinks = document.querySelectorAll("[data-nav-link]");

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    header.classList.toggle("nav-active");
    navToggleBtn.classList.toggle("active");
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
});




/**
 * contact form -> mailto
 */

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = this.elements["name"].value.trim();
    const email = this.elements["email"].value.trim();
    const message = this.elements["message"].value.trim();

    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message + "\n\nFrom: " + name + " <" + email + ">");

    window.location.href = "mailto:Marvilynlion@gmail.com?subject=" + subject + "&body=" + body;
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