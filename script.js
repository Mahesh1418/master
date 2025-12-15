// Initialize smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, .menu-toggle, .project-card, .service-header');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        follower.classList.add('cursor-hover');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        follower.classList.remove('cursor-hover');
    });
});

// Preloader and Hero Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // Preloader Counter
    let counter = { value: 0 };
    tl.to(counter, {
        value: 100,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
            document.querySelector('.counter').textContent = Math.round(counter.value) + "%";
        }
    })
        .to('.preloader', {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut"
        })
        .to('body', {
            className: '-=loading',
            duration: 0.1
        }, "-=0.5")
        .from('.hero-title .line span', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        })
        .from('.hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5")
        .from('.hero-cta', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6")
        .from('.floating-shape', {
            scale: 0,
            opacity: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)",
            stagger: 0.2
        }, "-=1");
});

// Process Steps Animation
const steps = document.querySelectorAll('.step');
steps.forEach(step => {
    gsap.from(step, {
        scrollTrigger: {
            trigger: step,
            start: "top 90%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Insights Animation
gsap.from('.insight-card', {
    scrollTrigger: {
        trigger: '.insights-grid',
        start: "top 85%"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// Marquee Animation
gsap.to('.marquee-content', {
    xPercent: -50,
    repeat: -1,
    duration: 20,
    ease: "linear"
});

// About Section Text Reveal
const revealElements = document.querySelectorAll('.reveal-text');
revealElements.forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Stats Counter Animation
const stats = document.querySelectorAll('.stat-item');
stats.forEach(stat => {
    // Reveal Fade In
    gsap.from(stat, {
        scrollTrigger: {
            trigger: stat,
            start: "top 85%"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
    });

    // Number Counter
    const numberEl = stat.querySelector('.stat-number');
    if (numberEl) { // Check if element exists to avoid errors
        const target = parseFloat(numberEl.dataset.target);
        const suffix = numberEl.dataset.suffix || "";
        const decimals = parseInt(numberEl.dataset.decimals) || 0;

        let counter = { val: 0 };

        gsap.to(counter, {
            val: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: stat,
                start: "top 85%"
            },
            onUpdate: () => {
                numberEl.textContent = counter.val.toFixed(decimals) + suffix;
            }
        });
    }
});

// Work Section Horizontal Scroll & Parallax
const workSection = document.querySelector('.work');
const workGallery = document.querySelector('.work-gallery');
const workBgText = document.querySelector('.work-bg-text');

// Calculate width to scroll
function getScrollAmount() {
    let workWidth = workGallery.scrollWidth;
    return -(workWidth - window.innerWidth);
}

// Only enable horizontal scroll on desktop
if (window.innerWidth > 768) {
    const tween = gsap.to(workGallery, {
        x: getScrollAmount,
        duration: 3,
        ease: "none",
    });

    ScrollTrigger.create({
        trigger: ".work",
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            // Skew effect based on velocity
            const skew = self.getVelocity() / 300;
            gsap.to(workGallery, { skewX: skew, duration: 0.1, overwrite: 'auto' });

            // Background Parallax
            gsap.to(workBgText, { x: -self.progress * 200, duration: 0.1, overwrite: 'auto' });
        },
        onScrubComplete: () => {
            gsap.to(workGallery, { skewX: 0, duration: 0.5, ease: "power1.out" });
        }
    });
} else {
    // Mobile fallback or different behavior if needed
    // Currently, CSS handles the overflow-x: auto for standard scroll
    workGallery.style.overflowX = 'auto'; // Ensure standard scroll
}

// Services Accordion & Hover Effect
const serviceItems = document.querySelectorAll('.service-item');
const serviceHoverReveal = document.querySelector('.service-hover-reveal');
const serviceHoverInner = document.querySelector('.service-hover-inner');

serviceItems.forEach(item => {
    const header = item.querySelector('.service-header');
    const body = item.querySelector('.service-body');
    const icon = item.querySelector('.icon');
    const imageSrc = item.dataset.image;

    // Accordion Toggle
    header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        serviceItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.service-body').style.height = 0;
            otherItem.querySelector('.icon').style.transform = "rotate(0deg)";
        });

        if (!isOpen) {
            item.classList.add('active');
            body.style.height = body.scrollHeight + "px";
            icon.style.transform = "rotate(45deg)";
        }
    });

    // Hover Effect
    item.addEventListener('mouseenter', () => {
        serviceHoverReveal.classList.add('active');
        serviceHoverInner.style.backgroundImage = `url(${imageSrc})`;
    });

    item.addEventListener('mouseleave', () => {
        serviceHoverReveal.classList.remove('active');
    });

    item.addEventListener('mousemove', (e) => {
        gsap.to(serviceHoverReveal, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });
});

// Testimonial Carousel/Slider
const track = document.querySelector('.testimonial-track');
const slides = document.querySelectorAll('.testimonial-card');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
let currentSlide = 0;
const totalSlides = slides.length;

function updateSlide() {
    // Basic slider logic - move track based on index
    // Note: This logic assumes fixed width slides or percentage based. 
    // For specific "width: 80vw" and "gap", we can calculate offset.
    const slideWidth = slides[0].offsetWidth;
    gsap.to(track, {
        x: -(currentSlide * slideWidth),
        duration: 0.6,
        ease: "power2.out"
    });
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        } else {
            // Loop back
            currentSlide = 0;
            updateSlide();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        } else {
            currentSlide = totalSlides - 1;
            updateSlide();
        }
    });

    // Auto play (optional)
    setInterval(() => {
        // nextBtn.click(); // Uncomment for auto play
    }, 5000);
}


// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

menuToggle.addEventListener('click', () => {
    mobileMenuOverlay.classList.toggle('active');
    if (mobileMenuOverlay.classList.contains('active')) {
        menuToggle.textContent = 'Close';
    } else {
        menuToggle.textContent = 'Menu';
    }
});

mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        menuToggle.textContent = 'Menu';
    });
});


