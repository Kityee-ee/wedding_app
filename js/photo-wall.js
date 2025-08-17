// ===== PHOTO WALL FUNCTIONALITY =====

class PhotoWall {
    constructor() {
        this.photos = [];
        this.filteredPhotos = [];
        this.currentCategory = 'all';
        this.selectedPhotoIndex = 0;
        this.likedPhotos = new Set();
        this.comments = {};
        this.selectedFile = null;
        this.selectedCaption = '';
        this.uploadModalInitialized = false;
        
        this.init();
    }

    init() {
        this.loadPhotos();
        this.loadFromStorage();
        this.renderPhotos();
        this.bindEvents();
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

    // Bind event listeners - called after rendering to ensure elements exist
    bindEvents() {
        console.log('🔗 Binding photo wall events...');
        
        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // Bind main upload button (the one in the photo grid)
        this.bindMainUploadButton();

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

    // Bind main upload button (the one in the photo grid)
    bindMainUploadButton() {
        const uploadBtn = document.getElementById('upload-photo-btn');
        if (uploadBtn) {
            // Remove any existing listeners to prevent duplicates
            uploadBtn.removeEventListener('click', this.handleUploadClick);
            
            // Add new listener
            uploadBtn.addEventListener('click', this.handleUploadClick.bind(this));
            console.log('✅ Main upload button event bound');
        } else {
            console.warn('⚠️ Main upload button not found');
        }
    }

    // Show upload modal
    showUploadModal() {
        const modal = document.getElementById('photo-upload-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Only bind events once to prevent duplicates
            if (!this.uploadModalInitialized) {
                this.bindUploadModalEvents();
                this.uploadModalInitialized = true;
                console.log('✅ Upload modal events initialized for the first time');
            } else {
                console.log('✅ Upload modal events already initialized, skipping');
            }
        }
    }

    // Handle upload button click
    handleUploadClick() {
        console.log('📸 Upload button clicked');
        this.showUploadModal();
    }

    // Hide upload modal
    hideUploadModal() {
        console.log('🔄 Hiding upload modal...');
        
        const modal = document.getElementById('photo-upload-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            console.log('🔄 Calling resetUploadModal...');
            this.resetUploadModal();
            
            // Reset initialization flag when modal is hidden
            this.uploadModalInitialized = false;
            console.log('✅ Upload modal initialization flag reset');
        }
    }

    // Reset upload modal to initial state
    resetUploadModal() {
        console.log('🔄 Resetting upload modal...');
        
        const captionInput = document.getElementById('photo-caption-input');
        const photoPreview = document.getElementById('photo-preview');
        const uploadArea = document.getElementById('upload-area');
        const submitBtn = document.getElementById('submit-upload-btn');
        const charCount = document.getElementById('caption-char-count');
        
        // Reset caption input
        if (captionInput) {
            captionInput.value = '';
            console.log('✅ Caption input reset');
        }
        
        // Reset character counter
        if (charCount) {
            charCount.textContent = '0';
            console.log('✅ Character counter reset');
        }
        
        // Reset photo preview and show upload area
        if (photoPreview && uploadArea) {
            photoPreview.style.display = 'none';
            uploadArea.style.display = 'flex';
            console.log('✅ Photo preview hidden, upload area restored');
        }
        
        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            console.log('✅ Submit button disabled');
        }
        
        // Reset file selection
        this.selectedFile = null;
        this.selectedCaption = '';
        
        console.log('✅ Upload modal reset completed');
    }

    // Bind upload modal events
    bindUploadModalEvents() {
        console.log('🔗 Binding upload modal events...');
        
        // First, remove any existing event listeners to prevent duplicates
        this.cleanupUploadModalEvents();
        
        // Close modal events
        const closeBtn = document.getElementById('upload-modal-close');
        const cancelBtn = document.getElementById('cancel-upload-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', this.handleCloseModal.bind(this));
            console.log('✅ Close button event bound');
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', this.handleCancelUpload.bind(this));
            console.log('✅ Cancel button event bound');
        }
        
        // Caption input events
        const captionInput = document.getElementById('photo-caption-input');
        if (captionInput) {
            captionInput.addEventListener('input', this.handleCaptionInput.bind(this));
            console.log('✅ Caption input event bound');
        }
        
        // File upload events - bind to the upload area click
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('photo-upload-input');
        
        if (uploadArea && fileInput) {
            // Make upload area clickable to trigger file input
            uploadArea.addEventListener('click', this.handleUploadAreaClick.bind(this));
            
            // Bind file input change event
            fileInput.addEventListener('change', this.handleFileSelect.bind(this));
            
            console.log('✅ Upload area and file input events bound');
        } else {
            console.warn('⚠️ Upload area or file input not found');
            console.log('Upload area:', uploadArea);
            console.log('File input:', fileInput);
        }
        
        // Submit button
        const submitBtn = document.getElementById('submit-upload-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', this.handleSubmitClick.bind(this));
            console.log('✅ Submit button event bound');
        }
        
