document.addEventListener('DOMContentLoaded', () => {

    // ── Estrellas: hover + fetch (no recarga ni cierra modal)
    document.querySelectorAll('.star-rating').forEach(container => {
        const stars = container.querySelectorAll('.star');

        stars.forEach((star, idx) => {

            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    s.style.color = i <= idx ? '#f0c040' : 'var(--amber)';
                    s.style.transform = i <= idx ? 'scale(1.25)' : 'scale(1)';
                });
            });

            star.addEventListener('mouseleave', () => {
                stars.forEach(s => {
                    s.style.color = 'var(--amber)';
                    s.style.transform = 'scale(1)';
                });
            });

            star.addEventListener('click', async (e) => {
                e.preventDefault();
                const form = star.closest('form');
                const imageId = form.querySelector('[name="imageId"]').value;
                const postId = form.querySelector('[name="postId"]').value;
                const value = star.value;

                try {
                    const res = await fetch('/rating/rate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `value=${value}&imageId=${imageId}&postId=${postId}`
                    });
                    const data = await res.json();

                    if (data.ok) {
                        const fila = form.closest('.d-flex.align-items-center.justify-content-between');
                        const badge = document.createElement('span');
                        badge.className = 'badge badge-rating';
                        badge.textContent = 'tu voto: ' + data.value + ' ⭐';
                        form.replaceWith(badge);

                        const promedioDiv = fila.querySelector('.d-flex.align-items-center.gap-2[id]');
                        if (promedioDiv) {
                            promedioDiv.innerHTML =
                                '<span class="badge badge-rating">⭐ ' + data.promedio + '</span>' +
                                '<span style="font-size:11px;color:var(--dim)">' + data.total +
                                ' votacion' + (data.total !== 1 ? 'es' : '') + '</span>';
                        }
                    }
                } catch (err) {
                    console.error('Error al valorar:', err);
                }
            });
        });
    });

    // ── Comentarios sin recargar
    function crearNodoComentario(texto) {
        const div = document.createElement('div');
        div.className = 'd-flex gap-2 mb-3';
        div.innerHTML =
            '<div style="width:26px;height:26px;border-radius:50%;background:var(--bg-hover);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--amber);font-size:10px;font-weight:600;flex-shrink:0">?</div>' +
            '<div class="flex-grow-1"><div class="comment-bubble">' +
            '<strong style="font-size:11px;color:var(--amber)">vos</strong>' +
            '<p class="mb-0" style="font-size:12px;color:var(--text)">' + texto + '</p>' +
            '</div></div>';
        return div;
    }

    // Imagen única
    const formUnico = document.getElementById('formComentario');
    if (formUnico) {
        formUnico.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('inputComentario');
            const texto = input.value.trim();
            if (!texto) return;
            const imageId = formUnico.dataset.imageId;
            const postId = formUnico.dataset.postId;
            try {
                const res = await fetch('/comment/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'body=' + encodeURIComponent(texto) + '&imageId=' + imageId + '&postId=' + postId
                });
                if (res.ok || res.redirected) {
                    formUnico.parentElement.insertBefore(crearNodoComentario(texto), formUnico);
                    input.value = '';
                }
            } catch (err) {
                console.error('Error al comentar:', err);
            }
        });
    }

    // Modales (múltiples imágenes)
    document.querySelectorAll('.formComentarioModal').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = form.querySelector('.inputComentarioModal');
            const texto = input.value.trim();
            if (!texto) return;
            const imageId = form.dataset.imageId;
            const postId = form.dataset.postId;
            const modalId = form.dataset.modal;
            try {
                const res = await fetch('/comment/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'body=' + encodeURIComponent(texto) + '&imageId=' + imageId + '&postId=' + postId
                });
                if (res.ok || res.redirected) {
                    const zona = document.querySelector('#' + modalId + ' .overflow-auto');
                    zona.appendChild(crearNodoComentario(texto));
                    zona.scrollTop = zona.scrollHeight;
                    input.value = '';
                }
            } catch (err) {
                console.error('Error al comentar:', err);
            }
        });
    });

});