(function () {
    const items   = Array.from(document.querySelectorAll('.menu-item'));
    const grid    = document.getElementById('menus-grid');
    const countEl = document.getElementById('filter-count');
    const noRes   = document.getElementById('no-results');
    if (!grid) return;

    let activeTags = new Set(), activeThemes = new Set();
    let minPrice = null, maxPrice = null, minQty = null, maxQty = null;
    let deliveryDate = null, sortDir = null;

    function updateCount(n) {
        countEl.textContent = n === items.length ? '' : `${n} menu${n > 1 ? 's' : ''} affiché${n > 1 ? 's' : ''}`;
        noRes.style.display = n === 0 ? 'block' : 'none';
    }

    function applyFilters() {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        let visible = items.filter(item => {
            const tags     = item.dataset.tags   ? item.dataset.tags.split(' ').filter(Boolean) : [];
            const price    = parseFloat(item.dataset.price);
            const itemMin  = parseInt(item.dataset.minQty);
            const itemMax  = parseInt(item.dataset.maxQty);
            const prepDays = parseInt(item.dataset.prepDays) || 0;
            const themes   = item.dataset.themes ? item.dataset.themes.split(' ') : ['all'];
            if (activeTags.size > 0   && ![...activeTags].every(t => tags.includes(t)))   return false;
            if (minPrice !== null      && price < minPrice)                                 return false;
            if (maxPrice !== null      && price > maxPrice)                                 return false;
            if (minQty !== null        && itemMax < minQty)                                 return false;
            if (maxQty !== null        && itemMin > maxQty)                                 return false;
            if (deliveryDate !== null) {
                const earliest = new Date(today);
                earliest.setDate(earliest.getDate() + prepDays);
                if (deliveryDate < earliest) return false;
            }
            if (activeThemes.size > 0 && ![...activeThemes].some(t => themes.includes(t))) return false;
            return true;
        });
        if (sortDir) visible.sort((a, b) => sortDir === 'asc'
            ? parseFloat(a.dataset.price) - parseFloat(b.dataset.price)
            : parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
        items.forEach(i => i.style.display = 'none');
        visible.forEach(i => { i.style.display = ''; grid.appendChild(i); });
        updateCount(visible.length);
    }

    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter;
            if (activeTags.has(f)) { activeTags.delete(f); btn.classList.remove('active'); }
            else { activeTags.add(f); btn.classList.add('active'); }
            applyFilters();
        });
    });

    document.querySelectorAll('[data-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.dataset.theme;
            if (activeThemes.has(t)) { activeThemes.delete(t); btn.classList.remove('active'); }
            else { activeThemes.add(t); btn.classList.add('active'); }
            applyFilters();
        });
    });

    const rangeMinEl      = document.getElementById('price-range-min');
    const priceMinDisplay = document.getElementById('price-min-display');
    rangeMinEl.addEventListener('input', () => {
        const v = parseInt(rangeMinEl.value);
        minPrice = v <= 5 ? null : v;
        priceMinDisplay.textContent = minPrice === null ? '— €' : v + ' €';
        applyFilters();
    });

    const rangeEl      = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    rangeEl.addEventListener('input', () => {
        const v = parseInt(rangeEl.value);
        maxPrice = v >= 100 ? null : v;
        priceDisplay.textContent = maxPrice === null ? '— €' : v + ' €';
        applyFilters();
    });

    let minQtyVal = null, maxQtyVal = null;
    const minQtyDisplay = document.getElementById('min-qty-display');
    const maxQtyDisplay = document.getElementById('max-qty-display');

    document.getElementById('min-qty-plus').addEventListener('click', () => {
        minQtyVal = minQtyVal === null ? 5 : minQtyVal + 5;
        minQty = minQtyVal; minQtyDisplay.textContent = minQtyVal; applyFilters();
    });
    document.getElementById('min-qty-minus').addEventListener('click', () => {
        if (!minQtyVal || minQtyVal <= 5) { minQtyVal = null; minQty = null; minQtyDisplay.textContent = '—'; }
        else { minQtyVal -= 5; minQty = minQtyVal; minQtyDisplay.textContent = minQtyVal; }
        applyFilters();
    });
    document.getElementById('max-qty-plus').addEventListener('click', () => {
        maxQtyVal = maxQtyVal === null ? 50 : maxQtyVal + 10;
        maxQty = maxQtyVal; maxQtyDisplay.textContent = maxQtyVal; applyFilters();
    });
    document.getElementById('max-qty-minus').addEventListener('click', () => {
        if (!maxQtyVal || maxQtyVal <= 10) { maxQtyVal = null; maxQty = null; maxQtyDisplay.textContent = '—'; }
        else { maxQtyVal -= 10; maxQty = maxQtyVal; maxQtyDisplay.textContent = maxQtyVal; }
        applyFilters();
    });

    document.getElementById('delivery-date').addEventListener('change', function () {
        deliveryDate = this.value ? new Date(this.value) : null;
        if (deliveryDate) deliveryDate.setHours(0, 0, 0, 0);
        applyFilters();
    });

    document.getElementById('sort-asc').addEventListener('click', function () {
        if (sortDir === 'asc') { sortDir = null; this.classList.remove('active'); }
        else { sortDir = 'asc'; this.classList.add('active'); document.getElementById('sort-desc').classList.remove('active'); }
        applyFilters();
    });
    document.getElementById('sort-desc').addEventListener('click', function () {
        if (sortDir === 'desc') { sortDir = null; this.classList.remove('active'); }
        else { sortDir = 'desc'; this.classList.add('active'); document.getElementById('sort-asc').classList.remove('active'); }
        applyFilters();
    });

    document.getElementById('filter-reset').addEventListener('click', () => {
        activeTags.clear(); activeThemes.clear();
        minPrice = null; maxPrice = null; minQty = null; maxQty = null;
        sortDir = null; minQtyVal = null; maxQtyVal = null; deliveryDate = null;
        rangeMinEl.value = 5; priceMinDisplay.textContent = '— €';
        rangeEl.value = 100; priceDisplay.textContent = '— €';
        minQtyDisplay.textContent = '—'; maxQtyDisplay.textContent = '—';
        document.getElementById('delivery-date').value = '';
        document.querySelectorAll('[data-filter],[data-theme],.sort-btn').forEach(b => b.classList.remove('active'));
        applyFilters();
    });

    // Badge stock
    document.querySelectorAll('.menu-item[data-stock]').forEach(item => {
        const stock = parseInt(item.dataset.stock);
        const el = item.querySelector('.menu-card__stock');
        if (!el) return;
        let cls = '';
        if (stock <= 5)  cls = 'menu-card__stock--critical';
        else if (stock <= 10) cls = 'menu-card__stock--low';
        if (cls) {
            el.className = 'menu-card__stock ' + cls;
            el.innerHTML = '<i class="bi bi-box-seam"></i> ' + stock + ' commande' + (stock > 1 ? 's' : '') + ' disponible' + (stock > 1 ? 's' : '');
        }
    });

    updateCount(items.length);
})();
