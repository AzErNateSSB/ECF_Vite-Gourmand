// ── FILTRES ──────────────────────────────────────────────────────────────────
(function () {
    const items   = Array.from(document.querySelectorAll('.menu-item'));
    const grid    = document.getElementById('menus-grid');
    const countEl = document.getElementById('filter-count');
    const noRes   = document.getElementById('no-results');

    if (!grid) return;

    let activeTags    = new Set();
    let activeThemes  = new Set();
    let minPrice      = null;
    let maxPrice      = null;
    let minQty        = null;
    let maxQty        = null;
    let deliveryDate  = null;
    let sortDir       = null;

    function updateCount(n) {
        countEl.textContent = n === items.length
            ? ''
            : `${n} menu${n > 1 ? 's' : ''} affiché${n > 1 ? 's' : ''}`;
        noRes.style.display = n === 0 ? 'block' : 'none';
    }

    function applyFilters() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let visible = items.filter(item => {
            const tags     = item.dataset.tags.split(' ');
            const price    = parseFloat(item.dataset.price);
            const itemMin  = parseInt(item.dataset.minQty);
            const itemMax  = parseInt(item.dataset.maxQty);
            const prepDays = parseInt(item.dataset.prepDays) || 0;
            const themes   = item.dataset.themes.split(' ');

            if (activeTags.size > 0 && ![...activeTags].every(t => tags.includes(t))) return false;
            if (minPrice !== null && price < minPrice) return false;
            if (maxPrice !== null && price > maxPrice) return false;
            if (minQty !== null && itemMax > 0 && itemMax < minQty) return false;
            if (maxQty !== null && itemMin > maxQty) return false;
            if (deliveryDate !== null) {
                const earliest = new Date(today);
                earliest.setDate(earliest.getDate() + prepDays);
                if (deliveryDate < earliest) return false;
            }
            if (activeThemes.size > 0 && ![...activeThemes].some(t => themes.includes(t))) return false;
            return true;
        });

        if (sortDir) {
            visible.sort((a, b) => {
                const pa = parseFloat(a.dataset.price);
                const pb = parseFloat(b.dataset.price);
                return sortDir === 'asc' ? pa - pb : pb - pa;
            });
        }

        items.forEach(i => i.style.display = 'none');
        visible.forEach(i => { i.style.display = ''; grid.appendChild(i); });
        updateCount(visible.length);
    }

    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter;
            if (activeTags.has(f)) { activeTags.delete(f); btn.classList.remove('active'); }
            else                   { activeTags.add(f);    btn.classList.add('active'); }
            applyFilters();
        });
    });

    document.querySelectorAll('[data-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.dataset.theme;
            if (activeThemes.has(t)) { activeThemes.delete(t); btn.classList.remove('active'); }
            else                     { activeThemes.add(t);    btn.classList.add('active'); }
            applyFilters();
        });
    });

    const rangeMinEl      = document.getElementById('price-range-min');
    const priceMinDisplay = document.getElementById('price-min-display');
    rangeMinEl.addEventListener('input', () => {
        const v = parseInt(rangeMinEl.value);
        minPrice = v <= 15 ? null : v;
        priceMinDisplay.textContent = minPrice === null ? '— €' : `${v} €`;
        applyFilters();
    });

    const rangeEl      = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    rangeEl.addEventListener('input', () => {
        const v = parseInt(rangeEl.value);
        maxPrice = v >= 100 ? null : v;
        priceDisplay.textContent = maxPrice === null ? '— €' : `${v} €`;
        applyFilters();
    });

    let minQtyVal = null;
    const minQtyDisplay = document.getElementById('min-qty-display');
    document.getElementById('min-qty-plus').addEventListener('click', () => {
        minQtyVal = minQtyVal === null ? 5 : minQtyVal + 5;
        minQty = minQtyVal;
        minQtyDisplay.textContent = minQtyVal;
        applyFilters();
    });
    document.getElementById('min-qty-minus').addEventListener('click', () => {
        if (minQtyVal === null || minQtyVal <= 5) { minQtyVal = null; minQty = null; minQtyDisplay.textContent = '—'; }
        else { minQtyVal -= 5; minQty = minQtyVal; minQtyDisplay.textContent = minQtyVal; }
        applyFilters();
    });

    let maxQtyVal = null;
    const maxQtyDisplay = document.getElementById('max-qty-display');
    document.getElementById('max-qty-plus').addEventListener('click', () => {
        maxQtyVal = maxQtyVal === null ? 50 : maxQtyVal + 10;
        maxQty = maxQtyVal;
        maxQtyDisplay.textContent = maxQtyVal;
        applyFilters();
    });
    document.getElementById('max-qty-minus').addEventListener('click', () => {
        if (maxQtyVal === null || maxQtyVal <= 10) { maxQtyVal = null; maxQty = null; maxQtyDisplay.textContent = '—'; }
        else { maxQtyVal -= 10; maxQty = maxQtyVal; maxQtyDisplay.textContent = maxQtyVal; }
        applyFilters();
    });

    const dateInput = document.getElementById('delivery-date');
    dateInput.addEventListener('change', () => {
        deliveryDate = dateInput.value ? new Date(dateInput.value) : null;
        if (deliveryDate) deliveryDate.setHours(0, 0, 0, 0);
        applyFilters();
    });

    const sortAsc  = document.getElementById('sort-asc');
    const sortDesc = document.getElementById('sort-desc');
    sortAsc.addEventListener('click', () => {
        if (sortDir === 'asc') { sortDir = null; sortAsc.classList.remove('active'); }
        else { sortDir = 'asc'; sortAsc.classList.add('active'); sortDesc.classList.remove('active'); }
        applyFilters();
    });
    sortDesc.addEventListener('click', () => {
        if (sortDir === 'desc') { sortDir = null; sortDesc.classList.remove('active'); }
        else { sortDir = 'desc'; sortDesc.classList.add('active'); sortAsc.classList.remove('active'); }
        applyFilters();
    });

    document.getElementById('filter-reset').addEventListener('click', () => {
        activeTags.clear(); activeThemes.clear();
        minPrice = null; maxPrice = null; minQty = null; maxQty = null; sortDir = null;
        minQtyVal = null; maxQtyVal = null; deliveryDate = null;
        rangeMinEl.value = 15;
        priceMinDisplay.textContent = '— €';
        rangeEl.value = 100;
        priceDisplay.textContent = '— €';
        minQtyDisplay.textContent = '—';
        maxQtyDisplay.textContent = '—';
        dateInput.value = '';
        document.querySelectorAll('[data-filter], [data-theme], .sort-btn').forEach(b => b.classList.remove('active'));
        applyFilters();
    });

    updateCount(items.length);
})();

