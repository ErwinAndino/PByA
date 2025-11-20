import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

import { auth } from "./config";

// Registro
export async function register(email, password) {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        return { ok: true, user };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

// Login
export async function login(email, password) {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        return { ok: true, user };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

// Logout
export async function logout() {
    try {
        await signOut(auth);
        return { ok: true };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

// Escuchar cambios de sesión
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}
