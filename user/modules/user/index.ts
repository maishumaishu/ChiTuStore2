import { Page } from 'chitu.mobile';
import Vue = require('vue');

export default function (page: Page) {
    page.load.add(() => {
        page.loadingView.style.display = 'none';
    })
}