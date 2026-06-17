// Custom Cursor Follower
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');

if (cursor && cursorDot) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.width = '35px';
    cursor.style.height = '35px';
    cursor.style.borderColor = '#C99A2E';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderColor = '#0057D9';
  });
  
  // Hover effect for links
  function bindCursorHover(elements) {
    elements.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.backgroundColor = 'rgba(0, 87, 217, 0.1)';
      });
      link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'transparent';
      });
    });
  }
  bindCursorHover(document.querySelectorAll('a, button, .interactive-el'));
}

// Scroll logic (Progress bar, Sticky Navbar, & active ScrollSpy highlighting)
const premiumNav = document.querySelector('.premium-nav');
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-link-custom');

window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  // Update Scroll Progress
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }

  // Toggle Navbar Background
  if (premiumNav) {
    if (winScroll > 50) {
      premiumNav.classList.add('scrolled');
    } else {
      premiumNav.classList.remove('scrolled');
    }
  }

  // ScrollSpy active link highlighters
  let currentSec = 'hero';
  sections.forEach(sec => {
    const secTop = sec.offsetTop - 120;
    if (winScroll >= secTop) {
      currentSec = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSec}`) {
      link.classList.add('active');
    }
  });
});

// HTML5 Canvas Luxury Particle Background
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const numberOfParticles = 80;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.color = Math.random() > 0.5 ? '#0057D9' : '#C99A2E';
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.save();
          let opacity = (1 - (distance / 150)) * 0.15;
          ctx.strokeStyle = `rgba(0, 87, 217, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
}

// Global variable to store settings data
let siteSettings = {};

// Initializing Dynamic Data
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }

  // Load dynamically from database APIs
  await loadSettings();
  await loadServices();
  await loadTeam();
  await loadTestimonials();
  await loadBlogs();
  await loadJobs();

  // GSAP scroll animations for Why Choose Us section
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (window.lenis) {
      window.lenis.on('scroll', () => {
        ScrollTrigger.update();
      });
    }

    gsap.from(".why-card-wrapper", {
      scrollTrigger: {
        trigger: ".why-choose-grid",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });

    gsap.from(".trust-stats-row .col-lg-3", {
      scrollTrigger: {
        trigger: ".trust-stats-row",
        start: "top 90%",
        toggleActions: "play none none none"
      },
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)"
    });
  }

  // Initialize Counter-up Animations
  initializeCounters();
});

// --- LOAD SETTINGS ---
async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error("Settings API load failure");
    siteSettings = await res.json();

    // Populate frontend email links
    document.querySelectorAll('.info-email').forEach(el => {
      el.href = `mailto:${siteSettings.email}`;
      el.innerText = siteSettings.email;
    });

    // Populate phone desk links
    document.querySelectorAll('.info-phone').forEach(el => {
      el.href = `tel:${siteSettings.phone.replace(/\s+/g, '')}`;
      el.innerText = siteSettings.phone;
    });

    // Populate address
    document.querySelectorAll('.info-address').forEach(el => {
      el.innerText = siteSettings.address;
    });

    // Populate social links in footer
    const ln = document.querySelector('.footer-linkedin');
    if (ln) ln.href = siteSettings.linkedin || '#';
    const ig = document.querySelector('.footer-instagram');
    if (ig) ig.href = siteSettings.instagram || '#';
    const tw = document.querySelector('.footer-twitter');
    if (tw) tw.href = siteSettings.twitter || '#';

    // Update global app email if configured
    if (siteSettings.hr_email) {
      const emailCareer = document.querySelector('a[href^="mailto:hr.support"]');
      if (emailCareer) {
        emailCareer.href = `mailto:${siteSettings.hr_email}`;
        emailCareer.innerText = siteSettings.hr_email;
      }
    }
  } catch (err) {
    console.error("Error fetching settings:", err);
  }
}

