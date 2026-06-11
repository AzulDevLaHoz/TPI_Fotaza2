import * as z from 'zod';

const LOGIN = z.object({
    email: z.string()
        .email("Email o contraseña incorrectos."),

    password: z.string()
        .min(1, "Email o contraseña incorrectos.")
});

export function validarLogin(datos) {
    return LOGIN.safeParse(datos);
}

const REGISTRO = z.object({
    firstname: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre es demasiado largo")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

    lastname: z.string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido es demasiado largo")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras"),

    username: z.string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(50, "El nombre de usuario es demasiado largo")
        .regex(/^[a-zA-Z0-9_]+$/, "El usuario solo puede contener letras, números y guiones bajos"),

    email: z.string()
        .min(1, "El email es obligatorio")
        .email("El email no tiene un formato válido"),

    password: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .max(100, "La contraseña es demasiado larga")
});

export function validarRegistro(datos) {
    return REGISTRO.safeParse(datos);
}

const PUBLICACION = z.object({
    title: z.string()
        .min(1, "El título es obligatorio")
        .max(100, "El título no puede superar los 100 caracteres"),

    description: z.string()
        .max(500, "La descripción no puede superar los 500 caracteres")
        .optional()
        .or(z.literal('')),

    labels: z.string()
        .max(200, "Las etiquetas son demasiado largas")
        .optional()
        .or(z.literal('')),

    copyrightText: z.string()
        .max(100, "El texto de copyright no puede superar los 100 caracteres")
        .optional()
        .or(z.literal(''))
});

export function validarPublicacion(datos) {
    return PUBLICACION.safeParse(datos);
}

const COMENTARIO = z.object({
    body: z.string()
        .min(1, "El comentario no puede estar vacío")
        .max(300, "El comentario no puede superar los 300 caracteres"),

    imageId: z.string().min(1, "La imagen es obligatoria"),
    postId:  z.string().min(1, "La publicación es obligatoria")
});

export function validarComentario(datos) {
    return COMENTARIO.safeParse(datos);
}

const VALORACION = z.object({
    value: z.string()
        .refine(v => ['1', '2', '3', '4', '5'].includes(v), {
            message: "La valoración debe ser un número entre 1 y 5"
        }),

    imageId: z.string().min(1, "La imagen es obligatoria"),
    postId:  z.string().min(1, "La publicación es obligatoria")
});

export function validarValoracion(datos) {
    return VALORACION.safeParse(datos);
}

export function obtenerError(resultado) {
    if (!resultado || resultado.success) return null;
    try {
        const issues = resultado.error?.issues || resultado.error?.errors || [];
        if (issues.length > 0) return issues[0].message;
        return 'Datos inválidos';
    } catch {
        return 'Datos inválidos';
    }
}