document.addEventListener('DOMContentLoaded', () => {
    // --- Intersection Observer for Challenge Videos ---
    const challengeVideos = document.querySelectorAll('.challenge-video');

    if (challengeVideos.length > 0) {
        const videoObserverOptions = {
            root: null, // relative to document viewport
            rootMargin: '0px',
            threshold: 0.5 // Trigger when 50% of the video is visible
        };

        const videoObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // Play the video if it's intersecting and hasn't played yet or is paused
                    // Using a promise to handle potential play() errors
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            // Autoplay was prevented or other error
                            console.error("Video play failed:", error);
                            // Optionally hide video or show controls if play fails
                        });
                    }
                } else {
                    // Pause the video if it's not intersecting
                    video.pause();
                }
            });
        };

        const videoObserver = new IntersectionObserver(videoObserverCallback, videoObserverOptions);

        challengeVideos.forEach(video => {
            videoObserver.observe(video);
        });
    }

    const videos = document.querySelectorAll('.challenge-video');
    
    videos.forEach(video => {
        video.addEventListener('loadeddata', () => {
            video.classList.add('loaded');
            video.play().catch(err => {
                console.warn('Auto-play failed:', err);
            });
        });

        video.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            video.style.display = 'none';
        });
    });

    // --- Keep your existing script.js code below ---
    // (Header scroll effect, mobile menu, swiper init, etc.)
    // ... your other JavaScript code ...

}); // End DOMContentLoaded
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
        // Check if there are images to cycle through
        if (heroImages.length > 0) {
            // Get the current image element
            const currentImage = heroImages[currentImageIndex];
            // Make it fade out
            currentImage.classList.remove('opacity-100', 'active'); // Remove visibility classes
            currentImage.classList.add('opacity-0');

            // Calculate the index for the next image, wrapping around
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;

            // Get the next image element
            const nextImage = heroImages[currentImageIndex];
            // Make it fade in
            nextImage.classList.remove('opacity-0');
            nextImage.classList.add('opacity-100', 'active'); // Add visibility classes
        }
    }

    // Only start the interval if there's more than one image
    if (heroImages.length > 1) {
        // --- Initial Setup ---
        // Ensure only the first image is visible initially, regardless of HTML state
        heroImages.forEach((img, index) => {
            if (index === currentImageIndex) { // Check against the starting index
                img.classList.add('opacity-100', 'active');
                img.classList.remove('opacity-0');
            } else {
                img.classList.add('opacity-0');
                img.classList.remove('opacity-100', 'active');
            }
        });
        // Start the slideshow timer
        setInterval(changeHeroImage, slideInterval);
    } else if (heroImages.length === 1) {
        // If there's only one image, make sure it's visible
        heroImages[0].classList.add('opacity-100', 'active');
        heroImages[0].classList.remove('opacity-0');
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
