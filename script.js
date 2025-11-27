// State
let allProducts = [];
let activeCategory = 'all';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('live-search-input');
const categoryFiltersContainer = document.getElementById('category-filters');

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');

        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');

        const categories = await response.json();
        renderCategoryButtons(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Render category buttons
function renderCategoryButtons(categories) {
    if (!categoryFiltersContainer) return;

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors capitalize';
        btn.textContent = category;
        btn.dataset.category = category;
        categoryFiltersContainer.appendChild(btn);
    });

    // Add click event listeners
    const buttons = categoryFiltersContainer.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.classList.remove('bg-black', 'text-white');
                b.classList.add('bg-gray-100', 'text-gray-700');
            });
            btn.classList.remove('bg-gray-100', 'text-gray-700');
            btn.classList.add('bg-black', 'text-white');

            activeCategory = btn.dataset.category;
            filterProducts();
        });
    });
}

// Filter products 
function filterProducts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

// Render products grid
function renderProducts(products) {
    if (!productsGrid) return;

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500">No products found matching your criteria.</p>
            </div>
        `;
        return;
    }  
// to display the product
// .map() goes through each product in the array.

// For each product, it calls createProductCard(product) which returns a block of HTML representing the product card.

// .join('') combines all returned HTML strings into one big string.

// That HTML is then placed into productsGrid.innerHTML, meaning:

// Every product card is displayed in the UI.
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML template رسم 
function createProductCard(product) {
    const rating = product.rating?.rate || 4.0;
    const fullStars = Math.floor(rating);

    return `
        <div class="w-full bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col cursor-pointer" onclick="openProductModal(${product.id})">
            <a href="javascript:void(0)" class="block relative aspect-square mb-6 bg-white rounded-base overflow-hidden flex items-center justify-center p-4">
                <img class="object-contain max-h-full max-w-full" src="${product.image}" alt="${product.title}" onerror="this.src='https://placehold.co/300x300/F0EEED/000000?text=Product'" />
            </a>
            <div class="flex-1 flex flex-col">
                <div class="flex items-center space-x-3 mb-3">
                    <div class="flex items-center space-x-1 rtl:space-x-reverse">
                        ${generateStars(fullStars)}
                    </div>
                    <span class="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded-sm">${rating.toFixed(1)}/5</span>
                </div>
                <a href="javascript:void(0)" class="mb-2 block">
                    <h5 class="text-lg text-heading font-semibold tracking-tight line-clamp-2" title="${product.title}">${product.title}</h5>
                </a>
                <p class="text-sm text-gray-500 capitalize mb-4">${product.category}</p>
                <div class="mt-auto flex items-center justify-between">
                    <span class="text-2xl font-extrabold text-heading">$${product.price.toFixed(2)}</span>
                    <button type="button" class="inline-flex items-center text-white bg-black hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2 focus:outline-none transition-colors" onclick="event.stopPropagation();">
                        <svg class="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                        </svg>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `;
}
// Generate star icons
function generateStars(fullStars) {
    let stars = '';
    const starSvg = `<svg class="w-4 h-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>`;
    const emptyStarSvg = `<svg class="w-4 h-4 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>`;

    for (let i = 0; i < 5; i++) {
        stars += i < fullStars ? starSvg : emptyStarSvg;
    }

    return stars;
}

// Event Listeners
if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
}

// Init
fetchProducts();
fetchCategories();
