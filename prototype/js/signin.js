(function () {
    const form        = document.getElementById('signin-form');
    const emailInput  = document.getElementById('signin-email');
    const passInput   = document.getElementById('signin-password');
    const errorBox    = document.getElementById('signin-error');
    const successBox  = document.getElementById('signin-success');
    const toggleBtn   = document.getElementById('toggle-password');
    const forgotLink  = document.getElementById('forgot-link');
    const forgotWrap  = document.getElementById('forgot-form-wrap');
    const forgotSubmit = document.getElementById('forgot-submit');
    const forgotEmail = document.getElementById('forgot-email');

    if (!form) return;

    // ── Afficher/cacher mot de passe ─────────────────────────────────────────
    toggleBtn.addEventListener('click', () => {
        const isHidden = passInput.type === 'password';
        passInput.type = isHidden ? 'text' : 'password';
        toggleBtn.querySelector('i').className = isHidden ? 'bi bi-eye-slash' : 'bi bi-eye';
    });

    // ── Mot de passe oublié ───────────────────────────────────────────────────
    forgotLink.addEventListener('click', e => {
        e.preventDefault();
        const visible = forgotWrap.style.display !== 'none';
        forgotWrap.style.display = visible ? 'none' : 'block';
    });

    forgotSubmit.addEventListener('click', () => {
        if (!forgotEmail.value || !forgotEmail.value.includes('@')) {
            forgotEmail.classList.add('is-invalid');
            return;
        }
        forgotEmail.classList.remove('is-invalid');
        showSuccess('Un lien de réinitialisation a été envoyé à ' + forgotEmail.value);
        forgotWrap.style.display = 'none';
    });

    // ── Soumission ────────────────────────────────────────────────────────────
    form.addEventListener('submit', e => {
        e.preventDefault();
        clearErrors();

        const email    = emailInput.value.trim();
        const password = passInput.value;
        let valid = true;

        if (!email || !email.includes('@')) {
            showFieldError('err-email', 'Veuillez saisir une adresse e-mail valide.');
            valid = false;
        }
        if (!password) {
            showFieldError('err-password', 'Veuillez saisir votre mot de passe.');
            valid = false;
        }
        if (!valid) return;

        // Vérification dans localStorage (mock — remplacé par API)
        const users = JSON.parse(localStorage.getItem('veg_users') || '[]');
        const user  = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showError('Email ou mot de passe incorrect.');
            return;
        }

        localStorage.setItem('veg_user', JSON.stringify(user));

        // Redirection post-login
        const params   = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '';
        showSuccess('Connexion réussie ! Redirection…');
        setTimeout(() => {
            window.location.href = redirect ? '/' + redirect : '/';
        }, 800);
    });

    // ── Helpers ───────────────────────────────────────────────────────────────
    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
    }
    function showSuccess(msg) {
        successBox.textContent = msg;
        successBox.style.display = 'block';
    }
    function showFieldError(id, msg) {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
    }
    function clearErrors() {
        errorBox.style.display = 'none';
        successBox.style.display = 'none';
        document.querySelectorAll('.auth-field__error').forEach(el => el.textContent = '');
    }
})();
