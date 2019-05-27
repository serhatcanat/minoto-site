import React from 'react'

// Partials
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import Responsive from 'components/partials/responsive'
import ReservationNav from 'components/partials/reservation/nav'
import ReservationSidebar from 'components/partials/reservation/sidebar'
import { InputForm, FormInput } from 'components/partials/forms'
import Collapse from 'components/partials/collapse'
import Btn from 'components/partials/btn'

// Functions
import { serializeArray } from 'functions/helpers'
//import { uid } from 'functions/helpers'

// Deps
import axios from 'axios'
import cardValidation from 'controllers/card-validation'
import { redirect } from 'controllers/navigator'

// Assets
import image_card_preview from 'assets/images/payment/card-preview.svg'

import image_logo_mastercard from 'assets/images/payment/icons/mastercard.svg'
import image_logo_maestro from 'assets/images/payment/icons/maestro.svg'
import image_logo_visa from 'assets/images/payment/icons/visa.svg'
import image_logo_visa_electron from 'assets/images/payment/icons/visa_electron.svg'
import image_logo_amex from 'assets/images/payment/icons/amex.svg'
import image_logo_troy from 'assets/images/payment/icons/troy.svg'
import image_iyzico_security from 'assets/images/payment/iyzico-security-badge.png'

const cardLogos = {
	mastercard: image_logo_mastercard,
	maestro: image_logo_maestro,
	visa: image_logo_visa,
	visa_electron: image_logo_visa_electron,
	amex: image_logo_amex,
	troy: image_logo_troy,
}


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

			cardType: false,
			cvcLength: false,
		}

		this.changeInput = this.changeInput.bind(this);
		this.pay = this.pay.bind(this);

		this.paymentForm = React.createRef();
	}

	componentDidMount() {
		let vm = this;

		axios.get('/dummy/data/reservation.json', {props: {id: vm.props.match.params.id}}).then(res => {
			if(res.data.status === 'ok'){
				if(res.data.info.complete){
					redirect('reservation.sum', {id: res.data.info.ref});
				}
				else{	
					vm.setState({
						loading: false,
						reservation: res.data.info
					});
				}
			}
		});
	}

	/*componentDidUpdate(prevProps, prevState) {
		if(prevState.cvcLength !== this.state.cvcLength && this.cvcInput.current){
			this.cvcInput.current.validate();
		}
	}*/

	changeInput(key, value) {
		this.setState({[key]: value});

		if(key === 'cardNumber'){
			let card = cardValidation.getType(value);
			card = card ? card : { cvv_length : false, name: false }

			this.setState({ cardType: card.name, cvcLength: card.cvv_length })
		}
	}

	pay() {
		this.paymentForm.current.submit();
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
								<div className="payment-cardinfo no-select">
									<InputForm className="cardinfo-form" ref={this.paymentForm}>
										<FormInput
											type="text"
											className="form-field name"
											icon="user"
											value={this.state.cardName}
											popLabel
											name="name"
											placeholder="Kart Üzerindeki Ad-Soyad"
											validation={{
												required: "Ad ve soyadınızı girmelisiniz.",
												minWords: ["Geçerli bir ad-soyad giriniz.", 2],
												minLength: ["Geçerli bir ad-soyad giriniz.", 5]
											}}
											onChange={(v) => { this.changeInput('cardName', v); }} />
										<FormInput
											type="number"
											className="form-field high cardnumber"
											icon="card"
											popLabel name="cardnumber"
											placeholder="Kart Numarası"
											mask="9999 9999 9999 9999"
											validation={{
												'creditcard': true,
												'required': true,
											}}
											onChange={(v) => { this.changeInput('cardNumber', v); }} />
										<FormInput
											type="number"
											className="form-field high half"
											icon="calendar"
											popLabel name="expiry"
											placeholder="AA/YY"
											mask="99/99"
											validation={{
												'required': true,
												'expiry': true,
											}}
											onChange={(v) => { this.changeInput('cardExpiry', v); }} />
										<FormInput
											type="number"
											className="form-field high half cvc"
											icon="lock"
											popLabel name="cvc"
											placeholder="CVC"
											mask="9999"
											info="Kartınızın arka tarafında bulunan son 3 haneli rakamı giriniz."
											infoProps={{nowrap: true, rtl: true}}
											validation={{
												required: "Güvenlik kodunu girmelisiniz.",
												cvc: ["Geçerli bir CVC girmelisiniz", this.state.cvcLength]
											}}
											onChange={(v) => { this.changeInput('cardCvc', v); }} />
										<FormInput
											type="checkbox"
											className="form-field high iyzico"
											name="iyzico"
											info={<div className="iyzico-info"><div className="info-image"><Image src={image_iyzico_security} /></div><span>Ödemenizi 3 gün daha iyzico güvencesi altında tutuyoruz.  Alışverişinizle ilgili tüm sorularınızı ve iade işlemleriniz için iyzico destek ekibine ulaşabilirsiniz.</span></div>}
											infoProps={{rtl: true}}
											validation={{required: "İyzico Korumalı Alışveriş Sözleşmesini onaylamalısınız."}}
											label="iyzico Korumalı Alışveriş" />

										<BillingInfo formInput addresses={reservation.addresses} />
									</InputForm>

									<Responsive type="only-web">
										<div className="cardinfo-preview">
											<Image className="preview-cardinfo type" src={cardLogos[this.state.cardType]} />
											<span className="preview-cardinfo name">{this.state.cardName}</span>
											<span className="preview-cardinfo number">{this.state.cardNumber}</span>
											<span className="preview-cardinfo expiry">{this.state.cardExpiry}</span>
											<span className="preview-cardinfo cvc">{this.state.cardCvc}</span>
											<Image className="preview-bg" src={image_card_preview} />
										</div>
									</Responsive>
								</div>
							</section>
						</div>
					</div>
				}
				{reservation &&
					<ReservationSidebar onProceed={this.pay} section="payment" reservation={reservation} />
				}
			</div>
		)
	}
}

