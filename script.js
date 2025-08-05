// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeTheme();
    initializeNavigation();
    initializeTypingAnimation();
    initializeSkillBars();
    initializeScrollEffects();
    initializeScrollProgress();
    initializeContactForm();
    initializeAOS();
    
    // Remove loading screen immediately after initialization
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 200);
});

// Fallback to ensure loading screen is removed even if there are issues
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            console.log('Loading screen removed by fallback');
        }
    }, 500);
});

// Removed initializeLoading function - loading screen now auto-hides

// Theme Toggle Functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        html.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            html.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
        
        // Add animation to theme toggle button
        themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

// Navigation Functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link highlighting
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href');
            const section = document.querySelector(sectionId);
            
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
    
    // Navbar background on scroll
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.style.background = 'var(--bg-overlay)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'var(--bg-overlay)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
    
    // Add scroll event listeners
    window.addEventListener('scroll', function() {
        updateActiveLink();
        updateNavbarBackground();
    });
    
    // Initial call to set active link
    updateActiveLink();
}

// Typing Animation
function initializeTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    const texts = [
        'Software Engineer',
        'Full Stack Developer',
        'Java Expert',
        'React Developer',
        'Problem Solver',
        'Tech Enthusiast'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next word
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    // Start typing animation
    typeText();
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            const rect = bar.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if element is in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                bar.style.width = width + '%';
            }
        });
    }
    
    // Use Intersection Observer for better performance
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillProgress = entry.target.querySelector('.skill-progress');
                if (skillProgress) {
                    const width = skillProgress.getAttribute('data-width');
                    skillProgress.style.width = width + '%';
                }
            }
        });
    }, observerOptions);
    
    // Observe all skill items
    document.querySelectorAll('.skill-item').forEach(item => {
        observer.observe(item);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Show/hide scroll to top button
    function toggleScrollToTop() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add scroll event listener
    window.addEventListener('scroll', toggleScrollToTop);
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }
    
    // Add parallax scroll listener (throttled for performance)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                parallaxEffect();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    // Form validation
    function validateForm(formData) {
        const errors = {};
        
        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }
        
        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Subject validation
        if (!formData.subject.trim()) {
            errors.subject = 'Subject is required';
        } else if (formData.subject.trim().length < 5) {
            errors.subject = 'Subject must be at least 5 characters';
        }
        
        // Message validation
        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters';
        }
        
        return errors;
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Display validation errors
    function displayErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
        
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
            input.classList.remove('error');
        });
        
        // Display new errors
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(field + 'Error');
            const inputElement = document.getElementById(field);
            
            if (errorElement && inputElement) {
                errorElement.textContent = errors[field];
                errorElement.classList.add('show');
                inputElement.classList.add('error');
            }
        });
    }
    
    // Simulate form submission
    function simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                console.log('Form submitted with data:', formData);
                resolve({ success: true });
            }, 2000);
        });
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        const errors = validateForm(formData);
        
        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            return;
        }
        
        // Clear any previous errors
        displayErrors({});
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await simulateFormSubmission(formData);
            
            // Show success message
            formSuccess.classList.add('show');
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                formSuccess.classList.remove('show');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting the form. Please try again.');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            const errors = validateForm(formData);
            const fieldName = this.getAttribute('name');
            
            // Clear error for this field if it's now valid
            if (!errors[fieldName]) {
                const errorElement = document.getElementById(fieldName + 'Error');
                if (errorElement) {
                    errorElement.classList.remove('show');
                    this.classList.remove('error');
                }
            }
        });
    });
}

// AOS (Animate On Scroll) Initialization
function initializeAOS() {
    // Wait for AOS library to load or timeout after 2 seconds
    const initAOS = () => {
        if (typeof AOS !== 'undefined') {
            try {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 100,
                    delay: 100
                });
                
                // Refresh AOS on window resize
                window.addEventListener('resize', function() {
                    AOS.refresh();
                });
                
                console.log('AOS initialized successfully');
            } catch (error) {
                console.warn('AOS initialization failed:', error);
            }
        } else {
            console.warn('AOS library not loaded, animations will be skipped');
        }
    };
    
    // Try to initialize immediately if AOS is already available
    if (typeof AOS !== 'undefined') {
        initAOS();
    } else {
        // Wait for AOS to load with a timeout
        let attempts = 0;
        const maxAttempts = 20; // 2 seconds total
        const checkAOS = setInterval(() => {
            attempts++;
            if (typeof AOS !== 'undefined' || attempts >= maxAttempts) {
                clearInterval(checkAOS);
                initAOS();
            }
        }, 100);
    }
}

// Scroll Progress Indicator
function initializeScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    }
    
    // Update scroll progress on scroll
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initial call
    updateScrollProgress();
}

// Resume Download Functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('a[download]')) {
        // Analytics tracking for resume download
        console.log('Resume downloaded');
        
        // You can add analytics tracking here
        // Example: gtag('event', 'download', { 'event_category': 'resume' });
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Performance Optimizations
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for high-frequency events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy load images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy load function
lazyLoadImages();

// Smooth scroll polyfill for older browsers
function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Load smooth scroll polyfill
        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=smoothscroll';
        document.head.appendChild(script);
    }
}

// Initialize smooth scroll polyfill
smoothScrollPolyfill();

// Error handling for missing elements
function safeElementOperation(elementId, operation) {
    const element = document.getElementById(elementId);
    if (element) {
        operation(element);
    } else {
        console.warn(`Element with id '${elementId}' not found`);
    }
}

// Browser compatibility checks
function checkBrowserSupport() {
    // Check for CSS custom properties support
    if (!CSS.supports('color', 'var(--fake-var)')) {
        console.warn('CSS custom properties not supported');
        // Add fallback styles if needed
    }
    
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported');
        // Fallback to scroll events
    }
}

// Initialize browser compatibility checks
checkBrowserSupport();

// Console welcome message
console.log('%c👨‍💻 Welcome to Asad Nakade\'s Portfolio!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cInterested in the code? Check out the source!', 'color: #64748b; font-size: 14px;');
