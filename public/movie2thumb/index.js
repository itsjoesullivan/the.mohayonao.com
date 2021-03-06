(function() {
  $(function() {
    'use strict';
    var App, THUMB_SIZE, app, resizeContainer, shuffle;
    THUMB_SIZE = 80;
    $(window).on('dragover', function() {
      return false;
    });
    $(window).on('drop', function(e) {
      if (app && createObjectURL) {
        app.preview(e.originalEvent.dataTransfer.files[0], (function(_this) {
          return function() {
            return app.getImage();
          };
        })(this));
      }
      return false;
    });
    resizeContainer = (function() {
      var $container;
      $container = $('#app');
      return function() {
        $container.height(($container.width() * 0.75) | 0);
        return typeof app !== "undefined" && app !== null ? app.resize() : void 0;
      };
    })();
    $(window).on('resize', resizeContainer);
    resizeContainer();
    if (!createObjectURL) {
      return;
    }
    $('#shuffle').on('change', function() {
      return app.shuffle = !!$(this).attr('checked');
    });
    shuffle = function(array) {
      var i, j, _ref;
      i = array.length;
      while (i) {
        j = Math.floor(Math.random() * i--);
        _ref = [array[j], array[i]], array[i] = _ref[0], array[j] = _ref[1];
      }
      return array;
    };
    App = (function() {
      function App(target) {
        this.target = target;
        this.video = null;
        this.count = 0;
        this.canvas = document.createElement('canvas');
        this.canvas = this.canvas;
        this.context = this.canvas.getContext('2d');
        this.shuffle = false;
        this.resize();
      }

      App.prototype.resize = function() {
        $(this.canvas).width((this.canvas.width = this.width = $(this.target).width()));
        return $(this.canvas).height(this.canvas.height = this.height = $(this.target).height());
      };

      App.prototype.preview = function(file, callback) {
        var type, video;
        video = document.createElement('video');
        type = file.type.substr(0, 5);
        this.video = null;
        this.list = [];
        if (type === 'video' && video.canPlayType(file.type)) {
          $(video).on('loadeddata', (function(_this) {
            return function() {
              _this.initCanvas();
              return _this.seek(callback);
            };
          })(this));
          $(video).on('seeked', (function(_this) {
            return function() {
              return _this.draw(function() {
                return _this.seek(callback);
              });
            };
          })(this));
          video.type = file.type;
          video.src = createObjectURL(file);
          this.video = video;
        }
        return this.count = 0;
      };

      App.prototype.getImage = function() {
        var image;
        image = new Image;
        image.onload = (function(_this) {
          return function() {
            return $(_this.target).empty().append(image);
          };
        })(this);
        return image.src = this.canvas.toDataURL('image/jpeg');
      };

      App.prototype.initCanvas = function() {
        var ch, cw, h, i, vh, vw, w, _ref, _ref1, _ref2, _ref3, _ref4;
        $(this.target).empty().append(this.canvas);
        _ref = [this.video.videoWidth, this.video.videoHeight], vw = _ref[0], vh = _ref[1];
        _ref1 = [THUMB_SIZE, THUMB_SIZE], cw = _ref1[0], ch = _ref1[1];
        if (vw > vh) {
          h = cw * (vh / vw);
          _ref2 = [cw, h], this.dw = _ref2[0], this.dh = _ref2[1];
        } else {
          w = ch * (vw / vh);
          _ref3 = [w, ch], this.dw = _ref3[0], this.dh = _ref3[1];
        }
        this.dw |= 0;
        this.dh |= 0;
        this.lenX = Math.ceil(this.width / this.dw);
        this.lenY = Math.ceil(this.height / this.dh);
        this.context.clearRect(0, 0, cw, ch);
        _ref4 = [vw, vh], this.sw = _ref4[0], this.sh = _ref4[1];
        this.list = (function() {
          var _i, _ref5, _results;
          _results = [];
          for (i = _i = 0, _ref5 = this.lenX * this.lenY; 0 <= _ref5 ? _i < _ref5 : _i > _ref5; i = 0 <= _ref5 ? ++_i : --_i) {
            _results.push(this.video.duration * (i / (this.lenX * this.lenY)));
          }
          return _results;
        }).call(this);
        if (this.shuffle) {
          return this.list = shuffle(this.list);
        }
      };

      App.prototype.seek = function(callback) {
        var time;
        time = this.list.shift();
        if (!this.video || time === void 0) {
          return typeof callback === "function" ? callback() : void 0;
        }
        return this.video.currentTime = time;
      };

      App.prototype.draw = function(callback) {
        var x, y;
        x = this.count % this.lenX;
        y = (this.count / this.lenX) | 0;
        this.context.drawImage(this.video, 0, 0, this.sw, this.sh, this.dw * x, this.dh * y, this.dw, this.dh);
        this.count += 1;
        return typeof callback === "function" ? callback() : void 0;
      };

      return App;

    })();
    return app = new App(document.getElementById('thumbs'));
  });

}).call(this);
