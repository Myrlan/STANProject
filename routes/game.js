
        function Slime(game,x,y){
            Phaser.Sprite.call(this, game, x, y, 'slime');
            this.anchor.set(0.5);
            this.animations.add('up', [0, 1, 2,3,4,5,6,7,8], 8, true);
            this.animations.add('down', [0, 1, 2,3,4,5,6,7,8], 8, true);
            this.animations.add('left', [0, 1, 2,3,4,5,6,7,8], 8, true);
            this.animations.add('right', [0, 1, 2,3,4,5,6,7,8], 8, true);
            this.animations.add('static', [10,11,12], 8, true);
            this.animations.play('static')

            this.game.physics.enable(this);
            this.body.velocity.x = Spider.SPEED;
            this.body.velocity.y = Spider.SPEED;
        }
        Slime.prototype = Object.create(Phaser.Sprite.prototype);
        Slime.prototype.constructor = Slime;
        Slime.SPEED=20;
        Slime.prototype.update = function () {
            // check against walls and reverse direction if necessary
            var rdm = getRandomInt(8)
            if (rdm==0) {
                this.body.velocity.x = -Slime.SPEED; // turn left
            }
            else if (rdm==1) {
                th
                is.body.velocity.x = Slime.SPEED; // turn right
            }
            else if (rdm==2) {
                this.body.velocity.y = Slime.SPEED; // turn top
            }
            else if (rdm==3) {
                this.body.velocity.y = -Slime.SPEED; // turn bottom
            }
            else {
                this.body.velocity.x = 0; // turn off
                this.body.velocity.y = 0;
            }
            if(this.body.touching.player){ 
                

            }
        };
var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        // map tiles
        this.load.image('tiles', 'http://localhost:3000/assets/map/spritesheet.png');
        
        // map in json format
        this.load.tilemapTiledJSON('map', 'http://localhost:3000/assets/map/map.json');
        
        // our two characters
        this.load.spritesheet('player', 'http://localhost:3000/assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
        // Monsters
        this.load.spritesheet('player', 'http://localhost:3000/assets/slime.png', { frameWidth: 16, frameHeight: 23 });

    },

    create: function ()
    {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
});

var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {
        // create the map
        var map = this.make.tilemap({ key: 'map' });
        
        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('spritesheet', 'tiles');
        
        // creating the layers
        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        
        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);
        
        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });
        
        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });        


    

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 100, 'player', 6);
        
        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    
        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // where the enemies will be
       // this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
       this.spawns = this.physics.add.group({ classType: slime });
        for(var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            let sprite = new Slime(this.game, x, y);
            this.slime.add(sprite);            
        }        
        // add collider
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
    },
    onMeetEnemy: function(player, zone) {        
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        // shake the world
        //this.cameras.main.shake(300);
        
        // start battle 
    },
    update: function (time, delta)
    {
    //    this.controls.update(delta);
    
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
        }        

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
    
});

var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
var game = new Phaser.Game(config);