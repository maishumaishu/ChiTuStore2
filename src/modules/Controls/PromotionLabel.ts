Vue.component('promotion-label', {
    template:
`<div>
    <span v-for="item in types" v-bind:class="item.className" style="margin-left:2px;">{{item.text}}</span>
</div>`,
    props: ['value'],
    data: function () {
        let value = this.value as string;
        if (!value)
            return { types: [] };

        let short = window.innerWidth < 350;
        let types = value.split('|').map((o) => {
            let text = '';
            let className = '';
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
            return { text, className };
        });
        return { types };
    }
});

