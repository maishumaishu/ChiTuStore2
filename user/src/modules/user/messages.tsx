import { Page } from 'chitu';
import { defaultNavBar } from 'site';
let { PageComponent, PageHeader, PageFooter, PageView, ImageBox, DataList } = controls;

export default function (page: Page) {
    class MessagePage extends React.Component<{}, {}>{
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的消息' })}
                    </PageHeader>
                    <PageView>
                        <h3 style={{ textAlign: 'center' }}>TODO</h3>
                    </PageView>
                </PageComponent>
            )
        }
    }

    ReactDOM.render(<MessagePage />, page.element);
}