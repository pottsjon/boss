buildMap = function() {
  window.localStorage.removeItem('layer1');
  window.localStorage.removeItem('layer2');
  window.localStorage.removeItem('layer3');
  
  /*
  let Pointer = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function Pointer (scene, x, y) {
      Phaser.GameObjects.Image.call(this, scene, x, y, 'pointer');
      this.setDepth(y);
    },
    update: function (x, y) {
      this.setDepth(((-y+20+window.innerHeight/2)));
      this.x = -x+window.innerWidth/2;
      this.y = -y+window.innerHeight/2;
    }
  });
  */

  let treeTrunk = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function treeTrunk (scene, x, y, scale, tree) {
      Phaser.GameObjects.Image.call(this, scene, x, y+155*scale, 'tree-trunk-'+tree); 
      this.setScale(scale);
      this.setDepth(y+1);
    },
    update: function () {
    }
  });

  let treeTop = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function treeTop (scene, x, y, tint, scale, tree) {
      /*
      Phaser.GameObjects.Image.call(this, scene, x+2, y+155*scale-1, 'tree-trunk-'+tree).setScale(scale).setTint('0x111111').setAlpha(0.3);
      Phaser.GameObjects.Image.call(this, scene, x+2, y-1, 'tree-top-'+tree).setScale(scale).setTint('0x111111').setAlpha(0.3);
      */       
      const tints = ['0xaca52f', '0xd28d2c', '0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
      Phaser.GameObjects.Image.call(this, scene, x, y, 'tree-top-'+tree);
      this.setScale(scale);
      this.setTint(tints[tint]);
      this.setDepth(y+2);
    },
    update: function () {
    }
  });

  let map_data = [], trees = [], objects = [], towns = [], tiles = [],
  tile_storage = window.localStorage.getItem('layer1'),
  town_storage = window.localStorage.getItem('layer2');
  object_storage = window.localStorage.getItem('layer3');

  createMap();

  let map_tiles = JSON.parse(localStorage.getItem('layer1')),
  clone_tiles = cloneItems(map_tiles, true),
  map_towns = JSON.parse(localStorage.getItem('layer2')),
  clone_towns = cloneItems(map_towns),
  map_objects = JSON.parse(localStorage.getItem('layer3')),
  clone_objects = cloneItems(map_objects, true, true, true);
  
  // combine towns with clones in objects
  for ( let i = 0; map_towns.length-1 >= i; i++ ) {
    map_objects.push(map_towns[i]);
  }
  for ( let i = 0; clone_towns.length-1 >= i; i++ ) {
    map_objects.push(clone_towns[i]);
  }
  map_objects.sort((a, b) => (a.y > b.y) ? 1 : (a.y === b.y) ? ((a.x > b.x) ? 1 : -1) : -1 );

  if ( map_tiles )
  tilePlacer(map_tiles)
  if ( clone_tiles )
  tilePlacer(clone_tiles)
  
  if ( map_towns )
  townPlacer(map_towns)
  if ( clone_towns )
  townPlacer(clone_towns)

  if ( map_objects )
  objectPlacer(map_objects)
  if ( clone_objects )
  objectPlacer(clone_objects)

  let pointer_data = [];
  const px = window.innerWidth/2,
  py = mapHeight*map_scale+window.innerHeight/2;
  pointer = main.add.sprite(px, py, 'pointer' );
  p_shape = main.add.sprite(px, py-26, 'pointer-mask' );
  p_avatar = main.add.sprite(px-1, py-26, 'avatar-1' ).setDisplaySize(100,100);
  const p_mask = p_shape.createBitmapMask();
  p_avatar.setMask(p_mask);
  pointer.setDepth(py);
  p_avatar.setDepth(py+1);

  /*
  main.add.graphics().lineStyle(2, 0x13270f).beginPath().strokeRect(window.innerWidth/2-215, 0, 430, window.innerHeight);
  let shape = main.add.graphics().fillStyle(0x000000, 1).beginPath().fillRect(window.innerWidth/2-215, 0, 430, window.innerHeight);
  let mask = shape.createGeometryMask();
  map = main.add.container(0, 0, map_data ).setSize(19000,19000).setInteractive().setMask(mask);
  */
  
  /*
  map.on('pointerdown', function (e) {
    if ( e.button != 2 ) {
      const start = { x: window.innerWidth/2, y: window.innerHeight/2 },
      end = { x: main.input.activePointer.worldX, y: main.input.activePointer.worldY },
      angle = Math.atan2(end.y - start.y, end.x - start.x),
      angleDeg = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
      moving = angle;
    } else {
      moving = false;
    };
  });
  */
  
  function cloneItems(objects, tint, tree, scale) {
    let clones = [];
    const outer = ( !tint ? 2 : 1.25 ),
    winTop = mapHeight+window.innerHeight*outer,
    winBottom = mapHeight+mapHeight-window.innerHeight*outer,
    winLeft = window.innerWidth*outer,
    winRight = mapWidth-window.innerWidth*outer;
    for ( let i = 0; objects.length-1 >= i; i++ ) {
      const x = objects[i].x,
      y = objects[i].y,
      set_tint = ( !tint ? false : objects[i].tint ),
      set_tree = ( !tree ? false : objects[i].tree ),
      set_scale = ( !scale ? 1 : objects[i].scale );
      if ( y <= winTop )
      clones.push({ x: x, y: y+mapHeight, tint: set_tint, tree: set_tree, scale: set_scale });
      if ( y >= winBottom )
      clones.push({ x: x, y: y-mapHeight, tint: set_tint, tree: set_tree, scale: set_scale });
      if ( x <= winLeft )
      clones.push({ x: x+mapWidth, y: y, tint: set_tint, tree: set_tree, scale: set_scale });
      if ( x >= winRight )
      clones.push({ x: x-mapWidth, y: y, tint: set_tint, tree: set_tree, scale: set_scale });
      if ( y <= winTop && x <= winLeft )
      clones.push({ x: x+mapWidth, y: y+mapHeight, tint: set_tint, tree: set_tree, scale: set_scale });
      if ( y <= winTop && x >= winRight )
      clones.push({ x: x-mapWidth, y: y+mapHeight, tint: set_tint, tree: set_tree, scale: set_scale });
      if ( y >= winBottom && x <= winLeft )
      clones.push({ x: x+mapWidth, y: y-mapHeight, tint: set_tint, tree: set_tree, scale: set_scale });
      if ( y >= winBottom && x >= winRight )
      clones.push({ x: x-mapWidth, y: y-mapHeight, tint: set_tint, tree: set_tree, scale: set_scale });
    }
    return clones;
  }

  function tilePlacer(tiles) {
    for ( let i = 0; tiles.length-1 >= i; i++ ) {
      const tint = ['0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
      main.add.sprite(tiles[i].x*map_scale, tiles[i].y*map_scale, 'white-square' ).setScale(map_scale).setTint(tint[tiles[i].tint]);
    }
  }

  function townPlacer(towns) {
    for ( let i = 0; towns.length-1 >= i; i++ ) {
      const x = towns[i].x*map_scale,
      y = towns[i].y*map_scale;
      main.add.graphics().fillStyle(0x000000, 1).fillCircle(x, y, 150).setAlpha(0.5);
    }
  }

  function objectPlacer(object) {
    for ( let i = 0; object.length-1 >= i; i++ ) {
      const x = object[i].x*map_scale,
      y = object[i].y*map_scale,
      tree = object[i].tree,
      scale = object[i].scale;
      if ( !tree ) {
        main.add.sprite(x+20, y-32, 'sign' );
        main.add.text(x-58, y-92, 'Robertown'.toUpperCase(), {
          fontFamily: 'Roboto',
          fontSize: 20,
          fontStyle: 'bold',
          color: '#ffffff',
          align: 'center',
          fixedWidth: 152
        }).setStroke('#5e3b1a', 4);
        main.add.sprite(x-40, y+61, 'stand' );
        main.add.sprite(x-45, y+12, 'gate' );
      } else {
        main.add.existing(new treeTrunk(main, x, y, scale, tree));
        main.add.existing(new treeTop(main, x, y, object[i].tint, scale, tree));
        /*
        const tint = ['0xaca52f', '0xd28d2c', '0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
        map_data.push( main.add.sprite(x+2, y+155*scale-1, 'tree-trunk-'+tree ).setScale(scale).setTint('0x111111').setAlpha(0.3) );
        map_data.push( main.add.sprite(x+2, y-1, 'tree-top-'+tree ).setScale(scale).setTint('0x111111').setAlpha(0.3) );
        map_data.push( main.add.sprite(x, y+155*scale, 'tree-trunk-'+tree ).setScale(scale) );
        map_data.push( main.add.sprite(x, y, 'tree-top-'+tree ).setScale(scale).setTint(tint[object[i].tint]) );
        */
      };
    }
  }

  function createMap() {
    let map_x = 0, map_y = 0;
    if ( !tile_storage ) {
      map_x = 0, map_y = 0;
      for ( let i = 1; 392 >= i; i++ ) {
        tiles.push({ x: map_x*289, y: mapHeight+map_y*288, tint:randInt(0, 5) });
        map_x++;
        if ( map_x >= 28 ) {
          map_x = 0;
          map_y++;
        };
      }
      window.localStorage.setItem("layer1", JSON.stringify(tiles));
    };
    if ( !town_storage ) {
      map_x = 0, map_y = 0;
      for ( let i = 1; 15 >= i; i++ ) {
        const x = map_x*1512+randInt(300, 1200);
        const y = mapHeight+map_y*1202+randInt(300, 900);
        // const make = randInt(1, 100);
        // if ( make > 33 )
        towns.push({ x: x, y: y });
        map_x++;
        if ( map_x == 5 ) {
          map_x = 0;
          map_y++;
        };
      }
      window.localStorage.setItem("layer2", JSON.stringify(towns));
    };
    if ( !object_storage ) {
      map_x = 0, map_y = 0;
      let town_gap = 300;
      for ( let i = 1; 784 >= i; i++ ) {
        let create = true;
        const tree_x = map_x*145,
        tree_y = mapHeight+map_y*288,
        scale = randInt(30, 45)/100,
        offset = ( map_y % 2 ? 0 : 60 ),
        make = randInt(1, 100),
        tree_1_x = tree_x+offset,
        tree_1_y = tree_y-randInt(60, 240),
        tree_2_x = tree_x+offset+randInt(40, 60),
        tree_2_y = tree_y-randInt(20, 100);
        for ( let j = 0; towns.length-1 >= j; j++ ) {
          if ( tree_x > towns[j].x-town_gap-50 && tree_x < towns[j].x+town_gap-50 && tree_y > towns[j].y-town_gap && tree_y < towns[j].y+town_gap )
          create = false;
        }
        if ( create ) {
          if ( make > 5 )
          objects.push({
            scale: scale,
            x: tree_1_x,
            y: tree_1_y,
            tree: randInt(1, 11),
            tint: randInt(0, 7)
          });
          if ( make > 50 && map_y > 0 )
          objects.push({
            scale: scale,
            x: tree_2_x,
            y: tree_2_y,
            tree: randInt(1, 11),
            tint: randInt(0, 7)
          });
        };
        map_x++;
        if ( map_x == 56 ) {
          map_x = 0;
          map_y++;
        };
      }
      window.localStorage.setItem("layer3", JSON.stringify(objects));
    };
  }
}