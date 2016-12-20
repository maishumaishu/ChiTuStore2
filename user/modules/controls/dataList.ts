import Vue = require('vue');

type ModelData = {
    dataSource: Array<any>,
    status: 'loading' | 'complted' | 'finish'
}
type ModelMethods = {
    fireLoad: (pageIndex, reslove, reject?) => void
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
    data(): ModelData {
        return {
            dataSource: [],
            status: 'loading',
        };
    },
    methods: {
        fireLoad(pageIndex, reslove, reject) {
            let self = this as ModelData & ModelMethods & VueInstance;
            if (self.status == 'complted')
                return;

            reject = reject || (() => { });
            self.status = 'loading';
            self.$emit('load', pageIndex, reslove, reject);
        }
    },
    mounted: function () {
        let self = this as ModelData & ModelMethods & VueInstance;
        let pageIndex = 0;
        let pageSize: number;
        let reslove = (items: Array<any>) => {
            if (pageIndex == 0) {
                pageSize = items.length || 1;
            }

            self.status = items.length < pageSize ? 'complted' : 'finish';
            items.forEach(o => this.dataSource.push(o));
            pageIndex = pageIndex + 1;
        }

        window.setTimeout(() => {

            self.fireLoad(pageIndex, reslove);
            scrollOnBottom(self.$parent.$el, function () {
                self.fireLoad(pageIndex, reslove);
            })

        }, 100);
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
