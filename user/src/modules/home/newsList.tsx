import { Page, defaultNavBar, Menu, app } from 'site';
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
                                <a key={o.Id} className="item" onClick={() => app.redirect(`home_news?id=${o.Id}`)}>
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

