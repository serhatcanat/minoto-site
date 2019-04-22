import React from 'react'

// Pages
import Listing from 'components/sections/listing.js'

// Partials
import Image from 'components/partials/image.js'

// Assets
import image_home_banner from 'assets/images/home-banner.jpg'

export default class Home extends React.Component {
	render () {
		return (
			<section className="section home-intro">
				<Image className="intro-bg" src={image_home_banner} />
				<Listing />
			</section>

		)
	}
}