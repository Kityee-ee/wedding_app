// ===== WEDDING APP - MAIN JAVASCRIPT =====

class WeddingApp {
    constructor() {
        this.currentSection = 'bubble-signin';
        this.sections = ['bubble-signin', 'couple-story', 'blessing-wall', 'photo-wall'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.hideLoadingScreen();
        this.loadSavedData();
        console.log('💕 Wedding App initialized successfully!');
    }

    setupEventListeners() {
        // Bottom navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Touch events for mobile
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Prevent pull-to-refresh on mobile
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.main-content')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    navigateToSection(sectionName) {
        // Update active section
        const currentSection = document.querySelector('.section.active');
        const targetSection = document.getElementById(sectionName);
        
        if (currentSection && targetSection) {
            currentSection.classList.remove('active');
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Update navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionName) {
                btn.classList.add('active');
            }
        });

        // Trigger section-specific events
        this.onSectionChange(sectionName);
    }

    onSectionChange(sectionName) {
        // Add fade-in animation
        const section = document.getElementById(sectionName);
        if (section) {
            section.classList.add('fade-in');
            setTimeout(() => {
                section.classList.remove('fade-in');
            }, 500);
        }

        // Section-specific logic
        switch (sectionName) {
            case 'bubble-signin':
                this.initBubbleSignIn();
                break;
            case 'couple-story':
                this.initCoupleStory();
                break;
            case 'blessing-wall':
                this.initBlessingWall();
                break;
            case 'photo-wall':
                this.initPhotoWall();
                break;
        }
    }

    initBubbleSignIn() {
        // Initialize bubble sign-in functionality
        console.log('Initializing bubble sign-in...');
    }

    initCoupleStory() {
        // Initialize couple's story functionality
        console.log('Initializing couple story...');
    }

    initBlessingWall() {
        // Initialize blessing wall functionality
        console.log('Initializing blessing wall...');
    }

    initPhotoWall() {
        // Initialize photo wall functionality
        console.log('Initializing photo wall...');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const appContainer = document.getElementById('app');
        
        if (loadingScreen && appContainer) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                appContainer.classList.add('loaded');
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500); // Show loading for 1.5 seconds
        }
    }

    loadSavedData() {
        // Load any saved data from localStorage
        try {
            const savedGuestName = localStorage.getItem('wedding_guest_name');
            if (savedGuestName) {
                console.log('Welcome back,', savedGuestName);
            }
        } catch (error) {
            console.warn('Could not load saved data:', error);
        }
    }

    // Utility methods
    showMessage(message, type = 'info') {
        // Create a simple toast message
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
            return false;
        }
    }

    getFromLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
            return null;
        }
    }

    // Performance monitoring
    logPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }
    }
}

// ===== APP INITIALIZATION =====

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the wedding app
    window.weddingApp = new WeddingApp();
    
    // Log performance after app loads
    setTimeout(() => {
        window.weddingApp.logPerformance();
    }, 1000);
});

// ===== ERROR HANDLING =====

window.addEventListener('error', (e) => {
    console.error('App error:', e.error);
    // Could send error to analytics service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send error to analytics service
});

// ===== SERVICE WORKER (Future) =====

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
} 