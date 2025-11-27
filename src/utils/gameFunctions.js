import { Task } from "../game/classes/Tasks";
import { Player } from "../game/classes/Player";
import { Recetario } from "../game/classes/Recetario";
import { LibroRecetario } from "../game/classes/LibroRecetario";
import { IngredientBox } from "../game/classes/IngredientBox";
import { KitchenBox } from "../game/classes/KitchenBox";
import { Freidora } from "../game/classes/Freidora";
import { Asador } from "../game/classes/Asador";
import { Brasero } from "../game/classes/Brasero";
import { getTranslations, getPhrase } from "../utils/Translations";

export function finishLevel(scene) {
    scene.sound.stopAll();
    scene.scene.stop("HUD");
    scene.cameras.main.fadeOut(500, 0, 0, 0);

    let mode = scene.currentMode;
    let reason = "continue";
    let empate = false;
    let completado = false;

    if (mode === 1) {
        let points = scene.registry.get("coopPoints");
        if (points < 0) {
            reason = getPhrase(scene.failedToCook);
            if (scene.actualLevel >= 8) {
                reason = getPhrase(scene.allRecepiesCooked);
                completado = true;
            }
        }
    }
    if (mode === 2) {
        let points1 = scene.registry.get("vsPoints1");
        let points2 = scene.registry.get("vsPoints2");
        if (points1 < 0 && points2 < 0) {
            reason = getPhrase(scene.bothLose);
            empate = true;
        } else if (points1 < 0 || points2 < 0) {
            reason = getPhrase(scene.jugador) + " " + (points1 < 0 ? 1 : 2) + " " + getPhrase(scene.oneLoses);
        }
    }


    if (reason != "continue") { // Termina la Partida
        scene.registry.set("actualLevel", 1)
        scene.cameras.main.once("camerafadeoutcomplete", () => {
            scene.scene.start("Victory", { reason, empate, completado });
        });
    } else { // Continua la partida a caceria
        scene.registry.set("actualLevel", scene.actualLevel + 1)
        scene.cameras.main.once("camerafadeoutcomplete", () => {
            scene.scene.start("Load", { nextScene: "Caceria" });
        });
    }

}

export function spawnPedidos(scene, ingredients, duration) {
    // busca una posición libre
    let y = scene.posicionesPedidos.find(
        pos => !scene.Interactuables.some(p => p.y === pos && p.availableIngredients)
    );

    if (!y) { // no hay lugar libre
        const hud = scene.scene.get("HUD");
        if (hud && hud.scene.isActive()) {
            hud.addPedidosEnCola(1);
        }
    } else {
        let pedido = new Task(scene, 40, y, scene.pedidosDisponibles, 48, "order", ingredients, duration);
        scene.physics.add.collider(scene.player, pedido);
        scene.physics.add.collider(scene.player02, pedido);
        scene.Interactuables.push(pedido);
        scene.audio.newOrderAudio.play({
            volume: 0.2, // Ajusta el volumen
            rate: 1    // Ajusta el pitch
        });
    }
}

export function checkTaskQueue(scene) {
    if (scene.scene.get("HUD").getPedidosEnCola() > 0) {
        spawnPedidos(scene);
        scene.scene.get("HUD").subsPedidosEnCola(1);
    }
}

