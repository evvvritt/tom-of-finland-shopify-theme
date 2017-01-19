var app = {};

app.utils = {

  randomIntegerBt: function(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
  },

  shuffleArray: function(d) {
    for (var c = d.length - 1; c > 0; c--) {
      var b = Math.floor(Math.random() * (c + 1));
      var a = d[c];
      d[c] = d[b];
      d[b] = a;
    }
    return d
  },

}

app.artGrid = {

  _grid: '.art-grid',
  _item_selector: '.grid__item',
  _widths: [ '20%', '25%', '33%', '33%', '33%', '41.66%' ],

  getItemTopPosition: function(rows, item_x, item_w) { 
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
  },

  resizeItem: function ($item) {
    var widths = app.artGrid.widths;
    $item
      .removeClass('large--one-quarter')
      .css({
        width: function(){
          return widths[rand_numb(0,widths.length-1)];
        }
      });
  },

  showItems: function (binary) {
    binary = typeof binary === 'undefined' ? 1 : 0 ;
    $(app.artGrid._item_selector).animate({opacity:binary},600);
  },

  init: function () {

    // setup
    var grid = $(app.artGrid._grid);
    var items = grid.children(app.artGrid._item_selector);
    var rand_numb = app.utils.randomIntegerBt;

    if ( $(window).width() > 768 ) {

        var min_x = 0;
        var max_x = grid.width();
        var item_x = rand_numb(min_x,(max_x)/4);
        var item_y = 0;
        var rows = [[]];
        var grid_h = 0;

        // shuffle items      
        items = app.utils.shuffleArray(items);

        // re-size items
        items.each( app.artGrid.resizeItem( $(this) ) );

        // images loaded ?
        grid.imagesLoaded(function(){ 
                  
          // position each item 
          items.each(function(index){ //console.log(index); //debugger;
            
            var item = $(this);
            var item_w = item.outerWidth(); //console.log(item.find('a').attr('href'));
            var item_h = item.outerHeight();
            var start_new_row = function() {
              item_x = rand_numb(0,max_x/8);
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
              var useable_y = app.artGrid.getItemTopPosition(rows, item_x, item_w);
              if (useable_y === false){
                start_new_row();
                item_y = rows[0][0].offset_y; // get bottom edge of first item in next row
              } else {
                item_y = useable_y;
              }
            }
            item_y = rand_numb(0,3) > 0 ? item_y + rand_numb(0,max_x/12) : item_y ;
            
            // position it!
            item.css({ left:item_x, top:item_y});

            // store item in last row
            var item_pos = { 
              offset_x: item_x + item_w, 
              offset_y: item_y + item_h 
            };
            rows[rows.length-1].push(item_pos);
            
            // update vars
            item_x = item_x + item_w;
            grid_h = ( item_y + item_h ) > grid_h ? item_y + item_h : grid_h;

          });

          // update grid height
          grid.css('height',grid_h).addClass('art-grid--enabled').removeClass('wrapper grid-uniform');

          // fade in
          app.artGrid.showItems();

        });

    } else { // < 768

      grid.removeClass('art-grid--enabled').addClass('wrapper grid-uniform');
      app.artGrid.showItems();

    }

  } // init

};

// ==================================

$(function(){
  app.artGrid.init();
  //var resizeTO;
  //$(window).resize(function(){
    //app.artGrid.showItems(0);
    //clearTimeout(resizeTO);
    //resizeTO = setTimeout(function(){
      //app.artGrid.init();
    //},500);
  //});
});