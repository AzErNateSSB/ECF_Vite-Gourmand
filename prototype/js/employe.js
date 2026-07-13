(() => {
    // ── Garde rôle ───────────────────────────────────────────────────────
    const user = JSON.parse(localStorage.getItem('veg_user') || 'null');
    if (!user || !['employe', 'admin'].includes(user.role)) {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
    }

    document.getElementById('employe-badge').textContent =
        `${user.prenom || ''} ${user.nom || ''} — ${user.role === 'admin' ? 'Administrateur' : 'Employé'}`;

    // ── Onglets ───────────────────────────────────────────────────────────
    document.querySelectorAll('.employe-tabs__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.employe-tabs__btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.employe-panel').forEach(p => p.style.display = 'none');
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
        });
    });

    // ════════════════════════════════════════════════════════════════
    // CONSTANTES
    // ════════════════════════════════════════════════════════════════
    const ALLERGENS = [
        'Gluten', 'Crustacés', 'Œufs', 'Poissons', 'Arachides', 'Soja',
        'Lait', 'Fruits à coque', 'Céleri', 'Moutarde',
        'Graines de sésame', 'Sulfites', 'Lupin', 'Mollusques',
    ];

    const TYPE_LABEL = { entree: 'Entrée', plat: 'Plat', dessert: 'Dessert' };

    // ════════════════════════════════════════════════════════════════
    // PLATS — localStorage veg_plats
    // ════════════════════════════════════════════════════════════════
    const PLATS_DEFAULT = [
        { id:'pl1', nom:'Salade de chèvre chaud',      type:'entree',  allergens:['Lait','Gluten'],                photo:'' },
        { id:'pl2', nom:'Foie gras mi-cuit',            type:'entree',  allergens:[],                               photo:'' },
        { id:'pl3', nom:'Velouté de butternut',         type:'entree',  allergens:['Lait'],                         photo:'' },
        { id:'pl4', nom:'Tartare de saumon',            type:'entree',  allergens:['Poissons'],                     photo:'' },
        { id:'pl5', nom:'Magret de canard aux cèpes',   type:'plat',    allergens:[],                               photo:'' },
        { id:'pl6', nom:'Filet de bar en croûte',       type:'plat',    allergens:['Poissons','Gluten','Œufs'],     photo:'' },
        { id:'pl7', nom:'Risotto aux truffes',          type:'plat',    allergens:['Lait'],                         photo:'' },
        { id:'pl8', nom:'Pavé de bœuf sauce bordelaise',type:'plat',   allergens:['Sulfites'],                     photo:'' },
        { id:'pl9', nom:'Crème brûlée',                 type:'dessert', allergens:['Lait','Œufs'],                  photo:'' },
        { id:'pl10',nom:'Tarte Tatin',                  type:'dessert', allergens:['Gluten','Lait','Œufs'],         photo:'' },
        { id:'pl11',nom:'Fondant au chocolat',          type:'dessert', allergens:['Gluten','Lait','Œufs'],         photo:'' },
        { id:'pl12',nom:'Sorbet fruits de saison',      type:'dessert', allergens:[],                               photo:'' },
    ];

    const getPlats  = () => JSON.parse(localStorage.getItem('veg_plats') || 'null') || PLATS_DEFAULT;
    const savePlats = (p) => localStorage.setItem('veg_plats', JSON.stringify(p));
    if (!localStorage.getItem('veg_plats')) savePlats(PLATS_DEFAULT);

    // ── Grille plats ─────────────────────────────────────────────────────
    const renderPlats = () => {
        const plats = getPlats();
        const grid  = document.getElementById('plats-grid');

        if (!plats.length) {
            grid.innerHTML = '<p class="employe-empty">Aucun plat enregistré.</p>';
            return;
        }

        grid.innerHTML = plats.map(p => {
            const chips = p.allergens.slice(0, 4)
                .map(a => `<span class="employe-allergen-chip">${a}</span>`).join('');
            const more  = p.allergens.length > 4
                ? `<span class="employe-allergen-chip employe-allergen-chip--more">+${p.allergens.length - 4}</span>` : '';
            const photo = p.photo
                ? `<img class="employe-plat-card__photo" src="${p.photo}" alt="${p.nom}">`
                : `<div class="employe-plat-card__photo employe-plat-card__photo--empty"><i class="bi bi-image"></i></div>`;

            return `
            <div class="employe-plat-card">
                ${photo}
                <div class="employe-plat-card__body">
                    <div class="employe-plat-card__head">
                        <strong class="employe-plat-card__name">${p.nom}</strong>
                        <span class="employe-type-badge employe-type-badge--${p.type}">${TYPE_LABEL[p.type]}</span>
                    </div>
                    <div class="employe-plat-card__allergens">
                        ${p.allergens.length ? chips + more : '<span class="employe-plat-card__no-allergen">Aucun allergène</span>'}
                    </div>
                    <div class="employe-menu-card__actions">
                        <button class="employe-btn employe-btn--sm employe-btn--primary plat-edit-btn" data-id="${p.id}">
                            <i class="bi bi-pencil-fill"></i> Modifier
                        </button>
                        <button class="employe-btn employe-btn--sm employe-btn--danger plat-delete-btn" data-id="${p.id}">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

        grid.querySelectorAll('.plat-edit-btn').forEach(btn =>
            btn.addEventListener('click', () => openPlatModal(btn.dataset.id)));
        grid.querySelectorAll('.plat-delete-btn').forEach(btn =>
            btn.addEventListener('click', () => {
                if (!confirm('Supprimer ce plat ?')) return;
                savePlats(getPlats().filter(p => p.id !== btn.dataset.id));
                renderPlats();
            }));
    };

    renderPlats();

    // ── Modal plat ───────────────────────────────────────────────────────
    const platOverlay = document.getElementById('plat-modal-overlay');
    let currentPlatPhoto = '';

    const buildAllergenGrid = (selected = []) => {
        document.getElementById('plat-allergen-grid').innerHTML = ALLERGENS.map(a => `
            <label class="employe-allergen-chk">
                <input type="checkbox" value="${a}" ${selected.includes(a) ? 'checked' : ''}>
                <span>${a}</span>
            </label>`).join('');
    };

    const closePlatModal = () => {
        platOverlay.style.display = 'none';
        currentPlatPhoto = '';
    };

    const openPlatModal = (id) => {
        const plats = getPlats();
        const p = id ? plats.find(x => x.id === id) : null;
        document.getElementById('plat-modal-title').textContent = p ? 'Modifier le plat' : 'Ajouter un plat';
        document.getElementById('plat-edit-id').value   = p?.id   || '';
        document.getElementById('plat-edit-nom').value  = p?.nom  || '';
        document.getElementById('plat-edit-type').value = p?.type || 'entree';
        document.getElementById('err-plat-nom').textContent = '';
        document.getElementById('plat-edit-photo').value = '';
        currentPlatPhoto = p?.photo || '';

        const preview = document.getElementById('plat-photo-preview');
        const img     = document.getElementById('plat-photo-img');
        if (currentPlatPhoto) {
            img.src = currentPlatPhoto;
            preview.style.display = 'flex';
        } else {
            preview.style.display = 'none';
        }

        buildAllergenGrid(p?.allergens || []);
        platOverlay.style.display = 'flex';
    };

    document.getElementById('plat-add-btn').addEventListener('click', () => openPlatModal(null));
    document.getElementById('plat-modal-close').addEventListener('click', closePlatModal);
    document.getElementById('plat-modal-cancel').addEventListener('click', closePlatModal);
    platOverlay.addEventListener('click', e => { if (e.target === platOverlay) closePlatModal(); });

    document.getElementById('plat-edit-photo').addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const MAX = 600;
                const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
                const canvas = document.createElement('canvas');
                canvas.width  = Math.round(img.width  * ratio);
                canvas.height = Math.round(img.height * ratio);
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                currentPlatPhoto = canvas.toDataURL('image/jpeg', 0.75);
                document.getElementById('plat-photo-img').src = currentPlatPhoto;
                document.getElementById('plat-photo-preview').style.display = 'flex';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('plat-photo-remove').addEventListener('click', () => {
        currentPlatPhoto = '';
        document.getElementById('plat-edit-photo').value = '';
        document.getElementById('plat-photo-preview').style.display = 'none';
    });

    document.getElementById('plat-modal-save').addEventListener('click', () => {
        const nom  = document.getElementById('plat-edit-nom').value.trim();
        const errEl = document.getElementById('err-plat-nom');
        if (!nom) { errEl.textContent = 'Le nom est requis'; return; }
        errEl.textContent = '';

        const type      = document.getElementById('plat-edit-type').value;
        const allergens = [...document.querySelectorAll('#plat-allergen-grid input:checked')]
            .map(c => c.value);
        const id = document.getElementById('plat-edit-id').value;

        const entry = { id: id || 'pl-' + Date.now(), nom, type, allergens, photo: currentPlatPhoto };
        const plats = getPlats();
        const idx   = plats.findIndex(p => p.id === id);
        if (idx !== -1) plats[idx] = entry;
        else plats.push(entry);

        try {
            savePlats(plats);
        } catch (e) {
            errEl.textContent = 'Erreur de sauvegarde : espace de stockage insuffisant. Essayez avec une image plus petite.';
            return;
        }
        closePlatModal();
        renderPlats();
    });

    // ════════════════════════════════════════════════════════════════
    // MENUS — localStorage veg_menus
    // ════════════════════════════════════════════════════════════════
    const MENUS_DEFAULT = [
        { id:'delice',     name:'Menu Délice',     price:32.50, min:10, max:150, stock:120, active:1, desc:'Un menu délicat aux saveurs équilibrées.' },
        { id:'gourmand',   name:'Menu Gourmand',   price:36.90, min:10, max:150, stock:95,  active:1, desc:'Générosité et raffinement au rendez-vous.' },
        { id:'prestige',   name:'Menu Prestige',   price:49.90, min:20, max:100, stock:60,  active:1, desc:'Le summum de notre savoir-faire gastronomique.' },
        { id:'vegetarien', name:'Menu Végétarien', price:28.50, min:10, max:150, stock:80,  active:1, desc:'Légumes de saison et créativité végétale.' },
        { id:'cocktail',   name:'Menu Cocktail',   price:24.90, min:20, max:300, stock:200, active:1, desc:'Amuse-bouches et canapés pour vos réceptions.' },
        { id:'mer',        name:'Menu Mer',        price:44.90, min:15, max:100, stock:50,  active:1, desc:'Produits de la mer frais et iodés.' },
        { id:'terroir',    name:'Menu Terroir',    price:34.50, min:10, max:150, stock:100, active:1, desc:'Les saveurs authentiques du Sud-Ouest.' },
        { id:'enfants',    name:'Menu Enfants',    price:16.90, min:5,  max:80,  stock:60,  active:1, desc:'Adapté aux petits appétits, riche en couleurs.' },
        { id:'brunch',     name:'Menu Brunch',     price:22.00, min:15, max:200, stock:150, active:1, desc:'Le meilleur des deux mondes, sucré et salé.' },
        { id:'fusion',     name:'Menu Fusion',     price:38.90, min:10, max:100, stock:70,  active:1, desc:'Cuisines du monde revisitées avec élégance.' },
        { id:'ete',        name:'Menu Été',        price:31.00, min:15, max:150, stock:90,  active:1, desc:'Légèreté et fraîcheur pour vos événements estivaux.' },
        { id:'luxe',       name:'Menu Luxe',       price:89.00, min:20, max:50,  stock:30,  active:1, desc:'Caviar, truffes et champagne — l\'exception absolue.' },
    ];

    const getMenus  = () => JSON.parse(localStorage.getItem('veg_menus') || 'null') || MENUS_DEFAULT;
    const saveMenus = (m) => localStorage.setItem('veg_menus', JSON.stringify(m));
    if (!localStorage.getItem('veg_menus')) saveMenus(MENUS_DEFAULT);

    // ── Grille menus ─────────────────────────────────────────────────────
    const renderMenus = () => {
        const menus = getMenus();
        const plats = getPlats();
        const platById = Object.fromEntries(plats.map(p => [p.id, p]));

        document.getElementById('menus-grid').innerHTML = menus.map(m => {
            const courseNames = ['entree','plat','dessert']
                .map(c => {
                    const p = platById[m.courses?.[c]];
                    return p ? `<span class="employe-type-badge employe-type-badge--${c}">${TYPE_LABEL[c]} : ${p.nom}</span>` : '';
                })
                .filter(Boolean).join('');

            return `
            <div class="employe-menu-card ${m.active ? '' : 'employe-menu-card--inactive'}">
                <div class="employe-menu-card__head">
                    <strong class="employe-menu-card__name">${m.name}</strong>
                    <span class="employe-menu-card__active-badge ${m.active ? 'active' : 'inactive'}">
                        ${m.active ? 'Actif' : 'Inactif'}
                    </span>
                </div>
                <p class="employe-menu-card__desc">${m.desc || ''}</p>
                ${courseNames ? `<div class="employe-menu-card__courses">${courseNames}</div>` : ''}
                <div class="employe-menu-card__stats">
                    <span><i class="bi bi-tag"></i> ${m.price.toFixed(2).replace('.',',')} €/plat</span>
                    <span><i class="bi bi-people"></i> ${m.min}–${m.max}</span>
                    <span><i class="bi bi-boxes"></i> Stock : ${m.stock}</span>
                </div>
                <div class="employe-menu-card__actions">
                    <button class="employe-btn employe-btn--sm employe-btn--primary menu-edit-btn" data-id="${m.id}">
                        <i class="bi bi-pencil-fill"></i> Modifier
                    </button>
                    <button class="employe-btn employe-btn--sm employe-btn--danger menu-delete-btn" data-id="${m.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

        document.querySelectorAll('.menu-edit-btn').forEach(btn =>
            btn.addEventListener('click', () => openMenuModal(btn.dataset.id)));
        document.querySelectorAll('.menu-delete-btn').forEach(btn =>
            btn.addEventListener('click', () => {
                if (!confirm('Supprimer ce menu ?')) return;
                saveMenus(getMenus().filter(m => m.id !== btn.dataset.id));
                renderMenus();
            }));
    };

    renderMenus();

    // ── Modal menu ───────────────────────────────────────────────────────
    const menuOverlay = document.getElementById('menu-modal-overlay');
    const closeMenuModal = () => menuOverlay.style.display = 'none';
    document.getElementById('menu-modal-close').addEventListener('click', closeMenuModal);
    document.getElementById('menu-modal-cancel').addEventListener('click', closeMenuModal);
    menuOverlay.addEventListener('click', e => { if (e.target === menuOverlay) closeMenuModal(); });

    const buildCourseSelects = (currentCourses = {}) => {
        const plats = getPlats();
        ['entree', 'plat', 'dessert'].forEach(type => {
            const sel = document.getElementById('course-' + type);
            const filtered = plats.filter(p => p.type === type);
            sel.innerHTML = `<option value="">— Aucun —</option>` +
                filtered.map(p => `<option value="${p.id}" ${currentCourses[type] === p.id ? 'selected' : ''}>${p.nom}</option>`).join('');
        });
    };

    const openMenuModal = (id) => {
        const menus = getMenus();
        const m = id ? menus.find(x => x.id === id) : null;
        document.getElementById('menu-modal-title').textContent = m ? 'Modifier le menu' : 'Ajouter un menu';
        document.getElementById('menu-edit-id').value     = m?.id    || '';
        document.getElementById('menu-edit-name').value   = m?.name  || '';
        document.getElementById('menu-edit-price').value  = m?.price || '';
        document.getElementById('menu-edit-min').value    = m?.min   || '';
        document.getElementById('menu-edit-max').value    = m?.max   || '';
        document.getElementById('menu-edit-stock').value  = m?.stock ?? '';
        document.getElementById('menu-edit-active').value = m?.active ?? 1;
        document.getElementById('menu-edit-desc').value   = m?.desc  || '';
        buildCourseSelects(m?.courses || {});
        menuOverlay.style.display = 'flex';
    };

    document.getElementById('menu-add-btn').addEventListener('click', () => openMenuModal(null));

    document.getElementById('menu-modal-save').addEventListener('click', () => {
        const id = document.getElementById('menu-edit-id').value;

        const courses = {};
        ['entree', 'plat', 'dessert'].forEach(type => {
            const val = document.getElementById('course-' + type).value;
            if (val) courses[type] = val;
        });

        const entry = {
            id:      id || 'menu-' + Date.now(),
            name:    document.getElementById('menu-edit-name').value.trim(),
            price:   parseFloat(document.getElementById('menu-edit-price').value),
            min:     parseInt(document.getElementById('menu-edit-min').value),
            max:     parseInt(document.getElementById('menu-edit-max').value),
            stock:   parseInt(document.getElementById('menu-edit-stock').value),
            active:  parseInt(document.getElementById('menu-edit-active').value),
            desc:    document.getElementById('menu-edit-desc').value.trim(),
            courses,
        };
        if (!entry.name || isNaN(entry.price)) return;

        const menus = getMenus();
        const idx = menus.findIndex(m => m.id === id);
        if (idx !== -1) menus[idx] = entry;
        else menus.push(entry);
        saveMenus(menus);
        closeMenuModal();
        renderMenus();
    });

    // ════════════════════════════════════════════════════════════════
    // COMMANDES
    // ════════════════════════════════════════════════════════════════
    const STATUTS = ['En attente', 'Confirmée', 'En préparation', 'Livrée', 'Annulée'];
    const STATUT_CLASS = {
        'En attente':     'en-attente',
        'Confirmée':      'confirmee',
        'En préparation': 'en-preparation',
        'Livrée':         'livree',
        'Annulée':        'annulee',
    };

    const fmt     = (n) => parseFloat(n).toFixed(2).replace('.', ',') + ' €';
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

    const renderCommandes = () => {
        const orders  = JSON.parse(localStorage.getItem('veg_orders') || '[]').reverse();
        const statut  = document.getElementById('filter-statut').value;
        const search  = document.getElementById('filter-search').value.toLowerCase();

        const filtered = orders.filter(o => {
            const matchStatut = !statut || (o.statut || 'En attente') === statut;
            const matchSearch = !search ||
                (o.id || '').toLowerCase().includes(search) ||
                (o.client?.nom || '').toLowerCase().includes(search) ||
                (o.client?.prenom || '').toLowerCase().includes(search) ||
                (o.client?.email || '').toLowerCase().includes(search);
            return matchStatut && matchSearch;
        });

        document.getElementById('tab-count-commandes').textContent =
            orders.filter(o => (o.statut || 'En attente') === 'En attente').length;

        const tbody = document.getElementById('commandes-tbody');
        const empty = document.getElementById('commandes-empty');

        if (!filtered.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
        empty.style.display = 'none';

        tbody.innerHTML = filtered.map(o => {
            const statut = o.statut || 'En attente';
            const total  = (o.totals?.menu || 0) + (o.totals?.delivery || 0);
            return `
            <tr>
                <td class="employe-table__id">${o.id}</td>
                <td>
                    <strong>${o.client?.prenom || ''} ${o.client?.nom || ''}</strong><br>
                    <small>${o.client?.email || ''}</small>
                </td>
                <td>${o.menu?.label || '—'}<br><small>${o.menu?.qty || '—'} plat(s)</small></td>
                <td>${fmtDate(o.prestation?.date)}<br><small>${o.prestation?.heure || ''}</small></td>
                <td>${fmt(total)}</td>
                <td>
                    <select class="employe-statut-select employe-statut-select--${STATUT_CLASS[statut] || ''}"
                            data-id="${o.id}">
                        ${STATUTS.map(s => `<option value="${s}" ${s === statut ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                </td>
                <td>
                    <button class="employe-btn employe-btn--detail" data-id="${o.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('.employe-statut-select').forEach(sel => {
            sel.addEventListener('change', () => {
                const orders = JSON.parse(localStorage.getItem('veg_orders') || '[]');
                const o = orders.find(x => x.id === sel.dataset.id);
                if (o) { o.statut = sel.value; localStorage.setItem('veg_orders', JSON.stringify(orders)); }
                renderCommandes();
            });
        });
    };

    document.getElementById('filter-statut').addEventListener('change', renderCommandes);
    document.getElementById('filter-search').addEventListener('input', renderCommandes);
    renderCommandes();

    // ════════════════════════════════════════════════════════════════
    // HORAIRES
    // ════════════════════════════════════════════════════════════════
    const JOURS = [
        { key: 'lun_ven', label: 'Lundi – Vendredi' },
        { key: 'sam',     label: 'Samedi' },
        { key: 'dim',     label: 'Dimanche' },
    ];
    const HORAIRES_DEFAULT = {
        lun_ven: { ouverture: '09:00', fermeture: '18:00', ferme: false },
        sam:     { ouverture: '10:00', fermeture: '16:00', ferme: false },
        dim:     { ouverture: '',      fermeture: '',       ferme: true  },
    };
    const getHoraires = () =>
        JSON.parse(localStorage.getItem('veg_horaires') || JSON.stringify(HORAIRES_DEFAULT));

    const renderHoraires = () => {
        const h = getHoraires();
        document.getElementById('horaires-grid').innerHTML = JOURS.map(j => {
            const v = h[j.key] || { ouverture: '', fermeture: '', ferme: false };
            return `
            <div class="employe-horaire-row">
                <span class="employe-horaire-row__label">${j.label}</span>
                <label class="employe-horaire-row__ferme">
                    <input type="checkbox" data-jour="${j.key}" class="horaire-ferme-chk"
                           ${v.ferme ? 'checked' : ''}> Fermé
                </label>
                <div class="employe-horaire-row__times" id="times-${j.key}">
                    <input class="auth-field__input employe-horaire-input" type="time"
                           data-jour="${j.key}" data-field="ouverture" value="${v.ouverture || ''}">
                    <span class="employe-horaire-row__sep">→</span>
                    <input class="auth-field__input employe-horaire-input" type="time"
                           data-jour="${j.key}" data-field="fermeture" value="${v.fermeture || ''}">
                </div>
            </div>`;
        }).join('');
    };

    renderHoraires();

    document.getElementById('horaires-save').addEventListener('click', () => {
        const h = getHoraires();
        document.querySelectorAll('.horaire-ferme-chk').forEach(chk => {
            h[chk.dataset.jour].ferme = chk.checked;
        });
        document.querySelectorAll('.employe-horaire-input').forEach(inp => {
            h[inp.dataset.jour][inp.dataset.field] = inp.value;
        });
        localStorage.setItem('veg_horaires', JSON.stringify(h));
        const fb = document.getElementById('horaires-feedback');
        fb.textContent = '✓ Horaires enregistrés';
        fb.classList.add('employe-horaires__feedback--ok');
        setTimeout(() => { fb.textContent = ''; fb.classList.remove('employe-horaires__feedback--ok'); }, 2500);
    });

    // ════════════════════════════════════════════════════════════════
    // AVIS
    // ════════════════════════════════════════════════════════════════
    const renderAvis = () => {
        const avis  = JSON.parse(localStorage.getItem('veg_avis') || '[]');
        const el    = document.getElementById('avis-list');
        const empty = document.getElementById('avis-empty');
        const pending = avis.filter(a => a.statut === 'en_attente');

        document.getElementById('tab-count-avis').textContent = pending.length;

        if (!avis.length) { el.innerHTML = ''; empty.style.display = 'block'; return; }
        empty.style.display = 'none';

        const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);

        el.innerHTML = avis.map(a => `
            <div class="employe-avis-card ${a.statut === 'en_attente' ? '' : 'employe-avis-card--done'}">
                <div class="employe-avis-card__head">
                    <div>
                        <span class="employe-avis-card__stars">${stars(a.note)}</span>
                        <strong class="employe-avis-card__author">${a.auteur || a.email}</strong>
                        <span class="employe-avis-card__date">${new Date(a.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <span class="employe-avis-card__statut employe-avis-card__statut--${a.statut}">
                        ${a.statut === 'en_attente' ? 'En attente' : a.statut === 'publie' ? 'Publié' : 'Rejeté'}
                    </span>
                </div>
                <p class="employe-avis-card__texte">${a.texte || '<em>Sans commentaire</em>'}</p>
                <small class="employe-avis-card__order">Commande : ${a.orderId}</small>
                ${a.statut === 'en_attente' ? `
                <div class="employe-avis-card__actions">
                    <button class="employe-btn employe-btn--success avis-valider-btn" data-id="${a.id}">
                        <i class="bi bi-check-lg"></i> Valider
                    </button>
                    <button class="employe-btn employe-btn--danger avis-rejeter-btn" data-id="${a.id}">
                        <i class="bi bi-x-lg"></i> Rejeter
                    </button>
                </div>` : ''}
            </div>`).join('');

        el.querySelectorAll('.avis-valider-btn').forEach(btn =>
            btn.addEventListener('click', () => updateAvis(btn.dataset.id, 'publie')));
        el.querySelectorAll('.avis-rejeter-btn').forEach(btn =>
            btn.addEventListener('click', () => updateAvis(btn.dataset.id, 'rejete')));
    };

    const updateAvis = (id, statut) => {
        const avis = JSON.parse(localStorage.getItem('veg_avis') || '[]');
        const a = avis.find(x => x.id === id);
        if (a) { a.statut = statut; localStorage.setItem('veg_avis', JSON.stringify(avis)); }
        renderAvis();
    };

    renderAvis();
})();
