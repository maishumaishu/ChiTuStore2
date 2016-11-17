define(["require", "exports", 'core/chitu.mobile'], function (require, exports, chitu_mobile_1) {
    "use strict";
    class MyPage extends chitu_mobile_1.Page {
        constructor(params) {
            super(params);
            this.elements.loading.innerHTML =
                `<div class="spin">
    <i class="icon-spinner icon-spin"></i>
</div>`;
        }
    }
    class MyApplication extends chitu_mobile_1.Application {
        constructor() {
            super();
            this.pageType = MyPage;
        }
    }
    exports.app = new MyApplication();
    exports.app.run();
});
