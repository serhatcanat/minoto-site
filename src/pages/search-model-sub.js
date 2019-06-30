import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials

// Assets

export default class SearchModelSub extends React.Component {
    render() {
        return (
            <main className="page search">
                <Listing className="search-listing" source={`car-posts/filter/${this.props.match.params.brand}/${this.props.match.params.model}/${this.props.match.params.modelsub}`} query={false} />
            </main>

        )
    }
}