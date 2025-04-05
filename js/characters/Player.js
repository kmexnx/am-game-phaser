class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Physical configuration
        this.setCollideWorldBounds(true);
        this.body.setSize(32, 48);
        
        // Player properties
        this.speed = 150;
        this.health = 100;
        this.sanity = 100;
        this.isMoving = false;
        
        // Sound effects (commented to avoid errors)
        // this.screamSound = scene.sound.add('sound-scream');
    }
    
    update(cursors) {
        // Reset velocity
        this.body.setVelocity(0);
        this.isMoving = false;
        
        // Horizontal movement
        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.isMoving = true;
            if (this.flipX !== true) this.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.isMoving = true;
            if (this.flipX !== false) this.setFlipX(false);
        }
        
        // Vertical movement
        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.speed);
            this.isMoving = true;
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.speed);
            this.isMoving = true;
        }
        
        // Normalize diagonal velocity
        if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
            this.body.velocity.normalize().scale(this.speed);
        }
        
        // Animations - Commented temporarily to avoid errors
        // We simply change the texture instead of using animations
        if (this.isMoving) {
            // Avoid using animations for now
            // this.anims.play('walk-down', true);
        } else {
            // Avoid stopping animations that aren't working
            // this.anims.stop();
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    
    reduceSanity(amount) {
        this.sanity -= amount;
        // Check if sanity has reached 0
        if (this.sanity <= 0) {
            this.loseSanity();
            return true; // Indicates player has lost all sanity
        }
        return false; // Sanity still above 0
    }
    
    die() {
        // Player death logic
        this.scene.scene.restart();
    }
    
    loseSanity() {
        // Lose sanity - nightmare scene
        // Sound playback commented
        // this.screamSound.play();
        
        // Visual distortion effect
        this.scene.cameras.main.shake(500, 0.05);
        this.scene.showDialog('AM: I HAVE YOU NOW...');
        
        // Game scene will handle defeat
    }
}