import * as services from 'services';
import { Application, Page } from 'core/chitu.mobile';

class MyPage extends Page {
    constructor(params) {
        super(params);

        this.elements.loading.innerHTML = 
`<div class="spin">
    <i class="icon-spinner icon-spin"></i>
</div>`;


    }
}

class MyApplication extends Application {
    constructor() {
        super();

        this.pageType = MyPage;
    }
}

export let app = new MyApplication();
app.run();

