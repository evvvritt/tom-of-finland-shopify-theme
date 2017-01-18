$(function(){
      var widths = [
        //'one-third',
        //'two-thirds',
        //'one-quarter',
        //'two-quarters',
        ////'three-quarters',
        //'one-fifth',
        //'two-fifths',
        ////'three-fifths',
        ////'four-fifths',
        //'one-sixth',
        //'two-sixths',
        ////'three-sixths',
        ////'four-sixths',
        ////'five-sixths',
        ////'one-eighth',
        //'two-eighths',
        //'three-eighths',
        ////'four-eighths',
        ////'five-eighths',
        ////'six-eighths',
        ////'seven-eighths',
        ////'one-tenth',
        //'two-tenths',
        //'three-tenths',
        //'four-tenths',
        ////'five-tenths',
        ////'six-tenths',
        ////'seven-tenths',
        ////'eight-tenths',
        ////'nine-tenths',
        //'one-twelfth',
        'two-twelfths',
        //'three-twelfths',
        'three-twelfths',
        //'four-twelfths',
        'four-twelfths',
        'five-twelfths',
        'six-twelfths',
        //'seven-twelfths',
        //'eight-twelfths'
      ];
      var randomIntFromInterval = function(min,max)
      {
          return Math.floor(Math.random()*(max-min+1)+min);
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

      // check for overalps function
      var filled_areas = new Array();
      var check_overlap = function(area) {
        for (var i = 0; i < filled_areas.length; i++) {
            
          check_area = filled_areas[i];
          
          var bottom1 = area.y + area.height;
          var bottom2 = check_area.y + check_area.height;
          var top1 = area.y;
          var top2 = check_area.y;
          var left1 = area.x;
          var left2 = check_area.x;
          var right1 = area.x + area.width;
          var right2 = check_area.x + check_area.width;
          if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2) {
              continue;
          }
          return true;
        }
        return false;
      }

      // setup 
      var grid = $('.grid-chaos');
      var items = grid.children('.large--one-quarter');

      var min_x = 0;
      var max_x = grid.width();
      var item_x = min_x;
      var item_y = 0;
      var rows = [[]];

      var check_last_row = function(item_width) { 
        var y = false;
        // only loop through the first row which is the previous row
        for (var i = 0; i < rows[0].length; i++) {
            
          row_item = rows[0][i];

          // use max_x if last item in row
          barrier = i === rows[0].length - 1 ? max_x : row_item.offset_x;
          
          // skip if starts past the edge
          if ( item_x > barrier ) { console.log('skip');
            continue; 
          }

          // if fits, get y value
          if ( item_width < ( barrier - item_x ) || item_width < row_item) {
            y = row_item.bottom_y;
            break;
          }
        }
        return y;
      }

      // re-size using classes
      var maxItemWidth = max_x/3.5 > 600 ? max_x/3 : 600;
      items.each(function(){
        var $this = $(this);
        var randIndex = randomIntFromInterval(0, widths.length - 1);
        $this
          .removeClass('large--one-quarter')
          .css({
            width: function(){
              return randomIntFromInterval(parseInt(max_x/6), maxItemWidth);
            },
            padding: function(){
              return randomIntFromInterval(1,2) + 'em';
            }
          });
      });

      // shuffle items      
      items = shuffleArray(items);

      // position items
      grid.imagesLoaded(function(){ 
        
        var firstItem = true;
        var grid_h = 0;
        
        // loop
        items.each(function(index){ //console.log(index); //debugger;
          var item = $(this);
          var item_w = item.outerWidth(); //console.log(item.find('a').attr('href'));
          var item_h = item.outerHeight();
          var start_new_row = function() {
            item_x = min_x; // reset x pos
            rows.push([]); // add new row
            if (rows.length > 2 ){
              rows.shift(); 
            }
          }

          if (firstItem) {
            item_x = firstItem ? randomIntFromInterval(0,(max_x - item_w)/3) : item_x;  
            firstItem = false;
          }

          // new row ?
          if (item_x + item_w > max_x) {
            start_new_row(); console.log('start new row');
          }

          // if not first row, get y
          if (rows.length > 1){
            var useable_y = check_last_row(item_w);
            if (useable_y === false){ console.log('cant fit');
              start_new_row();
              item_y = rows[0][0].bottom_y; // get bottom edge of first item in next row
            } else {
              item_y = useable_y;
            }
          }
                    
          // position it!
          item.css({ position: 'absolute', left:item_x, top:item_y, opacity: 1 });

          // store item in last row
          var item_pos = { offset_x: item_x + item_w, bottom_y: item_y + item_h };
          rows[rows.length-1].push(item_pos);
          
          // update vars
          item_x = item_x + item_w;
          grid_h = ( item_y + item_h ) > grid_h ? item_y + item_h : grid_h;

        });

        // update grid height
        grid.css('height',grid_h);

      });

    });