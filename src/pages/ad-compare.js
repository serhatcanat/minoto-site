import React from 'react'
// Partials
// import Image from 'components/partials/image.js'
// import Select from 'components/partials/select'
// Deps
// import {storageSpace} from 'functions/helpers'
// import request from 'controllers/request'
// import slice from 'lodash/slice'
// Assets
// import image_car_default from 'assets/images/defaults/car.svg'

export default class AdCompare extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cars: [false, false, false],
            brands: [],
        }
    }

    initialize() {

    }

    componentDidMount() {
        this.initialize();
    }

    render() {
        return (
            <main className="page adCompare">
                <section className="section comparison">
                    <div className="wrapper">
                        <h1 className="comparison-title">Araç Karşılaştır</h1>
                        <div className="comparison-tablewrap">
                            <table className="compare-table">
                                <tbody>
                                <tr>
                                    <ul className="topinfo-highlights">
                                        <React.Fragment key={1}>
                                            <li key={2} title='2018'>

                                                    <span className='label'>2018</span>
                                            </li>
                                        </React.Fragment>
                                    </ul>
                                </tr>
                                <tr>
                                    <th>Model Adı</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="title"/>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Fiyatı</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="price"/>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Kasa Tipi / Kapı Sayısı</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="type"/>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Motor Tipi</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="engine"/>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Motor Gücü</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="power"/>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Euro NCAP Puanı</th>
                                    {this.state.cars.map((car, nth) => (
                                        <CarData car={car} key={nth} nth={nth} fragment="ncap"/>
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

// class CarPicker extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             taxonomyList: [props.brands],
//             taxonomySelection: [],
//         }
//
//         this.props.onCarChange(false, this.props.nth);
//
//         /*this.changeBrand = this.changeBrand.bind(this);
//         this.changeModel = this.changeModel.bind(this);
//         this.changeType = this.changeType.bind(this);
//         this.changePackage = this.changePackage.bind(this);*/
//         this.taxChange = this.taxChange.bind(this);
//
//         this.ajaxController = false;
//     }
//
//     componentDidUpdate(prevProps) {
//         // Buraya Dışardan Model Şeyleri Gelcek
//         /*if(!isEqual(prevProps.car, this.props.car)){
//             console.log('DEĞİŞ');
//             let car = this.props.car;
//             let model = null;
//             let models = car.modelOptions.map((opt) => {
//                 let newOpt = {value: opt.id, label: opt.title};
//                 if(opt.id === car.model){ model = newOpt}
//                 return newOpt;
//             });
//
//             let type = null;
//             let types = car.typeOptions.map((opt) => {
//                 let newOpt = {value: opt.id, label: opt.title};
//                 if(opt.id === car.type){ type = newOpt}
//                 return newOpt;
//             });
//
//             let pack = null;
//             let packages = car.packageOptions.map((opt) => {
//                 let newOpt = {value: opt.id, label: opt.title};
//                 if(opt.id === car.package){ pack = newOpt}
//                 return newOpt;
//             });
//
//             this.setState({
//                 brand: this.props.brands.filter((opt) => car.brand === opt.value),
//                 model: model,
//                 models: models,
//                 type: type,
//                 types: types,
//                 package: pack,
//                 packages: packages,
//             });
//         }*/
//
//         if (!isEqual(prevProps.brands, this.props.brands)) {
//             this.setState({
//                 taxonomyList: [this.props.brands]
//             })
//         }
//     }
//
//     /*changeBrand(e) {
//         let vm = this;
//
//         vm.setState({
//             brand: e,
//             model: null,
//             type: null,
//             package: null,
//             models: [],
//             types: [],
//             packages: [],
//         });
//
//         vm.props.onCarChange(false, vm.props.nth);
//
//         if(e){
//             if (vm.ajaxController !== false) {
//                 vm.ajaxController.cancel('Canceled duplicate request.');
//             }
//             setTimeout(function () {
//                 vm.ajaxController = request.get('/dummy/data/comparison-models.json', {brand: e.value}, function (payload) {
//                     vm.ajaxController = false;
//                     if (payload) {
//                         vm.setState({
//                             models: payload.map((model) => ({value: model.id, label: model.title}))
//                         });
//                     }
//                 }, {excludeApiPath: true});
//             }, 20);
//             }
//     }
//
//     changeModel(e) {
//         let vm = this;
//
//         vm.setState({
//             model: e,
//             type: null,
//             package: null,
//             types: [],
//             packages: [],
//         });
//
//         vm.props.onCarChange(false, vm.props.nth);
//
//         if(e){
//             if (vm.ajaxController !== false) {
//                 vm.ajaxController.cancel('Canceled duplicate request.');
//             }
//             setTimeout(function () {
//                 vm.ajaxController = request.get('/dummy/data/comparison-types.json', {brand: vm.state.brand.value, model: e.value}, function (payload) {
//                     vm.ajaxController = false;
//                     if (payload) {
//                         vm.setState({
//                             types: payload.map((type) => ({value: type.id, label: type.title}))
//                         });
//                     }
//                 }, {excludeApiPath: true});
//             }, 20);
//         }
//     }
//
//     changeType(e) {
//         let vm = this;
//
//         vm.setState({
//             type: e,
//             package: null,
//             packages: [],
//         });
//
//         vm.props.onCarChange(false, vm.props.nth);
//
//         if(e){
//             if (vm.ajaxController !== false) {
//                 vm.ajaxController.cancel('Canceled duplicate request.');
//             }
//             setTimeout(function () {
//                 vm.ajaxController = request.get('/dummy/data/comparison-packages.json', {brand: vm.state.brand.value, model: vm.state.model.value, type: e.value}, function (payload) {
//                     vm.ajaxController = false;
//                     if (payload) {
//                         vm.setState({
//                             packages: payload.map((pack) => ({value: pack.id, label: pack.title}))
//                         });
//                     }
//                 }, {excludeApiPath: true});
//             }, 20);
//         }
//     }
//
//     changePackage(e) {
//         let vm = this;
//
//         vm.setState({
//             package: e,
//         });
//
//         if(e){
//             if (vm.ajaxController !== false) {
//                 vm.ajaxController.cancel('Canceled duplicate request.');
//             }
//             setTimeout(function () {
//                 vm.ajaxController = request.get('/dummy/data/comparison-car.json', {brand: vm.state.brand.value, model: vm.state.model.value, type: vm.state.type.value, package: e.value}, function (payload) {
//                     vm.ajaxController = false;
//                     if (payload) {
//                         vm.props.onCarChange(payload, vm.props.nth);
//                     }
//                 }, {excludeApiPath: true});
//             }, 20);
//         }
//     }*/
//
//     taxChange(e, nth) {
//         let vm = this;
//         let selections = slice(vm.state.taxonomySelection, 0, nth + 1);
//         let taxes = slice(vm.state.taxonomyList, 0, nth + 1);
//         selections[nth] = e;
//
//         vm.setState({taxonomyList: taxes, taxonomySelection: selections});
//
//         let query = selections.map((tax) => (tax.value)).join('/');
//
//         request.get('/dummy/data/comparison-taxonomy.json', {query: query}, function (payload) {
//             if (payload) {
//                 taxes.push(payload);
//
//                 vm.setState({taxonomyList: taxes})
//             }
//         }, {excludeApiPath: true});
//     }
//
//     render() {
//         let car = this.props.car;
//         // let brands = this.props.brands;
//
//         return (
//             <div className="table-carpicker">
//                 <div className="carpicker-imagewrap">
//                     <Image className="carpicker-image" bg
//                            src={((car && car.image) ? storageSpace('car-posts', car.image) : image_car_default)}/>
//
//                 </div>
//
//                 {[0, 1, 2, 3, 4].map((nth) => (
//                     <TaxonomySelector
//                         taxonomies={this.state.taxonomyList}
//                         selection={this.state.taxonomySelection}
//                         onChange={this.taxChange}
//                         nth={nth}
//                         key={nth}/>
//                 ))}
//
//                 {/*
// 				<Select
// 					className="carpicker-selector brand"
// 					value={this.state.brand}
// 					onChange={this.changeBrand}
// 					options={brands}
// 					placeholder="Marka Seçiniz"
// 				/>
//
// 				<Select
// 					className="carpicker-selector model"
// 					value={this.state.model}
// 					onChange={this.changeModel}
// 					options={this.state.models}
// 					placeholder="Model Seçiniz"
// 					isDisabled={this.state.brand === null || this.state.models.length === 0}
// 				/>
//
// 				<Select
// 					className="carpicker-selector type"
// 					value={this.state.type}
// 					onChange={this.changeType}
// 					options={this.state.types}
// 					placeholder="Tip Seçiniz"
// 					isDisabled={this.state.model === null || this.state.types.length === 0}
// 				/>
//
// 				<Select
// 					className="carpicker-selector package"
// 					value={this.state.package}
// 					onChange={this.changePackage}
// 					options={this.state.packages}
// 					placeholder="Donanım Tipi Seçiniz"
// 					isDisabled={this.state.type === null || this.state.packages.length === 0}
// 				/>
// 				*/}
//             </div>
//         )
//     }
// }

// class TaxonomySelector extends React.Component {
//     render() {
//         let car = this.props.car;
//         let nth = this.props.nth;
//         let tax = this.props.taxonomies[nth];
//         let selected = this.props.selection[nth];
//         let placeholder = false;
//
//         if (tax) {
//         } else {
//             tax = this.props.taxonomies[this.props.taxonomies.length - 1];
//             placeholder = true;
//         }
//
//         if (tax && (!placeholder || (placeholder && !car))) {
//             return (
//                 <Select
//                     className="carpicker-selector"
//                     value={selected ? selected : null}
//                     onChange={(e) => {
//                         this.props.onChange(e, nth)
//                     }}
//                     options={tax.opts}
//                     placeholder={(placeholder ? 'Önce ' : '') + tax.title}
//                     isDisabled={placeholder}
//                 />
//             )
//         } else {
//             return false;
//         }
//     }
// }

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
