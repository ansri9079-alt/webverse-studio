document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const cursorGlow = document.getElementById('cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // Cursor hover effect
    const links = document.querySelectorAll('a, button, input, textarea, .glass-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(4)';
            cursor.style.background = 'rgba(139, 92, 246, 0.3)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--white)';
        });
    });

    // --- Particle Background ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 150;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4';
            this.opacity = Math.random();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // --- Scroll Progress & Navbar ---
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const counterObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'), 10);
                const suffix = target.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    // Quadratic ease-out
                    const easeProgress = progress * (2 - progress);
                    
                    const currentValue = Math.floor(easeProgress * countTo);
                    target.textContent = currentValue + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        target.textContent = countTo + suffix;
                    }
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(target);
            }
        });
    }, counterObserverOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // --- Skills Progress Bars Animation ---
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const progress = fill.getAttribute('data-progress');
                fill.style.width = progress;
                observer.unobserve(fill);
            }
        });
    }, skillObserverOptions);

    skillFills.forEach(fill => skillObserver.observe(fill));

    // --- Universe Configurator Logic ---
    const configCards = document.querySelectorAll('.config-card');
    const summaryType = document.getElementById('summary-type');
    const summaryVisual = document.getElementById('summary-visual');
    const summaryAddons = document.getElementById('summary-addons');
    const calcPriceEl = document.getElementById('calc-price');
    const btnTransmit = document.getElementById('btn-transmit-scope');
    const contactMessage = document.getElementById('contact-message');

    let configuratorPrice = 1500;

    function animatePrice(newPrice) {
        const duration = 600; // 0.6 seconds
        const startTime = performance.now();
        const startPrice = configuratorPrice;

        const updatePrice = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            // Cubic ease-out
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(startPrice + easeProgress * (newPrice - startPrice));
            calcPriceEl.textContent = currentVal.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updatePrice);
            } else {
                calcPriceEl.textContent = newPrice.toLocaleString();
                configuratorPrice = newPrice;
            }
        };
        requestAnimationFrame(updatePrice);
    }

    function updateConfigurator() {
        let price = 0;
        let selectedType = "";
        let selectedVisual = "";
        let selectedAddons = [];

        configCards.forEach(card => {
            const type = card.getAttribute('data-type');
            const cost = parseInt(card.getAttribute('data-cost'), 10);
            const name = card.getAttribute('data-name');

            if (card.classList.contains('active')) {
                price += cost;
                if (type === 'type') selectedType = name;
                if (type === 'visual') selectedVisual = name;
                if (type === 'addon') selectedAddons.push(name);
            }
        });

        // Update summary text
        if (summaryType) summaryType.textContent = selectedType;
        if (summaryVisual) summaryVisual.textContent = selectedVisual;
        if (summaryAddons) {
            summaryAddons.textContent = selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None';
        }

        // Animate price update
        animatePrice(price);
    }

    configCards.forEach(card => {
        card.addEventListener('click', () => {
            const isMultiple = card.classList.contains('select-multiple');
            const cardType = card.getAttribute('data-type');

            if (isMultiple) {
                card.classList.toggle('active');
            } else {
                // Single select - disable others of same type
                configCards.forEach(sibling => {
                    if (sibling.getAttribute('data-type') === cardType) {
                        sibling.classList.remove('active');
                    }
                });
                card.classList.add('active');
            }

            updateConfigurator();
        });
    });

    if (btnTransmit) {
        btnTransmit.addEventListener('click', () => {
            const type = summaryType ? summaryType.textContent : '';
            const visual = summaryVisual ? summaryVisual.textContent : '';
            const addons = summaryAddons ? summaryAddons.textContent : '';
            const price = calcPriceEl ? calcPriceEl.textContent : '';

            const message = `Greetings Faizan,\n\nI have configured my project details using the Universe Configurator:\n- Project Type: ${type}\n- Visual Complexity: ${visual}\n- Selected Integrations: ${addons}\n- Estimated Orbit Budget: $${price}\n\nLet's launch this digital universe!`;

            if (contactMessage) {
                contactMessage.value = message;
                
                // Trigger focus animation or active state for contact input/textarea
                const cursor = document.getElementById('custom-cursor');
                if (cursor) {
                    cursor.style.transform = 'scale(1.5)';
                }
            }

            // Smooth scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Focus name input after scroll
                setTimeout(() => {
                    const nameInput = document.querySelector('.contact-form input[type="text"]');
                    if (nameInput) nameInput.focus();
                }, 800);
            }
        });
    }

    // Initialize custom cursor interaction with configurator cards
    const updateCursorHoverEffects = () => {
        const interactiveEls = document.querySelectorAll('a, button, input, textarea, .glass-card, .config-card');
        const cursor = document.getElementById('custom-cursor');
        
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursor) {
                    cursor.style.transform = 'scale(4)';
                    cursor.style.background = 'rgba(139, 92, 246, 0.3)';
                }
            });
            el.addEventListener('mouseleave', () => {
                if (cursor) {
                    cursor.style.transform = 'scale(1)';
                    cursor.style.background = 'var(--white)';
                }
            });
        });
    };

    updateCursorHoverEffects();

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
