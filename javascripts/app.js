var app = {
  initialize: function () {
    this.display = new app.Display ();
    app.bind();

    app.Clock.prototype.countdown = function() {
      var self = this;

      self.populateClock();

      setInterval(function () {
        self.populateClock();
      }, 1000);
    },

    app.Clock.prototype.populateClock = function () {
      var self = this;

      var id = self.id;
      var current = (new Date().getTime() / 1000);
      var remaining = (self.expiresAt - current); //seconds

      if (remaining < 1) {
        $('[data-id=' + id + ']').addClass('expired');
      } else {
        var hours = self.formatNumber(remaining / 3600);
        remaining = remaining % 3600;

        var minutes = self.formatNumber(remaining / 60);
        var seconds = self.formatNumber(remaining % 60);

        var $clock = $('[data-id=' + id + ']');

        $clock.find('.hour').html(hours);
        $clock.find('.minute').html(minutes);
        $clock.find('.second').html(seconds);
      }
    },

    app.Clock.prototype.formatNumber = function (num) {
      var parsed = parseInt(num).toString();
      var formatted = parsed.length === 1 ? ('0' + parsed) : parsed
      return formatted;
    }
  },

  bind: function () {
    $('[data-behavior=\'add-clock\'').on('click', function () {
      var name = window.prompt('Please type a name for this clock:');
      app.makeClock(name);
    });
  },

  makeClock: function (name) {
    var clock = new app.Clock(name);

    app.display.clocks.push(clock);

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
  },

  setTimer: function (id, minutes) {
    var clock = app.display.clocks.filter(function (c) { return c.id === id; });
    var startsAt = new Date().getTime();
    var expiresAt = (startsAt + (minutes * 60 * 1000)) / 1000;

    clock[0].minutes = parseInt(minutes);
    clock[0].expiresAt = startsAt;
    clock[0].expiresAt = expiresAt;
    clock[0].countdown();
  },

  Display: function () {
    this.clocks = [];
  },

  Clock: function (name) {
    var self = this;

    self.id = app.display.clocks.length + 1;
    self.name = name;
    self.startsAt = null;
    self.expiresAt = null;
    self.minutes = null;
  }
}

$(function () {
  app.initialize();
});
