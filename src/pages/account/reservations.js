import React from 'react'
// Partials
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import Image from 'components/partials/image'
import Responsive from 'components/partials/responsive'
// Deps
//import { connect } from "react-redux"
import request from 'controllers/request'
//Helpers
import {GET_RESERVATIONS} from '../../services/apiEndpoints'
// Assets
import image_reservation_default from 'assets/images/defaults/autocomplete-thumb.jpg'
import {storageSpace} from "../../functions/helpers";

export default class Reservations extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			reservations: false,
			loading: (props.user ? false : true),
		}
	}

	componentDidMount() {
		this.initialize()
	}

	initialize() {
		let vm = this;
		request.get(GET_RESERVATIONS, {email: 'TEST'}, function (payload) {
			if (payload) {
				vm.setState({
					loading: false,
					reservations: payload
				});
			}
		}, {excludeApiPath: false});
	}

	render () {
		let reservations = this.state.reservations;
		return (
			<section className="section account-reservations loader-container">
				<Loader loading={!reservations || this.state.loading}/>
				{reservations &&
					<div className="wrapper narrow">
						<ul className="reservations-list">
						{reservations.map((reservation, nth) => (
							<li className={"list-reservation" + (reservation.status !== 1 ? ' expired' : '')} key={nth}>
								<Link className="reservation-link" href="detail" params={{id: reservation.advert.id}}>
									<Image className="reservation-image" src={storageSpace('c_scale,q_auto:good,w_360/car-posts', reservation.advert.image)} />
									<div className="reservation-content">
										<div className="content-text">
											<strong className="content-title">{reservation.advert.title}</strong>
											<p className="content-dealer">{reservation.advert.dealer}</p>
											<div className="content-info">
												<div><strong>İlan No:</strong> {reservation.advert.id}</div>
												<div>{reservation.datetime}</div>
											</div>
										</div>
										{/*<Responsive type="only-web">*/}
										{/*	<button className="content-cancel" onClick={(e) => { e.preventDefault(); }} disabled={reservation.status !== 1}>Rez. iptal et</button>*/}
										{/*</Responsive>*/}
									</div>
								</Link>
							</li>
						))}
						</ul>
					</div>
				}
			</section>
		)
	}
}
