import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'
import ListingFilters from 'components/sections/listing-filters.js'

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

export default class Branch extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			branchData: false,
			loading: true,
			searchText: '',
			listingQuery: false,
			listingData: false,
		}

		this.initialize = this.initialize.bind(this);
		this.changeSearch = this.changeSearch.bind(this);
		//this.listingDataChanged = this.listingDataChanged.bind(this);
		this.updateSearch = debounce(this.updateSearch.bind(this), 50);

		this.formRef = React.createRef();
		this.listingRef = false;
	}

	componentDidMount() {
		this.initialize();
	}

	componentDidUpdate(prevProps, prevState) {
		if(!isEqual(prevState.branchData, this.state.branchData) || prevState.searchText !== this.state.searchText){
			this.updateSearch();
		}
	}

	initialize() {
		let vm = this;
		request.get('/dummy/data/branch.json', { id: vm.props.match.params.id }, function(payload){
			if(payload){
				vm.setState({
					branchData: payload
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
		if(this.state.branchData){
			let query = {branch: this.state.branchData.id};

			if(this.state.searchText !== ''){
				query.search = this.state.searchText;
			}

			this.setState({listingQuery: query});
		}
	}

	render () {
		let vm = this;
		let branch = vm.state.branchData;
		return (
			<main className="page branch">
				<Loader loading={branch === false} strict={true} />
				<div className="wrapper">
				{branch && 
					<section className="section branch-detail">
						<aside className="detail-info">
							<div className="info-sum">
								<h1 className="sum-title">
									<span className="title-badge"><i className="badge-bg icon-ribbon"></i><i className="badge-icon icon-check"></i></span>{branch.title}
								</h1>

								<div className="sum-address">
									<div>
										{branch.address}
									</div>
									{branch.location &&
										<button type="button" className="address-showonmap" onClick={() => openModal('map', {markers: [{ lat: branch.location.lat, lng: branch.location.lng }]})}>Haritada gör</button>
									}
								</div>
								<span className={"sum-workinghours " + (branch.open ? 'open' : 'closed')}>
									{branch.workingHours}
									<span>|</span>
									{(branch.open ? 'Şu an açık' : 'Şu an kapalı')}
								</span>

								<div className="sum-controls">
									<Btn tag="a" icon="phone" primary low uppercase href={'tel:+9'+branch.phone.replace(' ', '')}>{branch.phone}</Btn>
									<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/tobranch/'+branch.id}>Mesaj Gönder</Btn>
								</div>
							</div>

							<ListingFilters
								className="info-filters"
								data={vm.state.listingData}
								onUpdate={(newQuery) => {
									vm.setState({
										listingQuery: newQuery
									})
								}}
								/*
								onClose={() => { vm.setState({ expandFilters: false})}}
								
								expanded={vm.state.expandFilters}
								*/
								/>

						</aside>
						<div className="detail-right">
							<Image className="branch-cover" src={branch.cover} />
							{vm.state.listingQuery &&
								<Listing
									className="branch-listing"
									urlBinding={false}
									filters={false}
									source="/dummy/data/listing.json"
									query={vm.state.listingQuery}
									showAds={false}
									onDataChange={(newData) => {
										vm.setState({listingData: newData});
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
						<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/tobranch/'+branch.id}>Mesaj Gönder</Btn>
					</div>
				</Collapse>
			</li>
		)
	}
}