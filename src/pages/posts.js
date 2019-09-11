import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'


export default class Posts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }

    }

    render() {

        return (
            <main className="page home">
                <React.Fragment>
                    <Listing className="home-listing"
                        source="filters"
                        defaultOrder="random"
                        query={false}
                        scrollOnFilterChange
                        title="Sıfır Araba Modelleri ve Fiyatları"
                    />
                </React.Fragment>
            </main>

        )
    }
}