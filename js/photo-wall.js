// ===== PHOTO WALL FUNCTIONALITY =====

class PhotoWall {
    constructor() {
        this.photoGallery = document.getElementById('photo-gallery');
        this.photos = [];
        this.init();
    }

    init() {
        this.loadPhotos();
        this.renderPhotos();
        console.log('Photo wall initialized');
    }

    loadPhotos() {
        // Load sample photos for now
        this.photos = [
            {
                id: '1',
                src: 'assets/photos/sample1.jpg',
                alt: 'Jacky & Eunice - First Date',
                caption: 'Our first date at the coffee shop',
                timestamp: '2020-03-15T10:00:00Z',
                category: 'dating'
            },
            {
                id: '2',
                src: 'assets/photos/sample2.jpg',
                alt: 'Jacky & Eunice - Proposal',
                caption: 'The magical proposal moment',
                timestamp: '2023-12-25T18:30:00Z',
                category: 'proposal'
            },
            {
                id: '3',
                src: 'assets/photos/sample3.jpg',
                alt: 'Jacky & Eunice - Engagement',
                caption: 'Celebrating our engagement',
                timestamp: '2024-01-01T12:00:00Z',
                category: 'engagement'
            }
        ];
    }

    renderPhotos() {
        if (!this.photoGallery) return;

        // Clear gallery
        this.photoGallery.innerHTML = '';

        if (this.photos.length === 0) {
            this.photoGallery.innerHTML = `
                <div class="photo-placeholder">
                    <p>Photos coming soon... 📸</p>
                </div>
            `;
            return;
        }

        // Create photo grid
        this.photos.forEach(photo => {
            const photoElement = this.createPhotoElement(photo);
            this.photoGallery.appendChild(photoElement);
        });
    }

    createPhotoElement(photo) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item fade-in';
        photoDiv.dataset.photoId = photo.id;

        photoDiv.innerHTML = `
            <div class="photo-container">
                <img src="${photo.src}" alt="${photo.alt}" class="photo-image" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMDAgNjBDMTE2LjU2OSA2MCAxMzAgNzMuNDMxIDgzIDEzMEMxMzAgMTQ2LjU2OSAxMTYuNTY5IDE2MCAxMDAgMTYwQzgzLjQzMSAxNjAgNzAgMTQ2LjU2OSA3MCAxMzBDNzAgMTEzLjQzMSA4My40MzEgMTAwIDEwMCAxMDBaIiBmaWxsPSIjRkY2QjlEIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'">
                <div class="photo-overlay">
                    <div class="photo-caption">${photo.caption}</div>
                    <div class="photo-date">${this.formatDate(photo.timestamp)}</div>
                </div>
            </div>
        `;

        // Add click event for full view
        photoDiv.addEventListener('click', () => {
            this.showPhotoModal(photo);
        });

        return photoDiv;
    }

    showPhotoModal(photo) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                max-width: 90%;
                max-height: 90%;
                position: relative;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            ">
                <button class="modal-close" style="
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: rgba(0, 0, 0, 0.5);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                    cursor: pointer;
                    z-index: 1;
                ">×</button>
                <img src="${photo.src}" alt="${photo.alt}" style="
                    width: 100%;
                    height: auto;
                    display: block;
                ">
                <div style="
                    padding: 20px;
                    background: white;
                ">
                    <h3 style="margin: 0 0 8px 0; color: var(--primary);">${photo.caption}</h3>
                    <p style="margin: 0; color: #666; font-size: 14px;">${this.formatDate(photo.timestamp)}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);

        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            this.closePhotoModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePhotoModal(modal);
            }
        });

        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                this.closePhotoModal(modal);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    closePhotoModal(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Add new photo (for future guest uploads)
    addPhoto(photoData) {
        const newPhoto = {
            id: this.generateId(),
            src: photoData.src,
            alt: photoData.alt || 'Wedding Photo',
            caption: photoData.caption || 'Beautiful moment',
            timestamp: new Date().toISOString(),
            category: photoData.category || 'guest'
        };

        this.photos.unshift(newPhoto);
        this.savePhotos();
        this.renderPhotos();

        return newPhoto;
    }

    generateId() {
        return 'photo_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    savePhotos() {
        try {
            localStorage.setItem('wedding_photos', JSON.stringify(this.photos));
        } catch (error) {
            console.warn('Could not save photos:', error);
        }
    }

    // Get photo statistics
    getPhotoStats() {
        const categories = {};
        this.photos.forEach(photo => {
            categories[photo.category] = (categories[photo.category] || 0) + 1;
        });

        return {
            total: this.photos.length,
            categories: categories,
            recent: this.photos.filter(photo => {
                const photoDate = new Date(photo.timestamp);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return photoDate > weekAgo;
            }).length
        };
    }

    // Filter photos by category
    filterByCategory(category) {
        if (category === 'all') {
            this.renderPhotos();
            return;
        }

        const filteredPhotos = this.photos.filter(photo => photo.category === category);
        this.renderFilteredPhotos(filteredPhotos);
    }

    renderFilteredPhotos(filteredPhotos) {
        if (!this.photoGallery) return;

        this.photoGallery.innerHTML = '';

        if (filteredPhotos.length === 0) {
            this.photoGallery.innerHTML = `
                <div class="photo-placeholder">
                    <p>No photos in this category 📸</p>
                </div>
            `;
            return;
        }

        filteredPhotos.forEach(photo => {
            const photoElement = this.createPhotoElement(photo);
            this.photoGallery.appendChild(photoElement);
        });
    }

    // Export photos (for couple)
    exportPhotos() {
        return {
            photos: this.photos,
            stats: this.getPhotoStats(),
            exportDate: new Date().toISOString()
        };
    }
}

// ===== INITIALIZATION =====

// Initialize photo wall when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to initialize
    setTimeout(() => {
        if (window.weddingApp) {
            window.photoWall = new PhotoWall();
        }
    }, 100);
}); 