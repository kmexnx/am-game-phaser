class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        // Añadir a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configuración física
        this.setCollideWorldBounds(true);
        this.body.setSize(32, 48);
        
        // Propiedades del jugador
        this.speed = 150;
        this.health = 100;
        this.sanity = 100;
        this.isMoving = false;
        
        // Efectos de sonido (comentados para evitar errores)
        // this.screamSound = scene.sound.add('sound-scream');
    }
    
    update(cursors) {
        // Reiniciar velocidad
        this.body.setVelocity(0);
        this.isMoving = false;
        
        // Movimiento horizontal
        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.isMoving = true;
            if (this.flipX !== true) this.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.isMoving = true;
            if (this.flipX !== false) this.setFlipX(false);
        }
        
        // Movimiento vertical
        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.speed);
            this.isMoving = true;
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.speed);
            this.isMoving = true;
        }
        
        // Normalizar velocidad diagonal
        if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
            this.body.velocity.normalize().scale(this.speed);
        }
        
        // Animaciones - Comentadas temporalmente para evitar errores
        // Simplemente cambiamos la textura en lugar de usar animaciones
        if (this.isMoving) {
            // Evitamos usar animaciones por ahora
            // this.anims.play('walk-down', true);
        } else {
            // Evitamos detener animaciones que no están funcionando
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
        if (this.sanity <= 0) {
            this.loseSanity();
        }
    }
    
    die() {
        // Lógica de muerte del jugador
        this.scene.scene.restart();
    }
    
    loseSanity() {
        // Perder cordura - escena de pesadilla
        // Comentada la reproducción de sonido
        // this.screamSound.play();
        
        // Efecto visual de distorsión
        this.scene.cameras.main.shake(500, 0.05);
        this.scene.showDialog('AM: TE TENGO EN MI PODER AHORA...');
    }
}