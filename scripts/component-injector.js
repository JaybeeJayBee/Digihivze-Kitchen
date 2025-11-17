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
                    highlightCurrentPage(); // *** NEW: Highlight the current page after setup ***
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


    // --- NEW: Highlight Current Page Logic (ULTIMATE FIX FOR PROJECT PAGES) ---
    function highlightCurrentPage() {
        const currentPathname = window.location.pathname.toLowerCase();
        
        // Find the base segment of the current URL after the repository name
        // Example: /jaybeejaybee/digihivze-kitchen/creations-hub/
        // Current base path will be: /creations-hub/ (or / for index)
        let currentPageSegment = currentPathname.substring(currentPathname.lastIndexOf('/') + 1);

        // Normalize for Home/Index page access
        if (currentPageSegment === '' || currentPageSegment === 'index.html') {
            currentPageSegment = '/';
        } else {
            // Remove potential trailing slash and normalize the segment
            currentPageSegment = '/' + currentPageSegment.replace(/\/$/, '');
        }
        
        const menuLinks = document.querySelectorAll('.overlay-menu a');

        menuLinks.forEach(link => {
            let linkPath = link.getAttribute('href').toLowerCase();

            // Normalize link path (e.g., convert '/faq' to 'faq')
            let normalizedLinkPath = linkPath.replace(/^\/|\/$/g, '').replace('.html', '');
            
            // Special handling for the Home link ('/')
            if (linkPath === '/' && currentPageSegment === '/') {
                link.classList.add('active-page');
            } 
            // General link comparison: check if the current URL ends with the link path
            else if (normalizedLinkPath.length > 0) {
                // Check if the current full path contains the link's base path segment
                if (currentPathname.endsWith(normalizedLinkPath) || currentPathname.endsWith(normalizedLinkPath + '/')) {
                    link.classList.add('active-page');
                }
            }
        });
    }

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


        // Helper function to ensure only one submenu is open at a time
        function closeOtherSubmenus(currentOpenParent) {
            document.querySelectorAll('.has-submenu.active').forEach(parent => {
                if (parent !== currentOpenParent) {
                    parent.classList.remove('active');
                }
            });
        }
        
        // --- Programs & Offers Submenu Toggle Logic ---
        const programsToggle = document.getElementById('programs-toggle');
        const programsParent = programsToggle ? programsToggle.closest('.has-submenu') : null;

        if (programsToggle && programsParent) {
            programsToggle.addEventListener('click', (e) => {
                e.preventDefault(); 
                closeOtherSubmenus(programsParent);
                programsParent.classList.toggle('active');
            });
        }

        // --- Reviews Submenu Toggle Logic (Updated for single-open functionality) ---
        const reviewsToggle = document.getElementById('reviews-toggle');
        const reviewsParent = reviewsToggle ? reviewsToggle.closest('.has-submenu') : null;

        if (reviewsToggle && reviewsParent) {
            reviewsToggle.addEventListener('click', (e) => {
                e.preventDefault(); 
                closeOtherSubmenus(reviewsParent); 
                reviewsParent.classList.toggle('active');
            });
        }
    }
});
