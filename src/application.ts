import * as services from 'services';
import { Application, Page } from 'core/chitu.mobile';

class MyPage extends Page {
    constructor(params) {
        super(params);

        this.childElement('loading').innerHTML =
            `<div class="spin">
    <i class="icon-spinner icon-spin"></i>
</div>`;
    }
}

class MyApplication extends Application {
    constructor() {
        super();
        this.pageType = MyPage;

        this.pageCreated.add((sender, page: Page) => {
            console.assert(page instanceof Page);
            page.load.add((sender, args) => {
                let { headerHTML } = args;
                console.assert(headerHTML != null);
                if (headerHTML)
                    page.childElement('header').innerHTML = headerHTML;
            })
        })
    }

    protected parseRouteString(routeString: string) {
        let routeData = super.parseRouteString(routeString);
        let headerPath;
        switch (routeData.pageName) {
            case 'home.index':
                headerPath = `text!ui/headers/${routeData.pageName}.html`;
                break;
            default:
                headerPath = `text!ui/headers/default.html`;
                break
        }

        if (headerPath)
            routeData.resources.push({ name: 'headerHTML', path: headerPath });


        return routeData;
    }

}

export let app = new MyApplication();
app.run();

if (!location.hash) {
    app.redirect('home/index');
}

