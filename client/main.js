import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { phaser } from 'phaser';
 

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
      backgroundColor: '#4c6e79',
      scene: {
        preload: preload,
        create: create,
      }
    });
  
  function preload ()
  {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    this.load.image('task-box', 'assets/task-box.png');
    this.load.image('task-add-button', 'assets/task-add-button.png');
    this.load.image('task-details-button', 'assets/task-details-button.png');
    this.load.image('task-item-box-gray', 'assets/task-item-box-gray.png');
    this.load.image('skill-circle', 'assets/skill-circle.png');
    this.load.image('skill-circle-cover', 'assets/skill-circle-cover.png');
    this.load.image('skill-rank-bg', 'assets/skill-rank-bg.png');
    this.load.image('skills-logging', 'assets/skills/logging.png');
    
  }
  

  function create ()
  {
    let tasks = [];
    const task_box = { width: 680, height: 292 };
    for ( let i = 0; 15 >= i; i++ ) {
      let task_boxes = [];

      // task box bg
      task_boxes.push( this.add.sprite(task_box.width/2+(136/2)+20, task_box.height/2+30, 'task-box' ));
      
      // name holder
      const name_text = ( i == 0 ? 'M. ROBERTS' : 'A. ROOK' );
      task_boxes.push( this.add.graphics().lineStyle(4, 0x25546e, 1).fillStyle(0xffffff, 1).fillRect(370, 0, 250, 60).strokeRect(370, 0, 250, 60) );
      task_boxes.push( this.add.text(370, 11, name_text, {
        fontFamily: 'Roboto',
        fontSize: 36,
        color: '#2b5770',
        fontStyle: 'bold',
        fixedWidth: 250,
        align: 'center'
      }));

      // task buttons
      task_boxes.push( this.add.sprite((136/2), (138/2)+40, 'task-add-button' ).setInteractive({ cursor: 'pointer' }) );
      task_boxes.push( this.add.sprite((136/2)+140, (66/2)+237, 'task-details-button' ).setInteractive({ cursor: 'pointer' }) );
      if ( i == 2 )
      task_boxes.push( this.add.sprite(710, 82, 'task-item-box-gray' ).setInteractive({ cursor: 'pointer' }) );
      if ( i == 1 ) {
        let skill_button = [];
        skill_button.push( this.add.sprite(151/2, 151/2, 'skill-circle' ) );
        // Full Progress Phaser.Math.DegToRad(130), Phaser.Math.DegToRad(410)
        skill_button.push( this.add.graphics().slice(151/2, 151/2, 70, Phaser.Math.DegToRad(130), Phaser.Math.DegToRad(158) ).fillStyle(0x52da52, 1).fillPath().strokePath() );
        skill_button.push( this.add.sprite(151/2, 151/2, 'skill-circle-cover' ) );
        skill_button.push( this.add.sprite(151/2, 151/2, 'skills-logging' ) );
        skill_button.push( this.add.sprite((99/2+27), (42/2+118), 'skill-rank-bg' ) );
        skill_button.push( this.add.text(40, (42/2+101), 'III', {
          fontFamily: 'Roboto',
          fontSize: 32,
          color: '#19384a',
          fixedWidth: 76,
          align: 'center'
        }));
  
        task_boxes.push( this.add.container(155, 57, skill_button ) );
      };
     
      // task box text for fresh employee
      if ( i != 1 && i != 2 )
      task_boxes.push( this.add.text((136/2)+20, 104, 'No Skills Yet', {
        fontFamily: 'Teko',
        fontSize: 67,
        color: '#d1e5f0',
        align: 'center',
        fixedWidth: task_box.width
      }).setStroke('#2c556c', 6));
      
      const inner_text = ( i == 1 ? 'Useful 7%  Happy 10%' : 'Useful 100%  Happy 100%' );
      task_boxes.push( this.add.text(280, 245, inner_text, {
        fontFamily: 'Teko',
        fontSize: 50,
        color: '#d1e5f0',
        align: 'center',
        fixedWidth: 450
      }).setStroke('#2c556c', 6));

      tasks.push( this.add.container(30, i*(task_box.height+70)+20, task_boxes) );
    }
    const container_width = task_box.width+(136/2)+90;
    const tasks_size = tasks.length*(task_box.height+70);
    const prep_scale = ( window.innerWidth < container_width ? window.innerWidth/container_width : 1 );
    const scale = ( window.innerWidth >= 500 ? 500/container_width : prep_scale );
    const centered = ( window.innerWidth < container_width*scale ? 0 : (window.innerWidth/2)-container_width*scale/2 );

    let dragging, previous, velocity, container = this.add.container(centered, 0, tasks).setSize(50000,50000).setScale(scale,scale).setInteractive();
    const contHeight = window.innerHeight-((tasks_size+20)*scale);

    this.input.setDraggable(container);
    this.input.on('drag', function (pointer, contBox, dragX, dragY) {
      if ( dragY <= 0 && dragY >= contHeight && container.y <= 0 && container.y >= contHeight ) {
        previous = container.y;
        container.y = dragY;
        let distance = previous-container.y
        if ( distance >= 5 || distance <= -5 )
        velocity = ( previous-container.y );
      };
    });
    this.input.on('wheel', function (pointer, contBox, deltaX, deltaY, deltaZ) {
      if ( container.y+deltaY <= 0 && container.y+deltaY >= contHeight ) {
        container.y += deltaY;
      } else if ( container.y+deltaY > 0 ) {
        container.y = 0;
      } else if ( container.y+deltaY < contHeight ) {
        container.y = contHeight;
      };
    });
    
    this.input.on('dragstart', function (pointer, contBox) {
      dragging = true;
    });
    this.input.on('dragend', function (pointer, contBox) {
      dragging = false;
      previous = false;
    });

    function step() {
      let slow = 0.9;
      if ( !dragging && velocity && container.y-velocity <= 0 && container.y-velocity >= contHeight ) {
        container.y -= velocity;
        if ( velocity > 0 ) {
          if ( velocity*slow > 0 ) {
            velocity *= slow
          } else {
            velocity = 0;
          };
        } else if ( velocity < 0 ) {
          if ( velocity*slow < 0 ) {
            velocity *= slow
          } else {
            velocity = 0;
          };
        };
      } else if ( !dragging && velocity && container.y-velocity > 0 ) {
        container.y = 0;
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