import React from 'react'

// Pages
import Login from 'pages/account/login'
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
import { renderRoutes } from 'controllers/navigator'

// Deps
import { connect } from "react-redux"
import { checkLoginStatus } from "data/store.user"
import { generatePath } from 'react-router';

const pageRegistry = {
	Login: Login,
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
	};
};

class Account extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: (props.user ? false : true)
		}
	}

	componentDidMount() {
		let vm = this;

		checkLoginStatus(function(status){
			if(!status){
				const path = generatePath(
					vm.props.match.path,
					{ page: 'giris' }
				);
  				vm.props.history.replace(path);
			}
			vm.setState({loading: false});
		})
	}

	render () {
		let vm = this;
		return (
			<main className="page account loader-container">
				<Loader loading={vm.state.loading} />
				{(!vm.state.loading && vm.props.user) &&
					<div className="section account-wrap">
						<nav className="section account-nav">
							<Link className="nav-item" navLink href="account.profile" />
							<Link className="nav-item" navLink href="account.notifications" />
							<Link className="nav-item" navLink href="account.favorites" />
							<Link className="nav-item" navLink href="account.messages" exact={false} />
							<Link className="nav-item" navLink href="account.reservations" />
						</nav>
						{renderRoutes({group: 'account', registry: pageRegistry, catchRedirect: 'account.profile'})}
					</div>
				}
				{(!vm.state.loading && !vm.props.user) &&
					<Login />
				}
			</main>
		)
	}
}

export default connect(mapStateToProps)(Account);