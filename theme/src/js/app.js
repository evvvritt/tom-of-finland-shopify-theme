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
  _widths: ['two-twelfths', 'three-twelfths', 'three-twelfths', 'four-twelfths', 'four-twelfths', 'four-twelfths', 'four-twelfths', 'five-twelfths'],

  resizeItem: function ($item) {
    var widths = app.artGrid._widths;
    $item
      .removeClass('large--one-quarter')
      .addClass(function () {
        return 'large--'+widths[app.utils.randomIntegerBt(0, widths.length-1)];
      });
  },

  showItems: function (bool) {
    bool = typeof bool === 'undefined' ? true : false;
    this._items.toggleClass('visible', bool);
  },

  layout: function () {
    var grid = app.artGrid._grid;
    var items = app.artGrid._items;

    if (grid.length > 0) {
      grid.imagesLoaded( function () {
        //app.utils.shuffleArray(items);

        // re-size items
        items.each( function () {
          app.artGrid.resizeItem( $(this) );
        });

        var Shuffle = window.shuffle;
        var grid = document.querySelector('.art-grid');
        new Shuffle(grid, {
          itemSelector: '.art-grid .grid__item',
          sizer: '.art-grid--sizer',
          initialSort: {
            randomize: true,
          },
        });

        // fade in
        app.artGrid.showItems();
      });
    }
  },

  remove: function () {
    this._grid.removeClass('art-grid--enabled').addClass('grid-uniform');
    this._items.removeAttr('style');
    this.showItems();
  },
};

app.lbox = function () {
  var lbox = $('#lightbox');
  var body = $('body');
  var closeLbox = function () {
    body.removeClass('lightbox-visible');
  }
  // open lightbox
  $(document).on('click', '[data-lbox]', function () {
    var winW = $(window).width()
    var src = winW > 768 ? $(this).attr('data-lbox') : $(this).attr('data-lbox-m');
    body.addClass('lightbox-visible');
    lbox.find('.content').css('background-image', 'url('+src+')').html('<img src="'+src+'" >');
    lbox.toggleClass('img-can-overflow', function() {
      return winW > 768
    });
  });
  // update featured image lightbox data
  $(document).on('click', 'a.product-single__thumbnail', function () {
    $('#featuredImgLink').attr('data-lbox', $(this).data('lbox-asset')).attr('data-lbox-m', $(this).data('lbox-m-asset'));
  });
  // rescale
  $(document).on('click', '#lightbox .content', function () {
    if (lbox.hasClass('img-can-overflow')) {
      lbox.removeClass('img-can-overflow').scrollTop(0);
    } else {
      lbox.addClass('img-can-overflow');
      var scrollY = lbox.find('.content').outerHeight() - lbox.height();
      var scrollX = lbox.find('.content').outerWidth() - lbox.width();
      lbox.scrollTop(scrollY/2).scrollLeft(scrollX/2);
    }
  });
  // close
  $(document).on('click', '#closeLightboxBtn', closeLbox);
  $(document).on('keydown', function(e) {
    if (e.keyCode === 27) closeLbox()
  });
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
  app.lbox();

  $(window).scroll(app.scrollHandler);
});
