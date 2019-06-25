import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'
import ListingFilters from 'components/sections/listing-filters.js'

// Partials
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import FavBtn from 'components/partials/favbtn'
import Collapse from 'components/partials/collapse'
import Responsive from 'components/partials/responsive'
//import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import { storageSpace } from 'functions/helpers'
import extend from 'lodash/extend'
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import { setTitle } from 'controllers/head'
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import { openModal } from 'functions/modals'

// Assets

const branchExpandLimit = 4;

export default class Dealer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dealerData: false,
			loading: true,
			searchText: '',
			listingQuery: false,
			listingData: false,
			expandBranches: false,
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
		if (!isEqual(prevState.dealerData, this.state.dealerData) || prevState.searchText !== this.state.searchText) {
			this.updateSearch();
		}
	}

	initialize() {
		let vm = this;
		request.get(`dealers/${vm.props.match.params.id}`, { id: vm.props.match.params.id }, function (payload) {
			if (payload) {
				vm.setState({
					dealerData: payload,
					listingQuery: { dealer: payload.id },
				})

				setTitle(payload.title);
			}
			else {
				redirect("notfound");
			}
		});
	}

	changeSearch(e) {
		this.setState({ searchText: e });
	}

	updateSearch() {
		if (this.state.dealerData) {
			let query = { dealer: this.state.dealerData.id };

			if (this.state.searchText !== '') {
				query.search = this.state.searchText;
			}

			this.setState({ listingQuery: query });
		}
	}

	updateFilters(newQuery) {
		//let newQuery = clone(this.props.query);
		newQuery = extend({}, newQuery, {
			dealer: this.state.dealerData.id,
		});

		this.setState({
			listingQuery: newQuery
		})
	}

	render() {
		let vm = this;
		let dealer = vm.state.dealerData;
		return (
			<main className="page dealer">
				<Loader loading={dealer === false} strict={true} />
				<div className="wrapper">
					{dealer &&
						<section className="section dealer-detail">
							<section className="detail-info">
								<div className="info-sum">
									<FavBtn className="sum-favbtn" faved={dealer.favorited} type="dealer" id={dealer.id} />
									<Image className="sum-avatar" bg src={storageSpace('dealers', dealer.avatar)} />
									<h1 className="sum-title">
										{dealer.title}
									</h1>

									<span style={{ opacity: '0' }} className={"sum-workinghours " + (dealer.open ? 'open' : 'closed')}>
										{dealer.workingHours}
										<span>|</span>
										{(dealer.open ? 'Şu an açık' : 'Şu an kapalı')}
									</span>
									{
										dealer.phone && (
											<div className="sum-controls">
												<Btn tag="a" icon="phone" primary low wide href={'tel:+9' + dealer.phone.replace(' ', '')}>{dealer.phone}</Btn>
											</div>
										)
									}


									<div className="sum-numbers">
										<span className="numbers-elem">{dealer.branchCount} Bayi</span>
										<span className="numbers-elem">{dealer.listingCount} Araç</span>
									</div>
								</div>

								{/*
							<InputForm className="info-search">
								<FormInput placeholder={dealer.title+' üzerinde ara'} value={vm.state.searchText} onChange={vm.changeSearch} />
								<button type="submit" className="search-submit"><i className="icon-search"></i></button>
							</InputForm>
							*/}

								<div className="info-branches">
									<div className="branches-head">

										<strong className="head-title">Şubeler / Lokasyonlar</strong>
									</div>

									<ul className="branches-list">
										{dealer.branches.reduce((filtered, branch, nth) => {
											if (nth < branchExpandLimit || vm.state.expandBranches) {
												filtered.push(<BranchInfo data={branch} key={nth} />)
											}
											return filtered;
										}, [])}
									</ul>
									{dealer.branches.length > branchExpandLimit &&
										<button className="branches-extend" onClick={() => { vm.setState({ expandBranches: !vm.state.expandBranches }) }}>
											{!vm.state.expandBranches ?
												<span>+ Daha fazla göster</span> :
												<span>- Küçült</span>
											}
										</button>
									}
								</div>

								<ListingFilters
									className="info-filters"
									data={vm.state.listingData}
									onUpdate={vm.updateFilters}
								/*
								onClose={() => { vm.setState({ expandFilters: false})}}
								
								expanded={vm.state.expandFilters}
								*/
								/>
							</section>
							<div className="detail-right">
								<Responsive type="only-web">
									<Image className="dealer-cover" bg src={storageSpace('dealers', dealer.cover)} />
								</Responsive>
								{vm.state.listingQuery &&
									<Listing
										className="dealer-listing"
										urlBinding={false}
										filters={false}
										source="/dummy/data/listing.json"
										query={vm.state.listingQuery}
										showAds={false}
										onDataChange={(newData) => {
											vm.setState({ listingData: newData });
										}}
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
			<li className={"list-branch" + (this.state.open ? ' open' : '') + (branch.open ? ' working' : '')}>
				<button className="branch-sum" onClick={() => { this.setState({ open: !this.state.open }); }}>
					<strong className="branch-title">{branch.title} <span className="title-listingcount">({branch.listingCount})</span></strong>

				</button>

				<Collapse className="branch-details" open={this.state.open}>
					<span className={"branch-workinghours " + (branch.open ? 'open' : 'closed')}>
						{branch.workingHours}
						<span>|</span>
						{(branch.open ? 'Açık' : 'Kapalı')}
					</span>

					{branch.location &&
						<button type="button" className="details-showonmap" onClick={() => openModal('map', { markers: [{ lat: branch.location.lat, lng: branch.location.lng }] })}>Haritada gör</button>
					}

					<div className="details-controls">
						<Btn tag="a" icon="phone" primary small uppercase href={'tel:+9' + branch.phone.replace(' ', '')}>{branch.phone}</Btn>
						{/*<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/todealer/'+branch.id}>Mesaj Gönder</Btn>*/}
						<Btn tag="a" href={`/sube/${branch.id}/${branch.slug}`} icon="eye" text low uppercase>Detaylı Gör</Btn>
					</div>
				</Collapse>
			</li>
		)
	}
}