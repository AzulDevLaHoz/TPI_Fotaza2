import bcrypt from 'bcrypt';
import { User } from '../models/sync/sync.js';

// Mostrar formulario de registro
export function showRegister(req, res) {
    if (req.session.user) return res.redirect('/');
    res.render('auth/register', { error: null });
}

// Procesar registro
export async function register(req, res) {
    const { username, email, password, firstname, lastname } = req.body;

    try {
        // Verificar si ya existe el usuario o email
        const existing = await User.findOne({ 
            where: { email } 
        });
        if (existing) {
            return res.render('auth/register', { 
                error: 'Ya existe una cuenta con ese email.' 
            });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.render('auth/register', { 
                error: 'Ese nombre de usuario ya está en uso.' 
            });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
            firstname,
            lastname
        });

        res.redirect('/auth/login?registered=true');
    } catch (error) {
        console.error(error);
        res.render('auth/register', { error: 'Error al registrarse. Intentá de nuevo.' });
    }
}

// Mostrar formulario de login
export function showLogin(req, res) {
    if (req.session.user) return res.redirect('/');
    const registered = req.query.registered;
    res.render('auth/login', { error: null, registered });
}

// Procesar login
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.render('auth/login', { 
                error: 'Email o contraseña incorrectos.', 
                registered: null 
            });
        }

        if (user.banned) {
            return res.render('auth/login', { 
                error: 'Tu cuenta ha sido suspendida.', 
                registered: null 
            });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.render('auth/login', { 
                error: 'Email o contraseña incorrectos.', 
                registered: null 
            });
        }

        // Guardar en sesión
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            rol: user.rol,
            firstname: user.firstname,
            lastname: user.lastname
        };

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('auth/login', { error: 'Error al iniciar sesión.', registered: null });
    }
}

// Logout
export function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
}