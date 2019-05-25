import React from 'react'

// Partials
import LoginForm from 'components/partials/form-login'

// Deps
import { connect } from "react-redux"
import { redirect } from 'controllers/navigator'
import isEqual from "lodash/isEqual"

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};

class Login extends React.Component {

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
							<LoginForm type="self" />
						</div>
					</div>
				</section>
			)
		}
		else { return false; }
	}
}


export default connect(mapStateToProps)(Login);