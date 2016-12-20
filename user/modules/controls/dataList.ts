import Vue = require('vue');

type Model = {
    dataSource: Array<any>,
    status: 'loading' | 'complted'
}

let template =
    `<div class="row">
        <slot v-for="item in dataSource" :item="item">
        </slot>
        <div class="data-loading col-xs-12">
            <div v-show="status == 'loading'">
                <i class="icon-spinner icon-spin"></i>
                <span>数据正在加载中...</span>
            </div>
            <div v-show="status == 'complted'">
                <span>数据已全部加载完</span>
            </div>
        </div>
    </div>`
Vue.component('data-list', {
    template,
    data(): Model {
        return {
            dataSource: [],
            status: 'loading',
        };
    },
    computed: {

    },
    mounted: function () {
        let self = this as Model & VueInstance;
        let pageIndex = 0;
        let pageSize: number;
        let reslove = (items: Array<any>) => {
            if (pageIndex == 0) {
                pageSize = items.length || 1;
            }

            self.status = items.length < pageSize ? 'complted' : 'loading';
            items.forEach(o => this.dataSource.push(o));
            pageIndex = pageIndex + 1;
        }
        let reject = (err) => {

        }
        self.$emit('load', pageIndex, reslove, reject);
        window.setTimeout(function () {
            scrollOnBottom(self.$parent.$el, function () {
                (<any>self).isLoading = true;
                self.$emit('load', pageIndex, reslove, reject);
            })
        }, 300);
    }
})

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
