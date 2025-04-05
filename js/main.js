// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Boot, Preload, MainMenu, Game]
};

// Iniciar el juego
const game = new Phaser.Game(config);

// Variables globales
let gameSettings = {
    musicOn: true,
    soundOn: true,
    currentLevel: 0,
    playerHealth: 100,
    sanity: 100
};