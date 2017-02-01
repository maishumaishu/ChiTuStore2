namespace controls {
    export function getChildren(props: React.Props<any>): Array<any> {
        props = props || {};
        let children = [];
        if (props.children instanceof Array) {
            children = props.children as Array<any>;
        }
        else if (props['children'] != null) {
            children = [props['children']];
        }
        return children;
    }
}