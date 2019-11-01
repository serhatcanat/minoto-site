import React from 'react'
// Partials
import Image from '../components/partials/image.js'
// Deps
import {storageSpace} from '../functions/helpers'
import request from '../controllers/request'
import clone from 'lodash/clone'
import {connect} from "react-redux";
//Functions
import {addVehicleToCompare, deleteVehicleFromCompare, setVehicleToReservation} from "../actions";
import {openModal} from "../functions";
//Components
import NcapStars from "../components/partials/ncap-stars";
import DealerInfoCard from "../components/partials/dealer-info-card";
import Btn from "../components/partials/btn";
import Link from '../components/partials/link.js'
// Assets
import image_car_default from '../assets/images/defaults/car.svg'
import PriceTag from "../components/partials/price-tag";


class adCompare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cars: [false, false, false],
            brands: [],
        };
        this.changeCar = this.changeCar.bind(this);
        this.setVehicleToReservation = this.setVehicleToReservation.bind(this)
    }

    initialize() {
        let vm = this;
        request.get('/dummy/data/comparison-taxonomy.json', {}, function (payload) {
            if (payload) {
                vm.setState({
                    brands: payload,
                });
            }
        }, { excludeApiPath: true });
    }

    componentDidMount() {
        this.initialize();
    }

    changeCar(car, nth) {
        let newCars = clone(this.state.cars);
        newCars[nth] = car;
        this.setState({ cars: newCars });
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
                                <tr className='ad-compare-table__header'>
                                    <th className="empty">&nbsp;</th>
                                    {compareList.map((car, nth) => (
                                        <td className="picker" key={nth}>
                                            <div className='ad-compare-table__header__labelArea'>
                                                <div>
                                                    <ul className="info-highlights">
                                                        {car.highlights.map((highlight, nth) => (
                                                            <React.Fragment key={nth}>
                                                                {
                                                                    highlight.label && (
                                                                        <React.Fragment>
                                                                            <span
                                                                                className='label'>{highlight.label}</span>
                                                                        </React.Fragment>
                                                                    )
                                                                }
                                                            </React.Fragment>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => this.props.deleteVehicleFromCompare(car.id)}>ÇIKAR ⓧ
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='ad-compare-table__header__titleArea'>
                                                {/* todo: Link to product detail page */}
                                                <h1>
                                                    {car.title}
                                                </h1>
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
                                                    <PriceTag price={car.price}/>
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
                                <tr >
                                    <th>NCAP</th>
                                    {compareList.map((car, nth) => <td>
                                        {car.ncap &&
                                        <NcapStars ncap={car.ncap} info={false}/>
                                        }
                                    </td>)}
                                </tr>
                                <tr className='bg-gray'>
                                    <th>Araç Tipi</th>
                                    {compareList.map((car, nth) => (
                                        <td>
                                            {car.technicalSpecs[0].specs[0].content}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Kasa Tipi / Kapı Sayısı</th>
                                    {compareList.map((car, nth) => (
                                        <td>
                                            {car.technicalSpecs[0].specs[1].content}
                                        </td>
                                    ))}
                                </tr>
                                {/* todo: Ask production date  */}
                                {/*<tr>*/}
                                {/*    <th>Üretim Yılı (İlk / Son)</th>*/}
                                {/*    {this.state.cars.map((car, nth) => (*/}
                                {/*        <CarData car={car} key={nth} nth={nth} fragment="engine" />*/}
                                {/*    ))}*/}
                                {/*</tr>*/}
                                <tr className='bg-gray'>
                                    <th>Yakıt Tüketimi (Ortalama / Ş.İçi / Ş.Dışı)</th>
                                    {compareList.map((car, nth) => (
                                        <td>
                                            {car.technicalSpecs[1].specs[3].content}
                                        </td>
                                    ))}
                                </tr>
                                <tr >
                                    <th>Motor Gücü</th>
                                    {compareList.map((car, nth) => (
                                        <td>
                                            {car.technicalSpecs[1].specs[1].content}
                                        </td>
                                    ))}
                                </tr>
                                <tr className='bg-gray'>
                                    <th>Şanzıman</th>
                                    {compareList.map((car, nth) => (
                                        <td>
                                            {car.technicalSpecs[1].specs[2].content}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Motor Tipi</th>
                                    {compareList.map((car, nth) => (
                                        <td>
                                            {car.technicalSpecs[1].specs[0].content}
                                        </td>
                                    ))}
                                </tr>
                                <tr >
                                    <th className="empty">&nbsp;</th>
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

export default connect(mapStateToProps, mapDispatchToProps)(adCompare);
