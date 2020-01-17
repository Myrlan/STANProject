var slime
var speed = 250
var player
var tirer
var colLayer
var cailloux = []
var inc, inc2
var direction = 'up'
var slimes = []
var isAlive = true
var clavier
var coordonneSlime = [[1440, 320],
  [1568, 480],
  [1440, 640],
  [992, 992],
  [1280, 1056],
  [512, 1152],
  [832, 1408],
  [448, 1536],
  [384, 736]
]
/*
var config1 = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
  scene:{
      preload:preload,
      create:create,
      update:update
  }
}; */

class selectWorld extends Phaser.Scene {
  constructor () {
    super({ key: 'selectWorld' })
  }

  preload () {
    this.load.image('wall', 'http://localhost:3000/images/landscape-menu.jpg')
    this.load.image('fond', 'http://localhost:3000/images/parchemin.jpg')
    this.load.image('start', 'http://localhost:3000/assets/sprites/play.png')
  }

  create () {
    var wallpaper = this.add.sprite(0, 0, 'wall')
    var menu = this.add.sprite(500, 364, 'fond')
    var start = this.add.sprite(490, 364, 'start')
    // start.setBounce();
    game.input.mouse.capture = true
    this.input.on('pointerup', function () {
      console.log('start')

      game.scene.start('niveau1')
      isAlive = true
    }, start)
  }

  update () {

  }
}

class niveau1 extends Phaser.Scene {
  constructor () {
    super({ key: 'niveau1' })
  }

  preload () {
    this.load.image('tileset2', 'http://localhost:3000/assets/map/tileset2.png')
    this.load.tilemapTiledJSON('carte', 'http://localhost:3000/assets/map/map.json')
    this.load.spritesheet('player', 'http://localhost:3000/assets/sprites/hero.png', { frameWidth: 32, frameHeight: 64 })
    this.load.spritesheet('slime', 'http://localhost:3000/assets/sprites/slime.png', { frameWidth: 23, frameHeight: 25 })
    this.load.spritesheet('caillou', 'http://localhost:3000/assets/sprites/rock.png', { frameWidth: 20, frameHeight: 20 })
  }

  create () {
    // Charger la carte
    var map = this.make.tilemap({ key: 'carte' })
    var tiles = map.addTilesetImage('tileset2', 'tileset2')
    console.log(map.layer)
    // charger le sol
    var layer = map.createDynamicLayer('Chemin', tiles, 0, 0, 50, 50)
    var layer2 = map.createDynamicLayer('chemin2', tiles, 0, 0, 50, 50)
    // charger le layer collision
    colLayer = map.createDynamicLayer('Obstable', tiles, 0, 0, 50, 50)
    colLayer.setCollideWorldBounds = true
    // activer la collision avec le joueur
    colLayer.setCollisionByExclusion([-1])

    // création du héro

    player = this.physics.add.sprite(192, 288, 'player')

    player.setCollideWorldBounds(true)// pour pas qu'il sorte de la map
    player.setSize(16, 16, true)
    player.setOffset(8, 48)
    player.setBounce(0)
    // création des monstres

    // collision entre le héro et le layer de collision
    colLayer.setCollisionByProperty({ collides: true })
    colLayer.setCollisionByExclusion([-1])
    this.physics.add.collider(player, colLayer)

    // touche clavier en entrée
    clavier = this.input.keyboard.createCursorKeys()
    // pour pas que le héro sorte de la map
    this.physics.world.bounds.width = map.widthInPixels
    this.physics.world.bounds.height = map.heightInPixels

    // animation du héro
    this.anims.create({
      key: 'walkDown',
      frames: this.anims.generateFrameNames('player', { start: 1, end: 5 }),
      repeat: -1,
      frameRate: 15
    })
    this.anims.create({
      key: 'walkUp',
      frames: this.anims.generateFrameNames('player', { start: 6, end: 11 }),
      repeat: -1,
      frameRate: 15
    })
    this.anims.create({
      key: 'walkLeft',
      frames: this.anims.generateFrameNames('player', { start: 12, end: 17 }),
      repeat: -1,
      frameRate: 15
    })
    this.anims.create({
      key: 'walkRight',
      frames: this.anims.generateFrameNames('player', { start: 18, end: 23 }),
      repeat: -1,
      frameRate: 15
    })

    // gestion de la caméra
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(player)
    this.cameras.main.roundPixels = true

    // groupe de monstre

    this.anims.create({
      key: 'slimeMove',
      frames: this.anims.generateFrameNames('slime', { start: 9, end: 18 }),
      repeat: -1,
      frameRate: 10
    })
    this.anims.create({
      key: 'slimeStop',
      frames: this.anims.generateFrameNames('slime', { start: 9, end: 11 }),
      repeat: -1,
      frameRate: 6
    })

    for (var i = 0; i < 8; i++) {
      slime = this.physics.add.sprite(coordonneSlime[i][0], coordonneSlime[i][1], 'slime')
      slime.aLive = true
      slime.setBounce(0)
      slime.setCollideWorldBounds(true)
      slime.setSize(25, 25, true)
      this.physics.add.collider(slime, colLayer)
      slime.setVelocityX(0)
      slime.setVelocityY(0)
      slimes.push(slime)
      var caillou
    }
    this.tirer = function (player) {
      var coefDirX = 0
      var coefDirY = 1
      if (player.direction == 'left') { coefDirX = -1; coefDirY = 0 } else if (player.direction == 'right') { coefDirX = 1, coefDirY = 0 } else if (player.direction == 'up') { coefDirY = -1; coefDirX = 0 } else if (player.direction == 'down') { coefDirY = 1; coefDirX = 0 } else { coefDirY = 1; coefDirX = 0 }
      // on crée la balle a coté du joueur

      this.caillou = this.physics.add.sprite(player.x + (25 * coefDirX), player.y + (25 * coefDirY), 'caillou')
      // parametres physiques de la balle.
      this.caillou.setBounce(0)
      this.caillou.setCollideWorldBounds(true)
      this.physics.add.collider(this.caillou, colLayer)

      if (player.direction == 'right' || player.direction == 'left') this.caillou.setVelocity(400 * coefDirX, 0)
      else if (player.direction == 'up' || player.direction == 'down') this.caillou.setVelocity(0, 400 * coefDirY)
      else {
        this.caillou.setVelocity(0, 400 * coefDirY)
      } // vitesse en x et en y

      cailloux.push(this.caillou)
    }
  }

