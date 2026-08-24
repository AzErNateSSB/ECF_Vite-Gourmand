(function () {
    const adresseInput = document.querySelector('[name="commande[adresseLivraison]"]');
    const villeInput   = document.querySelector('[name="commande[villeLivraison]"]');
    const menuSelect   = document.querySelector('[name="commande[menu]"]');
    const nbInput      = document.querySelector('[name="commande[nombrePersonne]"]');
    const detail       = document.getElementById('recap-detail');

    if (!villeInput) return;

    let timer = null;

    function fmt(n) { return n.toFixed(2).replace('.', ',') + ' €'; }

    function mettreAJour() {
        const ville   = villeInput.value.trim();
        const adresse = adresseInput ? adresseInput.value.trim() : '';
        const menuId  = menuSelect ? menuSelect.value : '';
        const nb      = nbInput ? parseInt(nbInput.value) || 0 : 0;

        if (!ville) { detail.style.display = 'none'; return; }

        const params = new URLSearchParams({ adresse, ville, menuId, nbPersonnes: nb });
        fetch('/api/livraison-prix?' + params)
            .then(r => r.json())
            .then(data => {
                if (data.prixLivraison === null) return;
                document.getElementById('r-livraison').textContent = fmt(data.prixLivraison);
                if (data.prixMenu !== null) {
                    document.getElementById('r-menu').textContent = fmt(data.prixMenu);
                    document.getElementById('r-total').textContent = fmt(data.total);
                    const redWrap = document.getElementById('r-reduction-wrap');
                    if (data.prixReduction > 0) {
                        document.getElementById('r-reduction').textContent = '- ' + fmt(data.prixReduction);
                        redWrap.style.display = 'inline';
                    } else {
                        redWrap.style.display = 'none';
                    }
                }
                detail.style.display = 'block';
            })
            .catch(() => {});
    }

    function debounce() { clearTimeout(timer); timer = setTimeout(mettreAJour, 700); }

    villeInput.addEventListener('input', debounce);
    if (adresseInput) adresseInput.addEventListener('input', debounce);
    if (menuSelect)   menuSelect.addEventListener('change', mettreAJour);
    if (nbInput)      nbInput.addEventListener('input', debounce);

    const data = document.getElementById('commande-data');
    if (data && data.dataset.autostart === '1') mettreAJour();
    // Pour la page modifier, les champs sont déjà remplis
    if (data && data.dataset.autostart === 'prefill') mettreAJour();
})();
