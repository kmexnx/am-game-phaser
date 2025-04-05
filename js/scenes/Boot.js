class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Cargar imágenes mínimas necesarias para la pantalla de carga
        this.load.image('loading-background', 'assets/images/loading-background.png');
        this.load.image('loading-bar', 'assets/images/loading-bar.png');
    }

    create() {
        // Configuración adicional
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // Pasar a la escena de precarga
        this.scene.start('Preload');
    }
}