import React from 'react'
// Partials
import Image from 'components/partials/image'
import Responsive from 'components/partials/responsive'
import Loader from 'components/partials/loader'
import ReservationNav from 'components/partials/reservation/nav'
import ReservationSidebar from 'components/partials/reservation/sidebar'
// Deps
import request from 'controllers/request'
import {redirect} from 'controllers/navigator'
// Assets
import image_info from "assets/images/checkout-info-logo.jpg"
import {setVehicleToReservation} from "../../actions";
import {connect} from "react-redux";

class Info extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: (!props.user),
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
				else{

					vm.setState({
						loading: false,
						reservation: payload
					});
				}
			}
		}, {excludeApiPath: false});

		/*axios.get('/dummy/data/reservation.json', {props: {id: vm.props.match.params.id}}).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({
					loading: false,
					reservation: res.data.info
				});
			}
		});*/
	}

	render () {
		//let vm = this;
		let reservation = this.state.reservation;
		return (
			<div className="section reservation-layout loader-container">
				<Loader loading={!reservation.product || this.state.loading}/>
				{reservation &&
				<div className="layout-content">
					<div className="content-innerwrap">
						<ReservationNav section="info" reservationID={this.props.match.params.id} />
						<section className="section reservation-info">
							<div className="info-faq">
								<div className="faq-item">
									<h2 className="item-title">Neden rezerve etmeliyim?</h2>
									<div className="item-content wysiwyg">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
									</div>
								</div>
								<div className="faq-item">
									<h2 className="item-title">Avantajlar?? nedir ?</h2>
									<div className="item-content wysiwyg">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
									</div>
								</div>
								<div className="faq-item">
									<h2 className="item-title">Rezerve ??creti iade edilir mi?</h2>
									<div className="item-content wysiwyg">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
									</div>
								</div>
							</div>
							<Responsive type="only-web">
								<Image className="info-logo" src={image_info} />
							</Responsive>
						</section>
					</div>
				</div>
				}
				{reservation &&
				<ReservationSidebar section="info" reservation={reservation} />
				}
			</div>
		)
	}
}
const mapStateToProps = ({generic, user, adCompare,reservation}) => {
	return {mobile: generic.mobile, user: user.user, adCompare,reservation};
};

const mapDispatchToProps = dispatch => {
	return {
		setVehicleToReservation: (data) => dispatch(setVehicleToReservation(data)),
	}
};
export default connect(mapStateToProps,mapDispatchToProps)(Info);
