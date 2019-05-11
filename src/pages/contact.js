import React from 'react'

// Partials
import GoogleMap from 'components/partials/google-map'
import Link from 'components/partials/link'
import Btn from 'components/partials/btn'
import { serializeArray } from 'functions/helpers'
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import request from 'controllers/request'

export default class Contact extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			formMode: 'generic',
		}

		this.submit = this.submit.bind(this);
		this.changeFormMode = this.changeFormMode.bind(this);
	}

	submit(e) {
		let vm = this;
		vm.setState({ loading: true });
		//post statikte 404 verdiği için dummy olarak get
		//request.post('/dummy/data/contactform.json', serializeArray(e.target), function(response){
		request.get('/dummy/data/contactform.json', serializeArray(e.target), function(response){
			if(response !== false){
				// Dummy timeout etc..
				setTimeout(function(){
					vm.setState({ loading: false, complete: true });

					setTimeout(function(){
						vm.setState({ loading: false, complete: false });
					}, 1000);
				}, 1000);
			}
			else {
				vm.setState({ loading: false });
			}
		});
	}

	changeFormMode(e){
		this.setState({ formMode: e.target.value });
	}

	render () {
		return (
			<main className="page contact">
				<section className="section contact-map">
					<GoogleMap
						className="map-container"
						markers={[{
							html: false,
							lat: 41.109604,
							lng: 29.022052
						}]}

						settings={{
							maxZoom: 16,
						}}
					/>
				</section>
				<section className="section contact-info">
					<div className="info-wrap wrapper medium">
						<ul className="info-section info-details">
							<li className="details-item">
								<strong className="item-heading">Ticaret Ünvanı</strong>
								<span className="item-content">Minoto A.Ş.</span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Ticari Sicil No</strong>
								<span className="item-content">742942</span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Sorumlu Kişi</strong>
								<span className="item-content">Kaan Boyner / Ferhat Albayrak</span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Telefon</strong>
								<span className="item-content"><Link type="a" href="tel:08002129898">0800 212 98 98</Link></span>
							</li>
							<li className="details-item">
								<strong className="item-heading">E-Posta</strong>
								<span className="item-content"><Link type="a" href="mailto:info@minoto.com">info@minoto.com</Link></span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Mersis No</strong>
								<span className="item-content">69486208399</span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Adres</strong>
								<span className="item-content">Maslak Mahallesi, Meydan Sokak Spring Giz Plaza 3630 Sarıyer İstanbul</span>
							</li>
						</ul>

						<InputForm className="info-section info-form" onSubmit={this.submit}>
							<div className="form-typeselection">
								<div className="typeselection-opt">
									<input
										id="typeselection_generic"
										type="radio"
										name="contact-method"
										value="generic"
										defaultChecked={this.state.formMode === 'generic'}
										onChange={this.changeFormMode}
										className="opt-input" />
									<label htmlFor="typeselection_generic">Genel İletişim</label>
								</div>
								<div className="typeselection-opt">
									<input
										id="typeselection_dealer"
										type="radio"
										name="contact-method"
										value="dealer"
										defaultChecked={this.state.formMode === 'dealer'}
										onChange={this.changeFormMode}
										className="opt-input" />
									<label htmlFor="typeselection_dealer">Bayi İletişim</label>
								</div>
							</div>
							<div className="form-contentwrap">
								{this.state.formMode === 'generic' &&
									<div className="form-section">
										<FormInput
											popLabel
											name="name"
											placeholder="Ad - Soyad"
											type="text"
											validation={{
												fullName: true
											}}
											className="form-input" />
									</div>
								}
								{this.state.formMode === 'dealer' &&
									<div className="form-section x2">
										<FormInput
											popLabel
											name="dealer"
											placeholder="Bayi Adı"
											type="text"
											validation={{
												required: "Bayi adını doldurmalısınız.",
												minLength: ["Geçerli bir bayi adı girmelisiniz", 4]
											}}
											className="form-input" />
									</div>
								}
								<div className="form-section">
									<FormInput
										popLabel
										name="email"
										placeholder="E-posta"
										type="email"
										validation={{
											email: true
										}}
										className="form-input" />
								</div>
								<div className="form-section">
									<FormInput
										popLabel
										name="phone"
										placeholder="Telefon"
										type="text"
										mask="(199) 999 99 99"
										validation={{
											required: "Telefon numaranızı girmelisiniz.",
											minLength: ["Geçerli bir telefon numarası girmelisinz.", 15]
										}}
										className="form-input" />
								</div>
								{this.state.formMode === 'generic' &&
									<div className="form-section">
										<FormInput
											popLabel
											name="company"
											placeholder="Firma Adı"
											type="text"
											className="form-input" />
									</div>
								}
								<div className="form-section x2">
									<FormInput
										popLabel
										name="message"
										placeholder="Mesajınız"
										type="textarea"
										validation={{
											required: "Bir mesaj yazmalısınız.",
											minLength: ["Mesajınız en az {length} karakter içermelidir.", 15]
										}}
										className="form-input" />
								</div>
								<div className="form-controls">
									<Btn wide loading={this.state.loading} type="submit" status={(this.state.complete ? 'check-thin' : false)} disabled={this.state.loading}>Gönder</Btn>
								</div>
							</div>
						</InputForm>
					</div>
				</section>
			</main>
		)
	}
}