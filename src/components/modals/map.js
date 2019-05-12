import React from 'react'

// Partials
import GoogleMap from 'components/partials/google-map'

// Deps

// Assets

export default class MapModal extends React.Component {
	render() {
		return (
			<div className={this.props.className}>
				{this.props.closeBtn}
				<div className="modal-innercontent">
					<GoogleMap
						className="map-container"
						markers={this.props.markers}

						settings={this.props.settings}
					/>
				</div>
			</div>
		)
	}
}

MapModal.defaultProps = {
	className: "",
	containerClass: "modal-map",
	name: "map",
	preventClose: false,
	markers: {},
	settings: {},
}