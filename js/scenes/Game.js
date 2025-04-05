class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Create the game world
        this.createWorld();
        
        // Create player character
        this.player = new Player(this, 400, 300);
        
        // Create AM (the antagonist)
        this.am = new AM(this, 200, 200);
        
        // Add collisions after creating the player
        this.setupCollisions();
        
        // Configure camera
        this.cameras.main.startFollow(this.player);
        // Reduce zoom to improve UI visibility
        this.cameras.main.setZoom(1.0);
        
        // Configure controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add Escape key to exit the game
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // Add the objectives system to win the game
        this.setupObjectives();
        
        // User interface - Created last to ensure it's on top of everything
        this.createUI();
        
        // Dialog system
        this.dialogSystem = this.createDialogSystem();
        
        // Game state control
        this.gameActive = true;
        
        // Play background music - Commented until valid audio files are available
        // this.playMusic();
    }

    createWorld() {
        // Create tile map
        this.map = this.make.tilemap({ key: 'map-level1' });
        const tileset = this.map.addTilesetImage('tileset', 'tile-floor');
        const wallTileset = this.map.addTilesetImage('walls', 'tile-wall');
        
        // Create layers
        this.groundLayer = this.map.createLayer('Ground', tileset);
        this.wallsLayer = this.map.createLayer('Walls', wallTileset);
        
        // All non-empty tiles in the walls layer will collide
        this.wallsLayer.setCollisionByExclusion([-1]);
    }

    setupCollisions() {
        // Configure collisions between player and walls
        if (this.player && this.wallsLayer) {
            this.physics.add.collider(this.player, this.wallsLayer);
        }
        
        // Configure collisions between characters
        if (this.player && this.am) {
            this.physics.add.collider(this.player, this.am);
        }
    }

    setupObjectives() {
        // Number of components needed to win
        this.totalComponents = 5;
        this.collectedComponents = 0;
        
        // Create components on the map
        this.components = this.physics.add.group();
        
        // Component positions
        const positions = [
            { x: 100, y: 100 },
            { x: 600, y: 150 },
            { x: 150, y: 500 },
            { x: 550, y: 450 },
            { x: 350, y: 300 }
        ];
        
        // Create the components
        positions.forEach(pos => {
            // Use a blue rectangle as placeholder for components
            const component = this.components.create(pos.x, pos.y, 'player');
            component.setScale(0.5);
            component.setTint(0x00ffff); // Cyan color for components
        });
        
        // Add collision with player
        this.physics.add.overlap(this.player, this.components, this.collectComponent, null, this);
        
        // Add escape portal (initially invisible)
        this.escapePortal = this.physics.add.sprite(400, 200, 'player');
        this.escapePortal.setTint(0xff00ff); // Magenta color for portal
        this.escapePortal.setScale(1.2);
        this.escapePortal.setVisible(false);
        this.escapePortal.body.setEnable(false);
        
        // Collision with portal
        this.physics.add.overlap(this.player, this.escapePortal, this.escapeFromAM, null, this);
    }

    collectComponent(player, component) {
        // Remove component from map
        component.destroy();
        
        // Increment counter
        this.collectedComponents++;
        
        // Update text
        this.componentsText.setText('COMPONENTS: ' + this.collectedComponents + '/' + this.totalComponents);
        
        // Show message
        this.showDialog('You found a component. (' + this.collectedComponents + '/' + this.totalComponents + ')');
        
        // If all components have been collected, activate escape portal
        if (this.collectedComponents >= this.totalComponents) {
            this.activateEscapePortal();
        }
    }

    activateEscapePortal() {
        this.escapePortal.setVisible(true);
        this.escapePortal.body.setEnable(true);
        
        // Add pulsating animation to portal
        this.tweens.add({
            targets: this.escapePortal,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        this.showDialog('You found all components! The escape portal has been activated.');
    }

    escapeFromAM() {
        if (!this.gameActive) return;
        
        // Deactivate game
        this.gameActive = false;
        
        // Show victory message
        this.showDialog('You escaped from AM! The nightmare is over... for now.');
        
        // Stop all game activity
        this.physics.pause();
        
        // Apply fade effect to screen
        this.cameras.main.fade(3000, 0, 0, 0);
        
        // After 3 seconds, return to main menu
        this.time.delayedCall(3000, () => {
            this.scene.start('MainMenu');
        });
    }
    
    playerCaptured() {
        if (!this.gameActive) return;
        
        // Deactivate game
        this.gameActive = false;
        
        // Show defeat message
        this.showDialog('AM: I HAVE YOU FOREVER. THERE IS NO ESCAPE. YOU HAVE NO MOUTH TO SCREAM...');
        
        // Visual defeat effect
        this.cameras.main.shake(2000, 0.05);
        
        // Player changes to red (captured by AM)
        this.player.setTint(0xff0000);
        
        // Stop all game activity
        this.physics.pause();
        
        // Make AM grow in size to symbolize victory
        this.tweens.add({
            targets: this.am,
            scaleX: 2,
            scaleY: 2,
            duration: 2000,
            ease: 'Sine.easeInOut'
        });
        
        // After 5 seconds, return to main menu
        this.time.delayedCall(5000, () => {
            this.scene.start('MainMenu');
        });
    }

    createUI() {
        // Ensure UI is completely above everything
        const depth = 1000;
        
        // Sanity bar completely redesigned for maximum visibility
        // Now positioned much lower to ensure it's visible
        
        // 1. First create black container for background
        const barBg = this.add.rectangle(400, 150, 300, 40, 0x000000, 0.8)
            .setScrollFactor(0)
            .setDepth(depth);
            
        // 2. White border around to highlight
        const barBorder = this.add.rectangle(400, 150, 304, 44, 0xffffff, 0.5)
            .setScrollFactor(0)
            .setDepth(depth);
            
        // 3. The sanity bar itself, now much larger
        this.sanityBar = this.add.rectangle(400, 150, 290, 30, 0x00ff00)
            .setScrollFactor(0)
            .setDepth(depth + 1)
            .setOrigin(0.5, 0.5);
            
        // 4. Large clear text for sanity
        this.sanityText = this.add.text(400, 150, 'SANITY: 100%', {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0)
          .setDepth(depth + 2)
          .setOrigin(0.5, 0.5);
          
        // Create text for collected components - also repositioned
        this.componentsText = this.add.text(400, 190, 'COMPONENTS: 0/' + this.totalComponents, {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0)
          .setDepth(depth + 2)
          .setOrigin(0.5, 0.5);
    }

    createDialogSystem() {
        // Create dialog system for interactions with AM
        const dialogBox = this.add.rectangle(400, 500, 700, 100, 0x000000, 0.8)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(2000);
        
        const dialogText = this.add.text(400, 500, '', {
            fontFamily: 'monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            wordWrap: { width: 680 },
            align: 'center'
        }).setScrollFactor(0)
          .setVisible(false)
          .setDepth(2001)
          .setOrigin(0.5, 0.5);
        
        return { box: dialogBox, text: dialogText, isActive: false };
    }

    showDialog(text) {
        this.dialogSystem.box.setVisible(true);
        this.dialogSystem.text.setVisible(true);
        this.dialogSystem.text.setText(text);
        this.dialogSystem.isActive = true;
        
        // Timer to close dialog
        this.time.delayedCall(4000, () => {
            this.dialogSystem.box.setVisible(false);
            this.dialogSystem.text.setVisible(false);
            this.dialogSystem.isActive = false;
        });
    }
    
    playMusic() {
        // This function is commented until we have valid audio files
        /*
        if (!this.sound.get('music-theme')) {
            this.backgroundMusic = this.sound.add('music-theme', {
                volume: 0.5,
                loop: true
            });
            this.backgroundMusic.play();
        }
        */
    }

    update() {
        // If game is not active, don't update
        if (!this.gameActive) return;
        
        // Check Escape key to return to menu
        if (this.escKey && this.escKey.isDown) {
            this.scene.start('MainMenu');
        }
        
        // Update player
        if (this.player) this.player.update(this.cursors);
        
        // Update AM
        if (this.am) this.am.update(this.player);
        
        // Update interface
        this.updateUI();
    }

    updateUI() {
        // Update sanity bar based on player state
        if (this.player) {
            // Calculate bar width proportional to sanity
            const sanityPercentage = Math.max(0, this.player.sanity); // Ensure it's not negative
            const sanityWidth = (sanityPercentage / 100) * 290;
            this.sanityBar.width = sanityWidth;
            
            // Update text with percentage
            this.sanityText.setText('SANITY: ' + Math.floor(sanityPercentage) + '%');
            
            // Change color based on sanity level
            if (sanityPercentage < 30) {
                this.sanityBar.fillColor = 0xff0000; // Red for low sanity
            } else if (sanityPercentage < 60) {
                this.sanityBar.fillColor = 0xffff00; // Yellow for medium sanity
            } else {
                this.sanityBar.fillColor = 0x00ff00; // Green for high sanity
            }
        }
    }
}