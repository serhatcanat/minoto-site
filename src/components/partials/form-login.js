import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'

// Deps
import { openModal } from 'functions/modals'
import { redirect } from 'controllers/navigator'
//import { submitLogin } from "data/store.user"

export default class LoginForm extends React.Component {
	render() {
		let vm = this;
		return (
			<div className={"section loginform type-" + vm.props.type}>
				<h2 className="loginform-title">Giriş yap</h2>

				<InputForm className="loginform-form">
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
				<div className="loginform-nav">
					<button type="button" className="nav-btn" onClick={()  => {vm.goToRecovery()}}>Şifremi unuttum</button>
					<button type="button" className="nav-btn" onClick={() => {vm.goToRegister()}} >Üye ol</button>
				</div>

				<div className="loginform-others">
					<div className="others-seperator"><span>veya</span></div>

					<Btn className="others-opt" hollow block light uppercase>Üye Ol</Btn>
					<Btn className="others-opt facebook" icon="facebook" block>Facebook ile Giriş Yapın</Btn>
					<Btn className="others-opt google" icon="google" block>Google ile Giriş Yapın</Btn>
				</div>
			</div>
		)
	}

	goToRecovery() {
		if(this.props.type === "self"){
			redirect('account.recovery');
		}
		else {
			openModal('recovery')
		}
	}

	goToRegister() {
		if(this.props.type === "self"){
			redirect('account.register');
		}
		else {
			openModal('register')
		}
	}
}

LoginForm.defaultProps = {
	type: "self"
}