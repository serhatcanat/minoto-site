import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import Collapse from 'components/partials/collapse'
import Link from 'components/partials/link'
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import { setTitle } from 'controllers/head'
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import { formatNumber } from 'functions/helpers'
import { openModal } from 'functions/modals'

// Assets

export default class Brand extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			brandData: false,
			loading: true,
			searchText: '',
			listingQuery: false,
		}

		this.initialize = this.initialize.bind(this);
		this.changeSearch = this.changeSearch.bind(this);
		this.updateSearch = debounce(this.updateSearch.bind(this), 50);
	}

	componentDidMount() {
		this.initialize();
	}

	componentDidUpdate(prevProps, prevState) {
		if(!isEqual(prevState.brandData, this.state.brandData) || prevState.searchText !== this.state.searchText){
			this.updateSearch();
		}
	}

	initialize() {
		let vm = this;
		request.get('/dummy/data/brand.json', { id: vm.props.match.params.id }, function(payload){
			if(payload){
				vm.setState({
					brandData: payload
				})

				setTitle(payload.title + ' Modelleri');
			}
			else {
				redirect("notfound");
			}
		});
	}

	changeSearch(e) {
		this.setState({searchText: e});
	}

	updateSearch() {
		if(this.state.brandData){
			let query = {dealer: this.state.brandData.id};

			if(this.state.searchText !== ''){
				query.search = this.state.searchText;
			}

			this.setState({listingQuery: query});
		}
	}

	render () {
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
								<Image className="sum-logo" title={brand.title} src={brand.logo} />

								<div className="sum-numbers">
									<span className="numbers-item">{formatNumber(brand.dealerCount)} Bayi</span>
									<span className="numbers-item">{formatNumber(brand.listingCount)} Araç</span>
								</div>

								{brand.priceListYear &&
									<div className="sum-pricelist">
										<Link href="listprices" params={{ brand: brand.slug, year: brand.priceListYear }}>{brand.priceListYear} {brand.title} Fiyat Listesi</Link>
									</div>
								}
							</div>

							<InputForm className="info-search">
								<FormInput placeholder="Marka Ara" value={vm.state.searchText} onChange={vm.changeSearch} />
								<button type="submit" className="search-submit"><i className="icon-search"></i></button>
							</InputForm>

							<div className="info-dealers">

								<h2 className="dealers-title">Bayiler</h2>

								<ul className="dealers-list">
									{brand.dealers.map((branch, nth) => (
										<BranchInfo data={branch} key={nth} />
									))}
								</ul>
							</div>
						</aside>
						<div className="detail-right">
							{vm.state.listingQuery &&
								<Listing className="brand-listing" urlBinding={false} filters={false} source="/dummy/data/detail-related.json" query={vm.state.listingQuery} showAds={false} />
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
				<button className="branch-sum" onClick={() => { this.setState({open: !this.state.open}); }}>
					<strong className="branch-title">{branch.title}</strong>

					<span className={"branch-workinghours " + (branch.open ? 'open' : 'closed')}>
						{branch.workingHours}
						<span>|</span>
						{(branch.open ? 'Açık' : 'Kapalı')}
					</span>
				</button>

				<Collapse className="branch-details" open={this.state.open}>
					{branch.location &&
						<button type="button" className="details-showonmap" onClick={() => openModal('map', {markers: [{ lat: branch.location.lat, lng: branch.location.lng }]})}>Haritada gör</button>
					}

					<div className="details-controls">
						<Btn tag="a" icon="phone" primary low uppercase href={'tel:+9'+branch.phone.replace(' ', '')}>{branch.phone}</Btn>
						<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/tobrand/'+branch.id}>Mesaj Gönder</Btn>
					</div>
				</Collapse>
			</li>
		)
	}
}