import React from 'react'

// Sections
import Listing from 'components/sections/listing.js'

// Partials

// Deps
//import { set404 } from 'controllers/navigator'

// Assets

const matchParams = [
	'brand',
	'model',
	'modelsub',
	'version'
]

export default class SearchVersion extends React.Component {
	render() {
		let route = "";
		for(let k = 0; k < matchParams.length; k++) {
			if(this.props.match.params[matchParams[k]]){
				route += '/'+this.props.match.params[matchParams[k]];
			}
			else {
				break;
			}
		}

		console.log(route);

		return (
			<main className="page search">
				<Listing className="search-listing" source={`car-posts/filter${route}`} query={false} />
			</main>

		)
	}
}