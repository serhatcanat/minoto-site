import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import ReservationNav from 'components/partials/reservation/nav'
import ReservationSidebar from 'components/partials/reservation/sidebar'
import Link from 'components/partials/link'

// Deps
import axios from 'axios'

export default class Sum extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: (props.user ? false : true),
			reservation: false,
		}
	}

	componentDidMount() {
		let vm = this;

		axios.get('/dummy/data/reservation-complete.json', {props: {id: vm.props.match.params.id}}).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({
					loading: false,
					reservation: res.data.info
				});
			}
		});
	}

	render () {
		//let vm = this;
		let reservation = this.state.reservation;

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
								<div className="sum-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud nisi ut aliquip ex ea commodo consequat.</div>

								<div className="sum-ref">Referans Numarası: <span>{reservation.ref}</span></div>

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