import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
//import Link from 'components/partials/link'

// Assets

export default class Brands extends React.Component {
	render() {
		return (
			<main className="page brands">
				<h1 className="seoElement">Araba Markaları</h1>
				<div className="wrapper">
					<Listing
						className="section brands-listing"
						showAds={false}
						topSection={false}
						source={'brands'}
						key="search-brands"
						title="Araba Markaları" />
				</div>
			</main>

		)
	}
}