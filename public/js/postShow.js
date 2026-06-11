document.addEventListener('DOMContentLoaded', () => {

    // ── Estrellas: hover + fetch
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
                const form    = star.closest('form');
                const imageId = form.querySelector('[name="imageId"]').value;
                const postId  = form.querySelector('[name="postId"]').value;
                const value   = star.value;

                try {
                    const res  = await fetch('/rating/rate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `value=${value}&imageId=${imageId}&postId=${postId}`
                    });
                    const data = await res.json();

                    if (data.ok) {
                        // Reemplazar estrellas por badge
                        const fila  = form.closest('.d-flex.align-items-center.justify-content-between');
                        const badge = document.createElement('span');
                        badge.className   = 'badge badge-rating';
                        badge.textContent = 'tu voto: ' + data.value + ' ⭐';
                        form.replaceWith(badge);

                        // Actualizar promedio en el DOM
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
    function crearNodoComentario(texto, inicial) {
        const div = document.createElement('div');
        div.className = 'd-flex gap-2 mb-3';
        div.innerHTML =
            '<div style="width:26px;height:26px;border-radius:50%;background:var(--bg-hover);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--amber);font-size:10px;font-weight:600;flex-shrink:0">' + inicial + '</div>' +
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
            const input   = document.getElementById('inputComentario');
            const texto   = input.value.trim();
            if (!texto) return;
            const imageId = formUnico.dataset.imageId;
            const postId  = formUnico.dataset.postId;
            const inicial = formUnico.dataset.inicial || '?';
            try {
                const res = await fetch('/comment/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'body=' + encodeURIComponent(texto) + '&imageId=' + imageId + '&postId=' + postId
                });
                if (res.ok || res.redirected) {
                    formUnico.parentElement.insertBefore(crearNodoComentario(texto, inicial), formUnico);
                    input.value = '';
                }
            } catch (err) {
                console.error('Error al comentar:', err);
            }
        });
    }

    // Modales
    document.querySelectorAll('.formComentarioModal').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input   = form.querySelector('.inputComentarioModal');
            const texto   = input.value.trim();
            if (!texto) return;
            const imageId = form.dataset.imageId;
            const postId  = form.dataset.postId;
            const modalId = form.dataset.modal;
            const inicial = form.dataset.inicial || '?';
            try {
                const res = await fetch('/comment/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'body=' + encodeURIComponent(texto) + '&imageId=' + imageId + '&postId=' + postId
                });
                if (res.ok || res.redirected) {
                    const zona = document.querySelector('#' + modalId + ' .overflow-auto');
                    zona.appendChild(crearNodoComentario(texto, inicial));
                    zona.scrollTop = zona.scrollHeight;
                    input.value = '';
                }
            } catch (err) {
                console.error('Error al comentar:', err);
            }
        });
    });

    // ── Toggle comentarios sin cerrar modal
    document.querySelectorAll('.btnToggleComentarios').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const imageId = btn.dataset.imageId;

            try {
                const res  = await fetch('/comment/toggle/' + imageId, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'imageId=' + imageId
                });
                const data = await res.json();

                if (data.ok) {
                    const estado = btn.dataset.estado;
                    if (estado === 'abierto') {
                        btn.dataset.estado = 'cerrado';
                        btn.innerHTML = '<i class="bi bi-unlock me-1"></i> abrir comentarios';
                    } else {
                        btn.dataset.estado = 'abierto';
                        btn.innerHTML = '<i class="bi bi-lock me-1"></i> cerrar comentarios';
                    }
                }
            } catch (err) {
                console.error('Error al toggle comentarios:', err);
            }
        });
    });

    // ── Eliminar comentario sin cerrar modal ni recargar
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btnEliminarComentario');
        if (!btn) return;

        e.preventDefault();
        const commentId = btn.dataset.commentId;

        try {
            const res = await fetch('/comment/delete/' + commentId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'commentId=' + commentId
            });
            const data = await res.json();

            if (data.ok) {
                const nodo = btn.closest('.d-flex.gap-2.mb-3');
                if (nodo) nodo.remove();
            }
        } catch (err) {
            console.error('Error al eliminar comentario:', err);
        }
    });
});