        // Remove photo button
        const removeBtn = document.getElementById('remove-photo-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', this.handleRemovePhoto.bind(this));
            console.log('✅ Remove photo button event bound');
        }
        
        // Drag and drop events
        this.setupDragAndDrop();
        console.log('✅ Drag and drop events bound');
        
        // Close modal on overlay click
        const modal = document.getElementById('photo-upload-modal');
        if (modal) {
            modal.addEventListener('click', this.handleModalOverlayClick.bind(this));
            console.log('✅ Modal overlay click event bound');
        }
        
        console.log('✅ All upload modal events bound successfully');
    }

    // Cleanup upload modal events to prevent duplicates
    cleanupUploadModalEvents() {
        console.log('🧹 Cleaning up existing upload modal events...');
        
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('photo-upload-input');
        const closeBtn = document.getElementById('upload-modal-close');
        const cancelBtn = document.getElementById('cancel-upload-btn');
        const submitBtn = document.getElementById('submit-upload-btn');
        const removeBtn = document.getElementById('remove-photo-btn');
        const modal = document.getElementById('photo-upload-modal');
        
        // Remove all event listeners by cloning and replacing elements
        if (uploadArea) {
            const newUploadArea = uploadArea.cloneNode(true);
            uploadArea.parentNode.replaceChild(newUploadArea, uploadArea);
            console.log('✅ Upload area events cleaned up');
        }
        
        if (fileInput) {
            const newFileInput = fileInput.cloneNode(true);
            fileInput.parentNode.replaceChild(newFileInput, fileInput);
            console.log('✅ File input events cleaned up');
        }
        
        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            console.log('✅ Close button events cleaned up');
        }
        
        if (cancelBtn) {
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            console.log('✅ Cancel button events cleaned up');
        }
        
        if (submitBtn) {
            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            console.log('✅ Submit button events cleaned up');
        }
        
        if (removeBtn) {
            const newRemoveBtn = removeBtn.cloneNode(true);
            removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
            console.log('✅ Remove button events cleaned up');
        }
        
        if (modal) {
            const newModal = modal.cloneNode(true);
            modal.parentNode.replaceChild(newModal, modal);
            console.log('✅ Modal events cleaned up');
        }
    }

    // Event handler methods
    handleCloseModal() {
        console.log('❌ Close button clicked');
        this.hideUploadModal();
    }

    handleCancelUpload() {
        console.log('❌ Cancel button clicked');
        this.hideUploadModal();
    }

    handleUploadAreaClick() {
        console.log('🖱️ Upload area clicked, triggering file input');
        
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('photo-upload-input');
        
        if (uploadArea && fileInput) {
            // Add visual feedback
            uploadArea.style.borderColor = '#4CAF50';
            uploadArea.style.background = '#f0f9ff';
            
            // Trigger file input
            fileInput.click();
            
            // Reset visual feedback after a short delay
            setTimeout(() => {
                uploadArea.style.borderColor = '';
                uploadArea.style.background = '';
            }, 500);
        }
    }

    handleSubmitClick() {
        console.log('🚀 Submit button clicked');
        this.submitPhoto();
    }

    handleRemovePhoto() {
        console.log('🗑️ Remove photo button clicked');
        this.removeSelectedPhoto();
    }

    handleModalOverlayClick(e) {
        if (e.target.id === 'photo-upload-modal') {
            console.log('🖱️ Modal overlay clicked');
            this.hideUploadModal();
        }
    }

    // Handle caption input
    handleCaptionInput(event) {
        const caption = event.target.value;
        const charCount = document.getElementById('caption-char-count');
        const submitBtn = document.getElementById('submit-upload-btn');
        
        this.selectedCaption = caption;
        
        if (charCount) {
            charCount.textContent = caption.length;
        }
        
        // Enable submit button if both photo and caption are ready
        if (submitBtn) {
            submitBtn.disabled = !this.selectedFile;
        }
    }

    // Handle file selection
    handleFileSelect(event) {
        console.log('📸 handleFileSelect called with event:', event);
        console.log('Event target:', event.target);
        console.log('Event target files:', event.target.files);
        
        const file = event.target.files[0];
        if (!file) {
            console.log('❌ No file found in event');
            return;
        }

        console.log('📸 File selected successfully:', {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
        });

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error('❌ Invalid file type:', file.type);
            this.showUploadError('Please select an image file (JPEG, PNG, etc.)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            console.error('❌ File too large:', file.size, 'bytes');
            this.showUploadError('Image size should be less than 5MB');
            return;
        }

        console.log('✅ File validation passed, processing...');
        
        // Store the selected file
        this.selectedFile = file;
        console.log('✅ File stored in selectedFile:', this.selectedFile);
        
        // Show the preview
        console.log('🖼️ Calling showPhotoPreview...');
        this.showPhotoPreview(file);
        
        // Enable the submit button
        console.log('🔘 Calling enableSubmitButton...');
        this.enableSubmitButton();
        
        console.log('✅ handleFileSelect completed successfully');
    }

    // Show photo preview
    showPhotoPreview(file) {
        console.log('🖼️ Showing photo preview for:', file.name);
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            console.log('✅ File read successfully, creating preview...');
            
            const previewImage = document.getElementById('preview-image');
            const photoPreview = document.getElementById('photo-preview');
            const uploadArea = document.getElementById('upload-area');
            
            console.log('Preview elements found:', {
                previewImage: !!previewImage,
                photoPreview: !!photoPreview,
                uploadArea: !!uploadArea
            });
            
            if (previewImage && photoPreview && uploadArea) {
                // Set the preview image source
                previewImage.src = e.target.result;
                previewImage.alt = file.name;
                
                // Show the preview and hide the upload area
                photoPreview.style.display = 'block';
                uploadArea.style.display = 'none';
                
                console.log('✅ Photo preview displayed successfully');
                console.log('Preview image src:', previewImage.src);
                console.log('Photo preview display:', photoPreview.style.display);
                console.log('Upload area display:', uploadArea.style.display);
            } else {
                console.error('❌ Preview elements not found:', {
                    previewImage: previewImage,
                    photoPreview: photoPreview,
                    uploadArea: uploadArea
                });
            }
        };
        
        reader.onerror = (error) => {
            console.error('❌ Error reading file for preview:', error);
        };
        
        console.log('📖 Starting file read for preview...');
        reader.readAsDataURL(file);
    }

    // Remove selected photo
    removeSelectedPhoto() {
        const photoPreview = document.getElementById('photo-preview');
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('photo-upload-input');
        const submitBtn = document.getElementById('submit-upload-btn');
        
        if (photoPreview && uploadArea) {
            photoPreview.style.display = 'none';
            uploadArea.style.display = 'flex';
            console.log('✅ Photo preview hidden, upload area restored');
        }
        
        if (fileInput) {
            fileInput.value = '';
        }
        
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        
        this.selectedFile = null;
        console.log('✅ Selected photo removed');
    }

    // Enable submit button
    enableSubmitButton() {
        const submitBtn = document.getElementById('submit-upload-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            console.log('✅ Submit button enabled');
            console.log('Button element:', submitBtn);
            console.log('Button disabled state:', submitBtn.disabled);
        } else {
            console.warn('⚠️ Submit button not found');
        }
    }

    // Setup drag and drop functionality
    setupDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');
        if (!uploadArea) return;

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    console.log('📸 File dropped:', file.name, file.type, file.size);
                    this.handleDroppedFile(file);
                } else {
                    this.showUploadError('Please drop an image file');
                }
            }
        });
    }

    // Handle dropped file (separate from file input selection)
    handleDroppedFile(file) {
        console.log('📸 Processing dropped file:', file.name);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showUploadError('Please select an image file (JPEG, PNG, etc.)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showUploadError('Image size should be less than 5MB');
            return;
        }

        this.selectedFile = file;
        this.showPhotoPreview(file);
        this.enableSubmitButton();
        
        console.log('✅ Dropped file processed successfully');
    }

    // Submit photo
    submitPhoto() {
        console.log('🚀 Submit photo called');
        console.log('Selected file:', this.selectedFile);
        console.log('Selected caption:', this.selectedCaption);
        
        if (!this.selectedFile) {
            console.error('❌ No file selected');
            this.showUploadError('Please select a photo first');
            return;
        }

        console.log('📸 Submitting photo:', {
            file: this.selectedFile.name,
            caption: this.selectedCaption,
            size: this.selectedFile.size,
            type: this.selectedFile.type
        });

        // Show loading state
        this.showUploadLoading();

        // Process the upload
        const reader = new FileReader();
        
        reader.onload = (e) => {
            console.log('✅ File read successfully, processing upload...');
            try {
                this.processUploadedPhoto(this.selectedFile, e.target.result, this.selectedCaption);
                console.log('✅ Photo processed successfully');
            } catch (error) {
                console.error('❌ Error processing photo:', error);
                this.showUploadError('Error processing the uploaded photo');
            }
        };
        
        reader.onerror = (error) => {
            console.error('❌ Error reading file:', error);
            this.showUploadError('Error reading the selected file');
        };
        
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                console.log(`📊 Upload progress: ${progress.toFixed(1)}%`);
            }
        };
        
        console.log('📖 Starting file read...');
        reader.readAsDataURL(this.selectedFile);
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
        const grid = document.getElementById('photo-grid');
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
        } else {
            try {
                const photosHTML = this.filteredPhotos.map((photo, index) => {
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
                
                grid.innerHTML = uploadCard + photosHTML;
                console.log('✅ Photos rendered successfully! Count:', this.filteredPhotos.length);
            } catch (error) {
                console.error('❌ Error rendering photos:', error);
                grid.innerHTML = uploadCard + '<div class="photo-empty"><p>Error loading photos: ' + error.message + '</p></div>';
            }
        }

        // Re-bind upload events after rendering
        setTimeout(() => {
            // Bind main upload button after rendering
            this.bindMainUploadButton();
            console.log('✅ Photos rendered, main upload button bound');
        }, 100);
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

    // Process uploaded photo
    processUploadedPhoto(file, dataUrl, caption) {
        try {
            console.log('🔄 Processing uploaded photo...');
            
            // In a real app, you'd upload to a server
            // For now, we'll simulate the upload process
            
            // Create a new photo object
            const newPhoto = {
                id: 'uploaded-' + Date.now(),
                url: dataUrl,
                caption: caption || `Photo from ${new Date().toLocaleDateString()} 📸`,
                author: 'Wedding Guest',
                category: 'wedding',
                timestamp: new Date(),
                likes: 0
            };

            console.log('📸 New photo object created:', newPhoto);

            // Add to photos array
            this.photos.unshift(newPhoto);
            this.updateFilteredPhotos();

            console.log('✅ Photo added to array, total photos:', this.photos.length);

            // Show success message
            this.showUploadSuccess();

            // Re-render photos to show the new one
            setTimeout(() => {
                this.renderPhotos();
                console.log('✅ Photos re-rendered');
                
                // Close the modal after successful upload
                this.hideUploadModal();
                console.log('✅ Upload modal closed');
            }, 1000);

        } catch (error) {
            console.error('❌ Error processing uploaded photo:', error);
            this.showUploadError('Error processing the uploaded photo');
        }
    }

    // Show upload loading state
    showUploadLoading() {
        const message = document.createElement('div');
        message.id = 'upload-loading';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        message.innerHTML = '📸 Uploading photo... <div class="loading-spinner"></div>';
        
        document.body.appendChild(message);
    }

    // Show upload success message
    showUploadSuccess() {
        // Remove loading message if exists
        const loadingMsg = document.getElementById('upload-loading');
        if (loadingMsg) loadingMsg.remove();

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

    // Show upload error message
    showUploadError(errorMessage) {
        // Remove loading message if exists
        const loadingMsg = document.getElementById('upload-loading');
        if (loadingMsg) loadingMsg.remove();

        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        message.textContent = `❌ ${errorMessage}`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 4000);
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

// Add animation keyframes and loading spinner styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-left: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style); 