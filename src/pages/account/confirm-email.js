import React from 'react'

// Partials
import ConfirmForm from 'components/partials/form-confirm'

// Deps
import { connect } from "react-redux"
import { redirect } from 'controllers/navigator'
import isEqual from "lodash/isEqual"

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};

class ConfirmEmail extends React.Component {

	componentDidMount() {
		this.checkUser();
	}

	componentDidUpdate(prevProps) {
		if (!isEqual(prevProps.user, this.props.user)) {
			this.checkUser();
		}
	}

	checkUser() {
		if (this.props.user !== false) {
			setTimeout(function () {
				redirect('account.profile');
			}, 3000); /// Dummy Delay

		}
	}

	render() {
		if (this.props.user === false) {
			return (
				<section className="section account-login">
					<div className="wrapper narrow">
						<div className="login-wrap">
							<ConfirmForm type="self" email={this.props.match.params.email} token={this.props.match.params.token} />
						</div>
					</div>
				</section>
			)
		}
		else { return false; }
	}
}


export default connect(mapStateToProps)(ConfirmEmail);