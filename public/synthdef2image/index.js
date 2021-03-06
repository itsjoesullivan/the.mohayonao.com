(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(function() {
    'use strict';
    var BinaryOpUGenMap, Box, Inlet, Outlet, SynthDefParser, SynthDefRenderer, UnaryOpUGenMap, main, render, xhr;
    $(window).on('dragover', function() {
      return false;
    });
    $(window).on('drop', function(e) {
      main(e.originalEvent.dataTransfer.files[0]);
      return false;
    });
    SynthDefParser = (function() {
      var readDefJSON, readDefListJSON, readParamsJSON, readSpecJSON, readSpecListJSON, readVariants;

      function SynthDefParser(file) {
        this.file = file;
        this.index = 0;
      }

      SynthDefParser.prototype.byte = function() {
        return this.file[this.index++];
      };

      SynthDefParser.prototype.int8 = function() {
        return this.file[this.index++];
      };

      SynthDefParser.prototype.int16 = function() {
        return (this.file[this.index++] << 8) + this.file[this.index++];
      };

      SynthDefParser.prototype.int32 = function() {
        return (this.file[this.index++] << 24) + (this.file[this.index++] << 16) + (this.file[this.index++] << 8) + this.file[this.index++];
      };

      SynthDefParser.prototype.float32 = function() {
        return new Float32Array(new Int32Array([this.int32()]).buffer)[0];
      };

      SynthDefParser.prototype.text = function() {
        var i, len;
        len = this.file[this.index++];
        return String.fromCharCode.apply(null, (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < len; i = _i += 1) {
            _results.push(this.file[this.index++]);
          }
          return _results;
        }).call(this));
      };

      SynthDefParser.prototype.toJSON = function(file) {
        var header, i, version;
        this.file = file;
        this.index = 0;
        header = ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i <= 3; i = ++_i) {
            _results.push(String.fromCharCode(this.byte()));
          }
          return _results;
        }).call(this)).join("");
        if (header !== "SCgf") {
          return null;
        }
        version = this.int32();
        if (version !== 2) {
          return null;
        }
        return {
          version: version,
          defs: readDefListJSON.call(this)
        };
      };

      readDefListJSON = function() {
        var i, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.int16(); _i < _ref; i = _i += 1) {
          _results.push(readDefJSON.call(this));
        }
        return _results;
      };

      readDefJSON = function() {
        var i, obj, p, u;
        obj = {
          name: this.text(),
          consts: (function() {
            var _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = this.int32(); _i < _ref; i = _i += 1) {
              _results.push(this.float32());
            }
            return _results;
          }).call(this)
        };
        p = this.int32();
        obj.params = readParamsJSON.call(this, p);
        u = this.int32();
        obj.specs = readSpecListJSON.call(this, u);
        obj.variants = readVariants.call(this, p);
        return obj;
      };

      readParamsJSON = function(num) {
        var i, indices, names, values, _i, _ref;
        values = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < num; i = _i += 1) {
            _results.push(this.float32());
          }
          return _results;
        }).call(this);
        indices = [];
        names = [];
        for (i = _i = 0, _ref = this.int32(); _i < _ref; i = _i += 1) {
          names.push(this.text());
          indices.push(this.int32());
        }
        return {
          names: names,
          indices: indices,
          values: values
        };
      };

      readSpecListJSON = function(num) {
        var i, _i, _results;
        _results = [];
        for (i = _i = 0; _i < num; i = _i += 1) {
          _results.push(readSpecJSON.call(this));
        }
        return _results;
      };

      readSpecJSON = function() {
        var i, input_len, inputs, name, output_len, outputs, rate, specialIndex, _i, _j;
        name = this.text();
        rate = this.int8();
        input_len = this.int32();
        output_len = this.int32();
        specialIndex = this.int16();
        inputs = [];
        for (i = _i = 0; _i < input_len; i = _i += 1) {
          inputs.push(this.int32(), this.int32());
        }
        outputs = [];
        for (i = _j = 0; _j < output_len; i = _j += 1) {
          outputs.push(this.int8());
        }
        return [name, rate, specialIndex, inputs, outputs];
      };

      readVariants = function(num) {
        var i, j, list, _i, _ref;
        list = {};
        for (i = _i = 0, _ref = this.int16(); _i < _ref; i = _i += 1) {
          list[this.text()] = [
            (function() {
              var _j, _results;
              _results = [];
              for (j = _j = 0; _j < num; j = _j += 1) {
                _results.push(this.float32());
              }
              return _results;
            }).call(this)
          ];
        }
        return list;
      };

      return SynthDefParser;

    })();
    UnaryOpUGenMap = 'neg not isnil notnil bitnot abs asfloat asint ceil floor frac sign squared cubed sqrt exp recip midicps cpsmidi midiratio ratiomidi dbamp ampdb octcps cpsoct log log2 log10 sin cos tan arcsin arccos arctan sinh cosh tanh rand rand2 linrand bilinrand sum3rand distort softclip coin digitvalue silence thru rectwindow hanwindow welchwindow triwindow ramp scurve numunaryselectors'.split(' ');
    BinaryOpUGenMap = '+ - * / / % == != < > <= >= min max & | ^ lcm gcd round roundUp trunc atan2 hypot hypotx pow << >> >>> fill ring1 ring2 ring3 ring4 difsqr sumsqr sqrsum sqrdif absdif thresh amclip scaleneg clip2 excess fold2 wrap2 firstarg randrange exprandrange numbinaryselectors'.split(' ');
    Inlet = (function() {
      function Inlet(parent, index) {
        this.parent = parent;
        this.index = index;
        this.from = [];
        this.to = [];
      }

      Inlet.prototype.getX = function() {
        var offset;
        offset = (this.index * (this.parent.width / (this.parent.inlets.length - 1))) | 0;
        return Math.ceil(this.parent.getX() + offset);
      };

      Inlet.prototype.getY = function() {
        return Math.ceil(this.parent.getY());
      };

      Inlet.prototype.render = function(context) {
        var x, y;
        x = this.getX();
        y = this.getY();
        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2, true);
        context.closePath();
        return context.fill();
      };

      return Inlet;

    })();
    Outlet = (function(_super) {
      __extends(Outlet, _super);

      function Outlet() {
        return Outlet.__super__.constructor.apply(this, arguments);
      }

      Outlet.prototype.getX = function() {
        var offset;
        offset = (this.index * (this.parent.width / (this.parent.outlets.length - 1))) | 0;
        return Math.ceil(this.parent.getX() + offset);
      };

      Outlet.prototype.getY = function() {
        return Math.ceil(this.parent.getY() + this.parent.height);
      };

      Outlet.prototype.render = function(context) {
        var inlet, x1, x2, y1, y2, _i, _len, _ref, _ref1, _ref2, _results;
        Outlet.__super__.render.call(this, context);
        if (this.to) {
          _ref = [this.getX(), this.getY()], x1 = _ref[0], y1 = _ref[1];
          _ref1 = this.to;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            inlet = _ref1[_i];
            _ref2 = [inlet.getX(), inlet.getY()], x2 = _ref2[0], y2 = _ref2[1];
            _results.push(this.bezierline(context, x1, y1, x2, y2));
          }
          return _results;
        }
      };

      Outlet.prototype.bezierline = function(context, x1, y1, x2, y2) {
        var cp1x, cp1y, cp2x, cp2y;
        cp1x = x1;
        cp1y = y2 - 15;
        cp2x = x2;
        cp2y = y1 + (y2 - y1) * 0.5;
        context.beginPath();
        context.moveTo(x1, y1);
        context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
        context.stroke();
        return context.closePath();
      };

      return Outlet;

    })(Inlet);
    Box = (function() {
      function Box(context, index, spec, x, y) {
        var i, _ref;
        this.context = context;
        this.index = index;
        this.spec = spec;
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        _ref = this.spec, this.name = _ref.name, this.rate = _ref.rate, this.spId = _ref.spId, this.inputs = _ref.inputs, this.outputs = _ref.outputs;
        this.name = this.name.replace(/^\d+_(.+)$/, '$1');
        if (this.name === 'UnaryOpUGen') {
          this.name = UnaryOpUGenMap[this.spId];
        } else if (this.name === 'BinaryOpUGen') {
          this.name = BinaryOpUGenMap[this.spId];
        }
        this.width = (function(_this) {
          return function() {
            var m, w;
            m = _this.context.measureText(_this.name);
            w = Math.ceil(m.width * 0.1) * 10 + 10;
            if (_this.rate !== 0) {
              w = Math.max(w, Math.max(_this.inputs.length, _this.outputs.length) * 15);
            }
            return Math.max(30, w);
          };
        })(this)();
        this.height = 20;
        this.inlets = (function() {
          var _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = this.inputs.length >> 1; _i < _ref1; i = _i += 1) {
            _results.push(new Inlet(this, i));
          }
          return _results;
        }).call(this);
        this.outlets = (function() {
          var _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = this.outputs.length; _i < _ref1; i = _i += 1) {
            _results.push(new Outlet(this, i));
          }
          return _results;
        }).call(this);
      }

      Box.prototype.adjust = function(val) {
        return val;
      };

      Box.prototype.getX = function() {
        return this.adjust(this.x);
      };

      Box.prototype.getY = function() {
        return this.adjust(this.y);
      };

      Box.prototype.render = function(context) {
        var x, y;
        context.save();
        x = this.getX();
        y = this.getY();
        switch (this.rate) {
          case 0:
            context.fillStyle = '#e0e0e0';
            context.fillRect(x, y, this.width, this.height);
            break;
          case 1:
            context.fillStyle = '#d0d0f0';
            context.fillRect(x, y, this.width, this.height);
            break;
          case 2:
            context.fillStyle = '#f0c0c0';
            context.fillRect(x, y, this.width, this.height);
        }
        context.fillStyle = '#333';
        context.strokeRect(x, y, this.width, this.height);
        context.fillText(this.name, x + 5, y + this.height - 5, this.width);
        this.inlets.forEach(function(inlet) {
          return inlet.render(context);
        });
        this.outlets.forEach(function(outlet) {
          return outlet.render(context);
        });
        return context.restore();
      };

      return Box;

    })();
    SynthDefRenderer = (function() {
      var layout, layoutI, layoutX, layoutY, makeBoxList, remakeSpecList;

      function SynthDefRenderer() {}

      SynthDefRenderer.prototype.toDataURL = function(json) {
        var box, boxList, name, x, y, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
        this.build(json);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context.font = '12pt normal';
        this.context.strokeStyle = '#333';
        this.context.lineWidth = 2;
        this.context.fillStyle = '#fff';
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = '#333';
        _ref = this.builded;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _ref1 = this.builded;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            _ref2 = _ref1[_j], name = _ref2.name, boxList = _ref2.boxList, x = _ref2.x, y = _ref2.y;
            this.context.fillText(name, x, y + 15);
            for (_k = 0, _len2 = boxList.length; _k < _len2; _k++) {
              box = boxList[_k];
              box.render(this.context);
            }
          }
        }
        return this.canvas.toDataURL('image/png');
      };

      SynthDefRenderer.prototype.build = function(json) {
        var boxList, def, maxX, maxY, specList, x, y;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.context.font = '12pt normal';
        maxX = maxY = 0;
        this.builded = (function() {
          var _i, _len, _ref, _results;
          _ref = json.defs;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            def = _ref[_i];
            x = maxX + 20;
            y = 10;
            specList = remakeSpecList(def);
            boxList = makeBoxList(this.context, specList);
            boxList = layout(boxList, x, y + 20);
            boxList.forEach(function(box) {
              maxX = Math.max(maxX, box.getX() + box.width);
              return maxY = Math.max(maxY, box.getY() + box.height);
            });
            _results.push({
              name: def.name,
              boxList: boxList,
              x: x,
              y: y
            });
          }
          return _results;
        }).call(this);
        this.width = maxX + 10;
        return this.height = maxY + 10;
      };

      remakeSpecList = function(def) {
        var argName, i, inputs, name, numId, numSpec, origin, outputs, rate, spId, spec, specList, _, _i, _j, _k, _len, _ref, _ref1;
        specList = [];
        argName = (function() {
          var a, i, index, nameIndices;
          nameIndices = (function() {
            var _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = def.params.names.length; _i < _ref; i = _i += 1) {
              _results.push({
                name: def.params.names[i],
                index: def.params.indices[i]
              });
            }
            return _results;
          })();
          nameIndices.sort(function(a, b) {
            return a.index - b.index;
          });
          index = -1;
          a = (function() {
            var _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = def.params.values.length; _i < _ref; i = _i += 1) {
              if (nameIndices[index + 1].index === i) {
                index += 1;
              }
              _results.push(nameIndices[index].name);
            }
            return _results;
          })();
          return '0_' + a.join(', ');
        })();
        if (argName !== '0_') {
          specList.push({
            name: argName,
            args: true,
            rate: -1,
            spId: 0,
            inputs: [],
            outputs: (function() {
              var _i, _len, _ref, _results;
              _ref = def.params.values;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                _ = _ref[_i];
                _results.push(1);
              }
              return _results;
            })()
          });
        }
        def.consts = def.consts.map(function(x) {
          return +x.toFixed(5);
        });
        origin = (function() {
          var _i, _len, _ref, _ref1, _results;
          _ref = def.specs;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            _ref1 = _ref[i], name = _ref1[0], rate = _ref1[1], spId = _ref1[2], inputs = _ref1[3], outputs = _ref1[4];
            _results.push({
              name: "" + i + "_" + name,
              rate: rate,
              spId: spId,
              inputs: inputs,
              outputs: outputs
            });
          }
          return _results;
        })();
        numId = origin.length;
        for (_i = 0, _len = origin.length; _i < _len; _i++) {
          spec = origin[_i];
          if (/Control$/.test(spec.name)) {
            for (i = _j = 0, _ref = spec.outputs.length; _j < _ref; i = _j += 1) {
              spec.inputs.push(argName, spec.spId + i);
            }
          }
          for (i = _k = 0, _ref1 = spec.inputs.length; _k < _ref1; i = _k += 2) {
            if (spec.inputs[i] === argName) {
              continue;
            }
            if (spec.inputs[i] !== -1) {
              spec.inputs[i] = origin[spec.inputs[i]].name;
            } else {
              numSpec = {
                name: "" + (numId++) + "_" + def.consts[spec.inputs[i + 1]],
                rate: 0,
                spId: 0,
                inputs: [],
                outputs: [1]
              };
              specList.push(numSpec);
              spec.inputs[i] = numSpec.name;
              spec.inputs[i + 1] = 0;
            }
          }
          specList.push(spec);
        }
        return specList;
      };

      makeBoxList = function(context, specList) {
        var box, boxList, fromIndex, fromName, fromOutlet, i, index, map, spec, _i, _j, _len, _ref;
        map = {};
        boxList = (function() {
          var _i, _len, _results;
          _results = [];
          for (index = _i = 0, _len = specList.length; _i < _len; index = ++_i) {
            spec = specList[index];
            _results.push(spec.box = map[spec.name] = new Box(context, index, spec));
          }
          return _results;
        })();
        for (_i = 0, _len = boxList.length; _i < _len; _i++) {
          box = boxList[_i];
          for (i = _j = 0, _ref = box.inputs.length >> 1; _j < _ref; i = _j += 1) {
            fromName = box.inputs[i * 2];
            fromIndex = box.inputs[i * 2 + 1];
            fromOutlet = map[fromName].outlets[fromIndex];
            box.inlets[i].from.push(fromOutlet);
            fromOutlet.to.push(box.inlets[i]);
          }
        }
        return boxList;
      };

      layout = function(boxList, offsetX, offsetY) {
        var box, _i, _len;
        layoutY(boxList);
        layoutX(boxList);
        layoutI(boxList);
        for (_i = 0, _len = boxList.length; _i < _len; _i++) {
          box = boxList[_i];
          box.x += offsetX;
          box.y += offsetY;
        }
        return boxList;
      };

      layoutY = function(boxList) {
        var calcY, changed, i, minY, remain, walk, _i;
        calcY = function(box, selector, defaultValue) {
          return box.outlets.reduce(function(y, outlet) {
            return selector(y, outlet.to.reduce(function(y, inlet) {
              return selector(y, inlet.parent.y - 50);
            }, defaultValue));
          }, defaultValue);
        };
        remain = boxList.slice().reverse();
        walk = function(box) {
          var index;
          index = remain.indexOf(box);
          if (index !== -1) {
            remain.splice(index, 1);
            box.y = calcY(box, Math.max, 0);
            return box.inlets.forEach(function(inlet) {
              return inlet.from.forEach(function(outlet) {
                return walk(outlet.parent);
              });
            });
          }
        };
        while (remain.length) {
          walk(remain[0]);
        }
        for (i = _i = 0; _i < 100; i = ++_i) {
          changed = false;
          boxList.forEach(function(box) {
            var y;
            y = calcY(box, Math.min, Infinity);
            if (y < box.y) {
              box.y = y;
              return changed = true;
            }
          });
          if (!changed) {
            break;
          }
        }
        minY = boxList.reduce((function(minY, box) {
          return Math.min(minY, box.y);
        }), 0);
        return boxList.forEach(function(box) {
          return box.y -= minY;
        });
      };

      layoutX = function(boxList) {
        var box, i, key, list, map, prev, _i, _j, _k, _len, _len1, _len2, _ref, _results;
        map = {};
        for (_i = 0, _len = boxList.length; _i < _len; _i++) {
          box = boxList[_i];
          if (!map[box.y]) {
            map[box.y] = [];
          }
          map[box.y].push(box);
        }
        _ref = Object.keys(map).reverse();
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          key = _ref[_j];
          list = map[key];
          for (_k = 0, _len2 = list.length; _k < _len2; _k++) {
            box = list[_k];
            box.maxOutX = box.outlets.reduce(function(a, outlet) {
              return Math.max(a, outlet.to.reduce(function(a, inlet) {
                return Math.max(a, inlet.getX());
              }, 0));
            }, 0);
          }
          list.sort(function(a, b) {
            return a.maxOutX - b.maxOutX;
          });
          _results.push((function() {
            var _l, _ref1, _results1;
            _results1 = [];
            for (i = _l = 1, _ref1 = list.length; _l < _ref1; i = _l += 1) {
              prev = list[i - 1];
              list[i].x = prev.getX() + prev.width + 10;
              _results1.push(prev.next = list[i]);
            }
            return _results1;
          })());
        }
        return _results;
      };

      layoutI = function(boxList) {
        var findBox;
        findBox = function(x1, y1, x2, y2) {
          var map;
          map = {};
          boxList.forEach(function(box) {
            var y;
            y = box.getY();
            if ((y1 < y && y < y2) && box.getX() === x1) {
              if (!map[y] || y < map[y].getY()) {
                return map[y] = box;
              }
            }
          });
          return Object.keys(map).map(function(key) {
            return map[key];
          });
        };
        return boxList.forEach(function(box) {
          return box.outlets.forEach(function(outlet) {
            var x1, y1;
            x1 = outlet.getX();
            y1 = outlet.getY();
            return outlet.to.forEach(function(inlet) {
              var x2, y2;
              x2 = inlet.getX();
              y2 = inlet.getY();
              if (x1 === x2) {
                return findBox(x1, y1, x2, y2).forEach(function(box) {
                  var prev, _ref, _ref1, _results;
                  box.x = x2 + 15;
                  _ref = [box, box.next], prev = _ref[0], box = _ref[1];
                  _results = [];
                  while (box) {
                    box.x = prev.getX() + prev.width + 10;
                    _results.push((_ref1 = [box, box.next], prev = _ref1[0], box = _ref1[1], _ref1));
                  }
                  return _results;
                });
              }
            });
          });
        });
      };

      return SynthDefRenderer;

    })();
    render = function(data) {
      var json, renderer;
      json = new SynthDefParser().toJSON(data);
      if (json) {
        renderer = new SynthDefRenderer;
        return $('#result').attr({
          src: renderer.toDataURL(json)
        });
      }
    };
    main = function(file) {
      var reader;
      reader = new FileReader;
      reader.onload = function(e) {
        return render(new Uint8Array(e.target.result));
      };
      return reader.readAsArrayBuffer(file);
    };
    xhr = new XMLHttpRequest;
    xhr.open('GET', './default.scsyndef');
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.response) {
          return render(new Uint8Array(xhr.response));
        }
      }
    };
    return xhr.send();
  });

}).call(this);
