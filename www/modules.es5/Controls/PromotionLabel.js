'use strict';

Vue.component('promotion-label', {
    template: '<div>\n    <span v-for="item in types" v-bind:class="item.className" style="margin-left:2px;">{{item.text}}</span>\n</div>',
    props: ['value'],
    data: function data() {
        var value = this.value;
        if (!value) return { types: [] };
        var short = window.innerWidth < 350;
        var types = value.split('|').map(function (o) {
            var text = '';
            var className = '';
            switch (o) {
                case 'Given':
                    text = short ? '赠' : '满赠';
                    className = 'label label-info';
                    break;
                case 'Reduce':
                    text = short ? '减' : '满减';
                    className = 'label label-success';
                    break;
                case 'Discount':
                    text = short ? '折' : '满折';
                    className = 'label label-warning';
                    break;
            }
            return { text: text, className: className };
        });
        return { types: types };
    }
});
