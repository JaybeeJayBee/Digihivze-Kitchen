document.addEventListener('DOMContentLoaded', () => {
    const navPlaceholder = document.getElementById('nav-system-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Function to run the copyright script after the footer is loaded
    function setupFooter() {
        const currentYear = new Date().getFullYear();
        // Target the ID used in the new footer HTML
        const copyrightElement = document.getElementById('copyright-notice'); 
        if (copyrightElement) {
             copyrightElement.textContent = `© ${currentYear} Digihivze. All Rights Reserved.`;
        }
    }

    // Function to inject component HTML from a source file
    const injectComponent = (placeholder, sourceFile) => {
        fetch(`components/${sourceFile}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                if (sourceFile === 'nav.html') {
                    setupNavigation(); // Setup Nav after injection
                }
                if (sourceFile === 'footer.html') {
                    setupFooter(); // Setup Footer text after injection
                }
            })
            .catch(error => console.error(`Could not load ${sourceFile}:`, error));
    };

    // Load components
    injectComponent(navPlaceholder, 'nav.html');
    injectComponent(footerPlaceholder, 'footer.html');

    // --- Navigation System Logic (Visibility, Open/Close) ---
    function setupNavigation() {
        const floatingIcon = document.getElementById('floating-nav-icon');
        const navOverlay = document.getElementById('nav-overlay');
        const closeButton = document.getElementById('nav-close-btn');

        if (!floatingIcon || !navOverlay || !closeButton) return;

        // Open/Close Handlers
        floatingIcon.addEventListener('click', () => {
            navOverlay.classList.add('open');
            floatingIcon.style.display = 'none';
        });

        closeButton.addEventListener('click', () => {
            navOverlay.classList.remove('open');
            setTimeout(() => {
                floatingIcon.style.display = 'flex'; 
            }, 500); 
        });

        // Visibility Control (Corrected Scroll Logic)
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (navOverlay.classList.contains('open')) return;

            if (scrollTop > lastScrollTop) {
                // Scrolling DOWN - ICON DISAPPEARS
                floatingIcon.classList.add('hidden');
            } 
            else if (scrollTop < lastScrollTop) {
                // Scrolling UP - ICON REAPPEARS
                floatingIcon.classList.remove('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
        });

        // --- NEW: Reviews Submenu Toggle Logic ---
        const reviewsToggle = document.getElementById('reviews-toggle');
        const reviewsParent = document.querySelector('.has-submenu');

        if (reviewsToggle && reviewsParent) {
            reviewsToggle.addEventListener('click', (e) => {
                e.preventDefault(); // Stop navigation to '#'

                // Toggle the 'active' class on the parent <li> element
                reviewsParent.classList.toggle('active');
            });
        }
    }
});
