// ===== WEDDING APP - MAIN JAVASCRIPT =====

class WeddingApp {
    constructor() {
        this.currentSection = 'bubble-signin';
        this.sections = ['bubble-signin', 'couple-story', 'blessing-wall', 'photo-wall'];
        this.selectedPhotoFile = null; // Store selected photo file
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.hideLoadingScreen();
        this.loadSavedData();
        this.detectMobileAndLog();
        
        // Check if we're starting on photo-wall section
        if (this.currentSection === 'photo-wall') {
            console.log('🖼️ Starting on photo-wall section, initializing...');
            setTimeout(() => {
                this.initPhotoWall();
            }, 500);
        }
        
        // Immediate upload button setup for better mobile experience
        setTimeout(() => {
            this.setupFallbackUploadButton();
            console.log('🔍 Checking if PhotoWall is available...');
            console.log('PhotoWall class available:', typeof PhotoWall !== 'undefined');
            console.log('PhotoWall instance:', window.photoWall);
            
            // Simple test to verify button is working
            const testBtn = document.getElementById('upload-photo-btn');
            if (testBtn) {
                console.log('🧪 Adding simple test click handler...');
                testBtn.addEventListener('click', () => {
                    console.log('🎯 Simple test click successful!');
                    alert('Button is working! 🎉');
                }, { once: true });
            }
            
            // Start continuous monitoring for the upload button
            this.startUploadButtonMonitoring();
        }, 100);
        
        // Debug mobile upload button after initialization
        setTimeout(() => {
            this.debugMobileUploadButton();
            this.loadUploadedPhotos(); // Load previously uploaded photos
        }, 2000);
        
        console.log('💕 Wedding App initialized successfully!');
    }