  update (delta) {
    var time = delta

    // init

    for (var i = 0; i < slimes.length; i++) {
      var ennemi = slimes[i]

      var absoluteX = ennemi.x - player.x
      var absoluteY = ennemi.y - player.y
      if (absoluteX < 0) absoluteX = -absoluteX
      if (absoluteY < 0) absoluteY = -absoluteY
      var distance = absoluteX + absoluteY
      if (distance <= 200) {
        ennemi.play('slimeMove', true)
        if (ennemi.x < player.x) {
          ennemi.setVelocityX(50)
        } else if (ennemi.x > player.x) {
          ennemi.setVelocityX(-50)
        } else {
          ennemi.setVelocityX(0)
        }

        if (ennemi.y < player.y) {
          ennemi.setVelocityY(50)
        } else if (ennemi.y > player.y) {
          ennemi.setVelocityY(-50)
        } else {
          ennemi.setVelocityY(0)
        }
      } else {
        ennemi.setVelocityX(0)
        ennemi.setVelocityY(0)
        ennemi.play('slimeStop', true)
      }
      this.physics.collide(cailloux, ennemi, function () {
        ennemi.destroy()
        slimes.splice(i, 1)
      })
      console.log(slimes.length)
    }

    this.physics.collide(player, slimes, function () {
      console.log('game over')
      player.destroy()
      isAlive = false
      inc2 = time
    })

    if (isAlive) {
      player.setVelocityY(0)
      player.setVelocityX(0)

      if (clavier.up.isDown) {
        player.setVelocityY(-speed)
        player.play('walkUp', true)
        player.direction = 'up'
      } else if (clavier.down.isDown) {
        player.setVelocityY(speed)
        player.play('walkDown', true)
        player.direction = 'down'
      } else if (clavier.left.isDown) {
        player.setVelocityX(-speed)
        player.play('walkLeft', true)
        player.direction = 'left'
      } else if (clavier.right.isDown) {
        player.setVelocityX(speed)
        player.play('walkRight', true)
        player.direction = 'right'
      } else if (player.anims.currentAnim) {
        player.anims.pause(player.anims.currentAnim.frames[0])
      }
      if (clavier.space.isDown) {
        if (cailloux[0] == null) {
          this.tirer(player)
          inc = time
          console.log('delta: ' + time + 'inc :' + inc)
        }
      }
      console.log(time + '   ' + inc)
    } else {
      if ((inc2 + 2000) <= time) {
        // game.scene.resume("niveau1");
        game.scene.start('gameOver')
      }
    }
    if (cailloux[0] != null) {
      for (i = 0; i < cailloux.length; i++) {
        var tire = cailloux[i]
        if ((inc + 500) <= time) {
          tire.destroy()
          cailloux.splice(i)
        }
      }
    }
  }
}

class gameOver extends Phaser.Scene {
  constructor () {
    super({ key: 'gameOver' })
  }

  preload () {
    this.load.image('wall', 'http://localhost:3000/images/landscape-menu.jpg')
    this.load.image('fond', 'http://localhost:3000/images/parchemin.jpg')
    this.load.image('start', 'http://localhost:3000/assets/sprites/gameover.png')
  }

  create () {
    var wallpaper = this.add.sprite(0, 0, 'wall')
    var menu = this.add.sprite(500, 364, 'fond')
    var start = this.add.sprite(490, 364, 'start')
    // start.setBounce();
    game.input.mouse.capture = true
    this.input.on('pointerup', function () {
      console.log('start')
      game.scene.stop('gameOver')
      game.scene.start('selectWorld')
    }, start)
  }
}
window.onload = function () {
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [selectWorld, niveau1, gameOver]
  }
  game = new Phaser.Game(config)
  game.scene.start('selectWorld')
}
