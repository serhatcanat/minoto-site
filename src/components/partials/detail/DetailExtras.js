import React from 'react'
// Sections
// Partials
import Image from '../../partials/image'
import Btn from '../../partials/btn'
import Slider from '../../partials/slider.js'
import Tabs from '../../partials/tabs.js'
// Deps
import {nl2br, remToPx} from '../../../functions/helpers.js'
import parse from 'html-react-parser'
import {DetailCredit, DetailRelated} from "./index";

//import image_isbank from 'assets/images/turkiye-is-bankasi.png'

export class DetailExtras extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expandDesc: false,
            expandableDesc: false,
            expandableEquipments: false,
            expandSpecs: false,
            expandEquipments: false,
            expandableSpecs: false,
            activeTab: false,
        };

        this.descWrap = React.createRef();
        this.specsWrap = React.createRef();
        this.equipmentsWrap = React.createRef();
        this.galleryWrap = React.createRef();

        this.checkSizes = this.checkSizes.bind(this);

        this.sizeLimit = 39.6;
    }

    componentDidMount() {
        this.checkSizes();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeTab !== this.state.activeTab) {
            this.checkSizes();
        }

        if (prevProps.mobile !== this.props.mobile) {
            this.checkSizes();
        }
    }

    checkSizes() {
        if (this.descWrap.current) {
            this.setState({expandableDesc: (this.props.mobile ? false : (this.descWrap.current.offsetHeight > remToPx(this.sizeLimit)))});
        }
        if (this.specsWrap.current) {
            this.setState({expandableSpecs: (this.props.mobile ? false : (this.specsWrap.current.offsetHeight > remToPx(this.sizeLimit)))});
        }
        if (this.equipmentsWrap.current) {
            this.setState({expandableEquipments: (this.props.mobile ? false : (this.equipmentsWrap.current.offsetHeight > remToPx(this.sizeLimit)))});
        }
    }

    render() {
        let vm = this;
        const {mobile, product: product1} = vm.props;
        let product = product1;
        let GalleryContainer = (mobile ? 'div' : Slider);
        let galleryProps = (mobile ? {} : {scrollBar: true, horizontal: true, ref: vm.galleryWrap});

        const {technicalSpecs, description, id, pressGallery, equipmentList} = product;
        const {expandableSpecs, expandableDesc, expandableEquipments, expandDesc, expandDesc: expandDesc1, expandSpecs, expandEquipments} = vm.state;

        return <div className="content-details">
            <Tabs className="details-tabs" onChange={(tab) => {
                vm.setState({activeTab: tab})
            }}>
                {description &&
                <div label="Bayi Notu" index="description">
                    <div className="tabs-tab">
                        <div
                            className={"tab-content" + (expandableDesc ? ' expandable' : '') + (expandDesc ? ' expanded' : '')}>
                            <div className="content-innerwrap" ref={vm.descWrap}>
                                <div className="tab-textarea wysiwyg">
                                    {parse(nl2br(description))}
                                </div>
                            </div>
                        </div>
                        {expandableDesc &&
                        <Btn className="tab-expand" uppercase block hollow low smallIcon dark
                             rightIcon={(expandDesc ? 'angle-up' : 'angle-down')} onClick={() => {
                            vm.setState({expandDesc: !vm.state.expandDesc})
                        }}>{(expandDesc ? 'Gizle' : 'Devamını Gör')}</Btn>
                        }
                    </div>
                </div>
                }
                {technicalSpecs &&
                <div label="Teknik Özellikler" index="techspecs">
                    <div className="tabs-tab">
                        <div
                            className={"tab-content" + (vm.state.expandableSpecs ? ' expandable' : '') + (vm.state.expandSpecs ? ' expanded' : '')}>
                            <div className="content-innerwrap" ref={vm.specsWrap}>
                                <div className="tab-specslist">
                                    {technicalSpecs.map((group, nth) => (
                                        <div className="specslist-group" key={nth}>
                                            <h3 className="group-title">{group.title}</h3>
                                            <table className="group-table table">
                                                <tbody>
                                                {group.specs.map((spec, nth) => (
                                                    <tr key={nth}>
                                                        <th>{spec.label}</th>
                                                        <td>{spec.content}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {expandableSpecs &&
                        <Btn className="tab-expand" uppercase block hollow low smallIcon dark
                             rightIcon={(expandDesc1 ? 'angle-up' : 'angle-down')} onClick={() => {
                            vm.setState({expandSpecs: !vm.state.expandSpecs})
                        }}>{expandSpecs ? 'Gizle' : 'Devamını Gör'}</Btn>
                        }
                    </div>
                </div>
                }
                <div label="Donanım" index="equipments">
                    <div className="tabs-tab">
                        <div
                            className={"tab-content" + (vm.state.expandableEquipments ? ' expandable' : '') + (vm.state.expandEquipments ? ' expanded' : '')}>
                            <div className="content-innerwrap" ref={vm.equipmentsWrap}>
                                <div className="tab-equipmentlist">
                                    <table className="table group-table">
                                        <tbody>
                                        {equipmentList &&
                                        equipmentList.map((equipmentCategory) => {
                                            return (
                                                equipmentCategory.equipments.map((equipment,index) => {
                                                    return (
                                                        <React.Fragment>
                                                            {index === 0 &&
                                                            <tr className="group-title">
                                                                <th>{equipmentCategory.category}</th>
                                                                <th className="check-container">Standart Donanım</th>
                                                                <th className="check-container">Opsiyonel Donanım</th>
                                                            </tr>
                                                            }

                                                            <tr>
                                                                <th>{equipment.equipment}</th>
                                                                <th className={equipment.type === 'S' ? 'icon-check-thin' : ''} />
                                                                <th className={equipment.type === 'O' ? 'icon-check-thin' : ''}/>
                                                            </tr>
                                                        </React.Fragment>
                                                    )
                                                })
                                            )
                                        })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {expandableEquipments &&
                        <Btn className="tab-expand" uppercase block hollow low smallIcon dark
                             rightIcon={(expandDesc1 ? 'angle-up' : 'angle-down')} onClick={() => {
                            vm.setState({expandEquipments: !vm.state.expandEquipments})
                        }}>{expandEquipments ? 'Gizle' : 'Devamını Gör'}</Btn>
                        }
                    </div>
                </div>
                {mobile &&
                <div label="Benzer Araçlar" index="similar">
                    <div className="tabs-tab">
                        <div className="tab-related">
                            {
                                product && <DetailRelated postId={id}/>
                            }
                        </div>
                    </div>
                </div>
                }
                {pressGallery &&
                <div label="Basın Fotoğrafları" index="pressgallery">
                    <div className="tabs-tab">
                        <GalleryContainer className="tab-gallery" {...galleryProps} >
                            {pressGallery.map((image, nth) => (
                                <div className="gallery-item" key={nth}>
                                    <button type="button" className="item-btn">
                                        <Image src={image.thumb} className="item-image" onLoad={() => {
                                            if (vm.galleryWrap.current) {
                                                vm.galleryWrap.current.update()
                                            }
                                        }}/>
                                    </button>
                                </div>
                            ))}
                        </GalleryContainer>
                    </div>
                </div>
                }
            </Tabs>
            {(mobile && product.carCredits) &&
                <DetailCredit product={product} mobile={mobile}/>
            }
        </div>
    }
}
