import React from "react";
import Image from "./image";
import {openModal, storageSpace} from "../../functions";
import PopInfo from "./popinfo";
import Link from '../partials/link.js'
import image_avatar from "../../assets/images/defaults/avatar.svg";
import Btn from "./btn";
import {GA} from "../../controllers/ga";

export default class DealerInfoCard extends React.Component {
    render() {
        const {product} = this.props;
        return (
            <div className="info-dealer">
                <div className="dealer-head">
                    <Image className="dealer-image" bg
                           src={storageSpace('dealers', product.dealer.logo)}/>
                    <div className="head-content">
                        <Link href="branch" params={{dealer: product.dealer.dealerUrl, slug: product.dealer.url}}>

                            <strong className="dealer-title">
                                <span className="dealer-badge">
                                    <PopInfo nowrap upsideDown content="Yetkili Bayi"
                                             noMarginLeft>
                                        <i className="badge-bg icon-ribbon"/><i className="badge-icon icon-check"/>
                                    </PopInfo>
                                </span>
                                <span>
                                    {product.dealer.title}
                                </span>

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
                    <Image src={product.dealer.rep.image ? product.dealer.rep.image : image_avatar}
                           className="rep-image"/>
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
                                onClick={() => {
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
                        product.messageThreadId ? <Btn icon="envelope" text uppercase block tag="a"
                                                       href={`/hesabim/mesajlarim/mesaj/${product.messageThreadId}`}>Mesajlara
                            Git</Btn> : <Btn icon="envelope" text uppercase block
                                             onClick={() => openModal('message', {advert: product})}>Mesaj Gönder</Btn>
                    }
                </div>
            </div>

        )
    }
}
