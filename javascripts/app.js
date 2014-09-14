var app = {
  initialize: function () {
    this.display = new app.Display ();
    app.bind();
  },

  bind: function () {
    $('[data-behavior=\'add-clock\'').on('click', function () {
      var name = window.prompt('Please type a name for this clock:');
      var clock = new app.Clock (name);

      app.display.clocks.push(clock);
      app.makeClock(clock);
    });
  },

  setTimer: function (id, minutes) {
    var target = ((new Date().getTime()) + (minutes * 60 * 1000)) / 1000;

    setInterval(function () {
      var current = (new Date().getTime() / 1000);
      var remaining = (target - current);

      if (remaining < 0) {
        $('[data-id=' + id + ']').addClass('expired');
      } else {
        var hours = parseInt(remaining / 3600);
        var minutes = parseInt(remaining / 60);
        var seconds = parseInt(remaining % 60);

        $('[data-id=' + id + ']').find('.hour').html(hours);
        $('[data-id=' + id + ']').find('.minute').html(minutes);
        $('[data-id=' + id + ']').find('.second').html(seconds);
      }
    }, 1000);
  },

  Display: function () {
    this.clocks = [];
  },

  Clock: function (name) {
    this.id = app.display.clocks.length + 1;
    this.name = name;
    this.begin = '';
  },

  makeClock: function (clock) {
    var source = $("#clock-template").html();
    var template = Handlebars.compile(source);
    var html = template(clock);

    $('[data-target=\'clocks\']').append(html);
    app.bindClockBehaviors();
  },

  bindClockBehaviors: function () {
    $('[data-behavior=\'begin\'').on('click', function () {
      var id = $(this).closest('.clock').data('id');
      var minutes = $(this).prev().val();

      app.setTimer(id, minutes);
    });
  }
}

$(function () {
  app.initialize();
});
