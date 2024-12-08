// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');

// Function to fetch data from JSON file
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Fetched Data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to create a card element for a destination
function createDestinationCard(item) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    
    card.innerHTML = `      
        <div class="card-content">
            <img class="card-image" src="${item.imageUrl}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        </div>
    `;
    
    return card;
}

// Function to display search results
function displayResults(results, container) {
    container.innerHTML = '';
    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">No destinations found</p>';
        return;
    }
    
    results.forEach(item => {
        const card = createDestinationCard(item);
        container.appendChild(card);
    });
}

// Enhanced search function with flexible matching
function searchDestinations(data, searchTerm) {
    const results = [];
    searchTerm = searchTerm.toLowerCase().trim();
    
    // Search through countries and cities
    data.countries.forEach(country => {
        // Check country name
        if (country.name.toLowerCase().includes(searchTerm)) {
            // If country matches, add all its cities
            country.cities.forEach(city => results.push(city));
        } else {
            // Check each city
            country.cities.forEach(city => {
                // Check city name and description
                const cityText = `${city.name} ${city.description}`.toLowerCase();
                if (cityText.includes(searchTerm)) {
                    results.push(city);
                }
            });
        }
    });
    
    // Search through temples
    data.temples.forEach(temple => {
        const templeText = `${temple.name} ${temple.description}`.toLowerCase();
        if (templeText.includes(searchTerm)) {
            results.push(temple);
        }
    });
    
    // Search through beaches
    data.beaches.forEach(beach => {
        const beachText = `${beach.name} ${beach.description}`.toLowerCase();
        if (beachText.includes(searchTerm)) {
            results.push(beach);
        }
    });
    
    return results;
}

// Function to clear search and results
function clearSearch(resultsContainer) {
    // Clear search input
    searchInput.value = '';
    
    // Clear results container with fade effect
    resultsContainer.style.opacity = '0';
    setTimeout(() => {
        resultsContainer.innerHTML = '';
        // Reset opacity after clearing
        resultsContainer.style.opacity = '1';
    }, 300);

    // Return focus to search input
    searchInput.focus();
    
    // Show feedback message
    const message = document.createElement('p');
    message.className = 'clear-message';
    message.textContent = 'Search cleared';
    resultsContainer.appendChild(message);
    
    // Remove message after 2 seconds
    setTimeout(() => {
        if (message.parentNode === resultsContainer) {
            resultsContainer.removeChild(message);
        }
    }, 2000);


}

// Initialize the application
async function initializeApp() {
    const travelData = await fetchTravelData();
    if (!travelData) return;
    
    // Create results drawer container with absolute positioning
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-drawer';
    document.querySelector('.main-content').appendChild(resultsContainer);
    
    // Hide drawer initially
    resultsContainer.style.display = 'none';
    
    // Search button click handler
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            resultsContainer.style.display = 'none';
            return;
        }
        
        const results = searchDestinations(travelData, searchTerm);
        displayResults(results, resultsContainer);
        resultsContainer.style.display = 'block';
    });
    
    // Reset button click handler with enhanced clear functionality
    resetBtn.addEventListener('click', () => {
        clearSearch(resultsContainer);
        resultsContainer.style.display = 'none';
    });
    
    // Search on enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // Clear on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearSearch(resultsContainer);
        }
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
