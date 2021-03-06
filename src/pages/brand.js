import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'
import ListingFilters from 'components/sections/listing-filters.js'

// Partials
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import Collapse from 'components/partials/collapse'
//import Link from 'components/partials/link'
import FavBtn from 'components/partials/favbtn'
import Responsive from 'components/partials/responsive'
//import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import debounce from 'lodash/debounce'
import extend from 'lodash/extend'
import isEqual from 'lodash/isEqual'
import { setTitle, setDescription } from 'controllers/head'
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import { openModal } from 'functions/modals'
import { formatNumber, storageSpace } from 'functions/helpers'
import { turkishSort } from '../functions/helpers'
import Breadcrumbs from "../components/partials/breadcrumbs";
import {set404} from "../controllers/navigator";

// Assets

export default class Brand extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			brandData: false,
			loading: true,
			searchText: '',
			listingQuery: false,
			listingData: false,
		}

		this.initialize = this.initialize.bind(this);
		this.changeSearch = this.changeSearch.bind(this);
		this.updateFilters = this.updateFilters.bind(this);
		this.updateSearch = debounce(this.updateSearch.bind(this), 50);
	}

	componentDidMount() {
		this.initialize();
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEqual(prevState.brandData, this.state.brandData) || prevState.searchText !== this.state.searchText) {
			this.updateSearch();
		}

		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.initialize();
			window.scroll(0, 0);
		}
	}

	initialize() {
		let vm = this;
		//request.get('/dummy/data/brand.json', { id: vm.props.match.params.id }, function (payload) {
		request.get(`brands/${vm.props.match.params.id}`, {}, function (payload) {
			if(payload.status !== '404'){
				if (payload) {
					vm.setState({
						brandData: payload
					})

					setTitle(`${payload.title} Modelleri ve S??f??r ${payload.title} Araba Fiyatlar??`);
					setDescription(`S??f??r Km ${payload.title} modelleri mi arad??n??z? S??f??r Km ${payload.title} araba modelleri ve fiyatlar?? Minoto'da! Hemen t??kla, f??rsatlar?? ka????rma!`);
				}
				else {
					redirect("notfound");
				}
			}
			else{
				set404()
			}
		}, { excludeApiPath: false });
	}

	changeSearch(e) {
		this.setState({ searchText: e });
	}

	updateSearch() {
		if (this.state.brandData) {
			let query = { dealer: this.state.brandData.id };

			if (this.state.searchText !== '') {
				query.search = this.state.searchText;
			}

			this.setState({ listingQuery: query });
		}
	}

	updateFilters(newQuery) {
		newQuery = extend({}, newQuery, {
			id: this.state.brandData.id,
		});

		this.setState({
			listingQuery: newQuery
		})
	}

	render() {
		let vm = this;
		let brand = vm.state.brandData;

		return (
			<main className="page brand">

				<Loader loading={brand === false} strict={true} />
				<div className="wrapper">
					{brand &&
					<section className="section brand-detail">
						<aside className="detail-info">
							<div className="info-sum">
								<FavBtn className="sum-favbtn" faved={brand.favorited} type="brand" id={brand.id} />
								<Image className="sum-logo" bg title={brand.title} src={storageSpace('brands', brand.logo)} />

								<h1 className="sum-title">{brand.title}</h1>

								<div className="sum-numbers">
									<span className="numbers-item">{formatNumber(brand.dealerCount)} Bayi</span>
									<span className="numbers-item">{formatNumber(brand.listingCount)} Ara??</span>
								</div>

								{brand.priceListYear &&
								<Btn className="sum-pricelist" low wide tag="a" href={`/${brand.priceListYear}-${brand.slug}-fiyat-listesi`} >{brand.priceListYear} Fiyat Listesi</Btn>
								}
							</div>

							{/*<InputForm className="info-search">
									<FormInput placeholder="Marka Ara" value={vm.state.searchText} onChange={vm.changeSearch} />
									<button type="submit" className="search-submit"><i className="icon-search"></i></button>
								</InputForm>*/}


							<div className="info-dealers">

								<h2 className="dealers-title">Lokasyonlar</h2>

								<ul className="dealers-list">
									{brand.branches.sort(turkishSort).map((branch, nth) => (
										<BranchInfo data={branch} key={nth} />
									))}
								</ul>
							</div>


							<ListingFilters className="info-filters" />
						</aside>

						<div className="detail-right">
							<Responsive type="only-web">
								<Image className="brand-cover" bg src={storageSpace('brands', brand.coverImage)} />
							</Responsive>
							<Breadcrumbs className="top-breadcrumbs" data={[
								{
									"href": "home",
									"title": "Anasayfa"
								},
								{
									"href": `/bayiler`,
									"title": 'Bayiler'
								},
								{
									"href": brand.slug,
									"title": brand.title
								},
							]} />
							{vm.state.listingQuery &&
							<Listing
								className="brand-listing"
								//urlBinding={false}
								filters={false}
								source={`filters/${this.props.match.params.id}`}
								showAds={false}
								key="search-brand"
								title={`${brand.title} Modelleri`}
							/>
							}
						</div>
					</section>
					}
				</div>
			</main>

		)
	}
}

class BranchInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	render() {
		let branch = this.props.data;
		return (
			<li className={"list-branch" + (this.state.open ? ' open' : '')}>
				<button className="branch-sum" onClick={() => { this.setState({ open: !this.state.open }); }}>
					<strong className="branch-title">{branch.title}</strong>

					{(branch.workingHours !== null) && (
						<span className={"branch-workinghours " + (branch.open ? 'open' : 'closed')}>
							{branch.workingHours}
							{branch.workingHours && <span>|</span>}
							{(branch.open ? 'A????k' : 'Kapal??')}
						</span>
					)}
				</button>

				<Collapse className="branch-details" open={this.state.open}>
					{branch.location &&
					<button type="button" className="details-showonmap" onClick={() => openModal('map', { markers: [{ lat: branch.location.lat, lng: branch.location.lng }] })}>Haritada g??r</button>
					}

					<div className="details-controls">
						{branch.phone &&
						<Btn tag="a" icon="phone" primary low uppercase href={'tel:+9' + branch.phone.replace(' ', '')}>{branch.phone}</Btn>
						}
						{/*<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/tobrand/' + branch.id}>Detayl?? G??r</Btn>*/}
						<Btn tag="a" href={`/bayiler/${branch.dealerSlug}/${branch.slug}`} icon="eye" text low uppercase>Detayl?? G??r</Btn>
					</div>
				</Collapse>
			</li>
		)
	}
}