export function createLevel(scene) {
    scene.nivel0 = { pedidosDispo: ["grilledChicken_2", "beef_2", "choppedChicory_0"], ingreNecesarios: ["rawChicken_0", "rawBeef_0", "rawChicory_0"] }
    scene.nivel1 = { pedidosDispo: ["grilledChicken_2", "beef_2", "choppedChicory_0"], ingreNecesarios: ["rawChicken_0", "rawBeef_0", "rawChicory_0"] }
    scene.nivel2 = { pedidosDispo: ["grilledChicken_2", "beef_2", "choppedChicory_0", "grilledPotato_0", "choppedPotato_1"], ingreNecesarios: ["rawChicken_0", "rawBeef_0", "rawChicory_0", "rawPotato_0"] }
    scene.nivel3 = { pedidosDispo: ["grilledChicken_2", "beef_2", "choppedChicory_0", "grilledPotato_0", "choppedPotato_1", "loin_2", "chorizo_2"], ingreNecesarios: ["rawChicken_0", "rawBeef_0", "rawChicory_0", "rawPotato_0", "rawLoin_0", "chorizoCrudo_0"] }
    scene.nivel4 = { pedidosDispo: ["grilledChicken_2", "beef_2", "choppedChicory_0", "grilledPotato_0", "choppedPotato_1", "loin_2", "chorizo_2", "pancho", "beefSandwich_0"], ingreNecesarios: ["rawChicken_0", "rawBeef_0", "rawChicory_0", "rawPotato_0", "rawLoin_0", "chorizoCrudo_0", "rawBread_0"] }
    scene.nivel5 = { pedidosDispo: ["grilledChicken_2", "beef_2", "choppedChicory_0", "grilledPotato_0", "choppedPotato_1", "loin_2", "chorizo_2", "pancho", "beefSandwich_0", "chickenMila_1", "beefMila_1"], ingreNecesarios: ["rawChicken_0", "rawBeef_0", "rawChicory_0", "rawPotato_0", "rawLoin_0", "chorizoCrudo_0", "rawBread_0"] }
    scene.nivel6 = { pedidosDispo: ["grilledChicken_2", "beef_2", "choppedChicory_0", "grilledPotato_0", "choppedPotato_1", "loin_2", "chorizo_2", "pancho", "beefSandwich_0", "chickenMila_1", "beefMila_1", "chickenMilaSandwich_0", "beefMilaSandwich_0"], ingreNecesarios: ["rawChicken_0", "rawBeef_0", "rawChicory_0", "rawPotato_0", "rawLoin_0", "chorizoCrudo_0", "rawBread_0"] }
    scene.nivel7 = { pedidosDispo: ["grilledChicken_2", "beef_2", "choppedChicory_0", "grilledPotato_0", "choppedPotato_1", "loin_2", "chorizo_2", "pancho", "beefSandwich_0", "chickenMila_1", "beefMila_1", "chickenMilaSandwich_0", "beefMilaSandwich_0", "chickenEmpanada_2", "meatEmpanada_2"], ingreNecesarios: ["rawChicken_0", "rawBeef_0", "rawChicory_0", "rawPotato_0", "rawLoin_0", "chorizoCrudo_0", "rawBread_0", "empanadaLid_0"] }
    if (scene.actualLevel === 0) {
        scene.pedidosDisponibles = scene.nivel0.pedidosDispo
        scene.ingredientesNecesarios = scene.nivel0.ingreNecesarios
    } else if (scene.actualLevel === 1) {
        scene.pedidosDisponibles = scene.nivel1.pedidosDispo
        scene.ingredientesNecesarios = scene.nivel1.ingreNecesarios
    } else if (scene.actualLevel === 2) {
        scene.pedidosDisponibles = scene.nivel2.pedidosDispo
        scene.ingredientesNecesarios = scene.nivel2.ingreNecesarios
    } else if (scene.actualLevel === 3) {
        scene.pedidosDisponibles = scene.nivel3.pedidosDispo
        scene.ingredientesNecesarios = scene.nivel3.ingreNecesarios
    } else if (scene.actualLevel === 4) {
        scene.pedidosDisponibles = scene.nivel4.pedidosDispo
        scene.ingredientesNecesarios = scene.nivel4.ingreNecesarios
    } else if (scene.actualLevel === 5) {
        scene.pedidosDisponibles = scene.nivel5.pedidosDispo
        scene.ingredientesNecesarios = scene.nivel5.ingreNecesarios
    } else if (scene.actualLevel === 6) {
        scene.pedidosDisponibles = scene.nivel6.pedidosDispo
        scene.ingredientesNecesarios = scene.nivel6.ingreNecesarios
    } else if (scene.actualLevel >= 7) {
        scene.pedidosDisponibles = scene.nivel7.pedidosDispo
        scene.ingredientesNecesarios = scene.nivel7.ingreNecesarios
    }

    scene.randomIndexIngredientesNecesarios = Math.floor(Math.random() * scene.ingredientesNecesarios.length)

}

