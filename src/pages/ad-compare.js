import React from 'react'
// Partials
import Image from 'components/partials/image.js'
// Deps
import {storageSpace} from 'functions/helpers'
import request from 'controllers/request'
import clone from 'lodash/clone'
// Assets
import image_car_default from 'assets/images/defaults/car.svg'
import PriceTag from "../components/partials/price-tag";
import Btn from "../components/partials/btn";

export default class Comparison extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cars: [false, false, false],
            brands: [],
        }
        this.changeCar = this.changeCar.bind(this);
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

    render() {
        return (
            <main className="page comparison">
                <section className="section comparison minoto-ui">
                    <div className="wrapper">
                        <h1 className="comparison-title">Araç Karşılaştır</h1>

                        <div className="comparison-tablewrap">
                            <table className="comparison-table ad-compare-table">
                                <tbody>
                                <tr className='ad-compare-table__header'>
                                    <th className="empty">&nbsp;</th>
                                    {this.state.cars.map((car, nth) => (
                                        <td className="picker" key={nth}>
                                            <div className='ad-compare-table__header__labelArea'>
                                                <div>
                                                    <span className='label'>2018</span>
                                                    <span className='label'>SIFIR KM</span>
                                                </div>
                                                <div>
                                                    <button className='btn-third'>ÇIKAR ⓧ</button>
                                                </div>
                                            </div>
                                            <div className='ad-compare-table__header__titleArea'>
                                                <h1>VW Tiguan 2.0 TDI SCR </h1>
                                                <h3>KOSİFLER - ANTALYA</h3>
                                                <div>
                                                    <h4>İLAN NO:</h4> <h4>1028920</h4>
                                                </div>
                                            </div>
                                            <div className="table-carpicker">
                                                <div className="carpicker-imagewrap">
                                                    <Image className="carpicker-image" bg src={((car && car.image) ? storageSpace('car-posts', car.image) : image_car_default)} />
                                                </div>
                                            </div>
                                            <div className='ad-compare-table__header__priceArea'>
                                                <strong className="price-current">
                                                    <PriceTag price={100000} />
                                                </strong>
                                                <div>
                                                    <Btn className="controls-button reservate" primary hollow uppercase
                                                         note="Bu aracı çok yakında rezerve edebileceksiniz."
                                                         >
                                                        Reserve Et
                                                    </Btn>
                                                    <Btn className="controls-button reservate" primary hollow uppercase
                                                         note="Bu aracı çok yakında rezerve edebileceksiniz."
                                                         Z>
                                                        Reserve Et
                                                    </Btn>
                                                </div>
                                            </div>

                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Model Adı</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="title" />
                                    ))}
                                </tr>
                                <tr>
                                    <th>Fiyatı</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="price" />
                                    ))}
                                </tr>
                                <tr>
                                    <th>Kasa Tipi / Kapı Sayısı</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="type" />
                                    ))}
                                </tr>
                                <tr>
                                    <th>Motor Tipi</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="engine" />
                                    ))}
                                </tr>
                                <tr>
                                    <th>Motor Gücü</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="power" />
                                    ))}
                                </tr>
                                <tr>
                                    <th>Euro NCAP Puanı</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="ncap" />
                                    ))}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>

        )
    }
}

class CarData extends React.Component {
    render() {
        let carData = this.props.car;
        let fragment = this.props.fragment;
        let data = (carData ? carData.specs[fragment] : false);
        return (
            <td className={"table-datafield" + (data ? '' : ' unavailable')}>
                {data ?
                    <React.Fragment>{data}</React.Fragment>
                    :
                    <React.Fragment>-</React.Fragment>
                }
            </td>
        )
    }
}
