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
  _widths: ['25%', '33.33%', '33.33%', '33.33%', '41.66%'],

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
    if ( $(window).width() > 768 ) {
      var grid = app.artGrid._grid;
      var items = app.artGrid._items;

      grid.imagesLoaded( function () {
        app.utils.shuffleArray(items);

        // re-size items
        items.each( function () {
          app.artGrid.resizeItem( $(this) );
        });

        //var Shuffle = window.shuffle;
        //var element = document.querySelector('.art-grid');

        //var shuffle = new Shuffle(element, {
          //itemSelector: '.art-grid .grid__item',
          //sizer: '.art-grid--sizer', //sizer // could also be a selector: '.my-sizer-element'
        //});

        // fade in
        app.artGrid.showItems();
      });
    } else {
      //this.remove();
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
