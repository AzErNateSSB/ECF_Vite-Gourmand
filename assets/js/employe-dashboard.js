(function () {
    const tabs = document.querySelectorAll('.account-tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.style.display = 'none');
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab).style.display = '';
        });
    });

    // Filtres commandes
    const selectStatut = document.getElementById('filter-statut');
    const inputSearch  = document.getElementById('filter-search');

    function filterRows() {
        const statut = selectStatut.value;
        const q = inputSearch.value.toLowerCase();
        document.querySelectorAll('#commandes-table tbody tr[data-statut]').forEach(row => {
            const okStatut = !statut || row.dataset.statut === statut;
            const okSearch = !q || row.dataset.search.includes(q);
            row.style.display = okStatut && okSearch ? '' : 'none';
        });
    }

    selectStatut.addEventListener('change', filterRows);
    inputSearch.addEventListener('input', filterRows);

    // Modal Modifier Plat
    const modal     = document.getElementById('plat-modal');
    const modalBody = document.getElementById('plat-modal-body');

    document.addEventListener('click', e => {
        const btn = e.target.closest('.plat-modifier-btn');
        if (!btn) return;
        modal.style.display = 'flex';
        modalBody.innerHTML = '<div class="text-center py-4 text-muted">Chargement…</div>';
        fetch(btn.dataset.url)
            .then(r => r.text())
            .then(html => { modalBody.innerHTML = html; });
    });

    modal.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Modal Modifier Menu
    const menuModal     = document.getElementById('menu-modal');
    const menuModalBody = document.getElementById('menu-modal-body');

    document.addEventListener('click', e => {
        const btn = e.target.closest('.menu-modifier-btn');
        if (!btn) return;
        menuModal.style.display = 'flex';
        menuModalBody.innerHTML = '<div class="text-center py-4 text-muted">Chargement…</div>';
        fetch(btn.dataset.url)
            .then(r => r.text())
            .then(html => { menuModalBody.innerHTML = html; });
    });

    menuModal.addEventListener('click', e => {
        if (e.target === menuModal) menuModal.style.display = 'none';
    });

    // Modal Annulation Employé
    document.getElementById('modal-annulation-employe').addEventListener('click', function (e) {
        if (e.target === this) fermerModalAnnulationEmploye();
    });
})();

function ouvrirModalAnnulationEmploye(id, numero, gsm, csrfToken) {
    const modal   = document.getElementById('modal-annulation-employe');
    const titre   = document.getElementById('modal-annulation-employe-titre');
    const form    = document.getElementById('modal-annulation-employe-form');
    const token   = document.getElementById('modal-annulation-employe-token');
    const motif   = document.getElementById('modal-annulation-employe-motif');
    const gsmSpan = document.getElementById('modal-gsm-numero');

    titre.textContent = 'Vous êtes sur le point d\'annuler la commande ' + numero + '.';
    form.action = '/employe/commandes/' + id + '/annuler';
    token.value = csrfToken;
    motif.value = '';
    gsmSpan.textContent = gsm ? '(' + gsm + ')' : '';
    document.getElementById('modal-contact-email').checked = true;
    modal.style.display = 'flex';
}

function fermerModalAnnulationEmploye() {
    document.getElementById('modal-annulation-employe').style.display = 'none';
}
