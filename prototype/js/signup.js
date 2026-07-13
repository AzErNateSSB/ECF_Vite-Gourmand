(function () {
    const form         = document.getElementById('signup-form');
    const passInput    = document.getElementById('signup-password');
    const confirmInput = document.getElementById('signup-confirm');
    const errorBox     = document.getElementById('signup-error');
    const successBox   = document.getElementById('signup-success');

    if (!form) return;

    // ── Toggles afficher/cacher ───────────────────────────────────────────────
    function makeToggle(btnId, inputId) {
        const btn   = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (!btn || !input) return;
        btn.addEventListener('click', () => {
            const hidden = input.type === 'password';
            input.type = hidden ? 'text' : 'password';
            btn.querySelector('i').className = hidden ? 'bi bi-eye-slash' : 'bi bi-eye';
        });
    }
    makeToggle('toggle-signup-password',  'signup-password');
    makeToggle('toggle-confirm-password', 'signup-confirm');

    // ── Indicateur de force ───────────────────────────────────────────────────
    const RULES = {
        length:  p => p.length >= 10,
        upper:   p => /[A-Z]/.test(p),
        lower:   p => /[a-z]/.test(p),
        digit:   p => /\d/.test(p),
        special: p => /[^A-Za-z0-9]/.test(p),
    };

    passInput.addEventListener('input', () => {
        const p     = passInput.value;
        let score   = 0;

        Object.entries(RULES).forEach(([key, fn]) => {
            const ok = fn(p);
            if (ok) score++;
            const li = document.getElementById('rule-' + key);
            if (!li) return;
            li.querySelector('i').className = ok ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill';
            li.classList.toggle('ok', ok);
        });

        const bar   = document.getElementById('strength-bar');
        const label = document.getElementById('strength-label');
        const pct   = (score / 5) * 100;
        bar.style.width = pct + '%';
        bar.className   = score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong';
        label.textContent = score <= 1 ? 'Très faible' : score <= 2 ? 'Faible' : score <= 3 ? 'Moyen' : score === 4 ? 'Fort' : 'Très fort';
    });

    // ── Soumission ────────────────────────────────────────────────────────────
    form.addEventListener('submit', e => {
        e.preventDefault();
        clearErrors();

        const prenom   = document.getElementById('signup-prenom').value.trim();
        const nom      = document.getElementById('signup-nom').value.trim();
        const email    = document.getElementById('signup-email').value.trim();
        const gsm      = document.getElementById('signup-gsm').value.trim();
        const adresse  = document.getElementById('signup-adresse').value.trim();
        const password = passInput.value;
        const confirm  = confirmInput.value;
        let valid = true;

        if (!prenom) { showFieldError('err-prenom', 'Prénom requis.'); valid = false; }
        if (!nom)    { showFieldError('err-nom',    'Nom requis.'); valid = false; }
        if (!email || !email.includes('@')) { showFieldError('err-signup-email', 'E-mail invalide.'); valid = false; }
        if (!gsm)    { showFieldError('err-gsm',    'Numéro de téléphone requis.'); valid = false; }
        if (!adresse){ showFieldError('err-adresse','Adresse postale requise.'); valid = false; }

        const allRulesOk = Object.values(RULES).every(fn => fn(password));
        if (!allRulesOk) {
            showFieldError('err-signup-password', 'Le mot de passe ne respecte pas les critères requis.');
            valid = false;
        }
        if (password !== confirm) {
            showFieldError('err-confirm', 'Les mots de passe ne correspondent pas.');
            valid = false;
        }
        if (!valid) return;

        // Vérifie si l'email existe déjà
        const users = JSON.parse(localStorage.getItem('veg_users') || '[]');
        if (users.find(u => u.email === email)) {
            showError('Un compte avec cet e-mail existe déjà.');
            return;
        }

        const newUser = { prenom, nom, email, gsm, adresse, password, role: 'utilisateur' };
        users.push(newUser);
        localStorage.setItem('veg_users', JSON.stringify(users));
        localStorage.setItem('veg_user', JSON.stringify(newUser));

        showSuccess('Compte créé avec succès ! Bienvenue ' + prenom + ' 🎉 Redirection…');
        setTimeout(() => { window.location.href = '/'; }, 1500);
    });

    // ── Helpers ───────────────────────────────────────────────────────────────
    function showError(msg)           { errorBox.textContent = msg; errorBox.style.display = 'block'; }
    function showSuccess(msg)         { successBox.textContent = msg; successBox.style.display = 'block'; }
    function showFieldError(id, msg)  { const el = document.getElementById(id); if (el) el.textContent = msg; }
    function clearErrors() {
        errorBox.style.display = 'none';
        successBox.style.display = 'none';
        document.querySelectorAll('.auth-field__error').forEach(el => el.textContent = '');
    }
})();