// ── STOCK : badge sur les cartes ─────────────────────────────────────────────
(function () {
    document.querySelectorAll('.menu-item[data-stock]').forEach(item => {
        const stock = parseInt(item.dataset.stock);
        const el = item.querySelector('.menu-card__stock');
        if (!el) return;
        let cls = 'menu-card__stock--ok';
        if (stock <= 5)  cls = 'menu-card__stock--critical';
        else if (stock <= 10) cls = 'menu-card__stock--low';
        el.className = `menu-card__stock ${cls}`;
        el.innerHTML = `<i class="bi bi-box-seam"></i> ${stock} commande${stock > 1 ? 's' : ''} disponible${stock > 1 ? 's' : ''}`;
    });
})();

// ── MODAL DÉTAIL + PANIER ─────────────────────────────────────────────────────
(function () {

    const ALLERGENS = {
        delice:     { 0: ['Poisson', 'Céleri'],                    1: ['Céleri'],                          2: ['Fruits à coque', 'Soja'] },
        gourmand:   { 0: ['Céleri'],                               1: ['Poisson', 'Céleri'],               2: ['Œufs'] },
        prestige:   { 0: ['Œufs', 'Lait', 'Fruits à coque'],      1: ['Céleri', 'Soja'],                  2: ['Fruits à coque'] },
        vegetarien: { 0: ['Céleri'],                               1: ['Lait', 'Céleri'],                  2: ['Lait', 'Œufs'] },
        cocktail:   { 0: ['Crustacés', 'Poisson', 'Lait'],        1: ['Lait'],                            2: ['Œufs', 'Fruits à coque', 'Lait'] },
        mer:        { 0: ['Mollusques', 'Lait'],                   1: ['Mollusques', 'Céleri', 'Soja'],    2: [] },
        terroir:    { 0: ['Fruits à coque', 'Moutarde', 'Céleri'],1: ['Céleri'],                          2: ['Œufs', 'Lait'] },
        enfants:    { 0: ['Céleri', 'Lait'],                       1: [],                                  2: ['Œufs', 'Fruits à coque'] },
        brunch:     { 0: ['Gluten', 'Lait', 'Œufs'],              1: ['Poisson', 'Lait'],                 2: ['Lait'] },
        fusion:     { 0: ['Poisson', 'Graines de sésame', 'Soja'],1: ['Graines de sésame', 'Soja'],      2: ['Lait', 'Œufs'] },
        ete:        { 0: ['Soja'],                                  1: ['Céleri', 'Moutarde'],              2: ['Lait', 'Œufs'] },
        luxe:       { 0: ['Œufs', 'Lait', 'Mollusques'],          1: ['Crustacés', 'Mollusques', 'Gluten'],2: ['Œufs', 'Lait'] },
    };
    const overlay      = document.getElementById('menu-modal');
    const modalClose   = document.getElementById('modal-close');
    const imgStack     = document.getElementById('modal-img-stack');
    const modalContent = document.getElementById('modal-content');
    const toast        = document.getElementById('cart-toast');
    const toastMsg     = document.getElementById('cart-toast-msg');

    if (!overlay) return;

    let currentItem = null;
    let currentQty  = 0;
    let currentMin  = 0;
    let currentMax  = 999;
    let currentPrice = 0;
    let toastTimer  = null;

    // ── Panier ────────────────────────────────────────────────────────────────
    function getCart() { return JSON.parse(localStorage.getItem('veg_cart') || '[]'); }
    function saveCart(cart) { localStorage.setItem('veg_cart', JSON.stringify(cart)); }

    function calcTotal(price, qty, minQty) {
        const discounted = qty >= minQty + 5;
        return { total: price * qty * (discounted ? 0.9 : 1), discounted };
    }

    function showToast(msg) {
        toastMsg.textContent = msg;
        toast.classList.add('cart-toast--visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('cart-toast--visible'), 2500);
    }

    function addToCart() {
        const name   = currentItem.querySelector('.menu-card__name').textContent.trim();
        const menuId = currentItem.querySelector('[id^="carousel-"]').id.replace('carousel-', '');
        // menuId also available in outer scope via openModal closure — kept here for self-containment
        const { total } = calcTotal(currentPrice, currentQty, currentMin);

        const cart = getCart();
        const idx  = cart.findIndex(i => i.id === menuId);
        if (idx >= 0) { cart[idx].qty = currentQty; cart[idx].total = +total.toFixed(2); }
        else cart.push({ id: menuId, name, qty: currentQty, pricePerUnit: currentPrice, total: +total.toFixed(2) });
        saveCart(cart);

        const btn = document.getElementById('modal-add-btn');
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Ajouté !';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-cart-plus"></i> Ajouter au panier';
            btn.disabled = false;
        }, 1500);

        showToast(`"${name}" ajouté au panier (${currentQty} plats)`);
    }

    // ── Mise à jour affichage quantité / total ────────────────────────────────
    function refreshOrder() {
        const qtyEl   = document.getElementById('modal-qty-val');
        const totalEl = document.getElementById('modal-total');
        const infoEl  = document.getElementById('modal-discount-info');
        if (!qtyEl) return;

        qtyEl.textContent = currentQty;

        const { total, discounted } = calcTotal(currentPrice, currentQty, currentMin);
        totalEl.textContent = total.toFixed(2).replace('.', ',') + ' €';
        totalEl.classList.toggle('menu-modal__total-val--discount', discounted);
        if (infoEl) infoEl.style.display = discounted ? 'block' : 'none';

        document.getElementById('modal-qty-minus').disabled = currentQty <= currentMin;
        document.getElementById('modal-qty-plus').disabled  = currentQty >= currentMax;
    }

    // ── Ouverture du modal ────────────────────────────────────────────────────
    function openModal(item) {
        currentItem  = item;
        currentPrice = parseFloat(item.dataset.price);
        currentMin   = parseInt(item.dataset.minQty)  || 10;
        currentMax   = parseInt(item.dataset.maxQty)  || 999;
        currentQty   = currentMin;
        const prepDays = parseInt(item.dataset.prepDays) || 0;

        // Images empilées
        const imgs = Array.from(item.querySelectorAll('.carousel-item img'));
        imgStack.innerHTML = imgs.map(img =>
            `<img src="${img.src}" alt="${img.alt}" class="menu-modal__img">`
        ).join('');

        // Contenu
        const name     = item.querySelector('.menu-card__name').textContent.trim();
        const desc     = item.querySelector('.menu-card__desc').textContent.trim();
        const tagsHTML = item.querySelector('.menu-card__tags').outerHTML;
        const themeTags = Array.from(item.querySelectorAll('.menu-card__title-row .menu-tag'))
                               .map(t => t.outerHTML).join('');
        const stock    = parseInt(item.dataset.stock) || 0;
        const menuId   = item.querySelector('[id^="carousel-"]').id.replace('carousel-', '');
        const menuAllergens = ALLERGENS[menuId] || {};

        // Cours avec allergènes injectés
        const courseItems = Array.from(item.querySelectorAll('.menu-card__courses li'));
        const coursesHTML = '<ul class="menu-card__courses">' + courseItems.map((li, i) => {
            const allergens = menuAllergens[i] || [];
            const allergenBadges = allergens.length
                ? `<div class="menu-modal__allergens">${allergens.map(a => `<span class="menu-modal__allergen-badge">${a}</span>`).join('')}</div>`
                : '';
            return `<li>${li.innerHTML}${allergenBadges}</li>`;
        }).join('') + '</ul>';

        const prepLine = prepDays > 0
            ? `<div class="menu-modal__prep"><i class="bi bi-clock-history"></i> À commander <strong>${prepDays} jour${prepDays > 1 ? 's' : ''}</strong> minimum à l'avance</div>`
            : '';

        let stockCls = 'menu-modal__stock--ok';
        if (stock <= 5)  stockCls = 'menu-modal__stock--critical';
        else if (stock <= 10) stockCls = 'menu-modal__stock--low';
        const stockLine = `<div class="menu-modal__stock ${stockCls}"><i class="bi bi-box-seam"></i> <strong>${stock}</strong> commande${stock > 1 ? 's' : ''} disponible${stock > 1 ? 's' : ''}</div>`;

        const discountQty = currentMin + 5;

        modalContent.innerHTML = `
            <div class="menu-modal__title-row">
                <h2 class="menu-modal__name">${name}</h2>
                ${themeTags}
            </div>
            ${tagsHTML}
            <p class="menu-modal__desc">${desc}</p>
            <hr class="menu-modal__sep">
            ${coursesHTML}
            ${prepLine ? `<hr class="menu-modal__sep">${prepLine}` : ''}
            <hr class="menu-modal__sep">
            ${stockLine}
            <div class="menu-modal__order">
                <p class="menu-modal__unit-price">
                    ${currentPrice.toFixed(2).replace('.', ',')} € <span>par plat</span>
                </p>
                <div class="menu-modal__qty-row">
                    <span class="menu-modal__qty-label">Nombre de plats</span>
                    <div class="menu-modal__qty-ctrl">
                        <button class="persons-btn" id="modal-qty-minus"><i class="bi bi-dash"></i></button>
                        <span class="menu-modal__qty-val" id="modal-qty-val">${currentQty}</span>
                        <button class="persons-btn" id="modal-qty-plus"><i class="bi bi-plus"></i></button>
                    </div>
                </div>
                <p class="menu-modal__discount-hint" id="modal-discount-info" style="display:none;">
                    <i class="bi bi-tag-fill"></i> Réduction 10% appliquée
                </p>
                <div class="menu-modal__total-row">
                    Total : <strong class="menu-modal__total-val" id="modal-total"></strong>
                </div>
                <p class="menu-modal__discount-notice">
                    <i class="bi bi-info-circle"></i> −10% dès ${discountQty} plats (min. ${currentMin})
                </p>
                <button class="menu-modal__add-btn" id="modal-add-btn">
                    <i class="bi bi-cart-plus"></i> Ajouter au panier
                </button>
                <button class="menu-modal__order-btn" id="modal-order-btn">
                    <i class="bi bi-bag-check"></i> Commander ce menu
                </button>
            </div>`;

        document.getElementById('modal-qty-minus').addEventListener('click', () => {
            if (currentQty > currentMin) { currentQty--; refreshOrder(); }
        });
        document.getElementById('modal-qty-plus').addEventListener('click', () => {
            if (currentQty < currentMax) { currentQty++; refreshOrder(); }
        });
        document.getElementById('modal-add-btn').addEventListener('click', addToCart);
        document.getElementById('modal-order-btn').addEventListener('click', () => {
            const name = currentItem.querySelector('.menu-card__name').textContent.trim();
            const id   = currentItem.querySelector('[id^="carousel-"]').id.replace('carousel-', '');
            localStorage.setItem('veg_pending_order', JSON.stringify({
                id, name, qty: currentQty, pricePerUnit: currentPrice
            }));
            const isLoggedIn = !!localStorage.getItem('veg_user');
            if (isLoggedIn) {
                window.location.href = '/commande';
            } else {
                window.location.href = '/signin?redirect=commande';
            }
        });

        refreshOrder();
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    // ── Fermeture ─────────────────────────────────────────────────────────────
    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // ── Déclencheurs : clic sur carte (hors contrôles carrousel) ─────────────
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.carousel-control-prev, .carousel-control-next')) return;
            e.preventDefault();
            openModal(card.closest('.menu-item'));
        });
    });
})();
