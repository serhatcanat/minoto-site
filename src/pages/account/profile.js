import React from 'react'

// Partials
import Btn from 'components/partials/btn'
import Image from 'components/partials/image'
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import { connect } from "react-redux"

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
	}

	saveData(e) {
		console.log(e);
		this.setState({
			submitting: true,
		});
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
							<FormInput name="name" className="form-inputwrap" disabled={vm.state.submitting} value={user.name + ' ' + user.surname} label="Ad ve soyad" />
							<FormInput name="email" className="form-inputwrap" disabled={vm.state.submitting} value={user.email} label="E-posta" />
							<FormInput name="phone" className="form-inputwrap" disabled={vm.state.submitting} label="Cep telefonu" />
							<FormInput name="password" type="password" className="form-inputwrap" disabled={vm.state.submitting} label="Şifre" />
							<Btn className="form-submit" type="submit" wide light text uppercase big status={vm.state.submitting && 'loading'} disabled={vm.state.submitting}>Güncelle</Btn>
						</div>
						<div className="form-group">
							<h2 className="form-title">Kişisel Bilgiler</h2>
							<FormInput name="gender" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Cinsiyet" options={[{value: "f", label: "Kadın"}, {value: "m",  label: "Erkek"}]} placeholder="Seçiniz" />
							<FormInput name="gender" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<FormInput name="gender" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<FormInput name="gender" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<FormInput name="gender" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<FormInput name="gender" type="select" className="form-inputwrap" disabled={vm.state.submitting} label="Doğum Yılı" value={{value: 1991, label: "1991"}} options={vm.birthDates} placeholder="Seçiniz" />
							<Btn className="form-submit" type="submit" wide light text uppercase big status={vm.state.submitting && 'loading'} disabled={vm.state.submitting}>Güncelle</Btn>
						</div>

						<button className="form-delete" type="button" onClick={() => {console.log('hesap silme modalı')}}>Hesabımı sil</button>
					</InputForm>
				</div>
			</section>
		)
	}
}

export default connect(mapStateToProps)(Profile);