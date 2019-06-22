import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'
import ListingFilters from 'components/sections/listing-filters.js'

// Partials
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
//import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import extend from 'lodash/extend'
import { setTitle } from 'controllers/head'
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import { openModal } from 'functions/modals'
import { storageSpace } from 'functions/helpers'

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
		this.updateFilters = this.updateFilters.bind(this);

		this.formRef = React.createRef();
		this.listingRef = false;
	}

	componentDidMount() {
		this.initialize();
	}

	initialize() {
		let vm = this;
		request.get(`branches/${vm.props.match.params.id}`, { id: vm.props.match.params.id }, function (payload) {
			if (payload) {
				vm.setState({
					branchData: payload,
					listingQuery: { branch: payload.id }
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

	updateFilters(newQuery) {
		//let newQuery = clone(this.props.query);
		newQuery = extend({}, newQuery, {
			branch: this.state.branchData.id,
		});

		this.setState({
			listingQuery: newQuery
		})
	}

	render() {
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
											<button type="button" className="address-showonmap" onClick={() => openModal('map', { markers: [{ lat: branch.location.lat, lng: branch.location.lng }] })}>Haritada gör</button>
										}
									</div>
									<span className={"sum-workinghours " + (branch.open ? 'open' : 'closed')}>
										{branch.workingHours}
										<span>|</span>
										{(branch.open ? 'Şu an açık' : 'Şu an kapalı')}
									</span>

									<div className="sum-controls">
										<Btn tag="a" icon="phone" primary low uppercase href={'tel:+9' + branch.phone.replace(' ', '')}>{branch.phone}</Btn>
										<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/tobranch/' + branch.id}>Mesaj Gönder</Btn>
									</div>
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

							</aside>
							<div className="detail-right">
								<Image className="branch-cover" src={storageSpace('dealers', branch.cover)} />
								{vm.state.listingQuery &&
									<Listing
										className="branch-listing"
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