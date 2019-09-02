import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'
import history from 'controllers/history'

// Partials

// Assets

export default class Search extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			endpoint: 'search/key',
		}
	}
	componentDidMount() {
		if (history.location.search === '' || history.location.search.length === 0) {
			this.setState({
				endpoint: 'filters'
			})
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location.search !== this.props.location.search) {
			if (this.props.location.search === '' || this.props.location.search.length === 0) {
				this.setState({
					endpoint: 'filters'
				})
			} else {
				this.setState({
					endpoint: 'search/key'
				})
			}
		}

	}

	render() {
		return (
			<main className="page search">
				{
					this.state.endpoint && <Listing className="search-listing" defaultOrder="date_desc" source={this.state.endpoint} query={false} />
				}

			</main>

		)
	}
}