// --- LOAD SERVICES ---
async function loadServices() {
  const container = document.getElementById('services-container');
  const dropdown = document.getElementById('contact-subject');
  if (!container) return;

  try {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error("Services load failure");
    const services = await res.json();

    container.innerHTML = '';
    if (dropdown) dropdown.innerHTML = '';

    // Clear old dynamic modals
    document.querySelectorAll('.service-dynamic-modal').forEach(m => m.remove());

    services.forEach((service, index) => {
      const modalId = `serviceModal-${service.id}`;

      // 1. Append Service Card
      const cardHtml = `
        <div class="col-lg-3 col-md-6" id="service-card-${service.id}" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="glass-card p-3 h-100 d-flex flex-column justify-content-between glow-effect">
            <div>
              <div class="overflow-hidden mb-3" style="border-radius: 12px; height: 140px;">
                <img src="${service.icon.startsWith('/') || service.icon.startsWith('http') ? service.icon : (service.name.toLowerCase().includes('it staffing') ? 'it_staffing.png' : (service.name.toLowerCase().includes('healthcare') ? 'healthcare_services.png' : (service.name.toLowerCase().includes('marketing') ? 'digital_marketing.png' : 'it_services.png')))}" alt="${service.name}" class="img-fluid w-100 h-100" style="object-fit: cover; transition: transform 0.5s ease;">
              </div>
              <div class="d-flex align-items-center gap-2 mb-3">
                <span class="text-primary h4 mb-0"><i class="bi bi-cpu"></i></span>
                <h3 class="text-white h5 mb-0">${service.name}</h3>
              </div>
              <p class="text-muted small">${service.description.split('\n')[0]}</p>
            </div>
            <button class="btn btn-outline-custom w-100 btn-sm mt-3" data-bs-toggle="modal" data-bs-target="#${modalId}">Learn More</button>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHtml);

      // 2. Append Custom Modal
      let descParagraphs = service.description.split('\n\n');
      let bodyContentHtml = `<p class="text-muted leading-relaxed mb-4">${descParagraphs[0]}</p>`;
      
      if (descParagraphs.length > 1) {
        bodyContentHtml += `<div class="row g-4 my-2">`;
        for (let i = 1; i < descParagraphs.length; i++) {
          const parts = descParagraphs[i].split(':');
          const title = parts[0] || '';
          const detail = parts[1] || '';
          bodyContentHtml += `
            <div class="col-md-6">
              <h5 class="text-white"><i class="bi bi-patch-check text-primary me-2"></i>${title.trim()}</h5>
              <p class="text-muted small">${detail.trim()}</p>
            </div>
          `;
        }
        bodyContentHtml += `</div>`;
      }

      const modalHtml = `
        <div class="modal fade service-dynamic-modal" id="${modalId}" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content glass-card text-white border-0" style="background:#0F172A;">
              <div class="modal-header border-bottom border-secondary">
                <h4 class="modal-title text-gradient-gold"><i class="bi bi-cpu me-2"></i>${service.name}</h4>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                ${bodyContentHtml}
                <div class="mt-4 pt-3 border-top border-secondary text-end">
                  <button class="btn btn-outline-custom me-2" data-bs-dismiss="modal">Close</button>
                  <a href="#contact" class="btn btn-gold-custom" data-bs-dismiss="modal" onclick="document.getElementById('contact-subject').value = '${service.name}'">Inquire About Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      // 3. Append to Dropdown Select
      if (dropdown) {
        const option = document.createElement('option');
        option.value = service.name;
        option.innerText = service.name;
        dropdown.appendChild(option);
      }
    });

    if (cursor) {
      bindCursorHover(document.querySelectorAll('a, button, .interactive-el'));
    }
  } catch (err) {
    console.error("Error fetching services:", err);
  }
}

