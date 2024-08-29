document.addEventListener('DOMContentLoaded', () => {
    // Burger Menu Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const h1 = document.querySelector('header h1');
    const burger = document.querySelector('.burger');
    const originalLogo = document.querySelector('#original-logo'); // ID for the original logo
    const logoSrc = '../../images/logo.png'; // Path to your logo image
    const numberOfLogos = 20; // Number of logos to create
    const logos = [];
    const logoSize = 50; // Size of the logos (adjust as needed)

    function getRect(element) {
        return element.getBoundingClientRect();
    }

    function getSafePosition(excludedRects) {
        const headerRect = getRect(header);
        let top, left;
        let safe;

        do {
            top = Math.random() * (headerRect.height - logoSize);
            left = Math.random() * (headerRect.width - logoSize);
            safe = excludedRects.every(rect => (
                top + logoSize <= rect.top || 
                top >= rect.bottom || 
                left + logoSize <= rect.left || 
                left >= rect.right
            ));
        } while (!safe);

        return { top, left };
    }

    function placeLogos() {
        const navRect = getRect(nav);
        const h1Rect = getRect(h1);
        const burgerRect = getRect(burger);

        // Hide the original logo if the screen width is less than 1389px
        const screenWidth = window.innerWidth;
        if (originalLogo) {
            originalLogo.style.display = screenWidth < 1389 ? 'none' : 'block';
        }

        // Clear existing logos if any
        logos.forEach(logo => logo.remove());
        logos.length = 0;

        // Determine the number of logos based on screen width
        const maxLogos = screenWidth < 1389 ? 6 : numberOfLogos;

        for (let i = 0; i < maxLogos; i++) {
            const logo = document.createElement('img');
            logo.src = logoSrc;
            logo.alt = 'Floating Logo';
            logo.classList.add('logo-floating');

            const { top, left } = getSafePosition([navRect, h1Rect, burgerRect]);
            logo.style.top = `${top}px`;
            logo.style.left = `${left}px`;

            header.appendChild(logo);
            logos.push(logo);
        }
    }

    function moveLogosAwayFromCursor(event) {
        const headerRect = getRect(header);
        const navRect = getRect(nav);
        const h1Rect = getRect(h1);
        const burgerRect = getRect(burger);

        logos.forEach(logo => {
            const logoRect = getRect(logo);
            const logoCenterX = logoRect.left + logoRect.width / 2;
            const logoCenterY = logoRect.top + logoRect.height / 2;
            const distanceX = logoCenterX - event.clientX;
            const distanceY = logoCenterY - event.clientY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

            if (distance < 100) { // If the cursor is within 100px of the logo
                const escapeFactor = 150 / distance;
                let newLeft = logoRect.left + distanceX * escapeFactor;
                let newTop = logoRect.top + distanceY * escapeFactor;

                // Ensure the logo stays within the header and avoids nav, h1, and burger
                newLeft = Math.max(0, Math.min(newLeft, headerRect.width - logoSize));
                newTop = Math.max(0, Math.min(newTop, headerRect.height - logoSize));

                // Ensure the logo avoids the navbar and h1 by pushing it away if it gets too close
                if (
                    newTop < navRect.bottom &&
                    newTop + logoSize > navRect.top &&
                    newLeft < navRect.right &&
                    newLeft + logoSize > navRect.left
                ) {
                    if (newTop + logoSize / 2 < navRect.bottom) {
                        newTop = navRect.bottom;
                    } else {
                        newTop = navRect.top - logoSize;
                    }
                }

                if (
                    newTop < h1Rect.bottom &&
                    newTop + logoSize > h1Rect.top &&
                    newLeft < h1Rect.right &&
                    newLeft + logoSize > h1Rect.left
                ) {
                    if (newTop + logoSize / 2 < h1Rect.bottom) {
                        newTop = h1Rect.bottom;
                    } else {
                        newTop = h1Rect.top - logoSize;
                    }
                }

                // Ensure the logo avoids the burger by pushing it away if it gets too close
                if (
                    newTop < burgerRect.bottom &&
                    newTop + logoSize > burgerRect.top &&
                    newLeft < burgerRect.right &&
                    newLeft + logoSize > burgerRect.left
                ) {
                    if (newTop + logoSize / 2 < burgerRect.bottom) {
                        newTop = burgerRect.bottom;
                    } else {
                        newTop = burgerRect.top - logoSize;
                    }
                }

                // Apply new position
                logo.style.transition = 'top 0.3s ease, left 0.3s ease';
                logo.style.left = `${newLeft}px`;
                logo.style.top = `${newTop}px`;
            }
        });
    }

    // Place logos initially
    placeLogos();

    // Recalculate logo positions on resize and zoom
    window.addEventListener('resize', placeLogos);

    // Make logos move away from the cursor
    header.addEventListener('mousemove', moveLogosAwayFromCursor);
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const textarea = form.querySelector('textarea');
    const inputs = form.querySelectorAll('input, textarea');
    const button = form.querySelector('button');

    function adjustTextareaHeight() {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }

    textarea.addEventListener('input', adjustTextareaHeight);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                isValid = false;
                input.classList.add('error');
                input.style.borderColor = '#ff6b6b';
            } else {
                input.classList.remove('error');
                input.style.borderColor = '';
            }
        });

        if (isValid) {
            const originalText = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;
            button.style.opacity = '0.7';

            // Simulate form submission
            setTimeout(() => {
                button.textContent = 'Sent!';
                button.style.backgroundColor = '#4caf50';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.opacity = '';
                    button.style.backgroundColor = '';
                    form.reset();
                    adjustTextareaHeight();
                }, 2000);
            }, 2000);
        }
    });
});