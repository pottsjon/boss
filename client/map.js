updateMap = function() {
  posx -= Math.cos(moving)*.6;
  posy -= Math.sin(moving)*.6;
  const formx = -posx+window.innerWidth/2,
  formy = -posy+window.innerHeight/2,
  setx = -mapWidth*map_scale+window.innerWidth/2,
  sety = -mapHeight*map_scale+window.innerHeight/2;
  if ( arrow ) {
    arrow.x = formx;
    arrow.y = formy;
  }
  p_avatar.setDepth(formy+1);
  pointer.setDepth(formy);
  p_avatar.x = formx-1;
  p_avatar.y = formy-106;
  p_shape.x = formx;
  p_shape.y = formy-106;
  pointer.x = formx;
  pointer.y = formy-80;
  map_overlay.x = -posx;
  map_overlay.y = -posy;
  coords.text = Math.floor(-posx)+' , '+Math.floor(-posy);
  main.cameras.main.scrollX = -posx;
  main.cameras.main.scrollY = -posy;
  if ( posx > window.innerWidth/2 )
  posx = setx;
  if ( posy > sety )
  posy = -mapHeight*map_scale+sety;
  if ( posx < setx  )
  posx = window.innerWidth/2;
  if ( posy < -mapHeight*map_scale+sety  )
  posy = sety;
}

