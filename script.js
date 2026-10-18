
/* =====================================
   FRESHMART - PRODUCTS
===================================== */

const products = [
    {
        id: 1,
        name: "Fresh Apples",
        price: 120,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Bananas",
        price: 50,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Fresh Milk",
        price: 60,
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Tomatoes",
        price: 40,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Potatoes",
        price: 30,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "Carrots",
        price: 45,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500&auto=format&fit=crop"
    },
    {
        id: 7,
        name: "Fresh Bread",
        price: 35,
        category: "Bakery",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop"
    },
    {
        id: 8,
        name: "Fresh Grapes",
        price: 90,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop"
    },
    {
        id: 9,
        name: "Broccoli",
        price: 70,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&auto=format&fit=crop"
    },
    {
        id: 10,
        name: "Oranges",
        price: 80,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop"
    },
    {
        id: 11,
        name: "Green Capsicum",
        price: 50,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop"
    },
    {
        id: 12,
        name: "Cheese",
        price: 100,
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop"
    }
];

/* =====================================
   SAFE LOCAL STORAGE
===================================== */

function loadSavedIds(key) {
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function saveIds(key, ids) {
    try {
        localStorage.setItem(key, JSON.stringify(ids));
    } catch (error) {
        console.warn("Could not save data in this browser.");
    }
}

/* =====================================
   CART AND WISHLIST DATA
===================================== */

let cart = [];
let wishlist = loadSavedIds("freshmartWishlist")
    .map(Number)
    .filter(id => products.some(product => product.id === id));

saveIds("freshmartWishlist", wishlist);

/* =====================================
   DISPLAY PRODUCTS
===================================== */

function displayProducts(items) {
    const productList = document.getElementById("product-list");

    if (!productList) return;

    if (items.length === 0) {
        productList.innerHTML =
            '<p class="no-products">No products found. Try another search.</p>';
        return;
    }

    productList.innerHTML = items.map(product => {
        const saved = wishlist.includes(product.id);

        return `
            <div class="product-card">
                <button
                    type="button"
                    class="wishlist-heart ${saved ? "is-saved" : ""}"
                    data-wishlist-id="${product.id}"
                    aria-label="${saved ? "Remove from" : "Add to"} wishlist"
                    aria-pressed="${saved}"
                    title="${saved ? "Remove from wishlist" : "Add to wishlist"}"
                >${saved ? "♥" : "♡"}</button>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-photo"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >

                <h3>${product.name}</h3>
                <p>₹${product.price}</p>

                <button
                    type="button"
                    data-add-cart="${product.id}"
                >Add to Cart</button>
            </div>
        `;
    }).join("");
}

/* =====================================
   WISHLIST FUNCTIONS
===================================== */

function toggleWishlist(id) {
    id = Number(id);

    if (!products.some(product => product.id === id)) return;

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(itemId => itemId !== id);
    } else {
        wishlist.push(id);
    }

    saveIds("freshmartWishlist", wishlist);

    // Refresh the product cards and saved items.
    const searchInput = document.getElementById("search");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    displayProducts(filteredProducts);
    displayWishlist();
}

function displayWishlist() {
    const wishlistList = document.getElementById("wishlist-list");
    const emptyMessage = document.getElementById("wishlist-empty");

    if (!wishlistList || !emptyMessage) return;

    const savedProducts = wishlist
        .map(id => products.find(product => product.id === id))
        .filter(Boolean);

    if (savedProducts.length === 0) {
        wishlistList.innerHTML = "";
        emptyMessage.classList.remove("is-hidden");
        return;
    }

    emptyMessage.classList.add("is-hidden");

    wishlistList.innerHTML = savedProducts.map(product => `
        <div class="product-card">
            <button
                type="button"
                class="wishlist-heart is-saved"
                data-wishlist-id="${product.id}"
                aria-label="Remove ${product.name} from wishlist"
                aria-pressed="true"
                title="Remove from wishlist"
            >♥</button>

            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-photo"
                loading="lazy"
                onerror="this.style.display='none'"
            >

            <h3>${product.name}</h3>
            <p>₹${product.price}</p>

            <button type="button" data-add-cart="${product.id}">
                Add to Cart
            </button>

            <button
                type="button"
                class="wishlist-remove"
                data-remove-wishlist="${product.id}"
            >Remove from Wishlist</button>
        </div>
    `).join("");
}

/* =====================================
   ADD TO CART
===================================== */

function addToCart(id) {
    id = Number(id);

    const product = products.find(item => item.id === id);
    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    displayCart();
}

/* =====================================
   DISPLAY CART
===================================== */

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");

    if (!cartItems || !totalElement) return;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="cart-empty">Your cart is empty. Add some fresh groceries!</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <strong>${item.name}</strong>

                <div class="cart-quantity">
                    <button
                        type="button"
                        data-quantity-id="${item.id}"
                        data-change="-1"
                        aria-label="Decrease ${item.name} quantity"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        data-quantity-id="${item.id}"
                        data-change="1"
                        aria-label="Increase ${item.name} quantity"
                    >+</button>
                </div>

                <strong>₹${item.price * item.quantity}</strong>

                <button
                    type="button"
                    class="wishlist-remove"
                    data-remove-cart="${item.id}"
                >Remove</button>
            </div>
        `).join("");
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    totalElement.textContent = total;
}

/* =====================================
   CHANGE CART QUANTITY
===================================== */

function changeQuantity(id, change) {
    id = Number(id);
    change = Number(change);

    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    displayCart();
}

/* =====================================
   REMOVE CART ITEM
===================================== */

function removeFromCart(id) {
    id = Number(id);
    cart = cart.filter(item => item.id !== id);
    displayCart();
}

/* =====================================
   BUTTON CLICK HANDLING
===================================== */

document.addEventListener("click", function(event) {
    const wishlistButton = event.target.closest("[data-wishlist-id]");
    const removeWishlistButton = event.target.closest("[data-remove-wishlist]");
    const addCartButton = event.target.closest("[data-add-cart]");
    const quantityButton = event.target.closest("[data-quantity-id]");
    const removeCartButton = event.target.closest("[data-remove-cart]");

    if (wishlistButton) {
        toggleWishlist(wishlistButton.dataset.wishlistId);
        return;
    }

    if (removeWishlistButton) {
        toggleWishlist(removeWishlistButton.dataset.removeWishlist);
        return;
    }

    if (addCartButton) {
        addToCart(addCartButton.dataset.addCart);
        return;
    }

    if (quantityButton) {
        changeQuantity(
            quantityButton.dataset.quantityId,
            quantityButton.dataset.change
        );
        return;
    }

    if (removeCartButton) {
        removeFromCart(removeCartButton.dataset.removeCart);
    }
});

/* =====================================
   SEARCH PRODUCTS
===================================== */

const searchInput = document.getElementById("search");

if (searchInput) {
    searchInput.addEventListener("input", function() {
        const query = this.value.trim().toLowerCase();

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        displayProducts(filteredProducts);
    });
}

/* =====================================
   CHECKOUT DEMO
===================================== */

const checkoutButton = document.getElementById("checkout");

if (checkoutButton) {
    checkoutButton.addEventListener("click", function() {
        if (cart.length === 0) {
            alert("Your cart is empty! Please add some products first.");
            return;
        }

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        alert(
            "Thank you for shopping with FreshMart! 🛒\n\n" +
            "Your total is ₹" + total +
            "\n\nThis is a demo checkout. No real order or payment was made."
        );

        cart = [];
        displayCart();
    });
}

/* =====================================
   INITIAL PAGE LOAD
===================================== */

displayProducts(products);
displayWishlist();
displayCart();
