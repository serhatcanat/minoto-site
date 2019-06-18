import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'

// Deps
import request from 'controllers/request'
import { openModal } from 'functions/modals'
import { serializeArray } from "functions/helpers";
import isEqual from "lodash/isEqual";

const agreement = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in dui quis justo dictum pellentesque non vitae elit. In facilisis blandit pharetra. Vestibulum id tellus et magna tempus accumsan. Etiam lobortis velit eget massa cursus, ac dignissim elit euismod. Praesent sollicitudin tincidunt enim ut aliquam. Aenean sit amet tincidunt quam. Vivamus egestas suscipit dictum. Maecenas at dolor vitae ligula aliquam finibus. Cras at porta turpis. Fusce porta enim sed congue convallis. Phasellus arcu justo, maximus ut interdum porta, rutrum quis eros. Suspendisse sollicitudin sed dui quis ultricies. Phasellus nunc urna, lobortis sit amet consectetur at, aliquet vitae ipsum. Mauris ac imperdiet elit. Morbi ac nulla non arcu pellentesque dignissim ac sed ex. Duis vehicula nisi in rhoncus bibendum.</p><h2>Alt Koşullar</h2><p>Aliquam ultrices tellus at augue finibus faucibus. Nam mi lorem, laoreet nec nibh posuere, consectetur lobortis diam. Duis ornare gravida ipsum, a gravida diam iaculis gravida. Donec rutrum quam vitae odio efficitur suscipit. Ut vehicula tristique sapien et pharetra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget magna non lectus gravida condimentum in a lacus. Integer interdum placerat ex, ut tempus enim tristique sit amet. Cras ullamcorper aliquam neque rutrum fringilla. Nulla ac ipsum eros. Nulla luctus diam feugiat blandit malesuada.</p><p>Ut id dui nisi. Donec nisl nibh, fringilla et diam quis, scelerisque finibus justo. Pellentesque ut odio pellentesque, pharetra turpis eget, ullamcorper felis. Phasellus euismod ultrices dolor, ut consectetur dui elementum in. In maximus enim in orci vestibulum, eu sollicitudin ante consectetur. Nam vitae vestibulum ipsum. Pellentesque et diam suscipit, dignissim dolor vel, iaculis libero. Duis sagittis, ligula nec rutrum luctus, augue sapien lobortis quam, at fermentum tellus nulla a augue.</p><p>In feugiat ligula ipsum, in scelerisque ipsum ullamcorper in. Fusce dapibus lectus nisi, et maximus augue vestibulum gravida. Etiam eget diam semper, maximus arcu quis, blandit ante. Cras aliquet non mauris nec mattis. Sed a nibh et est auctor aliquet. In nec massa in augue pellentesque molestie non id nunc. Quisque consequat ornare scelerisque. Pellentesque ullamcorper elit eget malesuada consectetur. Vivamus ante ante, posuere et purus eu, aliquet luctus erat. Sed lacinia, orci eu hendrerit placerat, diam mi blandit elit, quis auctor augue elit a lectus. Nam finibus pharetra orci ut varius. Maecenas eget lacus viverra nulla volutpat ultrices. Quisque ut eros lacinia, lobortis dolor vitae, sodales risus. Aliquam mattis sem non massa auctor, ac aliquam tellus accumsan. Mauris feugiat nunc ut auctor blandit. Aenean et magna non quam venenatis pretium vitae eget erat.</p><p>Maecenas nec rhoncus ligula. Aenean quis enim vitae libero hendrerit imperdiet eget id eros. Quisque congue mi est, in dictum velit pellentesque in. Proin mi lectus, vestibulum eget pulvinar id, eleifend nec erat. Nullam dui tellus, ullamcorper ac eleifend quis, posuere a sapien. Sed sagittis interdum sapien eu accumsan. In vulputate sem elit, nec cursus augue tincidunt vel. In rhoncus enim risus, a pretium libero auctor sit amet. Phasellus ornare nunc in interdum condimentum. Vivamus eu interdum quam. Sed egestas mattis porta. Aenean malesuada pellentesque metus sit amet iaculis. Nullam a rhoncus ex, ut finibus dui. Nullam commodo, orci at rhoncus ultricies, velit mi consequat eros, tincidunt feugiat enim sapien eu magna.</p><p>Mauris interdum ac elit et bibendum. Sed vehicula nibh ut dolor scelerisque posuere. Nullam luctus consequat purus, non viverra erat tristique ac. Vestibulum ac nulla vel ipsum tristique maximus. Integer varius ipsum id odio rhoncus, at aliquam lorem volutpat. Donec euismod est eu ipsum condimentum, in tincidunt diam efficitur. Morbi in placerat elit. Morbi est lectus, sagittis volutpat congue ac, lacinia ut risus. Praesent quis pharetra lectus, vitae mollis nisl.</p><p>Vivamus a ligula rutrum, bibendum arcu eu, placerat dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent blandit lacus nisi, in tempus tortor elementum rhoncus. Aenean eget dapibus risus. Pellentesque id nunc iaculis tellus malesuada facilisis id posuere nunc. Praesent mollis libero nec eros ornare, sed viverra urna aliquam. In augue quam, vehicula feugiat elit sed, facilisis convallis nisi. Vestibulum ut mauris quis lacus lacinia sodales. Nullam eget elementum lorem. Sed tincidunt, est in venenatis venenatis, sapien ante sollicitudin est, sit amet tincidunt sem metus sed enim. In vitae erat tincidunt, efficitur enim non, rutrum dui. Sed pellentesque odio eu dolor ultricies, vel luctus odio tempus. Vivamus eget velit ut ipsum rutrum sollicitudin vel at nulla. Duis mattis ipsum sem, sodales aliquet ligula lacinia eget."

