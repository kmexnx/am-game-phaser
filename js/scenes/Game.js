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
        
        // Añadir tecla Escape para salir del juego
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // Interfaz de usuario (Creada antes de otros elementos para asegurar que esté en la parte superior)
        this.createUI();
        
        // Sistema de diálogos
        this.dialogSystem = this.createDialogSystem();
        
        // Añadir el sistema de objetivos para ganar el juego
        this.setupObjectives();
        
        // Control de estado del juego
        this.gameActive = true;
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

    setupObjectives() {
        // Número de componentes necesarios para ganar
        this.totalComponents = 5;
        this.collectedComponents = 0;
        
        // Crear los componentes en el mapa
        this.components = this.physics.add.group();
        
        // Posiciones de los componentes
        const positions = [
            { x: 100, y: 100 },
            { x: 600, y: 150 },
            { x: 150, y: 500 },
            { x: 550, y: 450 },
            { x: 350, y: 300 }
        ];
        
        // Crear los componentes
        positions.forEach(pos => {
            // Usar un rectángulo azul como placeholder para los componentes
            const component = this.components.create(pos.x, pos.y, 'player');
            component.setScale(0.5);
            component.setTint(0x00ffff); // Color cian para los componentes
        });
        
        // Añadir colisión con el jugador
        this.physics.add.overlap(this.player, this.components, this.collectComponent, null, this);
        
        // Texto para mostrar los componentes recolectados
        this.componentText = this.add.text(650, 30, 'Componentes: 0/' + this.totalComponents, {
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#ffffff'
        }).setScrollFactor(0).setDepth(100);
        
        // Añadir portal de escape (inicialmente invisible)
        this.escapePortal = this.physics.add.sprite(400, 200, 'player');
        this.escapePortal.setTint(0xff00ff); // Color magenta para el portal
        this.escapePortal.setScale(1.2);
        this.escapePortal.setVisible(false);
        this.escapePortal.body.setEnable(false);
        
        // Colisión con el portal
        this.physics.add.overlap(this.player, this.escapePortal, this.escapeFromAM, null, this);
    }

    collectComponent(player, component) {
        // Eliminar el componente del mapa
        component.destroy();
        
        // Incrementar contador
        this.collectedComponents++;
        
        // Actualizar texto
        this.componentText.setText('Componentes: ' + this.collectedComponents + '/' + this.totalComponents);
        
        // Mostrar mensaje
        this.showDialog('Has encontrado un componente. (' + this.collectedComponents + '/' + this.totalComponents + ')');
        
        // Si se han recolectado todos los componentes, activar el portal de escape
        if (this.collectedComponents >= this.totalComponents) {
            this.activateEscapePortal();
        }
    }

    activateEscapePortal() {
        this.escapePortal.setVisible(true);
        this.escapePortal.body.setEnable(true);
        
        // Añadir animación pulsante al portal
        this.tweens.add({
            targets: this.escapePortal,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        this.showDialog('¡Has encontrado todos los componentes! El portal de escape ha sido activado.');
    }

    escapeFromAM() {
        if (!this.gameActive) return;
        
        // Desactivar el juego
        this.gameActive = false;
        
        // Mostrar mensaje de victoria
        this.showDialog('¡Has escapado de AM! La pesadilla ha terminado... por ahora.');
        
        // Detener toda actividad del juego
        this.physics.pause();
        
        // Aplicar efecto de desvanecimiento a la pantalla
        this.cameras.main.fade(3000, 0, 0, 0);
        
        // Después de 3 segundos, volver al menú principal
        this.time.delayedCall(3000, () => {
            this.scene.start('MainMenu');
        });
    }
    
    playerCaptured() {
        if (!this.gameActive) return;
        
        // Desactivar el juego
        this.gameActive = false;
        
        // Mostrar mensaje de derrota
        this.showDialog('AM: TE TENGO PARA SIEMPRE. NO HAY ESCAPE. NO TENDRÁS BOCA PARA GRITAR...');
        
        // Efecto visual de derrota
        this.cameras.main.shake(2000, 0.05);
        
        // El jugador cambia a color rojo (capturado por AM)
        this.player.setTint(0xff0000);
        
        // Detener toda actividad del juego
        this.physics.pause();
        
        // Hacer que AM crezca en tamaño para simbolizar su victoria
        this.tweens.add({
            targets: this.am,
            scaleX: 2,
            scaleY: 2,
            duration: 2000,
            ease: 'Sine.easeInOut'
        });
        
        // Después de 5 segundos, volver al menú principal
        this.time.delayedCall(5000, () => {
            this.scene.start('MainMenu');
        });
    }

    createUI() {
        // Crear un contenedor para la UI que siempre esté visible
        this.uiContainer = this.add.container(0, 0).setDepth(100).setScrollFactor(0);
        
        // Fondo para la barra de cordura para hacerla más visible
        const sanityBarBg = this.add.rectangle(180, 30, 154, 24, 0x000000, 0.7);
        
        // Barra de cordura (ahora más grande y visible)
        this.sanityBar = this.add.rectangle(180, 30, 150, 20, 0x00ff00);
        
        // Texto de cordura (reposicionado y más visible)
        this.sanityText = this.add.text(180, 30, 'CORDURA', {
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5);
        
        // Añadir todos los elementos al contenedor UI
        this.uiContainer.add([sanityBarBg, this.sanityBar, this.sanityText]);
    }

    createDialogSystem() {
        // Crear sistema de diálogos para las interacciones con AM
        const dialogBox = this.add.rectangle(400, 500, 700, 100, 0x000000, 0.7)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(100);
        
        const dialogText = this.add.text(70, 460, '', {
            fontFamily: 'monospace',
            fontSize: 16,
            color: '#ffffff',
            wordWrap: { width: 660 }
        }).setScrollFactor(0).setVisible(false).setDepth(100);
        
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
        // Si el juego no está activo, no actualizar
        if (!this.gameActive) return;
        
        // Comprobar tecla Escape para volver al menú
        if (this.escKey && this.escKey.isDown) {
            this.scene.start('MainMenu');
        }
        
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