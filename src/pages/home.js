import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Image from 'components/partials/image.js'
import SearchBar from 'components/partials/searchbar.js'
import request from 'controllers/request'

//Deps
import { storageSpace } from "functions/helpers";

// Assets
//import image_home_banner from 'assets/images/home-banner.jpg'
//import image_home_banner_mobile from 'assets/images/home-banner-mobile.jpg'



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
								//src={image_home_banner} 
								src={storageSpace('homepage-slides', banner.main_iomage)}
								mobile={storageSpace('homepage-slides', banner.mobile_image)} />
						</section>
						<Listing className="home-listing"
							source={'brands/search-test'}
						/>
					</React.Fragment>
				)}
			</main>

		)
	}
}