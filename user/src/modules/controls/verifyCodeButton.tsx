import * as services from 'services';

let member = new services.MemberService();

class VerifyCodeButton extends React.Component<
    React.Props<VerifyCodeButton> & { get_mobile: () => string, set_smsId: (value: string) => void, type: services.VerifyCodeType }, { letfSeconds: number }>{

    constructor(props) {
        super(props);
        this.state = { letfSeconds: 0 };
    }

    async sendVerifyCode() {
        let mobile = this.props.get_mobile();
        if (!mobile) {
            throw new Error('mobile cannt empty.');
        }

        this.state.letfSeconds = 60;
        this.setState(this.state);
        let intervalId = setInterval(() => {
            this.state.letfSeconds = this.state.letfSeconds - 1;
            this.setState(this.state);

            if (this.state.letfSeconds <= 0) {
                window.clearInterval(intervalId);
            }

        }, 1000);

        await member.sentVerifyCode(mobile, this.props.type)
            .then((data) => {
                this.props.set_smsId(data.smsId);
            })
            .catch((err) => {
                this.state.letfSeconds = 0;
                this.setState(this.state);
                throw err;
            });
    }
    render() {
        return (
            <button type="button" className="btn btn-block btn-primary"
                disabled={this.state.letfSeconds > 0}
                onClick={() => this.sendVerifyCode()}>
                {this.state.letfSeconds > 0 ? `发送验证码(${this.state.letfSeconds})` : '发送验证码'}
            </button>
        );
    }
}

export = VerifyCodeButton;