    detectMobileAndLog() {
        // Detect mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        console.log('📱 Device Info:', {
            isMobile,
            isIOS,
            isSafari,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio
            }
        });
        
        // Log section heights for debugging
        setTimeout(() => {
            this.logSectionHeights();
        }, 1000);
    }

    logSectionHeights() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const scrollHeight = section.scrollHeight;
            const clientHeight = section.clientHeight;
            
            console.log(`📏 Section ${section.id}:`, {
                scrollHeight,
                clientHeight,
                rect: {
                    top: rect.top,
                    bottom: rect.bottom,
                    height: rect.height
                },
                overflow: getComputedStyle(section).overflow,
                position: getComputedStyle(section).position
            });
        });
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
        
        // Add event delegation for upload button
        this.setupUploadButtonDelegation();
    }
    
    // Setup event delegation for upload button
    setupUploadButtonDelegation() {
        console.log('🎯 Setting up event delegation for upload button...');
        
        // Listen for clicks on the entire document
        document.addEventListener('click', (e) => {
            // Check if the clicked element is the upload button
            if (e.target && e.target.id === 'upload-photo-btn') {
                console.log('🎯 Upload button clicked via event delegation!');
                e.preventDefault();
                e.stopPropagation();
                
                // Handle the upload via the main handler
                this.handleFallbackUpload(e);
            }
        });
        
        // Also listen for touch events
        document.addEventListener('touchstart', (e) => {
            if (e.target && e.target.id === 'upload-photo-btn') {
                console.log('👆 Upload button touched via event delegation!');
                e.preventDefault();
                e.stopPropagation();
                
                // Handle the upload via the main handler
                this.handleFallbackUpload(e);
            }
        }, { passive: false });
        
        console.log('✅ Event delegation setup complete');
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

        // Note: Removed touchmove prevention to allow natural mobile scrolling
        // The CSS overflow-y: auto and -webkit-overflow-scrolling: touch will handle scrolling
        
        // Add touch event logging for debugging
        this.setupTouchEventLogging();
    }

    setupTouchEventLogging() {
        // Log touch events for debugging
        document.addEventListener('touchstart', (e) => {
            console.log('👆 Touch Start:', {
                touches: e.touches.length,
                target: e.target.tagName,
                className: e.target.className
            });
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            console.log('👆 Touch Move:', {
                touches: e.touches.length,
                target: e.target.tagName,
                className: e.target.className,
                preventDefault: e.defaultPrevented
            });
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            console.log('👆 Touch End:', {
                touches: e.changedTouches.length,
                target: e.target.tagName,
                className: e.target.className
            });
        }, { passive: true });
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
                // Ensure upload button is set up when photo section is accessed
                setTimeout(() => {
                    this.setupFallbackUploadButton();
                    console.log('🔄 Setting up upload button after navigating to photo section');
                }, 300);
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

    // Debug mobile upload button issues
    debugMobileUploadButton() {
        console.log('🔍 Debugging mobile upload button...');
        
        const uploadBtn = document.getElementById('upload-photo-btn');
        const photoGrid = document.getElementById('photo-grid');
        
        if (uploadBtn) {
            console.log('📱 Upload button found on mobile:', {
                element: uploadBtn,
                offsetWidth: uploadBtn.offsetWidth,
                offsetHeight: uploadBtn.offsetHeight,
                computedStyle: {
                    display: window.getComputedStyle(uploadBtn).display,
                    visibility: window.getComputedStyle(uploadBtn).visibility,
                    pointerEvents: window.getComputedStyle(uploadBtn).pointerEvents,
                    zIndex: window.getComputedStyle(uploadBtn).zIndex,
                    position: window.getComputedStyle(uploadBtn).position,
                    opacity: window.getComputedStyle(uploadBtn).opacity
                },
                rect: uploadBtn.getBoundingClientRect(),
                isVisible: uploadBtn.offsetWidth > 0 && uploadBtn.offsetHeight > 0
            });
            
            // Test if button is clickable
            uploadBtn.addEventListener('click', (e) => {
                console.log('🎯 Upload button clicked!', e);
            });
            
            // Add visual debugging - highlight the button
            uploadBtn.style.border = '3px solid #ff0000';
            uploadBtn.style.boxShadow = '0 0 10px #ff0000';
            setTimeout(() => {
                uploadBtn.style.border = '';
                uploadBtn.style.boxShadow = '';
            }, 3000);
            
        } else {
            console.warn('⚠️ Upload button not found on mobile');
            if (photoGrid) {
                console.log('Photo grid HTML:', photoGrid.innerHTML);
            }
        }
        
        // Check if PhotoWall is initialized
        if (window.photoWall) {
            console.log('✅ PhotoWall is initialized:', window.photoWall);
        } else {
            console.warn('⚠️ PhotoWall is not initialized');
        }
    }

    // Start monitoring for upload button availability
    startUploadButtonMonitoring() {
        console.log('🔍 Starting upload button monitoring...');
        
        let attempts = 0;
        const maxAttempts = 50; // Try for 5 seconds (50 * 100ms)
        
        const checkForButton = () => {
            attempts++;
            const uploadBtn = document.getElementById('upload-photo-btn');
            
            if (uploadBtn) {
                console.log(`✅ Upload button found after ${attempts} attempts!`);
                this.setupFallbackUploadButton();
                
                // Add a simple test to verify the button is working
                this.addTestIndicator(uploadBtn);
                
                return; // Stop monitoring
            }
            
            if (attempts < maxAttempts) {
                setTimeout(checkForButton, 100);
            } else {
                console.warn('⚠️ Upload button not found after maximum attempts');
            }
        };
        
        // Start checking
        checkForButton();
    }
    
    // Add visual test indicator to the upload button
    addTestIndicator(button) {
        console.log('🧪 Adding test indicator to upload button...');
        
        // Add a red border to show the button is being monitored
        button.style.border = '3px solid #ff0000';
        button.style.boxShadow = '0 0 15px #ff0000';
        
        // Add a test click handler
        button.addEventListener('click', (e) => {
            console.log('🎯 Test click handler triggered!', e);
            alert('Test click handler is working! 🎉');
        }, { once: true });
        
        // Remove the test indicator after 5 seconds
        setTimeout(() => {
            button.style.border = '';
            button.style.boxShadow = '';
        }, 5000);
        
        // Debug button positioning and potential overlay issues
        this.debugButtonPositioning(button);
    }
    
    // Debug button positioning and potential overlay issues
    debugButtonPositioning(button) {
        console.log('🔍 Debugging button positioning...');
        
        const rect = button.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(button);
        
        console.log('Button positioning:', {
            rect: rect,
            computedStyle: {
                position: computedStyle.position,
                zIndex: computedStyle.zIndex,
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                pointerEvents: computedStyle.pointerEvents
            }
        });
        
        // Check if any elements are overlapping the button
        const elementsAtPoint = document.elementsFromPoint(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
        
        console.log('Elements at button center:', elementsAtPoint);
        
        // Check if the button is the top element
        if (elementsAtPoint[0] === button) {
            console.log('✅ Button is the top element - should be clickable');
        } else {
            console.warn('⚠️ Button is NOT the top element - may be covered by:', elementsAtPoint[0]);
        }
    }

    // Setup fallback upload button handler
    setupFallbackUploadButton() {
        console.log('🔧 Setting up fallback upload button...');
        
        const uploadBtn = document.getElementById('upload-photo-btn');
        if (uploadBtn) {
            // Remove any existing listeners to prevent duplicates
            uploadBtn.removeEventListener('click', this.handleFallbackUpload);
            
            // Add fallback click handler
            uploadBtn.addEventListener('click', this.handleFallbackUpload.bind(this));
            console.log('✅ Fallback upload button handler added');
            
            // Also add touchstart event for mobile
            uploadBtn.addEventListener('touchstart', this.handleFallbackUpload.bind(this), { passive: false });
            console.log('✅ Touch event handler added for mobile');
            
            // Ensure the button is properly styled for mobile
            uploadBtn.style.pointerEvents = 'auto';
            uploadBtn.style.cursor = 'pointer';
            uploadBtn.style.userSelect = 'none';
            uploadBtn.style.webkitUserSelect = 'none';
            uploadBtn.style.webkitTapHighlightColor = 'rgba(0,0,0,0.1)';
            
            // Add visual feedback
            uploadBtn.addEventListener('touchstart', () => {
                uploadBtn.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            uploadBtn.addEventListener('touchend', () => {
                uploadBtn.style.transform = 'scale(1)';
            }, { passive: true });
            
            // Test if button is actually clickable
            console.log('🧪 Testing button clickability...');
            uploadBtn.addEventListener('click', (e) => {
                console.log('🎯 Direct click test successful!', e);
            }, { once: true });
            
            // Add a visual indicator that the button is working
            uploadBtn.style.border = '2px solid #00ff00';
            setTimeout(() => {
                uploadBtn.style.border = '';
            }, 2000);
            
        } else {
            console.warn('⚠️ Upload button not found for fallback handler');
        }
    }
    
    // Fallback upload handler
    handleFallbackUpload(e) {
        console.log('🎯 Fallback upload button clicked!', e);
        console.log('Event details:', {
            type: e.type,
            target: e.target,
            currentTarget: e.currentTarget,
            clientX: e.clientX,
            clientY: e.clientY,
            touches: e.touches ? e.touches.length : 'N/A'
        });
        
        // Prevent default to ensure our handler runs
        e.preventDefault();
        e.stopPropagation();
        
        // Try to initialize PhotoWall if not already done
        if (!window.photoWall) {
            console.log('🔄 Attempting to initialize PhotoWall from fallback handler...');
            this.initPhotoWall();
            
            // Wait a bit for PhotoWall to initialize, then show modal
            setTimeout(() => {
                if (window.photoWall && typeof window.photoWall.showUploadModal === 'function') {
                    console.log('🔄 Showing upload modal after PhotoWall initialization...');
                    window.photoWall.showUploadModal();
                } else {
                    console.warn('⚠️ PhotoWall still not available, showing standalone modal');
                    this.showStandaloneUploadModal();
                }
            }, 500);
        } else {
            // PhotoWall is already available, show the modal
            if (typeof window.photoWall.showUploadModal === 'function') {
                console.log('🔄 PhotoWall available, showing upload modal...');
                window.photoWall.showUploadModal();
            } else {
                console.warn('⚠️ PhotoWall available but showUploadModal method not found');
                this.showStandaloneUploadModal();
            }
        }
    }
    
    // Show a standalone upload modal that works without PhotoWall
    showStandaloneUploadModal() {
        console.log('📸 Showing standalone upload modal...');
        
        // Create modal HTML
        const modalHTML = `
            <div id="standalone-upload-modal" class="standalone-upload-modal">
                <div class="standalone-upload-overlay"></div>
                <div class="standalone-upload-content">
                    <div class="standalone-upload-header">
                        <h3>Share Your Photo 📸</h3>
                        <button class="standalone-close-btn" id="standalone-close-btn">×</button>
                    </div>
                    <div class="standalone-upload-body">
                        <div class="standalone-caption-section">
                            <label for="standalone-caption">Add a caption (optional)</label>
                            <input type="text" id="standalone-caption" placeholder="Add a caption..." maxlength="100">
                            <div class="caption-counter">
                                <span id="standalone-char-count">0</span>/100
                            </div>
                        </div>
                        <div class="standalone-upload-section">
                            <div class="standalone-upload-area" id="standalone-upload-area">
                                <div class="standalone-upload-icon">📷</div>
                                <p>Tap to select a photo</p>
                                <input type="file" id="standalone-photo-input" accept="image/*" style="display: none;">
                            </div>
                        </div>
                    </div>
                    <div class="standalone-upload-footer">
                        <button class="standalone-btn standalone-btn-secondary" id="standalone-cancel-btn">Cancel</button>
                        <button class="standalone-btn standalone-btn-primary" id="standalone-submit-btn" disabled>Upload Photo</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add styles
        this.addStandaloneModalStyles();
        
        // Bind events
        this.bindStandaloneModalEvents();
        
        // Show modal
        const modal = document.getElementById('standalone-upload-modal');
        modal.style.display = 'flex';
        
        console.log('✅ Standalone upload modal displayed');
    }
    
    // Add CSS styles for standalone modal
    addStandaloneModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .standalone-upload-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .standalone-upload-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .standalone-upload-content {
                background: white;
                border-radius: 20px;
                width: 100%;
                max-width: 400px;
                max-height: 90vh;
                overflow: hidden;
                position: relative;
                z-index: 10000;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: modalSlideUp 0.3s ease;
            }
            
            @keyframes modalSlideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .standalone-upload-header {
                padding: 24px 24px 16px;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .standalone-upload-header h3 {
                margin: 0;
                font-size: 1.5rem;
                color: #333;
                font-weight: 600;
            }
            
            .standalone-close-btn {
                background: none;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #666;
                font-size: 24px;
                transition: background-color 0.2s;
            }
            
            .standalone-close-btn:hover {
                background: #f5f5f5;
            }
            
            .standalone-upload-body {
                padding: 24px;
            }
            
            .standalone-caption-section {
                margin-bottom: 24px;
            }
            
            .standalone-caption-section label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
            }
            
            .standalone-caption-section input {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                box-sizing: border-box;
            }
            
            .caption-counter {
                text-align: right;
                margin-top: 4px;
                font-size: 12px;
                color: #666;
            }
            
            .standalone-upload-section {
                margin-bottom: 24px;
            }
            
            .standalone-upload-area {
                border: 2px dashed #ddd;
                border-radius: 12px;
                padding: 40px 20px;
                text-align: center;
                cursor: pointer;
                transition: border-color 0.2s;
                min-height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .standalone-upload-area:hover {
                border-color: #FF6B9D;
            }
            
            .standalone-upload-area img {
                max-width: 100%;
                max-height: 200px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                object-fit: cover;
            }
            
            .standalone-upload-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            
            .standalone-upload-area p {
                margin: 0;
                color: #666;
                font-size: 16px;
            }
            
            /* Change photo button styles */
            #change-photo-btn {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #FF6B9D;
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transition: all 0.2s;
                z-index: 10;
            }
            
            #change-photo-btn:hover {
                background: #e55a8a;
                transform: scale(1.1);
            }
            
            #change-photo-btn:active {
                transform: scale(0.95);
            }
            
            .standalone-upload-footer {
                padding: 16px 24px 24px;
                border-top: 1px solid #f0f0f0;
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            
            .standalone-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                min-height: 44px;
            }
            
            .standalone-btn-secondary {
                background: #f5f5f5;
                color: #333;
            }
            
            .standalone-btn-secondary:hover {
                background: #e5e5e5;
            }
            
            .standalone-btn-primary {
                background: #FF6B9D;
                color: white;
            }
            
            .standalone-btn-primary:hover:not(:disabled) {
                background: #e55a8a;
            }
            
            .standalone-btn-primary:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
            
            /* Mobile optimizations */
            @media (max-width: 480px) {
                .standalone-upload-content {
                    max-width: 95vw;
                    max-height: 95vh;
                }
                
                .standalone-upload-header h3 {
                    font-size: 1.3rem;
                }
                
                .standalone-upload-body {
                    padding: 20px;
                }
                
                .standalone-upload-footer {
                    padding: 16px 20px 20px;
                }
                
                .standalone-upload-area {
                    min-height: 180px;
                    padding: 30px 16px;
                }
                
                .standalone-upload-area img {
                    max-height: 160px;
                }
                
                #change-photo-btn {
                    width: 28px;
                    height: 28px;
                    font-size: 14px;
                }
            }
            
            /* Touch optimizations for mobile */
            @media (hover: none) and (pointer: coarse) {
                #change-photo-btn {
                    min-height: 44px;
                    min-width: 44px;
                }
                
                .standalone-upload-area {
                    -webkit-tap-highlight-color: rgba(0,0,0,0.1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Bind events for standalone modal
    bindStandaloneModalEvents() {
        console.log('🔗 Binding standalone modal events...');
        
        // Close button
        const closeBtn = document.getElementById('standalone-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideStandaloneModal();
            });
        }
        
        // Cancel button
        const cancelBtn = document.getElementById('standalone-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideStandaloneModal();
            });
        }
        
        // Caption input
        const captionInput = document.getElementById('standalone-caption');
        const charCount = document.getElementById('standalone-char-count');
        if (captionInput && charCount) {
            captionInput.addEventListener('input', (e) => {
                const length = e.target.value.length;
                charCount.textContent = length;
                
                // Enable/disable submit button based on photo selection
                const submitBtn = document.getElementById('standalone-submit-btn');
                const photoInput = document.getElementById('standalone-photo-input');
                if (submitBtn && photoInput) {
                    submitBtn.disabled = !photoInput.files || photoInput.files.length === 0;
                }
            });
        }
        
        // Upload area click
        const uploadArea = document.getElementById('standalone-upload-area');
        const photoInput = document.getElementById('standalone-photo-input');
        if (uploadArea && photoInput) {
            uploadArea.addEventListener('click', () => {
                photoInput.click();
            });
            
            // Handle file selection
            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleStandaloneFileSelection(file);
                }
            });
        }
        
        // Submit button
        const submitBtn = document.getElementById('standalone-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.handleStandaloneSubmit();
            });
        }
        
        // Close on overlay click
        const overlay = document.querySelector('.standalone-upload-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.hideStandaloneModal();
            });
        }
        
        console.log('✅ Standalone modal events bound');
    }
    
    // Handle file selection in standalone modal
    handleStandaloneFileSelection(file) {
        console.log('📁 File selected:', file.name);
        
        // Store the selected file
        this.selectedPhotoFile = file;
        
        // Enable submit button
        const submitBtn = document.getElementById('standalone-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
        
        // Show loading state
        const uploadArea = document.getElementById('standalone-upload-area');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div style="text-align: center; width: 100%;">
                    <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
                    <p style="margin: 0; color: #666; font-size: 14px;">Processing photo...</p>
                </div>
            `;
        }
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (uploadArea) {
                uploadArea.innerHTML = `
                    <div style="text-align: center; width: 100%;">
                        <div style="margin-bottom: 16px; position: relative;">
                            <img src="${e.target.result}" alt="Photo preview" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                            <button id="change-photo-btn" style="position: absolute; top: -8px; right: -8px; background: #FF6B9D; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 16px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">×</button>
                        </div>
                        <p style="margin: 0; color: #333; font-weight: 500; font-size: 14px;">${file.name}</p>
                        <p style="margin: 4px 0 0 0; color: #666; font-size: 12px;">Tap to change photo</p>
                    </div>
                `;
                
                // Bind change photo button
                const changeBtn = document.getElementById('change-photo-btn');
                if (changeBtn) {
                    changeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const photoInput = document.getElementById('standalone-photo-input');
                        if (photoInput) photoInput.click();
                    });
                }
                
                // Re-bind click event for the upload area
                uploadArea.addEventListener('click', () => {
                    const photoInput = document.getElementById('standalone-photo-input');
                    if (photoInput) photoInput.click();
                });
            }
        };
        
        // Handle errors
        reader.onerror = () => {
            if (uploadArea) {
                uploadArea.innerHTML = `
                    <div style="text-align: center; width: 100%;">
                        <div style="font-size: 48px; margin-bottom: 16px; color: #e74c3c;">❌</div>
                        <p style="margin: 0; color: #e74c3c; font-size: 14px;">Error loading preview</p>
                        <p style="margin: 8px 0 0 0; color: #666; font-size: 12px;">Tap to try again</p>
                    </div>
                `;
                
                // Re-bind click event
                uploadArea.addEventListener('click', () => {
                    const photoInput = document.getElementById('standalone-photo-input');
                    if (photoInput) photoInput.click();
                });
            }
        };
        
        // Read the file as data URL for preview
        reader.readAsDataURL(file);
    }
    
    // Handle submit in standalone modal
    handleStandaloneSubmit() {
        const captionInput = document.getElementById('standalone-caption');
        
        console.log('🔍 Submit validation - selectedPhotoFile:', this.selectedPhotoFile);
        
        // Use the stored file instead of trying to access DOM
        if (this.selectedPhotoFile) {
            const file = this.selectedPhotoFile;
            const caption = captionInput ? captionInput.value : '';
            
            console.log('📤 Submitting photo:', { file: file.name, caption });
            
            // Actually process and store the photo
            this.processAndStorePhoto(file, caption);
            
            // Show success message
            alert(`📸 Photo "${file.name}" uploaded successfully! 🎉\n\nCaption: ${caption || 'No caption'}`);
            
            // Reset the selected file
            this.selectedPhotoFile = null;
            
            // Hide modal
            this.hideStandaloneModal();
        } else {
            console.warn('⚠️ No photo file found during submit');
            alert('Please select a photo first! 📷');
        }
    }
    
    // Process and store the uploaded photo
    processAndStorePhoto(file, caption) {
        console.log('🔄 Processing and storing photo:', file.name);
        
        // Create a unique ID for the photo
        const photoId = 'uploaded-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // Create photo object
        const newPhoto = {
            id: photoId,
            url: null, // Will be set after processing
            caption: caption || 'Shared by guest',
            author: this.getGuestName() || 'Wedding Guest',
            category: 'wedding', // Default to wedding category
            timestamp: new Date(),
            likes: 0,
            isUploaded: true,
            originalFile: file
        };
        
        // Store photo in localStorage
        this.storePhotoInLocalStorage(newPhoto);
        
        // Add to photo wall if available
        this.addPhotoToGallery(newPhoto);
        
        // Process the file for display
        this.processPhotoFile(file, newPhoto);
        
        console.log('✅ Photo processed and stored:', newPhoto);
    }
    
    // Get guest name from localStorage
    getGuestName() {
        try {
            return localStorage.getItem('wedding_guest_name') || 'Wedding Guest';
        } catch (error) {
            console.warn('Could not get guest name:', error);
            return 'Wedding Guest';
        }
    }
    
    // Store photo in localStorage
    storePhotoInLocalStorage(photo) {
        try {
            const storedPhotos = JSON.parse(localStorage.getItem('wedding_uploaded_photos') || '[]');
            storedPhotos.push(photo);
            localStorage.setItem('wedding_uploaded_photos', JSON.stringify(storedPhotos));
            console.log('💾 Photo stored in localStorage');
        } catch (error) {
            console.error('Error storing photo in localStorage:', error);
        }
    }
    
    // Add photo to gallery display
    addPhotoToGallery(photo) {
        // Try to add to PhotoWall if available
        if (window.photoWall && typeof window.photoWall.addPhoto === 'function') {
            window.photoWall.addPhoto(photo);
            console.log('✅ Photo added to PhotoWall gallery');
        } else {
            // Fallback: manually add to photo grid
            this.manuallyAddPhotoToGrid(photo);
        }
    }
    
    // Manually add photo to grid (fallback method)
    manuallyAddPhotoToGrid(photo) {
        const photoGrid = document.getElementById('photo-grid');
        if (photoGrid) {
            // Create photo card HTML
            const photoCardHTML = `
                <div class="photo-card" data-photo-id="${photo.id}">
                    <div class="photo-card-content">
                        <div class="photo-preview-container">
                            <img src="${photo.url || 'assets/photos/photo.png'}" alt="${photo.caption}" class="photo-preview" onerror="this.src='assets/photos/photo.png'">
                        </div>
                        <div class="photo-card-info">
                            <p class="photo-card-caption">${photo.caption}</p>
                            <div class="photo-card-meta">
                                <span class="photo-author">${photo.author}</span>
                                <span class="photo-date">${this.formatDate(photo.timestamp)}</span>
                            </div>
                            <div class="photo-actions">
                                <button class="like-btn" data-photo-id="${photo.id}">
                                    <span class="like-icon">❤️</span>
                                    <span class="like-count">${photo.likes}</span>
                                </button>
                                <button class="delete-btn" data-photo-id="${photo.id}" style="margin-left: 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px;">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Insert after the upload card (first card)
            const uploadCard = photoGrid.querySelector('.upload-card');
            if (uploadCard) {
                uploadCard.insertAdjacentHTML('afterend', photoCardHTML);
                console.log('✅ Photo manually added to grid');
                
                // Add event listeners for the new photo card
                this.addPhotoCardEventListeners(photo.id);
            }
        }
    }
    
    // Add event listeners for photo card interactions
    addPhotoCardEventListeners(photoId) {
        const likeBtn = document.querySelector(`[data-photo-id="${photoId}"] .like-btn`);
        const deleteBtn = document.querySelector(`[data-photo-id="${photoId}"] .delete-btn`);
        
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                this.handlePhotoLike(photoId);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.handlePhotoDelete(photoId);
            });
        }
    }
    
    // Handle photo like
    handlePhotoLike(photoId) {
        console.log('❤️ Photo liked:', photoId);
        const likeCount = document.querySelector(`[data-photo-id="${photoId}"] .like-count`);
        if (likeCount) {
            const currentLikes = parseInt(likeCount.textContent) || 0;
            likeCount.textContent = currentLikes + 1;
            
            // Update localStorage
            this.updatePhotoLikesInStorage(photoId, currentLikes + 1);
        }
    }
    
    // Handle photo delete
    handlePhotoDelete(photoId) {
        if (confirm('Are you sure you want to delete this photo?')) {
            console.log('🗑️ Deleting photo:', photoId);
            const photoCard = document.querySelector(`[data-photo-id="${photoId}"]`);
            if (photoCard) {
                photoCard.remove();
                // Remove from localStorage
                this.removePhotoFromStorage(photoId);
            }
        }
    }
    
    // Update photo likes in localStorage
    updatePhotoLikesInStorage(photoId, likes) {
        try {
            const storedPhotos = JSON.parse(localStorage.getItem('wedding_uploaded_photos') || '[]');
            const photo = storedPhotos.find(p => p.id === photoId);
            if (photo) {
                photo.likes = likes;
                localStorage.setItem('wedding_uploaded_photos', JSON.stringify(storedPhotos));
            }
        } catch (error) {
            console.error('Error updating photo likes:', error);
        }
    }
    
    // Remove photo from localStorage
    removePhotoFromStorage(photoId) {
        try {
            const storedPhotos = JSON.parse(localStorage.getItem('wedding_uploaded_photos') || '[]');
            const filteredPhotos = storedPhotos.filter(p => p.id !== photoId);
            localStorage.setItem('wedding_uploaded_photos', JSON.stringify(filteredPhotos));
            console.log('🗑️ Photo removed from storage');
        } catch (error) {
            console.error('Error removing photo from storage:', error);
        }
    }
    
    // Process photo file for display
    processPhotoFile(file, photo) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Update photo URL with data URL
            photo.url = e.target.result;
            
            // Update localStorage with the processed photo
            this.updatePhotoInLocalStorage(photo);
            
            // Update gallery display
            this.updatePhotoInGallery(photo);
            
            console.log('🖼️ Photo file processed for display');
        };
        
        reader.onerror = () => {
            console.error('❌ Error processing photo file');
        };
        
        // Read file as data URL
        reader.readAsDataURL(file);
    }
    
    // Update photo in localStorage
    updatePhotoInLocalStorage(photo) {
        try {
            const storedPhotos = JSON.parse(localStorage.getItem('wedding_uploaded_photos') || '[]');
            const index = storedPhotos.findIndex(p => p.id === photo.id);
            if (index !== -1) {
                storedPhotos[index] = photo;
                localStorage.setItem('wedding_uploaded_photos', JSON.stringify(storedPhotos));
                console.log('💾 Photo updated in localStorage');
            }
        } catch (error) {
            console.error('Error updating photo in localStorage:', error);
        }
    }
    
    // Update photo in gallery display
    updatePhotoInGallery(photo) {
        // Try to update PhotoWall if available
        if (window.photoWall && typeof window.photoWall.updatePhoto === 'function') {
            window.photoWall.updatePhoto(photo);
        } else {
            // Update manually added photo
            const photoCard = document.querySelector(`[data-photo-id="${photo.id}"]`);
            if (photoCard) {
                const img = photoCard.querySelector('.photo-preview');
                if (img) {
                    img.src = photo.url;
                }
            }
        }
    }
    
    // Format date for display
    formatDate(date) {
        if (date instanceof Date) {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
        return 'Today';
    }
    
    // Hide standalone modal
    hideStandaloneModal() {
        const modal = document.getElementById('standalone-upload-modal');
        if (modal) {
            modal.remove();
            // Reset the selected file
            this.selectedPhotoFile = null;
            console.log('✅ Standalone modal removed and file reset');
        }
    }

    initPhotoWall() {
        // Initialize photo wall functionality
        console.log('🖼️ Initializing photo wall...');
        
        const photoGrid = document.getElementById('photo-grid');
        console.log('Photo grid element:', photoGrid);
        
        // Check if PhotoWall class is available
        if (typeof PhotoWall === 'undefined') {
            console.error('PhotoWall class not found! Make sure photo-wall.js is loaded.');
            return;
        }
        
        // Initialize PhotoWall if not already done
        if (!window.photoWall) {
            if (photoGrid) {
                console.log('Creating new PhotoWall instance...');
                try {
                    window.photoWall = new PhotoWall();
                    console.log('PhotoWall created successfully:', window.photoWall);
                    
                    // Ensure the upload button is properly bound
                    setTimeout(() => {
                        if (window.photoWall && typeof window.photoWall.bindMainUploadButton === 'function') {
                            window.photoWall.bindMainUploadButton();
                            console.log('✅ Upload button bound after initialization');
                        }
                        
                        // Test if the upload modal can be shown
                        if (window.photoWall && typeof window.photoWall.showUploadModal === 'function') {
                            console.log('✅ Upload modal method is available');
                        } else {
                            console.warn('⚠️ Upload modal method not available');
                        }
                        
                        this.testPhotoUpload();
                    }, 1000);
                } catch (error) {
                    console.error('Error creating PhotoWall:', error);
                }
            } else {
                console.error('Photo grid element not found!');
            }
        } else {
            console.log('PhotoWall already exists, re-rendering...');
            // Re-render photos if already initialized
            window.photoWall.renderPhotos();
            
            // Ensure upload button is bound
            if (window.photoWall && typeof window.photoWall.bindMainUploadButton === 'function') {
                window.photoWall.bindMainUploadButton();
                console.log('✅ Upload button bound on re-render');
            }
            
            // Test if the upload modal can be shown
            if (window.photoWall && typeof window.photoWall.showUploadModal === 'function') {
                console.log('✅ Upload modal method is available on re-render');
            } else {
                console.warn('⚠️ Upload modal method not available on re-render');
            }
        }
    }

    // Test photo upload functionality
    testPhotoUpload() {
        console.log('🧪 Testing photo upload functionality...');
        
        const uploadBtn = document.getElementById('upload-photo-btn');
        const uploadInput = document.getElementById('photo-upload-input');
        
        console.log('Upload button found:', !!uploadBtn);
        console.log('Upload input found:', !!uploadInput);
        
        if (uploadBtn) {
            console.log('Button properties:', {
                offsetWidth: uploadBtn.offsetWidth,
                offsetHeight: uploadBtn.offsetHeight,
                style: {
                    display: uploadBtn.style.display,
                    visibility: uploadBtn.style.visibility,
                    pointerEvents: uploadBtn.style.pointerEvents,
                    zIndex: uploadBtn.style.zIndex
                }
            });
        }
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

    loadUploadedPhotos() {
        console.log('🔄 Loading previously uploaded photos...');
        const photoGrid = document.getElementById('photo-grid');
        if (photoGrid) {
            const uploadedPhotos = this.getFromLocalStorage('wedding_uploaded_photos') || [];
            uploadedPhotos.forEach(photo => {
                this.addPhotoToGallery(photo); // Use the existing addPhotoToGallery method
            });
            console.log(`✅ Loaded ${uploadedPhotos.length} previously uploaded photos.`);
        } else {
            console.warn('⚠️ Photo grid element not found, cannot load photos.');
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