// --- LOAD TEAM ---
async function loadTeam() {
  const container = document.getElementById('team-container');
  if (!container) return;

  try {
    const res = await fetch('/api/team');
    if (!res.ok) throw new Error("Team API load failure");
    const team = await res.json();

    container.innerHTML = '';
    team.forEach((member, index) => {
      const photoSrc = member.image_url.startsWith('/') || member.image_url.startsWith('http') ? member.image_url : member.image_url;
      const html = `
        <div class="col-lg-4 col-md-5" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="glass-card text-center p-4">
            <div class="mx-auto mb-4 rounded-circle border border-primary overflow-hidden" style="width: 120px; height: 120px;">
              <img src="${photoSrc}" alt="${member.name}" class="w-100 h-100" style="object-fit: cover;">
            </div>
            <h4 class="text-white h5 mb-1">${member.name}</h4>
            <p class="text-gradient-gold small mb-3">${member.designation}</p>
            ${member.linkedin_url ? `<a href="${member.linkedin_url}" target="_blank" class="text-muted hover:text-white"><i class="bi bi-linkedin" style="font-size: 1.25rem;"></i></a>` : ''}
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });

    if (cursor) {
      bindCursorHover(document.querySelectorAll('a, button, .interactive-el'));
    }
  } catch (err) {
    console.error("Error loading team members:", err);
  }
}

// --- LOAD TESTIMONIALS ---
async function loadTestimonials() {
  const container = document.getElementById('testimonials-container');
  const ticker = document.getElementById('testimonials-ticker');
  if (!container) return;

  try {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error("Testimonials API load failure");
    const testimonials = await res.json();

    container.innerHTML = '';
    if (ticker) ticker.innerHTML = '';

    const sliderItems = testimonials.filter(t => t.is_ticker === 0);
    const tickerItems = testimonials.filter(t => t.is_ticker === 1);

    // Render slider items
    sliderItems.forEach(t => {
      const html = `
        <div class="swiper-slide">
          <div class="glass-card p-5 text-center max-w-lg mx-auto">
            <p class="lead text-white font-italic mb-4">"${t.message}"</p>
            <h5 class="text-gradient-gold mb-1">${t.client_name}</h5>
            <span class="text-muted small">${t.client_designation}</span>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });

    // Render ticker items (duplicated for infinite effect)
    const renderTickerNode = (t) => {
      return `
        <div class="ticker-item">
          <p class="small text-muted mb-2">"${t.message}"</p>
          <strong class="text-white small">${t.client_name}, ${t.client_designation}</strong>
        </div>
      `;
    };

    if (ticker) {
      tickerItems.forEach(t => {
        ticker.insertAdjacentHTML('beforeend', renderTickerNode(t));
      });
      // Duplicate for scroll continuity
      tickerItems.forEach(t => {
        ticker.insertAdjacentHTML('beforeend', renderTickerNode(t));
      });
    }

    // Re-initialize Swiper
    if (typeof Swiper !== 'undefined') {
      new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination-testimonials',
          clickable: true,
        }
      });
    }

    if (cursor) {
      bindCursorHover(document.querySelectorAll('a, button, .interactive-el'));
    }
  } catch (err) {
    console.error("Error loading testimonials:", err);
  }
}

// --- LOAD BLOGS ---
let fetchedBlogs = [];
async function loadBlogs() {
  const container = document.getElementById('blogs-container');
  if (!container) return;

  try {
    const res = await fetch('/api/blogs');
    if (!res.ok) throw new Error("Blogs API load failure");
    fetchedBlogs = await res.json();
    renderBlogs(fetchedBlogs);
  } catch (err) {
    console.error("Error loading blogs:", err);
  }
}

