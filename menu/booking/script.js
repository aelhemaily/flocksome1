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

document.addEventListener("DOMContentLoaded", function() {
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarDays = document.getElementById('calendar-days');
    const calendarHeader = document.getElementById('current-month');
    const timeSlotsElement = document.getElementById('time-slots');
    const bookingFormElement = document.getElementById('booking-form');
    const confirmationElement = document.getElementById('confirmation');
    const modal = document.getElementById('confirmation-modal');
    const orderSummary = document.getElementById('order-summary');
    const placeOrderButton = document.getElementById('place-order');
    const cancelOrderButton = document.getElementById('cancel-order');

    let availableDates = {};
    let currentDate = new Date();
    let selectedDate = null;
    let selectedSlot = null;

    // Fetch available dates from JSON file
    fetch('../../dates.json')
        .then(response => response.json())
        .then(data => {
            availableDates = data;
            updateAvailableDates();
            updateCalendar();
        })
        .catch(error => console.error('Error loading available dates:', error));

    function updateAvailableDates() {
        const today = new Date();
        for (const dateStr in availableDates) {
            const [day, month, year] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            
            if (date < today) {
                availableDates[dateStr] = { morning: 'booked', evening: 'booked' };
            }
        }
    }

    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Su'];

        // Update the calendar header
        calendarHeader.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Update the day letters
        calendarDays.innerHTML = dayNames.map(day => `<div>${day}</div>`).join('');

        // Clear the calendar grid
        calendarGrid.innerHTML = '';

        // Fill the calendar grid with empty divs for the days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const filler = document.createElement('div');
            calendarGrid.appendChild(filler);
        }

        // Fill the calendar grid with the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${year}`;
            const dateElement = document.createElement('div');
            dateElement.classList.add('date');
            dateElement.textContent = day;
            if (!availableDates[dateStr] || Object.values(availableDates[dateStr]).every(slot => slot === 'booked')) {
                dateElement.classList.add('unavailable');
            }
            dateElement.addEventListener('click', () => handleDateClick(dateStr));
            calendarGrid.appendChild(dateElement);
        }
    }

    function handleDateClick(dateStr) {
        if (!availableDates[dateStr] || Object.values(availableDates[dateStr]).every(slot => slot === 'booked')) return;

        selectedDate = dateStr;
        timeSlotsElement.innerHTML = '';
        timeSlotsElement.style.display = 'block';
        bookingFormElement.style.display = 'none';

        for (const [slot, status] of Object.entries(availableDates[dateStr])) {
            const slotElement = document.createElement('div');
            slotElement.classList.add('slot');
            if (status === 'booked') {
                slotElement.classList.add('unavailable');
            }
            slotElement.textContent = slot.charAt(0).toUpperCase() + slot.slice(1);
            slotElement.addEventListener('click', () => handleSlotClick(slot));
            timeSlotsElement.appendChild(slotElement);
        }
    }

    function handleSlotClick(slot) {
        console.log('Slot clicked:', slot); // Debugging
        if (availableDates[selectedDate][slot] === 'booked') {
            console.log('Slot is booked, not proceeding'); // Debugging
            return;
        }
    
        selectedSlot = slot;
        timeSlotsElement.style.display = 'none';
        bookingFormElement.style.display = 'block';
    
        console.log('Attempting to scroll...'); // Debugging
    
        // Delay the scrolling slightly to ensure the form is displayed
        setTimeout(() => {
            const appointmentForm = document.getElementById('appointment-form');
            if (appointmentForm) {
                appointmentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log('Scrolled to appointment form'); // Debugging
            } else {
                console.log('Appointment form element not found'); // Debugging
            }
        }, 50);
    }
    
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        updateCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        updateCalendar();
    });

    document.getElementById('appointment-form').addEventListener('submit', function(event) {
        event.preventDefault();
    
        // Gather form data
        const formData = new FormData(this);
        
        // Convert selectedDate string to Date object
        const [day, month, year] = selectedDate.split('-').map(Number);
        const dateObject = new Date(year, month - 1, day);
        
        // Format date as "4 Sep 24"
        const formattedDate = dateObject.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        }).replace(',', '');
        
        let summaryHtml = `
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${selectedSlot}</p>
            <h3>Sender Details</h3>
            <p><strong>Sender:</strong> ${formData.get('sender-name')}</p>
            <p><strong>Email:</strong> ${formData.get('email')}</p>
            <p><strong>Flock Size:</strong> ${formData.get('flock-size')}</p>
            <p><strong>Anonymous:</strong> ${formData.get('anonymous')}</p>
            <h3>Recipient Details</h3>
            <p><strong>Recipient:</strong> ${formData.get('recipient-name')}</p>
            <p><strong>Address:</strong> ${formData.get('recipient-address')}</p>
            <p><strong>City/Area:</strong> ${formData.get('city-area')}</p>
        `;
        
        // Only include the customized message if it's not empty
        const customMessage = formData.get('custom-message');
        if (customMessage.trim() !== '') {
            summaryHtml += `<h3>Customized Message</h3><p>${customMessage}</p>`;
        }
        
        // Only include the other notes if they're not empty
        const otherNotes = formData.get('other-notes');
        if (otherNotes.trim() !== '') {
            summaryHtml += `<h3>Other Notes/Instructions</h3><p>${otherNotes}</p>`;
        }
        
        orderSummary.innerHTML = summaryHtml;
        modal.style.display = 'flex';
    });
    

    placeOrderButton.addEventListener('click', () => {
        // Convert selectedDate string to Date object
        const [day, month, year] = selectedDate.split('-').map(Number);
        const dateObject = new Date(year, month - 1, day);
        
        // Format date as "4 Sep 24"
        const formattedDate = dateObject.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        }).replace(',', '');
    
        // Place the order and confirm booking
        modal.style.display = 'none';
        confirmationElement.style.display = 'block';
        confirmationElement.textContent = `Booking confirmed for ${formattedDate} in the ${selectedSlot}!`;
    
        // Mark the slot as booked
        availableDates[selectedDate][selectedSlot] = 'booked';
    
        // Reset form and hide it
        bookingFormElement.style.display = 'none';
        document.getElementById('appointment-form').reset();
    
        // Re-render the calendar
        updateCalendar();
    
        // // Hide confirmation after a few seconds and reset UI
        // setTimeout(() => {
        //     confirmationElement.style.display = 'none';
        //     timeSlotsElement.style.display = 'none';
        // }, 3000);
    });
    
    cancelOrderButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
});