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

// Assets

export default class ListPrices extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
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

		if (vm.ajaxController !== false) {
			vm.ajaxController.cancel('Canceled duplicate request.');
		}
		setTimeout(function () {
			vm.ajaxController = request.get(
				//'/dummy/data/listprices.json',
				'price-lists',
				{
					yil: vm.props.match.params.year ? vm.props.match.params.year : '2019',
					marka: vm.props.match.params.brand ? vm.props.match.params.brand.substring(0, vm.props.match.params.brand.indexOf("-fiyat-listesi")) : 'audi'
				},
				function (payload) {
					vm.ajaxController = false;
					if (payload) {
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
							brands: payload.brands,
							yearFilters: yearFilters,
							brandFilters: brandFilters
						});
					}
					else {
						console.log('error');
					}
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
				const path = generatePath(this.props.match.path, { brand: this.state.selectedBrand.value + "-fiyat-listesi", year: this.state.selectedYear.value });
				console.log(path);
				this.props.history.replace(path);

				this.initialize();
			}
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
				<Breadcrumbs className="listprices-crumbs" standalone data={[
					{
						"href": "listprices",
						"title": "Araba Fiyat Listesi"
					},
					{
						"href": "listprices",
						"title": (vm.state.selectedBrand ? vm.state.selectedBrand.label : 'Tüm Modeller'),
						"params": (vm.state.selectedBrand ? {brand: vm.state.selectedYear.value} : undefined),
					},
					{
						"href": "listprices",
						"title": (vm.state.selectedYear ? vm.state.selectedYear.label : 'Tüm Yıllar'),
						"params": (vm.state.selectedYear ? {year: vm.state.selectedYear.value, brand: (vm.state.selectedBrand ? vm.state.selectedBrand.value : (vm.state.brandFilters ? vm.state.brandFilters[0].value : undefined))} : undefined),
					}
				]} />
				<section className="section listprices">
					<div className="wrapper narrow">
						<div className="listprices-head">
							<h1 className="head-title">Araba Fiyat Listesi</h1>
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
									<table className="table listprices-table">
										<thead>
											<tr>
												<th>Marka</th>
												<th>Model</th>
												<th>Alt Model</th>
												<th>Versiyon</th>
												<th>Donanım</th>
												{/*<th>Motor Hacmi</th>
												<th>Vites Tipi</th>
												<th>Yakıt Türü</th>*/}
												<th style={{ minWidth: '120px' }}>Fiyat</th>
												<th>Kampanyalı Fiyat</th>
											</tr>
										</thead>

										{brands.map((brand, nth) => (
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
														<td>{item.type}</td>
														<td>{item.equipment}</td>
														<td>{item.equipmentMain}</td>
														{/*<td>{item.enginevolume}</td>
														<td>{item.transmission}</td>
														<td>{item.fuel}</td>*/}
														<td><PriceTag price={item.price} /></td>
														<td>
															{(item.price2 && item.price2 > 0) ? <PriceTag price={item.price2} /> : '-'}
														</td>
													</tr>
												))}
											</tbody>
										))}
									</table>
								}
							</div>
						</div>
					</div>
				</section>
			</main>

		)
	}
}