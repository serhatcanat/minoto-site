import React from "react";
// Partials
import Image from '../../partials/image'
import Btn from '../../partials/btn'
import PopInfo from '../../partials/popinfo.js'
import Collapse from '../../partials/collapse.js'
import Link from '../../partials/link.js'
import PriceTag from '../../partials/price-tag'
import {DetailCredit} from '../../partials/detail'
// Deps
import {openModal} from "../../../functions/modals"
import {storageSpace} from "../../../functions/helpers"
import {GA} from '../../../controllers/ga'
// Assets
import image_avatar from '../../../assets/images/defaults/avatar.svg';

const ncapDescriptions = [
    "1 yıldızlı güvenlik: Marjinal çarpışma koruması.",
    "2 yıldızlı güvenlik: Nominal çarpışma koruması ancak çarpışmadan kaçınma teknolojisi yok.",
    "3 yıldızlı güvenlik: Yolcu koruma konusunda ortalama ile iyi arasında ancak çarpışmadan kaçınma teknolojisi yok.",
    "4 yıldızlı güvenlik: Çarpışma korumasına yönelik toplam iyi performans; ilave çarpışmadan kaçınma teknolojisi mevcut olabilir.",
    "5 yıldızlı güvenlik: Çarpışma korumasına yönelik toplam iyi performans. Sağlam çarpışmadan kaçınma ekipmanı ile donatılmış."
];

