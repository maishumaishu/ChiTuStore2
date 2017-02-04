import { Page, defaultNavBar, Menu } from 'site';
import { StationService, News } from 'services';

let { DataList, ImageBox, PageComponent, PageHeader, PageFooter, PageView, PullDownIndicator } = controls;

export default function (page: Page) {
    let station = page.createService(StationService);

    class NewsListView extends React.Component<{}, {}>{
        private dataView: HTMLElement;
        loadNewsList(pageIndex: number): Promise<News[]> {
            return station.newsList(pageIndex).then(o => {
                return o;
            });
        }
        componentDidMount() {
            //this.dataView.style.webkitUserSelect = 'auto';
            // setTimeout(() => {
            //     this.dataView.style.removeProperty('-webkit-user-select');
            // }, 100);

            //   <a className="item" href={`#home_news?id=${o.Id}`}>
            //     <ImageBox src={o.ImgUrl} className="img-responsive" />
            //     <div className="title">{o.Title}</div>
            // </a>
            /*
                                            <PageView ref={(o) => o ? this.dataView = o.element : null}>
                                    <PullDownIndicator />
                                    <DataList scroller={() => this.dataView} loadData={this.loadNewsList}
                                        dataItem={(o: News, i: number) => (
                                            <div key={o.Id} style={{ height: 100 }}>
                                                FFFF
                                            </div>)}
                                    />
                                </PageView>*/
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {(defaultNavBar({ title: '微资讯', showBackButton: false }))}
                    </PageHeader>
                    <PageFooter>
                        <Menu pageName={page.name} />
                    </PageFooter>
                    <PageView className="main">
                        <DataList loadData={(i) => this.loadNewsList(i)}
                            dataItem={(o: News) =>
                                <a key={o.Id} className="item" href={`#home_news?id=${o.Id}`}>
                                    <ImageBox src={o.ImgUrl} className="img-responsive" />
                                    <div className="title">{o.Title}</div>
                                </a>
                            }
                        />
                    </PageView>
                </PageComponent>
            );
        }
    }

    ReactDOM.render(<NewsListView />, page.element);
}

