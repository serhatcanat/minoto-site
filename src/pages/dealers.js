import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials
//import Link from 'components/partials/link'

// Deps
//import { apiPath } from 'functions/helpers'

// Assets

export default class Dealers extends React.Component {
	render() {
		return (
			<main className="page dealers">
				<div className="wrapper">
					<Listing
						className="dealers-listing"
						showAds={false}
						topSection={false}
						// source="/dummy/data/listing-dealers.json"
						source={'dealers'}
						title="Bayiler"
					/>
				</div>
			</main>

		)
	}
}
