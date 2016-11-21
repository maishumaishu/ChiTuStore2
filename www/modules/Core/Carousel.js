define(["require", "exports", 'hammer', 'move'], function (require, exports, Hammer, move) {
    "use strict";
    class Errors {
        static argumentNull(parameterName) {
            let msg = `Argument '${parameterName}' cannt be null.`;
            return new Error(msg);
        }
    }
    var animateTime = 400;
    const MOVE_PERSEND = 20;
    class Carousel {
        constructor(element, options) {
            this.playTimeId = 0;
            this.playing = false;
            this.paned = false;
            this.window_width = window.outerWidth;
            this.is_pause = false;
            if (element == null)
                throw Errors.argumentNull('element');
            this.items = new Array();
            let q = element.querySelectorAll('.item');
            for (let i = 0; i < q.length; i++) {
                this.items[i] = q.item(i);
            }
            this.indicators = new Array();
            q = element.querySelectorAll('.carousel-indicators li');
            for (let i = 0; i < q.length; i++)
                this.indicators[i] = q.item(i);
            console.assert(this.indicators.length == this.items.length);
            this.active_index = this.active_index >= 0 ? this.active_index : 0;
            var hammer = new Hammer.Manager(element);
            var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, });
            hammer.add(pan);
            addClassName(this.activeItem(), 'active');
            addClassName(this.indicators[this.active_index], 'active');
            hammer.on('panstart', (e) => this.panstart(e))
                .on('panmove', (e) => this.panmove(e))
                .on('panend', (e) => this.panend(e));
            options = Object.assign({ autoplay: true }, options);
            this.autoplay = options.autoplay;
            if (this.autoplay) {
                this.play();
            }
        }
        panstart(e) {
            if (this.is_pause)
                return false;
            this.stop();
        }
        panmove(e) {
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
            }
            else if (percent_position > 0) {
                this.prevItem().className = 'item prev';
                move(this.prevItem()).x(e.deltaX - this.window_width).duration(0).end();
            }
        }
        panend(e) {
            if (this.paned == false)
                return;
            this.paned = false;
            var duration_time = 200;
            let p = MOVE_PERSEND;
            if (this.active_position > 0 && this.active_position >= p) {
                move(this.activeItem()).x(this.window_width).duration(duration_time).end();
                move(this.prevItem()).x(0).duration(duration_time).end();
                window.setTimeout(() => {
                    removeClassName(this.prevItem(), 'prev', 'next');
                    addClassName(this.prevItem(), 'active');
                    removeClassName(this.activeItem(), 'active');
                    this.decreaseActiveIndex();
                }, duration_time);
            }
            else if (this.active_position > 0 && this.active_position < p) {
                move(this.activeItem()).x(0).duration(duration_time).end();
                move(this.prevItem()).x(0 - this.window_width).duration(duration_time).end();
            }
            else if (this.active_position <= 0 - p) {
                move(this.activeItem()).x(0 - this.window_width).duration(duration_time).end();
                move(this.nextItem()).x(0).duration(duration_time).end();
                window.setTimeout(() => {
                    removeClassName(this.nextItem(), 'prev', 'next');
                    addClassName(this.nextItem(), 'active');
                    removeClassName(this.activeItem(), 'active');
                    this.increaseActiveIndex();
                }, duration_time);
            }
            else {
                move(this.activeItem()).x(0).duration(duration_time).end();
                move(this.nextItem()).x(this.window_width).duration(duration_time).end();
            }
            window.setTimeout(() => {
                if (this.autoplay) {
                    this.play();
                }
            }, duration_time + 200);
        }
        increaseActiveIndex() {
            this.setIndicatorClassName(this.active_index, '');
            this.active_index = this.active_index + 1;
            if (this.active_index > this.items.length - 1)
                this.active_index = 0;
            this.setIndicatorClassName(this.active_index, 'active');
            return this.active_index;
        }
        decreaseActiveIndex() {
            this.setIndicatorClassName(this.active_index, '');
            this.active_index = this.active_index - 1;
            if (this.active_index < 0)
                this.active_index = this.items.length - 1;
            this.setIndicatorClassName(this.active_index, 'active');
        }
        nextItemIndex() {
            var next = this.active_index + 1;
            if (next > this.items.length - 1)
                next = 0;
            return next;
        }
        prevItemIndex() {
            var prev = this.active_index - 1;
            if (prev < 0)
                prev = this.items.length - 1;
            return prev;
        }
        nextItem() {
            var nextIndex = this.active_index + 1;
            if (nextIndex > this.items.length - 1)
                nextIndex = 0;
            return this.items[nextIndex];
        }
        prevItem() {
            var prevIndex = this.active_index - 1;
            if (prevIndex < 0)
                prevIndex = this.items.length - 1;
            return this.items[prevIndex];
        }
        activeItem() {
            return this.items[this.active_index];
        }
        moveNext() {
            if (this.playTimeId == 0)
                return;
            if (this.playing == true)
                return;
            this.playing = true;
            this.nextItem().style.transform = this.nextItem().style.webkitTransform = '';
            this.nextItem().style.transitionDuration = this.nextItem().style.webkitTransitionDuration = '';
            this.activeItem().style.transform = this.activeItem().style.webkitTransform = '';
            this.activeItem().style.transitionDuration = this.activeItem().style.webkitTransitionDuration = '';
            this.activeItem().className = 'item active';
            this.nextItem().className = 'item next';
            window.setTimeout(() => {
                addClassName(this.activeItem(), 'left');
                addClassName(this.nextItem(), 'active');
                setTimeout(() => {
                    this.nextItem().className = 'item active';
                    this.activeItem().className = 'item';
                    this.increaseActiveIndex();
                    this.playing = false;
                }, animateTime);
            }, 50);
        }
        movePrev() {
            if (this.playTimeId == 0)
                return;
            if (this.playing == true)
                return;
            this.playing = true;
            addClassName(this.prevItem(), 'prev');
            this.prevItem().style.transform = this.prevItem().style.webkitTransform = '';
            this.activeItem().style.transform = this.activeItem().style.webkitTransform = '';
            window.setTimeout(() => {
                addClassName(this.activeItem(), 'right');
                addClassName(this.prevItem(), 'active');
                setTimeout(() => {
                    removeClassName(this.prevItem(), 'prev', 'next');
                    removeClassName(this.activeItem(), 'right', 'active');
                    this.decreaseActiveIndex();
                    this.playing = false;
                }, animateTime);
            }, 10);
        }
        setIndicatorClassName(index, className) {
            let indicator = this.indicators[index];
            if (indicator == null) {
                return;
            }
            indicator.className = className;
        }
        stop() {
            if (this.playTimeId == 0) {
                return;
            }
            window.clearInterval(this.playTimeId);
            this.playTimeId = 0;
        }
        get pause() {
            return this.is_pause;
        }
        set pause(value) {
            this.is_pause = value;
            if (this.is_pause == true)
                this.stop();
        }
        play() {
            if (this.playTimeId != 0)
                return;
            this.playTimeId = window.setInterval(() => {
                this.moveNext();
            }, 2000);
        }
    }
    function addClassName(element, ...classNames) {
        console.assert(element.className != null);
        for (let className of classNames) {
            if (element.className.indexOf(className) >= 0)
                continue;
            element.className = element.className + ' ' + className;
        }
    }
    function removeClassName(element, ...classNames) {
        console.assert(element.className != null);
        for (let i = 0; i < classNames.length; i++)
            element.className = element.className.replace(classNames[i], '');
    }
    return Carousel;
});
