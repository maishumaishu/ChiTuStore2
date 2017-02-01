import { Page } from 'site';
import { StationService, News } from 'services';

import { DataList } from 'controls/dataList';
import { ImageBox } from 'controls/imageBox';

export default function (page: Page) {
    let station = page.createService(StationService);

    class NewsListView extends React.Component<{}, {}>{
        loadNewsList(pageIndex: number): Promise<News[]> {
            return station.newsList(pageIndex).then(o => {
                if (pageIndex == 0)
                    page.loadingView.style.display = 'none';

                return o;
            });
        }
        render() {
            return (
                <DataList scroller={page.dataView} loadData={this.loadNewsList}
                    dataItem={(o: News) => (
                        <div key={o.Id}>
                            <a className="item" href={`#home_news?id=${o.Id}`}>
                                <ImageBox src={o.ImgUrl} className="img-responsive" />
                                <div className="title">{o.Title}</div>
                            </a>
                        </div>)}
                    />
            );
        }
    }

    ReactDOM.render(<NewsListView />, page.dataView);
}

