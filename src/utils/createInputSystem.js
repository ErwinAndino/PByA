import InputSystem from "./InputSystem";
import { INPUT_ACTIONS } from "./InputSystem";

export default function createInputs(scene) {
    //MANEJO DE INPUTS ---------------------------------------------------
    scene.inputSystem = new InputSystem(scene.input);
    scene.inputSystem.configureKeyboard({
        [INPUT_ACTIONS.UP]: [Phaser.Input.Keyboard.KeyCodes.W],
        [INPUT_ACTIONS.DOWN]: [Phaser.Input.Keyboard.KeyCodes.S],
        [INPUT_ACTIONS.LEFT]: [Phaser.Input.Keyboard.KeyCodes.A],
        [INPUT_ACTIONS.RIGHT]: [Phaser.Input.Keyboard.KeyCodes.D],
        [INPUT_ACTIONS.SOUTH]: [Phaser.Input.Keyboard.KeyCodes.X],
        [INPUT_ACTIONS.EAST]: [Phaser.Input.Keyboard.KeyCodes.C],
        [INPUT_ACTIONS.WEST]: [Phaser.Input.Keyboard.KeyCodes.Z]
    }, "player01");
    scene.inputSystem.configureKeyboard({
        [INPUT_ACTIONS.UP]: [Phaser.Input.Keyboard.KeyCodes.UP],
        [INPUT_ACTIONS.DOWN]: [Phaser.Input.Keyboard.KeyCodes.DOWN],
        [INPUT_ACTIONS.LEFT]: [Phaser.Input.Keyboard.KeyCodes.LEFT],
        [INPUT_ACTIONS.RIGHT]: [Phaser.Input.Keyboard.KeyCodes.RIGHT],
        [INPUT_ACTIONS.SOUTH]: [Phaser.Input.Keyboard.KeyCodes.K],
        [INPUT_ACTIONS.EAST]: [Phaser.Input.Keyboard.KeyCodes.L],
        [INPUT_ACTIONS.WEST]: [Phaser.Input.Keyboard.KeyCodes.J]
    }, "player02");

}