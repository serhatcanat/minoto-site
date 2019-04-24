import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
import Link from 'components/partials/link'

// Assets

export default class Dealers extends React.Component {
	render () {
		return (
			<main className="page dealers">
				<div className="wrapper">
					<Listing
						className="dealers-listing"
						showAds={false}
						source="/dummy/data/listing-dealers.json" />
				</div>
			</main>

		)
	}
}