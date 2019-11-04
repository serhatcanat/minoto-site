import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Image from 'components/partials/image.js'
import SearchBar from 'components/partials/searchbar.js'
import request from 'controllers/request'
import history from 'controllers/history'
//import { setTitle, setMeta, setHead } from 'controllers/head'
//Deps
import { storageSpace } from "functions/helpers";


// Assets
//import image_home_banner from 'assets/images/home-banner-volvo.jpg'
//import image_home_banner_mobile from 'assets/images/home-banner-volvo-mobile.jpg'
//import image_home_banner2 from 'assets/images/home-banner-volvo2.jpg'
//import image_home_banner_mobile2 from 'assets/images/home-banner-volvo2-mobile.jpg'

const matchParams = [
	'brand',
	'model',
	'optdata1',
	'optdata2',
	'optdata3'
]

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
		window.scroll(0, 0);
		this.initialize();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			window.scroll(0, 0);
			this.initialize();
		}


	}

	initialize() {
		let vm = this;


		if (history.location.pathname === '/') {
			request.get('homepage-slide', null, function (payload) {
				vm.setState({
					bannerData: payload,
				})
			});
		} else {
			vm.setState({
				bannerData: false,
			})
		}


	}
	render() {
		let banner = this.state.bannerData;


		let route = "";
		for (let k = 0; k < matchParams.length; k++) {
			if (this.props.match.params[matchParams[k]]) {
				route += '/' + this.props.match.params[matchParams[k]];
			}
			else {
				break;
			}
		}

		return (

			<main className="page home">

				<React.Fragment>
					{banner && (
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
								//src={this.props.location.hash.substr(1) === 'volvo' ? image_home_banner : image_home_banner2}
								//mobile={this.props.location.hash.substr(1) === 'volvo' ? image_home_banner_mobile : image_home_banner_mobile2}
								src={storageSpace('homepage-slides', banner.main_image)}
								mobile={storageSpace('homepage-slides', banner.mobile_image)}
							/>
						</section>
					)}
					{
						route === '' ? (
							<Listing className="search-listing"
								source="filters"
								defaultOrder="random"
								query={false}
								scrollOnFilterChange
								title="Sıfır Araba Modelleri ve Fiyatları"
								showMoreBrands={true}
							/>
						) : (

								<Listing
									className="search-listing"
									// -- bu eski source={`car-posts/filter${route}`}
									// -- bu gülşahın yarın oluşturacağı url source={`car-data/filters${route}`}
									source={`filters${route}`}
									query={false}
								//key="search-brand-deep"
								/>

							)
					}

				</React.Fragment>

			</main>



		)
	}
}
