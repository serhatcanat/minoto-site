import React from 'react'

// Partials
import RecoveryForm from 'components/partials/form-recovery'
import ResetForm from 'components/partials/form-reset'

// Deps
import { connect } from "react-redux"
import { redirect } from 'controllers/navigator'
import isEqual from "lodash/isEqual"

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};

class Register extends React.Component {

	componentDidMount() {
		this.checkUser();
	}

	componentDidUpdate(prevProps){
		if(!isEqual(prevProps.user, this.props.user)){
			this.checkUser();
		}
	}

	checkUser(){
		if(this.props.user !== false){
			redirect('account.profile');
		}
	}

	render () {
		if(this.props.user === false){
			return (
				<section className="section account-login">
					<div className="wrapper narrow">
						<div className="login-wrap">
							{(this.props.match.params.email && this.props.match.params.token) ?
								<ResetForm email={this.props.match.params.email} token={this.props.match.params.token} />
								:
								<RecoveryForm type="self" />
							}
						</div>
					</div>
				</section>
			)
		}
		else { return false; }
	}
}


export default connect(mapStateToProps)(Register);