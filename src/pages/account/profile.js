import React from 'react'

// Partials
import Btn from 'components/partials/btn'
import Image from 'components/partials/image'
import { InputForm, FormInput } from 'components/partials/forms'
import MyAvatar from 'components/partials/avatar-editor'

// Deps
import { connect } from "react-redux"
import { openModal } from 'functions/modals'
import { storageSpace, serializeArray } from "functions/helpers";
import { logout, updateUserToken } from "data/store.user"
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
			loading: true,
			submitting: false,
			userData: false,
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
					userData: payload,
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
				vm.setState({ submitting: true });
				setTimeout(function () {
					vm.setState({ submitting: false });
				}, 100);
			}, 100);
		})
	}

	render() {
		let vm = this;
		let user = vm.props.user;
		let userData = vm.state.userData

		return (
			<React.Fragment>
				{
					userData && (
						<section className="section account-profile">
							<div className="profile-wrap wrapper narrow">
								<aside className="profile-sum">
									<Image className="sum-image" bg src={(user.avatar ? storageSpace('profile-photos', user.avatar) : image_avatar)} />
									<div className="sum-content">
										<div className="content-bio">
											<h1 className="bio-name">{user.name}</h1>
											{user.location &&
												<p className="bio-location"><i className="icon-marker"></i> {user.location}</p>
											}
										</div>

										{userData.profile.profileCompletion &&
											<div className="content-completion">
												<div className="completion-bar">
													<div className="bar-progress" style={{ width: userData.profile.profileCompletion + '%' }}></div>
												</div>

												<div className="completion-status">Profiliniz <span>%{userData.profile.profileCompletion}</span> dolu</div>
											</div>
										}

										<button className="content-logout" onClick={logout}>Çıkış Yap</button>
									</div>
								</aside>

								<div className="profile-form">
									<InputForm className="form-section" onSubmit={vm.saveData}>
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

												className="form-inputwrap"
												value={userData.profile.phone} />

											<Btn className="form-submit" type="submit" wide light text uppercase big status={vm.state.submitting && 'loading'} disabled={vm.state.submitting}>Bilgilerimi Güncelle</Btn>
										</div>

										<div className="form-group">
											<h2 className="form-title">Kişisel Bilgiler</h2>
											<FormInput
												name="gender"
												type="select"
												className="form-inputwrap"
												disabled={vm.state.submitting}
												label="Cinsiyet"
												value={userData.profile.gender ? { value: userData.profile.gender.value, label: userData.profile.gender.label } : ''}
												options={userData.genders}
												placeholder="Seçiniz" />

											<FormInput
												name="workStatus"
												type="select"
												className="form-inputwrap"
												disabled={vm.state.submitting}
												label="Çalışma Durumu"
												value={userData.profile.workState ? { value: userData.profile.workState.value, label: userData.profile.workState.label } : ''}
												options={userData.workStates}
												placeholder="Seçiniz" />

											<FormInput
												name="maritalStatus"
												type="select"
												className="form-inputwrap"
												disabled={vm.state.submitting}
												label="Medeni Hali"
												value={userData.profile.maritalState ? { value: userData.profile.maritalState.value, label: userData.profile.maritalState.label } : ''}
												options={userData.maritalStates}
												placeholder="Seçiniz" />

											<FormInput
												name="city"
												type="select"
												className="form-inputwrap"
												disabled={vm.state.submitting}
												label="Yaşadığı Şehir"
												value={userData.profile.city ? { value: userData.profile.city.value, label: userData.profile.city.label } : ''}
												options={userData.cities}
												placeholder="Seçiniz" />

											<FormInput
												name="educationStatus"
												type="select"
												className="form-inputwrap"
												disabled={vm.state.submitting}
												label="Eğitim Durumu"
												value={userData.profile.educationState ? { value: userData.profile.educationState.value, label: userData.profile.educationState.label } : ''}
												options={userData.educationStates}
												placeholder="Seçiniz" />

											<FormInput
												name="birthDate"
												type="date"
												className="form-inputwrap"
												disabled={vm.state.submitting}
												label="Doğum Tarihi"
												value={userData.profile.birthDate ? userData.profile.birthDate : ''}
												placeholder="Seçiniz" />

											<Btn
												className="form-submit"
												type="submit"
												wide light text uppercase big
												status={vm.state.submitting && 'loading'}
												disabled={vm.state.submitting}>
												Bilgilerimi Güncelle
											</Btn>
										</div>
									</InputForm>

									{false &&
										<PasswordForm />}

									<InputForm className="form-section">
										<div className="form-group">
											<h2 className="form-title">Profil Fotoğrafı</h2>
											<MyAvatar />
										</div>

										{/*<button className="form-delete" type="button" onClick={vm.deleteAccount}>Hesabımı sil</button>*/}
									</InputForm>
								</div>
							</div>
						</section>
					)
				}
			</React.Fragment>
		)
	}
}

class PasswordForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			error: false,
			message: false,
			submitting: false,
		}

		this.saveData = this.saveData.bind(this);

		this.form = React.createRef();
	}

	saveData(e) {
		let vm = this;

		vm.setState({
			submitting: true,
		});

		request.post(`user/change-password`, serializeArray(e.target), function (payload) {
			let message = false;
			let error = false;

			if (payload) {
				error = !payload.success;
				message = payload.message;

				if (payload.success && vm.form.current) {
					vm.form.current.reset();

					updateUserToken(payload.auth_token);
				}
			}
			else {
				error = true;
				message = 'Şifreniz değiştirilirken bir hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyin.';
			}

			vm.setState({ submitting: false, error: error, message: message });
		})
	}

	render() {
		let vm = this;
		return (
			<InputForm className="form-section" onSubmit={vm.saveData} ref={vm.form}>
				<div className="form-group">
					<h2 className="form-title">Şifre Değişikliği</h2>
					{vm.state.message &&
						<div className={'form-message ' + (vm.state.error ? 'error' : 'success')}>
							<span>{vm.state.message}</span>
						</div>
					}
					<FormInput
						name="password"
						type="password"
						className="form-inputwrap"
						disabled={vm.state.submitting}
						validation={{ required: "Eski şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6] }}
						label="Eski Şifre" />

					<FormInput
						name="new_password"
						type="password"
						id="register-password"
						className="form-inputwrap"
						disabled={vm.state.submitting}
						validation={{ required: "Yeni şifrenizi girmelisiniz.", minLength: ["Yeni şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Girdiğiniz şifreler uyumlu değil.", "#register-password-repeat"] }}
						label="Yeni Şifre" />

					<FormInput
						name="new_password_repeat"
						type="password"
						id="register-password-repeat"
						className="form-inputwrap"
						disabled={vm.state.submitting}
						validation={{ required: "Yeni şifrenizi girmelisiniz.", minLength: ["Yeni şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Girdiğiniz şifreler uyumlu değil.", "#register-password"] }}
						label="Yeni Şifre (Tekrar)" />

					<Btn
						className="form-submit"
						type="submit"
						wide light text uppercase big
						status={vm.state.submitting && 'loading'}
						disabled={vm.state.submitting}>
						Şifremi Değiştir
					</Btn>
				</div>
			</InputForm>
		)
	}
}

export default connect(mapStateToProps)(Profile);