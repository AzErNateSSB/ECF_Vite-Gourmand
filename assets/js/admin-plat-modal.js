(function () {
    // L'id du champ file est passé via data-input-id sur la div #plat-modal-data
    const dataEl = document.getElementById('plat-modal-data');
    const inputId = dataEl ? dataEl.dataset.inputId : null;
    const input   = inputId ? document.getElementById(inputId) : null;
    const label   = document.getElementById('plat-file-name');
    const preview = document.getElementById('plat-img-preview')
                 || document.getElementById('plat-img-preview-placeholder');

    if (!input) return;

    input.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        label.textContent = file.name;
        const reader = new FileReader();
        reader.onload = e => {
            if (preview) {
                preview.outerHTML = '<img id="plat-img-preview" src="' + e.target.result
                    + '" style="height:80px;width:80px;object-fit:cover;border-radius:8px;border:2px solid #E8D1D7;">';
            }
        };
        reader.readAsDataURL(file);
    });
})();
