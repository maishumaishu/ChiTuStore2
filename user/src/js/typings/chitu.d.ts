declare namespace chitu {
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
        private _routeString;
        private _loadCompleted;
        constructor(basePath: string, routeString: string, pathSpliterChar?: string);
        parseRouteString(): void;
        private pareeUrlQuery(query);
         basePath: string;
         values: any;
         pageName: string;
         routeString: string;
         actionPath: string;
         loadCompleted: boolean;
    }
    class Application {
        pageCreated: Callback<Application, Page>;
        protected pageType: PageConstructor;
        protected pageDisplayType: PageDisplayConstructor;
        private _runned;
        private zindex;
        private page_stack;
        private cachePages;
        fileBasePath: string;
        backFail: Callback<Application, {}>;
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
        showPage(routeString: string, args?: any): Page;
        setLocationHash(routeString);
        private closeCurrentPage();
        private clearPageStack();
        redirect(routeString: string, args?: any): Page;
        back(args?: any): void;
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
        private funcs;
        constructor();
        add(func: (sender: S, args: A) => any): void;
        remove(func: (sender: S, args: A) => any): void;
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
        new (args: PageParams): Page;
    }
    interface PageDisplayConstructor {
        new (app: Application): PageDisplayer;
    }
    interface PageDisplayer {
        show(page: Page): Promise<any>;
        hide(page: Page): Promise<any>;
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
        load: Callback<this, any>;
        showing: Callback<this, {}>;
        shown: Callback<this, {}>;
        hiding: Callback<this, {}>;
        hidden: Callback<this, {}>;
        closing: Callback<this, {}>;
        closed: Callback<this, {}>;
        constructor(params: PageParams);
        on_load(args: any): void;
        on_showing(): void;
        on_shown(): void;
        on_hiding(): void;
        on_hidden(): void;
        on_closing(): void;
        on_closed(): void;
        show(): Promise<any>;
        hide(): Promise<any>;
        close(): Promise<any>;
         element: HTMLElement;
        previous: Page;
         routeData: RouteData;
         name: string;
        private loadPageAction();
        reload(): Promise<void>;
    }
    class PageDisplayerImplement implements PageDisplayer {
        show(page: Page): Promise<void>;
        hide(page: Page): Promise<void>;
    }
}

declare namespace chitu {
    function combinePath(path1: string, path2: string): string;
    function loadjs(path: any): Promise<any>;
}
declare module "chitu" { 
            export = chitu; 
        }
