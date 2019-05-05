import React from 'react'

// Pages
import Info from 'pages/reservation/info'
import Payment from 'pages/reservation/payment'
import Sum from 'pages/reservation/sum'

// Sections

// Partials
import Loader from 'components/partials/loader'

// Deps
import { connect } from "react-redux"
import { checkLoginStatus } from "data/store.user"
import { renderRoutes, redirect } from 'controllers/navigator'

const pageRegistry = {
	Info: Info,
	Payment: Payment,
	Sum: Sum,
}

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};

class Reservation extends React.Component {

	componentDidMount() {
		if(!this.props.user){
			checkLoginStatus(function(status){
				if(!status){
					redirect('account.login');
				}
			})
		}

	}

	render () {
		return (
			<main className="page reservation">
				<Loader loading={!this.props.user} />
				{this.props.user && renderRoutes({group: 'reservation', registry: pageRegistry, catchRedirect: 'reservation.info'})}
			</main>
		)
	}
}

export default connect(mapStateToProps)(Reservation);