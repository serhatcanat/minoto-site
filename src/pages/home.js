import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Image from 'components/partials/image.js'
import SearchBar from 'components/partials/searchbar.js'

//Deps
import { apiPath } from "functions/helpers";

// Assets
import image_home_banner from 'assets/images/home-banner.jpg'
import image_home_banner_mobile from 'assets/images/home-banner-mobile.jpg'

let title = "[Minimum Efor] Maksimum Oto";
let title2 = "[Minimum Efor] Maksimum Oto";
let colored = title.substring(
	title.lastIndexOf("[") + 1,
	title.lastIndexOf("]")
)
let regular = title2.substring(
	title2.lastIndexOf("]") + 2,
	title2.length
)

let image1 = 'https://minoto-test.ams3.digitaloceanspaces.com/homepage-slides/minimum-efor-maksimum-oto_main_1561105759.jpg'
let image2 = 'https://minoto-test.ams3.digitaloceanspaces.com/homepage-slides/maksimum-oto_main_1561106106.jpg'

let forceWhite = false;

export default class Home extends React.Component {

	render() {
		return (
			<main className="page home">
				<section className="section home-intro">
					<div className="intro-content">
						<h1 className={`intro-title ${forceWhite ? 'forceWhite' : ''}`} style={{ opacity: '1' }}>
							<span className="colored">{colored}</span> {regular}
							<strong className="subtitle">Türkiye'nin Sıfır Km Otomobil Sitesi</strong>
						</h1>
						<SearchBar className="intro-search" />
					</div>
					<Image
						className="intro-bg"
						//src={image_home_banner} 
						src={image2}
						mobile={image_home_banner_mobile} />
				</section>
				<Listing className="home-listing"
				//source={apiPath('brands/search-test')} 
				/>
			</main>

		)
	}
}