function renderBlogs(blogsList) {
  const container = document.getElementById('blogs-container');
  if (!container) return;

  container.innerHTML = '';

  const published = blogsList.filter(b => b.status === 'published');
  if (published.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted small py-5">No insights published yet. Check back soon!</div>`;
    return;
  }

  published.forEach((blog, index) => {
    const imageSrc = blog.image_url.startsWith('/') || blog.image_url.startsWith('http') ? blog.image_url : blog.image_url;
    const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const html = `
      <div class="col-lg-4 col-md-6 blog-post-card" data-category="${blog.category}" data-aos="fade-up" data-aos-delay="${index * 100}">
        <div class="glass-card h-100 d-flex flex-column justify-content-between hover-lift-effect">
          <div>
            <div class="overflow-hidden" style="border-bottom: 1px solid var(--dark-border); height: 200px;">
              <img src="${imageSrc}" alt="${blog.title}" class="img-fluid w-100 h-100" style="object-fit: cover; transition: transform 0.5s ease;">
            </div>
            <div class="p-4">
              <span class="text-gradient-gold small text-uppercase fw-bold mb-2 d-block">${blog.category === 'tech' ? 'IT Services' : (blog.category === 'staffing' ? 'IT Staffing' : 'Healthcare')}</span>
              <h4 class="text-white h5 blog-title mb-3">${blog.title}</h4>
              <p class="text-muted small blog-excerpt">${blog.excerpt}</p>
            </div>
          </div>
          <div class="p-4 border-top border-secondary d-flex justify-content-between align-items-center">
            <span class="text-muted small">${formattedDate}</span>
            <button class="btn btn-link text-gradient-gold text-decoration-none small p-0 fw-bold read-blog-btn" data-blog-id="${blog.id}">Read More <i class="bi bi-arrow-right"></i></button>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });

  // Attach modal trigger for blogs
  document.querySelectorAll('.read-blog-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const blogId = +btn.getAttribute('data-blog-id');
      const blog = fetchedBlogs.find(b => b.id === blogId);
      if (blog) {
        showBlogModal(blog);
      }
    });
  });

  if (cursor) {
    bindCursorHover(document.querySelectorAll('a, button, .interactive-el'));
  }
}

function showBlogModal(blog) {
  // Clear old dynamic modals
  document.querySelectorAll('.blog-dynamic-detail-modal').forEach(m => m.remove());

  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  const modalHtml = `
    <div class="modal fade blog-dynamic-detail-modal" id="blogDetailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content glass-card text-white border-0" style="background:#0F172A;">
          <div class="modal-header border-bottom border-secondary">
            <h5 class="modal-title text-gradient-gold">${blog.title}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <img src="${blog.image_url}" class="img-fluid rounded-3 mb-4 w-100" style="height:320px; object-fit:cover;">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="badge bg-warning text-dark text-uppercase small">${blog.category}</span>
              <span class="text-muted small">${formattedDate}</span>
            </div>
            <div class="text-muted leading-relaxed" style="font-size: 1.05rem; white-space: pre-wrap;">${blog.content}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const m = new bootstrap.Modal(document.getElementById('blogDetailModal'));
  m.show();
}

// Blog Search & Filtering bindings (supporting local filter on fetched array)
const searchInput = document.getElementById('blog-search');
const categoryButtons = document.querySelectorAll('.blog-filter-btn');

function filterBlogsLocal() {
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const activeCategory = document.querySelector('.blog-filter-btn.active')?.getAttribute('data-category') || 'all';

  const cards = document.querySelectorAll('.blog-post-card');
  cards.forEach(card => {
    const title = card.querySelector('.blog-title').innerText.toLowerCase();
    const excerpt = card.querySelector('.blog-excerpt').innerText.toLowerCase();
    const category = card.getAttribute('data-category');

    const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
    const matchesCategory = activeCategory === 'all' || category === activeCategory;

    if (matchesSearch && matchesCategory) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterBlogsLocal);
}

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active', 'btn-gold-custom'));
    categoryButtons.forEach(b => b.classList.add('btn-outline-custom'));
    btn.classList.add('active', 'btn-gold-custom');
    btn.classList.remove('btn-outline-custom');
    filterBlogsLocal();
  });
});


