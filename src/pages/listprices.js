import React from 'react'

// Sections
//import Listing from 'components/sections/listing.js'

// Partials
import Breadcrumbs from 'components/partials/breadcrumbs'
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import Select from 'components/partials/select'

// Deps
import axios from 'axios'
import { formatNumber } from 'functions/helpers'
import { generatePath } from 'react-router';

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

		this.ajaxToken = axios.CancelToken;
		this.ajaxController = false;
	}

	initialize() {
		let vm = this;
		vm.setState({brands: false});

		if(this.ajaxController !== false){
			vm.ajaxController.cancel('Canceled duplicate request.');
		}
		this.ajaxController = this.ajaxToken.source();
		setTimeout(function() {
			axios.get(
				'/dummy/data/listprices.json',
				{
					params: {
						year: vm.props.match.params.year ? vm.props.match.params.year : 'tum_yillar',
						brand: vm.props.match.params.brand ? vm.props.match.params.brand : 'tum_markalar'
					},
					cancelToken: vm.ajaxController.token
				}
			).then(res => {
				this.ajaxController = false;
				if(res.data.status === 'ok'){
					let yearFilters = res.data.filters.year.map(function(filter, nth){
						let filterData = {
							value: filter.value,
							label: filter.title,
						}
						if(filter.selected){
							vm.setState({ selectedYear: filterData });
						}
						return filterData;
					});

					let brandFilters = res.data.filters.brand.map(function(filter, nth){
						let filterData = {
							value: filter.value,
							label: filter.title,
						}
						if(filter.selected){
							vm.setState({ selectedBrand: filterData });
						}
						return filterData;
					});

					vm.setState({
						brands: res.data.brands,
						yearFilters: yearFilters,
						brandFilters: brandFilters
					});
				}
				else {
					console.log('error');
				}
			});
		}, 20);
	}

	componentDidMount() {
		this.initialize();
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.selectedYear && prevState.selectedBrand){
			if(prevState.selectedYear.value !== this.state.selectedYear.value || prevState.selectedBrand.value !== this.state.selectedBrand.value){
				const path = generatePath(this.props.match.path, {brand: this.state.selectedBrand.value, year: this.state.selectedYear.value});
  				this.props.history.replace(path);

  				this.initialize();
			}
		}
	}

	changeYear(option) {
		this.setState({selectedYear: option});
	}

	changeBrand(option) {
		this.setState({selectedBrand: option});
	}

	changeModel(option) {

	}

	render () {
		let vm = this;
		let brands = vm.state.brands;
		return (
			<main className="page prices">
				<Breadcrumbs className="listprices-crumbs" standalone data={[
					{
						"href": "listprices",
						"title": "Araç Liste Fiyatları"
					},
					{
						"href": "listprices",
						"title": "2019"
					},
					{
						"href": "listprices",
						"title": "Hepsi"
					}
				]} />
				<section className="section listprices">
					<div className="wrapper narrow">
						<div className="listprices-head">
							<h1 className="head-title">Araç Liste fiyatları.</h1>
							<div className="head-filters">
							{vm.state.yearFilters &&
								<Select
									className="filters-item"
									value={vm.state.selectedYear}
									onChange={vm.changeYear}
									options={vm.state.yearFilters}
								/>
							}
							{vm.state.brandFilters &&
								<Select
									className="filters-item"
									value={vm.state.selectedBrand}
									onChange={vm.changeBrand}
									options={vm.state.brandFilters}
								/>
							}
							</div>
						</div>
						<div className="listprices-wrap loader-container">
							<Loader loading={brands === false} />
							{brands &&
								<table className="table listprices-table">
									<thead>
										<tr>
											<th>Marka</th>
											<th>Model</th>
											<th>Tip</th>
											<th>Donanım Tipi</th>
											<th>Motor Hacmi</th>
											<th>Vites Tipi</th>
											<th>Yakıt Türü</th>
											<th>Fiyat</th>
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
																	<Image src={brand.logo} alt={brand.name} bg contain className="brand-logo"></Image>
																</div>
															</div>
														</td>
													}
													<td>{item.model}</td>
													<td>{item.type}</td>
													<td>{item.equipment}</td>
													<td>{item.enginevolume}</td>
													<td>{item.transmission}</td>
													<td>{item.fuel}</td>
													<td>{formatNumber(item.price)} TL</td>
												</tr>
											))}
										</tbody>
									))}
								</table>
							}
						</div>
					</div>
				</section>
			</main>

		)
	}
}