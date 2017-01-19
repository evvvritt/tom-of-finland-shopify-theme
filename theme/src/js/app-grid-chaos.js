$(function(){

  if ( $(window).width() > 768 ) {

      var randomIntegerBt = function(min,max)
      {
          var integer = Math.floor(Math.random()*(max-min+1)+min);
          console.log(integer + ' : ' + max);
          return integer;
      }

      /**
       * Randomize array element order in-place.
       * Using Durstenfeld shuffle algorithm.
       */
      function shuffleArray(d) {
        for (var c = d.length - 1; c > 0; c--) {
          var b = Math.floor(Math.random() * (c + 1));
          var a = d[c];
          d[c] = d[b];
          d[b] = a;
        }
        return d
      };

      // setup 
      var grid = $('.grid-random');
      grid.removeClass('wrapper grid-uniform');
      var items = grid.children('.large--one-quarter');

      var min_x = 0;
      var max_x = grid.width();
      var item_x = randomIntegerBt(min_x,(max_x)/4);
      var item_y = 0;
      var next_x = false;
      var rows = [[]];
      var grid_h = 0;

      var check_last_row = function(item_w) { 
        var y = false;
        var minY = 0;
        // only loop through the first row which is the previous row
        for (var i = 0; i < rows[0].length; i++) {
            
          row_item = rows[0][i];
          minY = minY < row_item.offset_y ? row_item.offset_y : minY;

          // use max_x if last item in row
          barrier = i === rows[0].length - 1 ? max_x : row_item.offset_x;
          
          // skip if starts past the edge
          if ( item_x > barrier ) { console.log('skip');
            continue; 
          }

          // if fits, get y value
          if ( item_w < ( barrier - item_x ) ) {
            y = minY;
            break;
          }
        }
        return y;
      }

      // re-size using classes
      var widths = [
        '20%',
        '25%',
        '33%',
        '33%',
        '33%',
        '41.66%'
      ];
      var maxItemWidth = max_x/2.5 < 600 ? max_x/3 : 600;
      var minItemWidth = max_x/5 > 200 ? max_x/5 : 200;
      items.each(function(){
        var $this = $(this);
        $this
          .removeClass('large--one-quarter')
          .css({
            width: function(){
              return widths[randomIntegerBt(0,widths.length-1)];
            }
          });
      });

      // shuffle items      
      items = shuffleArray(items);

      // position items
      grid.imagesLoaded(function(){ 
                
        // loop
        items.each(function(index){ //console.log(index); //debugger;
          var item = $(this);
          var item_w = item.outerWidth(); //console.log(item.find('a').attr('href'));
          var item_h = item.outerHeight();
          var start_new_row = function() {
            item_x = randomIntegerBt(0,max_x/8);
            rows.push([]); // add new row
            if (rows.length > 2 ){
              rows.shift(); 
            }
          }

          // new row ?
          if (item_x + item_w > max_x) {
            start_new_row();
          }          

          // if not first row, get y
          if (rows.length > 1){
            var useable_y = check_last_row(item_w, item_x);
            if (useable_y === false){
              start_new_row();
              item_y = rows[0][0].offset_y; // get bottom edge of first item in next row
            } else {
              item_y = useable_y;
            }
          }
          item_y = randomIntegerBt(0,3) > 0 ? item_y + randomIntegerBt(0,max_x/12) : item_y ;
          
          // position it!
          item.css({ position: 'absolute', left:item_x, top:item_y});

          // store item in last row
          var item_pos = { 
            offset_x: item_x + item_w, 
            offset_y: item_y + item_h 
          };
          rows[rows.length-1].push(item_pos);
          
          // update vars
          item_x = next_x !== false ? next_x : item_x + item_w;
          next_x = false;
          grid_h = ( item_y + item_h ) > grid_h ? item_y + item_h : grid_h;

        });

        // update grid height
        grid.css('height',grid_h);

        // fade in
        items.animate({opacity: 1}, 600);

      });

  }

});