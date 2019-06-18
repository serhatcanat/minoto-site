import React from 'react';

// Partials
//import PopInfo from 'components/partials/popinfo.js';

// Deps
//import omit from 'lodash/omit'

// Assets

export default class FavBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			faved: props.faved
		};
	}

	render() {
		let classes = 'fav-button ' + this.props.className; 
		if(this.props.disabled){
			classes += ' disabled';
		}
		if(this.state.faved){
			classes += ' faved';
		}

		return (
			<div className={classes}>
				<button className="fav-button-btn" disabled={this.props.disabled}>
					{this.state.faved ?
						<i className="icon-heart"></i> :
						<i className="icon-heart-empty"></i>
					}
				</button>
			</div>
		)
	}
}

FavBtn.defaultProps = {
	className : '',
	faved: false,
	disabled: false,
};