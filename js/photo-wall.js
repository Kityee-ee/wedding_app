// ===== PHOTO WALL FUNCTIONALITY =====

class PhotoWall {
    constructor() {
        this.photos = [];
        this.filteredPhotos = [];
        this.currentCategory = 'all';
        this.selectedPhotoIndex = 0;
        this.likedPhotos = new Set();
        this.comments = {};
        
        this.init();
    }

    init() {
        this.loadPhotos();
        this.loadFromStorage();
        this.bindEvents();
        this.renderPhotos();
    }

    // Load photo data - using your actual photos
    loadPhotos() {
        this.photos = [
            // Couple Photos
            {
                id: 'couple-1',
                url: 'assets/photos/Couple/WhatsApp Image 2025-08-03 at 7.23.53 PM.jpeg',
                caption: 'Beautiful moments together 💕',
                author: 'Wedding Photographer',
                category: 'couple',
                timestamp: new Date(2025, 5, 15),
                likes: 24
            },
            {
                id: 'couple-2',
                url: 'assets/photos/Couple/WhatsApp Image 2025-08-03 at 7.23.55 PM.jpeg',
                caption: 'Love in every glance',
                author: 'Wedding Photographer',
                category: 'couple',
                timestamp: new Date(2025, 5, 20),
                likes: 18
            },
            {
                id: 'couple-3',
                url: 'assets/photos/Couple/WhatsApp Image 2025-08-03 at 7.23.56 PM (1).jpeg',
                caption: 'Perfect harmony together',
                author: 'Wedding Photographer',
                category: 'couple',
                timestamp: new Date(2025, 6, 1),
                likes: 31
            },
            {
                id: 'couple-4',
                url: 'assets/photos/Couple/WhatsApp Image 2025-08-03 at 7.23.57 PM (1).jpeg',
                caption: 'Tender moments captured',
                author: 'Wedding Photographer',
                category: 'couple',
                timestamp: new Date(2025, 6, 5),
                likes: 27
            },
            {
                id: 'couple-5',
                url: 'assets/photos/Couple/WhatsApp Image 2025-08-03 at 7.23.57 PM (2).jpeg',
                caption: 'Sweet embrace',
                author: 'Wedding Photographer',
                category: 'couple',
                timestamp: new Date(2025, 6, 10),
                likes: 35
            },
            {
                id: 'couple-6',
                url: 'assets/photos/Couple/WhatsApp Image 2025-08-03 at 7.23.58 PM (1).jpeg',
                caption: 'Laughter and joy',
                author: 'Wedding Photographer',
                category: 'couple',
                timestamp: new Date(2025, 6, 12),
                likes: 22
            },
            
            // Betrothal Photos
            {
                id: 'betrothal-1',
                url: 'assets/photos/Betrothal/WhatsApp Image 2025-08-03 at 7.23.56 PM (2).jpeg',
                caption: 'Traditional betrothal ceremony 🎊',
                author: 'Family Photographer',
                category: 'betrothal',
                timestamp: new Date(2025, 4, 15),
                likes: 42
            },
            {
                id: 'betrothal-2',
                url: 'assets/photos/Betrothal/WhatsApp Image 2025-08-03 at 7.23.56 PM (3).jpeg',
                caption: 'Blessing from families',
                author: 'Family Photographer',
                category: 'betrothal',
                timestamp: new Date(2025, 4, 15),
                likes: 38
            },
            {
                id: 'betrothal-3',
                url: 'assets/photos/Betrothal/WhatsApp Image 2025-08-03 at 7.23.56 PM (4).jpeg',
                caption: 'Ceremonial traditions',
                author: 'Family Photographer',
                category: 'betrothal',
                timestamp: new Date(2025, 4, 15),
                likes: 33
            },
            
            // ROM Photos
            {
                id: 'rom-1',
                url: 'assets/photos/ROM/WhatsApp Image 2025-08-03 at 7.23.56 PM (4).jpeg',
                caption: 'Registry of Marriage celebration 💍',
                author: 'ROM Photographer',
                category: 'rom',
                timestamp: new Date(2025, 7, 1),
                likes: 45
            },
            {
                id: 'rom-2',
                url: 'assets/photos/ROM/WhatsApp Image 2025-08-03 at 7.23.58 PM.jpeg',
                caption: 'Official moment',
                author: 'ROM Photographer',
                category: 'rom',
                timestamp: new Date(2025, 7, 1),
                likes: 40
            },
            {
                id: 'rom-3',
                url: 'assets/photos/ROM/WhatsApp Image 2025-08-03 at 7.23.59 PM (4).jpeg',
                caption: 'Legally married!',
                author: 'ROM Photographer',
                category: 'rom',
                timestamp: new Date(2025, 7, 1),
                likes: 50
            },
            
            // Wedding Day Photos
            {
                id: 'wedding-1',
                url: 'assets/photos/WeddingDay/WhatsApp Image 2025-08-03 at 7.24.02 PM.jpeg',
                caption: 'The big day arrives! 👰🤵',
                author: 'Wedding Photographer',
                category: 'wedding',
                timestamp: new Date(2025, 9, 25),
                likes: 65
            },
            {
                id: 'wedding-2',
                url: 'assets/photos/WeddingDay/WhatsApp Image 2025-08-03 at 7.24.02 PM (1).jpeg',
                caption: 'Walking down the aisle',
                author: 'Wedding Photographer',
                category: 'wedding',
                timestamp: new Date(2025, 9, 25),
                likes: 58
            },
            {
                id: 'wedding-3',
                url: 'assets/photos/WeddingDay/WhatsApp Image 2025-08-03 at 7.24.02 PM (2).jpeg',
                caption: 'Vows of eternal love',
                author: 'Wedding Photographer',
                category: 'wedding',
                timestamp: new Date(2025, 9, 25),
                likes: 72
            },
            {
                id: 'wedding-4',
                url: 'assets/photos/WeddingDay/WhatsApp Image 2025-08-03 at 7.24.02 PM (3).jpeg',
                caption: 'Celebration begins!',
                author: 'Wedding Photographer',
                category: 'wedding',
                timestamp: new Date(2025, 9, 25),
                likes: 61
            }
        ];
        
        this.updateFilteredPhotos();
    }

