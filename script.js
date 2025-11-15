
// Visitor Tracking - Server-side
async function initVisitorTracking() {
    try {
        // Check if this user has visited before
        const hasVisited = localStorage.getItem('hasVisited');
        
        if (!hasVisited) {
            // New visitor - increment counter on server
            await fetch('/api/visit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Mark this user as having visited
            localStorage.setItem('hasVisited', 'true');
        }
        
        // Always fetch and display current total
        updateVisitorDisplay();
        
        // Update display every 30 seconds
        setInterval(updateVisitorDisplay, 30000);
    } catch (error) {
        console.error('Error initializing visitor tracking:', error);
        document.getElementById('totalVisits').textContent = 'Error';
    }
}

async function updateVisitorDisplay() {
    try {
        const response = await fetch('/api/visits');
        const data = await response.json();
        
        const totalEl = document.getElementById('totalVisits');
        if (totalEl) {
            totalEl.textContent = data.total.toLocaleString();
        }
    } catch (error) {
        console.error('Error updating visitor display:', error);
        const totalEl = document.getElementById('totalVisits');
        if (totalEl) {
            totalEl.textContent = 'Error';
        }
    }
}

// Initialize visitor tracking on page load
initVisitorTracking();

// Search Functionality
const searchInput = document.getElementById('searchInput');
const scriptCards = document.querySelectorAll('.script-card');
const documentarySections = document.querySelectorAll('.documentary-section');
const documentarySeparator = document.getElementById('documentary-separator');
const disclaimerSection = document.querySelector('.disclaimer-section');
const noResults = document.getElementById('noResults');
const searchTerm = document.getElementById('searchTerm');

searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    let hasVisibleCards = false;

    scriptCards.forEach(card => {
        const scriptName = card.getAttribute('data-script-name') || '';
        const matchesSearch = scriptName.includes(query);

        if (matchesSearch) {
            card.classList.remove('hidden');
            hasVisibleCards = true;
        } else {
            card.classList.add('hidden');
        }
    });

    // Show/hide documentary sections and disclaimer based on search
    if (query === '') {
        documentarySections.forEach(section => section.classList.remove('hidden'));
        if (documentarySeparator) documentarySeparator.classList.remove('hidden');
        if (disclaimerSection) disclaimerSection.classList.remove('hidden');
        noResults.style.display = 'none';
    } else {
        documentarySections.forEach(section => section.classList.add('hidden'));
        if (documentarySeparator) documentarySeparator.classList.add('hidden');
        if (disclaimerSection) disclaimerSection.classList.add('hidden');

        if (!hasVisibleCards) {
            searchTerm.textContent = e.target.value;
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
});

// Copy Code Functionality
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;

    navigator.clipboard.writeText(code).then(() => {
        // Change icon to check mark
        button.classList.add('copied');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        // Reset after 2 seconds
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
        }, 2000);
    });
}

// Toggle Instructions
function toggleInstructions(button) {
    const instructionsContent = button.nextElementSibling;
    const isActive = button.classList.contains('active');

    if (isActive) {
        button.classList.remove('active');
        instructionsContent.classList.remove('show');
    } else {
        button.classList.add('active');
        instructionsContent.classList.add('show');
    }
}

// Smooth scroll for anchor links (if any are added later)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll shadow to navbar
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 10) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});
