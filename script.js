// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ===== Custom Cursor =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX - 4 + 'px';
  cursorDot.style.top = mouseY - 4 + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX - 20 + 'px';
  cursorRing.style.top = ringY - 20 + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll('[data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 80) {
    navbar.classList.add('bg-obsidian/80', 'backdrop-blur-xl', 'border-b', 'border-smoke/10');
  } else {
    navbar.classList.remove('bg-obsidian/80', 'backdrop-blur-xl', 'border-b', 'border-smoke/10');
  }
  lastScroll = currentScroll;
});

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const bar1 = document.getElementById('bar1');
const bar2 = document.getElementById('bar2');
const bar3 = document.getElementById('bar3');
let menuOpen = false;

menuToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open');
  if (menuOpen) {
    bar1.style.transform = 'rotate(45deg) translate(4px, 4px)';
    bar2.style.opacity = '0';
    bar3.style.transform = 'rotate(-45deg) translate(4px, -4px)';
    bar3.style.width = '24px';
  } else {
    bar1.style.transform = '';
    bar2.style.opacity = '1';
    bar3.style.transform = '';
    bar3.style.width = '16px';
  }
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    bar1.style.transform = '';
    bar2.style.opacity = '1';
    bar3.style.transform = '';
    bar3.style.width = '16px';
  });
});

// ===== Typing Effect =====
const typedElement = document.getElementById('typedText');
const isFrench = document.documentElement.lang === 'fr';

const phrases = isFrench ? [
  'Data & AI',
  'Cloud & DevOps',
  'App Dev',
] : [
  'Data & AI',
  'Cloud & DevOps',
  'App Dev',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 500;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== Toggle Projects =====
const toggleBtn = document.getElementById('toggle-projects-btn');
const hiddenContainer = document.getElementById('hidden-projects');
const toggleText = document.getElementById('toggle-projects-text');
const toggleIcon = document.getElementById('toggle-projects-icon');

if (toggleBtn && hiddenContainer) {
  toggleBtn.addEventListener('click', () => {
    const isHidden = hiddenContainer.classList.contains('hidden');

    if (isHidden) {
      // Show Projects
      hiddenContainer.classList.remove('hidden');
      // Let browser paint first, then animate opacity
      setTimeout(() => {
        hiddenContainer.classList.remove('opacity-0');
        hiddenContainer.classList.add('opacity-100');
      }, 10);
      
      toggleText.textContent = isFrench ? 'Voir moins' : 'Show Less';
      toggleIcon.setAttribute('data-lucide', 'chevron-up');
      lucide.createIcons(); // Refresh Lucide icons so the chevron flips

      // Ensure reveal elements in hidden container show up
      const hiddenReveals = hiddenContainer.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      hiddenReveals.forEach(el => {
        revealObserver.observe(el);
      });
    } else {
      // Hide Projects
      hiddenContainer.classList.remove('opacity-100');
      hiddenContainer.classList.add('opacity-0');
      
      // Wait for fade transition before adding 'hidden'
      setTimeout(() => {
        hiddenContainer.classList.add('hidden');
      }, 500);

      toggleText.textContent = isFrench ? 'Voir tous les projets' : 'See All Projects';
      toggleIcon.setAttribute('data-lucide', 'chevron-down');
      lucide.createIcons();

      // Smoothly scroll back to projects section so user isn't stranded
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ===== Toggle Skills on Mobile =====
const toggleSkillsBtn = document.getElementById('toggle-skills-btn');
const toggleSkillsText = document.getElementById('toggle-skills-text');
const toggleSkillsIcon = document.getElementById('toggle-skills-icon');
const extraSkills = document.querySelectorAll('.tech-card-extra');

if (toggleSkillsBtn && extraSkills.length > 0) {
  toggleSkillsBtn.addEventListener('click', () => {
    const isHidden = extraSkills[0].classList.contains('hidden');

    extraSkills.forEach(card => {
      if (isHidden) {
        card.classList.remove('hidden');
        if (typeof revealObserver !== 'undefined') {
          revealObserver.observe(card);
        }
      } else {
        card.classList.add('hidden');
      }
    });

    if (isHidden) {
      toggleSkillsText.textContent = isFrench ? 'Voir moins' : 'Show Less';
      toggleSkillsIcon.setAttribute('data-lucide', 'chevron-up');
    } else {
      toggleSkillsText.textContent = isFrench ? 'Voir toutes les compétences' : 'See All Technologies';
      toggleSkillsIcon.setAttribute('data-lucide', 'chevron-down');
      
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });
}

// ===== Counter Animation =====
const counters = document.querySelectorAll('.counter-value');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      let count = 0;
      const increment = target / 60;
      const updateCounter = () => {
        count += increment;
        if (count < target) {
          entry.target.textContent = Math.ceil(count) + '+';
          requestAnimationFrame(updateCounter);
        } else {
          entry.target.textContent = target + '+';
        }
      };
      updateCounter();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    // Let the form submit naturally to avoid any CORS issues or local domain blocks
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn.querySelector('span');
    
    if (submitBtnText) {
      submitBtnText.textContent = isFrench ? 'Envoi en cours...' : 'Sending...';
    }
    
    // Disable button on next tick so the browser has time to register the form submission
    setTimeout(() => {
      submitBtn.disabled = true;
    }, 1);
  });
}

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Parallax glow orbs on mouse move =====
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.glow-orb');
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.5;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// ===== Read More Toggle for Project Descriptions on Mobile =====
document.querySelectorAll('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project-card');
    const desc = card.querySelector('.project-desc');
    
    if (desc) {
      const isClamped = desc.classList.contains('line-clamp-3');
      if (isClamped) {
        desc.classList.remove('line-clamp-3');
        btn.textContent = isFrench ? 'Lire moins' : 'Read Less';
      } else {
        desc.classList.add('line-clamp-3');
        btn.textContent = isFrench ? 'Lire plus' : 'Read More';
      }
    }
  });
});

