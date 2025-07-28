// Lightbox functionality for step images with zoom and pan
document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox overlay element
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
        <div class="lightbox-content">
            <div class="lightbox-image-container">
                <img class="lightbox-image" src="" alt="">
            </div>
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <div class="lightbox-zoom-info">Double-click or scroll to zoom</div>
        </div>
    `;
    document.body.appendChild(lightboxOverlay);

    // Get lightbox elements
    const lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
    const lightboxImageContainer = lightboxOverlay.querySelector('.lightbox-image-container');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');
    const lightboxZoomInfo = lightboxOverlay.querySelector('.lightbox-zoom-info');

    // Zoom and pan variables
    let currentScale = 1;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastTouchDistance = 0;

    // Function to reset zoom and pan
    function resetZoom() {
        currentScale = 1;
        currentX = 0;
        currentY = 0;
        updateImageTransform();
    }

    // Function to update image transform
    function updateImageTransform() {
        lightboxImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
    }

    // Function to open lightbox
    function openLightbox(imageSrc, imageAlt) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt || '';
        resetZoom();
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Show zoom info briefly
        lightboxZoomInfo.style.opacity = '1';
        setTimeout(() => {
            lightboxZoomInfo.style.opacity = '0';
        }, 2000);
    }

    // Function to close lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        resetZoom();
        // Clear image src after animation
        setTimeout(() => {
            if (!lightboxOverlay.classList.contains('active')) {
                lightboxImage.src = '';
            }
        }, 300);
    }

    // Function to zoom at specific point
    function zoomAtPoint(clientX, clientY, deltaScale) {
        const rect = lightboxImageContainer.getBoundingClientRect();
        const offsetX = clientX - rect.left - rect.width / 2;
        const offsetY = clientY - rect.top - rect.height / 2;

        const newScale = Math.max(0.5, Math.min(5, currentScale * deltaScale));
        const scaleDiff = newScale / currentScale;

        currentX = (currentX - offsetX) * scaleDiff + offsetX;
        currentY = (currentY - offsetY) * scaleDiff + offsetY;
        currentScale = newScale;

        updateImageTransform();
    }

    // Mouse wheel zoom
    lightboxImageContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        const deltaScale = e.deltaY > 0 ? 0.9 : 1.1;
        zoomAtPoint(e.clientX, e.clientY, deltaScale);
    });

    // Double-click to zoom
    lightboxImage.addEventListener('dblclick', function(e) {
        e.preventDefault();
        if (currentScale === 1) {
            zoomAtPoint(e.clientX, e.clientY, 2);
        } else {
            resetZoom();
        }
    });

    // Mouse drag for panning
    lightboxImage.addEventListener('mousedown', function(e) {
        if (currentScale > 1) {
            isDragging = true;
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            lightboxImage.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            currentX = e.clientX - startX;
            currentY = e.clientY - startY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            lightboxImage.style.cursor = currentScale > 1 ? 'grab' : 'default';
        }
    });

    // Touch events for mobile pinch zoom and pan
    let touches = [];
    
    lightboxImageContainer.addEventListener('touchstart', function(e) {
        touches = Array.from(e.touches);
        
        if (touches.length === 1 && currentScale > 1) {
            // Single touch for panning when zoomed
            isDragging = true;
            startX = touches[0].clientX - currentX;
            startY = touches[0].clientY - currentY;
        } else if (touches.length === 2) {
            // Two finger pinch
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
        }
        e.preventDefault();
    });

    lightboxImageContainer.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const currentTouches = Array.from(e.touches);
        
        if (currentTouches.length === 1 && isDragging && currentScale > 1) {
            // Single finger pan
            currentX = currentTouches[0].clientX - startX;
            currentY = currentTouches[0].clientY - startY;
            updateImageTransform();
        } else if (currentTouches.length === 2) {
            // Two finger pinch zoom
            const dx = currentTouches[0].clientX - currentTouches[1].clientX;
            const dy = currentTouches[0].clientY - currentTouches[1].clientY;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);
            
            const centerX = (currentTouches[0].clientX + currentTouches[1].clientX) / 2;
            const centerY = (currentTouches[0].clientY + currentTouches[1].clientY) / 2;
            
            if (lastTouchDistance > 0) {
                const deltaScale = currentDistance / lastTouchDistance;
                zoomAtPoint(centerX, centerY, deltaScale);
            }
            
            lastTouchDistance = currentDistance;
        }
    });

    lightboxImageContainer.addEventListener('touchend', function(e) {
        if (e.touches.length === 0) {
            isDragging = false;
            lastTouchDistance = 0;
        } else if (e.touches.length === 1) {
            lastTouchDistance = 0;
        }
    });

    // Update cursor based on zoom level
    lightboxImage.addEventListener('load', function() {
        lightboxImage.style.cursor = currentScale > 1 ? 'grab' : 'default';
    });

    // Add click listeners to all step images
    function attachImageListeners() {
        const stepImages = document.querySelectorAll('.step-image, .instruction-image, .mode-image');
        stepImages.forEach(image => {
            // Skip if already has listener
            if (image.dataset.lightboxEnabled) return;
            
            image.dataset.lightboxEnabled = 'true';
            image.style.cursor = 'pointer';
            
            image.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(this.src, this.alt);
            });
        });
    }

    // Close lightbox when clicking close button
    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox when clicking overlay (but not the image or container)
    lightboxOverlay.addEventListener('click', function(e) {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Initial attachment of listeners
    attachImageListeners();

    // Observe for dynamically added images (in case content loads later)
    const observer = new MutationObserver(function(mutations) {
        let shouldReattach = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches('.step-image, .instruction-image, .mode-image') || 
                            node.querySelector('.step-image, .instruction-image, .mode-image')) {
                            shouldReattach = true;
                        }
                    }
                });
            }
        });
        if (shouldReattach) {
            attachImageListeners();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}); 