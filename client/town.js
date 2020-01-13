let dragging, previous, velocity,
wooden, wooden_header, stone_header;

updateTown = function() {
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

buildTown = function() {
  const container_width = 850;
  const prep_scale = ( window.innerWidth < container_width ? window.innerWidth/container_width : 1 );
  const scale = ( window.innerWidth >= 500 ? 500/container_width : prep_scale );
  const offset = (window.innerWidth-(container_width*scale))/2;

  const stone_width = Math.ceil(1090*0.5/(window.innerWidth/2)+1)*1090*0.5;
  left_stone = main.add.tileSprite(offset, window.innerHeight/2, stone_width, window.innerHeight, 'stone-light-blue').setTileScale(0.5).setOrigin(1,0.5);
  right_stone = main.add.tileSprite(window.innerWidth-offset, window.innerHeight/2, stone_width, window.innerHeight, 'stone-light-blue').setTileScale(0.5).setOrigin(0,0.5);
  tweenX(left_stone, offset, window.innerWidth/2, 200);
  tweenX(right_stone, window.innerWidth-offset, window.innerWidth/2, 200);

  let avatar, tasks = [], bg_elements = [];

  const task_box = { width: 676, height: 170 };
  const task_box_height = task_box.height+60;
  for ( let i = 0; 3 >= i; i++ ) {
    let task_boxes = [];
    // task box bg
    task_boxes.push( main.add.sprite(task_box.width/2, task_box.height/2, 'task-box' ));
    task_boxes.push( main.add.sprite(40, 62, 'skill-circle' ).setInteractive({ cursor: 'pointer' }) );
    let skill_bar = main.add.graphics();
    task_boxes.push( skill_bar );
    let delay = randInt(1, 50)*100;
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

  const centered = ( window.innerWidth < task_box.width*scale ? 0 : ((window.innerWidth/2)-task_box.width*scale/2)+10 );
  const top = 350*scale;
  const bottom_buffer = (window.innerHeight/2)-task_box.height;
  contHeight = window.innerHeight-((tasks.length*task_box_height+bottom_buffer)*scale)-top;

  // main task container
  container = main.add.container(centered, -window.innerHeight, tasks).setSize(50000, 50000).setScale(scale, scale).setInteractive();
  tweenY(container, -window.innerHeight, top, 400, 100 );

  // stone header assets
  stone_header = main.add.container(0, -200 );
  tweenY(stone_header, -200, 198, 200);
  bg_elements.push( stone_header );

  // const structures = ['storage','textile','tannery','sawmill','forge','melee','ranged','plate','leathers','clothes'];
  const structures = [];

  // wooden background
  wooden = main.add.container(4, -800 );
  wooden.add( main.add.sprite(4, 0, 'wooden' ) );

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

  // bg_elements.push( main.add.sprite(0, (window.innerHeight/scale), 'inventory' ) );

  // add background elements to container
  main.add.container(window.innerWidth/2, 0, bg_elements ).setScale(scale,scale);
  
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
  
  main.add.container(window.innerWidth/2, 0, topper ).setScale(scale,scale);
  
  stoneHeader(0);

  main.input.on('pointerdown', function (e) {
    const container_width = 850;
    const prep_scale = ( window.innerWidth < container_width ? window.innerWidth/container_width : 1 );
    const scale = ( window.innerWidth >= 500 ? 500/container_width : prep_scale );
    const offset = (window.innerWidth-(container_width*scale))/2;
    if ( e.button != 2 ) {
      main.scene.transition({ target: 'SceneA', duration: 200 });
      tweenX(left_stone, window.innerWidth/2, offset, 200);
      tweenX(right_stone, window.innerWidth/2, window.innerWidth-offset, 200);
      tweenY(stone_header, 198, -200, 200);
      tweenY(container, top, -window.innerHeight, 200);
    };
  });
  
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

  /*
  let town;
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
  */
}

stoneHeader = function(level, manager) {
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

woodenDown = function() {
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
}

woodenUp = function() {
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
}

woodHeaderDown = function() {
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
}

woodHeaderUp = function() {
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
}

stoneHeaderUp = function() {
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
}

stoneHeaderDown = function() {
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
}