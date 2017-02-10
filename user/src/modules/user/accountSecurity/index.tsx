import { Page } from 'site';
import { defaultNavBar } from 'site';
let { PageComponent, PageHeader, PageFooter, PageView, ImageBox, DataList } = controls;

export default function (page: Page) {
    class IndexPage extends React.Component<{}, {}>{
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的优惠券' })}
                    </PageHeader>
                    <PageView>
                        <h3 style={{ textAlign: 'center' }}>TODO</h3>
                    </PageView>
                </PageComponent>
            )
        }
    }

    ReactDOM.render(<IndexPage />, page.element);
}