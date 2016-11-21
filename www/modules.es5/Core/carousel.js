"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", 'hammer', 'move'], function (require, exports, Hammer, move) {
    "use strict";

    var Errors = function () {
        function Errors() {
            _classCallCheck(this, Errors);
        }

        _createClass(Errors, null, [{
            key: "argumentNull",
            value: function argumentNull(parameterName) {
                var msg = "Argument '" + parameterName + "' cannt be null.";
                return new Error(msg);
            }
        }]);

        return Errors;
    }();

    var animateTime = 400;
    var MOVE_PERSEND = 20;

    var Carousel = function () {
        function Carousel(element, options) {
            var _this = this;

            _classCallCheck(this, Carousel);

            this.playTimeId = 0;
            this.playing = false;
            this.paned = false;
            this.window_width = window.outerWidth;
            this.is_pause = false;
            if (element == null) throw Errors.argumentNull('element');
            this.items = new Array();
            var q = element.querySelectorAll('.item');
            for (var i = 0; i < q.length; i++) {
                this.items[i] = q.item(i);
            }
            this.indicators = new Array();
            q = element.querySelectorAll('.carousel-indicators li');
            for (var _i = 0; _i < q.length; _i++) {
                this.indicators[_i] = q.item(_i);
            }console.assert(this.indicators.length == this.items.length);
            this.active_index = this.active_index >= 0 ? this.active_index : 0;
            var hammer = new Hammer.Manager(element);
            var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL });
            hammer.add(pan);
            addClassName(this.activeItem(), 'active');
            addClassName(this.indicators[this.active_index], 'active');
            hammer.on('panstart', function (e) {
                return _this.panstart(e);
            }).on('panmove', function (e) {
                return _this.panmove(e);
            }).on('panend', function (e) {
                return _this.panend(e);
            });
            options = Object.assign({ autoplay: true }, options);
            this.autoplay = options.autoplay;
            if (this.autoplay) {
                this.play();
            }
        }

        _createClass(Carousel, [{
            key: "panstart",
            value: function panstart(e) {
                if (this.is_pause) return false;
                this.stop();
            }
        }, {
            key: "panmove",
            value: function panmove(e) {
                if ((e.direction & Hammer.DIRECTION_VERTICAL) != 0) {
                    console.log('DIRECTION_VERTICAL');
                }
                var percent_position = Math.floor(e.deltaX / window.outerWidth * 100);
                if (this.active_position == percent_position || this.playing == true) {
                    return;
                }
                this.paned = true;
                move(this.activeItem()).x(e.deltaX).duration(0).end();
                this.active_position = percent_position;
                if (percent_position < 0) {
                    this.nextItem().className = 'item next';
                    move(this.nextItem()).x(this.window_width + e.deltaX).duration(0).end();
                } else if (percent_position > 0) {
                    this.prevItem().className = 'item prev';
                    move(this.prevItem()).x(e.deltaX - this.window_width).duration(0).end();
                }
            }
        }, {
            key: "panend",
            value: function panend(e) {
                var _this2 = this;

                if (this.paned == false) return;
                this.paned = false;
                var duration_time = 200;
                var p = MOVE_PERSEND;
                if (this.active_position > 0 && this.active_position >= p) {
                    move(this.activeItem()).x(this.window_width).duration(duration_time).end();
                    move(this.prevItem()).x(0).duration(duration_time).end();
                    window.setTimeout(function () {
                        removeClassName(_this2.prevItem(), 'prev', 'next');
                        addClassName(_this2.prevItem(), 'active');
                        removeClassName(_this2.activeItem(), 'active');
                        _this2.decreaseActiveIndex();
                    }, duration_time);
                } else if (this.active_position > 0 && this.active_position < p) {
                    move(this.activeItem()).x(0).duration(duration_time).end();
                    move(this.prevItem()).x(0 - this.window_width).duration(duration_time).end();
                } else if (this.active_position <= 0 - p) {
                    move(this.activeItem()).x(0 - this.window_width).duration(duration_time).end();
                    move(this.nextItem()).x(0).duration(duration_time).end();
                    window.setTimeout(function () {
                        removeClassName(_this2.nextItem(), 'prev', 'next');
                        addClassName(_this2.nextItem(), 'active');
                        removeClassName(_this2.activeItem(), 'active');
                        _this2.increaseActiveIndex();
                    }, duration_time);
                } else {
                    move(this.activeItem()).x(0).duration(duration_time).end();
                    move(this.nextItem()).x(this.window_width).duration(duration_time).end();
                }
                window.setTimeout(function () {
                    if (_this2.autoplay) {
                        _this2.play();
                    }
                }, duration_time + 200);
            }
        }, {
            key: "increaseActiveIndex",
            value: function increaseActiveIndex() {
                this.setIndicatorClassName(this.active_index, '');
                this.active_index = this.active_index + 1;
                if (this.active_index > this.items.length - 1) this.active_index = 0;
                this.setIndicatorClassName(this.active_index, 'active');
                return this.active_index;
            }
        }, {
            key: "decreaseActiveIndex",
            value: function decreaseActiveIndex() {
                this.setIndicatorClassName(this.active_index, '');
                this.active_index = this.active_index - 1;
                if (this.active_index < 0) this.active_index = this.items.length - 1;
                this.setIndicatorClassName(this.active_index, 'active');
            }
        }, {
            key: "nextItemIndex",
            value: function nextItemIndex() {
                var next = this.active_index + 1;
                if (next > this.items.length - 1) next = 0;
                return next;
            }
        }, {
            key: "prevItemIndex",
            value: function prevItemIndex() {
                var prev = this.active_index - 1;
                if (prev < 0) prev = this.items.length - 1;
                return prev;
            }
        }, {
            key: "nextItem",
            value: function nextItem() {
                var nextIndex = this.active_index + 1;
                if (nextIndex > this.items.length - 1) nextIndex = 0;
                return this.items[nextIndex];
            }
        }, {
            key: "prevItem",
            value: function prevItem() {
                var prevIndex = this.active_index - 1;
                if (prevIndex < 0) prevIndex = this.items.length - 1;
                return this.items[prevIndex];
            }
        }, {
            key: "activeItem",
            value: function activeItem() {
                return this.items[this.active_index];
            }
        }, {
            key: "moveNext",
            value: function moveNext() {
                var _this3 = this;

                if (this.playTimeId == 0) return;
                if (this.playing == true) return;
                this.playing = true;
                this.nextItem().style.transform = this.nextItem().style.webkitTransform = '';
                this.nextItem().style.transitionDuration = this.nextItem().style.webkitTransitionDuration = '';
                this.activeItem().style.transform = this.activeItem().style.webkitTransform = '';
                this.activeItem().style.transitionDuration = this.activeItem().style.webkitTransitionDuration = '';
                this.activeItem().className = 'item active';
                this.nextItem().className = 'item next';
                window.setTimeout(function () {
                    addClassName(_this3.activeItem(), 'left');
                    addClassName(_this3.nextItem(), 'active');
                    setTimeout(function () {
                        _this3.nextItem().className = 'item active';
                        _this3.activeItem().className = 'item';
                        _this3.increaseActiveIndex();
                        _this3.playing = false;
                    }, animateTime);
                }, 50);
            }
        }, {
            key: "movePrev",
            value: function movePrev() {
                var _this4 = this;

                if (this.playTimeId == 0) return;
                if (this.playing == true) return;
                this.playing = true;
                addClassName(this.prevItem(), 'prev');
                this.prevItem().style.transform = this.prevItem().style.webkitTransform = '';
                this.activeItem().style.transform = this.activeItem().style.webkitTransform = '';
                window.setTimeout(function () {
                    addClassName(_this4.activeItem(), 'right');
                    addClassName(_this4.prevItem(), 'active');
                    setTimeout(function () {
                        removeClassName(_this4.prevItem(), 'prev', 'next');
                        removeClassName(_this4.activeItem(), 'right', 'active');
                        _this4.decreaseActiveIndex();
                        _this4.playing = false;
                    }, animateTime);
                }, 10);
            }
        }, {
            key: "setIndicatorClassName",
            value: function setIndicatorClassName(index, className) {
                var indicator = this.indicators[index];
                if (indicator == null) {
                    return;
                }
                indicator.className = className;
            }
        }, {
            key: "stop",
            value: function stop() {
                if (this.playTimeId == 0) {
                    return;
                }
                window.clearInterval(this.playTimeId);
                this.playTimeId = 0;
            }
        }, {
            key: "play",
            value: function play() {
                var _this5 = this;

                if (this.playTimeId != 0) return;
                this.playTimeId = window.setInterval(function () {
                    _this5.moveNext();
                }, 2000);
            }
        }, {
            key: "pause",
            get: function get() {
                return this.is_pause;
            },
            set: function set(value) {
                this.is_pause = value;
                if (this.is_pause == true) this.stop();
            }
        }]);

        return Carousel;
    }();

    function addClassName(element) {
        console.assert(element.className != null);

        for (var _len = arguments.length, classNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            classNames[_key - 1] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = classNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var className = _step.value;

                if (element.className.indexOf(className) >= 0) continue;
                element.className = element.className + ' ' + className;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    function removeClassName(element) {
        console.assert(element.className != null);

        for (var _len2 = arguments.length, classNames = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            classNames[_key2 - 1] = arguments[_key2];
        }

        for (var i = 0; i < classNames.length; i++) {
            element.className = element.className.replace(classNames[i], '');
        }
    }
    return Carousel;
});
