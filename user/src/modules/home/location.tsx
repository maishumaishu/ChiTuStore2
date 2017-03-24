import { Page, defaultNavBar } from 'site';
import { LocationService, Provinces, Cities } from 'services';
import AutoLocation from './../controls/autoLocation'
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
            })
        }
        render() {
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '我的位置' })}
                    </PageHeader>
                    <PageView>
                        <div className="autoLocation"><p className="location-name">当前位置:</p><p className="location">{this.state.text}</p></div>
                        <div><p>选择位置:</p></div>
                        <ul className="provinces">
                            {this.props.provincesProps.map((o, k) => (
                                <li key={k} className="provinces-item" onClick={() => this.GetCities(o.Id, k)}><span>{o.Name}</span>
                                    <div className="citys">
                                        <ul>
                                            {
                                                this.state.key == k ?
                                                    this.state.cities.map((item, index) => (
                                                        <li key={index}><span>{item.Name}</span></li>)
                                                    ) : ""
                                            }
                                        </ul>
                                    </div>
                                </li>
                            ))}

                        </ul>
                    </PageView>
                </PageComponent>
            )
        }
        GetCities(provinceId, key) {
            station.getCities(provinceId).then(o => {
                this.state.cities = o;
                this.state.key = key;
                this.setState(this.state);
            })
        }
    }
    function init() {
        station.getProvinces().then(o => {
            ReactDOM.render(<LocationPage provincesProps={o} />, page.element);
        })
    }
    init();
}