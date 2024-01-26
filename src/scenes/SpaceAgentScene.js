import Phaser from "phaser";

// import FallingObject from '../interfaces/FallingObject.js'
// import Laser from '../interfaces/Laser.js'
import ScoreLabel from '../interfaces/ScoreLabel.js'
import LifeLabel from '../interfaces/LifeLabel.js'

export default class SpaceAgentScene extends Phaser.Scene {
    constructor() {
        super('space-agent-scene')
    }

    init() {
        this.clouds = undefined

        this.player = undefined
        // this.playerLife = undefined
        
        this.enemies = undefined
        this.lasers = undefined
        
        this.scoreLabel = undefined
        this.lifeLabel = undefined
        
        this.lifePack = undefined
        this.backsound = undefined
        
        this.nav_left = false
        this.nav_right = false
        this.shoot = false
        
        this.speed = 100
        this.enemySpeed = 60
        this.lastFired = 0
    }

    preload() {
        this.load.image('background', 'images/bg_layer1.png')
        this.load.image('cloud', 'images/cloud.png')
        this.load.image('left-btn', 'images/left-btn.png')
        this.load.image('right-btn', 'images/right-btn.png')
        this.load.image('shoot-btn', 'images/shoot-btn.png')

        this.load.spritesheet('player', 'images/ship.png',
            {frameWidth:66, frameHeight:66}
        )

        this.load.audio('lifePackSound','sfx/life.mp3')
        this.load.audio('backsound', 'sfx/backsound/SkyFire.ogg')
        this.load.audio('gameOverSound', 'sfx/gameover.wav')
    }

    create() {
        const gameWidth = this.scale.width * 0.5
        const gameHeight = this.scale.height * 0.5
        this.add.image(gameWidth, gameHeight, 'background')

        this.clouds = this.physics.add.group({
            key: 'cloud',
            repeat: 20
        })

        Phaser.Actions.RandomRectangle(this.clouds.getChildren(), this.physics.world.bounds);

        this.createButton()

        this.player = this.createPlayer()

        this.scoreLabel = this.createScoreLabel(16, 16, 0)
        this.lifeLabel = this.createLifeLabel(16, 43, 3)

        this.physics.add.overlap(this.player, this.lifePack, this.increaseLife, null, this)
        this.backsound = this.sound.add('backsound')
        var soundConfig = {
            loop: true
        }
        this.backsound.play(soundConfig)
    }

    update(time) {
        this.clouds.children.iterate((child) => {
            // @ts-ignore
            child.setVelocityY(20)

            // @ts-ignore
            if (child.y > this.scale.height){
                // @ts-ignore
                child.x = Phaser.Math.Between(10, 400)
                // @ts-ignore
                child.y = child.displayHeight * -1
            }
        })

        this.movePlayer(this.player, time)
    }

    createButton() {
        this.input.addPointer(3)

        let shoot = this.add.image(320, 550, 'shoot-btn')
            .setInteractive().setDepth(1).setAlpha(0.8)
        let nav_left = this.add.image(50, 550, 'left-btn').setInteractive().setDepth(0.5).setAlpha(0.8)
        let nav_right = this.add.image(nav_left.x + nav_left.displayWidth + 20, 550, 'right-btn').setInteractive().setDepth(0.5).setAlpha(0.8)

        nav_left.on('pointerdown', () => { this.nav_left = true }, this)
        nav_left.on('pointerout', () => { this.nav_left = false}, this)
        nav_right.on('pointerdown', () => { this.nav_right = true }, this)
        nav_right.on('pointerout', () => { this.nav_right = false}, this)
        shoot.on('pointerdown', () => { this.shoot = true }, this)
        shoot.on('pointerout', () => { this.shoot = false}, this)
    }

    createPlayer()
    {
        const player = this.physics.add.sprite(200, 450, 'player')
        player.setCollideWorldBounds(true)

        this.anims.create({
            key: 'turn',
            frames:[ { key: 'player', frame: 0 } ],
        })

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {start: 1, end: 2}),
            frameRate: 10
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {start:1, end:2}),
            frameRate: 10
        })
        return player
    }

    movePlayer(player, time)
    {
        if (this.nav_left){
            this.player.setVelocityX(this.speed * -1)
            this.player.anims.play('left', true)    
            this.player.setFlipX(false)
        } else if (this.nav_right){
            this.player.setVelocityX(this.speed)
            this.player.anims.play('right', true)
            this.player.setFlipX(true)
        } else {
            this.player.setVelocityX(0)
            this.player.anims.play('turn')
        }

        if ((this.shoot) && time > this.lastFired){
            const laser = this.lasers.get(0, 0, 'laser')
            if(laser){
                laser.fire(this.player.x, this.player.y)
                this.lastFired = time + 150
                this.sound.play('laserSound')
            }
        }
    }

    createScoreLabel(x, y, score)
    {
        const style = { fontSize: '32px', fill: '#000' }
        const label = new ScoreLabel(this, x, y, score, style).setDepth(1)

        this.add.existing(label)

        return label
    }

    createLifeLabel(x, y, life)
    {
        const style = { fontSize: '32px', fill: '#000'}
        const label = new LifeLabel(this, x, y, life, style)

        this.add.existing(label)

        return label
    }

    decreaseLife(player, enemy)
    {
        enemy.die()
        this.lifeLabel.subtract(1)

        if (this.lifeLabel.getLife() == 2){
            player.setTint(0xff0000)
        } else if (this.lifeLabel.getLife() == 1){
            player.setTint(0xff0000).setAlpha(0.2)
        } else if (this.lifeLabel.getLife() == 0) {
            this.scene.start('game-over-scene', { score: this.scoreLabel.getScore() })
            this.sound.stopAll()
            this.sound.play('gameOverSound')
        }

    }

    increaseLife(player, lifePack)
    {
        lifePack.die()
        this.lifeLabel.add(1)
        this.sound.play('lifePackSound')
        if (this.lifeLabel.getLife() >= 3) {
            player.clearTint().setAlpha(2)
        }
    }
}