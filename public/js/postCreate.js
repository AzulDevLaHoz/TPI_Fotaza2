document.addEventListener('DOMContentLoaded', () => {

    // ── Mostrar/ocultar campo de copyright
    const check = document.getElementById('copyrightCheck');
    const div = document.getElementById('copyrightTextDiv');

    if (check && div) {
        check.addEventListener('change', () => {
            div.style.display = check.checked ? 'block' : 'none';
        });
    }

});