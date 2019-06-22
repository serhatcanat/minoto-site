import React from 'react';

// Partials
//import PopInfo from 'components/partials/popinfo.js';

// Deps
//import omit from 'lodash/omit'
import request from 'controllers/request'
import store from "data/store"
import { openModal } from "functions/modals";

// Assets

export default class FavBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			submitting: false,
			faved: props.faved
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		let vm = this;

		let user = store.getState().user.user;

		console.log(user);

		if(user){
			vm.setState({submitting: true})

			request.post('favorites/set', {type: vm.props.type, id: vm.props.id, email: user.email}, function(payload){
				let faved = vm.state.faved;

				if(payload){
					faved = payload.faved;
				}

				vm.setState({
					faved: faved,
					submitting: false,
				});
			});
		}
		else {
			 openModal('login');
		}
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
				<button className="fav-button-btn" onClick={this.toggle} disabled={!(this.props.type && this.props.id) || this.state.submitting}>
					<span className="fav-button-icon">
						{this.state.faved ?
							<i className="icon-heart"></i> :
							<i className="icon-heart-empty"></i>
						}
					</span>
					{this.props.children}
				</button>
			</div>
		)
	}
}

FavBtn.defaultProps = {
	className : '',
	faved: false,
	disabled: false,
	type: false,
	id: false,
};