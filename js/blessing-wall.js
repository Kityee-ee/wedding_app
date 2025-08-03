// ===== BLESSING WALL FUNCTIONALITY =====

class BlessingWall {
    constructor() {
        this.blessingForm = document.querySelector('.blessing-form');
        this.blessingInput = document.getElementById('blessing-message');
        this.submitButton = document.getElementById('submit-blessing');
        this.blessingsContainer = document.getElementById('blessings-container');
        this.blessings = [];
        this.init();
    }

    init() {
        this.loadBlessings();
        this.setupEventListeners();
        this.renderBlessings();
        console.log('Blessing wall initialized');
    }

    setupEventListeners() {
        // Form submission
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBlessingSubmit();
            });
        }

        // Enter key on textarea
        if (this.blessingInput) {
            this.blessingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleBlessingSubmit();
                }
            });

            // Auto-resize textarea
            this.blessingInput.addEventListener('input', (e) => {
                this.autoResizeTextarea(e.target);
            });
        }
    }

    handleBlessingSubmit() {
        const message = this.blessingInput.value.trim();
        const guestName = this.getGuestName();

        if (!message) {
            this.showMessage('Please write a blessing message', 'error');
            return;
        }

        if (message.length < 10) {
            this.showMessage('Blessing must be at least 10 characters', 'error');
            return;
        }

        if (message.length > 500) {
            this.showMessage('Blessing is too long (max 500 characters)', 'error');
            return;
        }

        // Create blessing object
        const blessing = {
            id: this.generateId(),
            message: message,
            author: guestName,
            timestamp: new Date().toISOString(),
            emoji: this.getRandomEmoji()
        };

        // Add to blessings array
        this.blessings.unshift(blessing); // Add to beginning
        this.saveBlessings();
        this.renderBlessings();

        // Clear form
        this.blessingInput.value = '';
        this.autoResizeTextarea(this.blessingInput);

        // Show success message
        this.showMessage('Blessing sent! 💕', 'success');

        // Trigger app event
        if (window.weddingApp) {
            window.weddingApp.showMessage('Blessing sent! 💕', 'success');
        }
    }

    getGuestName() {
        // Try to get guest name from localStorage
        try {
            const checkedInGuests = JSON.parse(localStorage.getItem('wedding_checked_in_guests') || '[]');
            if (checkedInGuests.length > 0) {
                return checkedInGuests[checkedInGuests.length - 1].name;
            }
        } catch (error) {
            console.warn('Could not get guest name:', error);
        }
        
        return 'Anonymous Guest';
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getRandomEmoji() {
        const emojis = ['💕', '🙏', '💝', '✨', '🎉', '💑', '💒', '💖', '💗', '💘'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    renderBlessings() {
        if (!this.blessingsContainer) return;

        // Clear container
        this.blessingsContainer.innerHTML = '';

        if (this.blessings.length === 0) {
            this.blessingsContainer.innerHTML = `
                <div class="blessing-card empty-state">
                    <p>No blessings yet. Be the first to leave one! 💕</p>
                </div>
            `;
            return;
        }

        // Render each blessing
        this.blessings.forEach(blessing => {
            const blessingElement = this.createBlessingElement(blessing);
            this.blessingsContainer.appendChild(blessingElement);
        });
    }

    createBlessingElement(blessing) {
        const blessingDiv = document.createElement('div');
        blessingDiv.className = 'blessing-card fade-in';
        blessingDiv.dataset.blessingId = blessing.id;

        const timeAgo = this.getTimeAgo(blessing.timestamp);
        const emoji = blessing.emoji;

        blessingDiv.innerHTML = `
            <div class="blessing-header">
                <span class="blessing-emoji">${emoji}</span>
                <span class="blessing-author">${blessing.author}</span>
                <span class="blessing-time">${timeAgo}</span>
            </div>
            <div class="blessing-text">${this.escapeHtml(blessing.message)}</div>
        `;

        return blessingDiv;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const blessingTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - blessingTime) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }

    loadBlessings() {
        try {
            const saved = localStorage.getItem('wedding_blessings');
            if (saved) {
                this.blessings = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Could not load blessings:', error);
        }
    }

    saveBlessings() {
        try {
            localStorage.setItem('wedding_blessings', JSON.stringify(this.blessings));
        } catch (error) {
            console.warn('Could not save blessings:', error);
        }
    }

    showMessage(message, type = 'info') {
        if (window.weddingApp) {
            window.weddingApp.showMessage(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Get statistics
    getBlessingStats() {
        return {
            total: this.blessings.length,
            uniqueAuthors: new Set(this.blessings.map(b => b.author)).size,
            averageLength: Math.round(
                this.blessings.reduce((sum, b) => sum + b.message.length, 0) / this.blessings.length
            ) || 0
        };
    }

    // Clear all blessings (for testing)
    clearBlessings() {
        this.blessings = [];
        this.saveBlessings();
        this.renderBlessings();
    }

    // Export blessings (for couple)
    exportBlessings() {
        return {
            blessings: this.blessings,
            stats: this.getBlessingStats(),
            exportDate: new Date().toISOString()
        };
    }
}

// ===== INITIALIZATION =====

// Initialize blessing wall when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to initialize
    setTimeout(() => {
        if (window.weddingApp) {
            window.blessingWall = new BlessingWall();
        }
    }, 100);
}); 