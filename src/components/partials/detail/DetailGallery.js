import React from "react";
// Partials
import Image from '../image'
import Btn from '../btn'
import Slider from '../slider.js'
// Deps
//import { ListingLink } from 'controllers/navigator'
import {blockOverflow} from '../../../functions/helpers.js'
import {storageSpace} from "../../../functions/helpers"
//Functions
// Assets
import image_loader from '../../../assets/images/minoto-loading.gif'

export class DetailGallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeImage: false,
        }

        this.mainSlider = React.createRef();
        this.thumbSlider = React.createRef();
        this.imageChange = this.imageChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
    }

    componentDidMount() {
        this.setState({activeImage: 0})

        document.addEventListener('keydown', this.keyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyPress);
    }

    componentDidUpdate(prevProps, prevState) {
        const nth = this.state.activeImage;
        let vm = this;
        if (vm.mainSlider.current.instance.realIndex !== nth) {
            vm.mainSlider.current.instance.slideToLoop(nth);
        }

        if (vm.thumbSlider.current && vm.thumbSlider.current.instance.realIndex !== nth) {
            vm.thumbSlider.current.instance.slideTo(nth);
        }


        if (prevProps.fullScreen !== vm.props.fullScreen) {
            setTimeout(function () {
                vm.mainSlider.current.instance.update();

                if (vm.thumbSlider.current) {
                    vm.thumbSlider.current.instance.update();

                }
                window.dispatchEvent(new Event('resize'));

                blockOverflow(vm.props.fullScreen);
            }, 200)
        }

    }

    imageChange(nth) {
        this.setState({activeImage: nth});
    }

    keyPress(e) {
        if (this.mainSlider.current && document.activeElement.tagName === 'BODY') {
            switch (e.key) {
                case "ArrowLeft":
                    //this.mainSlider.current.prev();
                    this.mainSlider.current.slideTo(this.state.activeImage);
                    break;
                case "ArrowRight":
                    //this.mainSlider.current.next();
                    this.mainSlider.current.slideTo(this.state.activeImage + 2);
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        let vm = this;
        let product = vm.props.product;
        let images = product.gallery;

        return <div className="content-gallery">
            {this.props.fullScreen &&
            <Btn className="gallery-close" low white uppercase icon="close" onClick={() => {
                vm.props.onFullScreenChange(false)
            }}>
                Kapat
            </Btn>
            }
            <div className="gallery-mainslider">
                <button className="mainslider-nav prev" aria-label="Prev Button" onClick={() => {
                    vm.mainSlider.current.prev();
                }}><i className="icon-angle-left"/></button>
                <button className="mainslider-nav next" aria-label="Next Button" onClick={() => {
                    vm.mainSlider.current.next();
                }}><i className="icon-angle-right"/></button>
                <Slider className="mainslider-slider" ref={vm.mainSlider} loop opts={{lazy: true}}
                        onChange={vm.imageChange}>
                    {images.map((image, nth) => (
                        <div className="slider-imagewrap" key={nth}>
                            <div className="imagewrap-image swiper-lazy"
                                 data-background={storageSpace('c_scale,q_60,w_1100/car-posts/gallery', image.medium)}
                                 onClick={() => {
                                     if (!vm.props.fullScreen && vm.props.mobile) {
                                         vm.props.onFullScreenChange(true);
                                     }
                                 }}>
                            </div>
                            <Image className="imagewrap-loader" width="100" bg src={image_loader}
                                   alt="Yükleniyor..."/>
                        </div>
                    ))}
                </Slider>
                {(!vm.props.mobile && !vm.props.fullScreen) &&
                <Btn className="mainslider-fullscreen" low white uppercase icon="search" onClick={() => {
                    vm.props.onFullScreenChange(true)
                }}>
                    Büyük Fotoğraf
                </Btn>
                }
            </div>
            {!vm.props.mobile &&
            <div className="gallery-thumbs">
                <button className="thumbs-nav prev" onClick={() => {
                    vm.thumbSlider.current.prev();
                }}><i className="icon-angle-left"/></button>
                <button className="thumbs-nav next" onClick={() => {
                    vm.thumbSlider.current.next();
                }}><i className="icon-angle-right"/></button>
                <Slider className="thumbs-carousel" slides={10} ref={vm.thumbSlider} opts={{preventClicks: false}}>
                    {images.map((image, nth) => (
                        <button type="button"
                                className={"carousel-imagebtn" + (vm.state.activeImage === nth ? ' active' : '')}
                                key={nth} onClick={() => {
                            vm.imageChange(nth);
                        }}>
                            <Image className="carousel-image" key={nth} bg
                                   src={storageSpace('c_scale,q_auto:best,w_130/car-posts/gallery', image.thumb)}
                                   alt={product.title}/>
                        </button>
                    ))}
                </Slider>
            </div>
            }
        </div>
    }
}
