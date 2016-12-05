import { Application, Page, action } from 'chitu.mobile';
import app = require('application');

export default function (page: Page) {
    window.setTimeout(() => {
        page.loadingView.style.display = 'none';
    }, 1000);
}

