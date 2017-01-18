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
        'three-twelfths',
        'three-twelfths',
        'four-twelfths',
        'four-twelfths',
        'five-twelfths',
        //'six-twelfths',
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

      //// re-size using classes
      //items.each(function(){
        //var $this = $(this);
        //var randIndex = randomIntFromInterval(0, widths.length - 1);
        //// re-generate sizes
        //$this
          //.removeClass('large--one-quarter')
          //.addClass('large--'+widths[randIndex])
          ////.css('padding',function(){
            ////return randomIntFromInterval(3,8) + 'em';
          ////});
      //});

      // shuffle items      
      //items = shuffleArray(items);

      // position items
      grid.imagesLoaded(function(){
        
        // lock height in
        var grid_h = grid.height();
        var grid_w = grid.width();
        grid.css('height', grid_h);

        // set up
        var min_x = 0;
        var max_x = grid_w;
        var min_y = 0;
        var max_y = grid_h * .75;

        // position em
        items.click(function(){
          var $this = $(this);
          var width = $this.width();
          var height = $this.height();
          var rand_x=0;
          var rand_y=0;
          var area;
          do {
              rand_x = randomIntFromInterval(min_x, max_x);
              rand_y = randomIntFromInterval(min_y, max_y);
              area = {x: rand_x, y: rand_y, width: width, height: height};
          } while(check_overlap(area));

          filled_areas.push(area);
          // position it !
          $(this).css({left:rand_x, top: rand_y, position: 'absolute'});
        });
      });

    });