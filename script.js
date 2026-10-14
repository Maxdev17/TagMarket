// Marks the page as JS-enabled, so reveal animations only hide content when JS can show it again
document.documentElement.classList.add("js");

// ================================
// HEADER: SHADOW ON SCROLL
// ================================
const header = document.getElementById("siteHeader");

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ================================
// MOBILE MENU
// ================================
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

function setMenu(open) {
  menuToggle.classList.toggle("open", open);
  siteNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => {
  setMenu(!siteNav.classList.contains("open"));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("click", (e) => {
  if (!header.contains(e.target)) setMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) setMenu(false);
});

// ================================
// REVEAL ON SCROLL
// ================================
const reveals = document.querySelectorAll(".reveal");

reveals.forEach((el) => {
  const siblings = Array.from(el.parentElement.children).filter((c) =>
    c.classList.contains("reveal"),
  );
  el.style.transitionDelay = siblings.indexOf(el) * 80 + "ms";
});

function showElement(el) {
  el.classList.add("visible");
  setTimeout(() => {
    el.style.transitionDelay = "";
  }, 1000);
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showElement(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => revealObserver.observe(el));
} else {
  reveals.forEach(showElement);
}

// ================================
// FAQ ACCORDION (one open at a time)
// ================================
const faqItems = document.querySelectorAll(".faq-item");

function setFaq(item, open) {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  question.setAttribute("aria-expanded", String(open));
  answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
}

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isOpen = question.getAttribute("aria-expanded") === "true";
    faqItems.forEach((other) => setFaq(other, false));
    if (!isOpen) setFaq(item, true);
  });
});

// Keep an open answer the right height if the screen is resized or rotated
window.addEventListener("resize", () => {
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (question.getAttribute("aria-expanded") === "true") {
      const answer = item.querySelector(".faq-answer");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});
