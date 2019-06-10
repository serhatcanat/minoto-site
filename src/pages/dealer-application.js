import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import request from 'controllers/request'
import { openModal } from 'functions/modals'
import { serializeArray } from "functions/helpers";

export default class Faq extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submitting: false,
			cities: false,
			districts: false,
			brands: false,
		}

		this.changeCity = this.changeCity.bind(this);
		this.saveData = this.saveData.bind(this);
	}

	componentDidMount() {
		let vm = this;
		request.get('/dummy/data/cities.json', {}, function(payload){
			if(payload){
				vm.setState({
					cities: payload
				});
			}
		});

		request.get('/dummy/data/footer-brands.json', {}, function(payload){
			if(payload){
				vm.setState({
					brands: payload.map(function(brand, index){
						return {
							value: brand.id,
							label: brand.title,
						}
					})
				});
			}
		});
	}

	saveData(e) {
		let vm = this;
		// Form Data:
		console.log(serializeArray(e.target));
		this.setState({
			loading: true,
			submitting: true,
		});

		setTimeout(function() {
			vm.setState({submitting: false})
		}, 1000);
	}

	changeCity(city){
		let vm = this;

		vm.setState({districts: false});
		if(city){
			request.get('/dummy/data/districts.json', {id: city}, function(payload){
				if(payload){
					vm.setState({
						districts: payload
					});
				}
			});
		}
	}

	render () {
		return (
			<main className="page content">
				<section className="section contentpage">
						<div className="contentpage-wrap wrapper narrow">
							<div className="contentpage-content">
								<h1 className="content-title">Bayi Başvuru Formu</h1>
								<p className="content-subtitle">Minoto'da araçlarınızın listelenmesini istiyorsanız lütfen formu <br />doldurun.</p>
								<InputForm className="section contentpage-form">
									<div className="form-row">
										<div className="form-col">
											<FormInput
												type="text"
												placeholder="Bayi Adı"
												popLabel />
										</div>
										<div className="form-col">
											<FormInput
												type="text"
												placeholder="Yetkili Kişi"
												popLabel />
										</div>
									</div>
									<div className="form-row">
										<div className="form-col">
											<FormInput
												type="text"
												placeholder="Vergi Dairesi"
												popLabel />
										</div>
										<div className="form-col">
											<FormInput
												type="number"
												placeholder="Vergi Numarası"
												mask="00000000000"
												popLabel />
										</div>
									</div>
									<div className="form-row">
										<div className="form-col">
											<FormInput
												name="phone"
												disabled={this.state.submitting}
												placeholder="Telefon Numarası"
												mask="(199) 999 99 99"
												validation={{
													required: "Telefon numaranızı girmelisiniz.",
													minLength: ["Geçerli bir telefon numarası girmelisiniz.", 15]
												}}
												popLabel />
										</div>
										<div className="form-col">
											<FormInput
												name="phone"
												disabled={this.state.submitting}
												placeholder="Cep Telefonu"
												mask="(199) 999 99 99"
												validation={{
													required: "Cep telefonunuzu girmelisiniz.",
													minLength: ["Geçerli bir telefon numarası girmelisiniz.", 15]
												}}
												popLabel />
										</div>
									</div>
									<div className="form-row">
										<div className="form-col x2">
											<FormInput
												type="textarea"
												placeholder="Adres"
												popLabel />
										</div>
									</div>
									<div className="form-row">
										<div className="form-col">
											<FormInput
												className="high city"
												type="select"
												name="city"
												placeholder="İl"
												options={(this.state.cities ? this.state.cities : undefined)}
												disabled={!this.state.cities}
												onChange={this.changeCity}
												value={null}
												validation={"İl seçmelisiniz."}
												popLabel />
										</div>
										<div className="form-col">
											<FormInput
												className="high district"
												type="select"
												name="district"
												placeholder="İlçe"
												options={(this.state.districts ? this.state.districts : undefined)}
												disabled={!this.state.districts}
												value={null}
												validation={"İlçe seçmelisiniz."}
												popLabel />
										</div>
									</div>
									<div className="form-row">
										<div className="form-col">
											<FormInput
												className="high brands"
												type="select"
												name="brands"
												placeholder="Marka ya da markalar seçiniz."
												options={(this.state.brands ? this.state.brands : undefined)}
												disabled={!this.state.brands}
												value={null}
												validation={"Marka seçmelisiniz."}
												popLabel />
										</div>
									</div>
								</InputForm>
							</div>
						</div>
				</section>
			</main>

		)
	}
}