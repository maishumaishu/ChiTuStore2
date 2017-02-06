namespace controls {
    //import cm = require('chitu.mobile');

    interface DataListProps extends React.Props<DataList> {
        loadData: ((pageIndex: number) => Promise<Array<any>>),
        dataItem: ((o: any, index: number) => JSX.Element),
        className?: string,
        pageSize?: number,
        scroller?: () => HTMLElement,
        emptyItem?: JSX.Element,
        showCompleteText?: boolean
    }
    interface DataListState {
        items: Array<any>
    }
    export class DataList extends React.Component<DataListProps, DataListState>{
        private pageIndex: number;
        private status: 'loading' | 'complted' | 'finish' | 'fail';

        element: HTMLElement;

        constructor(props) {
            super(props);
            this.pageIndex = 0;
            this.state = { items: [] };
            this.loadData();
        }

        loadData() {
            if (this.status == 'complted' || this.status == 'loading') {
                return;
            }
            this.status = 'loading';
            this.props.loadData(this.pageIndex).then(items => {
                this.status = 'finish';
                if (items.length < this.props.pageSize)
                    this.status = 'complted';

                this.pageIndex = this.pageIndex + 1;
                this.state.items = this.state.items.concat(items);
                this.setState(this.state);
            }).catch(() => {
                this.status = 'fail';
            });
        }

        reset() {
            this.pageIndex = 0;
            this.status = null;
            this.state.items = [];
            this.setState(this.state);
        }

        componentDidMount() {
            // let isEmpty = this.state.items.length == 0;
            // if (isEmpty)
            //     return;

            let scroller: HTMLElement;
            if (this.props.scroller)
                scroller = this.props.scroller();

            if (scroller == null) {
                scroller = this.element.parentElement;
            }
            scrollOnBottom(scroller, this.loadData.bind(this));
        }

        createDataItem(data: any, index: number) {
            try {
                return this.props.dataItem(data, index);
            }
            catch (e) {
                let error = e as Error;
                return <div>{error.message}</div>
            }
        }

        render() {
            let indicator: JSX.Element;
            switch (this.status) {
                case 'complted':
                    indicator = this.props.showCompleteText ?
                        <div>
                            <span>数据已全部加载完</span>
                        </div>
                        :
                        null
                    break;
                case 'fail':
                    indicator =
                        <button className="btn btn-default btn-block" onClick={this.loadData} >
                            点击加载数据
                    </button>
                    break;
                default:
                    indicator =
                        <div>
                            <i className="icon-spinner icon-spin"></i>
                            <span>数据正在加载中...</span>
                        </div>
                    break;
            }
            return (
                <div ref={(o: HTMLElement) => this.element = o} className={this.props.className}>
                    {this.state.items.map((o, i) =>
                        this.createDataItem(o, i)
                    )}
                    {this.props.emptyItem != null && this.state.items.length == 0 ?
                        this.props.emptyItem
                        :
                        <div className="data-loading col-xs-12">
                            {indicator}
                        </div>}

                </div >
            );
        }
    }

    let dataListDefaultProps: DataListProps = {} as DataListProps;
    dataListDefaultProps.pageSize = 10;
    DataList.defaultProps = dataListDefaultProps;

    /**
     * 滚动到底部触发回调事件
     */
    function scrollOnBottom(element: HTMLElement, callback: Function, deltaHeight?: number) {
        console.assert(element != null);
        console.assert(callback != null);
        deltaHeight = deltaHeight || 10;
        element.addEventListener('scroll', function () {
            let maxScrollTop = element.scrollHeight - element.clientHeight;
            //let deltaHeight = 10;
            if (element.scrollTop + deltaHeight >= maxScrollTop) {
                callback();
            }
        });
    }
}