export function createLayout(scene) {
    //FONDO Y PJ ---------------------------------------------------------
    scene.add.image(320, 180, "background");
    scene.add.image(565, 225, "ash");
    for (let i = 0; i < 4; i++) {
        let bell = scene.add.image(100, 65 + (90 * i), "bell")
        bell.setDepth(99)
    }
    scene.add.sprite(550, 210, "grill", 4);
    scene.add.sprite(575, 210, "grill", 5);
    scene.add.sprite(350, 225, "table", 6);
    scene.add.sprite(375, 225, "table", 7);
    scene.barra = scene.physics.add.sprite(100, 180, "deliverTable");
    scene.barra.body.pushable = false;
    scene.barra.body.setImmovable(true)
    scene.barra.body.setSize(scene.barra.body.width - 10, scene.barra.body.height)
    scene.player = new Player(scene, 420, 150, "player01", scene.inputSystem);
    scene.player02 = new Player(scene, 300, 150, "player02", scene.inputSystem, 2);

    scene.physics.add.collider(scene.player, scene.player02, () => {
        scene.playersTouching = true;
    }, null, scene);

    scene.physics.add.collider(scene.player, scene.barra);
    scene.physics.add.collider(scene.player02, scene.barra);

    scene.recetario = new Recetario(scene, 225, 378, scene.actualLevel)
    //Cajas---------------------------------------------------------------
    scene.Interactuables = []
    scene.ingredientesCreadosArray = []
    scene.nearestBox = null;
    scene.posicionesPedidos = [45, 135, 225, 315]

    scene.libroRecetario = new LibroRecetario(scene, 100, 260)
    scene.Interactuables.push(scene.libroRecetario)

    scene.ubicaionesDefault = [{ x: 240, y: 80 }, { x: 290, y: 65 }, { x: 358, y: 74 }, { x: 260, y: 205 }, { x: 460, y: 190 }, { x: 340, y: 280 }, { x: 430, y: 300 }, { x: 525, y: 330 }, { x: 575, y: 310 }]
    scene.arrayUbicacionesCajas = scene.customLayout || scene.ubicaionesDefault

    let cont = 0;
    scene.ingredientesNecesarios.forEach(element => {
        const index = Math.floor(Math.random() * scene.arrayUbicacionesCajas.length);

        const element1 = scene.arrayUbicacionesCajas[index];

        scene.arrayUbicacionesCajas.splice(index, 1);

        let box1 = new IngredientBox(scene, element1.x, element1.y, element, "box", 10);

        scene.physics.add.collider(box1, scene.player)
        scene.physics.add.collider(box1, scene.player02)
        scene.Interactuables.push(box1);
        cont++;
    });

    let box1 = new IngredientBox(scene, 600, 110, "coal_0", "box", 10);
    scene.physics.add.collider(box1, scene.player)
    scene.physics.add.collider(box1, scene.player02)
    scene.Interactuables.push(box1);

    // Creacion de table
    for (let i = 0; i < 6; i++) {
        let x = 350 + (i % 2) * 25; // X 400, 425, 400, 425
        let y = 150 + (Math.floor(i / 2) * 25); // Y aumenta en 1 cada 2 iteraciones
        let deliverTable = Math.random() < 0.5 ? 0 : 1;
        if (i === 2) deliverTable = 1; // proteccion para que no hayan tablas
        if (i > 2) deliverTable = 0; // proteccion para que no sean todos los espacios tablas
        let table = new KitchenBox(scene, x, y, "table", 25, i, deliverTable);
        scene.physics.add.collider(scene.player, table);
        scene.physics.add.collider(scene.player02, table);
        scene.Interactuables.push(table);
    }

    if (scene.actualLevel > 1) {
        scene.kitchenBox2 = new Freidora(scene, 460, 80, 30, null)
        scene.physics.add.collider(scene.player, scene.kitchenBox2)
        scene.physics.add.collider(scene.player02, scene.kitchenBox2)
        scene.Interactuables.push(scene.kitchenBox2);
    }

    //Creacion de grill
    for (let i = 0; i < 4; i++) {
        let x = 550 + (i % 2) * 25; // X 200, 225, 200, 225
        let y = 210 + (Math.floor(i / 2) * 25); // Y aumenta en 1 cada 2 iteraciones
        let grill = new Asador(scene, x, y, 25, i);
        scene.physics.add.collider(scene.player, grill);
        scene.physics.add.collider(scene.player02, grill);
        scene.Interactuables.push(grill);
    }
    //Creacion del brazier
    let brazier = new Brasero(scene, 540, 100, 25);
    scene.physics.add.collider(scene.player, brazier);
    scene.physics.add.collider(scene.player02, brazier);
    scene.Interactuables.push(brazier);

}