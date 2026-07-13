(() => {
    // Pré-remplir l'email si connecté
    const user = JSON.parse(localStorage.getItem('veg_user') || 'null');
    if (user && user.email) {
        document.getElementById('contact-email').value = user.email;
    }

    // Compteur de caractères
    const textarea = document.getElementById('contact-message');
    const charCount = document.getElementById('contact-char-count');
    textarea.addEventListener('input', () => {
        charCount.textContent = `${textarea.value.length} / 2000`;
    });

    // Validation & envoi
    document.getElementById('contact-submit').addEventListener('click', () => {
        const sujet   = document.getElementById('contact-sujet').value.trim();
        const email   = document.getElementById('contact-email').value.trim();
        const message = textarea.value.trim();

        // Reset erreurs
        ['contact-sujet', 'contact-email', 'contact-message'].forEach(id => {
            document.getElementById('err-' + id).textContent = '';
        });
        document.getElementById('contact-error').style.display = 'none';

        let ok = true;
        if (!sujet)   { document.getElementById('err-contact-sujet').textContent   = 'Champ requis'; ok = false; }
        if (!email || !email.includes('@')) { document.getElementById('err-contact-email').textContent = 'E-mail invalide'; ok = false; }
        if (!message) { document.getElementById('err-contact-message').textContent = 'Champ requis'; ok = false; }

        if (!ok) return;

        // Mock : sauvegarder le message
        const messages = JSON.parse(localStorage.getItem('veg_contact_messages') || '[]');
        messages.push({ id: 'MSG-' + Date.now(), sujet, email, message, date: new Date().toISOString() });
        localStorage.setItem('veg_contact_messages', JSON.stringify(messages));

        // Afficher le succès
        document.getElementById('contact-form').style.display    = 'none';
        document.getElementById('contact-success').style.display = 'block';
        document.getElementById('contact-success-email').textContent = email;
    });

    // Réinitialiser pour un nouveau message
    document.getElementById('contact-new').addEventListener('click', () => {
        document.getElementById('contact-sujet').value   = '';
        document.getElementById('contact-message').value = '';
        charCount.textContent = '0 / 2000';
        if (!user) document.getElementById('contact-email').value = '';

        document.getElementById('contact-success').style.display = 'none';
        document.getElementById('contact-form').style.display    = 'block';
    });
})();
