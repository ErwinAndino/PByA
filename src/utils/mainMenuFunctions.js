import { signOut } from "firebase/auth";
import { auth } from "./firebase/config";

export function highlightText(scene) {
    scene.coopText.setColor("#fff");
    scene.versusText.setColor("#fff");
    scene.languageText.setColor("#fff");
    scene.scoreboardText.setColor("#fff");
    let text = null;
    if (scene.selector === 3) text = scene.coopText;
    if (scene.selector === 2) text = scene.versusText;
    if (scene.selector === 1) text = scene.scoreboardText;
    if (scene.selector === 0) text = scene.languageText;
    text.setColor("#2ed12eff");
}

export async function logout(scene) {
    try {
        await signOut(auth);
        console.log("Sesión cerrada");

        scene.scene.start("MainMenu");
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
    }
}