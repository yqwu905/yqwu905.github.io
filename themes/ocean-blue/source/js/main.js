/**
 * Ocean Blue Theme JavaScript
 * Modern, Clean, Elegant
 */

(function() {
  'use strict';

  // DOM Ready
  document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initSmoothScrolling();
    initBackToTop();
    initImageLazyLoading();
    initCodeHighlight();
  });

  /**
   * Initialize mobile navigation
   */
  function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!navToggle || !mobileNav) return;

    navToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      navToggle.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.classList.toggle('nav-open');
    });

    // Close mobile nav when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }

  /**
   * Initialize smooth scrolling for anchor links
   */
  function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Initialize back to top button
   */
  function initBackToTop() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.title = '回到顶部';
    backToTop.setAttribute('aria-label', '回到顶部');
    document.body.appendChild(backToTop);

    // Show/hide button based on scroll position
    function toggleBackToTop() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Scroll to top when clicked
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Listen for scroll events
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));

    // Add CSS for back to top button
    const style = document.createElement('style');
    style.textContent = `
      .back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
      }
      
      .back-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .back-to-top:hover {
        background-color: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: var(--shadow-strong);
      }
      
      @media (max-width: 768px) {
        .back-to-top {
          bottom: 1rem;
          right: 1rem;
          width: 45px;
          height: 45px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize lazy loading for images
   */
  function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
      });

      // Add CSS for lazy loading
      const style = document.createElement('style');
      style.textContent = `
        img.lazy {
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        img.lazy:not([src]) {
          visibility: hidden;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Initialize code syntax highlighting
   */
  function initCodeHighlight() {
    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
      const pre = codeBlock.parentElement;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper';
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.innerHTML = '复制';
      copyBtn.title = '复制代码';
      
      copyBtn.addEventListener('click', function() {
        const text = codeBlock.textContent;
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.innerHTML = '已复制';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyBtn.innerHTML = '复制';
            copyBtn.classList.remove('copied');
          }, 2000);
        });
      });
      
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(copyBtn);
      wrapper.appendChild(pre);
    });

    // Add CSS for code blocks
    const style = document.createElement('style');
    style.textContent = `
      .code-wrapper {
        position: relative;
        margin: var(--spacing-lg) 0;
      }
      
      .copy-code-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background-color: var(--background-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: 0.25rem 0.5rem;
        border-radius: var(--border-radius-sm);
        font-size: var(--font-size-xs);
        cursor: pointer;
        transition: all var(--transition-fast);
        z-index: 1;
      }
      
      .copy-code-btn:hover {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
      
      .copy-code-btn.copied {
        background-color: #4CAF50;
        border-color: #4CAF50;
        color: white;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Throttle function to limit function calls
   */
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Debounce function to delay function calls
   */
  function debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // Add search functionality
  function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchToggle || !searchModal) return;

    searchToggle.addEventListener('click', function() {
      searchModal.classList.add('active');
      searchInput.focus();
    });

    // Close search modal
    const closeSearch = function() {
      searchModal.classList.remove('active');
      searchInput.value = '';
      searchResults.innerHTML = '';
    };

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSearch();
      }
    });

    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) {
        closeSearch();
      }
    });
  }

  // Initialize search
  initSearch();

})();