import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import Image from 'components/partials/image'

// Deps
//import { connect } from "react-redux"
import axios from 'axios'

// Assets
import image_reservation_default from 'assets/images/defaults/autocomplete-thumb.jpg'

export default class Reservations extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			reservations: false,
		}
	}

	componentDidMount() {
		let vm = this;

		axios.get(
			'/dummy/data/user-reservations.json',
			{ params: {} }
		).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({reservations: res.data.reservations})
			}
		});
	}

	render () {
		let reservations = this.state.reservations;
		return (
			<section className="section account-reservations loader-container">
				<Loader loading={reservations === false} />
				{reservations &&
					<div className="wrapper narrow">
						<ul className="reservations-list">
						{reservations.map((reservation, nth) => (
							<li className={"list-reservation" + (reservation.status !== 1 ? ' expired' : '')} key={nth}>
								<Link className="reservation-link" href="detail" params={{id: reservation.advert.id}}>
									<Image className="reservation-image" src={(reservation.advert.image ? reservation.advert.image : image_reservation_default)} />
									<div className="reservation-content">
										<div className="content-text">
											<strong className="content-title">{reservation.advert.title}</strong>
											<p className="content-dealer">{reservation.advert.dealer}</p>
											<div className="content-info">
												<div><strong>İlan No:</strong> {reservation.advert.id}</div>
												<div>{reservation.datetime}</div>
											</div>
										</div>
										<button className="content-cancel" onClick={(e) => { e.preventDefault(); }} disabled={reservation.status !== 1}>Rez. iptal et</button>
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