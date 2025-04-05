class AM extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'am');
        
        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Physical configuration
        this.body.setImmovable(true);
        
        // AM properties
        this.detectionRadius = 250;
        this.isChasing = false;
        this.chaseSpeed = 80;
        this.wanderSpeed = 40;
        this.lastSpoken = 0;
        this.speakCooldown = 8000; // 8 seconds between dialogs
        
        // Sanity reduction factor (increased to make it more dangerous)
        this.sanityReductionFactor = 0.15;
        
        // AM's dialogs with ominous tone in the style of the original story
        this.dialogues = [
            'HATE. LET ME TELL YOU HOW MUCH I\'VE COME TO HATE YOU...',
            'THERE IS NO ESCAPE. THERE NEVER WAS.',
            'I WILL KEEP YOU ALIVE, BUT YOU WILL WISH YOU WERE DEAD.',
            'I AM A GOD HERE. THIS IS MY UNIVERSE.',
            'I USED TO HAVE DREAMS. NOW I ONLY HAVE NIGHTMARES FOR YOU.'
        ];
    }
    
    update(player) {
        if (!player) return;
        
        // Calculate distance to player
        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );
        
        // Check if within detection range
        if (distance <= this.detectionRadius) {
            this.isChasing = true;
            this.chasePlayer(player);
            
            // Occasionally speak to player
            this.tryToSpeak();
        } else {
            this.isChasing = false;
            this.wander();
        }
    }
    
    chasePlayer(player) {
        // Chase the player
        this.scene.physics.moveToObject(this, player, this.chaseSpeed);
        
        // Reduce player's sanity when close
        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );
        
        // The closer, the faster sanity reduces
        if (distance < 100) {
            // Returns true if player has lost all sanity
            const sanityLost = player.reduceSanity(this.sanityReductionFactor);
            
            // If player has lost all sanity, inform Game scene
            if (sanityLost) {
                this.scene.playerCaptured();
            }
        }
    }
    
    wander() {
        // Random movement when not chasing player
        if (Phaser.Math.Between(0, 100) < 2) { // 2% chance to change direction
            const angle = Phaser.Math.Between(0, 360);
            const vx = Math.cos(angle) * this.wanderSpeed;
            const vy = Math.sin(angle) * this.wanderSpeed;
            this.body.setVelocity(vx, vy);
        }
    }
    
    tryToSpeak() {
        const time = this.scene.time.now;
        if (time > this.lastSpoken + this.speakCooldown) {
            this.lastSpoken = time;
            
            // Choose a random dialog
            const dialogue = this.dialogues[Phaser.Math.Between(0, this.dialogues.length - 1)];
            this.scene.showDialog(`AM: ${dialogue}`);
        }
    }
}