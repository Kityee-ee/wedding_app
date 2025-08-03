// ===== BUBBLE SIGN-IN FUNCTIONALITY =====

class BubbleSignIn {
    constructor() {
        this.bubbles = document.querySelectorAll('.bubble');
        this.checkinForm = document.getElementById('checkin-form');
        this.nameInput = document.getElementById('guest-name');
        this.submitButton = document.getElementById('submit-checkin');
        this.checkedInGuests = [];
        this.init();
    }

    init() {
        this.loadCheckedInGuests();
        this.setupEventListeners();
        this.animateBubbles();
        console.log('Bubble sign-in initialized');
    }

    setupEventListeners() {
        // Bubble click events
        this.bubbles.forEach(bubble => {
            bubble.addEventListener('click', (e) => {
                this.handleBubbleClick(e);
            });
        });

        // Form submission
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCheckIn();
            });
        }

        // Enter key on input
        if (this.nameInput) {
            this.nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleCheckIn();
                }
            });
        }
    }

    handleBubbleClick(event) {
        const bubble = event.currentTarget;
        const guestId = bubble.dataset.guest;
        
        // Check if already checked in
        if (this.isGuestCheckedIn(guestId)) {
            this.showMessage('This guest has already checked in!', 'warning');
            return;
        }

        // Animate bubble
        this.animateBubbleClick(bubble);
        
        // Show check-in form
        this.showCheckInForm(guestId);
    }

    animateBubbleClick(bubble) {
        // Add click animation
        bubble.style.transform = 'scale(0.8)';
        bubble.style.filter = 'brightness(1.2)';
        
        setTimeout(() => {
            bubble.style.transform = '';
            bubble.style.filter = '';
        }, 200);

        // Add ripple effect
        this.createRippleEffect(bubble);
    }

    createRippleEffect(bubble) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = bubble.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2;
        const y = rect.height / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x - size / 2 + 'px';
        ripple.style.top = y - size / 2 + 'px';

        bubble.style.position = 'relative';
        bubble.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    showCheckInForm(guestId) {
        if (this.checkinForm) {
            this.checkinForm.style.display = 'block';
            this.checkinForm.dataset.guestId = guestId;
            
            // Focus on input
            if (this.nameInput) {
                this.nameInput.focus();
                this.nameInput.value = '';
            }

            // Add fade-in animation
            this.checkinForm.classList.add('fade-in');
        }
    }

    handleCheckIn() {
        const guestId = this.checkinForm.dataset.guestId;
        const guestName = this.nameInput.value.trim();

        if (!guestName) {
            this.showMessage('Please enter your name', 'error');
            return;
        }

        if (guestName.length < 2) {
            this.showMessage('Name must be at least 2 characters', 'error');
            return;
        }

        // Save guest check-in
        const guestData = {
            id: guestId,
            name: guestName,
            timestamp: new Date().toISOString(),
            bubble: this.getBubbleEmoji(guestId)
        };

        this.checkedInGuests.push(guestData);
        this.saveCheckedInGuests();

        // Update bubble appearance
        this.updateBubbleAfterCheckIn(guestId, guestName);

        // Hide form
        this.hideCheckInForm();

        // Show success message
        this.showMessage(`Welcome, ${guestName}! 💕`, 'success');

        // Trigger app event
        if (window.weddingApp) {
            window.weddingApp.showMessage(`Welcome, ${guestName}! 💕`, 'success');
        }
    }

    updateBubbleAfterCheckIn(guestId, guestName) {
        const bubble = document.querySelector(`[data-guest="${guestId}"]`);
        if (bubble) {
            // Change bubble appearance
            bubble.style.background = 'linear-gradient(135deg, #4ECDC4, #44A08D)';
            bubble.style.transform = 'scale(1.1)';
            bubble.style.boxShadow = '0 6px 20px rgba(78, 205, 196, 0.4)';
            
            // Add check mark
            bubble.innerHTML = '✅';
            bubble.title = `Checked in: ${guestName}`;
            
            // Remove click event
            bubble.style.cursor = 'default';
            bubble.removeEventListener('click', this.handleBubbleClick);
        }
    }

    hideCheckInForm() {
        if (this.checkinForm) {
            this.checkinForm.style.display = 'none';
            this.checkinForm.classList.remove('fade-in');
        }
    }

    getBubbleEmoji(guestId) {
        const bubble = document.querySelector(`[data-guest="${guestId}"]`);
        return bubble ? bubble.textContent : '👋';
    }

    isGuestCheckedIn(guestId) {
        return this.checkedInGuests.some(guest => guest.id === guestId);
    }

    loadCheckedInGuests() {
        try {
            const saved = localStorage.getItem('wedding_checked_in_guests');
            if (saved) {
                this.checkedInGuests = JSON.parse(saved);
                this.updateCheckedInBubbles();
            }
        } catch (error) {
            console.warn('Could not load checked in guests:', error);
        }
    }

    saveCheckedInGuests() {
        try {
            localStorage.setItem('wedding_checked_in_guests', JSON.stringify(this.checkedInGuests));
        } catch (error) {
            console.warn('Could not save checked in guests:', error);
        }
    }

    updateCheckedInBubbles() {
        this.checkedInGuests.forEach(guest => {
            this.updateBubbleAfterCheckIn(guest.id, guest.name);
        });
    }

    animateBubbles() {
        // Add staggered animation delays
        this.bubbles.forEach((bubble, index) => {
            bubble.style.animationDelay = `${index * 0.2}s`;
        });
    }

    showMessage(message, type = 'info') {
        if (window.weddingApp) {
            window.weddingApp.showMessage(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Get statistics
    getCheckInStats() {
        return {
            total: this.bubbles.length,
            checkedIn: this.checkedInGuests.length,
            percentage: Math.round((this.checkedInGuests.length / this.bubbles.length) * 100)
        };
    }

    // Reset all check-ins (for testing)
    resetCheckIns() {
        this.checkedInGuests = [];
        this.saveCheckedInGuests();
        
        this.bubbles.forEach(bubble => {
            bubble.style.background = '';
            bubble.style.transform = '';
            bubble.style.boxShadow = '';
            bubble.innerHTML = bubble.dataset.originalEmoji || '👋';
            bubble.style.cursor = 'pointer';
            bubble.title = '';
        });
        
        this.hideCheckInForm();
    }
}

// ===== CSS ANIMATIONS =====

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZATION =====

// Initialize bubble sign-in when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to initialize
    setTimeout(() => {
        if (window.weddingApp) {
            window.bubbleSignIn = new BubbleSignIn();
        }
    }, 100);
}); 