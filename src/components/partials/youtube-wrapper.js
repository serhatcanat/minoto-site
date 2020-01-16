import React, {useState} from 'react'
import Image from './image.js';
import image_loader from '../../assets/images/minoto-loading.gif'

export default class YoutubeWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVideoFrameHidden: true,
        };
        this.showVideoFrame = this.showVideoFrame.bind(this);
    }

    showVideoFrame() {
        this.setState({
            isVideoFrameHidden: false
        })
    }

    render() {
        const {videoId} = this.props;
        const {isVideoFrameHidden} = this.state;
        return (
            <div className='youtube-wrapper' onClick={this.showVideoFrame}>
                {isVideoFrameHidden ?
                    <>
                        <Image src={`https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`}/>
                        <PlayBtn showVideoFrame={this.showVideoFrame}/>
                    </>
                    :
                    <>
                        <VideoFrame videoId={videoId}/>
                    </>
                }
            </div>

        )
    }
}

function PlayBtn(props) {
    const {showVideoFrame} = props;
    return (
        <button onClick={showVideoFrame} className='youtube-wrapper--playBtn icon-youtube-play'>
        </button>
    )
}

function VideoFrame(props) {
    const {videoId} = props;
    const [isFrameLoading, hideLoading] = useState(true);
    return (
        <>
            <div>
                {isFrameLoading &&
                <img className="imagewrap-loader youtube-wrapper--spinner" width="45px" src={image_loader}
                     alt="Yükleniyor..."/>
                }
                <iframe height={"100%"} className="youtube-wrapper--video" title="youtube-video"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => {
                            hideLoading(false)
                        }}/>
            </div>
        </>
    )
}


YoutubeWrapper.defaultProps = {
    videoId: "4JThtv3d0cc",
};
