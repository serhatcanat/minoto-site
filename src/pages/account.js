import React from 'react'

// Pages
import Login from 'pages/account/login'
import Register from 'pages/account/register'
import Recovery from 'pages/account/recovery'
import ConfirmEmail from 'pages/account/confirm-email'
import Profile from 'pages/account/profile'
import Notifications from 'pages/account/notifications'
import Favorites from 'pages/account/favorites'
import Messages from 'pages/account/messages'
import MessageConversation from 'pages/account/messages-conversation'
import Reservations from 'pages/account/reservations'

// Sections

// Partials
//import Image from 'components/partials/image'
import Link from 'components/partials/link'
import Loader from 'components/partials/loader'

// Deps
import { connect } from "react-redux"
import { checkLoginStatus } from "data/store.user"
import isEqual from 'lodash/isEqual';
import { renderRoutes, redirect } from 'controllers/navigator'

const pageRegistry = {
	Login: Login,
	Register: Register,
	Recovery: Recovery,
	ConfirmEmail: ConfirmEmail,
	Profile: Profile,
	Notifications: Notifications,
	Favorites: Favorites,
	Messages: Messages,
	MessageConversation: MessageConversation,
	Reservations: Reservations,
}

const mapStateToProps = state => {
	return {
		user: state.user.user,
		currentPage: state.generic.currentPage,
	};
};

class Account extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: (props.user ? false : true)
		}

		this.checkLogin = this.checkLogin.bind(this);
	}

	componentDidMount() {
		this.checkLogin();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.currentPage.fullKey !== this.props.currentPage.fullKey) {
			this.checkLogin();
		}
		else if (this.props.user !== false && this.state.loading && !isEqual(prevProps.user, this.props.user)) {
			this.setState({ loading: false });
		}
	}

	checkLogin() {
		let vm = this;

		if (vm.props.currentPage.data.requiresLogin) {
			checkLoginStatus(function (status) {
				if (!status) {
					redirect('account.login');
					vm.setState({ loading: false });
				}
				else {
					vm.setState({ loading: false });
				}
			})
		}
		else {
			vm.setState({ loading: false });
		}
	}

	render() {
		let vm = this;
		return (
			<main className="page account loader-container">
				<Loader loading={vm.state.loading} />
				{(!vm.state.loading && !(!vm.props.user && vm.props.currentPage.data.requiresLogin)) &&
					<div className="section account-wrap">
						{vm.props.currentPage.data.requiresLogin &&
							<nav className="section account-nav">
								<div className="nav-innerwrap">
									<Link className="nav-item" navLink href="account.profile" />
									{/* <Link className="nav-item" navLink href="account.notifications" /> */}
									<Link className="nav-item" navLink href="account.favorites" />
									<Link className="nav-item" navLink href="account.messages" exact={false} />
									<Link className="nav-item" navLink href="account.reservations" />
								</div>
							</nav>
						}
						{renderRoutes({ group: 'account', registry: pageRegistry, catchRedirect: 'account.profile' })}
					</div>
				}
				{!(!vm.state.loading && !(!vm.props.user && vm.props.currentPage.data.requiresLogin)) &&
					<span>no</span>
				}
			</main>
		)
	}
}

export default connect(mapStateToProps)(Account);
