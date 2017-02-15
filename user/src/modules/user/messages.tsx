import { Page } from 'chitu';
import { defaultNavBar } from 'site';
let { PageComponent, PageHeader, PageFooter, PageView, ImageBox, DataList } = controls;

export default function (page: Page) {
    class MessagePage extends React.Component<{}, {}>{
        render() {
            let messags = [
                { icon: '', color: '', title: '优化促销', text: '2.20　购买禾盒果买２送一', }
            ]
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的消息' })}
                    </PageHeader>
                    <PageView>

                        <ul className="list-group">
                            {messags.map(o =>
                                <li className="list-group-item">
                                    <div className="pull-left" style={{ width: 40, height: 40, backgroundColor: 'red', textAlign: 'center' }}>
                                        <i className="icon-thumbs-up" style={{ fontSize: 20, marginTop: 10, color: '#fff', display: 'block' }} />
                                    </div>
                                    <div style={{ textAlign: 'left', marginLeft: 50, }}>
                                        <div>
                                            {o.title}
                                        </div>
                                        <div>
                                            {o.text}
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                        <h3 style={{ textAlign: 'center' }}>
                        </h3>
                    </PageView>
                </PageComponent>
            )
        }
    }

    ReactDOM.render(<MessagePage />, page.element);
}