export class DetailInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showCosts: false,
            showDealers: false,
            selectedBranch: false,
        }
        this.setVehicleToReservation = this.setVehicleToReservation.bind(this)
    }
    setVehicleToReservation(product){
        const {setVehicleToReservation} = this.props;
        setVehicleToReservation(product);
        this.props.history.push(`/rezervasyon/${this.props.product.postNo}`)
    }
    render() {
        let vm = this;
        let product = vm.props.product;
        let selectedBranch = vm.state.selectedBranch;

        return (
            <div className="detail-info">
                <h2 className="info-title">{product.title}</h2>
                {(product.mainFeatures && product.mainFeatures.length) &&
                <ul className="info-mainfeatures">
                    {product.mainFeatures.map((feature, nth) => (
                        <li key={nth}>
								<span title={feature.title + ': ' + feature.label}>
									{feature.icon && <i className={"icon-" + feature.icon}/>}
                                    <label>{feature.label}</label>
								</span>
                        </li>
                    ))}
                </ul>
                }
                {(product.highlights && vm.props.mobile) &&
                <ul className="info-highlights">
                    {product.highlights.map((highlight, nth) => (
                        <React.Fragment key={nth}>
                            {
                                highlight.label && (
                                    <li key={nth} title={highlight.title}>{(highlight.image ?
                                            <Image alt={highlight.title} src={`/dummy/images/${highlight.image}`} />
                                            :
                                            <span>{highlight.label}</span>
                                    )}</li>
                                )
                            }
                        </React.Fragment>
                    ))}
                </ul>
                }
                {product.ncap &&
                <div className="info-ncap">
                    <strong title="Euro NCAP Puanı">NCAP</strong>
                    <div className="ncap-stars" title={product.ncap + ' Yıldız'}>
                        <i className={"icon-star" + (product.ncap >= 1 ? ' active' : '')}/>
                        <i className={"icon-star" + (product.ncap >= 2 ? ' active' : '')}/>
                        <i className={"icon-star" + (product.ncap >= 3 ? ' active' : '')}/>
                        <i className={"icon-star" + (product.ncap >= 4 ? ' active' : '')}/>
                        <i className={"icon-star" + (product.ncap >= 5 ? ' active' : '')}/>
                    </div>
                    <PopInfo className="ncap-info" wide content={ncapDescriptions[product.ncap - 1]}>
                        <i className="icon-question"/>
                    </PopInfo>
                </div>
                }

                <div className="info-price">
                    <strong className="price-current">
                        {product.price ? <PriceTag price={product.price} /> : 'SORUNUZ'}
                    </strong>
                    {(product.listingPrice && product.price > 0 && (product.listingPrice > product.price)) &&
                    <div className={"price-listing" + ((product.listingPrice > product.price) ? ' higher' : '')}>
                        <strong>Liste Fiyatı:</strong> <span style={{ textDecoration: parseInt(product.listingPrice, 10) > parseInt(product.price, 10) ? 'line-through' : 'none' }}>
								<PriceTag stroke={parseInt(product.listingPrice, 10) > parseInt(product.price, 10)} price={parseInt(product.listingPrice, 10) > parseInt(product.price, 10) ? product.listingPrice : product.price} /></span>
                    </div>
                    }
                </div>

                {(product.price > 0 && product.costs.expenses.length) &&
                <div className="info-costs">
                    <button className="costs-sum" type="button" onClick={() => { vm.setState({ showCosts: !vm.state.showCosts }) }}><strong>Bu aracın yıllık kullanım maliyeti:</strong> <PriceTag price={product.costs.total} /></button>
                    <Collapse className="costs-wrap" open={vm.state.showCosts}>
                        <ul className="costs-list">
                            {product.costs.expenses.map((cost, nth) => (
                                <React.Fragment key={nth}>
                                    {
                                        (cost.cost > 0) && (
                                            <React.Fragment>
                                                <li className="list-cost" key={nth}>
                                                    <strong>
                                                        {cost.title}
                                                        {nth === 1 &&
                                                        <PopInfo className="cost-info" content="İlk defa araç sahibi olanlar için öngörülen ortalama fiyattır" nowrap>
                                                            <i className="icon-question"></i>
                                                        </PopInfo>
                                                        }
                                                    </strong>
                                                    <span className="cost-num"><PriceTag price={cost.cost} /></span>
                                                </li>

                                            </React.Fragment>
                                        )

                                    }
                                </React.Fragment>
                            ))}
                            <li className="list-cost total">
                                <strong>
                                    Toplam
                                    {/*<PopInfo className="cost-info" content="İstanbul Sanayi Odası'ndan alınmıştır" nowrap>
									<i className="icon-question"></i>
										</PopInfo>*/}
                                </strong>
                                <span className="cost-num"><PriceTag price={product.costs.total} /></span>
                            </li>
                        </ul>
                    </Collapse>
                </div>
                }
                <div className="info-controls">
                    <div className="controls-buttons">
                        {product.status === 1 &&
                        <Btn className="controls-button reservate" primary hollow uppercase
                             note="Bu aracı çok yakında rezerve edebileceksiniz."
                             onClick={() => this.setVehicleToReservation(product)}>
                            Reserve Et
                        </Btn>
                        }
                        {product.status === 2 &&
                            <Btn className="controls-button reservate" primary hollow uppercase
                                 note="Bu araç rezerve edilmiştir."
                                 disabled
                                 >
                                Araç Satılmıştır
                            </Btn>
                        }

                        {product.status === 3 &&
                        <Btn className="controls-button reservate" primary hollow uppercase
                             note="Bu araç satılmıştır.Rezerve edilemez."
                             disabled
                        >
                            Satıldı
                        </Btn>
                        }

                        {/*<Btn className="controls-button reservate" primary hollow uppercase note="Bu aracı çok yakında rezerve edebileceksiniz." disabled={true}>*/}
                        {/*    Rezerve Et*/}
                        {/*</Btn>*/}
                        {
                            ((vm.props.mobile && product.dealer.phone) ?
                                    <a
                                        className="controls-phone"
                                        onClick={()=>{
                                            GA.send('conversion', {
                                                action: 'callDealer',
                                            });
                                        }}
                                        href={"tel:+9" + product.dealer.phone.replace(' ', '')}>
                                        <i className="icon-phone-nude"></i>
                                    </a>
                                    :
                                    <React.Fragment>
                                        {
                                            ((vm.props.mobile && product.dealerPhone) &&
                                                <a
                                                    className="controls-phone"
                                                    onClick={()=>{
                                                        GA.send('conversion', {
                                                            action: 'callDealer',
                                                        });
                                                    }}
                                                    href={"tel:+9" + product.dealerPhone.replace(' ', '')}>
                                                    <i className="icon-phone-nude"></i>
                                                </a>
                                            )
                                        }
                                    </React.Fragment>
                            )

                        }
                        {(product.bidThreadId)
                            ?
                            <Btn className="controls-button bid" note="Bu araç için daha önce teklif verdiniz." primary uppercase tag="a" href={`/hesabim/mesajlarim/mesaj/${product.bidThreadId}`}>Tekliflerim</Btn>
                            :
                            <Btn disabled={(product.status === 3 || product.price === null)} className="controls-button bid" onClick={() => openModal('bid', { advert: product })} primary uppercase note={product.status === 3 ? 'Bu araç "satıldı".' : (product.price === null ? 'Fiyat için bayi ile iletişime geçebilirsiniz' : 'Bu araç için teklif verebilirsiniz.')}>
                                {product.status === 3 ? 'SATILDI' : 'Teklif Ver'}
                            </Btn>}

                    </div>

                    {(product.reserved && product.reservationEndDate) &&
                    <span className="controls-note">{product.reservationEndDate}'a kadar rezerve edilmiştir.</span>
                    }
                </div>

                {
                    !product.dealer.list ?
                        (
                            <React.Fragment>
                                {
                                    product.dealer &&
                                    <div className="info-dealer">
                                        <div className="dealer-head">
                                            <Image className="dealer-image" bg
                                                   src={storageSpace('dealers', product.dealer.logo)}/>
                                            <div className="head-content">
                                                <Link href="branch" params={{ dealer: product.dealer.dealerUrl, slug: product.dealer.url }}>

                                                    <strong className="dealer-title">
														<span className="dealer-badge">
															<PopInfo nowrap upsideDown content="Yetkili Bayi" noMarginLeft>
																<i className="badge-bg icon-ribbon"></i><i className="badge-icon icon-check"></i>
															</PopInfo>
														</span>

                                                        {product.dealer.title}
                                                    </strong>
                                                </Link>
                                                <p className="dealer-info">
                                                    <span className="info-location">{product.dealer.location}</span>
                                                    {product.dealer.workingHours && (
                                                        <span className={"info-workinghours " + (product.dealer.open ? 'open' : 'closed')}>
															{product.dealer.workingHours}
                                                            <span>|</span>
                                                            {(product.dealer.open ? 'Şu an açık' : 'Şu an kapalı')}
														</span>
                                                    )}

                                                </p>
                                            </div>
                                        </div>
                                        {product.dealer.rep &&
                                        <div className="dealer-rep">
                                            <Image src={product.dealer.rep.image ? product.dealer.rep.image : image_avatar} className="rep-image" />
                                            <strong className="rep-title">{product.dealer.rep.name}</strong>
                                            <span className="rep-role">{product.dealer.rep.role}</span>
                                        </div>
                                        }
                                        <div className="dealer-controls">
                                            {
                                                product.dealer.phone && (
                                                    <Btn
                                                        tag="a"
                                                        icon="phone"
                                                        block uppercase
                                                        onClick={()=>{
                                                            GA.send('conversion', {
                                                                action: 'callDealer',
                                                            });
                                                        }}
                                                        href={"tel:+9" + product.dealer.phone.replace(' ', '')}>
                                                        {product.dealer.phone}
                                                    </Btn>
                                                )

                                            }


                                            {
                                                product.messageThreadId ? <Btn icon="envelope" text uppercase block tag="a" href={`/hesabim/mesajlarim/mesaj/${product.messageThreadId}`}>Mesajlara Git</Btn> : <Btn icon="envelope" text uppercase block onClick={() => openModal('message', { advert: product })}>Mesaj Gönder</Btn>
                                            }

                                        </div>
                                    </div>
                                }
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {
                                    product.dealer.list && (
                                        <div className="info-dealers" style={{ marginTop: '1rem' }}>
                                            <button className="dealers-sum" type="button" onClick={() => { vm.setState({ showDealers: !vm.state.showDealers }) }}><strong>Bu aracı satın alabileceğiniz yetkili bayiler ({product.dealer.list.length}):</strong> </button>
                                            <Collapse className="dealers-wrap" open={vm.state.showDealers}>
                                                <ul className="dealers-list">
                                                    {product.dealer.list.map((dealerLoc, nth) => (
                                                        <React.Fragment key={nth}>
                                                            {
                                                                (dealerLoc) && (
                                                                    <React.Fragment>
                                                                        <li className="list-cost" key={nth} style={{ paddingTop: nth === 0 ? '' : '0' }}>
                                                                            <div className="info-dealers" style={{ width: '100%', padding: '0' }}>
                                                                                <button onClick={() => { vm.setState({ selectedBranch: dealerLoc, showDealers: !vm.state.showDealers }) }}>{dealerLoc.title}</button>
                                                                            </div>
                                                                        </li>

                                                                    </React.Fragment>
                                                                )

                                                            }
                                                        </React.Fragment>
                                                    ))}
                                                </ul>
                                            </Collapse>
                                            <React.Fragment>
                                                {
                                                    selectedBranch && (
                                                        <div className="info-dealer">
                                                            <div className="dealer-head">
                                                                <Image className="dealer-image" bg src={product.dealer.image} />
                                                                <div className="head-content">
                                                                    <Link href="branch" params={{ id: selectedBranch.id, slug: selectedBranch.url }}>
                                                                        {selectedBranch.validated ?
                                                                            <span className="dealer-badge"><i className="badge-bg icon-ribbon"></i><i className="badge-icon icon-check" ></i></span>
                                                                            :
                                                                            false
                                                                        }
                                                                        <strong className="dealer-title">{selectedBranch.title}</strong>
                                                                    </Link>
                                                                    <p className="dealer-info">
                                                                        <span className="info-location">{selectedBranch.location}</span>
                                                                        <span className={"info-workinghours " + (selectedBranch.open ? 'open' : 'closed')}>
																			{selectedBranch.workingHours}
                                                                            <span>|</span>
                                                                            {(selectedBranch.open ? 'Şu an açık' : 'Şu an kapalı')}
																		</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {selectedBranch.rep &&
                                                            <div className="dealer-rep">
                                                                <Image src={selectedBranch.rep.image ? selectedBranch.rep.image : image_avatar} className="rep-image" />
                                                                <strong className="rep-title">{selectedBranch.rep.name}</strong>
                                                                <span className="rep-role">{selectedBranch.rep.role}</span>
                                                            </div>
                                                            }
                                                            <div className="dealer-controls">
                                                                {
                                                                    selectedBranch.phone && (
                                                                        <Btn
                                                                            tag="a"
                                                                            icon="phone"
                                                                            block uppercase
                                                                            onClick={()=>{
                                                                                GA.send('conversion', {
                                                                                    action: 'callDealer',
                                                                                });
                                                                            }}
                                                                            href={"tel:+9" + selectedBranch.phone.replace(' ', '')}>
                                                                            {selectedBranch.phone}
                                                                        </Btn>
                                                                    )

                                                                }

                                                                {
                                                                    product.messageThreadId ? <Btn icon="envelope" text uppercase block tag="a" href={`/hesabim/mesajlarim/mesaj/${product.messageThreadId}`}>Mesajlara Git</Btn> : <Btn icon="envelope" text uppercase block onClick={() => openModal('message', { advert: product, dealer: selectedBranch })}>Mesaj Gönder</Btn>
                                                                }

                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </React.Fragment>
                                        </div>
                                    )

                                }
                            </React.Fragment>
                        )
                }
                {!vm.props.mobile && <DetailCredit product={product} mobile={vm.props.mobile} />}

            </div>
        )
    }
}
