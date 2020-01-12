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
    let SceneA = new Phaser.Class({
      Extends: Phaser.Scene,
      initialize:
      function SceneA () {
        Phaser.Scene.call(this, { key: 'SceneA' });
      },
      create: function () {
        // this.scene.start('SceneB');
        main = this,
        map_scale = 0.5,
        mapWidth = 8092,
        mapHeight = 4032,
        posx = 0,
        posy = -mapHeight*map_scale,
        arrow = false,
        moving = false,
        dragging = false,
        previous = false,
        velocity = 0;
        buildMap();
        main.cameras.main.setSize(mapWidth*map_scale, mapHeight*map_scale);
        main.cameras.main.scrollY = mapHeight*map_scale;
        /*
        main.input.on('pointerdown', function (e) {
          if ( e.button != 2 )
          main.scene.start('SceneB');
        });
        */
      },
      update: function () {
        if ( moving ) {
          posx -= Math.cos(moving)*.6;
          posy -= Math.sin(moving)*.6;
          const formx = -posx+window.innerWidth/2,
          formy = -posy+window.innerHeight/2,
          setx = -mapWidth*map_scale+window.innerWidth/2,
          sety = -mapHeight*map_scale+window.innerHeight/2;
          if ( arrow ) {
            arrow.x = -posx+window.innerWidth/2;
            arrow.y = -posy+window.innerHeight/2;
          }
          p_avatar.setDepth(formy+1);
          pointer.setDepth(formy);
          p_avatar.x = formx-1;
          p_avatar.y = formy-106;
          p_shape.x = formx;
          p_shape.y = formy-106;
          pointer.x = formx;
          pointer.y = formy-80;
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
      }
    });
    let SceneB = new Phaser.Class({
      Extends: Phaser.Scene,
      initialize:
      function SceneB () {
        Phaser.Scene.call(this, { key: 'SceneB' });
      },
      create: function () {
        main = this;
        buildTown();
        main.input.on('pointerdown', function (e) {
          if ( e.button != 2 )
          main.scene.start('SceneA');
        });
      },
      update: function () {
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
      }
    });
    let SceneLoader = new Phaser.Class({
      Extends: Phaser.Scene,
      initialize:
      function SceneLoader () {
        Phaser.Scene.call(this, { key: 'SceneLoader',
          pack: {
              files: [
                  { type: 'image', key: 'logo', url: 'assets/logo.png' }
              ]
          }
        });
      },  
      preload: function () {
        main = this;
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    
        // load logo
        this.add.image(window.innerWidth/2, window.innerHeight/2-100, 'logo').setScale(.75);
    
        // load progress bar for assets
        this.add.graphics().fillStyle(0x0b2128, 1).fillRect(window.innerWidth/2-200, window.innerHeight/2+100, 400+4, 44);
        let progress = this.add.graphics();
        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0x52da52, 1);
            progress.fillRect(window.innerWidth/2-200+2, window.innerHeight/2+100+2, 400*value, 40);
        });
        this.load.on('complete', function () {
            progress.destroy();
        });
        // map assets
        loadAssets('map');
        // town assets
        loadAssets('town');
      },
      create: function () {
        this.scene.start('SceneA');
      }
    });
    let game = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'main',
      backgroundColor: '#1a3842',
      scene: [ SceneLoader, SceneA, SceneB ]
    });
  });
});