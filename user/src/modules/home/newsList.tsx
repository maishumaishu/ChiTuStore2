import { Page, defaultNavBar, Menu } from 'site';
import { StationService, News } from 'services';

let { DataList, ImageBox, PageComponent, PageHeader, PageFooter, PageView } = controls;

export default function (page: Page) {
    let station = page.createService(StationService);

    class NewsListView extends React.Component<{}, {}>{
        private dataView: HTMLElement;
        loadNewsList(pageIndex: number): Promise<News[]> {
            return station.newsList(pageIndex).then(o => {
                return o;
            });
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
                    <PageView ref={(o) => o ? this.dataView = o.element : null}>
                        <DataList scroller={() => this.dataView} loadData={this.loadNewsList}
                            dataItem={(o: News) => (
                                <div key={o.Id}>
                                    <a className="item" href={`#home_news?id=${o.Id}`}>
                                        <ImageBox src={o.ImgUrl} className="img-responsive" />
                                        <div className="title">{o.Title}</div>
                                    </a>
                                </div>)}
                            />
                    </PageView>
                </PageComponent>
            );
        }
    }

    ReactDOM.render(<NewsListView />, page.element);
}

