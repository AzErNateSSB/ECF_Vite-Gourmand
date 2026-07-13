(() => {
    // ── Garde : utilisateur connecté ? ──────────────────────────────────
    const user = JSON.parse(localStorage.getItem('veg_user') || 'null');
    if (!user) {
        window.history.pushState({}, '', '/signin?redirect=commande');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
    }

    // ── État global ──────────────────────────────────────────────────────
    let currentStep = 1;

    const state = {
        // Étape 1
        prenom: '', nom: '', email: '', gsm: '',
        adresse: '', ville: '', cp: '',
        date: '', heure: '',
        // Étape 2
        menuId: '', menuLabel: '', priceUnit: 0, minQty: 0, maxQty: 0, qty: 0,
    };

    // ── Pré-remplissage depuis le compte ────────────────────────────────
    const fill = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    fill('cmd-prenom', user.prenom);
    fill('cmd-nom',    user.nom);
    fill('cmd-email',  user.email);
    fill('cmd-gsm',    user.gsm || user.telephone || '');

    // Bloquer les dates passées
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('cmd-date').setAttribute('min', today);

    // ── Pré-sélection depuis veg_pending_order ──────────────────────────
    const pending = JSON.parse(localStorage.getItem('veg_pending_order') || 'null');

    // ── Utilitaires ──────────────────────────────────────────────────────
    const fmt = (n) => n.toFixed(2).replace('.', ',') + ' €';

    const showError = (id, msg) => {
        const el = document.getElementById('err-' + id);
        if (el) el.textContent = msg;
    };
    const clearErrors = (ids) => ids.forEach(id => showError(id, ''));

    const goToStep = (n) => {
        document.getElementById('step-' + currentStep).style.display = 'none';
        currentStep = n;
        document.getElementById('step-' + currentStep).style.display = 'block';

        // Mise à jour stepper
        document.querySelectorAll('.commande-stepper__step').forEach(s => {
            const sn = parseInt(s.dataset.step);
            s.classList.toggle('active',    sn === currentStep);
            s.classList.toggle('completed', sn < currentStep);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── ÉTAPE 1 — Validation & passage ──────────────────────────────────
    document.getElementById('step1-next').addEventListener('click', () => {
        const ids = ['cmd-prenom','cmd-nom','cmd-email','cmd-gsm','cmd-adresse','cmd-ville','cmd-cp','cmd-date','cmd-heure'];
        clearErrors(ids);
        let ok = true;

        const v = (id) => document.getElementById(id).value.trim();

        if (!v('cmd-prenom')) { showError('cmd-prenom', 'Champ requis'); ok = false; }
        if (!v('cmd-nom'))    { showError('cmd-nom',    'Champ requis'); ok = false; }
        if (!v('cmd-email') || !v('cmd-email').includes('@')) { showError('cmd-email', 'E-mail invalide'); ok = false; }
        if (!v('cmd-gsm'))    { showError('cmd-gsm',    'Champ requis'); ok = false; }
        if (!v('cmd-adresse')){ showError('cmd-adresse','Champ requis'); ok = false; }
        if (!v('cmd-ville'))  { showError('cmd-ville',  'Champ requis'); ok = false; }
        if (!v('cmd-cp') || !/^\d{4,5}$/.test(v('cmd-cp'))) { showError('cmd-cp', 'Code postal invalide'); ok = false; }
        if (!v('cmd-date'))   { showError('cmd-date',   'Champ requis'); ok = false; }
        if (!v('cmd-heure'))  { showError('cmd-heure',  'Champ requis'); ok = false; }

        if (!ok) return;

        // Sauvegarder
        state.prenom  = v('cmd-prenom');
        state.nom     = v('cmd-nom');
        state.email   = v('cmd-email');
        state.gsm     = v('cmd-gsm');
        state.adresse = v('cmd-adresse');
        state.ville   = v('cmd-ville');
        state.cp      = v('cmd-cp');
        state.date    = v('cmd-date');
        state.heure   = v('cmd-heure');

        goToStep(2);

        // Pré-sélectionner le menu si pending_order
        if (pending && pending.id) {
            const sel = document.getElementById('cmd-menu');
            const opt = sel.querySelector(`option[value="${pending.id}"]`);
            if (opt) {
                sel.value = pending.id;
                sel.dispatchEvent(new Event('change'));

                // Pré-remplir la quantité si elle respecte le minimum
                if (pending.qty) {
                    const minQty = parseInt(opt.dataset.min) || 1;
                    const setQty = Math.max(pending.qty, minQty);
                    state.qty = setQty;
                    document.getElementById('cmd-qty-val').textContent = setQty;
                    updatePriceBox();
                }
                localStorage.removeItem('veg_pending_order');
            }
        }
    });

    // ── ÉTAPE 2 — Sélection menu & quantité ─────────────────────────────
    const menuSel   = document.getElementById('cmd-menu');
    const qtyField  = document.getElementById('qty-field');
    const priceBox  = document.getElementById('price-box');
    const qtyVal    = document.getElementById('cmd-qty-val');

    const updatePriceBox = () => {
        const opt = menuSel.querySelector(`option[value="${state.menuId}"]`);
        if (!opt || !state.qty) return;

        const rawTotal = state.priceUnit * state.qty;
        const threshold = state.minQty + 5;
        const hasDiscount = state.qty >= threshold;
        const discount = hasDiscount ? rawTotal * 0.10 : 0;
        const total = rawTotal - discount;

        document.getElementById('pb-unit').textContent    = fmt(state.priceUnit);
        document.getElementById('pb-qty').textContent     = state.qty + ' plat(s)';
        document.getElementById('pb-total').textContent   = fmt(total);

        const discRow  = document.getElementById('pb-discount-row');
        const discHint = document.getElementById('pb-discount-hint');

        if (hasDiscount) {
            discRow.style.display = '';
            document.getElementById('pb-discount').textContent = '−' + fmt(discount);
            discHint.textContent = '';
        } else {
            discRow.style.display = 'none';
            const left = threshold - state.qty;
            discHint.textContent = left > 0
                ? `Ajoutez ${left} plat(s) de plus pour bénéficier d'une réduction de 10 %.`
                : '';
        }

        priceBox.style.display = '';
    };

    menuSel.addEventListener('change', () => {
        const opt = menuSel.options[menuSel.selectedIndex];
        if (!opt.value) {
            qtyField.style.display = 'none';
            priceBox.style.display = 'none';
            return;
        }

        state.menuId    = opt.value;
        state.menuLabel = opt.textContent.split(' — ')[0];
        state.priceUnit = parseFloat(opt.dataset.price);
        state.minQty    = parseInt(opt.dataset.min);
        state.maxQty    = parseInt(opt.dataset.max);
        state.qty       = state.minQty;

        qtyVal.textContent = state.qty;
        qtyField.style.display = '';
        updatePriceBox();
    });

    document.getElementById('cmd-qty-minus').addEventListener('click', () => {
        if (state.qty <= state.minQty) return;
        state.qty--;
        qtyVal.textContent = state.qty;
        updatePriceBox();
    });

    document.getElementById('cmd-qty-plus').addEventListener('click', () => {
        if (state.qty >= state.maxQty) return;
        state.qty++;
        qtyVal.textContent = state.qty;
        updatePriceBox();
    });

    document.getElementById('step2-back').addEventListener('click', () => goToStep(1));

    document.getElementById('step2-next').addEventListener('click', () => {
        showError('cmd-menu', '');
        showError('cmd-qty', '');
        let ok = true;

        if (!state.menuId) { showError('cmd-menu', 'Veuillez sélectionner un menu'); ok = false; }
        if (state.qty < state.minQty) { showError('cmd-qty', `Minimum ${state.minQty} plats requis`); ok = false; }
        if (!ok) return;

        buildRecap();
        goToStep(3);
    });

    // ── ÉTAPE 3 — Récapitulatif ──────────────────────────────────────────
    const DELIVERY_BASE = 5;
    const DELIVERY_KM   = 0.59;

    const isInBordeaux = () => {
        const ville = state.ville.toLowerCase().trim();
        return ville === 'bordeaux' || ville.includes('bordeaux');
    };

    const calcDelivery = () => {
        if (isInBordeaux()) return 0;
        return DELIVERY_BASE; // 5€ + 0,59/km, km calculés à la confirmation
    };

    const calcMenuTotal = () => {
        const raw       = state.priceUnit * state.qty;
        const threshold = state.minQty + 5;
        return state.qty >= threshold ? raw * 0.90 : raw;
    };

    const formatDate = (d) => {
        const [y, m, j] = d.split('-');
        return `${j}/${m}/${y}`;
    };

    const buildRecap = () => {
        const menuTotal     = calcMenuTotal();
        const deliveryBase  = calcDelivery();
        const hors          = !isInBordeaux();
        const total         = menuTotal + deliveryBase;

        const raw       = state.priceUnit * state.qty;
        const threshold = state.minQty + 5;
        const hasDiscount = state.qty >= threshold;
        const discountAmt = hasDiscount ? raw * 0.10 : 0;

        document.getElementById('recap-content').innerHTML = `
            <div class="commande-recap__section">
                <h3 class="commande-recap__subtitle"><i class="bi bi-person-fill"></i> Client</h3>
                <div class="commande-recap__grid">
                    <span>Nom</span><strong>${state.prenom} ${state.nom}</strong>
                    <span>E-mail</span><strong>${state.email}</strong>
                    <span>Téléphone</span><strong>${state.gsm}</strong>
                </div>
            </div>

            <div class="commande-recap__section">
                <h3 class="commande-recap__subtitle"><i class="bi bi-geo-alt-fill"></i> Prestation</h3>
                <div class="commande-recap__grid">
                    <span>Adresse</span><strong>${state.adresse}, ${state.cp} ${state.ville}</strong>
                    <span>Date</span><strong>${formatDate(state.date)} à ${state.heure}</strong>
                </div>
            </div>

            <div class="commande-recap__section">
                <h3 class="commande-recap__subtitle"><i class="bi bi-egg-fried"></i> Menu</h3>
                <div class="commande-recap__grid">
                    <span>Menu choisi</span><strong>${state.menuLabel}</strong>
                    <span>Nombre de plats</span><strong>${state.qty}</strong>
                    <span>Prix unitaire</span><strong>${fmt(state.priceUnit)}</strong>
                    ${hasDiscount ? `<span>Sous-total brut</span><strong>${fmt(raw)}</strong>
                    <span class="commande-recap__discount"><i class="bi bi-tag-fill"></i> Réduction −10%</span><strong class="commande-recap__discount">−${fmt(discountAmt)}</strong>` : ''}
                    <span>Sous-total menu</span><strong>${fmt(menuTotal)}</strong>
                </div>
            </div>

            <div class="commande-recap__section">
                <h3 class="commande-recap__subtitle"><i class="bi bi-truck"></i> Livraison</h3>
                <div class="commande-recap__grid">
                    <span>Lieu de livraison</span><strong>${state.ville}</strong>
                    ${hors
                        ? `<span>Frais fixes</span><strong>${fmt(DELIVERY_BASE)}</strong>
                           <span>Supplément kilométrique</span><strong>+ ${DELIVERY_KM.toFixed(2).replace('.',',')} €/km<br><small class="text-muted">calculé selon votre adresse exacte</small></strong>`
                        : `<span>Livraison</span><strong class="text-success">Gratuite (Bordeaux)</strong>`
                    }
                </div>
            </div>

            <div class="commande-recap__total">
                <span>Total estimé</span>
                <strong>${fmt(total)}${hors ? ' + frais km' : ''}</strong>
            </div>

            ${hors ? `<p class="commande-recap__note"><i class="bi bi-info-circle"></i> Les frais kilométriques (${DELIVERY_KM.toFixed(2).replace('.',',')} €/km) seront confirmés lors de la prise de contact.</p>` : ''}
        `;
    };

    document.getElementById('step3-back').addEventListener('click', () => goToStep(2));

    document.getElementById('step3-confirm').addEventListener('click', () => {
        const order = {
            id:        'CMD-' + Date.now(),
            date:      new Date().toISOString(),
            client:    { prenom: state.prenom, nom: state.nom, email: state.email, gsm: state.gsm },
            prestation:{ adresse: state.adresse, ville: state.ville, cp: state.cp, date: state.date, heure: state.heure },
            menu:      { id: state.menuId, label: state.menuLabel, priceUnit: state.priceUnit, qty: state.qty },
            totals:    { menu: calcMenuTotal(), delivery: calcDelivery() },
        };

        // Sauvegarder dans l'historique des commandes
        const orders = JSON.parse(localStorage.getItem('veg_orders') || '[]');
        orders.push(order);
        localStorage.setItem('veg_orders', JSON.stringify(orders));
        localStorage.removeItem('veg_pending_order');

        // Afficher l'écran de succès
        document.getElementById('step-3').style.display = 'none';
        document.getElementById('step-success').style.display = 'block';
        document.getElementById('success-email').textContent = state.email;

        // Stepper en "tout complété"
        document.querySelectorAll('.commande-stepper__step').forEach(s => {
            s.classList.remove('active');
            s.classList.add('completed');
        });
    });
})();
