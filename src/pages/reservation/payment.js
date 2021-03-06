import React from 'react'
// Partials
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import Responsive from 'components/partials/responsive'
import ReservationNav from 'components/partials/reservation/nav'
import ReservationSidebar from 'components/partials/reservation/sidebar'
import {FormInput, InputForm} from 'components/partials/forms'
import Collapse from 'components/partials/collapse'
import Btn from 'components/partials/btn'
import {pushMessage} from 'controllers/messenger'
// Functions
import {serializeArray} from 'functions/helpers'
// Deps
import request from 'controllers/request'
import cardValidation from 'controllers/card-validation'
import {redirect} from 'controllers/navigator'
// Assets
import image_card_preview from 'assets/images/payment/card-preview.svg'

import image_logo_mastercard from 'assets/images/payment/icons/mastercard.svg'
import image_logo_maestro from 'assets/images/payment/icons/maestro.svg'
import image_logo_visa from 'assets/images/payment/icons/visa.svg'
import image_logo_visa_electron from 'assets/images/payment/icons/visa_electron.svg'
import image_logo_amex from 'assets/images/payment/icons/amex.svg'
import image_logo_troy from 'assets/images/payment/icons/troy.svg'
import {setDealerData, setProductData} from "../../data/store.ga";
import {addVehicleToCompare, setVehicleToReservation} from "../../actions";
import {connect} from "react-redux";
//import { uid } from 'functions/helpers'

const cardLogos = {
	mastercard: image_logo_mastercard,
	maestro: image_logo_maestro,
	visa: image_logo_visa,
	visa_electron: image_logo_visa_electron,
	amex: image_logo_amex,
	troy: image_logo_troy,
}

