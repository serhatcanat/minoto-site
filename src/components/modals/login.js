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
					<h2 className="login-title">Giriş yap</h2>

					<InputForm className="login-form">
						<FormInput
							name="email"
							type="email"
							label="E-Posta"
							validation={{required: "E-posta adresinizi girmelisiniz", email: true}}
							className="form-field" />
						<FormInput 
							name="password"
							type="password"
							label="Şifre"
							validation={{required: "Şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6]}}
							className="form-field" />
						<Btn className="form-field" type="submit" block uppercase light>Giriş Yap</Btn>
					</InputForm>
					<div className="login-nav">
						<button type="button" className="nav-btn" onClick={()  => {openModal('recovery')}}>Şifremi unuttum</button>
						<button type="button" className="nav-btn" onClick={() => {openModal('register')}} >Üye ol</button>
					</div>

					<div className="login-others">
						<div className="others-seperator"><span>veya</span></div>

						<Btn className="others-opt" hollow block light uppercase>Üye Ol</Btn>
						<Btn className="others-opt facebook" icon="facebook" block>Facebook ile Giriş Yapın</Btn>
						<Btn className="others-opt google" icon="google" block>Google ile Giriş Yapın</Btn>
					</div>
				</div>
			</div>
		)
	}
}

LoginModal.defaultProps = {
	className: "",
	containerClass: "modal-login",
	name: "login"
}