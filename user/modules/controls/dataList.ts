import Vue = require('vue');

Vue.component('data-list', {
    template:
    `<div>
  <slot
    v-for="item in dataSource" :item="item">
    <!-- fallback content here -->
  </slot>
</div>`,
    data: function () {
        return {
            dataSource: [
            ]
        };
    },
    mounted: function () {
        let pageIndex = 0;
        let reslove = (items: Array<any>) => {
            items.forEach(o => this.dataSource.push(o));
        }
        let reject = (err) => {

        }
        this.$emit('load', pageIndex, reslove, reject);
    }
})