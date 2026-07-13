(() => {
    // ── Garde ────────────────────────────────────────────────────────────
    const user = JSON.parse(localStorage.getItem('veg_user') || 'null');
    if (!user) {
        window.history.pushState({}, '', '/signin?redirect=account');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
    }

    // ── En-tête ──────────────────────────────────────────────────────────
    const initials = ((user.prenom?.[0] || '') + (user.nom?.[0] || '')).toUpperCase() || '?';
    document.getElementById('account-avatar').textContent = initials;
    document.getElementById('account-name').textContent   = `${user.prenom || ''} ${user.nom || ''}`.trim();
    document.getElementById('account-email').textContent  = user.email || '';

    // ── Onglets ───────────────────────────────────────────────────────────
    document.querySelectorAll('.account-tabs__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.account-tabs__btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.account-panel').forEach(p => p.style.display = 'none');
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
        });
    });

    // ── ONGLET PROFIL ─────────────────────────────────────────────────────
    document.getElementById('profil-prenom').value  = user.prenom  || '';
    document.getElementById('profil-nom').value     = user.nom     || '';
    document.getElementById('profil-email').value   = user.email   || '';
    document.getElementById('profil-gsm').value     = user.gsm     || user.telephone || '';
    document.getElementById('profil-adresse').value = user.adresse || '';

    document.getElementById('profil-save').addEventListener('click', () => {
        const prenom  = document.getElementById('profil-prenom').value.trim();
        const nom     = document.getElementById('profil-nom').value.trim();
        const email   = document.getElementById('profil-email').value.trim();
        const gsm     = document.getElementById('profil-gsm').value.trim();
        const adresse = document.getElementById('profil-adresse').value.trim();

        ['profil-prenom','profil-nom','profil-email','profil-gsm'].forEach(id => {
            document.getElementById('err-' + id).textContent = '';
        });
        document.getElementById('profil-error').style.display   = 'none';
        document.getElementById('profil-success').style.display = 'none';

        let ok = true;
        if (!prenom) { document.getElementById('err-profil-prenom').textContent = 'Champ requis'; ok = false; }
        if (!nom)    { document.getElementById('err-profil-nom').textContent    = 'Champ requis'; ok = false; }
        if (!email || !email.includes('@')) { document.getElementById('err-profil-email').textContent = 'E-mail invalide'; ok = false; }
        if (!gsm)    { document.getElementById('err-profil-gsm').textContent   = 'Champ requis'; ok = false; }
        if (!ok) return;

        // Mettre à jour veg_user
        const updated = { ...user, prenom, nom, email, gsm, adresse };
        localStorage.setItem('veg_user', JSON.stringify(updated));

        // Mettre à jour dans veg_users
        const users = JSON.parse(localStorage.getItem('veg_users') || '[]');
        const idx = users.findIndex(u => u.email === user.email);
        if (idx !== -1) { users[idx] = { ...users[idx], prenom, nom, email, gsm, adresse }; }
        localStorage.setItem('veg_users', JSON.stringify(users));

        document.getElementById('account-name').textContent = `${prenom} ${nom}`;
        document.getElementById('account-avatar').textContent = (prenom[0] + nom[0]).toUpperCase();

        const s = document.getElementById('profil-success');
        s.textContent = 'Profil mis à jour avec succès.';
        s.style.display = 'block';
        setTimeout(() => s.style.display = 'none', 3000);

        if (typeof updateNavbar === 'function') updateNavbar();
    });

    // ── Changement mot de passe ───────────────────────────────────────────
    document.getElementById('pwd-save').addEventListener('click', () => {
        const current = document.getElementById('pwd-current').value;
        const next    = document.getElementById('pwd-new').value;
        const confirm = document.getElementById('pwd-confirm').value;

        ['pwd-current','pwd-new','pwd-confirm'].forEach(id => {
            document.getElementById('err-' + id).textContent = '';
        });
        document.getElementById('pwd-error').style.display   = 'none';
        document.getElementById('pwd-success').style.display = 'none';

        let ok = true;
        const users = JSON.parse(localStorage.getItem('veg_users') || '[]');
        const stored = users.find(u => u.email === user.email);

        if (!current) { document.getElementById('err-pwd-current').textContent = 'Champ requis'; ok = false; }
        else if (stored && stored.password !== current) { document.getElementById('err-pwd-current').textContent = 'Mot de passe incorrect'; ok = false; }

        if (next.length < 8) { document.getElementById('err-pwd-new').textContent = 'Minimum 8 caractères'; ok = false; }
        if (next !== confirm) { document.getElementById('err-pwd-confirm').textContent = 'Les mots de passe ne correspondent pas'; ok = false; }
        if (!ok) return;

        if (stored) {
            stored.password = next;
            localStorage.setItem('veg_users', JSON.stringify(users));
        }

        document.getElementById('pwd-current').value = '';
        document.getElementById('pwd-new').value     = '';
        document.getElementById('pwd-confirm').value = '';

        const s = document.getElementById('pwd-success');
        s.textContent = 'Mot de passe changé avec succès.';
        s.style.display = 'block';
        setTimeout(() => s.style.display = 'none', 3000);
    });

    // ── ONGLET COMMANDES ──────────────────────────────────────────────────
    const renderCommandes = () => {
        const orders = JSON.parse(localStorage.getItem('veg_orders') || '[]')
            .filter(o => o.client?.email === user.email)
            .reverse();

        const list = document.getElementById('commandes-list');

        if (!orders.length) {
            list.innerHTML = '<p class="account-empty">Vous n\'avez pas encore passé de commande.</p>';
            return;
        }

        const STATUTS = ['En attente', 'Confirmée', 'En préparation', 'Livrée', 'Annulée'];

        list.innerHTML = orders.map(o => {
            const statut = o.statut || 'En attente';
            const date   = o.prestation?.date
                ? new Date(o.prestation.date).toLocaleDateString('fr-FR')
                : '—';
            const total  = ((o.totals?.menu || 0) + (o.totals?.delivery || 0)).toFixed(2).replace('.', ',');
            const canCancel = !['Livrée', 'Annulée'].includes(statut);

            return `
            <div class="commande-item" id="order-${o.id}">
                <div class="commande-item__head">
                    <div>
                        <span class="commande-item__id">${o.id}</span>
                        <span class="commande-item__date">Prestation le ${date}</span>
                    </div>
                    <span class="commande-item__statut commande-item__statut--${statut.toLowerCase().replace(/ /g,'-')}">${statut}</span>
                </div>
                <div class="commande-item__body">
                    <span><i class="bi bi-egg-fried"></i> ${o.menu?.label || '—'} × ${o.menu?.qty || '—'}</span>
                    <strong>${total} €</strong>
                </div>
                ${canCancel ? `<div class="commande-item__actions">
                    <button class="commande-item__cancel-btn" data-id="${o.id}">
                        <i class="bi bi-x-circle"></i> Annuler la commande
                    </button>
                </div>` : ''}
            </div>`;
        }).join('');

        // Boutons annulation
        list.querySelectorAll('.commande-item__cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const orders = JSON.parse(localStorage.getItem('veg_orders') || '[]');
                const o = orders.find(x => x.id === id);
                if (o) { o.statut = 'Annulée'; localStorage.setItem('veg_orders', JSON.stringify(orders)); }
                renderCommandes();
                renderAvisSelect();
            });
        });
    };

    renderCommandes();

    // ── ONGLET AVIS ───────────────────────────────────────────────────────
    let selectedNote = 0;

    const renderAvisSelect = () => {
        const orders = JSON.parse(localStorage.getItem('veg_orders') || '[]')
            .filter(o => o.client?.email === user.email && o.statut === 'Livrée');
        const existingAvis = JSON.parse(localStorage.getItem('veg_avis') || '[]')
            .filter(a => a.email === user.email)
            .map(a => a.orderId);

        const sel = document.getElementById('avis-commande');
        const opts = orders.filter(o => !existingAvis.includes(o.id)).map(o =>
            `<option value="${o.id}">${o.id} — ${o.menu?.label || '—'}</option>`
        ).join('');

        sel.innerHTML = '<option value="">— Sélectionnez une commande —</option>' + opts;
        if (!opts) sel.innerHTML += '<option disabled>Aucune commande éligible</option>';
    };

    renderAvisSelect();

    // Étoiles interactives
    const stars = document.querySelectorAll('.avis-star');
    const setStars = (n) => {
        stars.forEach(s => {
            const v = parseInt(s.dataset.val);
            s.innerHTML = v <= n ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
            s.classList.toggle('active', v <= n);
        });
    };
    stars.forEach(s => {
        s.addEventListener('mouseenter', () => setStars(parseInt(s.dataset.val)));
        s.addEventListener('mouseleave', () => setStars(selectedNote));
        s.addEventListener('click', () => { selectedNote = parseInt(s.dataset.val); setStars(selectedNote); });
    });

    // Publier un avis
    document.getElementById('avis-submit').addEventListener('click', () => {
        const orderId = document.getElementById('avis-commande').value;
        const texte   = document.getElementById('avis-texte').value.trim();

        document.getElementById('err-avis-commande').textContent = '';
        document.getElementById('err-avis-note').textContent     = '';
        document.getElementById('avis-error').style.display      = 'none';
        document.getElementById('avis-success').style.display    = 'none';

        let ok = true;
        if (!orderId) { document.getElementById('err-avis-commande').textContent = 'Veuillez sélectionner une commande'; ok = false; }
        if (!selectedNote) { document.getElementById('err-avis-note').textContent = 'Veuillez attribuer une note'; ok = false; }
        if (!ok) return;

        const avis = JSON.parse(localStorage.getItem('veg_avis') || '[]');
        avis.push({
            id: 'AVIS-' + Date.now(),
            orderId,
            email: user.email,
            auteur: `${user.prenom} ${user.nom}`,
            note: selectedNote,
            texte,
            date: new Date().toISOString(),
            statut: 'en_attente',
        });
        localStorage.setItem('veg_avis', JSON.stringify(avis));

        document.getElementById('avis-commande').value = '';
        document.getElementById('avis-texte').value    = '';
        selectedNote = 0;
        setStars(0);

        const s = document.getElementById('avis-success');
        s.textContent = 'Votre avis a été soumis et sera publié après validation.';
        s.style.display = 'block';
        setTimeout(() => s.style.display = 'none', 4000);

        renderAvisSelect();
        renderMesAvis();
    });

    // Afficher les avis déjà publiés
    const renderMesAvis = () => {
        const avis = JSON.parse(localStorage.getItem('veg_avis') || '[]')
            .filter(a => a.email === user.email)
            .reverse();

        const el = document.getElementById('mes-avis-list');
        if (!avis.length) {
            el.innerHTML = '<p class="account-empty">Vous n\'avez pas encore publié d\'avis.</p>';
            return;
        }

        const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
        el.innerHTML = avis.map(a => `
            <div class="avis-item">
                <div class="avis-item__head">
                    <span class="avis-item__stars">${stars(a.note)}</span>
                    <span class="avis-item__statut avis-item__statut--${a.statut}">${a.statut === 'en_attente' ? 'En attente de validation' : 'Publié'}</span>
                </div>
                <p class="avis-item__texte">${a.texte || '<em>Sans commentaire</em>'}</p>
                <span class="avis-item__date">${new Date(a.date).toLocaleDateString('fr-FR')}</span>
            </div>
        `).join('');
    };

    renderMesAvis();
})();
