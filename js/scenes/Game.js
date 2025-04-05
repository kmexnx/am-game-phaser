class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Crear el mundo del juego con estética Burton
        this.createWorld();
        
        // Crear personaje jugador
        this.player = new Player(this, 400, 300);
        
        // Crear a AM (el antagonista)
        this.am = new AM(this, 200, 200);
        
        // Añadir colisiones después de crear el jugador
        this.setupCollisions();
        
        // Configurar cámara
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.2);
        
        // Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Interfaz de usuario
        this.createUI();
        
        // Sistema de diálogos
        this.dialogSystem = this.createDialogSystem();
    }

    createWorld() {
        // Crear mapa de tiles
        this.map = this.make.tilemap({ key: 'map-level1' });
        const tileset = this.map.addTilesetImage('tileset', 'tile-floor');
        const wallTileset = this.map.addTilesetImage('walls', 'tile-wall');
        
        // Crear capas
        this.groundLayer = this.map.createLayer('Ground', tileset);
        this.wallsLayer = this.map.createLayer('Walls', wallTileset);
        
        // En lugar de usar propiedades, definimos directamente qué tiles colisionan
        // Todos los tiles no vacíos en la capa de paredes colisionarán
        this.wallsLayer.setCollisionByExclusion([-1]);
    }

    setupCollisions() {
        // Configurar colisiones entre jugador y paredes
        if (this.player && this.wallsLayer) {
            this.physics.add.collider(this.player, this.wallsLayer);
        }
        
        // Configurar colisiones entre personajes
        if (this.player && this.am) {
            this.physics.add.collider(this.player, this.am);
        }
    }

    createUI() {
        // Crear interfaz con estilo Burton
        this.sanityBar = this.add.rectangle(100, 30, 150, 20, 0xff0000).setScrollFactor(0);
        this.sanityText = this.add.text(100, 10, 'Cordura', {
            fontFamily: 'monospace',
            fontSize: 14
        }).setScrollFactor(0).setOrigin(0.5, 0.5);
    }

    createDialogSystem() {
        // Crear sistema de diálogos para las interacciones con AM
        const dialogBox = this.add.rectangle(400, 500, 700, 100, 0x000000, 0.7)
            .setScrollFactor(0)
            .setVisible(false);
        
        const dialogText = this.add.text(70, 460, '', {
            fontFamily: 'monospace',
            fontSize: 16,
            color: '#ffffff',
            wordWrap: { width: 660 }
        }).setScrollFactor(0).setVisible(false);
        
        return { box: dialogBox, text: dialogText, isActive: false };
    }

    showDialog(text) {
        this.dialogSystem.box.setVisible(true);
        this.dialogSystem.text.setVisible(true);
        this.dialogSystem.text.setText(text);
        this.dialogSystem.isActive = true;
        
        // Temporizador para cerrar el diálogo
        this.time.delayedCall(4000, () => {
            this.dialogSystem.box.setVisible(false);
            this.dialogSystem.text.setVisible(false);
            this.dialogSystem.isActive = false;
        });
    }

    update() {
        // Actualizar jugador
        if (this.player) this.player.update(this.cursors);
        
        // Actualizar AM
        if (this.am) this.am.update(this.player);
        
        // Actualizar interfaz
        this.updateUI();
    }

    updateUI() {
        // Actualizar barra de cordura basada en el estado del jugador
        if (this.player) {
            const sanityWidth = (this.player.sanity / 100) * 150;
            this.sanityBar.width = sanityWidth;
            
            // Cambiar color según el nivel de cordura
            if (this.player.sanity < 30) {
                this.sanityBar.fillColor = 0xff0000; // Rojo para baja cordura
            } else if (this.player.sanity < 60) {
                this.sanityBar.fillColor = 0xffff00; // Amarillo para cordura media
            } else {
                this.sanityBar.fillColor = 0x00ff00; // Verde para cordura alta
            }
        }
    }
}