import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'
import Link from 'components/partials/link'

// Deps
import { openModal, closeModal } from 'functions/modals'
import { redirect } from 'controllers/navigator'
import { register } from "data/store.user"

export default class RegisterForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			message: false,
			complete: false,
			success: null,
		}

		//this._registerUser = this._registerUser.bind(this);
		this.submit = this.submit.bind(this);
	}

	/*
	_registerUser = (e) => {

		let record = {
			name: e.target.elements.name.value,
			email: e.target.elements.email.value,
			password: e.target.elements.password.value,
			password_repeat: e.target.elements.password_repeat.value
		};


		axios
			.post(apiPath('user/register'), record)
			.then(response => {
				console.log(response);
				return response;
			})
			.then(json => {
				if (json.data.payload.success) {
					alert(`Registration Successful!`);
					const { name, id, email, auth_token } = json.data.payload;
					let userData = {
						name,
						id,
						email,
						auth_token,
						timestamp: new Date().toString()
					};
					let appState = {
						isLoggedIn: true,
						user: userData
					};
					// save app state with user date in local storage
					localStorage["appState"] = JSON.stringify(appState);
					this.setState({
						isLoggedIn: appState.isLoggedIn,
						user: appState.user
					});
					// redirect home
					//this.props.history.push("/");
				} else {
					alert(`Registration Failed!`);

				}
			})
			.catch(error => {
				alert("An Error Occured!" + error);
				console.log(`${record} ${error}`);

			});
	};
	*/

	submit(e) {
		let vm = this;
		alert('me')

		vm.setState({
			loading: true,
		})

		register(e.target, function (payload) {
			vm.setState({
				success: payload.success,
				loading: false,
				message: payload.message,
			});

			if (payload.success) {
				setTimeout(function () {
					closeModal();
				}, 1000);
			}
		});
	}

	render() {
		let vm = this;
		return (
			<div className={"section loginform type-" + vm.props.type}>
				<h2 className="loginform-title">Üye ol</h2>

				<InputForm className="loginform-form" onSubmit={this.submit}>
					{vm.state.message &&
						<div className={"loginform-message " + (vm.state.success ? 'success' : 'error')}>
							<span>{vm.state.message}</span>
						</div>
					}
					<FormInput
						name="name"
						disabled={vm.state.loading}
						type="text"
						label="Ad-Soyad"
						validation={{ required: "Adınızı ve soyadınızı girmelisiniz.", minLength: ["Çok kısa bir ad-soyad girdiniz", 5] }}
						className="form-field" />
					<FormInput
						name="email"
						disabled={vm.state.loading}
						type="email"
						label="E-Posta"
						validation={{ required: "E-posta adresinizi girmelisiniz.", email: true }}
						className="form-field" />
					<FormInput
						name="password"
						id="register-password"
						disabled={vm.state.loading}
						type="password"
						label="Şifre"
						validation={{ required: "Şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Girdiğiniz şifreler uyumlu değil.", "#register-password-repeat"] }}
						className="form-field" />
					<FormInput
						name="password_repeat"
						id="register-password-repeat"
						disabled={vm.state.loading}
						type="password"
						label="Şifre Tekrar"
						validation={{ required: "Şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Girdiğiniz şifreler uyumlu değil.", "#register-password"] }}
						className="form-field" />
					<FormInput
						name="agreement"
						disabled={vm.state.loading}
						type="checkbox"
						//validation={{ required: "Üye olmak için kullanıcı sözleşmesini kabul etmeniz gerekmektedir." }}
						className="form-field">
						"Üye Ol" butonuna tıklayarak Minoto’nun <Link className="text-minoto" href="privacy" target="_blank" rel="noopener noreferrer">Kullanıcı Sözleşmesi’ni</Link> kabul etmiş sayılacaksınız.
					</FormInput>
					<FormInput
						name="agreement"
						disabled={vm.state.loading}
						type="checkbox"
						className="form-field">
						Size özel kampanya ve fırsatlarımızdan haberdar olabilirsiniz.
					</FormInput>
					<Btn
						className="form-field"
						type="submit"
						disabled={vm.state.loading}
						loading={vm.state.loading}
						block uppercase light>Üye Ol</Btn>
				</InputForm>
				<div className="loginform-nav">
					<span>
						Zaten üye misiniz? <button type="button" className="nav-btn" onClick={() => { vm.goToLogin() }} >Giriş Yap</button>
					</span>
				</div>
			</div>
		)
	}

	goToLogin() {
		if (this.props.type === "self") {
			redirect('account.login');
		}
		else {
			openModal('login')
		}
	}
}

RegisterForm.defaultProps = {
	type: "self"
}