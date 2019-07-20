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
		this._isMounted = true;
		this.checkUser();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentDidUpdate(prevProps){
		if(!isEqual(prevProps.user, this.props.user)){
			this.checkUser();
		}
	}

	checkUser(){
		let vm = this;
		if(vm.props.user !== false){
			setTimeout(function() {
				if(vm._isMounted){
					redirect('account.profile');
				}
			}, 100);
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