loadAssets = function(type) {
    
    if ( type == "map" ) {
      main.load.image('white-square', 'assets/map/white-square.png');
      main.load.image('sign', 'assets/map/sign.png');
      main.load.image('gate', 'assets/map/gate.png');
      main.load.image('stand', 'assets/map/stand.png');
      main.load.image('pointer', 'assets/map/pointer.png');
      main.load.image('pointer-mask', 'assets/map/pointer-mask.png');
      main.load.image('arrow', 'assets/map/arrow.png');

      // trees 1-11
      for ( let i = 1; 11 >= i; i++ ) {
        main.load.image('tree-trunk-'+i, 'assets/map/trees/tree-trunk-'+i+'.png');
        main.load.image('tree-top-'+i, 'assets/map/trees/tree-top-'+i+'.png');
      }
    };

    if ( type == "town" ) {
      main.load.image('task-box', 'assets/accents/task-box.png');
      main.load.image('skill-circle', 'assets/accents/skill-circle.png');
      main.load.image('skill-circle-cover', 'assets/accents/skill-circle-cover.png');
      main.load.image('skill-plate-large', 'assets/accents/skill-plate-large.png');
      main.load.image('skill-plate-small', 'assets/accents/skill-plate-small.png');
      main.load.image('name-tag', 'assets/accents/name-tag.png');
      main.load.image('details', 'assets/buttons/details.png');
      main.load.image('round-brown', 'assets/buttons/round-brown.png');
      main.load.image('details-icon', 'assets/buttons/details-icon.png');
      main.load.image('upgrade-icon', 'assets/buttons/upgrade-icon.png');
      main.load.image('pill-blue', 'assets/accents/pill-blue.png');
      main.load.image('happiness', 'assets/icons/happiness.png');
      main.load.image('usefulnesss', 'assets/icons/usefulnesss.png');
      main.load.image('task-item', 'assets/accents/task-item.png');
      main.load.image('task-item-cover', 'assets/accents/task-item-cover.png');
      main.load.image('energy-tag', 'assets/accents/energy-tag.png');
      main.load.image('energy-bg', 'assets/progress/energy-bg.png');
      main.load.image('energy-bar', 'assets/progress/energy-bar.png');
      main.load.image('timer-bg', 'assets/progress/timer-bg.png');
      main.load.image('timer-bar', 'assets/progress/timer-bar.png');
      main.load.image('break', 'assets/buttons/break.png');
      main.load.image('skills-logging', 'assets/skills/logging.png');
      main.load.image('logs', 'assets/items/logs.png');
      main.load.image('stone-light-blue', 'assets/bgs/stone-light-blue-random.jpg');
      main.load.image('inventory', 'assets/bgs/inventory.png');
      main.load.image('stone-header', 'assets/bgs/stone-header.png');
      main.load.image('wooden', 'assets/bgs/wooden.png');
      main.load.image('wooden-topper', 'assets/bgs/wooden-topper.png');
      main.load.image('wooden-header', 'assets/bgs/wooden-header.png');
      main.load.image('pill-header', 'assets/accents/pill-header.png');
      main.load.image('checkbox-round-brown', 'assets/accents/checkbox-round-brown.png');
      main.load.image('square-brown-header', 'assets/buttons/square-brown-header.png'); 
      main.load.image('check', 'assets/icons/check.png'); 
      main.load.image('sort-icon', 'assets/buttons/sort-icon.png');
      main.load.image('square-brown', 'assets/buttons/square-brown.png');
      main.load.image('menu-icon', 'assets/buttons/menu-icon.png');
      main.load.image('exit-icon', 'assets/buttons/exit-icon.png');
      main.load.image('city-name-tag', 'assets/accents/city-name-tag.png');
      main.load.image('pill-brown', 'assets/accents/pill-brown.png');
      main.load.image('storage', 'assets/structures/storage.png');
      main.load.image('textile', 'assets/structures/textile.png');
      main.load.image('tannery', 'assets/structures/tannery.png');
      main.load.image('sawmill', 'assets/structures/sawmill.png');
      main.load.image('forge', 'assets/structures/forge.png');
      main.load.image('melee', 'assets/structures/melee.png');
      main.load.image('ranged', 'assets/structures/ranged.png');
      main.load.image('plate', 'assets/structures/plate.png');
      main.load.image('leathers', 'assets/structures/leathers.png');
      main.load.image('clothes', 'assets/structures/clothes.png');
      main.load.image('storage-icon', 'assets/structures/icons/storage.png');
      main.load.image('textile-icon', 'assets/structures/icons/textile.png');
      main.load.image('tannery-icon', 'assets/structures/icons/tannery.png');
      main.load.image('sawmill-icon', 'assets/structures/icons/sawmill.png');
      main.load.image('forge-icon', 'assets/structures/icons/forge.png');
      main.load.image('melee-icon', 'assets/structures/icons/melee.png');
      main.load.image('ranged-icon', 'assets/structures/icons/ranged.png');
      main.load.image('plate-icon', 'assets/structures/icons/plate.png');
      main.load.image('leathers-icon', 'assets/structures/icons/leathers.png');
      main.load.image('clothes-icon', 'assets/structures/icons/clothes.png');

      main.load.spritesheet('manager', 'assets/buttons/manager.png', { frameWidth: 122, frameHeight: 122 });
      main.load.spritesheet('manager-add', 'assets/buttons/manager-add.png', { frameWidth: 97, frameHeight: 97 });

      // avatars 1-60
      for ( let i = 1; 60 >= i; i++ ) {
        main.load.image('avatar-'+i, 'assets/avatars/avatar-'+i+'.png');
      }
    };
}