// --- LOAD CAREERS/JOBS ---
async function loadJobs() {
  const section = document.getElementById('dynamic-jobs-section');
  const container = document.getElementById('jobs-container');
  const talentPoolText = document.getElementById('talent-pool-text');
  if (!container) return;

  try {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error("Jobs load failure");
    const jobs = await res.json();

    const openJobs = jobs.filter(j => j.status === 'open');

    if (openJobs.length > 0) {
      if (section) section.style.display = 'block';
      if (talentPoolText) {
        talentPoolText.innerText = "Don't see a specific position matching your expertise? Submit your details to join our overall talent database and we'll reach out when matching requirements open up.";
      }
      container.innerHTML = '';
      openJobs.forEach(job => {
        const html = `
          <div class="col-md-6" id="job-opening-${job.id}">
            <div class="glass-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <h4 class="text-white h5 mb-2">${job.title}</h4>
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge bg-secondary text-light small"><i class="bi bi-geo-alt me-1"></i>${job.location}</span>
                  <span class="badge bg-secondary text-light small"><i class="bi bi-briefcase me-1"></i>${job.experience}</span>
                </div>
                <p class="text-muted small mb-3"><strong>Key Skills Required:</strong> ${job.skills}</p>
                <p class="text-muted small mb-0">${job.description || ''}</p>
              </div>
              <button class="btn btn-outline-custom btn-sm mt-3 w-100 apply-job-btn" data-job-id="${job.id}" data-job-title="${job.title}">Apply for this Position</button>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
      });

      // Bind apply action
      document.querySelectorAll('.apply-job-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const jobTitle = btn.getAttribute('data-job-title');
          const jobId = btn.getAttribute('data-job-id');
          document.getElementById('job-title-input').value = jobTitle;
          document.getElementById('job-apply-form').setAttribute('data-current-job-id', jobId);
          
          const modal = new bootstrap.Modal(document.getElementById('applyModal'));
          modal.show();
        });
      });

    } else {
      if (section) section.style.display = 'none';
      if (talentPoolText) {
        talentPoolText.innerText = "While we don't have active job openings listed at the moment, we are always searching for top-tier talent. If you are interested in software development, recruitment staffing, or healthcare consulting, submit your details and resume below.";
      }
    }

    if (cursor) {
      bindCursorHover(document.querySelectorAll('a, button, .interactive-el'));
    }
  } catch (err) {
    console.error("Error loading careers jobs:", err);
  }
}


// --- COUNT-UP COUNTERS ---
function initializeCounters() {
  const counters = document.querySelectorAll('.counter-val');
  const countSpeed = 200;

  const countUp = (counter) => {
    const target = +counter.getAttribute('data-target');
    const isPercentage = counter.getAttribute('data-percentage') === 'true';
    let count = 0;
    const increment = target / countSpeed;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.ceil(count) + (isPercentage ? '%' : '+');
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target + (isPercentage ? '%' : '+');
      }
    };
    updateCount();
  };

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}


// --- FORM SUBMISSIONS ---

// 1. Careers Form submit
const jobForm = document.getElementById('job-apply-form');
if (jobForm) {
  jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = jobForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    
    // Capture form values
    const role = document.getElementById('job-title-input').value;
    const name = document.getElementById('app-name').value;
    const email = document.getElementById('app-email').value;
    const skills = document.getElementById('app-skills').value;
    const resume = document.getElementById('app-resume').value;
    const message = document.getElementById('app-message').value;
    const jobId = jobForm.getAttribute('data-current-job-id') || '';

    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    try {
      // 1. Submit to database API
      const res = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId ? parseInt(jobId) : null,
          name: name,
          email: email,
          skills: skills,
          resume_url: resume,
          message: message
        })
      });

      if (!res.ok) throw new Error("API application submission failed");
      const result = await res.json();

      // 2. Fallback mailto routing trigger
      submitBtn.innerText = 'Opening Email Client...';
      const mailSubject = `Job Application: ${role} - ${name}`;
      const mailBody = `Hello HR Team,\n\nI would like to submit my job application details.\n\n` + 
                       `Full Name: ${name}\n` + 
                       `Email Address: ${email}\n` + 
                       `Role Interested: ${role}\n` + 
                       `Key Skills: ${skills}\n` + 
                       `Resume / Portfolio URL: ${resume}\n\n` + 
                       `Cover Message / Introduction:\n${message}\n`;

      const targetHr = siteSettings.hr_email || 'hr.support@kakatiyainnovatextechnologies.com';
      const mailtoUrl = `mailto:${targetHr}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
      window.location.href = mailtoUrl;

      setTimeout(() => {
        alert('Thank you! Your details were stored in our database. An email draft has also been opened in your email client. Please send it to complete your application.');
        jobForm.reset();
        jobForm.removeAttribute('data-current-job-id');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        
        // Hide modal
        const mNode = document.getElementById('applyModal');
        const modal = bootstrap.Modal.getInstance(mNode);
        if (modal) modal.hide();
      }, 1500);

    } catch (err) {
      console.error(err);
      alert('There was a connection issue storing details. Directing to email submission.');
      // Direct mailto backup anyway
      window.location.href = `mailto:hr.support@kakatiyainnovatextechnologies.com?subject=Job%20Application&body=${encodeURIComponent(message)}`;
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}

// 2. Contact form submit
const contactForm = document.getElementById('contact-us-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-msg').value;

    submitBtn.innerText = 'Sending Message...';
    submitBtn.disabled = true;

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: '',
          subject: subject,
          message: message
        })
      });

      if (!res.ok) throw new Error("API Inquiry post failed");
      
      alert('Thank you for reaching out! Your inquiry has been routed to our corporate relations desk. A representative will contact you shortly.');
      contactForm.reset();
    } catch (err) {
      console.error(err);
      alert('There was a problem submitting your form. Please try emailing us directly.');
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Map Mockup Interaction
const mapMockup = document.getElementById('map-mockup');
if (mapMockup) {
  mapMockup.addEventListener('click', () => {
    window.open('https://maps.google.com', '_blank');
  });
}
