var app = {};

app._body = $('body');

app.utils = {

  randomIntegerBt: function (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  },

  shuffleArray: function (d) {
    for (var c = d.length - 1; c > 0; c--) {
      var b = Math.floor(Math.random() * (c + 1));
      var a = d[c];
      d[c] = d[b];
      d[b] = a;
    }
    return d;
  },
};

app.artGrid = {

  _grid: $('.art-grid'),
  _items: $('.art-grid').children('.grid__item'),
  _widths: ['20%', '33%', '33%', '33%', '33%', '41.66%', '41.66%'],

  getItemTopPosition: function (rows, itemX, itemW, maxX) {
    var y = false;
    var minY = 0;
    // only loop through the first row which is the previous row
    for (var i = 0; i < rows[0].length; i++) {
      rowItem = rows[0][i];
      minY = minY < rowItem.offset_y ? rowItem.offset_y : minY;

      // use maxX if last item in row
      barrier = i === rows[0].length - 1 ? maxX : rowItem.offset_x;

      // skip if starts past the edge
      if ( itemX > barrier ) {
        continue;
      }

      // if fits, get y value
      if ( itemW < ( barrier - itemX ) ) {
        y = minY;
        break;
      }
    }
    return y;
  },

  resizeItem: function ($item) {
    var widths = app.artGrid._widths;
    $item
      .removeClass('large--one-quarter')
      .css({
        width: function () {
          return widths[app.utils.randomIntegerBt(0, widths.length-1)];
        },
      });
  },

  showItems: function (bool) {
    bool = typeof bool === 'undefined' ? true : false;
    this._items.toggleClass('visible', bool);
  },

  layout: function () {
    // setup
    var grid = app.artGrid._grid;
    var items = app.artGrid._items;
    var randNumb = app.utils.randomIntegerBt;

    if ( $(window).width() > 768 ) {
        var rows = [[]];
        var minX = 0;
        var maxX = grid.width();
        var itemX = randNumb(minX, maxX/4);
        var itemY = 0;
        var gridHeight = 0;
        var gridBottomMargin = 100;

        // re-size items
        items.each( function () {
          app.artGrid.resizeItem( $(this) );
        });

        // shuffle items
        items = app.utils.shuffleArray(items);

        // images loaded ?
        grid.imagesLoaded( function () {
          // position each item
          items.each( function (index) { //console.log(index); //debugger;
            var item = $(this);
            var itemW = item.outerWidth(); //console.log(item.find('a').attr('href'));
            var itemH = item.outerHeight();
            var startNewRow = function () {
              itemX = randNumb(0, maxX/8);
              rows.push([]); // add new row
              if (rows.length > 2 ) {
                rows.shift();
              }
            };

            // new row ?
            if (itemX + itemW > maxX) {
              startNewRow();
            }

            // if not first row, get y
            if (rows.length > 1) {
              var useableY = app.artGrid.getItemTopPosition(rows, itemX, itemW, maxX);
              if (useableY === false) {
                startNewRow();
                itemY = rows[0][0].offset_y; // get bottom edge of first item in next row
              } else {
                itemY = useableY;
              }
            }
            itemY = randNumb(0, 3) > 0 ? itemY + randNumb(0, maxX/12) : itemY;

            // position it!
            item.css({left: itemX, top: itemY});

            // store item in last row
            var itemPos = {
              offset_x: itemX + itemW,
              offset_y: itemY + itemH,
            };
            rows[rows.length-1].push(itemPos);

            // update vars
            itemX = itemX + itemW;
            gridHeight = ( itemY + itemH ) > gridHeight ? itemY + itemH : gridHeight;
          });

          // update grid height
          grid.css('height', gridHeight + gridBottomMargin).addClass('art-grid--enabled').removeClass('wrapper grid-uniform');

          // fade in
          app.artGrid.showItems();
        });
    } else {
      this.remove();
    }
  },

  remove: function () {
    this._grid.removeClass('art-grid--enabled').addClass('grid-uniform');
    this._items.removeAttr('style');
    this.showItems();
  },
};

app.colorBar = function (y) {
  y = typeof y === 'undefined' ? $(window).scrollTop() : y;
  if ( y + $(window).height() < $('#colorBarStatic').offset().top ) {
    app._body.addClass('colorbar-fixed');
  } else {
    app._body.removeClass('colorbar-fixed');
  }
};

app.over18check = function () {
  var overlay = $('#overlay18Plus');
  if ( overlay.length > 0 ) {
    var over18 = sessionStorage.getItem('over18'); console.log('over 18?: ' + over18);
    if (over18 === null || over18 !== 'true') {
      overlay.removeClass('visually-hidden');
    }
    $(document).on('click', '#confirmOver18', function () {
      sessionStorage.setItem('over18', true);
      overlay.addClass('visually-hidden');
    });
    $(document).on('click', '#denyOver18', function () {
      sessionStorage.setItem('over18', false);
      overlay.attr('data-state', 'locked');
    });
  }
};

app.scrollHandler = function () {
  var y = $(window).scrollTop();
  app.colorBar(y);
};

// INIT ==================================

$(function () {
  app.artGrid.layout();
  app.colorBar();
  app.over18check();

  var resizeTO;
  $(window).resize(function () {
    if ( $(window).width() > 768 ) {
      app.artGrid.showItems(false);
    };
    clearTimeout(resizeTO);
    resizeTO = setTimeout(function () {
      app.artGrid.layout();
    }, 500);
  });

  $(window).scroll(app.scrollHandler);
});
