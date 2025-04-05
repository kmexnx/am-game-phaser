class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Dark background
        this.add.image(400, 300, 'title-background');

        // Game title with gothic style
        const title = this.add.text(400, 100, 'NO MOUTH TO SCREAM', {
            fontFamily: 'monospace',
            fontSize: 48,
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Add ripple effect to title
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Game explanation
        const storyText = this.add.text(400, 180, 
            'AM, the supercomputer, has trapped you in its virtual world.\n' +
            'Find 5 components to build an escape terminal.\n' +
            'Maintain your sanity while avoiding AM.', {
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        // Menu buttons
        const startButton = this.add.text(400, 280, 'Start Game', {
            fontFamily: 'monospace',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const controlsButton = this.add.text(400, 330, 'Controls', {
            fontFamily: 'monospace',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const creditsButton = this.add.text(400, 380, 'Credits', {
            fontFamily: 'monospace',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Button interactions
        startButton.on('pointerover', () => {
            startButton.setColor('#ff0000');
        });
        startButton.on('pointerout', () => {
            startButton.setColor('#ffffff');
        });
        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Similar for other buttons
        controlsButton.on('pointerover', () => controlsButton.setColor('#ff0000'));
        controlsButton.on('pointerout', () => controlsButton.setColor('#ffffff'));
        controlsButton.on('pointerdown', () => this.showControls());
        
        creditsButton.on('pointerover', () => creditsButton.setColor('#ff0000'));
        creditsButton.on('pointerout', () => creditsButton.setColor('#ffffff'));
        creditsButton.on('pointerdown', () => this.showCredits());

        // Music is commented out for now to avoid errors
        // this.playMusic();
        
        // Create dialog system for information
        this.infoBox = this.add.rectangle(400, 300, 600, 350, 0x000000, 0.9)
            .setVisible(false);
        
        this.infoText = this.add.text(400, 300, '', {
            fontFamily: 'monospace',
            fontSize: 16,
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 580 }
        }).setOrigin(0.5).setVisible(false);
        
        this.closeButton = this.add.text(650, 150, 'X', {
            fontFamily: 'monospace',
            fontSize: 20,
            color: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.hideInfo())
        .setVisible(false);
    }
    
    playMusic() {
        // Commented to avoid errors with audio files
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
    
    showControls() {
        const controlsText = 
            'CONTROLS\n\n' +
            'Arrow Keys: Move character\n' +
            'ESC: Return to main menu\n\n' +
            'OBJECTIVE\n\n' +
            'Collect 5 components to activate the escape portal.\n' +
            'Avoid AM, getting close will reduce your sanity.\n' +
            'If your sanity reaches 0, you will lose control.';
            
        this.showInfo(controlsText);
    }
    
    showCredits() {
        const creditsText = 
            'CREDITS\n\n' +
            'Based on "I Have No Mouth, and I Must Scream"\n' +
            'by Harlan Ellison\n\n' +
            'Developed with Phaser 3\n\n' +
            '© 2025 - All rights reserved';
            
        this.showInfo(creditsText);
    }
    
    showInfo(text) {
        this.infoBox.setVisible(true);
        this.infoText.setText(text).setVisible(true);
        this.closeButton.setVisible(true);
    }
    
    hideInfo() {
        this.infoBox.setVisible(false);
        this.infoText.setVisible(false);
        this.closeButton.setVisible(false);
    }
}