document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PRELOADER
       ========================================================================== */
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Trigger hero animations after preloader
                document.querySelectorAll('.hero .fade-up, .hero .fade-in').forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
                
                // Start counters
                startCounters();
                
            }, 500);
        }, 1500); // 1.5s artificial delay for luxury feel
    });

    /* ==========================================================================
       2. SPA NAVIGATION LOGIC
       ========================================================================== */
    const navLinks = document.querySelectorAll('a[data-target]');
    const views = document.querySelectorAll('.view-section');
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default if it's an internal SPA link
            if(link.getAttribute('href') === '#') {
                e.preventDefault();
            }

            const targetId = link.getAttribute('data-target');
            if(!targetId) return;

            // Update Active Link (only in header nav)
            if(link.classList.contains('nav-link')) {
                document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
            } else {
                // If clicked from footer or btn, sync header nav
                document.querySelectorAll('.nav-link').forEach(nav => {
                    nav.classList.remove('active');
                    if(nav.getAttribute('data-target') === targetId) {
                        nav.classList.add('active');
                    }
                });
            }

            // Switch Views
            views.forEach(view => {
                view.classList.remove('active-view');
                if(view.id === targetId) {
                    view.classList.add('active-view');
                }
            });

            // Close mobile menu if open
            hamburger.classList.remove('active');
            navbar.classList.remove('active');

            // Scroll to top of the page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Re-trigger reveal animations for new view
            setTimeout(checkReveal, 100);
        });
    });

    /* ==========================================================================
       3. MOBILE MENU TOGGLE
       ========================================================================== */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    /* ==========================================================================
       4. STICKY HEADER
       ========================================================================== */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       5. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    function checkReveal() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const revealPoint = 50;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            // Only reveal if element is visible in active view
            const isVisible = revealTop < windowHeight - revealPoint && revealTop > -reveal.offsetHeight;
            const parentView = reveal.closest('.view-section');
            
            if (isVisible && parentView && parentView.classList.contains('active-view')) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    // Initial check
    checkReveal();

    /* ==========================================================================
       6. ANIMATED COUNTERS
       ========================================================================== */
    function startCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // lower = faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    /* ==========================================================================
       7. PROJECTS FILTER & DYNAMIC GENERATION
       ========================================================================== */
    const projectsData = [
        { title: "Sky Heights Residences", category: "residential", location: "Andheri West, Mumbai, MH", price: "₹20.5 Cr", beds: 4, baths: 4, area: "3,500 sqft", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Featured" },
        { title: "Iris Elite Towers", category: "apartments", location: "Bandra Kurla Complex, Mumbai, MH", price: "₹15 Cr", beds: 3, baths: 3, area: "2,800 sqft", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "New" },
        { title: "Emerald Villas", category: "villas", location: "Koregaon Park, Pune, MH", price: "₹75 Cr", beds: 6, baths: 7, area: "8,500 sqft", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Villa" },
        { title: "Royal Business Hub", category: "commercial", location: "Nariman Point, Mumbai, MH", price: "₹100 Cr", beds: "N/A", baths: 8, area: "15,000 sqft", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Commercial" },
        { title: "Oceanview Penthouse", category: "apartments", location: "Juhu Beach, Mumbai, MH", price: "₹45 Cr", beds: 4, baths: 5, area: "4,200 sqft", img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Luxury" },
        { title: "Urban Prime Commercials", category: "commercial", location: "Hinjewadi IT Park, Pune, MH", price: "₹60 Cr", beds: "N/A", baths: 4, area: "8,000 sqft", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Premium" }
    ];

    const projectGrid = document.getElementById('project-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderProjects(category = 'all') {
        if(!projectGrid) return;
        
        projectGrid.innerHTML = '';
        
        const filtered = category === 'all' 
            ? projectsData 
            : projectsData.filter(p => p.category === category);

        filtered.forEach((project, index) => {
            const delayClass = `delay-${index % 3}`;
            const card = `
                <div class="property-card glass-card reveal ${delayClass}">
                    <div class="property-img">
                        <img src="${project.img}" alt="${project.title}">
                        <span class="badge">${project.badge}</span>
                    </div>
                    <div class="property-content">
                        <h3>${project.title}</h3>
                        <p class="location"><i class="fa-solid fa-location-dot"></i> ${project.location}</p>
                        <div class="property-details">
                            <span><i class="fa-solid fa-bed"></i> ${project.beds}</span>
                            <span><i class="fa-solid fa-bath"></i> ${project.baths}</span>
                            <span><i class="fa-solid fa-vector-square"></i> ${project.area}</span>
                        </div>
                        <div class="property-footer">
                            <h4 class="price">${project.price}</h4>
                            <a href="#" class="btn-text project-enquire" data-target="contact">Enquire <i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            `;
            projectGrid.insertAdjacentHTML('beforeend', card);
        });

        // Re-attach routing event listeners to newly generated buttons
        document.querySelectorAll('.project-enquire').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-target');
                document.querySelector(`a.nav-link[data-target="${targetId}"]`).click();
            });
        });

        // Trigger reveal for new items
        setTimeout(checkReveal, 100);
    }

    // Initialize projects
    renderProjects();

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            renderProjects(filterValue);
        });
    });

    /* ==========================================================================
       8. CONTACT FORM VALIDATION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const smsConsent = document.getElementById('smsConsent').checked;
            
            if (!smsConsent) {
                formStatus.className = 'form-status error';
                formStatus.innerText = 'Please agree to receive SMS communications to proceed.';
                return;
            }

            // Simulate form submission
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.innerText = 'Thank you! Your inquiry has been submitted successfully. A luxury consultant will contact you shortly.';
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1500);
        });
    }

    /* ==========================================================================
       9. SET CURRENT YEAR IN FOOTER
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }

});