export default class Faq extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submitting: false,
			cities: false,
			districts: false,
			brands: false,
			selectedBrands: [],
			availableBrands: [],
			touched: false,
		}

		this.changeCity = this.changeCity.bind(this);
		this.saveData = this.saveData.bind(this);
		this.addBrand = this.addBrand.bind(this);
		this.removeBrand = this.removeBrand.bind(this);

		this.form = React.createRef();
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
					brands: payload
				});
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;
		if(!isEqual(prevState.brands, vm.state.brands) || !isEqual(prevState.selectedBrands, vm.state.selectedBrands)){
			vm.setState({availableBrands: vm.state.brands.reduce(function(filtered, brand){
				if (!vm.state.selectedBrands.filter(sBrand => (sBrand.value === brand.id)).length){
					filtered.push({
						value: brand.id, 
						label: brand.title,
					});

				}
				return filtered;
			}, [])});
		}
	}

	saveData(e) {
		let vm = this;
		// Form Data:
		if(vm.state.selectedBrands.length){
			console.log(serializeArray(e.target));
			this.setState({
				submitting: true,
			});

			setTimeout(function() {
				vm.setState({submitting: false, selectedBrands: [], touched: false});
				vm.form.current.reset();
			}, 1000);
		}
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

	addBrand(selected){
		if(selected){

			this.setState({
				selectedBrands: this.state.selectedBrands.concat(this.state.availableBrands.filter(brand => (brand.value === selected)))
			});
		}
	}

	removeBrand(id){
		this.setState({
			selectedBrands: this.state.selectedBrands.filter(brand => (brand.value !== id))
		});
	}

	render () {
		return (
			<main className="page content">
				<section className="section contentpage">
						<div className="contentpage-wrap wrapper narrow">
							<div className="contentpage-content">
								<h1 className="content-title">Bayi Başvuru Formu</h1>
								<p className="content-subtitle">Minoto'da araçlarınızın listelenmesini istiyorsanız lütfen formu <br />doldurun.</p>
								<InputForm className="section contentpage-form grid-container" ref={this.form} onSubmit={this.saveData}>
									<div className="grid-row">
										<div className="grid-col x6 m-x12">
											<FormInput
												type="text"
												name="name"
												placeholder="Bayi Adı"
												validation={"Bir isim girmelisiniz."}
												popLabel />
										</div>
										<div className="grid-col x6 m-x12">
											<FormInput
												type="text"
												name="manager"
												placeholder="Yetkili Kişi"
												validation={"Bir isim girmelisiniz."}
												popLabel />
										</div>
									</div>
									<div className="grid-row">
										<div className="grid-col x6 m-x12">
											<FormInput
												type="text"
												name="taxoffice"
												placeholder="Vergi Dairesi"
												validation={"Vergi dairenizi girmelisiniz."}
												popLabel />
										</div>
										<div className="grid-col x6 m-x12">
											<FormInput
												type="number"
												name="taxnumber"
												placeholder="Vergi Numarası"
												mask="00000000000"
												validation={"Vergi numaranızı girmelisiniz."}
												popLabel />
										</div>
									</div>
									<div className="grid-row">
										<div className="grid-col x6 m-x12">
											<FormInput
												name="phone_land"
												disabled={this.state.submitting}
												placeholder="Telefon Numarası"
												mask="(199) 999 99 99"
												validation={{
													required: "Telefon numaranızı girmelisiniz.",
													minLength: ["Geçerli bir telefon numarası girmelisiniz.", 15]
												}}
												popLabel />
										</div>
										<div className="grid-col x6 m-x12">
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
									<div className="grid-row">
										<div className="grid-col x12">
											<FormInput
												type="textarea"
												name="address"
												placeholder="Adres"
												validation={"Bir adres girmelisiniz."}
												popLabel />
										</div>
									</div>
									<div className="grid-row">
										<div className="grid-col x6 m-x12">
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
										<div className="grid-col x6 m-x12">
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
									<div className="grid-row">
										<div className={"grid-col x6 m-x12 inputwrap" + ((!this.state.selectedBrands.length && this.state.touched) ? ' error' : '')}>
											<FormInput
												className="high brands"
												type="select"
												name="brand-selector"
												placeholder="Marka ya da markalar seçiniz."
												options={(this.state.availableBrands ? this.state.availableBrands : undefined)}
												disabled={!this.state.availableBrands}
												value={false}
												onChange={this.addBrand}
												popLabel />
											{(!this.state.selectedBrands.length && this.state.touched) &&
												<div className="input-error">Marka seçiniz.</div>
											}
										</div>
									</div>
									<div className="grid-row">
										<div className="grid-col x12 form-opts">
											<div className="opts-inner">
												{this.state.selectedBrands.map((brand, nth) => (
													<span className="opts-item" key={nth}>
														<input type="hidden" name="brands[]" value={brand.value} />
														{brand.label}
														<button type="button" onClick={() => {this.removeBrand(brand.value)}}><i className="icon-close"></i></button>
													</span>
												))}
											</div>
										</div>
									</div>
									<div className="grid-row">
										<div className="grid-col x12">
											<FormInput
												type="checkbox"
												className="form-agreement"
												name="agreement"
												value={this.state.agreementSelected}
												validation={"Kullanıcı sözleşmesini kabul etmelisiniz."}
												onChange={this.agreementChanged}>
													"Formu Gönder" butonuna tıklayarak Minoto'nun <button type="button" className="check-link" onClick={() => { openModal('text', {content: agreement, title: "Ön Bilgilendirme Koşulları"})}}>Kullanıcı Sözleşmesi</button>'ni kabul etmiş sayılacaksınız.
												</FormInput>
										</div>
									</div>
									<div className="grid-row">
										<div className="grid-col x12 center">
											<Btn
												type="submit"
												uppercase
												block
												disabled={this.state.submitting}
												status={this.state.submitting && 'loading'}
												onClick={() => {this.setState({touched: true})}}
												className="form-submitbtn">
												Formu Gönder
											</Btn>
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