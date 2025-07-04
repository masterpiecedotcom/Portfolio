document.addEventListener('DOMContentLoaded', function () {
    // --- Smooth scrolling for anchor links ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const mobileMenu = document.getElementById('mobile-menu'); 

    // Function to toggle mobile menu (defined here for broader access)
    function toggleMobileMenu() {
        const menuIcon = document.getElementById('mobile-menu-button')?.querySelector('i');
        if (mobileMenu && menuIcon) {
            mobileMenu.classList.toggle('hidden'); // Tailwind's hidden class
            mobileMenu.classList.toggle('active'); // Custom class to track state

            // Change icon based on menu state
            if (mobileMenu.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times'); // Change to 'X' icon
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars'); // Change back to 'bars' icon
            }
        }
    }

    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                // Check if the screen width is less than 768px (common mobile breakpoint)
                const isMobile = window.innerWidth < 768;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: isMobile ? 'auto' : 'smooth' // Conditional scroll behavior
                });

                // Close mobile menu if open after clicking a link
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // --- Mobile menu toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // --- Active Navigation Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a.nav-link'); 

    function changeNavActiveState() {
        let currentSectionId = '';
        const navbarHeight = document.querySelector('nav')?.offsetHeight || 70;
        const scrollBuffer = 50; 

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - scrollBuffer;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (!currentSectionId && sections.length > 0) {
            if (window.pageYOffset < sections[0].offsetTop - navbarHeight - scrollBuffer) {
                 currentSectionId = sections[0].getAttribute('id');
            } else if (window.pageYOffset >= (document.body.scrollHeight - window.innerHeight - navbarHeight - scrollBuffer)) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', changeNavActiveState);
    window.addEventListener('load', changeNavActiveState); 

    // --- Update Footer Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Collapsible Sections for Mobile ---
    const collapsibleSections = document.querySelectorAll('.collapsible-section');

    collapsibleSections.forEach(section => {
        const items = section.querySelectorAll('.collapsible-item');
        const button = section.querySelector('.show-more-less-button');
        const initialItemsToShow = parseInt(section.dataset.initialItems) || 1; 

        if (!items.length || !button || items.length <= initialItemsToShow) {
            if (button) button.style.display = 'none';
            return; 
        }

        // *** UPDATED PART ***
        const showMoreText = button.dataset.showMore || 'Show More';
        const showLessText = button.dataset.showLess || 'Show Less';

        function updateItemVisibility() {
            const isMobile = window.innerWidth < 768;
            
            items.forEach((item, index) => {
                if (isMobile) {
                    if (section.classList.contains('expanded')) {
                        item.classList.remove('hidden-mobile');
                    } else {
                        if (index >= initialItemsToShow) {
                            item.classList.add('hidden-mobile');
                        } else {
                            item.classList.remove('hidden-mobile');
                        }
                    }
                } else {
                    item.classList.remove('hidden-mobile');
                }
            });

            if (isMobile) {
                button.style.display = 'block';
                if (section.classList.contains('expanded')) {
                    button.textContent = showLessText;
                } else {
                    button.textContent = showMoreText;
                }
            } else {
                button.style.display = 'none';
            }
        }
        
        button.addEventListener('click', () => {
            section.classList.toggle('expanded');
            updateItemVisibility(); 
        });

        updateItemVisibility();
        window.addEventListener('resize', updateItemVisibility);
    });

    // --- Simple Form Validation Feedback ---
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;

            if (!nameInput.value.trim()) isValid = false;
            if (!emailInput.value.trim() || !emailInput.value.includes('@')) isValid = false;
            if (!messageInput.value.trim()) isValid = false;

            if (!isValid) {
                event.preventDefault(); 
            }
        });
    }
});