import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import ReservationNav from 'components/partials/reservation/nav'
import ReservationSidebar from 'components/partials/reservation/sidebar'
import Link from 'components/partials/link'

// Deps
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import {setDealerData, setProductData} from "../../data/store.ga";
import {addVehicleToCompare, setVehicleToReservation} from "../../actions";
import {connect} from "react-redux";

class Sum extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: (props.user ? false : true),
			reservation: false,
		}
	}

	componentDidMount() {
		let vm = this;

		const postId = this.props.match.params.id;

		request.get(`reservations/${postId}`, {email: this.props.user.email}, function (payload) {
			if(payload){
				if(payload.complete){

					redirect('reservation.sum', {id: payload.ref});
				}
				else {
					vm.setState({
						loading: false,
						reservation: payload
					});
				}
			}
		}, {excludeApiPath: false});
	}

	render () {
		//let vm = this;
		let reservation = this.state.reservation;
		console.log(this.props);
		return (
			<div className="section reservation-layout loader-container">
				<Loader loading={!reservation || this.state.loading} />
				{reservation &&
					<div className="layout-content">
						<div className="content-innerwrap">
							<ReservationNav section="sum" reservationID={reservation.ref} />
							<section className="section reservation-sum">
								<i className="sum-check icon-check-thin"></i>
								<h1 className="sum-title">Ödemeniz başarıyla gerçekleşmiştir</h1>
								<div className="sum-text">{this.props.location.state.invoiceInfo.message}</div>
								<div className="sum-ref">Referans Numarası: <span>{this.props.location.state.invoiceInfo.ref}</span></div>
								<div className="sum-links">
									<Link href="home" className="links-item" />
									<Link href="account.reservations" className="links-item" />
									<Link href="account.profile" className="links-item" />
								</div>
							</section>
						</div>
					</div>
				}
				{reservation &&
					<ReservationSidebar section="sum" reservation={reservation} />
				}
			</div>
		)
	}
}


const mapStateToProps = ({generic, user, adCompare, reservation}) => {
	return {mobile: generic.mobile, user: user.user, adCompare, reservation};
};

const mapDispatchToProps = dispatch => {
	return {
		setGaProductData: (data) => dispatch(setProductData(data)),
		setGaDealerData: (data) => dispatch(setDealerData(data)),
		addVehicleToCompare: (data) => dispatch(addVehicleToCompare(data)),
		setVehicleToReservation: (data) => dispatch(setVehicleToReservation(data)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Sum);
