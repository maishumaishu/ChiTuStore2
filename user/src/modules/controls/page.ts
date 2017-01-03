import Vue = require('vue');

Vue.component('page', {
    template: `
        <div>
            <header>
                <slot name="header">fff</slot>
            </header>
            <slot></slot>
            <footer>
                <slot name="footer"></slot>
            </footer>
        </page>
    `
})