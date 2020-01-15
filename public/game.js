

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
  
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var slime;
var speed=500;
var player;
var game = new Phaser.Game(config1);
var slimes=[];
var isAlive=true;
var coordonneSlime=[[1440,320],
                    [1568,480],
                    [1440,640],
                    [992,992],
                    [1280,1056],
                    [512,1152],
                    [832,1408],
                    [448,1536],
                    [384,736]
];


function preload ()
{
    this.load.image('tileset2', 'http://localhost:3000/assets/map/tileset2.png');
    this.load.tilemapTiledJSON('carte', 'http://localhost:3000/assets/map/map.json');
    this.load.spritesheet('player', 'http://localhost:3000/assets/sprites/hero.png',{ frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('slime', 'http://localhost:3000/assets/sprites/slime.png',{ frameWidth: 23, frameHeight: 25 });
}

function create ()
{
    //Charger la carte
    map = this.make.tilemap({ key: 'carte' });
    var tiles = map.addTilesetImage('tileset2', 'tileset2');
    console.log(map.layer);
    //charger le sol
    layer = map.createDynamicLayer("Chemin", tiles, 0, 0,50,50);
    layer2 = map.createDynamicLayer("chemin2", tiles, 0, 0,50,50);
    //charger le layer collision
    colLayer = map.createDynamicLayer("Obstable", tiles, 0, 0,50,50);
    colLayer.setCollideWorldBounds=true;
    //activer la collision avec le joueur
    colLayer.setCollisionByExclusion([-1]);
    

    //création du héro

    player = this.physics.add.sprite(192, 288, 'player');
   
    player.setCollideWorldBounds(true);//pour pas qu'il sorte de la map
    player.setSize(16,16);
    player.setOffset(8,48);
    player.setBounce(16,16);
    //création des monstres


    //collision entre le héro et le layer de collision
    colLayer.setCollisionByProperty({collides: true}); 
    colLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(player, colLayer);

    //touche clavier en entrée
    clavier=this.input.keyboard.createCursorKeys();
    // pour pas que le héro sorte de la map
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    
    //animation du héro
    this.anims.create({
        key:'walkDown',
        frames: this.anims.generateFrameNames('player',{start:1, end:5}),
        repeat:-1,
        frameRate:15
        });
    this.anims.create({
        key:'walkUp',
        frames: this.anims.generateFrameNames('player',{start:6, end:11}),
        repeat:-1,
        frameRate:15
        });    
    this.anims.create({
        key:'walkLeft',
        frames: this.anims.generateFrameNames('player',{start:12, end:17}),
        repeat:-1,
        frameRate:15
        });
    this.anims.create({
        key:'walkRight',
        frames: this.anims.generateFrameNames('player',{start:18, end:23}),
        repeat:-1,
        frameRate:15
        });

        //gestion de la caméra
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player);
        this.cameras.main.roundPixels=true;

        //groupe de monstre
        

        this.anims.create({
            key:'slimeMove',
            frames: this.anims.generateFrameNames('slime',{start:9, end:18}),
            repeat:-1,
            frameRate:10
            });
        this.anims.create({
            key:'slimeStop',
            frames: this.anims.generateFrameNames('slime',{start:9, end:11}),
            repeat:-1,
            frameRate:6
            });
        
        
        for(var i=0; i< 8; i++){

            slime = this.physics.add.sprite(coordonneSlime[i][0],coordonneSlime[i][1], 'slime');
            
            slime.setBounce(1,1);
            slime.setCollideWorldBounds(true);
            this.physics.add.collider(slime, colLayer);
            var touche = this.physics.add.collider(slime, player);
            slimes.push(slime);
           
        }
        

 }   
function update ()
{
    //init
    
    for(var i=0; i< slimes.length; i++){
        ennemi=slimes[i];


        var absoluteX=ennemi.x-player.x;
        var absoluteY=ennemi.y-player.y;
        if(absoluteX<0) absoluteX= -absoluteX;
        if(absoluteY<0) absoluteY= -absoluteY;
        distance=absoluteX+absoluteY;
        if(distance<=200){
            ennemi.play('slimeMove',true);
            if(ennemi.x<player.x){
                ennemi.setVelocityX(50);
            }
            else if(ennemi.x>player.x){
                ennemi.setVelocityX(-50);
            }
            else{
                ennemi.setVelocityX(0);
            }
    
            if(ennemi.y<player.y){
                ennemi.setVelocityY(50);
            }
            else if(ennemi.y>player.y){
                ennemi.setVelocityY(-50);
            }
            else{
                ennemi.setVelocityY(0);
            }
        }
        else{
            ennemi.setVelocityX(0);
            ennemi.setVelocityY(0);
            ennemi.play('slimeStop',true);
        }
        

            
        }

  
        this.physics.collide(slimes, player,function(){
            console.log('game over');
            isAlive=false;
            player.destroy();
        });



    if(isAlive){
        player.setVelocityY(0);
        player.setVelocityX(0);
    
        if(clavier.up.isDown){
            player.setVelocityY(-speed);
            player.play("walkUp",true);
            
            
        }
        else if(clavier.down.isDown){
            player.setVelocityY(speed);
            player.play("walkDown",true);
        }
        else if(clavier.left.isDown){
            player.setVelocityX(-speed);
            player.play("walkLeft",true);
        }
        else if(clavier.right.isDown){
            player.setVelocityX(speed);
            player.play("walkRight",true);
        }
        else if(player.anims.currentAnim){
        
            player.anims.pause(player.anims.currentAnim.frames[0]);
        }
    }
}


