declare namespace chitu {
    class Resources {
        private items;
        private routeData;
        private _loadCompleted;
        constructor(routeData: RouteData);
        push(...items: {
            name: string;
            path: string;
        }[]): number;
        load(): Promise<{}>;
        map<U>(callbackfn: (value: {
            name: string;
            path: string;
        }) => U): U[];
    }
    class RouteData {
        private _parameters;
        private path_string;
        private path_spliter_char;
        private path_contact_char;
        private param_spliter;
        private name_spliter_char;
        private _pathBase;
        private _pageName;
        private _actionPath;
        private _resources;
        private _routeString;
        private _loadCompleted;
        constructor(basePath: string, routeString: string, pathSpliterChar?: string);
        parseRouteString(): void;
        private pareeUrlQuery(query);
        readonly basePath: string;
        readonly values: any;
        readonly pageName: string;
        readonly resources: Resources;
        readonly routeString: string;
        readonly actionPath: string;
        readonly loadCompleted: boolean;
    }
    class Application {
        pageCreated: Callback<Application, Page>;
        protected pageType: PageConstructor;
        private _runned;
        private zindex;
        private page_stack;
        private cachePages;
        fileBasePath: string;
        backFail: Callback<Application, {}>;
        constructor();
        protected parseRouteString(routeString: string): RouteData;
        private on_pageCreated(page);
        readonly currentPage: Page;
        readonly pages: Array<Page>;
        protected createPage(routeData: RouteData): Page;
        protected createPageElement(routeData: chitu.RouteData): HTMLElement;
        protected hashchange(): void;
        run(): void;
        getPage(name: string): Page;
        showPage(routeString: string, args?: any): Page;
        private setLocationHash(routeString);
        private closeCurrentPage();
        redirect(routeString: string, args?: any): Page;
        back(args?: any): Promise<void>;
    }
}

declare namespace chitu {
    class Errors {
        static argumentNull(paramName: string): Error;
        static modelFileExpecteFunction(script: any): Error;
        static paramTypeError(paramName: string, expectedType: string): Error;
        static paramError(msg: string): Error;
        static viewNodeNotExists(name: any): Error;
        static pathPairRequireView(index: any): Error;
        static notImplemented(name: any): Error;
        static routeExists(name: any): Error;
        static noneRouteMatched(url: any): Error;
        static emptyStack(): Error;
        static canntParseUrl(url: string): Error;
        static canntParseRouteString(routeString: string): Error;
        static routeDataRequireController(): Error;
        static routeDataRequireAction(): Error;
        static viewCanntNull(): Error;
        static createPageFail(pageName: string): Error;
        static actionTypeError(pageName: string): Error;
        static canntFindAction(pageName: any): Error;
        static exportsCanntNull(pageName: string): void;
        static scrollerElementNotExists(): Error;
        static resourceExists(resourceName: string, pageName: string): Error;
    }
}

declare namespace chitu {
    class Callback<S, A> {
        private event;
        private element;
        private event_name;
        constructor();
        add(func: (sender: S, args: A) => any): void;
        remove(func: EventListener): void;
        fire(sender: S, args: A): void;
    }
    function Callbacks<S, A>(): Callback<S, A>;
    function fireCallback<S, A>(callback: Callback<S, A>, sender: S, args: A): void;
}

declare namespace chitu {
    interface PageActionConstructor {
        new (args: Page): any;
    }
    interface PageConstructor {
        new (args: PageParams): any;
    }
    interface PageDisplayer {
        show(page: Page): any;
        hide(page: Page): any;
    }
    interface PageParams {
        app: Application;
        routeData: RouteData;
        element: HTMLElement;
        displayer: PageDisplayer;
        previous?: Page;
    }
    class Page {
        private animationTime;
        private num;
        private _element;
        private _previous;
        private _app;
        private _routeData;
        private _displayer;
        static tagName: string;
        allowCache: boolean;
        load: Callback<Page, any>;
        showing: Callback<Page, {}>;
        shown: Callback<Page, {}>;
        hiding: Callback<Page, {}>;
        hidden: Callback<Page, {}>;
        closing: Callback<Page, {}>;
        closed: Callback<Page, {}>;
        constructor(params: PageParams);
        on_load(args: any): void;
        on_showing(): void;
        on_shown(): void;
        on_hiding(): void;
        on_hidden(): void;
        on_closing(): void;
        on_closed(): void;
        show(): void;
        hide(): void;
        close(): void;
        readonly element: HTMLElement;
        previous: Page;
        readonly routeData: RouteData;
        readonly name: string;
        private createActionDeferred(routeData);
        private loadPageAction(routeData);
    }
    class PageDisplayerImplement implements PageDisplayer {
        show(page: Page): void;
        hide(page: Page): void;
    }
}

declare namespace chitu {
    function combinePath(path1: string, path2: string): string;
    function loadjs(...modules: string[]): Promise<Array<any>>;
}
declare module "chitu" { 
            export = chitu; 
        }
