function ouvrirModalAnnulation(id, numero, csrfToken) {
    var modal = document.getElementById('modal-annulation');
    var titre = document.getElementById('modal-annulation-titre');
    var form  = document.getElementById('modal-annulation-form');
    var token = document.getElementById('modal-annulation-token');
    titre.textContent = 'Êtes-vous sûr de vouloir annuler la commande ' + numero + ' ?';
    form.action = '/compte/commande/' + id + '/annuler';
    token.value = csrfToken;
    modal.style.display = 'flex';
}

function fermerModalAnnulation() {
    document.getElementById('modal-annulation').style.display = 'none';
}

document.getElementById('modal-annulation').addEventListener('click', function (e) {
    if (e.target === this) fermerModalAnnulation();
});

// Onglets
document.querySelectorAll('.account-tabs__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.account-tabs__btn').forEach(function (b) { b.classList.remove('active'); });
        document.querySelectorAll('.account-panel').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var tab = document.getElementById('tab-' + btn.dataset.tab);
        if (tab) tab.classList.add('active');
    });
});

// Étoiles avis
var selectedNote = 0;
var stars = document.querySelectorAll('.avis-star');
stars.forEach(function (star) {
    star.addEventListener('mouseenter', function () {
        var val = parseInt(star.dataset.val);
        stars.forEach(function (s, idx) {
            s.querySelector('i').className = idx < val ? 'bi bi-star-fill' : 'bi bi-star';
        });
    });
    star.addEventListener('mouseleave', function () {
        stars.forEach(function (s, idx) {
            s.querySelector('i').className = idx < selectedNote ? 'bi bi-star-fill' : 'bi bi-star';
        });
    });
    star.addEventListener('click', function () {
        selectedNote = parseInt(star.dataset.val);
        var noteInput = document.getElementById('avis-note-value');
        if (noteInput) noteInput.value = selectedNote;
        stars.forEach(function (s, idx) {
            s.querySelector('i').className = idx < selectedNote ? 'bi bi-star-fill' : 'bi bi-star';
        });
    });
});

// Eye toggle
document.querySelectorAll('.auth-field__eye').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var targetId = btn.dataset.target;
        var input = document.getElementById(targetId);
        var icon = document.getElementById('eye-' + targetId);
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.className = 'bi bi-eye';
        } else {
            input.type = 'password';
            if (icon) icon.className = 'bi bi-eye-slash';
        }
    });
});
