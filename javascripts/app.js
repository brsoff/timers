var app = {
  initialize: function () {
    this.display = new app.Display ();
    app.bind();

    app.Timer.prototype.startCountdown = function() {
      var self = this;

      self.populateTimer();
      self.countdown = setInterval(function () {
        self.populateTimer()
      }, 1000);
    },

    app.Timer.prototype.restartCountdown = function() {
      self.countdown = setInterval(function () {
        self.populateTimer()
      }, 1000);
    },

    app.Timer.prototype.populateTimer = function () {
      var self = this;
      var id = self.id;

      self.secondsRemaining -= 1;

      var remaining = self.secondsRemaining;

      if (remaining < 0) {
        $('[data-id=' + id + ']').addClass('expired');
      } else {
        var hours = self.formatNumber(remaining / 3600);
        remaining = remaining % 3600;

        var minutes = self.formatNumber(remaining / 60);
        var seconds = self.formatNumber(remaining % 60);

        var $timer = $('[data-id=' + id + ']');

        $timer.find('.hour').html(hours);
        $timer.find('.minute').html(minutes);
        $timer.find('.second').html(seconds);
      }
    },

    app.Timer.prototype.formatNumber = function (num) {
      var parsed = parseInt(num).toString();
      var formatted = parsed.length === 1 ? ('0' + parsed) : parsed
      return formatted;
    }
  },

  bind: function () {
    $('[data-behavior=\'add-timer\'').on('click', function () {
      app.makeTimer();
    });
  },

  makeTimer: function () {
    var timer = new app.Timer();

    app.display.timers.push(timer);

    var source = $("#timer-template").html();
    var template = Handlebars.compile(source);
    var html = template(timer);

    $('[data-target=\'timers\']').append(html);

    app.bindTimerBehaviors(timer.id);
  },

  bindTimerBehaviors: function (id) {
    $('[data-behavior=\'start-timer-' + id + '\'').on('click', function () {
      var id = $(this).closest('.timer').data('id');
      var minutes = $(this).prev().val();

      app.setTimer(id, minutes);
    });

    $('[data-behavior=\'pause-timer-' + id + '\'').on('click', function () {
      var id = $(this).closest('.timer').data('id');
      console.log('pause');
      app.pauseTimer(id);
    });

    $('[data-behavior=\'play-timer-' + id + '\'').on('click', function () {
      var id = $(this).closest('.timer').data('id');
      console.log('play');
      app.playTimer(id);
    });
  },

  pauseTimer: function (id) {
    var timer = app.getTimer(id);
    timer.paused = true;
    clearInterval(timer.countdown);
  },

  playTimer: function (id) {
    var timer = app.getTimer(id);
    timer.startCountdown();
  },

  setTimer: function (id, minutes) {
    var timer = app.getTimer(id);
    var startedAt = new Date().getTime();
    var expiresAt = (startedAt + (minutes * 60 * 1000)) / 1000;

    timer.minutes = parseInt(minutes);
    timer.seconds = timer.minutes * 60;
    timer.secondsRemaining = expiresAt - (startedAt / 1000);
    timer.startCountdown();
  },

  getTimer: function (id) {
    var timer = app.display.timers.filter(function (c) { return c.id === id; });
    return timer[0];
  },

  Display: function () {
    this.timers = [];
  },

  Timer: function (name) {
    var self = this;

    self.id = app.display.timers.length + 1;
    self.name = 'Timer #' + self.id;
    self.minutes = null;
    self.seconds = null;
    self.secondsRemaining = null;
    self.elapsedSeconds = null;
    self.countdown = null;
    self.paused = false;
  }
}

$(function () {
  app.initialize();
});
