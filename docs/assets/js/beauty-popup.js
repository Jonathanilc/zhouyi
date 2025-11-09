// Image popup functionality
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    // Create the button
    const button = document.createElement('button');
    button.className = 'md-header__button md-icon beauty-popup-btn';
    button.setAttribute('aria-label', '查看图片');
    button.setAttribute('title', '查看图片');
    button.innerHTML = '🐷';
    
    // Create the modal overlay
    const modal = document.createElement('div');
    modal.className = 'beauty-modal';
    
    // Get the image path - use window.location to construct absolute URL
    // This ensures it works regardless of current page path
    function getImagePath() {
      // Get the origin (protocol + host + port)
      const origin = window.location.origin;
      // Use absolute path from root
      return origin + '/assets/images/beauty.png';
    }
    
    const imagePath = getImagePath();
    
    modal.innerHTML = `
      <div class="beauty-modal-content">
        <span class="beauty-modal-close">&times;</span>
        <img src="${imagePath}" alt="Beauty Image" />
      </div>
    `;
    
    // Add button click handler
    button.addEventListener('click', function() {
      document.body.appendChild(modal);
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
    
    // Close modal when clicking the X
    modal.querySelector('.beauty-modal-close').addEventListener('click', function() {
      modal.style.display = 'none';
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.parentNode) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }
    });
    
    // Find the header and insert the button
    // Material Design uses different structures for desktop and mobile
    function insertButton() {
      // Don't insert if button is already in the DOM
      if (document.body.contains(button)) {
        return;
      }
      
      // Try to find the header buttons container (works for both desktop and mobile)
      const headerNav = document.querySelector('.md-header__inner .md-header__button')?.parentNode ||
                        document.querySelector('.md-header__inner') ||
                        document.querySelector('.md-header');
      
      if (!headerNav) return;
      
      // Look for existing buttons to insert near
      const searchButton = headerNav.querySelector('[data-md-component="search"]') || 
                          headerNav.querySelector('.md-header__button--search');
      const paletteButton = headerNav.querySelector('[data-md-component="palette"]');
      const menuButton = headerNav.querySelector('[data-md-component="drawer"]') ||
                        headerNav.querySelector('.md-header__button--menu');
      
      // Insert strategy: try to place before search, then palette, then after menu, otherwise append
      if (searchButton && searchButton.parentNode) {
        searchButton.parentNode.insertBefore(button, searchButton);
      } else if (paletteButton && paletteButton.parentNode) {
        paletteButton.parentNode.insertBefore(button, paletteButton);
      } else if (menuButton && menuButton.parentNode) {
        // On mobile, insert after menu button
        if (menuButton.nextSibling) {
          menuButton.parentNode.insertBefore(button, menuButton.nextSibling);
        } else {
          menuButton.parentNode.appendChild(button);
        }
      } else {
        // Fallback: find any button container or append to header nav
        const buttonContainer = headerNav.querySelector('.md-header__button')?.parentNode || headerNav;
        buttonContainer.appendChild(button);
      }
    }
    
    // Try inserting immediately
    insertButton();
    
    // Also try after a short delay in case DOM isn't fully ready (for mobile)
    setTimeout(insertButton, 100);
    setTimeout(insertButton, 500); // Another attempt for slower mobile rendering
    
    // Use MutationObserver to handle dynamic header changes (mobile menu toggle)
    const observer = new MutationObserver(function(mutations) {
      if (!document.body.contains(button)) {
        insertButton();
      }
    });
    
    const header = document.querySelector('.md-header');
    if (header) {
      observer.observe(header, { childList: true, subtree: true });
    }
  });
})();

