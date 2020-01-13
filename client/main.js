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
import './functions.js';
import './town.js';
import './map.js';

UI.body.onRendered(function() {
	Tracker.autorun(function() {
    // document.addEventListener('contextmenu', event => event.preventDefault());
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
        main = this;
        buildMap();
      },
      update: function () {
        if ( moving )
        updateMap();
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
      },
      update: function () {
        updateTown();
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
        loadAssets();
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