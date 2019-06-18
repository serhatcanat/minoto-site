import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'
import { apiPath } from 'functions/helpers'

// Partials
//import Link from 'components/partials/link'

// Assets

export default class Brands extends React.Component {
	render() {
		return (
			<main className="page brands">
				<div className="wrapper">
					<Listing
						className="section brands-listing"
						showAds={false}
						source={apiPath('brands')} />
				</div>
			</main>

		)
	}
}