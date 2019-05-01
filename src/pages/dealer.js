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
import axios from 'axios';
import { setTitle } from 'controllers/head'

// Assets

export default class Dealer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dealerData: false,
			loading: true,
		}

		this.initialize = this.initialize.bind(this);
	}

	initialize() {
		let vm = this;
		axios.get('/dummy/data/dealer.json?id='+vm.props.match.params.id).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({
					dealerData: res.data.info
				})

				setTitle(res.data.info.title);
			}
			else {
				console.log('error');
			}
		})
	}

	componentDidMount() {
		this.initialize();
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
									<button type="button" className="address-showonmap">Haritada gör</button>
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
								<FormInput placeholder={dealer.title+' üzerinde ara'} />
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
							<Listing className="dealer-listing" urlBinding={false} filters={false} source="/dummy/data/detail-related.json" query="id=1234" showAds={false} />
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
					<button type="button" className="details-showonmap">Haritada gör</button>

					<div className="details-controls">
						<Btn tag="a" icon="phone" primary low uppercase href={'tel:+9'+branch.phone.replace(' ', '')}>{branch.phone}</Btn>
						<Btn tag="link" icon="envelope" text low uppercase href={'/user/message/todealer/'+branch.id}>Mesaj Gönder</Btn>
					</div>
				</Collapse>
			</li>
		)
	}
}