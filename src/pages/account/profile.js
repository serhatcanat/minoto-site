import React from 'react'

// Partials
import Btn from 'components/partials/btn'
import Image from 'components/partials/image'
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import { connect } from "react-redux"
import { openModal } from 'functions/modals'
import { serializeArray } from "functions/helpers";

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
		}

		this.birthDates = [];
		for(let k = 1900; k <= new Date().getFullYear() - 12; k++){
			this.birthDates.push({value: k, label: k.toString()});
		}

		this.saveData = this.saveData.bind(this);
		this.deleteAccount = this.deleteAccount.bind(this);
	}

	deleteAccount() {
		openModal({
			action: 'confirm',
			title: 'Hesap kaldırma',
			question: 'Hesabınızı tüm bilgileriyle birlikte silmek istediğinizden emin misiniz?',
			onConfirm: () => { console.log('silindi..'); }
		});
	}

	saveData(e) {
		let vm = this;
		// Form Data:
		console.log(serializeArray(e.target));
		this.setState({
			submitting: true,
		});

		setTimeout(function() {
			vm.setState({submitting: false})
		}, 1000);
	}

	render () {
		let vm = this;
		let user = vm.props.user;
		return (
			<section className="section account-profile">
				<div className="profile-wrap wrapper narrow">
					<aside className="profile-sum">
						<Image className="sum-image" bg src={(user.avatar ? user.avatar : image_avatar)} />
						<h1 className="sum-name">{user.name}</h1>
						<p className="sum-location"><i className="icon-marker"></i> {user.location}</p>

						<div className="sum-completion">
							<div className="completion-bar">
								<div className="bar-progress" style={{width: user.profileCompletion+'%'}}></div>
							</div>

							<div className="completion-status">Profiliniz <span>%{user.profileCompletion}</span> dolu</div>
						</div>
					</aside>

					<InputForm className="profile-form" onSubmit={vm.saveData}>
						<div className="form-group">
							<h2 className="form-title">Üyelik Bilgileri</h2>
							<FormInput
								name="name"
								disabled={vm.state.submitting}
								value={user.name + ' ' + user.surname}
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
								className="form-inputwrap" />
							<FormInput name="password" type="password" className="form-inputwrap" disabled={vm.state.submitting} label="Şifre" />
							<Btn className="form-submit" type="submit" wide light text uppercase big status={vm.state.submitting && 'loading'} disabled={vm.state.submitting}>Güncelle</Btn>
						</div>
						<div className="form-group">
							<h2 className="form-title">Kişisel Bilgiler</h2>
							<FormInput name="gender" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Cinsiyet" options={[{value: "f", label: "Kadın"}, {value: "m",  label: "Erkek"}]} placeholder="Seçiniz" />
							<FormInput name="age" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<FormInput name="age1" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<FormInput name="age2" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<FormInput name="age3" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<FormInput name="age4" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<Btn className="form-submit" type="submit" wide light text uppercase big status={vm.state.submitting && 'loading'} disabled={vm.state.submitting}>Güncelle</Btn>
						</div>

						<button className="form-delete" type="button" onClick={vm.deleteAccount}>Hesabımı sil</button>
					</InputForm>
				</div>
			</section>
		)
	}
}

export default connect(mapStateToProps)(Profile);