import { Page, defaultNavBar } from 'site';
import { LocationService, Provinces, Cities } from 'services';
import AutoLocation from 'components/autoLocation'
let { PageComponent, PageHeader, PageFooter, PageView, ImageBox, DataList } = controls;

export default function (page: Page) {
    let station = page.createService(LocationService);
    interface locationState {
        cities: Array<Cities>,
        key: Number,
        text: String,
        status: Boolean
    }
    class LocationPage extends React.Component<{ provincesProps: Provinces[] }, locationState>{
        constructor(props) {
            super(props);
            this.state = {
                cities: [],
                key: -1,
                text: '',
                status: false
            }
            var autoLocation = new AutoLocation();
            autoLocation.init().then((result) => {
                this.state.text = result.regeocode.formattedAddress;
                this.state.status = result.status;
                this.setState(this.state)
            }).catch((error) => {
                this.state.text = "定位失败，请手动选择位置";
                this.state.status = false;
                this.setState(this.state)
            });
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的位置' })}
                    </PageHeader>
                    <PageView>
                        <div className="location-content">
                            <div className="autoLocation"><p className="location-text">当前位置:{this.state.text}</p></div>
                            <div><p>选择位置:</p></div>
                            <div className="location-box">
                                {this.props.provincesProps.map((o, k) => (
                                    <div className="list" key={k}>
                                        <p><span>{o.Name}</span></p>
                                        <ul className="provinces">
                                            {
                                                o.Cities.map((item, index) => (
                                                    <li key={index}><a>{item.Name}</a></li>)
                                                )
                                            }
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PageView>
                </PageComponent>
            )
        }
    }
    function init() {
        station.getProvincesAndCities().then(o => {
            ReactDOM.render(<LocationPage provincesProps={o} />, page.element);
        })
    }
    init();
}