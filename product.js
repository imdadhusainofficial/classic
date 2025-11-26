// ==========================
// Product Detail JS - Complete
// ==========================

// 🔹 پروڈکٹ کی تفصیل ایرے سے لانے کا فنکشن
function getProductDescription(product, lang = 'en') {
    if (lang === 'ur') {
        return product.description_ur || 'یہ ایک خوبصورت اور معیاری پروڈکٹ ہے جو استعمال کے لیے بہترین ہے۔';
    }
    return product.description || 'This is a high-quality product perfect for use.';
}

// 🔹 پروڈکٹ ڈیٹیل پیج کا فنکشن
function displayProductDetail(lang = 'en') {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = items.find(item => item.id === productId);

    if (!product) {
        document.getElementById('productDetailContent').innerHTML = '<p>Product not found</p>';
        return;
    }

    // 🔹 تصاویر
    let imagesHTML = product.images.map((image, index) => `
        <div class="detail-image ${index === 0 ? 'active' : ''}">
            <img src="${image}" alt="${product.item_name}">
        </div>
    `).join('');

    // 🔹 تھمب نیلز
    let thumbnailsHTML = product.images.map((img, i) => 
        `<img src="${img}" alt="Thumbnail ${i + 1}" class="${i === 0 ? 'active' : ''}" onclick="changeMainImage(${i})">`
    ).join('');

    // 🔹 مکمل HTML
    const productDetailHTML = `
        <div class="product-detail ${lang === 'ur' ? 'lang-ur' : 'lang-en'}">
            <div class="product-images">
                <div class="main-image-gallery">${imagesHTML}</div>
                <div class="image-thumbnails">${thumbnailsHTML}</div>
            </div>

            <div class="product-info">
                <div class="product-brand">${product.company}</div>
                <h1 class="product-name">${product.item_name}</h1>

                <div class="product-rating">
                    <div class="stars">★ ${product.rating?.stars || '4.5'}</div>
                    <div class="rating-text">(${product.rating?.count || '100'} ${lang === 'ur' ? 'ریویوز' : 'Reviews'})</div>
                </div>

                <div class="product-price">
                    <span class="current-price">Rs. ${product.current_price}</span>
                    <span class="original-price">Rs. ${product.original_price}</span>
                    <span class="discount">(${product.discount_percentage}% OFF)</span>
                </div>

                <div class="product-info-thumbnails">${thumbnailsHTML}</div>

                <div class="product-actions">
                    <button class="add-to-cart-btn" data-product-id="${product.id}">🛒 ${lang === 'ur' ? 'کارٹ میں شامل کریں' : 'Add To Cart'}</button>
                </div>

                <div class="product-description">
                    <h3>${lang === 'ur' ? 'تفصیل:' : 'Details:'}</h3>
                    <p>${getProductDescription(product, lang)}</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('productDetailContent').innerHTML = productDetailHTML;
    setupProductDetailInteractions();
    applyMixedLanguageAlignment();
}

// 🔹 Mixed language alignment function
function applyMixedLanguageAlignment() {
    const desc = document.querySelector('.product-description p');
    if (!desc) return;

    const sentences = desc.innerHTML.split(/(?<=[.؟!])/).map(s => s.trim()).filter(Boolean);

    const alignedSentences = sentences.map(sentence => {
        const urduRegex = /[\u0600-\u06FF]/;
        const englishRegex = /[A-Za-z]/;

        let urduCount = (sentence.match(urduRegex) || []).length;
        let engCount = (sentence.match(englishRegex) || []).length;

        const cls = urduCount >= engCount ? 'line-rtl' : 'line-ltr';
        return `<span class="${cls}">${sentence}</span>`;
    });

    desc.innerHTML = alignedSentences.join(' ');
}

// 🔹 کارٹ میں شامل کرنے کا فنکشن
function addToCart(productId) {
    const product = items.find(item => item.id === productId);
    if (!product || product.stock === 0) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cart.find(i => i.id === product.id);

    if (cartItem) {
        if (cartItem.quantity + 1 > (product.stock || 10)) return;
        cartItem.quantity += 1;
    } else {
        cart.push({
            uniqueId: Date.now() + Math.random(),
            id: product.id,
            name: product.item_name,
            brand: product.company,
            price: product.current_price,
            image: product.images[0],
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    const addBtn = document.querySelector(`.add-to-cart-btn[data-product-id="${productId}"]`);
    if (addBtn) {
        addBtn.classList.add('bubbled');
        setTimeout(() => addBtn.classList.remove('bubbled'), 400);
    }
}

// 🔹 مین امیج تبدیل کرنے کا فنکشن
function changeMainImage(index) {
    const images = document.querySelectorAll('.detail-image');
    const thumbs = document.querySelectorAll('.image-thumbnails img');
    const infoThumbs = document.querySelectorAll('.product-info-thumbnails img');

    images.forEach(i => i.classList.remove('active'));
    thumbs.forEach(t => t.classList.remove('active'));
    infoThumbs.forEach(t => t.classList.remove('active'));

    if (images[index]) images[index].classList.add('active');
    if (thumbs[index]) thumbs[index].classList.add('active');
    if (infoThumbs[index]) infoThumbs[index].classList.add('active');
}

// 🔹 انٹرایکشنز
function setupProductDetailInteractions() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    }
}

// 🔹 واپس جانے کا فنکشن
function goBack() {
    window.history.back();
}

// 🔹 زبان سوئچ فنکشنز
function switchToUrdu() {
    displayProductDetail('ur');
}

function switchToEnglish() {
    displayProductDetail('en');
}

// ✅ صفحہ لوڈ پر پروڈکٹ ڈیفالٹ انگلش میں شو
if (window.location.pathname.includes('product.html')) {
    document.addEventListener('DOMContentLoaded', () => displayProductDetail('en'));
}

// 🔹 گلوبل فنکشنز
window.addToCart = addToCart;
window.changeMainImage = changeMainImage;
window.goBack = goBack;
window.switchToUrdu = switchToUrdu;
window.switchToEnglish = switchToEnglish;
