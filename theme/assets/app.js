//"use strict";

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
  _widths: ['20%', '30%', '30%', '30%', '40%'],

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
        var placedItems = [];
        var minX = 0;
        var maxX = grid.width();
        var itemX = randNumb(minX, maxX/12);
        var itemY = 0;
        var gridHeight = 0;
        var gridBottomMargin = 100;

        // prepare grid
        this._grid.addClass('art-grid--enabled').removeClass('wrapper grid-uniform');

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

            if (placedItems.length > 0) {
              for (var i = 0; i < placedItems.length; i++) {
                //var thisPt = placedItems[i];
                //var nextPt = placedItems[i+1];
              };  
            }

            // position it!
            item.css({left: itemX, top: itemY});

            var itemBottomPos = {
              x1: itemX,
              x2: itemX+itemW,
              y: itemY+itemH,
              width: item
            }
            borderPts.push(itemBottomPos);

            // update border pts
            for (var i = 0; i < borderPts.length; i++) {
              borderPts[i]
            };

            //
            //
            //
            //
            
            var itemH = item.outerHeight();
            var startNewRow = function () {
              rows.push([]); // add new row
              if (rows.length > 2 ) {
                rows.shift();
              }
              // update x pos
              itemX = 0; //randNumb(0, maxX/8);
              //for (var i = 0; i < rows[0].length - 1; i++) {
                //var firstRowItem = rows[0][0];
                //var nextRowItem = rows[0][i+1];
                //if ( nextRowItem.bottomEdge < firstRowItem.bottomEdge ) {
                  //itemX = nextRowItem.leftEdge;
                //}
              //}
              item.prepend('new row — ');
            };
            item.prepend(' - width: '+itemW);

            // new row ?
            if (itemX + itemW > maxX) {
              startNewRow();
            }
            item.prepend(index);

            // if not first row, get y
            if (rows.length > 1) {
              var y = false;
              // loop through the items of previous row to see if fits
              for (var i = 0; i < rows[0].length; i++) {
                //var lastItemY = itemY;
                var rowItem = rows[0][i];
                var nextRowItem = rows[0][i+1];
                var itemsInRow = rows[0].length - 1;
                var isLastRowItem = i === itemsInRow;
                var rightBoundary = isLastRowItem ? maxX : nextRowItem.leftEdge; // use maxX if last item in row
                //minY = minY < rowItem.bottomEdge ? rowItem.bottomEdge : minY;

                // skip this item in the row if incoming item starts past the edge
                if ( itemX > rightBoundary ) {
                  continue;
                }

                // fits ?
                if ( itemW <= ( rightBoundary - itemX ) ) {
                  y = rowItem.bottomEdge;
                  break;
                } else { // cant fit but maybe update xpos
                  if (!isLastRowItem) itemX = rowItem.bottomEdge > nextRowItem.bottomEdge ? rowItem.rightEdge : itemX;
                }
              }
              // useable Y ?
              if (y === false) {
                startNewRow();
                itemY = rows[0][0].bottomEdge; // get bottom edge of first item in next row
              } else {
                itemY = y;
              }
            } else {
              itemY = randNumb(1, 3) > 2 ? itemY + randNumb(0, 30) : itemY;
            }

            // position it!
            item.css({left: itemX, top: itemY});

            // store item in last row
            var itemPos = {
              width: itemW,
              leftEdge: itemX,
              rightEdge: itemX + itemW,
              bottomEdge: itemY + itemH,
            };
            rows[rows.length-1].push(itemPos);

            // update vars
            itemX = itemX + itemW;
            gridHeight = ( itemY + itemH ) > gridHeight ? itemY + itemH : gridHeight;
          });

          // update grid height
          grid.css('height', gridHeight + gridBottomMargin);

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
      //app.artGrid.showItems(false);
    };
    clearTimeout(resizeTO);
    resizeTO = setTimeout(function () {
      app.artGrid.layout();
    }, 500);
  });

  $(window).scroll(app.scrollHandler);
});
