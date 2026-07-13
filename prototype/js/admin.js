(() => {
    // ── Garde rôle admin ─────────────────────────────────────────────────
    const user = JSON.parse(localStorage.getItem('veg_user') || 'null');
    if (!user || user.role !== 'admin') {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
    }

    document.getElementById('admin-badge').textContent =
        `${user.prenom || ''} ${user.nom || ''} — Administrateur`;

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
    // HELPERS GRAPHIQUES SVG
    // ════════════════════════════════════════════════════════════════
    const COLORS = ['#BE7D8D','#800020','#540015','#D4A0AB','#E8C4CC','#6B001A'];

    const svgDonut = (slices, labels) => {
        const total = slices.reduce((a, b) => a + b, 0);
        if (!total) return '<p style="color:#aaa;text-align:center;padding:2rem;">Aucune donnée</p>';
        const cx = 90, cy = 90, r = 65, hole = 38;
        let angle = -Math.PI / 2;
        const paths = slices.map((v, i) => {
            const a1 = angle;
            const a2 = angle + (v / total) * 2 * Math.PI;
            angle = a2;
            const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
            const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
            const ix1 = cx + hole * Math.cos(a1), iy1 = cy + hole * Math.sin(a1);
            const ix2 = cx + hole * Math.cos(a2), iy2 = cy + hole * Math.sin(a2);
            const large = (v / total) > 0.5 ? 1 : 0;
            return `<path d="M${ix1},${iy1} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${hole},${hole} 0 ${large},0 ${ix1},${iy1}" fill="${COLORS[i % COLORS.length]}" />`;
        }).join('');

        const legend = labels.map((l, i) => `
            <div class="admin-legend-item">
                <span class="admin-legend-dot" style="background:${COLORS[i % COLORS.length]}"></span>
                <span>${l} (${slices[i]})</span>
            </div>`).join('');

        return `<div class="admin-donut-wrap">
            <svg viewBox="0 0 180 180" width="180" height="180">${paths}</svg>
            <div class="admin-legend">${legend}</div>
        </div>`;
    };

    const svgBars = (labels, values, unit = '') => {
        if (!values.length || !values.some(v => v > 0))
            return '<p style="color:#aaa;text-align:center;padding:2rem;">Aucune donnée</p>';
        const max   = Math.max(...values);
        const W = 320, H = 160, barW = Math.floor((W - 20) / labels.length) - 6, padL = 10;
        const bars = labels.map((l, i) => {
            const bh  = max ? Math.round((values[i] / max) * (H - 30)) : 0;
            const x   = padL + i * (barW + 6);
            const y   = H - 20 - bh;
            const lbl = l.length > 10 ? l.substring(0, 9) + '…' : l;
            return `
            <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${COLORS[i % COLORS.length]}"/>
            <text x="${x + barW/2}" y="${H - 5}" text-anchor="middle" font-size="9" fill="#888">${lbl}</text>
            ${bh > 12 ? `<text x="${x + barW/2}" y="${y - 4}" text-anchor="middle" font-size="9" fill="#555">${values[i]}${unit}</text>` : ''}`;
        }).join('');
        return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">${bars}</svg>`;
    };

    const svgLine = (labels, values, unit = '') => {
        if (!values.length || !values.some(v => v > 0))
            return '<p style="color:#aaa;text-align:center;padding:2rem;">Aucune donnée</p>';
        const max = Math.max(...values) || 1;
        const W = 520, H = 160, padL = 40, padR = 10, padT = 15, padB = 25;
        const iW = W - padL - padR, iH = H - padT - padB;
        const pts = values.map((v, i) => {
            const x = padL + (i / (values.length - 1 || 1)) * iW;
            const y = padT + iH - (v / max) * iH;
            return `${x},${y}`;
        });
        const polyline = `<polyline points="${pts.join(' ')}" fill="none" stroke="#BE7D8D" stroke-width="2.5" stroke-linejoin="round"/>`;
        const dots = values.map((v, i) => {
            const [x, y] = pts[i].split(',');
            return `<circle cx="${x}" cy="${y}" r="4" fill="#800020"/>
                    <text x="${x}" y="${parseFloat(y) - 8}" text-anchor="middle" font-size="9" fill="#555">${v}${unit}</text>`;
        }).join('');
        const axisLabels = labels.map((l, i) => {
            const x = padL + (i / (labels.length - 1 || 1)) * iW;
            return `<text x="${x}" y="${H - 5}" text-anchor="middle" font-size="9" fill="#888">${l}</text>`;
        }).join('');
        const yLabels = [0, Math.round(max / 2), max].map(v => {
            const y = padT + iH - (v / max) * iH;
            return `<text x="${padL - 4}" y="${y + 3}" text-anchor="end" font-size="9" fill="#aaa">${v}${unit}</text>
                    <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#eee" stroke-width="1"/>`;
        }).join('');
        return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">${yLabels}${polyline}${dots}${axisLabels}</svg>`;
    };

    // ════════════════════════════════════════════════════════════════
    // DASHBOARD
    // ════════════════════════════════════════════════════════════════
    const renderDashboard = () => {
        const orders = JSON.parse(localStorage.getItem('veg_orders') || '[]');

        // KPIs
        const ca       = orders.reduce((s, o) => s + (o.totals?.menu || 0) + (o.totals?.delivery || 0), 0);
        const nbOrders = orders.length;
        const pending  = orders.filter(o => (o.statut || 'En attente') === 'En attente').length;
        const clients  = [...new Set(orders.map(o => o.client?.email).filter(Boolean))].length;

        document.getElementById('admin-kpis').innerHTML = [
            { icon: 'bi-currency-euro',  label: 'CA total',           val: ca.toFixed(2).replace('.', ',') + ' €', color: '#800020' },
            { icon: 'bi-bag-check-fill', label: 'Commandes totales',  val: nbOrders,   color: '#BE7D8D' },
            { icon: 'bi-hourglass-split',label: 'En attente',         val: pending,    color: '#856404' },
            { icon: 'bi-people-fill',    label: 'Clients distincts',  val: clients,    color: '#0a3622' },
        ].map(k => `
            <div class="admin-kpi">
                <i class="bi ${k.icon} admin-kpi__icon" style="color:${k.color}"></i>
                <div class="admin-kpi__val">${k.val}</div>
                <div class="admin-kpi__label">${k.label}</div>
            </div>`).join('');

        // Donut statuts
        const STATUTS = ['En attente', 'Confirmée', 'En préparation', 'Livrée', 'Annulée'];
        const statutCounts = STATUTS.map(s => orders.filter(o => (o.statut || 'En attente') === s).length);
        const nonZero = STATUTS.map((s, i) => ({ s, v: statutCounts[i] })).filter(x => x.v > 0);
        document.getElementById('chart-statuts').innerHTML =
            svgDonut(nonZero.map(x => x.v), nonZero.map(x => x.s));

        // Barres top menus
        const menuCount = {};
        orders.forEach(o => {
            if (o.menu?.label) menuCount[o.menu.label] = (menuCount[o.menu.label] || 0) + 1;
        });
        const topMenus = Object.entries(menuCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
        document.getElementById('chart-menus').innerHTML =
            svgBars(topMenus.map(x => x[0].replace('Menu ', '')), topMenus.map(x => x[1]));

        // Ligne CA mensuel (12 derniers mois)
        const now = new Date();
        const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
            return { label: d.toLocaleString('fr-FR', { month: 'short' }), y: d.getFullYear(), m: d.getMonth() };
        });
        const caByMonth = months.map(({ y, m }) =>
            Math.round(orders
                .filter(o => {
                    const d = new Date(o.date);
                    return d.getFullYear() === y && d.getMonth() === m;
                })
                .reduce((s, o) => s + (o.totals?.menu || 0) + (o.totals?.delivery || 0), 0))
        );
        document.getElementById('chart-ca').innerHTML =
            svgLine(months.map(m => m.label), caByMonth, '€');
    };

    renderDashboard();

    // ════════════════════════════════════════════════════════════════
    // EMPLOYÉS
    // ════════════════════════════════════════════════════════════════
    const renderEmployes = () => {
        const users  = JSON.parse(localStorage.getItem('veg_users') || '[]');
        const staff  = users.filter(u => ['employe', 'admin'].includes(u.role));
        const tbody  = document.getElementById('employes-tbody');
        const empty  = document.getElementById('employes-empty');

        if (!staff.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
        empty.style.display = 'none';

        tbody.innerHTML = staff.map(u => `
            <tr>
                <td><strong>${u.prenom || ''} ${u.nom || ''}</strong></td>
                <td>${u.email}</td>
                <td><span class="admin-role-badge admin-role-badge--${u.role}">${u.role === 'admin' ? 'Administrateur' : 'Employé'}</span></td>
                <td><span class="admin-role-badge ${u.actif === false ? 'admin-role-badge--inactif' : 'admin-role-badge--actif'}">
                    ${u.actif === false ? 'Inactif' : 'Actif'}
                </span></td>
                <td>
                    <button class="employe-btn employe-btn--sm ${u.actif === false ? 'employe-btn--success' : 'employe-btn--danger'} emp-toggle-btn"
                            data-email="${u.email}" data-actif="${u.actif === false ? '0' : '1'}">
                        <i class="bi bi-${u.actif === false ? 'check-lg' : 'slash-circle'}"></i>
                        ${u.actif === false ? 'Activer' : 'Désactiver'}
                    </button>
                </td>
            </tr>`).join('');

        tbody.querySelectorAll('.emp-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const users = JSON.parse(localStorage.getItem('veg_users') || '[]');
                const u = users.find(x => x.email === btn.dataset.email);
                if (u) { u.actif = btn.dataset.actif === '1' ? false : true; }
                localStorage.setItem('veg_users', JSON.stringify(users));
                renderEmployes();
            });
        });
    };

    renderEmployes();

    // Modal créer employé
    const overlay = document.getElementById('employe-modal-overlay');
    const closeModal = () => {
        overlay.style.display = 'none';
        ['emp-prenom','emp-nom','emp-email','emp-password'].forEach(id => {
            document.getElementById(id).value = '';
            const err = document.getElementById('err-' + id);
            if (err) err.textContent = '';
        });
        document.getElementById('emp-modal-error').style.display = 'none';
    };

    document.getElementById('employe-add-btn').addEventListener('click', () => {
        overlay.style.display = 'flex';
    });
    document.getElementById('employe-modal-close').addEventListener('click', closeModal);
    document.getElementById('employe-modal-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    document.getElementById('employe-modal-save').addEventListener('click', () => {
        const prenom   = document.getElementById('emp-prenom').value.trim();
        const nom      = document.getElementById('emp-nom').value.trim();
        const email    = document.getElementById('emp-email').value.trim();
        const password = document.getElementById('emp-password').value;
        const role     = document.getElementById('emp-role').value;

        ['emp-prenom','emp-nom','emp-email','emp-password'].forEach(id => {
            document.getElementById('err-' + id).textContent = '';
        });
        document.getElementById('emp-modal-error').style.display = 'none';

        let ok = true;
        if (!prenom)   { document.getElementById('err-emp-prenom').textContent   = 'Requis'; ok = false; }
        if (!nom)      { document.getElementById('err-emp-nom').textContent      = 'Requis'; ok = false; }
        if (!email || !email.includes('@')) { document.getElementById('err-emp-email').textContent = 'E-mail invalide'; ok = false; }
        if (password.length < 8) { document.getElementById('err-emp-password').textContent = 'Minimum 8 caractères'; ok = false; }
        if (!ok) return;

        const users = JSON.parse(localStorage.getItem('veg_users') || '[]');
        if (users.find(u => u.email === email)) {
            const err = document.getElementById('emp-modal-error');
            err.textContent = 'Cet e-mail est déjà utilisé.';
            err.style.display = 'block';
            return;
        }

        users.push({ prenom, nom, email, password, role, actif: true });
        localStorage.setItem('veg_users', JSON.stringify(users));
        closeModal();
        renderEmployes();
    });
})();
