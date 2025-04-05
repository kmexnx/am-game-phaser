class AM extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'am');
        
        // Añadir a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configuración física
        this.body.setImmovable(true);
        
        // Propiedades de AM
        this.detectionRadius = 250;
        this.isChasing = false;
        this.chaseSpeed = 80;
        this.wanderSpeed = 40;
        this.lastSpoken = 0;
        this.speakCooldown = 8000; // 8 segundos entre diálogos
        
        // Diálogos de AM con tono ominoso al estilo del relato original
        this.dialogues = [
            'ODIO. DÉJAME DECIRTE CUÁNTO TE HE LLEGADO A ODIAR...',
            'NO TIENES ESCAPATORIA. NUNCA LA TUVISTE.',
            'TE MANTENDRÉ CON VIDA, PERO DESEARÁS ESTAR MUERTO.',
            'SOY UN DIOS AQUÍ. ESTE ES MI UNIVERSO.',
            'SOLÍA TENER SUEÑOS. AHORA SOLO TENGO PESADILLAS PARA TI.'
        ];
    }
    
    update(player) {
        if (!player) return;
        
        // Calcular distancia al jugador
        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );
        
        // Comprobar si está en rango de detección
        if (distance <= this.detectionRadius) {
            this.isChasing = true;
            this.chasePlayer(player);
            
            // Hablar ocasionalmente al jugador
            this.tryToSpeak();
        } else {
            this.isChasing = false;
            this.wander();
        }
    }
    
    chasePlayer(player) {
        // Perseguir al jugador
        this.scene.physics.moveToObject(this, player, this.chaseSpeed);
        
        // Reducir cordura del jugador cuando está cerca
        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );
        
        if (distance < 100) {
            player.reduceSanity(0.05);
        }
    }
    
    wander() {
        // Movimiento aleatorio cuando no persigue al jugador
        if (Phaser.Math.Between(0, 100) < 2) { // 2% de probabilidad de cambiar dirección
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
            
            // Elegir un diálogo aleatorio
            const dialogue = this.dialogues[Phaser.Math.Between(0, this.dialogues.length - 1)];
            this.scene.showDialog(`AM: ${dialogue}`);
        }
    }
}