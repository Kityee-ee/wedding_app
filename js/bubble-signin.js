// ===== DYNAMIC BUBBLE SIGN-IN FUNCTIONALITY =====

class DynamicBubbleSignIn {
    constructor() {
        this.addBubbleBtn = document.getElementById('add-bubble-btn');
        this.bubbleModal = document.getElementById('bubble-modal');
        this.bubbleContainer = document.getElementById('bubble-container');
        this.formSection = document.getElementById('form-section');
        this.choiceBtns = document.querySelectorAll('.choice-btn');
        this.createBubbleBtn = document.getElementById('create-bubble-btn');
        this.cancelBubbleBtn = document.getElementById('cancel-bubble-btn');
        this.guestNameInput = document.getElementById('guest-name-input');
        this.guestEmojiInput = document.getElementById('guest-emoji');
        
        this.selectedChoice = null;
        this.bubbles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadExistingBubbles();
        console.log('Dynamic bubble sign-in initialized');
    }

    setupEventListeners() {
        // Add bubble button
        this.addBubbleBtn.addEventListener('click', () => {
            this.showModal();
        });

        // Choice buttons
        this.choiceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleChoiceSelection(e);
            });
        });

        // Form inputs
        this.guestNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.createBubble();
            }
        });

        // Create bubble button
        this.createBubbleBtn.addEventListener('click', () => {
            this.createBubble();
        });

        // Cancel button
        this.cancelBubbleBtn.addEventListener('click', () => {
            this.hideModal();
        });

        // Close modal on overlay click
        this.bubbleModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.hideModal();
            }
        });
    }

    showModal() {
        this.bubbleModal.style.display = 'flex';
        setTimeout(() => {
            this.bubbleModal.querySelector('.modal-content').classList.add('show');
        }, 10);
        
        // Reset form
        this.resetForm();
    }

    hideModal() {
        this.bubbleModal.querySelector('.modal-content').classList.remove('show');
        setTimeout(() => {
            this.bubbleModal.style.display = 'none';
        }, 300);
        
        this.resetForm();
    }

    handleChoiceSelection(event) {
        const btn = event.currentTarget;
        const choice = btn.dataset.choice;
        
        // Remove previous selection
        this.choiceBtns.forEach(b => b.classList.remove('selected'));
        
        // Add selection to clicked button
        btn.classList.add('selected');
        this.selectedChoice = choice;
        
        // Show form section
        this.formSection.style.display = 'block';
        this.guestNameInput.focus();
    }

    resetForm() {
        this.choiceBtns.forEach(btn => btn.classList.remove('selected'));
        this.selectedChoice = null;
        this.formSection.style.display = 'none';
        this.guestNameInput.value = '';
        this.guestEmojiInput.value = '';
    }

    createBubble() {
        const guestName = this.guestNameInput.value.trim();
        const guestEmoji = this.guestEmojiInput.value.trim();

        if (!this.selectedChoice) {
            this.showMessage('Please choose who you\'re celebrating with', 'error');
            return;
        }

        if (!guestName) {
            this.showMessage('Please enter your name', 'error');
            return;
        }

        if (guestName.length < 2) {
            this.showMessage('Name must be at least 2 characters', 'error');
            return;
        }

        // Create bubble data
        const bubbleData = {
            id: this.generateId(),
            name: guestName,
            emoji: guestEmoji,
            choice: this.selectedChoice,
            timestamp: new Date().toISOString(),
            color: this.selectedChoice === 'jacky' ? 'jacky-bubble' : 'eunice-bubble'
        };

        // Add to bubbles array
        this.bubbles.push(bubbleData);
        this.saveBubbles();

        // Create visual bubble
        this.createVisualBubble(bubbleData);

        // Hide modal
        this.hideModal();

        // Show confirmation
        this.showConfirmation(guestName);

        // Show greeting
        this.showGreetingMessage(guestName);
    }

    createVisualBubble(bubbleData) {
        const bubble = document.createElement('div');
        bubble.className = `bubble ${bubbleData.color}`;
        bubble.dataset.bubbleId = bubbleData.id;
        
        // Create bubble content
        const content = document.createElement('div');
        content.className = 'bubble-content';
        content.innerHTML = `
            <div class="bubble-name">${bubbleData.name}</div>
            ${bubbleData.emoji ? `<div class="bubble-emoji">${bubbleData.emoji}</div>` : ''}
        `;
        
        bubble.appendChild(content);
        
        // Add to container
        this.bubbleContainer.appendChild(bubble);
        
        // Add click event to show details
        bubble.addEventListener('click', () => {
            this.showBubbleDetails(bubbleData);
        });
    }

    showBubbleDetails(bubbleData) {
        const relationship = bubbleData.choice === 'jacky' ? 'Friend of Jacky' : 'Friend of Eunice';
        const emoji = bubbleData.choice === 'jacky' ? '💙' : '💗';
        
        this.showMessage(`${bubbleData.name} - ${relationship} ${emoji}`, 'info');
    }

    showConfirmation(guestName) {
        this.showMessage(`Thanks, ${guestName}! You're now part of the celebration 💕`, 'success');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    loadExistingBubbles() {
        try {
            const saved = localStorage.getItem('wedding_dynamic_bubbles');
            if (saved) {
                this.bubbles = JSON.parse(saved);
                this.bubbles.forEach(bubble => {
                    this.createVisualBubble(bubble);
                });
            }
        } catch (error) {
            console.warn('Could not load existing bubbles:', error);
        }
    }

    saveBubbles() {
        try {
            localStorage.setItem('wedding_dynamic_bubbles', JSON.stringify(this.bubbles));
        } catch (error) {
            console.warn('Could not save bubbles:', error);
        }
    }

    showMessage(message, type = 'info') {
        if (window.weddingApp) {
            window.weddingApp.showMessage(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    showGreetingMessage(guestName) {
        // Create greeting modal
        const greetingModal = document.createElement('div');
        greetingModal.className = 'greeting-modal';
        greetingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const greetingEmoji = this.getGreetingEmoji();
        
        greetingModal.innerHTML = `
            <div class="greeting-content" style="
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                padding: 32px;
                border-radius: 24px;
                text-align: center;
                max-width: 90%;
                transform: scale(0.8);
                transition: transform 0.3s ease;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            ">
                <div class="greeting-emoji" style="font-size: 4rem; margin-bottom: 16px;">
                    ${greetingEmoji}
                </div>
                <h2 style="
                    font-family: var(--font-heading);
                    font-size: 1.8rem;
                    margin: 0 0 16px 0;
                    color: white;
                ">Welcome, ${guestName}!</h2>
                <p style="
                    font-size: 1.1rem;
                    margin: 0 0 16px 0;
                    opacity: 0.9;
                    line-height: 1.5;
                ">We're so happy you're here to celebrate with Jacky & Eunice.</p>
                <p style="
                    font-size: 1rem;
                    margin: 0 0 24px 0;
                    opacity: 0.8;
                    line-height: 1.5;
                ">Thank you for being part of their special day!</p>
                <button class="greeting-close-btn" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Continue to App</button>
            </div>
        `;

        document.body.appendChild(greetingModal);

        // Animate in
        setTimeout(() => {
            greetingModal.style.opacity = '1';
            greetingModal.querySelector('.greeting-content').style.transform = 'scale(1)';
        }, 10);

        // Close greeting
        const closeBtn = greetingModal.querySelector('.greeting-close-btn');
        closeBtn.addEventListener('click', () => {
            this.closeGreetingMessage(greetingModal);
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (greetingModal.parentNode) {
                this.closeGreetingMessage(greetingModal);
            }
        }, 5000);
    }

    closeGreetingMessage(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.greeting-content').style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    getGreetingEmoji() {
        const hour = new Date().getHours();
        if (hour < 12) return '🌅';
        if (hour < 17) return '☀️';
        return '🌙';
    }

    // Get statistics
    getBubbleStats() {
        const jackyBubbles = this.bubbles.filter(b => b.choice === 'jacky').length;
        const euniceBubbles = this.bubbles.filter(b => b.choice === 'eunice').length;
        
        return {
            total: this.bubbles.length,
            jackyFriends: jackyBubbles,
            euniceFriends: euniceBubbles,
            withEmojis: this.bubbles.filter(b => b.emoji).length
        };
    }

    // Reset all bubbles (for testing)
    resetBubbles() {
        this.bubbles = [];
        this.saveBubbles();
        this.bubbleContainer.innerHTML = '';
    }
}

// ===== INITIALIZATION =====

// Initialize dynamic bubble sign-in when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to initialize
    setTimeout(() => {
        if (window.weddingApp) {
            window.dynamicBubbleSignIn = new DynamicBubbleSignIn();
        }
    }, 100);
}); 