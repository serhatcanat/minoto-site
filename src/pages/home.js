import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Image from 'components/partials/image.js'
import SearchBar from 'components/partials/searchbar.js'

// Assets
import image_home_banner from 'assets/images/home-banner.jpg'
import image_home_banner_mobile from 'assets/images/home-banner-mobile.jpg'

export default class Home extends React.Component {
	render () {
		return (
			<main className="page home">
				<section className="section home-intro">
					<div className="intro-content">
						<h1 className="intro-title"><span className="colored">
							Minimum Efor</span> Maksimum Oto
							<strong className="subtitle">Türkiye'nin Sıfır Km Otomobil Sitesi</strong>
						</h1>
						<SearchBar className="intro-search" />
					</div>
					<Image className="intro-bg" src={image_home_banner} mobile={image_home_banner_mobile} />
				</section>
				<Listing className="home-listing" />
			</main>

		)
	}
}