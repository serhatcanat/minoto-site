import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials

// Assets

export default class Search extends React.Component {
	render() {
		return (
			<main className="page search">
				<Listing className="search-listing" source={'car-posts'} query={false} />
			</main>

		)
	}
}