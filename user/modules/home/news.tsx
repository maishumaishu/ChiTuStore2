import { Page } from 'chitu.mobile';
import { station, imageUrl } from 'services';
import * as ui from 'core/ui';
import * as site from 'site';

import Vue = require('vue');

export default function (page: Page) {
    let id = page.routeData.values.id;
    console.assert(id);
    station.news(id).then(news => {
        let vm = new Vue({
            el: page.dataView,
            data: {
                news
            },
            render(h) {
                let news: station.News = this.news;
                return (
                    <section class="main container">
                        <h2>{news.Title}</h2>
                        <div class="small">
                            {news.Date}
                        </div>
                        <div domProps-innerHTML={news.Content}>
                        </div>
                    </section>
                );
            },
            mounted() {
                let self = this as VueInstance<any>;
                let imgs = self.$el.querySelectorAll('img');
                for (let i = 0; i < imgs.length; i++) {
                    imgs[i].src = imageUrl(imgs[i].src);
                    ui.imageDelayLoad(imgs[i], site.config.imageText);
                }
            }
        })

        page.loadingView.style.display = 'none';
    });

    createHeader(page);
}

function createHeader(page: Page) {
    new Vue({
        el: page.header,
        render(h) {
            return (
                <header>
                    <nav class="bg-primary" style="width:100%;">
                        <a name="back-button" href="javascript:app.back()" class="leftButton" style="padding-right:20px;padding-left:20px;margin-left:-20px;">
                            <i class="icon-chevron-left"></i>
                        </a>
                        <h4>资讯详情</h4>
                    </nav>
                </header>
            );
        }
    })
}