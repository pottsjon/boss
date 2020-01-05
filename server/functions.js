createMap = function() {
    let map_x = 0, map_y = 0;
    if ( !tile_storage ) {
      map_x = 0, map_y = 0;
      for ( let i = 1; 392 >= i; i++ ) {
        tiles.push({ x: map_x*289, y: map_y*288, tint:randInt(0, 5) });
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
        const y = map_y*1202+randInt(300, 900);
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
      for ( let i = 1; 784 >= i; i++ ) {
        let create = true;
        const tree_x = map_x*145,
        tree_y = map_y*288,
        scale = randInt(30, 45)/100,
        offset = ( map_y % 2 ? 0 : 60 ),
        make = randInt(1, 100),
        reduce = ( map_y == 0 ? -120 : 0 ),
        tree_1_x = tree_x+offset,
        tree_1_y = tree_y-randInt(61+reduce/2, 180+reduce),
        tree_2_x = tree_x+offset+randInt(40, 60),
        tree_2_y = tree_y-randInt(20, 60);
        for ( let j = 0; towns.length-1 >= j; j++ ) {
          if ( tree_x > towns[j].x-300 && tree_x < towns[j].x+300 && tree_y > towns[j].y-300 && tree_y < towns[j].y+300 )
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