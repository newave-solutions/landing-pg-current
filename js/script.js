// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    } else {
        console.error("Mobile menu button or menu element not found.");
    }

    // --- Smooth Scroll & Menu Close Logic ---
    const navLinks = document.querySelectorAll('#mobile-menu a, header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu if open and if the menu element exists
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }

            // Smooth scroll for internal links
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    // Calculate scroll position considering fixed header height (approx 80px from body padding)
                    const headerOffset = 80; // Must match body padding-top in CSS
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                } else {
                     console.warn(`Smooth scroll target not found for href: ${href}`);
                }
            }
        });
    });

    // --- Hero Background Slideshow ---
    const heroImages = document.querySelectorAll('#hero .hero-bg-image');
    let currentImageIndex = 0;
    const slideInterval = 3000; // 3 seconds

    function changeHeroImage() {
        if (heroImages.length > 0) {
            // Fade out current image
            heroImages[currentImageIndex].classList.remove('opacity-100');
            heroImages[currentImageIndex].classList.add('opacity-0');
            heroImages[currentImageIndex].classList.remove('active'); // Optional: if using 'active' class

            // Increment index and wrap around
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;

            // Fade in next image
            heroImages[currentImageIndex].classList.remove('opacity-0');
            heroImages[currentImageIndex].classList.add('opacity-100');
            heroImages[currentImageIndex].classList.add('active'); // Optional: if using 'active' class
        }
    }

    if (heroImages.length > 1) { // Only run slideshow if there's more than one image
        setInterval(changeHeroImage, slideInterval);
    }


    // --- Testimonial Swiper Initialization ---
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.testimonial-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    } else {
        console.error("Swiper library not loaded.");
    }


    // --- Dynamic Header Text Color Logic ---
    const header = document.getElementById('main-header');
    // Query sections and footer for theme detection
    const themedSections = document.querySelectorAll('section[data-header-theme], footer[data-header-theme]');

    if (header && themedSections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -85% 0px', // Trigger when section enters top ~15% below header
            threshold: 0
        };

        const observerCallback = (entries) => {
            let isLightSectionVisible = false;
            entries.forEach(entry => {
                // Check if the intersecting element's theme is light
                if (entry.isIntersecting && entry.target.getAttribute('data-header-theme') === 'light') {
                    isLightSectionVisible = true;
                }
            });

            // Add/remove class based on whether *any* light section is visible in the target area
            if (isLightSectionVisible) {
                 header.classList.add('header-inverted');
            } else {
                 header.classList.remove('header-inverted');
            }
        };

        const headerObserver = new IntersectionObserver(observerCallback, observerOptions);

        themedSections.forEach(section => {
            headerObserver.observe(section);
        });
    } else {
         if (!header) console.error("Header element #main-header not found.");
         if (themedSections.length === 0) console.warn("No sections with data-header-theme found for dynamic header.");
    }

}); // End DOMContentLoaded
