declare namespace chitu {
    class RouteData {
        private _parameters;
        private path_string;
        private path_spliter_char;
        private param_spliter;
        private name_spliter_char;
        private _pathBase;
        private _pageName;
        private _actionPath;
        private _resources;
        private _routeString;
        constructor(routeString: string);
        parseRouteString(): void;
        private pareeUrlQuery(query);
        basePath: string;
        values: any;
        pageName: string;
        resources: Array<{
            name: string;
            path: string;
        }>;
        routeString: string;
        actionPath: string;
    }
    class RouteParser {
        private path_string;
        private path_spliter_char;
        private param_spliter;
        private name_spliter_char;
        private _actionPath;
        private _cssPath;
        private _parameters;
        private _pageName;
        private _pathBase;
        private HASH_MINI_LENGTH;
        constructor(basePath: string);
        parseRouteString(routeString: string): RouteData;
        basePath: string;
        private pareeUrlQuery(query);
    }
    class Application {
        pageCreated: Callback<Application>;
        protected pageType: PageConstructor;
        private _runned;
        private zindex;
        private page_stack;
        fileBasePath: string;
        backFail: Callback<Application>;
        constructor();
        protected parseRouteString(routeString: string): RouteData;
        private on_pageCreated(page);
        currentPage: Page;
        pages: Array<Page>;
        protected createPage(routeData: RouteData): Page;
        protected createPageElement(routeData: chitu.RouteData): HTMLElement;
        protected hashchange(): void;
        run(): void;
        getPage(name: string): Page;
        showPage<T extends Page>(routeString: string, args?: any): Promise<T>;
        private setLocationHash(routeString);
        private closeCurrentPage();
        redirect<T extends Page>(routeString: string, args?: any): Promise<T>;
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
    class Callback<S> {
        private event;
        private element;
        private event_name;
        constructor();
        add(func: (sender: S, ...args: Array<any>) => any): void;
        remove(func: EventListener): void;
        fire(args: any): void;
    }
    function Callbacks<S>(): Callback<S>;
    function fireCallback<S>(callback: Callback<S>, sender: S, ...args: Array<any>): void;
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
        load: Callback<Page>;
        showing: Callback<Page>;
        shown: Callback<Page>;
        hiding: Callback<Page>;
        hidden: Callback<Page>;
        closing: Callback<Page>;
        closed: Callback<Page>;
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
        element: HTMLElement;
        previous: Page;
        routeData: RouteData;
        name: string;
        private createActionDeferred(routeData);
        private loadPageAction(routeData);
    }
    class PageDisplayerImplement implements PageDisplayer {
        show(page: Page): void;
        hide(page: Page): void;
    }
}

declare namespace chitu {
    function extend(obj1: any, obj2: any): any;
    function combinePath(path1: string, path2: string): string;
    function loadjs(...modules: string[]): Promise<Array<any>>;
}
declare module "chitu" { 
            export = chitu; 
        }
