import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Image from 'components/partials/image.js'
import SearchBar from 'components/partials/searchbar.js'
import request from 'controllers/request'
//import { setTitle, setMeta, setHead } from 'controllers/head'
//Deps
import { storageSpace } from "functions/helpers";


// Assets
import image_home_banner from 'assets/images/home-banner-volvo.jpg'
import image_home_banner_mobile from 'assets/images/home-banner-volvo-mobile.jpg'
import image_home_banner2 from 'assets/images/home-banner-volvo2.jpg'
import image_home_banner_mobile2 from 'assets/images/home-banner-volvo2-mobile.jpg'



export default class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			bannerData: false,
			loading: true,
		}

		this.initialize = this.initialize.bind(this);
	}

	componentDidMount() {
		this.initialize();
	}

	initialize() {
		let vm = this;
		request.get('homepage-slide', null, function (payload) {
			vm.setState({
				bannerData: payload,
			})
		});
	}
	render() {
		let banner = this.state.bannerData;

		return (
			<main className="page home">
				{banner && (
					<React.Fragment>
						<h1 className="seoElement">Sıfır Araba Modelleri ve Fiyatları</h1>
						<section className="section home-intro">
							<div className="intro-content">
								<h1 className={`intro-title ${banner.text_color === 'white' ? 'forceWhite' : ''}`} style={{ opacity: '1' }}>
									{
										banner.title.charAt(0) === '[' ? (
											<React.Fragment>
												<span className="colored">
													{banner.title.substring(banner.title.lastIndexOf("[") + 1, banner.title.lastIndexOf("]"))}
												</span>{' '}
												{
													banner.title.substring(banner.title.lastIndexOf("]") + 2, banner.title.length)
												}
											</React.Fragment>
										) : banner.title}

									<strong className="subtitle">{banner.label}</strong>
								</h1>
								<SearchBar className="intro-search" />
							</div>
							<Image
								className="intro-bg"
								bg
								src={this.props.location.hash.substr(1) === 'volvo' ? image_home_banner : image_home_banner2}
								mobile={this.props.location.hash.substr(1) === 'volvo' ? image_home_banner_mobile : image_home_banner_mobile2}
							//src={storageSpace('homepage-slides', banner.main_image)}
							//mobile={storageSpace('homepage-slides', banner.mobile_image)} 
							/>
						</section>
						<Listing className="home-listing"
							source={'car-data/brands'}
							defaultOrder="random"
							query={false}
							scrollOnFilterChange
						/>
					</React.Fragment>
				)}
			</main>

		)
	}
}