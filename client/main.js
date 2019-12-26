import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { phaser, blendModes } from 'phaser';
 

import './main.html';
import './deps.js';
import './routing.js';
import './login.js';

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
      }
    });
  
  function preload ()
  {
    let main = this;
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    this.load.image('task-box', 'assets/accents/task-box.png');
    this.load.image('skill-circle', 'assets/accents/skill-circle.png');
    this.load.image('skill-circle-cover', 'assets/accents/skill-circle-cover.png');
    this.load.image('skill-plate-large', 'assets/accents/skill-plate-large.png');
    this.load.image('skill-plate-small', 'assets/accents/skill-plate-small.png');
    this.load.image('name-tag', 'assets/accents/name-tag.png');
    this.load.image('details', 'assets/buttons/details.png');
    this.load.image('pill-blue', 'assets/accents/pill-blue.png');
    this.load.image('happiness', 'assets/icons/happiness.png');
    this.load.image('usefulnesss', 'assets/icons/usefulnesss.png');
    this.load.image('task-item', 'assets/accents/task-item.png');
    this.load.image('task-item-cover', 'assets/accents/task-item-cover.png');
    this.load.image('energy-tag', 'assets/accents/energy-tag.png');
    this.load.image('energy-bg', 'assets/progress/energy-bg.png');
    this.load.image('energy-bar', 'assets/progress/energy-bar.png');
    this.load.image('timer-bg', 'assets/progress/timer-bg.png');
    this.load.image('timer-bar', 'assets/progress/timer-bar.png');
    this.load.image('break', 'assets/buttons/break.png');
    this.load.image('skills-logging', 'assets/skills/logging.png');
    this.load.image('logs', 'assets/items/logs.png');
    this.load.image('stone-light-blue', 'assets/bgs/stone-light-blue-random.jpg');
    this.load.image('inventory', 'assets/bgs/inventory.png');
    this.load.image('stone-header', 'assets/bgs/stone-header.png');
    this.load.image('wooden', 'assets/bgs/wooden.png');
    this.load.image('wooden-topper', 'assets/bgs/wooden-topper.png');
    this.load.image('wooden-header', 'assets/bgs/wooden-header.png');
    this.load.image('pill-header', 'assets/accents/pill-header.png');
    this.load.image('checkbox-round-brown', 'assets/accents/checkbox-round-brown.png');
    this.load.image('square-brown-header', 'assets/buttons/square-brown-header.png'); 
    this.load.image('check', 'assets/icons/check.png'); 
    this.load.image('sort-icon', 'assets/buttons/sort-icon.png');
    this.load.image('square-brown', 'assets/buttons/square-brown.png');
    this.load.image('menu-icon', 'assets/buttons/menu-icon.png');
    this.load.image('exit-icon', 'assets/buttons/exit-icon.png');
    this.load.image('city-name-tag', 'assets/accents/city-name-tag.png');
    this.load.image('pill-brown', 'assets/accents/pill-brown.png');
    this.load.image('storage', 'assets/structures/storage.png');
    this.load.image('textile', 'assets/structures/textile.png');
    this.load.image('tannery', 'assets/structures/tannery.png');
    this.load.image('sawmill', 'assets/structures/sawmill.png');
    this.load.image('forge', 'assets/structures/forge.png');
    this.load.image('melee', 'assets/structures/melee.png');
    this.load.image('ranged', 'assets/structures/ranged.png');
    this.load.image('plate', 'assets/structures/plate.png');
    this.load.image('leathers', 'assets/structures/leathers.png');
    this.load.image('clothes', 'assets/structures/clothes.png');
    this.load.image('storage-icon', 'assets/structures/icons/storage.png');
    this.load.image('textile-icon', 'assets/structures/icons/textile.png');
    this.load.image('tannery-icon', 'assets/structures/icons/tannery.png');
    this.load.image('sawmill-icon', 'assets/structures/icons/sawmill.png');
    this.load.image('forge-icon', 'assets/structures/icons/forge.png');
    this.load.image('melee-icon', 'assets/structures/icons/melee.png');
    this.load.image('ranged-icon', 'assets/structures/icons/ranged.png');
    this.load.image('plate-icon', 'assets/structures/icons/plate.png');
    this.load.image('leathers-icon', 'assets/structures/icons/leathers.png');
    this.load.image('clothes-icon', 'assets/structures/icons/clothes.png');
    this.load.spritesheet('manager', 'assets/buttons/manager.png', { frameWidth: 122, frameHeight: 122 });
    this.load.spritesheet('manager-add', 'assets/buttons/manager-add.png', { frameWidth: 97, frameHeight: 97 });
    for ( let i = 1; 60 >= i; i++ ) {
      main.load.image('avatar-'+i, 'assets/avatars/avatar-'+i+'.png');
    }
  }

  function create ()
  {
    let main = this;
    let tasks = [];
    
    const task_box = { width: 676, height: 170 };
    const task_box_height = task_box.height+60;
    for ( let i = 0; 3 >= i; i++ ) {
      let task_boxes = [];
      // task box bg
      task_boxes.push( main.add.sprite(task_box.width/2, task_box.height/2, 'task-box' ));
      task_boxes.push( main.add.sprite(40, 62, 'skill-circle' ).setInteractive({ cursor: 'pointer' }) );
      let skill_bar = main.add.graphics();
      task_boxes.push( skill_bar );
      let delay = (Math.floor(Math.random()*50)+1)*100;
      main.tweens.addCounter({
        delay: delay,
        from: 0,
        to: 290,
        duration: 2000,
        yoyo: false,
        repeat: -1,
        onUpdate: function (tween)
        {
            let t = tween.getValue();
            skill_bar.clear();
            skill_bar.fillStyle(0x52da52, 1);
            skill_bar.slice(40, 62, 70, Phaser.Math.DegToRad(125), Phaser.Math.DegToRad(125+t) );
            skill_bar.fillPath();
            skill_bar.strokePath();
        }
      });
      task_boxes.push( main.add.sprite(40, 62, 'skill-circle-cover' ) );
      task_boxes.push( main.add.sprite(40, 62, 'skills-logging' ) );
      task_boxes.push( main.add.sprite(40, 147, 'skill-plate-large' ) );
      task_boxes.push( main.add.text(-43, 130, '1462/1600', {
        fontFamily: 'Roboto',
        fontSize: 26,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 166
      }).setStroke('#072739', 4));
      task_boxes.push( main.add.sprite(-10, 0, 'skill-plate-small' ) );
      task_boxes.push( main.add.text(-46, -15, 'III', {
        fontFamily: 'Roboto',
        fontSize: 26,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 73
      }).setStroke('#072739', 4));
      task_boxes.push( main.add.sprite(190, 0, 'name-tag' ) );
      task_boxes.push( main.add.text(75, -13, 'R. JACOBSON', {
        fontFamily: 'Roboto',
        fontSize: 24,
        fontStyle: 'bold',
        color: '#2b5770',
        align: 'center',
        fixedWidth: 231
      }) );
      task_boxes.push( main.add.sprite(405, 0, 'details' ).setInteractive({ cursor: 'pointer' }) );
      task_boxes.push( main.add.text(317, -15, 'DETAILS', {
        fontFamily: 'Roboto',
        fontSize: 26,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 177
      }).setStroke('#173749', 6));
      task_boxes.push( main.add.sprite(600, 0, 'pill-blue' ) );
      task_boxes.push( main.add.sprite(552, 1, 'happiness' ) );
      task_boxes.push( main.add.text(557, -16, '99.99', {
        fontFamily: 'Roboto',
        fontSize: 30,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 140
      }).setStroke('#103549', 4));
      task_boxes.push( main.add.sprite(200, 95, 'task-item' ) );
      task_boxes.push( main.add.graphics().fillStyle(0x53b826, 1).fillRoundedRect(145, 40, 110, 110, 12) );
      task_boxes.push( main.add.sprite(200, 95, 'task-item-cover' ) );
      task_boxes.push( main.add.sprite(200, 95, 'logs' ) );
      task_boxes.push( main.add.sprite(460, 70, 'timer-bg' ) );
      task_boxes.push( main.add.sprite(460, 70, 'timer-bar' ).setCrop(0, 0, 200, 59 ) );
      task_boxes.push( main.add.text(275, 51, '00:00:11', {
        fontFamily: 'Roboto',
        fontSize: 30,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 369
      }).setStroke('#0b4653', 6));
      task_boxes.push( main.add.sprite(420, 140, 'energy-tag' ));
      task_boxes.push( main.add.sprite(410, 140, 'energy-bg' ));
      task_boxes.push( main.add.sprite(410, 140, 'energy-bar' ).setCrop(0, 0, 200, 43 ) );
      task_boxes.push( main.add.text(287, 124, '1926/2465', {
        fontFamily: 'Roboto',
        fontSize: 26,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 246
      }).setStroke('#3c270f', 6));
      task_boxes.push( main.add.sprite(610, 140, 'break' ).setInteractive({ cursor: 'pointer' }) );
      task_boxes.push( main.add.text(530, 123, 'BREAK', {
        fontFamily: 'Roboto',
        fontSize: 26,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 155
      }).setStroke('#42230d', 6));
      tasks.push( main.add.container(0, i*task_box_height, task_boxes) );
    }

    const container_width = 800;
    const prep_scale = ( window.innerWidth < container_width ? window.innerWidth/container_width : 1 );
    const scale = ( window.innerWidth >= 500 ? 500/container_width : prep_scale );
    const centered = ( window.innerWidth < task_box.width*scale ? 0 : ((window.innerWidth/2)-task_box.width*scale/2)+10 );

    main.add.container(0, 0, main.add.tileSprite(window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight, 'stone-light-blue').setTileScale( scale, scale ) );

    const top = 350*scale;
    const bottom_buffer = (window.innerHeight/2)-task_box.height;
    const contHeight = window.innerHeight-((tasks.length*task_box_height+bottom_buffer)*scale)-top;

    // main task container
    let dragging, previous, velocity, container = main.add.container(centered, top, tasks).setSize(50000, 50000).setScale(scale, scale).setInteractive();
    main.input.setDraggable(container);
    main.input.on('drag', function (pointer, contBox, dragX, dragY) {
      if ( dragY <= top && dragY >= contHeight && container.y <= top && container.y >= contHeight ) {
        previous = container.y;
        container.y = dragY;
        let distance = previous-container.y
        if ( distance >= 5 || distance <= -5 )
        velocity = ( previous-container.y );
      };
    });
    main.input.on('wheel', function (pointer, contBox, deltaX, deltaY, deltaZ) {
      if ( container.y-deltaY <= top && container.y-deltaY >= contHeight ) {
        container.y -= deltaY;
      } else if ( container.y-deltaY > top ) {
        container.y = top;
      } else if ( container.y-deltaY < contHeight && contHeight-task_box.height < container.y-deltaY ) {
        container.y = contHeight;
      };
    });
    main.input.on('dragstart', function (pointer, contBox) {
      dragging = true;
    });
    main.input.on('dragend', function (pointer, contBox) {
      dragging = false;
      previous = false;
    });
    
    // start loading background elements
    let town, stone_header, wooden_header, avatar, bg_elements = [], btn_elements = [], topper_data = [];

    // stone header assets
    function stoneHeader(level, manager) {
      try { stone_header.removeAll() } catch(e) { };
      stone_header.add( main.add.sprite(0, -58, 'stone-header' ) );
      stone_header.add( avatar = main.add.image(-290, 0, 'manager', 1 ).setInteractive({ cursor: 'pointer' }) );
      stone_header.add( main.add.sprite(-290, 0, 'avatar-1' ).setDisplaySize(112,112) );
      for ( let i = 1; 4 >= i; i++ ) {
        let type = ( level >= i && manager && manager[i] ? 'manager' : 'manager-add' );
        let number = ( level >= i ? 1 : 0 );
        stone_header.add( main.add.image(-290+(i*142), 0, type, number ).setInteractive({ cursor: 'pointer' }).on('pointerdown', function () {
          stoneHeader(i);
        }) );
      }
    }
    stone_header = main.add.container(0, 198 );
    bg_elements.push( stone_header );

    // wooden background
    let wooden = main.add.sprite(4, -800, 'wooden' );
    bg_elements.push( wooden );

    // wooden header assets
    wooden_header = main.add.container(-5, -200 );
    wooden_header.add( main.add.sprite(0, 0, 'wooden-header' ) );
    wooden_header.add( main.add.graphics().fillStyle(0x3b2315, 1).lineStyle(2, 0x2f180b).fillRoundedRect(-361, -58, 718, 74, 12).strokeRoundedRect(-361, -58, 718, 74, 12) );
    wooden_header.add( main.add.sprite(-320, -20, 'storage-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(-250, -20, 'textile-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(-180, -20, 'tannery-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(-110, -20, 'sawmill-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(-40, -20, 'forge-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(30, -20, 'melee-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(100, -20, 'ranged-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(170, -20, 'plate-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(250, -20, 'leathers-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(320, -20, 'clothes-icon' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(-265, 90, 'pill-header' ) );
    wooden_header.add( main.add.text(-350, 37, 'Buildings', {
      fontFamily: 'Roboto',
      fontSize: 22,
      color: '#ffffff',
      align: 'center',
      fixedWidth: 167
    }).setStroke('#443024', 6));
    wooden_header.add( main.add.text(-350, 70, '12', {
      fontFamily: 'Roboto',
      fontSize: 32,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
      fixedWidth: 167
    }).setStroke('#3a2519', 6));
    wooden_header.add( main.add.sprite(-88, 90, 'pill-header' ) );
    wooden_header.add( main.add.text(-172, 37, 'For Sale', {
      fontFamily: 'Roboto',
      fontSize: 22,
      color: '#ffffff',
      align: 'center',
      fixedWidth: 167
    }).setStroke('#443024', 6));
    wooden_header.add( main.add.text(-172, 70, '2', {
      fontFamily: 'Roboto',
      fontSize: 32,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
      fixedWidth: 167
    }).setStroke('#3a2519', 6));
    wooden_header.add( main.add.sprite(89, 90, 'pill-header' ) );
    wooden_header.add( main.add.text(5, 37, 'For Rent', {
      fontFamily: 'Roboto',
      fontSize: 22,
      color: '#ffffff',
      align: 'center',
      fixedWidth: 167
    }).setStroke('#443024', 6));
    wooden_header.add( main.add.text(5, 70, '1', {
      fontFamily: 'Roboto',
      fontSize: 32,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
      fixedWidth: 167
    }).setStroke('#3a2519', 6));
    wooden_header.add( main.add.sprite(220, 90, 'checkbox-round-brown' ) );
    wooden_header.add( main.add.sprite(305, 90, 'square-brown-header' ) );
    wooden_header.add( main.add.sprite(305, 90, 'sort-icon' ) );
    bg_elements.push( wooden_header );

    // topper
    bg_elements.push( main.add.sprite(0, 40, 'wooden-topper' ) );

    // menu button in topper
    let menu_button = main.add.sprite(0, 0, 'square-brown' ).setInteractive({ cursor: 'pointer' });
    let menu_icon = main.add.sprite(0, -3, 'menu-icon' );
    btn_elements.push( menu_button );
    btn_elements.push( menu_icon );    
    bg_elements.push( main.add.container(325, 45, btn_elements ) );

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
    bg_elements.push( main.add.container(-320, 43, topper_data ) );

    bg_elements.push( main.add.sprite(0, (window.innerHeight/scale), 'inventory' ) );

    // add background elements to container
    let backgrounds = main.add.container(window.innerWidth/2, 0, bg_elements ).setScale(scale,scale);
    
    stoneHeader(0);

    function woodenDown() {
      main.tweens.addCounter({
        from: -800,
        to: 800,
        duration: 500,
        yoyo: false,
        repeat: 0,
        onUpdate: function (tween)
        {
            let t = tween.getValue();
            wooden.y = t;
        }
      });
    };

    function woodenUp() {
      main.tweens.addCounter({
        from: 800,
        to: -800,
        duration: 500,
        yoyo: false,
        repeat: 0,
        onUpdate: function (tween)
        {
            let t = tween.getValue();
            wooden.y = t;
        }
      });
    };

    function woodHeaderDown() {
      main.tweens.addCounter({
        delay: 300,
        from: -200,
        to: 160,
        duration: 300,
        yoyo: false,
        repeat: 0,
        onUpdate: function (tween)
        {
            let t = tween.getValue();
            wooden_header.y = t;
        }
      });
    };

    function woodHeaderUp() {
      main.tweens.addCounter({
        from: 160,
        to: -200,
        duration: 300,
        yoyo: false,
        repeat: 0,
        onUpdate: function (tween)
        {
            let t = tween.getValue();
            wooden_header.y = t;
        }
      });
    };

    function stoneHeaderUp() {
      main.tweens.addCounter({
        from: 198,
        to: -200,
        duration: 300,
        yoyo: false,
        repeat: 0,
        onUpdate: function (tween)
        {
            let t = tween.getValue();
            stone_header.y = t;
        }
      });
    };

    function stoneHeaderDown() {
      main.tweens.addCounter({
        delay: 300,
        from: -200,
        to: 198,
        duration: 300,
        yoyo: false,
        repeat: 0,
        onUpdate: function (tween)
        {
            let t = tween.getValue();
            stone_header.y = t;
        }
      });
    };

    menu_button.on('pointerdown', function () {
      if ( !town ) {
        town = true;
        woodenDown();
        woodHeaderDown()
        stoneHeaderUp();
        menu_icon.setTexture('exit-icon');
      } else {
        town = false;
        woodenUp();
        woodHeaderUp()
        stoneHeaderDown();
        menu_icon.setTexture('menu-icon');
      };
    });

    /*
    // Full Progress Phaser.Math.DegToRad(130), Phaser.Math.DegToRad(410)
    main.tweens.addCounter({
      from: 0,
      to: 280,
      duration: 2000,
      yoyo: false,
      repeat: -1,
      onUpdate: function (tween)
      {
          let t = tween.getValue();

          skill_bar.clear();
          skill_bar.fillStyle(0x52da52, 1);
          skill_bar.slice(151/2, 151/2, 70, Phaser.Math.DegToRad(130), Phaser.Math.DegToRad(130+t) );
          skill_bar.fillPath();
          skill_bar.strokePath();
      }
    });
    */

    function step() {
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