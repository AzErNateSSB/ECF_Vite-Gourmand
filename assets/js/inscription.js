function toggleEye(btnId, inputId) {
    document.getElementById(btnId).addEventListener('click', function () {
        const el = document.getElementById(inputId);
        const ic = this.querySelector('i');
        el.type = el.type === 'password' ? 'text' : 'password';
        ic.className = el.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
    });
}
toggleEye('toggle-pwd', 'signup-password');
toggleEye('toggle-confirm', 'confirm-password');
