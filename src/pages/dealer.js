import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import Collapse from 'components/partials/collapse'
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import { setTitle } from 'controllers/head'
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import { openModal } from 'functions/modals'

// Assets

export default class Dealer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dealerData: false,
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
		if(!isEqual(prevState.dealerData, this.state.dealerData) || prevState.searchText !== this.state.searchText){
			this.updateSearch();
		}
	}

	initialize() {
		let vm = this;
		request.get('/dummy/data/dealer.json', { id: vm.props.match.params.id }, function(payload){
			if(payload){
				vm.setState({
					dealerData: payload
				})

				setTitle(payload.title);
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
		if(this.state.dealerData){
			let query = {dealer: this.state.dealerData.id};

			if(this.state.searchText !== ''){
				query.search = this.state.searchText;
			}

			this.setState({listingQuery: query});
		}
	}

	render () {
		let vm = this;
		let dealer = vm.state.dealerData;
		return (
			<main className="page dealer">
				<Loader loading={dealer === false} strict={true} />
				<div className="wrapper">
				{dealer && 
					<section className="section dealer-detail">
						<aside className="detail-info">
							<div className="info-sum">
								<h1 className="sum-title">
									<span className="title-badge"><i className="badge-bg icon-ribbon"></i><i className="badge-icon icon-check"></i></span>{dealer.title}
								</h1>

								<div className="sum-address">
									<div>
										{dealer.address}
									</div>
									{dealer.location &&
										<button type="button" className="address-showonmap" onClick={() => openModal('map', {markers: [{ lat: dealer.location.lat, lng: dealer.location.lng }]})}>Haritada gör</button>
									}
								</div>
								<span className={"sum-workinghours " + (dealer.open ? 'open' : 'closed')}>
									{dealer.workingHours}
									<span>|</span>
									{(dealer.open ? 'Şu an açık' : 'Şu an kapalı')}
								</span>

								<div className="sum-controls">
									<Btn tag="a" icon="phone" primary low uppercase href={'tel:+9'+dealer.phone.replace(' ', '')}>{dealer.phone}</Btn>
									<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/todealer/'+dealer.id}>Mesaj Gönder</Btn>
								</div>
							</div>

							<InputForm className="info-search">
								<FormInput placeholder={dealer.title+' üzerinde ara'} value={vm.state.searchText} onChange={vm.changeSearch} />
								<button type="submit" className="search-submit"><i className="icon-search"></i></button>
							</InputForm>

							<div className="info-branches">
								<div className="branches-head">
									<span className="head-info">{dealer.branchCount} Bayi</span>
									<span className="head-info">{dealer.listingCount} Araç</span>
									<strong className="head-title">Şubeler / Lokasyonlar</strong>
								</div>

								<ul className="branches-list">
									{dealer.branches.map((branch, nth) => (
										<BranchInfo data={branch} key={nth} />
									))}
								</ul>
							</div>
						</aside>
						<div className="detail-right">
							<Image className="dealer-cover" src={dealer.cover} />
							{vm.state.listingQuery &&
								<Listing className="dealer-listing" urlBinding={false} filters={false} source="/dummy/data/detail-related.json" query={vm.state.listingQuery} showAds={false} />
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
						<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/todealer/'+branch.id}>Mesaj Gönder</Btn>
					</div>
				</Collapse>
			</li>
		)
	}
}