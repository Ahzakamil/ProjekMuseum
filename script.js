const hamburger = document.querySelector(".hamburger-btn");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});


document.addEventListener('DOMContentLoaded', () => {
  // 1. SMOOTH SCROLL NAVBAR
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 2. EFEK 3D TILT MOUSE HERO
  const heroSection = document.querySelector('.background-hero');
  const heroImg = document.querySelector('.img-hero');

  if (heroSection && heroImg) {
    heroSection.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = heroSection.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      heroImg.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.05)`;
      heroImg.style.transition = 'transform 0.1s ease-out';
    });

    heroSection.addEventListener('mouseleave', () => {
      heroImg.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
      heroImg.style.transition = 'transform 0.5s ease';
    });
  }

  // 3. ANIMASI COUNTER ANGKA ABOUT
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const increment = target / (2000 / 20);

          const updateCount = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.innerText = target + '';
              clearInterval(updateCount);
            } else {
              counter.innerText = Math.ceil(count);
            }
          }, 20);
        });
      }
    });
  }, { threshold: 0.5 });

  const aboutSection = document.querySelector('.about-stats');
  if (aboutSection) countObserver.observe(aboutSection);

  // 4. SCROLL REVEAL (MUNCUL PERLAHAN SAAT DI-SCROLL)
  const revealElements = document.querySelectorAll(
    '.content-product, .content-service, .timeline-item, .testimonial-card'
  );

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. TESTIMONIAL LOAD MORE (Menampilkan 6 Kartu Awal)
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const loadMoreBtn = document.querySelector('.btn-load-more');

  if (testimonialCards.length > 6) {
    testimonialCards.forEach((card, index) => {
      if (index >= 6) card.style.display = 'none';
    });

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        testimonialCards.forEach((card, index) => {
          if (index >= 6) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, (index - 6) * 100);
          }
        });
        loadMoreBtn.style.display = 'none';
      });
    }
  } else if (loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }
});





  