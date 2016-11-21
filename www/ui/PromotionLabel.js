let c = Vue.component('promotion-label', {
    template: `<span v-for="item in types"> \
        <span v-bind:text="item"></span>\
        <span v-if="item == 'Given'" class="label label-info" >{{givenText}}</span>\
        <span v-if="item == 'Reduce'" class="label label-success" >{{reduceText}}</span>\
        <span v-if="item == 'Discount'" class="label label-warning" >{{discountText}}</span>\
    </div>`,
    data: function () {
        return {
            value: '',
            types: function () {
                let value = this.value;
                this.types = value.split('|');
                this.givenText = '满赠';
                this.reduceText = '满减';
                this.discountText = '满折';
            }
        };
    }
});
