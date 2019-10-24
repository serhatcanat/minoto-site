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
import {makeReservation} from "../data/store.checkout";
import {addVehicleToCompare, setVehicleToReservation} from "../actions";
import {setDealerData, setProductData} from "../data/store.ga";

const pageRegistry = {
	Info: Info,
	Payment: Payment,
	Sum: Sum,
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

const mapStateToProps = ({generic, user, adCompare,reservation}) => {
	return {mobile: generic.mobile, user: user.user, adCompare,reservation};
};

const mapDispatchToProps = dispatch => {
	return {
		setGaProductData: (data) => dispatch(setProductData(data)),
		setGaDealerData: (data) => dispatch(setDealerData(data)),
		addVehicleToCompare: (data) => dispatch(addVehicleToCompare(data)),
		setVehicleToReservation: (data) => dispatch(setVehicleToReservation(data)),
	}
};
export default connect(mapStateToProps,mapDispatchToProps)(Reservation);
