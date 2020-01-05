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
    main.add.image(window.innerWidth/2, window.innerHeight/2-100, 'logo').setScale(.75);

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
    loadAssets('map');
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
    
    woodenDown();
    //stoneHeader(0);

    function step() {
      if ( moving ) {
        map.x -= Math.cos(moving)*.2;
        map.y -= Math.sin(moving)*.2;
        // console.log(map.x+" "+map.y);
        if ( map.x > window.innerWidth/2 )
        map.x = -mapWidth*map_scale+window.innerWidth/2;
        if ( map.y > window.innerHeight/2 )
        map.y = -mapHeight*map_scale+window.innerHeight/2;
        if ( map.x < -mapWidth*map_scale+window.innerWidth/2  )
        map.x = 0+window.innerWidth/2;
        if ( map.y < -mapHeight*map_scale+window.innerHeight/2  )
        map.y = 0+window.innerHeight/2;
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
  }
  });
});