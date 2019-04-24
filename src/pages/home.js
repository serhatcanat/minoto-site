import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Image from 'components/partials/image.js'
import SearchBar from 'components/partials/searchbar.js'

// Assets
import image_home_banner from 'assets/images/home-banner.jpg'

export default class Home extends React.Component {
	render () {
		return (
			<main className="page home">
				<section className="section home-intro">
					<SearchBar className="intro-search" />
					<Image className="intro-bg" src={image_home_banner} />
				</section>
				<Listing className="home-listing" />
			</main>

		)
	}
}