buildMap = function() {
  map_scale = 0.5,
  mapWidth = 8092,
  mapHeight = 4032,
  arrow = false,
  moving = false,
  dragging = false,
  previous = false,
  velocity = 0;

  posx = 0,
  posy = -mapHeight*map_scale;

  let start, end, angle, angleDeg,
  overlay_data = [];

  const container_width = 850,
  prep_scale = ( window.innerWidth < container_width ? window.innerWidth/container_width : 1 ),
  scale = ( window.innerWidth >= 500 ? 500/container_width : prep_scale ),
  offset = (window.innerWidth-(container_width*scale))/2;

  window.localStorage.removeItem('layer1');
  window.localStorage.removeItem('layer2');
  window.localStorage.removeItem('layer3');

  let map_data = [], trees = [], objects = [], towns = [], tiles = [],
  tile_storage = window.localStorage.getItem('layer1'),
  town_storage = window.localStorage.getItem('layer2'),
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
  pointer = main.add.sprite(px, py-80, 'pointer' );
  p_shape = main.add.sprite(px, py-106, 'pointer-mask' );
  p_avatar = main.add.sprite(px-1, py-106, 'avatar-1' ).setDisplaySize(100,100);
  const p_mask = p_shape.createBitmapMask();
  p_avatar.setMask(p_mask);
  p_avatar.setDepth(py+1);
  pointer.setDepth(py);

  /*
  main.add.graphics().lineStyle(2, 0x13270f).beginPath().strokeRect(window.innerWidth/2-215, 0, 430, window.innerHeight);
  let shape = main.add.graphics().fillStyle(0x000000, 1).beginPath().fillRect(window.innerWidth/2-215, 0, 430, window.innerHeight);
  let mask = shape.createGeometryMask();
  map = main.add.container(0, 0, map_data ).setSize(19000,19000).setInteractive().setMask(mask);
  */

  overlay_data.push( main.add.tileSprite(offset, window.innerHeight/2, window.innerWidth/2, window.innerHeight, 'stone-light-blue').setTileScale(0.5).setOrigin(1,0.5) );
  overlay_data.push( main.add.tileSprite(window.innerWidth-offset, window.innerHeight/2, window.innerWidth/2, window.innerHeight, 'stone-light-blue').setTileScale(0.5).setOrigin(0,0.5) );

  overlay_data.push( main.add.graphics().fillStyle(0x000000, 0.4).fillRoundedRect(window.innerWidth/2-67, window.innerHeight-100, 134, 40, 5) );
  overlay_data.push( coords = main.add.text(window.innerWidth/2-67, window.innerHeight-92, Math.floor(-posx)+' , '+Math.floor(-posy), {
    fontFamily: 'Roboto',
    fontSize: 15,
    fontStyle: 'bold',
    color: '#ffffff',
    align: 'center',
    fixedWidth: 134
  }).setStroke('#1119', 4) );

  let topper = [],
  btn_elements = [],
  topper_data = [];

  // topper
  topper.push( main.add.sprite(0, 40, 'wooden-topper' ) );

  // menu button in topper
  menu_button = main.add.sprite(0, 0, 'square-brown' ).setInteractive({ cursor: 'pointer' });
  menu_icon = main.add.sprite(0, -3, 'menu-icon' );
  btn_elements.push( menu_button );
  btn_elements.push( menu_icon );    
  topper.push( main.add.container(325, 45, btn_elements ) );

  // city name in topper
  topper_data.push( main.add.sprite(120, 0, 'city-name-tag' ) );
  topper_data.push( main.add.text(-45, -23, 'BERGTON', {
    fontFamily: 'Roboto',
    fontSize: 38,
    color: '#ffffff',
    align: 'center',
    fixedWidth: 330
  }) );

  // population in topper
  topper_data.push( main.add.sprite(370, 4, 'pill-brown' ) );
  topper_data.push( main.add.text(300, -40, 'Population', {
    fontFamily: 'Roboto',
    fontSize: 22,
    color: '#ffffff',
    align: 'center',
    fixedWidth: 140
  }).setStroke('#443024', 6));
  topper_data.push( main.add.text(300, -15, '128', {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontStyle: 'bold',
    color: '#ffffff',
    align: 'center',
    fixedWidth: 140
  }).setStroke('#3a2519', 6));

  // current visitors in topper
  topper_data.push( main.add.sprite(525, 4, 'pill-brown' ) );
  topper_data.push( main.add.text(455, -40, 'Currently', {
    fontFamily: 'Roboto',
    fontSize: 22,
    color: '#ffffff',
    align: 'center',
    fixedWidth: 140
  }).setStroke('#443024', 6));
  topper_data.push( main.add.text(455, -15, '8', {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontStyle: 'bold',
    color: '#ffffff',
    align: 'center',
    fixedWidth: 140
  }).setStroke('#3a2519', 6));
  topper.push( main.add.container(-320, 43, topper_data ) );

  overlay_data.push( main.add.container(window.innerWidth/2, 0, topper ).setScale(scale,scale) );

  map_overlay = main.add.container(-posx, -posy, overlay_data).setDepth(1000000);

  main.cameras.main.setSize(mapWidth*map_scale, mapHeight*map_scale);
  main.cameras.main.scrollY = mapHeight*map_scale;

  menu_button.on('pointerdown', function (e) {
    moving = false;
    main.scene.transition({ target: 'SceneB', duration: 1000 });
  });

  /*
  main.input.on('pointerdown', function (e) {
    if ( e.button != 2 ) {
      overCount();
      arrow.setAngle(angleDeg);
    } else {
      moving = false;
    };
  });

  main.input.on('pointerup', function (e) {
    if ( e.button != 2 ) {
      overCount();
      moving = angle;
    } else {
      moving = false;
    };
  });  
  */

  main.input.on('pointermove', function (e) {
    overCount();
    arrow.setAngle(angleDeg);
  });

  // adds and clears indicating arrow for movement
  let over_to, arrow_large;
  function overCount() {
    findAngle()
    const size = ( ( angleDeg <= -45 && angleDeg >= -135 ) || ( angleDeg >= 45 && angleDeg <= 135 ) ? 1 : 0.75 );
    if ( size == 1 )
    arrow_large = true;
    if ( !arrow )
    arrow = main.add.sprite(-posx+window.innerWidth/2, -posy+window.innerHeight/2, 'arrow' ).setTint('0x62c466').setAlpha(0.5).setOrigin(0, 0.5).setScale(size);
    try { Meteor.clearTimeout(over_to) } catch(e) { };
    over_to = Meteor.setTimeout(function(){
      if ( arrow )
      fadeArrow()
    }, 1000);
  }

  function scaleArrow(from, to) {
    main.tweens.addCounter({
      from: from,
      to: to,
      duration: 200,
      yoyo: false,
      repeat: 0,
      onUpdate: function (tween) {
        if ( arrow )
        arrow.setScale(tween.getValue());
      }
    });
  }

  function findAngle() {
    start = { x: -posx+window.innerWidth/2, y: -posy+window.innerHeight/2 },
    end = { x: main.input.activePointer.worldX, y: main.input.activePointer.worldY },
    angle = Math.atan2(end.y - start.y, end.x - start.x),
    angleDeg = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
    if ( ( ( angleDeg <= -45 && angleDeg >= -135 ) || ( angleDeg >= 45 && angleDeg <= 135 ) ) && !arrow_large && arrow ) {
      arrow_large = true;
      scaleArrow(0.75, 1);
    } else if ( ( ( angleDeg > -45 && angleDeg < 0 ) || angleDeg < -135 || ( angleDeg < 45 && angleDeg > 0 ) || angleDeg > 135 ) && arrow_large && arrow ) {
      arrow_large = false;
      scaleArrow(1, 0.75);
    };
  }

  function fadeArrow() {
    main.tweens.addCounter({
      from: 5,
      to: 0,
      duration: 500,
      yoyo: false,
      repeat: 0,
      onUpdate: function (tween) {
        let t = tween.getValue();
        if ( arrow ) {
          arrow.setAlpha(t/10);
          if ( t == 0 ) {
            arrow.destroy();
            arrow = false;
            over = false;
          };
        };
      }
    });
  }
  
  // MOVE TO SERVER - used during initial map creation
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
          if ( tree_x > towns[j].x-town_gap-50 && tree_x < towns[j].x+town_gap-50 && tree_y > towns[j].y-town_gap+150 && tree_y < towns[j].y+town_gap+150 )
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
      main.add.sprite(tiles[i].x*map_scale, tiles[i].y*map_scale, 'white-square' ).setScale(map_scale).setTint(tint[tiles[i].tint]).setInteractive({ cursor: 'pointer' }).on('pointerdown', function (e) {
        if ( e.button != 2 ) {
          overCount();
          arrow.setAngle(angleDeg);
        } else {
          moving = false;
        };
      }).on('pointerup', function (e) {
        if ( e.button != 2 ) {
          overCount()
          moving = angle;
        } else {
          moving = false;
        };
      });
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
        const tint = ['0xaca52f', '0xd28d2c', '0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
        main.add.sprite(x+2, y, 'tree-trunk-'+tree ).setScale(scale).setTint('0x000000').setAlpha(0.4).setDepth(y);
        main.add.sprite(x+2, y-155*scale, 'tree-top-'+tree ).setScale(scale).setTint('0x000000').setAlpha(0.4).setDepth(y+1);
        main.add.sprite(x, y, 'tree-trunk-'+tree ).setScale(scale).setDepth(y);
        main.add.sprite(x, y-155*scale, 'tree-top-'+tree ).setScale(scale).setTint(tint[object[i].tint]).setDepth(y+1);
      };
    }
  }

  // used during map creation process
  let line;
  function addLine() {
    try { line.destroy() } catch(e) { };
    const x11 = -posx+window.innerWidth/2,
    y11 = -posy+window.innerHeight/2,
    x12 = main.input.activePointer.worldX,
    y12 = main.input.activePointer.worldY;
    const int = getIntersection(x11, y11, x12, y12, -posx+mapWidth*map_scale, -posy, -posx+mapWidth*map_scale, -posy+mapHeight*map_scale ),
    yint = yInt(x11, y11, x12, y12 );
    line = main.add.line(x11, y11-mapHeight*map_scale, 0-posx, yint-posy-mapHeight*map_scale, int[0]-posx, int[1]-posy-mapHeight*map_scale, 0x000000, 0.5 ).setLineWidth(5)
  }
}