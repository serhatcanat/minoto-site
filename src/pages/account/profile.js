import React from 'react'

// Partials
import Btn from 'components/partials/btn'
import Image from 'components/partials/image'
import { InputForm, FormInput } from 'components/partials/forms'
import MyAvatar from 'components/partials/avatar-editor'


// Deps
import { connect } from "react-redux"
import { openModal } from 'functions/modals'
import { storageSpace } from "functions/helpers";
import { logout } from "data/store.user"
import request from 'controllers/request'




// Assets
import image_avatar from 'assets/images/defaults/avatar.svg';

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};


class Profile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			submitting: false,
			results: false
		}

		this.saveData = this.saveData.bind(this);
		this.deleteAccount = this.deleteAccount.bind(this);
		this.initialize = this.initialize.bind(this);
	}

	initialize() {
		let vm = this;


		request.get(`users/profile/${vm.props.user.email}`, null, function (payload, status) {
			if (payload) {
				vm.setState({
					results: payload,
					loading: false,
				});
			}
		});

	}

	componentDidMount() {
		let vm = this;
		vm.initialize();
	}


	deleteAccount() {
		openModal('confirm', {
			title: 'Hesap kaldırma',
			question: 'Hesabınızı tüm bilgileriyle birlikte silmek istediğinizden emin misiniz?',
			onConfirm: () => { console.log('silindi..'); },
			reverse: true,
		});
	}

	saveData(e) {
		let vm = this;


		// Form Data:
		let record = {
			email: vm.props.user.email,
			name: e.target.elements.name.value,
			phone: e.target.elements.phone.value,
			gender: e.target.elements.gender.value,
			workStatus: e.target.elements.workStatus.value,
			maritalStatus: e.target.elements.maritalStatus.value,
			city: e.target.elements.city.value,
			educationStatus: e.target.elements.educationStatus.value,
			birthDate: e.target.elements.birthDate.value
		};



		this.setState({
			submitting: true,
		});


		request.post(`users/profile/update`, record, function (payload) {
			setTimeout(function () {
				vm.setState({ loading: false, submitting: true });
				setTimeout(function () {
					vm.setState({ loading: false, submitting: false });
				}, 100);
			}, 100);
		})

	}

	render() {
		let vm = this;
		let user = vm.props.user;
		let results = vm.state.results

		return (
			<React.Fragment>
				{
					results && (
						<section className="section account-profile">
							<div className="profile-wrap wrapper narrow">
								<aside className="profile-sum">


									<MyAvatar />
									<Image className="sum-image" bg src={(user.avatar ? storageSpace('profile-photos', user.avatar) : image_avatar)} />
									<div className="sum-content">
										<div className="content-bio">
											<h1 className="bio-name">{user.name}</h1>
											{user.location &&
												<p className="bio-location"><i className="icon-marker"></i> {user.location}</p>
											}
										</div>

										<div className="content-completion">
											<div className="completion-bar">
												<div className="bar-progress" style={{ width: results.profile.profileCompletion + '%' }}></div>
											</div>

											<div className="completion-status">Profiliniz <span>%{results.profile.profileCompletion}</span> dolu</div>
										</div>

										<button className="content-logout" onClick={logout}>Çıkış Yap</button>
									</div>
								</aside>

								<InputForm className="profile-form" onSubmit={vm.saveData}>
									<div className="form-group">
										<h2 className="form-title">Üyelik Bilgileri</h2>
										<FormInput
											name="name"
											disabled={vm.state.submitting}
											value={user.name}
											label="Ad ve soyad"
											validation={{
												required: "Adınızı ve soyadınızı girmelisiniz.",
												minLength: ["Çok kısa bir ad-soyad girdiniz", 5]
											}}
											className="form-inputwrap" />
										<FormInput name="email" className="form-inputwrap" disabled={vm.state.submitting} value={user.email} label="E-posta" />
										<FormInput
											name="phone"
											disabled={vm.state.submitting}
											label="Cep telefonu"
											mask="(199) 999 99 99"
											validation={{
												required: "Telefon numaranızı girmelisiniz.",
												minLength: ["Geçerli bir telefon numarası girmelisiniz.", 15]
											}}
											className="form-inputwrap"
											value={results.profile.phone} />
										{/*<FormInput name="password" type="password" className="form-inputwrap" disabled={vm.state.submitting} label="Şifre" />*/}
										<Btn className="form-submit" type="submit" wide light text uppercase big status={vm.state.submitting && 'loading'} disabled={vm.state.submitting}>Güncelle</Btn>
									</div>
									<div className="form-group">
										<h2 className="form-title">Kişisel Bilgiler</h2>
										<FormInput name="gender" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Cinsiyet" value={results.profile.gender ? { value: results.profile.gender.value, label: results.profile.gender.label } : ''} options={results.genders} placeholder="Seçiniz" />
										<FormInput name="workStatus" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Çalışma Durumu" value={results.profile.workState ? { value: results.profile.workState.value, label: results.profile.workState.label } : ''} options={results.workStates} placeholder="Seçiniz" />
										<FormInput name="maritalStatus" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Medeni Hali" value={results.profile.maritalState ? { value: results.profile.maritalState.value, label: results.profile.maritalState.label } : ''} options={results.maritalStates} placeholder="Seçiniz" />
										<FormInput name="city" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Yaşadığı Şehir" value={results.profile.city ? { value: results.profile.city.value, label: results.profile.city.label } : ''} options={results.cities} placeholder="Seçiniz" />
										<FormInput name="educationStatus" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Eğitim Durumu" value={results.profile.educationState ? { value: results.profile.educationState.value, label: results.profile.educationState.label } : ''} options={results.educationStates} placeholder="Seçiniz" />
										<FormInput name="birthDate" type="date" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Tarihi" value={results.profile.birthDate ? results.profile.birthDate : ''} placeholder="Seçiniz" />
										<Btn className="form-submit" type="submit" wide light text uppercase big status={vm.state.submitting && 'loading'} disabled={vm.state.submitting}>Güncelle</Btn>
									</div>

									{/*<button className="form-delete" type="button" onClick={vm.deleteAccount}>Hesabımı sil</button>*/}
								</InputForm>
							</div>
						</section>
					)
				}
			</React.Fragment>
		)
	}
}

export default connect(mapStateToProps)(Profile);