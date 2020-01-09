import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { phaser, blendModes } from 'phaser';
 

import './main.html';
import './deps.js';
import './routing.js';
import './login.js';
import '../imports/globals.js';
import './loading.js';
import './town.js';
import './map.js';

UI.body.onRendered(function() {
	Tracker.autorun(function() {
    Meteor.setInterval(function() {
      const timenow = TimeSync.serverTime( (new Date()).getTime() );
      if ( timenow ) {
        time = timenow;
        timeDep.changed();
      };
    }, 333);
  });
});

Deps.autorun(function(c) {
	try {
    UserStatus.startMonitor({
      threshold: 1000*60*10,
      interval: 1000*60*2,
      idleOnBlur: true
    });
    return c.stop();
	} catch (e) {}
});

Template.main.onRendered(function () {
	Tracker.autorun(function() {
  let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'main',
    backgroundColor: '#1a3842',
    scene: {
      preload: preload,
      create: create,
      pack: {
          files: [
              { type: 'image', key: 'logo', url: 'assets/logo.png' }
          ]
      }
    }
  });

  function preload ()
  {
    main = this;
    main.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

    // load logo
    main.add.image(window.innerWidth/2, window.innerHeight/2-100, 'logo').setScale(.75);

    // load progress bar for assets
    main.add.graphics().fillStyle(0x0b2128, 1).fillRect(window.innerWidth/2-200, window.innerHeight/2+100, 400+4, 44);
    let progress = main.add.graphics();
    main.load.on('progress', function (value) {
        progress.clear();
        progress.fillStyle(0x52da52, 1);
        progress.fillRect(window.innerWidth/2-200+2, window.innerHeight/2+100+2, 400*value, 40);
    });
    main.load.on('complete', function () {
        progress.destroy();
    });
    // map assets
    loadAssets('map');
    // town assets
    loadAssets('town');
  }

  function create ()
  {
    main = this,
    map_scale = 0.5,
    mapWidth = 8092,
    mapHeight = 4032,
    moving = false,
    dragging = false,
    previous = false,
    velocity = 0;

    let topper = [],
    btn_elements = [],
    topper_data = [];

    buildTown();
    buildMap();

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

    const container_width = 800;
    const prep_scale = ( window.innerWidth < container_width ? window.innerWidth/container_width : 1 );
    const scale = ( window.innerWidth >= 500 ? 500/container_width : prep_scale );
    main.add.container(window.innerWidth/2, 0, topper ).setScale(scale,scale);

    let posx = 0, posy = -mapHeight*map_scale,
    start, end, angle, angleDeg;
    main.input.on('pointerdown', function (e) {
      if ( e.button != 2 ) {
        start = { x: -posx+window.innerWidth/2, y: -posy+window.innerHeight/2 },
        end = { x: main.input.activePointer.worldX, y: main.input.activePointer.worldY },
        angle = Math.atan2(end.y - start.y, end.x - start.x),
        angleDeg = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
        moving = angle;
      } else {
        moving = false;
      };
    });

    let arrow, over, over_count;
    main.input.on('pointermove', function (e) {
      over = 5;
      if ( !arrow )
      arrow = main.add.sprite(-posx+window.innerWidth/2, -posy+window.innerHeight/2+80, 'arrow' ).setTint('0x62c466').setAlpha(0.5).setDepth(2).setOrigin(0, 0.5);
      start = { x: -posx+window.innerWidth/2, y: -posy+window.innerHeight/2+80 },
      end = { x: main.input.activePointer.worldX, y: main.input.activePointer.worldY },
      angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
      arrow.setAngle(angle);
    });
    
    function overCount() {
      const timer = ( over == 5 ? 2000 : 100 );
      over_count = true;
      Meteor.setTimeout(function(){
        arrow.setAlpha(over/10);
        over -= 1;
        if ( over > 0 ) {
          overCount()
        } else {
          over_count = false;
          arrow.destroy();
          arrow = false;
        };
      }, timer);
    }

    woodenDown();
    //stoneHeader(0);
    function step() {
      console.log(over)
      if ( over && !over_count )
      overCount();
      if ( moving ) {
        posx -= Math.cos(moving)*.6;
        posy -= Math.sin(moving)*.6;
        const formx = -posx+window.innerWidth/2,
        formy = -posy+window.innerHeight/2,
        setx = -mapWidth*map_scale+window.innerWidth/2,
        sety = -mapHeight*map_scale+window.innerHeight/2;
        if ( arrow ) {
          arrow.x = -posx+window.innerWidth/2;
          arrow.y = -posy+window.innerHeight/2+80;
        };

        p_avatar.setDepth(formy+82);
        pointer.setDepth(formy+81);
        p_avatar.x = formx-1;
        p_avatar.y = formy-26;
        p_shape.x = formx;
        p_shape.y = formy-26;
        pointer.x = formx;
        pointer.y = formy;
        main.cameras.main.scrollX = -posx;
        main.cameras.main.scrollY = -posy;

        // console.log(posx+" "+posy);
        if ( posx > window.innerWidth/2 )
        posx = setx;
        if ( posy > sety )
        posy = -mapHeight*map_scale+sety;
        if ( posx < setx  )
        posx = window.innerWidth/2;
        if ( posy < -mapHeight*map_scale+sety  )
        posy = sety;
      };
      let slow = 0.9;
      if ( !dragging && velocity && container.y-velocity <= top && container.y-velocity >= contHeight ) {
        container.y -= velocity;
        velocity *= slow
        if ( velocity <= 1 && velocity >= -1 )
        velocity = 0;        
      } else if ( !dragging && velocity && container.y-velocity > top ) {
        container.y = top;
        velocity = 0;
      } else if ( !dragging && velocity && container.y-velocity < contHeight ) {
        container.y = contHeight;
        velocity = 0;
      };  
      requestAnimationFrame( step );
    };
    step();
    main.cameras.main.setSize(mapWidth*map_scale, mapHeight*map_scale);
    main.cameras.main.scrollY = mapHeight*map_scale;
  }
  });
});