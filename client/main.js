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
    this.load.image('white-square', 'assets/map/white-square.png');
    this.load.image('sign', 'assets/map/sign.png');
    this.load.image('gate', 'assets/map/gate.png');
    this.load.image('task-box', 'assets/accents/task-box.png');
    this.load.image('skill-circle', 'assets/accents/skill-circle.png');
    this.load.image('skill-circle-cover', 'assets/accents/skill-circle-cover.png');
    this.load.image('skill-plate-large', 'assets/accents/skill-plate-large.png');
    this.load.image('skill-plate-small', 'assets/accents/skill-plate-small.png');
    this.load.image('name-tag', 'assets/accents/name-tag.png');
    this.load.image('details', 'assets/buttons/details.png');
    this.load.image('round-brown', 'assets/buttons/round-brown.png');
    this.load.image('details-icon', 'assets/buttons/details-icon.png');
    this.load.image('upgrade-icon', 'assets/buttons/upgrade-icon.png');
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
    for ( let i = 1; 11 >= i; i++ ) {
      main.load.image('tree-trunk-'+i, 'assets/map/trees/tree-trunk-'+i+'.png');
      main.load.image('tree-top-'+i, 'assets/map/trees/tree-top-'+i+'.png');
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

    const structures = ['storage','textile','tannery','sawmill','forge','melee','ranged','plate','leathers','clothes'];

    // wooden background
    let wooden = main.add.container(4, -800 );
    wooden.add( main.add.sprite(4, 0, 'wooden' ) );
    /*
    let structure_x = 0;
    let structure_y = 0;
    for ( let i = 0; structures.length-1 >= i; i++ ) {
      const x = -230+(structure_x*235);
      const y = -340+(Math.floor(structure_y/3)*250);
      wooden.add( main.add.sprite(x-2, y+2, structures[i] ).setTint('#111111') );
      wooden.add( main.add.sprite(x, y, structures[i] ) );
      wooden.add( main.add.text(x-115, y-40, 'LEVEL '+i, {
        fontFamily: 'Roboto',
        fontSize: 28,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 230
      }).setStroke('#111111', 5));
      wooden.add( main.add.graphics().fillStyle(0xdaf1da, 1).lineStyle(4, 0x05230c).fillRect(x-63, y-5, 123, 16).strokeRect(x-63, y-5, 123, 16) );
      const progress = (Math.floor(Math.random()*123)+1);
      wooden.add( main.add.graphics().fillStyle(0x52da52, 1).lineStyle(2, 0x05230c).fillRect(x-63, y-5, progress, 16).strokeRect(x-63, y-5, progress, 16) );
      const text = (Math.floor(Math.random()*100)+1) >= 25 ? "OWNED" : "2:15:47:21";
      wooden.add( main.add.text(x-115, y+10, text, {
        fontFamily: 'Roboto',
        fontSize: 22,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        fixedWidth: 230
      }).setStroke('#111111', 5)); 
      wooden.add( main.add.sprite(x-40, y+80, 'round-brown' ).setInteractive({ cursor: 'pointer' }) );  
      wooden.add( main.add.sprite(x-40, y+80, 'details-icon' ) );  
      wooden.add( main.add.sprite(x+40, y+80, 'round-brown' ).setInteractive({ cursor: 'pointer' }) );
      wooden.add( main.add.sprite(x+40, y+80, 'upgrade-icon' ) );  
      structure_x++;
      structure_y++;
      if ( structure_x >= 3 )
      structure_x = 0;
    }
    */
    bg_elements.push( wooden );

    // wooden header assets
    wooden_header = main.add.container(-5, -200 );
    wooden_header.add( main.add.sprite(0, 0, 'wooden-header' ) );
    wooden_header.add( main.add.graphics().fillStyle(0x3b2315, 1).lineStyle(2, 0x2f180b).fillRoundedRect(-361, -58, 718, 74, 12).strokeRoundedRect(-361, -58, 718, 74, 12) );
    let structure_tints = [];
    for ( let i = 0; structures.length-1 >= i; i++ ) {
      wooden_header.add( main.add.sprite(-320+(i*70), -20, structures[i]+'-icon' ).setInteractive({ cursor: 'pointer' }).on('pointerdown', function () {
        const tinted = structure_tints.indexOf(structures[i]);
        if ( tinted < 0 ) {
        structure_tints.push(structures[i]);
        this.setTint(0x414141);
        } else {
          structure_tints.splice(tinted, 1);
          this.clearTint();          
        };
      }) );
    }
    wooden_header.add( main.add.sprite(-265, 90, 'pill-header' ).setInteractive({ cursor: 'pointer' }) );
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
    wooden_header.add( main.add.sprite(-88, 90, 'pill-header' ).setInteractive({ cursor: 'pointer' }) );
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
    wooden_header.add( main.add.sprite(89, 90, 'pill-header' ).setInteractive({ cursor: 'pointer' }) );
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
    wooden_header.add( main.add.sprite(220, 90, 'checkbox-round-brown' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.sprite(220, 90, 'check' ) );
    wooden_header.add( main.add.text(182, 37, 'Owned', {
      fontFamily: 'Roboto',
      fontSize: 22,
      color: '#ffffff',
      align: 'center',
      fixedWidth: 73
    }).setStroke('#443024', 6));
    wooden_header.add( main.add.sprite(305, 90, 'square-brown-header' ).setInteractive({ cursor: 'pointer' }) );
    wooden_header.add( main.add.text(268, 37, 'Sort', {
      fontFamily: 'Roboto',
      fontSize: 22,
      color: '#ffffff',
      align: 'center',
      fixedWidth: 73
    }).setStroke('#443024', 6));
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

    town = true;
    woodenDown();
    woodHeaderDown()
    stoneHeaderUp();
    menu_icon.setTexture('exit-icon');

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
    
    // window.localStorage.removeItem('map');
    window.localStorage.removeItem('trees');

    let map_x = 0, map_y = 0;
    let map_storage = window.localStorage.getItem('map');
    if ( !map_storage ) {
      let map_x = 0, map_y = 0, tiles = [];
      for ( let i = 1; 120 >= i; i++ ) {
        tiles.push({ x: map_x*289, y: map_y*288, tint:Math.floor(Math.random()*6) });
        map_x++
        if ( map_x == 14 ) {
          map_x = 0;
          map_y++
        };
      }
      window.localStorage.setItem("map", JSON.stringify(tiles))
    };

    let tree_storage = window.localStorage.getItem('trees');
    if ( !tree_storage ) {
      let tree_data = [];
      map_x = 0, map_y = 0;
      for ( let i = 1; 260 >= i; i++ ) {
        const tree_x = map_x*169-(Math.floor(Math.random()*20)+1);
        const tree_y = map_y*188-(Math.floor(Math.random()*60)+1);
        const make = Math.floor(Math.random()*100)+1;
        const scale = (Math.floor(Math.random()*15)+30)/100;
        if ( make == 1 ) {
          tree_data.push({
            city: true,
            x: tree_x,
            y: tree_y,
          });
        } else {
          tree_data.push({
            scale: scale,
            x: tree_x,
            y: tree_y,
            tree: (Math.floor(Math.random()*11)+1),
            tint: Math.floor(Math.random()*8)
          });
          if ( make > 1 )
          tree_data.push({
            scale: scale,
            x: tree_x+(Math.floor(Math.random()*40)+40),
            y: tree_y+(Math.floor(Math.random()*40)+40),
            tree: (Math.floor(Math.random()*11)+1),
            tint: Math.floor(Math.random()*8)
          });
        };
        map_x++
        if ( map_x == 24 ) {
          map_x = 0;
          map_y++
        };
      }
      window.localStorage.setItem("trees", JSON.stringify(tree_data));
    }
    const map_scale = 0.5;
    let map_tiles = JSON.parse(localStorage.getItem('map'));
    if ( map_tiles )
    for ( let i = 0; map_tiles.length-1 >= i; i++ ) {
      const tint = ['0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
      let map_tile = main.add.sprite(map_tiles[i].x*map_scale, map_tiles[i].y*map_scale, 'white-square' ).setScale(map_scale).setTint(tint[map_tiles[i].tint]);
      map_tile.depth = 0;
    }
    let map_trees = JSON.parse(localStorage.getItem('trees'));
    if ( map_trees )
    for ( let i = 0; map_trees.length-1 >= i; i++ ) {
      if ( map_trees[i].city ) {
        let circle = main.add.graphics().fillStyle(0x000000, 1).fillCircle(map_trees[i].x*map_scale, map_trees[i].y*map_scale, 200).setAlpha(0.5);
        circle.depth = 1;
        let sign = main.add.sprite(map_trees[i].x*map_scale, map_trees[i].y*map_scale-92, 'sign' );
        sign.depth = map_trees[i].y*map_scale+9;
        let gate = main.add.sprite(map_trees[i].x*map_scale-7, map_trees[i].y*map_scale, 'gate' );
        gate.depth = map_trees[i].y*map_scale+10;
      } else {
        const tint = ['0xaca52f', '0xd28d2c', '0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
        let tree_trunk_s = main.add.sprite(map_trees[i].x*map_scale+2, map_trees[i].y*map_scale+155*map_trees[i].scale-1, 'tree-trunk-'+map_trees[i].tree ).setScale(map_trees[i].scale).setTint('0x111111').setAlpha(0.4);
        let tree_top_s = main.add.sprite(map_trees[i].x*map_scale+2, map_trees[i].y*map_scale-1, 'tree-top-'+map_trees[i].tree ).setScale(map_trees[i].scale).setTint('0x111111').setAlpha(0.4);
        let tree_trunk = main.add.sprite(map_trees[i].x*map_scale, map_trees[i].y*map_scale+155*map_trees[i].scale, 'tree-trunk-'+map_trees[i].tree ).setScale(map_trees[i].scale);
        let tree_top = main.add.sprite(map_trees[i].x*map_scale, map_trees[i].y*map_scale, 'tree-top-'+map_trees[i].tree ).setScale(map_trees[i].scale).setTint(tint[map_trees[i].tint]);
        tree_trunk_s.depth = map_trees[i].y*map_scale+5;
        tree_top_s.depth = map_trees[i].y*map_scale+6;
        tree_trunk.depth = map_trees[i].y*map_scale+7;
        tree_top.depth = map_trees[i].y*map_scale+8;
      };
    }
    /*
    let map_x = 0, map_y = 0, tiles = [];
    for ( let i = 1; 100 >= i; i++ ) {
      tiles.push({ x: map_x, y: map_y, tint:Math.floor(Math.random()*6) });
      map_x++
      if ( map_x == 14 ) {
        map_x = 0;
        map_y++
      };
    }

    let trees = [];
    map_x = 0, map_y = 0;
    for ( let i = 1; 100 >= i; i++ ) {
      const make = Math.floor(Math.random()*100)+1;
      if ( make > 5 ) {
        trees.push({
          scale: (Math.floor(Math.random()*15)+30)/100,
          x: map_x*289-(Math.floor(Math.random()*120)-120),
          y: map_y*288-(Math.floor(Math.random()*120)-60),
          tree: (Math.floor(Math.random()*11)+1),
          tint: Math.floor(Math.random()*8)
        });
      };
      if ( make > 10 ) {
        trees.push({
          scale: (Math.floor(Math.random()*15)+30)/100,
          x: map_x*289-(Math.floor(Math.random()*120)-120)+(Math.floor(Math.random()*75)+50),
          y: map_y*288-(Math.floor(Math.random()*120)-60)+(Math.floor(Math.random()*75)+50),
          tree: (Math.floor(Math.random()*11)+1),
          tint: Math.floor(Math.random()*8)
        });
      };
      map_x++
      if ( map_x == 14 ) {
        map_x = 0;
        map_y++
      };
    }
    */

    /*
    let map_x = 0, map_y = 0, map = main.add.container(0, 0);
    const map_scale = 0.5;
    for ( let i = 1; 100 >= i; i++ ) {
      const tint = ['0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
      const set_tint = tint[Math.floor(Math.random()*tint.length)];
      map.add( main.add.sprite(map_x*289*map_scale, map_y*288*map_scale, 'white-square' ).setScale(map_scale).setTint(tint[Math.floor(Math.random()*tint.length)]) );
      map_x++
      if ( map_x == 14 ) {
        map_x = 0;
        map_y++
      };
    }

    map_x = 0, map_y = 0
    for ( let i = 1; 100 >= i; i++ ) {
      const tint = ['0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
      const tree_tint = ['0xaca52f', '0xd28d2c', '0x28811a', '0x149535', '0x2a5922', '0x2f8938', '0x1d803d', '0x468c2e'];
      const set_tint = tint[Math.floor(Math.random()*tint.length)];
      const tree_scale = (Math.floor(Math.random()*15)+30)/100;
      const tree_x = (Math.floor(Math.random()*120)-120)*map_scale;
      const tree_y = (Math.floor(Math.random()*120)-60)*map_scale;
      const map_x_full = map_x*289*map_scale-tree_x;
      const map_y_full = map_y*288*map_scale-tree_y;
      const tree = (Math.floor(Math.random()*11)+1);
      const make_tree = Math.floor(Math.random()*100)+1;
      if ( make_tree > 5 ) {
        map.add( main.add.sprite(map_x_full, map_y_full+155*tree_scale, 'tree-trunk-'+tree ).setScale(tree_scale) );
        map.add( main.add.sprite(map_x_full, map_y_full, 'tree-top-'+tree ).setScale(tree_scale).setTint(tree_tint[Math.floor(Math.random()*tree_tint.length)]) );
      };
      if ( make_tree > 10 ) {
        const extra_tree_x = (Math.floor(Math.random()*75)+50)*map_scale;
        const extra_tree_y = (Math.floor(Math.random()*75)+50)*map_scale;
        const extra_tree = (Math.floor(Math.random()*11)+1);
        map.add( main.add.sprite(map_x_full+extra_tree_x, map_y_full+155*tree_scale+extra_tree_y, 'tree-trunk-'+extra_tree ).setScale(tree_scale) );
        map.add( main.add.sprite(map_x_full+extra_tree_x, map_y_full+extra_tree_y, 'tree-top-'+extra_tree ).setScale(tree_scale).setTint(tree_tint[Math.floor(Math.random()*tree_tint.length)]) );
      };
      map_x++
      if ( map_x == 14 ) {
        map_x = 0;
        map_y++
      };
    }
    */

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