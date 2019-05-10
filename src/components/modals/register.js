import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'

// Deps
import { openModal } from 'functions/modals'

export default class LoginModal extends React.Component {
	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<h2 className="login-title">Üye ol</h2>

					<InputForm className="login-form">
						<FormInput
							name="name"
							type="text"
							label="Ad-Soyad"
							validation={{required: "Adınızı ve soyadınızı girmelisiniz.", minLength: ["Çok kısa bir ad-soyad girdiniz", 5]}}
							className="form-field" />
						<FormInput
							name="email"
							type="email"
							label="E-Posta"
							validation={{required: "E-posta adresinizi girmelisiniz.", email: true}}
							className="form-field" />
						<FormInput 
							name="password"
							type="password"
							label="Şifre"
							validation={{required: "Şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Şifreler uyumlu değildir.", "#register-password"]}}
							className="form-field" />
						<FormInput 
							name="password_repeat"
							type="password"
							label="Şifre Tekrar"
							validation={{required: "Şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Şifreler uyumlu değildir.", "#register-password"]}}
							className="form-field" />
						<FormInput
							name="agreement"
							type="checkbox"
							validation={{required: "Üye olmak için kullanıcı sözleşmesini kabul etmeniz gerekmektedir."}}
							className="form-field">
							"Üye Ol" butonuna tıklayarak Minoto’nun Kullanıcı Sözleşmesi’ni kabul etmiş sayılacaksınız.
						</FormInput>
						<FormInput
							name="agreement"
							type="checkbox"
							className="form-field">
							Size özel kampanya ve fırsatlarımızdan haberdar olabilirsiniz.
						</FormInput>
						<Btn className="form-field" type="submit" block uppercase light>Üye Ol</Btn>
					</InputForm>
					<div className="login-nav">
						<span>
							Zaten üye misiniz? <button type="button" className="nav-btn" onClick={() => {openModal('login')}} >Giriş Yap</button>
						</span>
					</div>
				</div>
			</div>
		)
	}
}

LoginModal.defaultProps = {
	className: "",
	containerClass: "modal-login register",
	name: "register"
}