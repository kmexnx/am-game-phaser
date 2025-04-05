class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        // Mostrar pantalla de carga
        this.add.image(400, 300, 'loading-background');
        const loadingBar = this.add.image(400, 400, 'loading-bar');
        
        // Configurar barra de progreso
        const loadingText = this.add.text(400, 450, 'Cargando...', {
            font: '16px monospace',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Evento de progreso
        this.load.on('progress', (value) => {
            loadingBar.scaleX = value;
        });

        // Cargar activos del juego
        this.loadAssets();
    }

    loadAssets() {
        // Imágenes
        this.load.image('title-background', 'assets/images/title-background.png');
        this.load.image('player', 'assets/images/player.png');
        this.load.image('am', 'assets/images/am.png');
        this.load.image('tile-floor', 'assets/images/tile-floor.png');
        this.load.image('tile-wall', 'assets/images/tile-wall.png');
        
        // Spritesheets
        this.load.spritesheet('player-walk', 'assets/images/player-walk.png', { frameWidth: 48, frameHeight: 64 });
        
        // Audio
        this.load.audio('music-theme', 'assets/audio/theme.mp3');
        this.load.audio('sound-scream', 'assets/audio/scream.mp3');
        
        // Mapas
        this.load.tilemapTiledJSON('map-level1', 'assets/maps/level1.json');
    }

    create() {
        // Animaciones del jugador
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // Iniciar pantalla de título
        this.scene.start('MainMenu');
    }
}