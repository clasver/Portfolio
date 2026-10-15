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
const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
document.body.appendChild(scrollProgress);

window.addEventListener("scroll", function () {
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPos = window.scrollY;
  const scrollPercent = (scrollPos / scrollHeight) * 100;
  scrollProgress.style.width = scrollPercent + "%";
});

/* Floating Action Button for quick contact */
const fab = document.createElement("a");
fab.href = "mailto:Marvilynlion@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20Marvilyn%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20potential%20collaboration.";
fab.className = "fab";
fab.innerHTML = '<ion-icon name="mail-outline"></ion-icon>';
document.body.appendChild(fab);

/* Pulse animation for primary buttons */
const primaryButtons = document.querySelectorAll(".btn-primary.blue");
primaryButtons.forEach(button => {
  button.classList.add("btn-pulse");
});

/* Enhanced navbar active link styling */
const navLinks = document.querySelectorAll(".navbar-link");
navLinks.forEach(link => {
  link.addEventListener("mouseenter", function () {
    if (!this.classList.contains("active")) {
      this.style.color = getComputedStyle(document.documentElement).getPropertyValue("--klein-blue");
    }
  });
  link.addEventListener("mouseleave", function () {
    if (!this.classList.contains("active")) {
      this.style.color = getComputedStyle(document.documentElement).getPropertyValue("--white");
    }
  });
});

/* Hide header on scroll down, show on scroll up */
let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {
  const scrollY = window.scrollY;
  if (scrollY > lastScrollY && scrollY > 100) {
    // scrolling down past threshold -> hide
    header.classList.add("header-hidden");
  } else if (scrollY < lastScrollY) {
    // scrolling up -> show
    header.classList.remove("header-hidden");
  }
  lastScrollY = scrollY;

  // After scroll ends, ensure header is visible (optional)
  clearTimeout(window.scrollEndTimer);
  window.scrollEndTimer = setTimeout(() => {
    header.classList.remove("header-hidden");
  }, 150);
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
    ticking = true;
  }
});
/* Dark Mode Toggle */
const darkModeToggle = document.querySelector("[data-dark-mode-toggle]");
if (darkModeToggle) {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  
  // Check for saved user preference or use system preference
  const getCurrentTheme = () => localStorage.getItem("dark-mode") || 
                               (prefersDarkScheme.matches ? "dark" : "light");
  
  const setTheme = (theme) => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "light");
    }
  };
  
  // Initialize theme on load
  setTheme(getCurrentTheme());
  
  // Toggle theme when button is clicked
  darkModeToggle.addEventListener("click", () => {
    setTheme(getCurrentTheme() === "dark" ? "light" : "dark");
  });
  
  // Listen for system preference changes (optional)
  prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("dark-mode")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
}