class Payment extends React.Component {

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
			adData: [],
			submitMode: true,
			selectedAddress: false,
		}

		this.changeInput = this.changeInput.bind(this);
		this.pay = this.pay.bind(this);
		this.changeSubmitStatus = this.changeSubmitStatus.bind(this);
		this.setSelectedAddress = this.setSelectedAddress.bind(this);
		this.paymentForm = React.createRef();
	}

	componentDidMount() {
		let vm = this;
		const postId = this.props.match.params.id;

		request.get(`reservations/${postId}`, {email: this.props.user.email}, function (payload) {
			if(payload){
				if(payload.complete === true){
					vm.props.history.push('')
				}
				if(payload.product.status === 2){
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

	changeSubmitStatus(status) {
		this.setState({
			submitMode: status
		})
	}

	getAdData() {
		const postId = this.props.match.params.id;
		request.get(`reservations/${postId}`, {email: this.props.user.email}, function (payload) {
			if (payload) {
				if (payload.complete) {
					redirect('reservation.sum', {id: payload.ref});
				} else {
					this.setState({
						loading: false,
						reservation: payload
					});
				}
			}
		}, {excludeApiPath: false});
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

	// Main Payment Function
	pay() {
		this.paymentForm.current.submit();
		if(this.paymentForm.current.validate()){
			const vm = this;
			const {selectedAddress, reservation, cardName, cardCvc, cardExpiry} = this.state;
			let {cardNumber} = this.state;
			this.setState({
				loading: true
			});
			// Split card expired date to 12/23 ==> cardMonth = 12 | cardYear = 23
			const dateArr= cardExpiry.split('/');
			const [cardMonth ,cardYear]= dateArr;
			// Clean spaces between number in chunks 0000 0000 0000 0000 / 000000000000000
			cardNumber = cardNumber.replace(/\s/g, '');

			request.post('reservations', {
				'car_post_id': reservation.product.id,
				'address_id': selectedAddress.id,
				// todo: refactor magic key
				'product_id': 3,
				'name_surname': cardName,
				'card_number': cardNumber,
				'expired_year': cardYear,
				'expired_month': cardMonth,
				'cvc':cardCvc
			}, function (payload,status) {
				if(payload){
					if(payload.status === "200"){
						pushMessage('??demeniz ba??ar??yla ger??ekle??mi??tir.');
						vm.props.history.push(`/rezervasyon/${vm.props.match.params.id}/ozet`,{invoiceInfo:payload});
					}
					else{
						pushMessage(payload.message, { type: "error" });
						vm.setState({
							loading:false
						})
					}

				}

			}, {excludeApiPath: false});
		}
	}

	setSelectedAddress(selectedAddress) {
		this.setState({
			selectedAddress: selectedAddress
		})
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
						<ReservationNav section="payment" reservationID={this.props.match.params.id}/>
						<section className="section reservation-payment">
							<div className="payment-iyzico">
								<i className="iyzico-icon icon-security"></i>
								<div className="iyzico-text">
									<strong className="iyzico-title">iyzico ile g??venli ??deme</strong>
									<p className="iyzico-subtitle">G??venli ??deme sayfas??ndas??n??z. Bilgileriniz SSL
										sertifikas?? ile ??ifrelenerek korunmaktad??r.</p>
								</div>
							</div>
							<div className="payment-cardinfo no-select">
								<div>
									<InputForm className="cardinfo-form" ref={this.paymentForm}>
										<FormInput
											type="text"
											className="form-field name"
											icon="user"
											value={this.state.cardName}
											popLabel
											name="name_surname"
											placeholder="Kart ??zerindeki Ad-Soyad"
											validation={{
												required: "Ad ve soyad??n??z?? girmelisiniz.",
												minWords: ["Ge??erli bir ad-soyad giriniz.", 2],
												minLength: ["Ge??erli bir ad-soyad giriniz.", 5]
											}}
											onChange={(v) => {
												this.changeInput('cardName', v);
											}}/>
										<FormInput
											type="number"
											className="form-field high cardnumber"
											icon="card"
											popLabel name="card_number"
											placeholder="Kart Numaras??"
											mask="9999 9999 9999 9999"
											validation={{
												'creditcard': true,
												'required': true,
											}}
											onChange={(v) => {
												this.changeInput('cardNumber', v);
											}}/>
										<FormInput
											type="number"
											className="form-field high half"
											icon="calendar"
											popLabel name="expired_year"
											placeholder="AA/YY"
											mask="99/99"
											validation={{
												'required': true,
												'expiry': true,
											}}
											onChange={(v) => {
												this.changeInput('cardExpiry', v);
											}}/>
										<FormInput
											type="number"
											className="form-field high half cvc"
											icon="lock"
											popLabel name="cvc"
											placeholder="CVC"
											mask="9999"
											info="Kart??n??z??n arka taraf??nda bulunan son 3 haneli rakam?? giriniz."
											infoProps={{nowrap: true, rtl: true}}
											validation={{
												required: "G??venlik kodunu girmelisiniz.",
												cvc: ["Ge??erli bir CVC girmelisiniz", this.state.cvcLength]
											}}
											onChange={(v) => {
												this.changeInput('cardCvc', v);
											}}/>
										{/*<FormInput*/}
										{/*	type="checkbox"*/}
										{/*	className="form-field high iyzico"*/}
										{/*	name="iyzico"*/}
										{/*	info={<div className="iyzico-info"><div className="info-image"><Image src={image_iyzico_security} /></div><span>??demenizi 3 g??n daha iyzico g??vencesi alt??nda tutuyoruz.  Al????veri??inizle ilgili t??m sorular??n??z?? ve iade i??lemleriniz i??in iyzico destek ekibine ula??abilirsiniz.</span></div>}*/}
										{/*	infoProps={{rtl: true}}*/}
										{/*	validation={{required: "??yzico Korumal?? Al????veri?? S??zle??mesini onaylamal??s??n??z."}}*/}
										{/*	label="iyzico Korumal?? Al????veri??" />*/}


									</InputForm>

									<BillingInfo formInput addresses={reservation.address}
												 changeSubmitStatus={this.changeSubmitStatus}
												 setSelectedAddress={this.setSelectedAddress}/>
								</div>
								<Responsive type="only-web">
									<div className="cardinfo-preview">
										<Image className="preview-cardinfo type" src={cardLogos[this.state.cardType]}/>
										<span className="preview-cardinfo name">{this.state.cardName}</span>
										<span className="preview-cardinfo number">{this.state.cardNumber}</span>
										<span className="preview-cardinfo expiry">{this.state.cardExpiry}</span>
										<span className="preview-cardinfo cvc">{this.state.cardCvc}</span>
										<Image className="preview-bg" src={image_card_preview}/>
									</div>
								</Responsive>
							</div>
						</section>
					</div>
				</div>
				}
				{reservation &&
					<ReservationSidebar onProceed={this.pay} section="payment" reservation={reservation}
									disableProp={this.state.submitMode}/>
				}
			</div>
		)
	}
}

class BillingInfo extends React.Component {

	constructor(props) {
		super(props);
		let selectedAddress = this.getSelectedAddress();
		this.error = "Ge??erli bir fatura adresi girmelisiniz";

		this.state = {
			expanded: false,
			value: (selectedAddress ? selectedAddress.id : false),
			error: (selectedAddress ? false : this.error),
			touched: false,
			selectedAddress: selectedAddress,
			addresses: props.addresses,
			newAddressMode: false,
		}

		this.toggleExpand = this.toggleExpand.bind(this);
		this.getSelectedAddress = this.getSelectedAddress.bind(this);
		this.updateAddresses = this.updateAddresses.bind(this);
		this.saveSelection = this.saveSelection.bind(this);
		this.selectAddress = this.selectAddress.bind(this);
		this.toggleMode = this.toggleMode.bind(this);
	}

	componentDidMount() {
		const {selectedAddress} = this.state;
		if(this.props.onChangeInForm){
			this.props.onChangeInForm(this.state.value, this.props.name, this.state.error, this.state.touched);
		}
		this.props.setSelectedAddress(selectedAddress);
		if(this.state.selectedAddress){
			this.props.changeSubmitStatus(false);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const {selectedAddress} = this.state;
		if(prevState.error !== this.state.error || prevState.touched !== this.state.touched || prevState.value !== this.state.value){
			if(this.props.onChangeInForm){
				this.props.onChangeInForm(this.state.value, this.props.name, this.state.error, this.state.touched);
			}

			if (prevState.selectedAddress.id !== selectedAddress.id) {
				this.props.setSelectedAddress(selectedAddress);
			}

		}

	}

	toggleExpand() {
		this.setState({ expanded: !this.state.expanded });
	}

	toggleMode() {
		this.props.changeSubmitStatus(true);
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
			<div className="form-field billing" style={{width: '40rem'}}>
				<div className={"form-billing" + (this.state.error !== false && (this.state.touched || this.props.forceTouch) ? ' error' : '')}>
					<button type="button" className="billing-btn" onClick={this.toggleExpand}>
						Fatura Bilgileri {this.state.selectedAddress && <span className="btn-selected">{this.state.selectedAddress.title}</span>}
					</button>
					<Collapse open={this.state.expanded}>
						<div className="billing-content loader-container">
							<Loader loading={!this.state.addresses} />
							{this.state.newAddressMode ?
								<div className="content-newaddress">
									<NewAddressForm onSave={this.updateAddresses} changeSubmitStatus={this.props.changeSubmitStatus}/>
								</div>
								:
								<div className="content-addresses">
									<div className="addresses-list">
										{this.state.addresses.map((address, nth) => {
											let id = 'address_select_' + address.id;
											return (
												<div className="inputwrap list-address" key={nth}>
													<div className="checkwrap">
														<input type="radio" name="billing_address" onChange={() => {
															this.selectAddress(address.id)
														}} checked={address.selected} value={address.id} id={id}/>
														<label htmlFor={id}>
															<span></span>
															<div className="address-content">
																<strong className="address-title">
																	{address.title}
																	<span>* {address.type === 'individual' ? "Bireysel" : "Kurumsal"}</span>
																</strong>

																<div className="address-info">
																	{address.address} {address.city} {address.district}
																	<br/>
																	{address.taxOffice &&
																	<span>{address.taxOffice} </span>}{address.taxNum}
																</div>

															</div>
														</label>
													</div>
												</div>
											)
										})}
									</div>
									<div className="addresses-controls">
										<button className="controls-new" type="button" onClick={this.toggleMode}>Farkl?? fatura adresi girmek istiyorum</button>

										<Btn block uppercase primary onClick={this.saveSelection}>Se??</Btn>
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
		// request.get('/dummy/data/cities.json', {}, function(payload){
		request.get(`cities/lookup`, {email: 'test'}, function (payload) {
			if(payload){
				vm.setState({
					cities: payload
				});
			}
		}, {excludeApiPath: false});
	}

	changeCity(city){
		let vm = this;
		vm.setState({districts: false});
		if(city){
			// request.get('/dummy/data/districts.json', {id: city}, function(payload){
			request.get(`districts/lookup/${city}`, {id: city}, function (payload) {
				if(payload){
					vm.setState({
						districts: payload
					});
				}
			}, {excludeApiPath: false});
		}
	}

	saveForm(e, form){
		let vm = this;
		vm.setState({loading: true});
		// console.log(serializeArray(form));

		// Post olacak
		request.post('create/address', serializeArray(form), function (payload) {
			if(payload){
				if(vm.props.onSave){
					vm.props.onSave(payload);
					vm.props.changeSubmitStatus(false);
				}
			}
		}, {excludeApiPath: false});

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
				<input name={'type'} value={this.state.corporate ? "corporate" : "individual"} hidden readOnly/>
				<FormInput
					className="newaddress-field high"
					name="name"
					placeholder={this.state.corporate ? "??irket Ad??" : "Ad Soyad"}
					validation={(this.state.corporate ?
							{minLength: ["Ge??erli bir ??irket ad?? girmelisiniz.", 3]}
							:
							{fullName: true}
					)}
					popLabel />
				{this.state.corporate &&
				<FormInput
					className="newaddress-field high"
					name="email"
					type="email"
					placeholder="E-Posta Adresi"
					validation={{
						email: true,
						required: true,
					}}
					popLabel/>
				}
				{this.state.corporate &&
				<FormInput
					className="newaddress-field high"
					name="taxoffice"
					placeholder="Vergi Dairesi"
					validation={{
						minLength: ["Ge??erli bir vergi dairesi girmelisiniz.", 3]
					}}
					popLabel/>
				}
				<FormInput
					className="newaddress-field high"
					type="number"
					name={this.state.corporate ? "tax_number" : "identity_number"}
					placeholder={this.state.corporate ? "Vergi No" : "TC Kimlik No"}
					validation={(this.state.corporate ? {
						minLength: ["Ge??erli bir vergi dairesi girmelisiniz.", 10],
						maxLength: ["Ge??erli bir vergi dairesi girmelisiniz.", 10]
					} : {
						ID: true
					})}
					mask={this.state.corporate ? "9999999999" : "99999999999"}
					popLabel />
				<FormInput
					className="newaddress-field high"
					type="number"
					name="phone"
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
					name="phone_2"
					placeholder={(this.state.corporate ? '???? Telefonu' : 'Ev Telefonu')}
					mask="(100) 000 00 00"
					validation={{
						minLength: ["Cep Telefonunuzu girmelisiniz.", 15],
						maxLength: ["Cep Telefonunuzu girmelisiniz.", 15]
					}}
					popLabel />
				<FormInput
					className="newaddress-field high city"
					type="select"
					name="city_id"
					placeholder="??l"
					options={(this.state.cities ? this.state.cities : undefined)}
					disabled={!this.state.cities}
					onChange={this.changeCity}
					value={null}
					// validation={"??l se??melisiniz."}
					popLabel />
				<FormInput
					className="newaddress-field high district"
					type="select"
					name="district_id"
					placeholder="??l??e"
					options={(this.state.districts ? this.state.districts : undefined)}
					disabled={!this.state.districts}
					value={null}
					// validation={"??l??e se??melisiniz."}
					popLabel />
				<FormInput
					className="newaddress-field full address"
					type="textarea"
					name="address"
					placeholder="Adres"
					validation={{
						required: "Adresinizi girmelisiniz",
						minLength: ["Adresiniz en az {length} karakter i??ermelidir.", 15],
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

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
