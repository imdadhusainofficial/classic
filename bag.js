document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    setupBackButton();

    // Place Order button click
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', openOrderFormAuto);
    }
});

// ==========================
// Load Cart Items
// ==========================
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const itemCountElement = document.getElementById('itemCount');

    if (!cartItemsContainer) return;

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (itemCountElement) itemCountElement.textContent = `${totalItems} آئٹمز`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>آپ کی خریداری خالی ہے</h2>
                <p>اپنی پسند کی چیزیں شامل کریں!</p>
                <a href="../index.html" class="continue-shopping">خریداری جاری رکھیں</a>
            </div>
        `;
        updatePriceDetails(0);
    } else {
        let totalPrice = 0;
        let itemsHTML = '';

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            itemsHTML += `
                <div class="cart-item">
                    <button class="remove-btn" onclick="removeItem(${index})">×</button>
                    <img src="../${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-brand">${item.brand}</div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs. ${item.price}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        <div class="item-total">کل: Rs. ${itemTotal}</div>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = itemsHTML;
        updatePriceDetails(totalPrice);
    }

    updateCartCount();
}

// ==========================
// Price Details
// ==========================
function updatePriceDetails(totalPrice) {
    const discount = totalPrice * 0.1;
    const delivery = totalPrice > 1000 ? 0 : 99;
    const finalPrice = totalPrice - discount + delivery;

    const totalPriceElement = document.getElementById('totalPrice');
    const discountElement = document.getElementById('discount');
    const deliveryElement = document.getElementById('delivery');
    const finalPriceElement = document.getElementById('finalPrice');

    if (totalPriceElement) totalPriceElement.textContent = `Rs. ${totalPrice}`;
    if (discountElement) discountElement.textContent = `-Rs. ${Math.round(discount)}`;
    if (deliveryElement) deliveryElement.textContent = `Rs. ${delivery}`;
    if (finalPriceElement) finalPriceElement.textContent = `Rs. ${Math.round(finalPrice)}`;
}

// ==========================
// Quantity / Remove
// ==========================
function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
    }
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

// ==========================
// Bag Icon Update
// ==========================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const bagIconCount = document.querySelector('.bag-items');
    if (bagIconCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        bagIconCount.textContent = totalItems;
        bagIconCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// ==========================
// Open Order Form with Language Toggle & Stock Reduce
// ==========================
function openOrderFormAuto() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('سب سے پہلے کچھ خریداری کریں۔');
        return;
    }

    if (document.getElementById('orderFormContainer')) return;

    const finalPrice = document.getElementById('finalPrice').textContent || 'N/A';
    const trackingId = 'TRK-' + Math.floor(Math.random() * 1000000);

    const itemsHTML = cart.map(item =>
        `<li>ID: ${item.id} | ${item.name} x${item.quantity} : Rs.${item.price * item.quantity}</li>`
    ).join('');

    const formHTML = `
        <div id="orderFormContainer" class="order-form-overlay">
            <form id="orderForm" class="order-form-box">
                <h2 data-en="Fill the Form" data-ur="فارم پُر کریں">فارم پُر کریں</h2>

                <!-- Language switch -->
                <div class="lang-switch">
                    <label for="language">Language / زبان:</label>
                    <select id="language">
                        <option value="en">English</option>
                        <option value="ur" selected>اردو</option>
                    </select>
                </div>

                <ul>${itemsHTML}</ul>
                <div>Tracking ID: ${trackingId}</div>
                <div>Final Price: ${finalPrice}</div>

                <label data-en="Name" data-ur="نام" for="customerName">نام:</label>
                <input type="text" id="customerName" required>

                <label data-en="Phone" data-ur="فون نمبر" for="customerPhone">فون نمبر:</label>
                <input type="text" id="customerPhone" required>

                <label data-en="Address" data-ur="پتہ / ایڈریس" for="customerAddress">پتہ / ایڈریس:</label>
                <textarea id="customerAddress" required></textarea>

                <button type="submit" class="submit-btn" data-en="Submit" data-ur="سبمٹ کریں">سبمٹ کریں</button>
            </form>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHTML);

    const langSelect = document.getElementById('language');
    const orderForm = document.getElementById('orderForm');

    // Function to update text direction
    function updateFormDirection(lang) {
        if(lang === 'en') {
            orderForm.style.direction = 'ltr';
            orderForm.style.textAlign = 'left';
        } else {
            orderForm.style.direction = 'rtl';
            orderForm.style.textAlign = 'right';
        }
    }

    // Initial direction based on default select
    updateFormDirection(langSelect.value);

    // Language toggle
    langSelect.addEventListener('change', () => {
        const lang = langSelect.value;
        document.querySelectorAll('#orderForm label, #orderForm h2, #orderForm .submit-btn').forEach(el => {
            if(el.getAttribute('data-' + lang)) el.textContent = el.getAttribute('data-' + lang);
        });

        // Update direction
        updateFormDirection(lang);
    });

    // Form submit
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;

        let message = `New Order / نیا آرڈر!\nTracking ID: ${trackingId}\nName/نام: ${name}\nPhone/فون: ${phone}\nAddress/پتہ: ${address}\nItems/آئٹمز:\n`;

        cart.forEach(item => {
            message += `ID: ${item.id} | ${item.name} x${item.quantity} : Rs.${item.price * item.quantity}\n`;

            // Reduce stock automatically
            const product = items.find(p => p.id === item.id);
            if(product) {
                product.stock -= item.quantity;
                if(product.stock < 0) product.stock = 0;
            }
        });

        message += `Final Price / کل قیمت: ${finalPrice}`;

        // WhatsApp
        const myWhatsappNumber = '03136518694';
        const whatsappURL = `https://wa.me/92${myWhatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');

        // Remove form & clear cart
        document.getElementById('orderFormContainer').remove();
        localStorage.removeItem('cart');
        loadCartItems();
    });
}

// ==========================
// Back Button
// ==========================
function goBack() { window.history.back(); }
function setupBackButton() {
    const backButton = document.querySelector('.back-button');
    if (backButton) backButton.addEventListener('click', goBack);
}

// ==========================
// Global Exports
// ==========================
window.loadCartItems = loadCartItems;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.openOrderFormAuto = openOrderFormAuto;
window.goBack = goBack;
window.updateCartCount = updateCartCount;
