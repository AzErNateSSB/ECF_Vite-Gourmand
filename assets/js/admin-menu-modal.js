(function () {
    const hiddenSelect = document.getElementById('plats-hidden-select');
    const form = hiddenSelect ? hiddenSelect.closest('form') : null;
    if (!form) return;
    form.addEventListener('submit', () => {
        Array.from(hiddenSelect.options).forEach(o => o.selected = false);
        document.querySelectorAll('.plat-single-select').forEach(sel => {
            if (!sel.value) return;
            const opt = hiddenSelect.querySelector('option[value="' + sel.value + '"]');
            if (opt) opt.selected = true;
        });
    });
})();
