import { Page, Menu, defaultNavBar } from 'site';
import { StationService, News } from 'services';
import * as site from 'site';

let { PageComponent, PageHeader, PageFooter, PageView, HtmlView } = controls;

// import Vue = require('vue');

export default function (page: Page) {
    let station = page.createService(StationService);
    let id = page.routeData.values.id;
    console.assert(id);

    class NewsPage extends React.Component<{ news: News }, {}>{
        render() {
            let news = this.props.news;
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '资讯详情' })}
                    </PageHeader>
                    <PageView>
                        <div className="container">
                            <h2>{news.Title}</h2>
                            <div className="small">
                                {news.Date.toLocaleDateString()}
                            </div>
                            <HtmlView content={news.Content} />
                        </div>
                    </PageView>
                </PageComponent>
            );
        }
    }

    station.news(id).then(news => {
        ReactDOM.render(<NewsPage news={news} />, page.element);
    })

}

