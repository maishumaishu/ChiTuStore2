define(["require", "exports"], function (require, exports) {
    "use strict";
    class Model {
        constructor(page) {
            this.back = () => {
                this.page.hide();
            };
            this.remove = () => {
                var count = this.page.on_imageRemoved();
                if (count == 0)
                    this.page.hide();
            };
            this.page = page;
        }
    }
    class ImagePreviewer {
        constructor(element) {
            this.model = new Model(this);
            this.loadHtml = $.Deferred();
            this.imageRemoved = $.Callbacks();
            this.element = element;
            this.element.style.display = 'none';
            requirejs(['text!ui/ImagePreview.html', 'swiper'], (html, Swiper) => {
                this.element.innerHTML = html;
                ko.applyBindings(this.model, this.element);
                var swiper_container = this.element.querySelector('.swiper-container');
                var swiper_wraper = this.element.querySelector('.swiper-wrapper');
                this.swiper = new Swiper(swiper_container, {
                    loop: false,
                    pagination: $(this.element).find('[name="ad-pagination"]')[0],
                    onSlideChangeEnd: (swiper) => {
                        this.updateTitle();
                    }
                });
            });
        }
        on_imageRemoved() {
            var swiper = this.swiper;
            var active_index = swiper.activeIndex;
            swiper.removeSlide(active_index);
            this.updateTitle();
            this.imageRemoved.fire([active_index]);
            return swiper.slides.length;
        }
        open(args) {
            debugger;
            $(this.element).show();
            this.swiper.removeAllSlides();
            var swiper_wraper = this.element.querySelector('.swiper-wrapper');
            for (var i = 0; i < args.imageUrls.length; i++) {
                var slide_element = document.createElement('div');
                slide_element.className = 'swiper-slide';
                slide_element.style.textAlign = 'center';
                var img_element = document.createElement('img');
                img_element.className = 'img-full';
                slide_element.appendChild(img_element);
                img_element.src = args.imageUrls[i];
                if (i == args.currentIndex)
                    slide_element.className = slide_element.className + ' swiper-slide-active';
                this.swiper.appendSlide(slide_element);
            }
            this.swiper.slideTo(args.currentIndex, 0);
            this.updateTitle();
        }
        updateTitle() {
            var title_element = this.element.querySelector('[name="title"]');
            title_element.innerHTML = (this.swiper.activeIndex + 1) + '/' + this.swiper.slides.length;
        }
        hide() {
            $(this.element).hide();
        }
        close() {
            $(this.element).remove();
        }
        static createInstance() {
            var element = document.createElement('div');
            document.body.appendChild(element);
            var page = new ImagePreviewer(element);
            element.className = element.className + ' UI-ImagePreview';
            return page;
        }
    }
    return ImagePreviewer;
});
