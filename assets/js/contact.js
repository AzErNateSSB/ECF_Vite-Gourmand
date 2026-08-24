const msgArea = document.getElementById('contact-message');
const charCount = document.getElementById('contact-char-count');
if (msgArea) {
    msgArea.addEventListener('input', () => {
        charCount.textContent = msgArea.value.length + ' / 2000';
    });
}

document.getElementById('contact-submit').addEventListener('click', function () {
    const email = document.getElementById('contact-email').value.trim();
    const msg   = document.getElementById('contact-message').value.trim();
    let ok = true;
    document.getElementById('err-contact-email').textContent   = '';
    document.getElementById('err-contact-message').textContent = '';
    if (!email || !email.includes('@')) {
        document.getElementById('err-contact-email').textContent = 'E-mail invalide.';
        ok = false;
    }
    if (!msg) {
        document.getElementById('err-contact-message').textContent = 'Le message est requis.';
        ok = false;
    }
    if (ok) {
        document.getElementById('contact-success-email').textContent = email;
        document.getElementById('contact-form').style.display    = 'none';
        document.getElementById('contact-success').style.display = 'flex';
    }
});

document.getElementById('contact-new').addEventListener('click', function () {
    document.getElementById('contact-message').value          = '';
    document.getElementById('contact-char-count').textContent = '0 / 2000';
    document.getElementById('contact-form').style.display     = 'block';
    document.getElementById('contact-success').style.display  = 'none';
});