class BillingInfo extends React.Component {
	constructor(props) {
		super(props);
		let selectedAddress = this.getSelectedAddress();
		
		this.error = "Geçerli bir fatura adresi girmelisiniz";

		this.state = {
			expanded: false,
			value: (selectedAddress ? selectedAddress.id : false),
			error: (selectedAddress ? false : this.error),
			touched: false,
			selectedAddress: selectedAddress,
			addresses: props.addresses,
			newAddressMode: !(props.addresses.length > 0),
		}

		this.toggleExpand = this.toggleExpand.bind(this);
		this.getSelectedAddress = this.getSelectedAddress.bind(this);
		this.updateAddresses = this.updateAddresses.bind(this);
		this.saveSelection = this.saveSelection.bind(this);
		this.selectAddress = this.selectAddress.bind(this);
		this.toggleMode = this.toggleMode.bind(this);
	}

	componentDidMount() {
		if(this.props.onChangeInForm){
			this.props.onChangeInForm(this.state.value, this.props.name, this.state.error, this.state.touched);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.error !== this.state.error || prevState.touched !== this.state.touched || prevState.value !== this.state.value){
			if(this.props.onChangeInForm){
				this.props.onChangeInForm(this.state.value, this.props.name, this.state.error, this.state.touched);
			}
		}
	}

	toggleExpand() {
		this.setState({ expanded: !this.state.expanded });
	}

	toggleMode() {
		this.setState({ newAddressMode: !this.state.newAddressMode });
	}

	saveSelection() {
		if(this.state.value) {
			this.setState({ expanded: false});
		}
		else {
			this.setState({ touched: true});
		};
	}

	getSelectedAddress(){
		let address = false;
		if(this.props.addresses && this.props.addresses.length){
			address = this.props.addresses.filter((address) => {
				if(address.selected){ return address; }
				else{ return false; }
			});

			if(address.length){
				address = address[0];
			}
			else{ address = false; }
		}
		return address;
	}

