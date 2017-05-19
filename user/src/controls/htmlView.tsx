namespace controls {
    export class HtmlView extends React.Component<{ content: string, imageText?: string, className?: string }, {}>{
        componentDidMount() {
            let imgs = (this.refs['content'] as HTMLElement).querySelectorAll('img');
            for (let i = 0; i < imgs.length; i++) {
                loadImage(imgs[i] as HTMLImageElement, this.props.imageText);
            }
        }
        render() {
            return (
                <div ref="content" className={this.props.className} dangerouslySetInnerHTML={{ __html: this.props.content }}>
                </div>
            );
        }
    }

}