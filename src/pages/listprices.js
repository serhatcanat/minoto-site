import React from 'react'

// Sections
//import Listing from 'components/sections/listing.js'

// Partials
import Breadcrumbs from 'components/partials/breadcrumbs'
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import Select from 'components/partials/select'
import PriceTag from 'components/partials/price-tag'

// Deps
import { storageSpace } from 'functions/helpers'
import request from 'controllers/request'
import { generatePath } from 'react-router'
import { setTitle, setDescription } from 'controllers/head'
import { getRoute/*, set404*/ } from 'controllers/navigator'

// Assets

export default class ListPrices extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			brands: false,
			yearFilters: false,
			brandFilters: false,
			selectedYear: null,
			selectedBrand: null,
		}

		this.initialize = this.initialize.bind(this);
		this.changeYear = this.changeYear.bind(this);
		this.changeBrand = this.changeBrand.bind(this);

		this.ajaxController = false;
	}

	initialize() {
		let vm = this;
		vm.setState({ brands: false });

		let brand = 'audi';
		let year = '2019';
		let dataParam = vm.props.match.params.data;



		if (dataParam) {
			let data = dataParam.substring(0, dataParam.indexOf('-fiyat-listesi')).split('-');
			if (data.length === 3) {
				brand = data[data.length - 1] ? data[1] + '-' + data[2] : brand;
			} else {
				brand = data[data.length - 1] ? data[1] : brand;
			}

			year = (data.length > 1) ? data[0] : 'tum_yillar';

		}

		if (vm.ajaxController !== false) {
			vm.ajaxController.cancel('Canceled duplicate request.');
		}
		setTimeout(function () {
			vm.ajaxController = request.get(
				//'/dummy/data/listprices.json',
				'car-data/price-lists',
				{
					yil: year,
					marka: brand
				},
				function (payload) {
					vm.ajaxController = false;
					//if (payload && payload.brands && payload.brands.length){
					let yearFilters = payload.filters.year.map(function (filter, nth) {
						let filterData = {
							value: filter.value,
							label: filter.title,
						}
						if (filter.selected) {
							vm.setState({ selectedYear: filterData });
						}
						return filterData;
					});

					let brandFilters = payload.filters.brand.map(function (filter, nth) {
						let filterData = {
							value: filter.value,
							label: filter.title,
						}
						if (filter.selected) {
							vm.setState({ selectedBrand: filterData });
						}
						return filterData;
					});

					vm.setState({
						loaded: true,
						brands: payload.brands,
						yearFilters: yearFilters,
						brandFilters: brandFilters
					});

					setTitle(((dataParam && vm.state.selectedYear && vm.state.selectedYear.value !== 'tum_yillar') ? vm.state.selectedYear.label + ' ' : '') + ((dataParam && vm.state.selectedBrand) ? vm.state.selectedBrand.label : 'Araba') + ' Fiyat Listesi ve ??zellikleri - T??rkiye\'nin S??f??r Km Oto Sitesi Minoto');

					if (dataParam) {
						setDescription(((vm.state.selectedYear && vm.state.selectedYear.value !== 'tum_yillar') ? vm.state.selectedYear.label + ' ' : '') + (vm.state.selectedBrand ? vm.state.selectedBrand.label : '') + ' fiyat listesi mi arad??n??z? S??f??r Km  [Y??l] [Marka] araba fiyat listesi ve ??zellikleri Minoto\'da! Hemen t??kla, f??rsatlar?? ka????rma!');
					}
					else {
						setDescription('S??f??r Km araba fiyat listesi mi arad??n??z? S??f??r Km araba fiyat listesi ve ??zellikleri Minoto\'da! Hemen t??kla, f??rsatlar?? ka????rma!');
					}
					//}
					//else {
					//	set404();
					//}
				}
			);
		}, 20);
	}

	componentDidMount() {
		this.initialize();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.selectedYear && prevState.selectedBrand) {
			if (prevState.selectedYear.value !== this.state.selectedYear.value || prevState.selectedBrand.value !== this.state.selectedBrand.value) {

				const path = generatePath(getRoute('listpricesDetail').path, { data: (this.state.selectedYear.value === 'tum_yillar' ? '' : this.state.selectedYear.value + '-') + this.state.selectedBrand.value + "-fiyat-listesi" });

				this.props.history.replace(path);
			}
		}

		if (prevProps.match.params.data !== this.props.match.params.data) {
			this.initialize();
		}
	}

	changeYear(option) {
		this.setState({ selectedYear: option });
	}

	changeBrand(option) {
		this.setState({ selectedBrand: option });
	}

	changeModel(option) {

	}

	render() {
		let vm = this;
		let brands = vm.state.brands;
		return (
			<main className="page prices">
				<Loader loading={vm.state.loaded === false} strict={true} />
				{vm.state.loaded &&
					<React.Fragment>
						<Breadcrumbs className="listprices-crumbs" standalone data={[
							{
								"href": "listprices",
								"title": "Araba Fiyat Listesi"
							},
							{
								"href": "listpricesDetail",
								"title": (vm.state.selectedBrand ? vm.state.selectedBrand.label : 'T??m Modeller'),
								"params": (vm.state.selectedBrand ? {
									data: (vm.state.selectedYear ? vm.state.selectedYear.value + '-' : '') +
										(vm.state.selectedBrand ? vm.state.selectedBrand.value :
											(vm.state.brandFilters ? vm.state.brandFilters[0].value : 'araba')) +
										'-fiyat-listesi'
								} : undefined),
							},
							{
								"href": "listpricesDetail",
								"title": (vm.state.selectedYear ? vm.state.selectedYear.label : 'T??m Y??llar'),
								"params": {
									data: (vm.state.selectedYear ? vm.state.selectedYear.value + '-' : '') +
										(vm.state.selectedBrand ? vm.state.selectedBrand.value :
											(vm.state.brandFilters ? vm.state.brandFilters[0].value : 'araba')) +
										'-fiyat-listesi'
								}
								///(vm.state.selectedYear ? {year: vm.state.selectedYear.value, brand: (vm.state.selectedBrand ? vm.state.selectedBrand.value + "-fiyat-listesi" : (vm.state.brandFilters ? vm.state.brandFilters[0].value + "-fiyat-listesi" : undefined))} : undefined),
							}
						]} />
						<section className="section listprices">
							<div className="wrapper narrow">
								<div className="listprices-head">
									<h1 className="head-title">{((vm.props.match.params.data && vm.state.selectedYear && vm.state.selectedYear.value !== 'tum_yillar') ? vm.state.selectedYear.label + ' ' : '')}{((vm.props.match.params.data && vm.state.selectedBrand && vm.state.selectedBrand.value !== 'tum_markalar') ? vm.state.selectedBrand.label : 'Araba')} Fiyat Listesi</h1>
									<div className="head-filters">
										{vm.state.yearFilters &&
											<div className="inputwrap dark filters-item">
												<Select
													value={vm.state.selectedYear}
													onChange={vm.changeYear}
													options={vm.state.yearFilters}
												/>
											</div>
										}
										{vm.state.brandFilters &&
											<div className="inputwrap dark filters-item">
												<Select
													value={vm.state.selectedBrand}
													onChange={vm.changeBrand}
													options={vm.state.brandFilters}
												/>
											</div>
										}
									</div>
								</div>

								<div className="listprices-outerwrap">
									<div className="listprices-wrap loader-container">
										<Loader loading={brands === false} />
										{brands &&

											<React.Fragment>
												{
													brands.length ? (
														<table className="table listprices-table">
															<thead>
																<tr>
																	<th>Marka</th>
																	<th>Model</th>
																	<th>Alt Model</th>
																	<th>Versiyon</th>
																	<th>Donan??m</th>
																	<th>Motor Hacmi</th>
																	<th>Vites Tipi</th>
																	{/*<th>Yak??t T??r??</th>*/}
																	<th style={{ minWidth: '120px' }}>Fiyat</th>
																	{/*<th>Kampanyal?? Fiyat</th>*/}
																</tr>
															</thead>

															{
																brands.map((brand, nth) => (
																	<tbody key={nth}>
																		{brand.listings.map((item, ntx) => (
																			<tr key={ntx}>
																				{ntx === 0 &&
																					<td className="brand" rowSpan={brand.listings.length}>
																						<div className="brand-wrap">
																							<div className="brand-logowrap">
																								<Image src={storageSpace('brands', brand.logo)} alt={brand.name} bg contain className="brand-logo"></Image>
																							</div>
																						</div>
																					</td>
																				}
																				<td>{item.model}</td>
																				<td>{item.subModel}</td>
																				<td>{item.type}</td>
																				<td>{item.equipment}</td>
																				<td>{item.enginevolume}</td>
																				<td>{item.transmission}</td>
																				{/*<td>{item.fuel}</td>*/}
																				<td><PriceTag price={item.price} /></td>
																				{/*<td>
																						{(item.price2 && item.price2 > 0) ? <PriceTag price={item.price2} /> : '-'}
																					</td>*/}
																			</tr>
																		))}
																	</tbody>
																))
															}



														</table>
													) : (
															<div style={{ marginTop: '6rem', textAlign: 'center', fontSize: '1.6rem' }}>Bu markaya ve se??ti??iniz y??la ait fiyat listesi bulunmamaktad??r.</div>
														)
												}
											</React.Fragment>
										}

									</div>
								</div>
							</div>
						</section>
					</React.Fragment>
				}
			</main>
		)
	}
}