    // Load data from localStorage
    loadFromStorage() {
        const savedLikes = localStorage.getItem('photo-likes');
        if (savedLikes) {
            this.likedPhotos = new Set(JSON.parse(savedLikes));
        }
        
        const savedComments = localStorage.getItem('photo-comments');
        if (savedComments) {
            this.comments = JSON.parse(savedComments);
        }
    }

    // Save data to localStorage
    saveToStorage() {
        localStorage.setItem('photo-likes', JSON.stringify([...this.likedPhotos]));
        localStorage.setItem('photo-comments', JSON.stringify(this.comments));
    }

    // Bind event listeners
    bindEvents() {
        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // Photo upload
        const uploadBtn = document.getElementById('upload-photo-btn');
        const uploadInput = document.getElementById('photo-upload-input');
        
        uploadBtn?.addEventListener('click', () => uploadInput.click());
        uploadInput?.addEventListener('change', (e) => this.handlePhotoUpload(e));

        // Modal controls
        document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modal-prev')?.addEventListener('click', () => this.navigateModal(-1));
        document.getElementById('modal-next')?.addEventListener('click', () => this.navigateModal(1));
        document.getElementById('modal-like-btn')?.addEventListener('click', () => this.toggleModalLike());

        // Close modal on overlay click
        document.getElementById('photo-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'photo-modal') {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('photo-modal');
            if (modal?.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.navigateModal(-1);
                        break;
                    case 'ArrowRight':
                        this.navigateModal(1);
                        break;
                }
            }
        });
    }

    // Filter photos by category
    filterByCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.updateFilteredPhotos();
        this.renderPhotos();
    }

    // Update filtered photos array
    updateFilteredPhotos() {
        if (this.currentCategory === 'all') {
            this.filteredPhotos = [...this.photos];
        } else {
            this.filteredPhotos = this.photos.filter(photo => photo.category === this.currentCategory);
        }
    }

        // Render photos in grid
    renderPhotos() {
        console.log('📸 Rendering photos...', this.filteredPhotos.length, 'photos');
        console.log('📸 Photos data:', this.filteredPhotos);
        const grid = document.getElementById('photo-grid');
        console.log('📸 Grid element:', grid);
        if (!grid) {
            console.error('❌ Photo grid element not found!');
            return;
        }

        // Always show upload card, even when no photos
        const uploadCard = `
            <div class="photo-card upload-card">
                <div class="upload-content">
                    <img src="assets/photos/photo.png" alt="Camera" class="upload-icon">
                    <h3 class="upload-title">Share your photos from today!</h3>
                    <button class="upload-btn" id="upload-photo-btn">Upload Photo</button>
                    <input type="file" id="photo-upload-input" accept="image/*" style="display: none;">
                </div>
            </div>
        `;

        if (this.filteredPhotos.length === 0) {
            grid.innerHTML = uploadCard + `
                <div class="photo-empty">
                    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <p>No photos in this category yet</p>
                </div>
            `;
            return;
        }

        try {
            const photosHTML = this.filteredPhotos.map((photo, index) => {
                console.log('📸 Rendering photo:', photo.id, photo.url);
                return `
                    <div class="photo-card" data-photo-index="${index}" onclick="window.photoWall && window.photoWall.openModal(${index})">
                        <div class="photo-card-image-container">
                            <img class="photo-card-image" src="${encodeURI(photo.url)}" alt="${photo.caption}" loading="lazy" 
                                 onerror="console.error('❌ Failed to load image:', this.src);">
                            <div class="photo-card-overlay"></div>
                            <svg class="photo-card-camera" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                        </div>
                        <div class="photo-card-content">
                            <p class="photo-card-caption">${photo.caption}</p>
                            <div class="photo-card-meta">
                                <div class="photo-card-info">
                                    <p class="photo-card-author">${photo.author}</p>
                                    <p class="photo-card-date">${photo.timestamp.toLocaleDateString()}</p>
                                </div>
                                <button class="like-btn ${this.likedPhotos.has(photo.id) ? 'liked' : ''}" onclick="event.stopPropagation(); window.photoWall && window.photoWall.toggleLike('${photo.id}')">
                                    <svg class="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                    ${photo.likes + (this.likedPhotos.has(photo.id) ? 1 : 0)}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add upload card to the beginning of the grid
            const uploadCard = `
                <div class="photo-card upload-card">
                    <div class="upload-content">
                        <img src="assets/photos/photo.png" alt="Camera" class="upload-icon">
                        <h3 class="upload-title">Share your photos from today!</h3>
                        <button class="upload-btn" id="upload-photo-btn">Upload Photo</button>
                        <input type="file" id="photo-upload-input" accept="image/*" style="display: none;">
                    </div>
                </div>
            `;
            grid.innerHTML = uploadCard + photosHTML;
            console.log('✅ Photos rendered successfully! Count:', this.filteredPhotos.length);
        } catch (error) {
            console.error('❌ Error rendering photos:', error);
            grid.innerHTML = '<div class="photo-empty"><p>Error loading photos: ' + error.message + '</p></div>';
        }
    }

    // Toggle like for a photo
    toggleLike(photoId) {
        if (this.likedPhotos.has(photoId)) {
            this.likedPhotos.delete(photoId);
        } else {
            this.likedPhotos.add(photoId);
        }
        
        this.saveToStorage();
        this.renderPhotos();
        
        // Update modal if open
        const modal = document.getElementById('photo-modal');
        if (modal?.classList.contains('active')) {
            this.updateModalLikeButton();
        }
    }

    // Open photo modal
    openModal(index) {
        console.log('Opening modal for photo', index);
        this.selectedPhotoIndex = index;
        const photo = this.filteredPhotos[index];
        
        // Update modal content
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const modalAuthor = document.getElementById('modal-author');
        const modalDate = document.getElementById('modal-date');
        
        if (modalImage) modalImage.src = photo.url;
        if (modalImage) modalImage.alt = photo.caption;
        if (modalCaption) modalCaption.textContent = photo.caption;
        if (modalAuthor) modalAuthor.textContent = photo.author;
        if (modalDate) modalDate.textContent = photo.timestamp.toLocaleDateString();
        
        this.updateModalLikeButton();
        
        // Show modal
        const modal = document.getElementById('photo-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close photo modal
    closeModal() {
        const modal = document.getElementById('photo-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Navigate modal (prev/next)
    navigateModal(direction) {
        this.selectedPhotoIndex += direction;
        
        if (this.selectedPhotoIndex < 0) {
            this.selectedPhotoIndex = this.filteredPhotos.length - 1;
        } else if (this.selectedPhotoIndex >= this.filteredPhotos.length) {
            this.selectedPhotoIndex = 0;
        }
        
        const photo = this.filteredPhotos[this.selectedPhotoIndex];
        
        // Update modal content
        document.getElementById('modal-image').src = photo.url;
        document.getElementById('modal-image').alt = photo.caption;
        document.getElementById('modal-caption').textContent = photo.caption;
        document.getElementById('modal-author').textContent = photo.author;
        document.getElementById('modal-date').textContent = photo.timestamp.toLocaleDateString();
        
        this.updateModalLikeButton();
    }

    // Toggle like in modal
    toggleModalLike() {
        const photo = this.filteredPhotos[this.selectedPhotoIndex];
        this.toggleLike(photo.id);
    }

    // Update modal like button
    updateModalLikeButton() {
        const photo = this.filteredPhotos[this.selectedPhotoIndex];
        const likeBtn = document.getElementById('modal-like-btn');
        const likeCount = document.getElementById('modal-like-count');
        
        const isLiked = this.likedPhotos.has(photo.id);
        likeBtn.classList.toggle('liked', isLiked);
        likeCount.textContent = photo.likes + (isLiked ? 1 : 0);
    }

    // Handle photo upload
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            // In a real app, you'd upload to a server
            // For now, we'll just show a success message
            this.showUploadSuccess();
        };
        reader.readAsDataURL(file);

        // Reset input
        event.target.value = '';
    }

    // Show upload success message
    showUploadSuccess() {
        // Create temporary success message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        message.textContent = 'Photo uploaded successfully! 📸';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Make PhotoWall available globally - will be initialized by main app
// when photo wall section is accessed
console.log('📸 PhotoWall class loaded');

// Make PhotoWall globally available immediately
if (typeof window !== 'undefined') {
    window.PhotoWall = PhotoWall;
    console.log('📸 PhotoWall class attached to window');
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style); 