	updateAddresses(addresses){
		let vm = this;
		setTimeout(function(){
			vm.setState({addresses : addresses, newAddressMode: false});
		}, 20)
	}

	selectAddress(id){
		let selectedAddress = false;

		let newAddresses = this.state.addresses.map((address, nth) => {
			address.selected = (address.id === id);
			if(address.selected){ selectedAddress = address; }
			return address;
		});

		this.setState({adresses: newAddresses, selectedAddress: selectedAddress, value: selectedAddress.id, error: (selectedAddress.id ? false : this.error)});
	}

	render() {
		return (
			<div className="form-field billing">
				<div className={"form-billing" + (this.state.error !== false && (this.state.touched || this.props.forceTouch) ? ' error' : '')}>
					<button type="button" className="billing-btn" onClick={this.toggleExpand}>
						Fatura Bilgileri {this.state.selectedAddress && <span className="btn-selected">{this.state.selectedAddress.title}</span>}
					</button>
					<Collapse open={this.state.expanded}>
						<div className="billing-content loader-container">
							<Loader loading={!this.state.addresses} />
							{this.state.newAddressMode ? 
								<div className="content-newaddress">
									<NewAddressForm onSave={this.updateAddresses} />
								</div>
							:
								<div className="content-addresses">
									<div className="addresses-list">
									{this.state.addresses.map((address, nth) => {
										let id = 'address_select_'+address.id;
										return(
											<div className="inputwrap list-address" key={nth}>
												<div className="checkwrap">
													<input type="radio" name="billing_address" onChange={() => {this.selectAddress(address.id)}} checked={address.selected} value={address.id} id={id} />
													<label htmlFor={id}>
														<span></span>
														<div className="address-content">
															<strong className="address-title">
																{address.title}
																<span>* {address.type === 1 ? "Bireysel" : "Kurumsal"}</span>
															</strong>

															<div className="address-info">
																{address.address} {address.city} {address.district}
																<br />
																{address.taxOffice && <span>{address.taxOffice} </span>}{address.taxNum}
															</div>

														</div>
													</label>
												</div>
											</div>
										)
									})}
									</div>
									<div className="addresses-controls">
										<button className="controls-new" type="button" onClick={this.toggleMode}>Farklı fatura adresi girmek istiyorum</button>

										<Btn block uppercase primary onClick={this.saveSelection}>Seç</Btn>
									</div>
								</div>
							}
						</div>
					</Collapse>
				</div>
				{(this.state.error !== false && (this.state.touched || this.props.forceTouch)) &&
					<div className="content-error">{this.state.error}</div>
				}
			</div>
		)
	}
}

class NewAddressForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			corporate: false,
			cities: false,
			districts: false,
			loading: false,
		}

		this.changeCity = this.changeCity.bind(this);
		this.saveForm = this.saveForm.bind(this);

		this.form = React.createRef();
	}

	componentDidMount() {
		let vm = this;
		axios.get('/dummy/data/cities.json').then(res => {
			if(res.data.status === 'ok'){
				vm.setState({
					cities: res.data.cities
				});
			}
		});
	}

	changeCity(city){
		let vm = this;

		vm.setState({districts: false});
		if(city){
			axios.get('/dummy/data/districts.json', {params: {id: city}}).then(res => {
				if(res.data.status === 'ok'){
					vm.setState({
						districts: res.data.districts
					});
				}
			});
		}
	}

	saveForm(e, form){
		let vm = this;
		vm.setState({loading: true});

		// console.log(serializeArray(form));
			
		axios.get('/dummy/data/reservation.json', { params: serializeArray(form) }).then(res => {
			if(res.data.status === 'ok'){
				if(vm.props.onSave){
					vm.props.onSave(res.data.info.addresses);
				}
			}
		});
	}

	setAddressType(corporate = false){
		this.setState({corporate: corporate})
	}

	render() {
		return (
			<InputForm className="newaddress-form" tag="section" innerForm ref={this.form} onSubmit={this.saveForm}>
				<div className="newaddress-field full newaddress-type">
					<div className="inputwrap type-opt">
						<div className="checkwrap">
							<input type="radio" name="billing_address" onChange={() => {this.setAddressType(false)}} checked={!this.state.corporate} value="1" id="addresstype_personal" />
							<label htmlFor="addresstype_personal">
								<span></span>
								Bireysel
							</label>
						</div>
					</div>
					<div className="inputwrap type-opt">
						<div className="checkwrap">
							<input type="radio" name="billing_address" onChange={() => {this.setAddressType(true)}} checked={this.state.corporate} value="2" id="addresstype_corporate" />
							<label htmlFor="addresstype_corporate">
								<span></span>
								Kurumsal
							</label>
						</div>
					</div>
				</div>
				<FormInput
					className="newaddress-field high"
					name="newaddr_name"
					placeholder={this.state.corporate ? "Şirket Adı" : "Ad Soyad"}
					validation={(this.state.corporate ?
						{minLength: ["Geçerli bir şirket adı girmelisiniz.", 3]}
						: 
						{fullName: true}
					)}
					popLabel />
				{this.state.corporate &&
					<FormInput
						className="newaddress-field high"
						name="newaddr_email"
						type="email"
						placeholder="E-Posta Adresi"
						validation={{
							email: true,
							required: true,
						}}
						popLabel />
				}
				{this.state.corporate &&
					<FormInput
						className="newaddress-field high"
						name="newaddr_taxoffice"
						placeholder="Vergi Dairesi"
						validation={{
							minLength: ["Geçerli bir vergi dairesi girmelisiniz.", 3]
						}}
						popLabel />
				}
				<FormInput
					className="newaddress-field high"
					type="number"
					name="newaddr_taxnum"
					placeholder={this.state.corporate ? "Vergi No" : "TC Kimlik No"}
					validation={(this.state.corporate ? {
						minLength: ["Geçerli bir vergi dairesi girmelisiniz.", 10],
						maxLength: ["Geçerli bir vergi dairesi girmelisiniz.", 10]
					} : {
						ID: true
					})}
					mask={this.state.corporate ? "9999999999" : "99999999999"}
					popLabel />
				<FormInput
					className="newaddress-field high"
					type="number"
					name="newaddr_phone_cell"
					placeholder="Cep Telefonu"
					mask="(100) 000 00 00"
					validation={{
						minLength: ["Cep Telefonunuzu girmelisiniz.", 15],
						maxLength: ["Cep Telefonunuzu girmelisiniz.", 15]
					}}
					popLabel />
				<FormInput
					className="newaddress-field high"
					type="number"
					name="newaddr_phone_alt"
					mask="(100) 000 00 00"
					validation={{
						minLength: ["Cep Telefonunuzu girmelisiniz.", 15],
						maxLength: ["Cep Telefonunuzu girmelisiniz.", 15]
					}}
					popLabel />
				<FormInput
					className="newaddress-field high"
					type="select"
					name="newaddr_city"
					placeholder="İl"
					options={(this.state.cities ? this.state.cities : undefined)}
					disabled={!this.state.cities}
					onChange={this.changeCity}
					value={null}
					validation={"İl seçmelisiniz."}
					popLabel />
				<FormInput
					className="newaddress-field high"
					type="select"
					name="newaddr_district"
					placeholder="İlçe"
					options={(this.state.districts ? this.state.districts : undefined)}
					disabled={!this.state.districts}
					value={null}
					validation={"İlçe seçmelisiniz."}
					popLabel />
				<FormInput
					className="newaddress-field full address"
					type="textarea"
					name="newaddr_address"
					placeholder="Adres"
					validation={{
						required: "Adresinizi girmelisiniz",
						minLength: ["Adresiniz en az {length} karakter içermelidir.", 15],
					}}
					popLabel />

				<Btn
					className="newaddress-submit"
					loading={this.state.loading}
					onClick={() => { if(this.form.current){ this.form.current.submit() }}}
					block uppercase>Kaydet</Btn>
			</InputForm>
		)
	}
}