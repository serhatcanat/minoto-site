import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'
import ListingFilters from 'components/sections/listing-filters.js'

// Partials
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import Responsive from 'components/partials/responsive'
//import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import { connect } from "react-redux"
import extend from 'lodash/extend'
import { setTitle, setDescription } from 'controllers/head'
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import { openModal } from 'functions/modals'
import { storageSpace } from 'functions/helpers'
import { setDealerData } from 'data/store.ga'

// Assets

const mapDispatchToProps = dispatch => {
	return {
		setGaDealerData: (data) => dispatch(setDealerData(data)),
	}
}

class Branch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			branchData: false,
			loading: true,
		};

		this.initialize = this.initialize.bind(this);
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
		request.get(`branches/${vm.props.match.params.slug}`, { id: vm.props.match.params.slug }, function (payload) {
			if (payload) {
				vm.props.setGaDealerData(payload);

				vm.setState({
					branchData: payload,
					listingQuery: { branch: vm.props.match.params.slug }
				})

				setTitle(payload.title + ' Araba Bayisi, Araç Satıcısı ve Servisi');
				setDescription(`${payload.title} araba bayisi, araç satıcısı ve servisini mi aradınız? ${payload.title} Minoto'da! Hemen tıkla, fırsatları kaçırma!`);
			}
			else {
				redirect("notfound");
			}
		});
	}

	updateFilters(newQuery) {
		//let newQuery = clone(this.props.query);
		newQuery = extend({}, newQuery, {
			branch: this.props.match.params.slug,
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
										{branch.location.lat &&
											<button type="button" className="address-showonmap" onClick={() => openModal('map', { markers: [{ lat: branch.location.lat, lng: branch.location.lng }] })}>Haritada gör</button>
										}
									</div>
									{
										branch.workingHours && (
											<span className={"sum-workinghours " + (branch.open ? 'open' : 'closed')}>
												{branch.workingHours}
												<span>|</span>
												{(branch.open ? 'Şu an açık' : 'Şu an kapalı')}
											</span>
										)
									}
									{
										branch.phone && (
											<div className="sum-controls">
												<Btn tag="a" icon="phone" primary low wide href={'tel:+9' + branch.phone.replace(' ', '')}>{branch.phone}</Btn>
											</div>
										)
									}


								</div>

								<ListingFilters
									className="info-filters"
									data={vm.state.listingData}
									onUpdate={vm.updateFilters}
								/>

							</aside>
							<div className="detail-right">
								<Responsive type="only-web">
									<Image className="branch-cover" bg src={storageSpace('dealers', branch.cover)} />
								</Responsive>
								{vm.state.listingQuery &&
									<Listing
										className="branch-listing"
										//urlBinding={false}
										filters={false}
										source={`branches/${this.props.match.params.slug}/car-posts`}
										showAds={false}
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

export default connect(null, mapDispatchToProps)(Branch);
