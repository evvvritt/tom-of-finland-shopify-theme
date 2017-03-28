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
  _item: $('.art-grid').children('.grid__item'),
  _widths: ['two-twelfths', 'three-twelfths', 'three-twelfths', 'four-twelfths', 'four-twelfths', 'four-twelfths', 'four-twelfths', 'five-twelfths'],
  _minWinWidth: 768,
  _shuffle: null,

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
    $('.art-grid').find('.grid__item').toggleClass('visible', bool);
  },

  layout: function ($container, callback) {
    var grid = typeof $container === 'undefined' ? this._grid : $container;
    var items = grid.find('.grid__item');

    if (grid.length > 0) {
      grid.imagesLoaded( function () {
        // re-size items
        items.each( function () {
          app.artGrid.resizeItem( $(this) );
        });

        // shuffle with Shuffle js
        var Shuffle = window.shuffle;
        // var grid = document.querySelector('.art-grid');
        app.artGrid._shuffle = new Shuffle(grid, {
          itemSelector: '.grid__item',
          sizer: '.art-grid--sizer',
          initialSort: {
            randomize: true,
          },
        });

        // fade in
        app.artGrid.showItems();

        // callback
        if (typeof callback === 'function') callback();
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
  };
  // open lightbox
  $(document).on('click', '[data-lbox]', function () {
    var isMobile = $(window).width() <= 768;
    var src = isMobile ? $(this).attr('data-lbox-m') : $(this).attr('data-lbox');
    body.addClass('lightbox-visible');
    lbox.find('.content').css('background-image', 'url('+src+')').html('<img src="'+src+'" >');
    lbox.toggleClass('img-can-overflow', isMobile);
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
  $(document).on('keydown', function (e) {
    if (e.keyCode === 27) closeLbox();
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

app.applyAppClasses = function () {
  // add classes for app pages (gift registry)
  var path = window.location.pathname;
  if (path.indexOf('/apps/') === 0 && path.split('/').length >= 3) {
    app._body.addClass('template-app-' + path.split('/')[2]);
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

app.searchBar = function () {
  $(document).on('click', '.site-header__search-bar-toggle', function () {
    $('#headerSearchBar').toggle().find('input[type="search"]').focus();
  });
};

app.infiniteScroll = {
  //loading: false,
  nextPageUrl: $('.pagination .next a').attr('href'),
  onScroll: function (pageY) {
    if (this.nextPageUrl && !app._body.hasClass('infscroll-loading') && $(window).width() >= 768) {
      if (pageY + $(window).height() >= $(document).height() - $(window).height() / 4 ) {
        app._body.addClass('infscroll-loading');
        $.ajax({
          url: this.nextPageUrl,
          success: function (data) {
            // update pagination
            var $pagination = $(data).find('.pagination');
            if ($pagination) {
              $('.pagination').replaceWith($pagination);
              app.infiniteScroll.nextPageUrl = $pagination.find('.next a').attr('href');
            } else {
              $('.pagination').remove();
            }
            // add content
            var $container = $(data).find('.ajax-container');
            var $currentContainer = $('.ajax-container').last();
            $currentContainer.after($container);
            // art grid ?
            if ($currentContainer.hasClass('art-grid')) {
              app.artGrid.layout($container, function () {
                app._body.removeClass('infscroll-loading');
              });
            } else {
              app._body.removeClass('infscroll-loading');
            }
          },
        });
      }
    }
  },
};

app.scrollHandler = function () {
  var y = $(window).scrollTop();
  app.colorBar(y);
  app.infiniteScroll.onScroll(y);
};

// INIT ==================================

$(function () {
  app.artGrid.layout();
  app.colorBar();
  app.over18check();
  app.lbox();
  app.searchBar();
  app.applyAppClasses();

  $(window).scroll(app.scrollHandler);
  console.log('dev?:' + sessionStorage.dev );
});
