// Lightbox functionality for step images
document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox overlay element
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        </div>
    `;
    document.body.appendChild(lightboxOverlay);

    // Get lightbox elements
    const lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

    // Function to open lightbox
    function openLightbox(imageSrc, imageAlt) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt || '';
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Clear image src after animation
        setTimeout(() => {
            if (!lightboxOverlay.classList.contains('active')) {
                lightboxImage.src = '';
            }
        }, 300);
    }

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

    // Close lightbox when clicking overlay (but not the image)
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