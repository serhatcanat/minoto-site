import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'

// Deps
import axios from 'axios';

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