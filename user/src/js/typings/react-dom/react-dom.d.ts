/// <reference path="../react/react.d.ts"/>

declare namespace ReactDOM {
    function render<P>(
        element: React.ReactElement<P>,
        container?: Element,
        callback?: Function
    )
}

declare module 'react-dom' {
    export = ReactDOM;
}
