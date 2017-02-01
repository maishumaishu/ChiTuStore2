import { Page, defaultNavBar } from 'site';
import { StationService, imageUrl, News } from 'services';
import { HtmlView } from 'controls/HtmlView';
import * as site from 'site';

// import Vue = require('vue');

export default function (page: Page) {
    let station = page.createService(StationService);
    let id = page.routeData.values.id;
    console.assert(id);
    station.news(id).then(news => {
        page.loadingView.style.display = 'none';
        ReactDOM.render((
            <div className="container">
                <h2>{news.Title}</h2>
                <div className="small">
                    {news.Date.toLocaleDateString()}
                </div>
                <HtmlView content={news.Content} />
            </div>
        ), page.dataView)
    });

    ReactDOM.render(defaultNavBar({ title: '资讯详情' }), page.header);

}

