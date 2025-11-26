// Common JavaScript for all pages - Cart Count Update Only

// ✅ کارٹ کاؤنٹ اپڈیٹ کرنے کا فنکشن (صرف bag icon پر نمبر کے لیے)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.querySelector('.bag-items');
    
    if (cartBadge) {
        if (cartCount > 0) {
            cartBadge.textContent = cartCount;
            cartBadge.style.display = 'block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// ✅ ہر صفحہ لوڈ ہونے پر کارٹ کاؤنٹ اپڈیٹ کریں
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// ✅ کارٹ میں شامل کرنے کا میسج دکھائیں - اب ختم کر دیا
function showAddedToCartMessage() {
    // اب کوئی میسج نہیں دکھایا جائے گا
    // صرف bag icon پر نمبر اپڈیٹ ہوگا
}

// گلوبل فنکشنز
window.updateCartCount = updateCartCount;
window.showAddedToCartMessage = showAddedToCartMessage;