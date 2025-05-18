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
    // mobileMenu is already defined above
    // toggleMobileMenu is already defined above

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // --- Active Navigation Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a.nav-link'); // Desktop and mobile links

    function changeNavActiveState() {
        let currentSectionId = '';
        const navbarHeight = document.querySelector('nav')?.offsetHeight || 70; // Approx height for offset
        const scrollBuffer = 50; // Additional buffer to trigger active state a bit earlier

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - scrollBuffer;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Handle case for the very top of the page or if no section is matched
        if (!currentSectionId && sections.length > 0) {
            if (window.pageYOffset < sections[0].offsetTop - navbarHeight - scrollBuffer) {
                 currentSectionId = sections[0].getAttribute('id'); // Default to the first section if above it
            } else if (window.pageYOffset >= (document.body.scrollHeight - window.innerHeight - navbarHeight - scrollBuffer)) {
                // If at the very bottom, keep the last section active or the contact section if it's last
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }


        navLinks.forEach(link => {
            link.classList.remove('active'); // Custom class for active state styling
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', changeNavActiveState);
    window.addEventListener('load', changeNavActiveState); // Initial check on load

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
        // Read the number of initial items from data-attribute, default to 1 if not set
        const initialItemsToShow = parseInt(section.dataset.initialItems) || 1; 

        // Only proceed if there are items and a button, and more items than initially shown
        if (!items.length || !button || items.length <= initialItemsToShow) {
            if (button) button.style.display = 'none'; // Hide button if not needed
            return; 
        }

        // Function to update visibility of items and button
        function updateItemVisibility() {
            const isMobile = window.innerWidth < 768; // md breakpoint from Tailwind
            
            items.forEach((item, index) => {
                if (isMobile) {
                    // On mobile, apply hidden-mobile class based on expanded state
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
                    // On desktop, always show all items
                    item.classList.remove('hidden-mobile');
                }
            });

            // Update button visibility and text
            if (isMobile) {
                button.style.display = 'block'; // Show button on mobile
                if (section.classList.contains('expanded')) {
                    button.textContent = 'Afficher Moins';
                } else {
                    button.textContent = 'Afficher Plus';
                }
            } else {
                button.style.display = 'none'; // Hide button on desktop
            }
        }
        
        // Event listener for the button
        button.addEventListener('click', () => {
            section.classList.toggle('expanded');
            updateItemVisibility(); 
        });

        // Initial setup and on resize
        updateItemVisibility();
        window.addEventListener('resize', updateItemVisibility);
    });


    // --- Simple Form Validation Feedback (Optional) ---
    // This is a very basic example. For robust validation, consider libraries or more detailed checks.
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;

            // Basic check for empty fields - you can add more specific validation
            if (!nameInput.value.trim()) {
                // You could add a class to highlight the input or show a message
                // e.g., nameInput.classList.add('border-red-500');
                isValid = false;
            } else {
                // e.g., nameInput.classList.remove('border-red-500'); // Remove error style
            }

            if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                // e.g., emailInput.classList.add('border-red-500');
                isValid = false;
            } else {
                // e.g., emailInput.classList.remove('border-red-500');
            }

            if (!messageInput.value.trim()) {
                // e.g., messageInput.classList.add('border-red-500');
                isValid = false;
            } else {
                // e.g., messageInput.classList.remove('border-red-500');
            }

            if (!isValid) {
                event.preventDefault(); // Prevent form submission if validation fails
                // alert('Veuillez remplir tous les champs requis correctement.'); // Simple alert, consider a more user-friendly message display
                // For a better UX, display error messages next to the respective fields.
            }
            // If using FormSubmit.co, it handles its own success/error messaging after submission.
        });
    }

});
