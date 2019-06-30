import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials

// Assets

export default class SearchVersion extends React.Component {
    render() {
        return (
            <main className="page search">
                <Listing className="search-listing" source={`car-posts/filter/${this.props.match.params.brand}/${this.props.match.params.model}/${this.props.match.params.modelsub}/${this.props.match.params.version}`} query={false} />
            </main>

        )
    }
}