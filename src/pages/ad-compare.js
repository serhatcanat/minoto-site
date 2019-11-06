import React from 'react'
// Partials
import Image from '../components/partials/image.js'
// Deps
import {storageSpace} from '../functions/helpers'
import {connect} from "react-redux";
//Functions
import {addVehicleToCompare, deleteVehicleFromCompare, setVehicleToReservation} from "../actions";
import {openModal} from "../functions";
//Components
import CreditCalculator from "../components/partials/credit-calculator";
import Btn from "../components/partials/btn";
import Link from '../components/partials/link.js'
import PriceTag from "../components/partials/price-tag";
import NcapStars from "../components/partials/ncap-stars";
import DealerInfoCard from "../components/partials/dealer-info-card";
// Assets
import image_car_default from '../assets/images/defaults/car.svg'


class AdCompare extends React.Component {
    constructor(props) {
        super(props);

        this.setVehicleToReservation = this.setVehicleToReservation.bind(this)
    }


    setVehicleToReservation(product) {
        const {setVehicleToReservation} = this.props;
        setVehicleToReservation(product);
        this.props.history.push(`/rezervasyon/${product.postNo}`)
    }

    render() {
        const compareList = this.props.compareList.data;
        return <main className="page  comparison">
            {compareList.length>1 ?(
                <section className="section comparison  minoto-ui">
                    <div className="wrapper ad-compare">
                        <h1 className="comparison-title">Araç Karşılaştır</h1>
                        <div className="comparison-tablewrap">
                            <table className="comparison-table ad-compare-table">
                                <tbody>
                                {/*Table header start*/}
                                <tr className='ad-compare-table__header'>
                                    {compareList.map((car, nth) => (
                                        <td className="picker" key={nth}>
                                            <div className='ad-compare-table__header__labelArea'>
                                                <div>
                                                    <ul className="topinfo-highlights">
                                                        {car.highlights.map((highlight, nth) => (
                                                            <React.Fragment key={nth}>
                                                                {
                                                                    highlight.label && (
                                                                        <li key={nth} title={highlight.title}>{(highlight.image ?
                                                                                <Image alt={highlight.title} src={`/dummy/images/${highlight.image}`}/>
                                                                                :
                                                                                <span>{highlight.label}</span>
                                                                        )}</li>
                                                                    )
                                                                }
                                                            </React.Fragment>
                                                        ))}                                                    </ul>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => this.props.deleteVehicleFromCompare(car.id)}>ÇIKAR ⓧ
                                                    </button>
                                                </div>

                                            </div>
                                            <div className='ad-compare-table__header__titleArea'>
                                                {/* todo: Link to product detail page */}
                                                <Link href={car.slug} className='ad-compare-table__header__titleArea-title'>
                                                    <h1>
                                                        {car.title}
                                                    </h1>
                                                </Link>

                                                <Link href={"dealer"}
                                                      params={{slug: car.dealer.url}}>
                                                    {car.dealer.title}
                                                </Link>
                                                <div>
                                                    <h4>İLAN NO:</h4> <h4>{car.postNo}</h4>
                                                </div>
                                            </div>
                                            <div className="table-carpicker">
                                                <div className="carpicker-imagewrap">
                                                    <Image className="carpicker-image" bg
                                                           src={((car && car.image) ? storageSpace('car-posts', car.image) : image_car_default)}/>
                                                </div>
                                            </div>
                                            <div className='ad-compare-table__header__priceArea'>
                                                <strong className="price-current">
                                                    {car.price ? <PriceTag price={car.price} /> : <h2>SORUNUZ</h2>}
                                                </strong>
                                                <div className='ad-compare-table__header__priceArea__btnContainer'>
                                                    {car.status === 1 &&
                                                    <Btn className="controls-button reservate" primary hollow uppercase
                                                         note="Bu aracı çok yakında rezerve edebileceksiniz."
                                                         onClick={() => this.setVehicleToReservation(car)} disabled>
                                                        Reserve Et
                                                    </Btn>
                                                    }
                                                    {car.status === 2 &&
                                                    <Btn className="controls-button reservate" primary hollow uppercase
                                                         note="Bu araç rezerve edilmiştir."
                                                         disabled
                                                    >
                                                        Araç Satılmıştır
                                                    </Btn>
                                                    }

                                                    {car.status === 3 &&
                                                    <Btn className="controls-button reservate" primary hollow uppercase
                                                         note="Bu araç satılmıştır.Rezerve edilemez."
                                                         disabled
                                                    >
                                                        Satıldı
                                                    </Btn>
                                                    }
                                                    {(car.bidThreadId)
                                                        ?
                                                        <Btn className="controls-button bid"
                                                             note="Bu araç için daha önce teklif verdiniz." primary
                                                             uppercase tag="a"
                                                             href={`/hesabim/mesajlarim/mesaj/${car.bidThreadId}`}>Tekliflerim</Btn>
                                                        :
                                                        <Btn disabled={(car.status === 3 || car.price === null)}
                                                             className="controls-button bid"
                                                             onClick={() => openModal('bid', {advert: car})} primary
                                                             uppercase
                                                             note={car.status === 3 ? 'Bu araç "satıldı".' : (car.price === null ? 'Fiyat için bayi ile iletişime geçebilirsiniz' : 'Bu araç için teklif verebilirsiniz.')}>
                                                            {car.status === 3 ? 'SATILDI' : 'Teklif Ver'}
                                                        </Btn>}
                                                </div>
                                            </div>

                                        </td>
                                    ))}
                                </tr>
                                {/*Table header End*/}
                                <tr className='ad-compare-table-techSpec'>
                                    {compareList.map((car, nth) =>
                                        <td>
                                        <React.Fragment key={nth}>
                                            {car.ncap &&
                                            <React.Fragment>
                                                <span>NCAP</span>
                                                <NcapStars ncap={car.ncap} info={false}/>
                                            </React.Fragment>
                                            }
                                        </React.Fragment>
                                    </td>)}
                                </tr>
                                <tr className='bg-gray ad-compare-table-techSpec'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                    <span>Araç Tipi</span>
                                                {car.technicalSpecs[0].specs[0].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                    <span>Kasa Tipi / Kapı Sayısı</span>
                                                {car.technicalSpecs[0].specs[1].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec bg-gray'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Oturma Kapasitesi</span>
                                                {car.technicalSpecs[0].specs[2].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec '>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Renk</span>
                                                {car.technicalSpecs[0].specs[3].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec bg-gray'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Yakıt</span>
                                                {car.technicalSpecs[0].specs[4].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                {/* todo: Ask production date  */}
                                {/*<tr>*/}
                                {/*    <th>Üretim Yılı (İlk / Son)</th>*/}
                                {/*    {this.state.cars.map((car, nth) => (*/}
                                {/*        <CarData car={car} key={nth} nth={nth} fragment="engine" />*/}
                                {/*    ))}*/}
                                {/*</tr>*/}
                                <tr className='ad-compare-table-techSpec'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                    <span>Yakıt Tüketimi (Ortalama / Ş.İçi / Ş.Dışı)</span>
                                                {car.technicalSpecs[1].specs[3].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec bg-gray'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                    <span>Motor Gücü</span>
                                                {car.technicalSpecs[1].specs[1].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>

                                <tr className='ad-compare-table-techSpec'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                    <span>Şanzıman</span>
                                                {car.technicalSpecs[1].specs[2].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec bg-gray'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                    <span>Motor Tipi</span>
                                                {car.technicalSpecs[1].specs[0].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Hızlanma (0-100km) / Maksimum Hız</span>
                                                {car.technicalSpecs[1].specs[4].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec bg-gray'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Uzunluk</span>
                                                {car.technicalSpecs[2].specs[0].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Genişlik</span>
                                                {car.technicalSpecs[2].specs[1].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec bg-gray'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Yükseklik</span>
                                                {car.technicalSpecs[2].specs[2].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Dingil Aralığı</span>
                                                {car.technicalSpecs[2].specs[3].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table-techSpec bg-gray'>
                                    {compareList.map((car, nth) => (
                                        <React.Fragment>
                                            <td key={nth}>
                                                <span>Boş Ağırlik</span>
                                                {car.technicalSpecs[2].specs[4].content}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table__creditCalculator'>
                                    {compareList.map((car, nth) => (
                                        <td key={nth}>
                                            <CreditCalculator product={car}/>
                                        </td>
                                    ))}
                                </tr>
                                <tr className='ad-compare-table__contactCard'>
                                    {compareList.map((car, nth) => (
                                        <td>
                                            <DealerInfoCard product={car}/>
                                        </td>
                                    ))}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            ) :
                this.props.history.push('/')
            }
        </main>
    }
}


const mapStateToProps = ({generic, user, compareList, reservation}) => {
    return {mobile: generic.mobile, user: user.user, compareList, reservation};
};

const mapDispatchToProps = dispatch => {
    return {
        addVehicleToCompare: (data) => dispatch(addVehicleToCompare(data)),
        deleteVehicleFromCompare: (data) => dispatch(deleteVehicleFromCompare(data)),
        setVehicleToReservation: (data) => dispatch(setVehicleToReservation(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AdCompare);
