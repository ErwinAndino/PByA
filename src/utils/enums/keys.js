// keys usadas en las traducciones... podemos agregar separacion logica en el armado
const sceneGame = {
    money: "Dinero",
    failedToCook: "Demasiados pedidos sin entregar!",
    allRecepiesCooked: "Pudieron aprender todas las recetas!",
    failedToDodge: "La criatura destruyó la parrilla",
    bothLose: "A los dos les falta calle",
    oneLoses: "le falta calle",
    jugador: "Al Jugador",
};
const scenePreloader = {
    symbol: "Este símbolo significa que está cargando!",
}

const sceneInitialMenu = {
    coop: "Cooperativo",
    versus: "Versus",
    scoreboard: "Puntuaciones",
    idioma: "Idioma",
    grab: "Juntar",
    dash: "Correr",
    lanzar: "Lanzar",
};
const controlsPaper = {
    grab: "Juntar",
    dash: "Correr",
    lanzar: "Lanzar",
    select: "Elegir",
    hit: "Golpear",
};


const sceneGameOver = {
    motivo: "Motivo",
    hired: "¡CONTRATADOS!",
    fired: "¡DESPEDIDOS!",
    tied: "EMPATE",
    victory: "¡VICTORIA!",
    money: "Dinero",
    retry: "DE NUEVO!",
    mainMenu: "VOLVER AL MENÚ",

};
const scenePauseMenu = {
    pause: "Pausa",
    resume: "Reanudar",
    skipTutorial: "Saltar tutorial",
    mainMenu: "Salir al menú",
};
const sceneTutorial = {
    N0_1: "Ey wachos demen bola que no tengo ganas de explicar esto devuelta",
    N0_2: "ya saben, si quieren mantener el laburo cocinen lo que les piden los clientes",
    N0_3: "las ordenes llegan aca a la izquierda y les dicen que porqueria tienen que cocinar",
    N0_4: "si tardan demasiado se me van los clientes y se los voy a descontar a los dos",
    N0_5: "ayúdense o no, no me importa, solo entreguen los pedidos antes que se acabe el día",
    N0_6: "ahora piquen una achicoria en la tabla de la mesa para hacer una ensalada y entréguenla",
    N1_1: "La propina que les den los clientes distribúyansela como se les cante",
    N1_2: "pero si alguno me empieza a generar perdidas lo rajo, sépanlo",
    N1_3: "ahora quiero que aprendan a usar la parrilla",
    N1_4: "agarren carbón de la caja y métanlo en el brasero para hacer unas brasas",
    N1_5: "después metan eso en la parrilla con alguna carne",
    N1_6: "tienen que sacarlo cuando este listo, no antes ni después",
    N1_7: "si se les quema se joden y lo hacen devuelta",
    N1_8: "ahora háganme un pollo a la parrilla y entréguenlo por allá",
    N2_1: "Ahora que saben usar la parrilla quiero que me hagan un bife y un pollo asados",
    N3_1: "Joya, ahora les voy a pedir algo mas complicado",
    N3_2: "quiero que me hagan un sándwich de bife y achicoria",
    N3_3: "para eso tienen que combinar en la mesa pan cortado, achicoria picada y bife asado",
    N3_4: "corten el pan en la tabla pero no lo destruyan hasta que sea pan rallado, es un corte al medio noma",
    N3_5: "piquen la achicoria también en la tabla y los combinan en la mesa, pero no en la tabla, la tabla es para picar",
    N3_6: "después cocinen el bife en la parrilla con las brasas y todo eso y me lo combinan en la mesa también",
    N3_7: "si no me dieron ni bola por allá abajo tienen un libro rojo que es el recetario con las instrucciones",
    N4_1: "Listo, mañana los quiero acá laburando",
    N4_2: "pero no se hagan los vivos que todavía están a prueba",
};

const sabiasQue = {
    N1: "El primer gol olímpico de la historia fue argentino",
    N2: "En Mendoza, hace más de 4.000 años cayó una lluvia de meteoritos gigantes",
    N3: "En la Patagonia se halló el Argentinosaurus, uno de los más grandes",
    N4: "El primer vehículo blindado de Latinoamérica fue argentino: el Yacaré",
    N5: "En Buenos Aires hay más psicólogos per cápita que en cualquier otra ciudad del mundo",
    N6: "En Argentina se realizó la primera transmisión radial pública del mundo",
    N7: "El colectivo (bus urbano) fue inventado en Argentina en 1928",
    N8: "Argentina ganó tres Copas del Mundo en Fútbol (1978, 1986 y 2022)",
    N9: "Argentina fue campeona del primer Mundial de Básquet",
    N10: "El Argentino Favaloro inventó el bypass, salvando millones de vidas",
    N11: "El semaforo peatonal se inventó en Rosario",
    N12: "La birome o bolígrafo fue inventado por un argentino",
    N13: "El pollo (alimento) viene del pollo (animal)",
    N14: "Sin fuego no hay asado",
    N15: "La parrilla sin carbón es una mesa cara",
    N16: "La achicoria es verde",
    N17: "Si se quema, ya está demasiado hecho",
    N18: "Las papas fritas se fríen con aceite caliente",
    N19: "El cuchillo afilado corta mejor",
    N20: "El cliente con hambre no espera",
    N21: "El pan acompaña todo",
    N22: "Si se cae al piso, pero por poco tiempo, todavía sirve",
    N23: "Cuanto más carbón, más calor",
    N24: "La salsa picante pica",
    N25: "El agua apaga el fuego (y el asado)",
    N26: "Para cocinar, primero hay que prender la parrilla",
    N27: "El que no cuida el fuego, come tarde",
    N28: "La parrilla caliente quema (comprobado científicamente)",
    N29: "El humo perfuma la ropa del parrillero",
    N30: "Si suena cumbia, algo se está cocinando bien",
    N31: "La carne se da vuelta una sola vez… o ninguna",
    N32: "El postre llega cuando ya no entra más",
    N33: "Si no hay clientes, no hay pedidos",
    N34: "El humo no respeta direcciones",
    N35: "La parrilla no está sucia, está condimentada",
    N36: "La música fuerte hace que cocines más rápido (mentira)",
    N37: "El parrillero sin delantal vive al límite",
    N38: "El fernet va en culo de botella o no va",
    N39: "La ensalada es opcional (pero necesaria para la conciencia)",
    N40: "Ante la duda, ponele chimi",
    didYouKnow: "Sabías qué?",
    pressAnyKey: "Presiona cualquier tecla para continuar"
};

export default {
    sceneGame,
    scenePreloader,
    sceneInitialMenu,
    sceneGameOver,
    scenePauseMenu,
    sceneTutorial,
    sabiasQue,
    controlsPaper,
};