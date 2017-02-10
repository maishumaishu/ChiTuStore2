namespace controls {
    interface TabsProps extends React.Props<Tabs> {
        scroller?: () => HTMLElement,
        // items: Array<string>,
        onItemClick?: (index: number) => void,
        className?: string,
        defaultActiveIndex?: number,
    }



    export class Tabs extends React.Component<TabsProps, { activeIndex: number }>{

        private element: HTMLElement;

        constructor(props) {
            super(props);
            this.state = { activeIndex: this.props.defaultActiveIndex || 0 };
        }

        protected componentDidMount() {
            setTimeout(() => {
                let scroller: HTMLElement;
                if (this.props.scroller != null) {
                    scroller = this.props.scroller();
                }
                if (scroller == null) {
                    return;
                }

                let scrollTop: number;
                scroller.addEventListener('scroll', (event) => {
                    if (scrollTop == null) {
                        scrollTop = scroller.scrollTop;
                        return;
                    }
                    if (scroller.scrollTop - scrollTop > 0) { //向上 >0 //page.dataView.scrollTop > 100
                        if (scroller.scrollTop > 100)
                            this.element.style.top = '0px';
                    }
                    else {
                        this.element.style.removeProperty('top');
                    }
                    scrollTop = scroller.scrollTop;
                })
            }, 500);
        }

        private activeItem(index) {
            this.state.activeIndex = index;
            this.setState(this.state);

            if (this.props.onItemClick) {
                this.props.onItemClick(index);
            }
        }


        render() {
            let children = getChildren(this.props);
            let itemWidth = 100 / children.length;
            return (
                <ul ref={(o: HTMLElement) => this.element = o} className={this.props.className} style={{ transition: '0.4s' }}>
                    {children.map((o, i) => (
                        <li key={i} onClick={() => this.activeItem(i)} className={i == this.state.activeIndex ? 'active' : ''}
                            style={{ width: `${itemWidth}%` }}>{(o)}</li>
                    ))}
                </ul>
            );
        }
    }
}