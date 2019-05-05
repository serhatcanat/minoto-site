import React from 'react'

// Partials
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import ReservationNav from 'components/partials/reservation/nav'
import ReservationSidebar from 'components/partials/reservation/sidebar'
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import axios from 'axios'

// Assets
import image_card_preview from 'assets/images/checkout-payment-card-preview.svg'

export default class Info extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: (props.user ? false : true),
			reservation: false,
			cardName: "",
			cardNumber: "",
			cardExpiry: "",
			cardCvc: "",
		}

		this.changeInput = this.changeInput.bind(this);
	}

	componentDidMount() {
		let vm = this;

		axios.get('/dummy/data/reservation.json').then(res => {
			if(res.data.status === 'ok'){
				vm.setState({
					loading: false,
					reservation: res.data.info
				});
			}
		});
	}

	changeInput(key, value) {
		this.setState({[key]: value});
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
								<ReservationNav section="payment" reservationID={reservation.product.id} />
								<section className="section reservation-payment">
									<div className="payment-iyzico">
										<i className="iyzico-icon icon-security"></i>
										<div className="iyzico-text">
											<strong className="iyzico-title">iyzico ile güvenli ödeme</strong>
											<p className="iyzico-subtitle">Güvenli ödeme sayfasındasınız. Bilgileriniz SSL sertifikası ile şifrelenerek korunmaktadır.</p>
										</div>
									</div>
									<div className="payment-cardinfo">
										<InputForm className="cardinfo-form">
											<FormInput type="text" className="form-field high name" value={this.state.cardName} popLabel name="name" placeholder="Kart Üzerindeki Ad-Soyad" onChange={(v) => { this.changeInput('cardName', v); }} />
											<FormInput type="text" className="form-field high cardnumber" popLabel name="cardnumber" placeholder="Kart Numarası" onChange={(v) => { this.changeInput('cardNumber', v); }} />
											<FormInput type="text" className="form-field high half" popLabel name="expiry" placeholder="AA/YY" onChange={(v) => { this.changeInput('cardExpiry', v); }} />
											<FormInput type="text" className="form-field high half" popLabel name="cvc" placeholder="CVC" onChange={(v) => { this.changeInput('cardCvc', v); }} />
											<FormInput type="checkbox" className="form-field high iyzico" name="iyzico" label="iyzico Korumalı Alışveriş" />
										</InputForm>

										<div className="cardinfo-preview">
											<span className="preview-cardinfo name">{this.state.cardName}</span>
											<span className="preview-cardinfo number">{this.state.cardNumber}</span>
											<span className="preview-cardinfo expiry">{this.state.cardExpiry}</span>
											<span className="preview-cardinfo cvc">{this.state.cardCvc}</span>
											<Image className="preview-bg" src={image_card_preview} />
										</div>
									</div>
								</section>
							</div>
						</div>
					}
					{reservation &&
						<ReservationSidebar section="payment" reservation={reservation} />
					}
				</div>
			)
	}
}