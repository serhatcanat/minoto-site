import React from 'react'

// Pages
import Login from 'pages/account/login'
import Profile from 'pages/account/profile'
import Notifications from 'pages/account/notifications'
import Favorites from 'pages/account/favorites'

// Sections

// Partials
//import Image from 'components/partials/image'
import Link from 'components/partials/link'
import Loader from 'components/partials/loader'

// Deps
import { connect } from "react-redux"
import { checkLoginStatus } from "data/store.user"
import { generatePath } from 'react-router';
import { Route, Switch, Redirect } from 'react-router-dom'

// Assets

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
							<Link className="nav-item" navLink href="account" params={{page: 'profil'}}>
								Profilim
							</Link>
							<Link className="nav-item" navLink href="account" params={{page: 'bildirimler'}}>
								Bildirimler
							</Link>
							<Link className="nav-item" navLink href="account" params={{page: 'favoriler'}}>
								Favorilerim
							</Link>
							<Link className="nav-item" navLink href="account" params={{page: 'mesajlar'}}>
								Mesajlarım
							</Link>
							<Link className="nav-item" navLink href="account" params={{page: 'rezervasyonlar'}}>
								Rezerve Ettiklerim
							</Link>
						</nav>
						<Switch>
							<Route exact path={'/hesabim/profil'} component={Profile} />
							<Route exact path={'/hesabim/bildirimler'} component={Notifications} />
							<Route exact path={'/hesabim/favoriler'} component={Favorites} />
							<Redirect to="/hesabim/profil" />
						</Switch>
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