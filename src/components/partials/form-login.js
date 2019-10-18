import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
import defaults from "data/config"
//import axios from "axios";
// Deps
import { openModal, closeModal } from 'functions/modals'
import { redirect } from 'controllers/navigator'
import { login, socialLogin } from "data/store.user"

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			message: false,
			complete: false,
			success: false,
		}

		//this._loginUser = this._loginUser.bind(this);
		this.submit = this.submit.bind(this);
		this.responseFacebook = this.responseFacebook.bind(this);
		this.responseGoogle = this.responseGoogle.bind(this);

		this._isMounted = false;
	}

	/*
	_loginUser = (e) => {
		let record = {
			email: e.target.elements.email.value,
			password: e.target.elements.password.value,
		};

		axios
			.post(apiPath('user/login'), record)
			.then(response => {
				console.log(response);
				return response;
			})
			.then(json => {
				console.log(json);
				if (json.data.success) {
					alert("Login Successful!");
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
				} else alert("Login Failed!");


			})
			.catch(error => {
				alert(`An Error Occured! ${error}`);

			});
	};
	*/

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	submit(e) {
		let vm = this;

		vm.setState({
			loading: true,
		})

		login(e.target, function (payload) {
			if(vm._isMounted){
				vm.setState({
					success: payload.success,
					loading: false,
					message: payload.message,
				});

				if (payload.success) {
					setTimeout(function () {
						if(vm._isMounted){
							closeModal();
						}
					}, 1000);
				}
			}
		});
	}

	responseFacebook(response) {
		//console.log(response)
		let vm = this;

		vm.setState({
			loading: true,
		});

		socialLogin(response, 'facebook', function (payload) {
			if(vm._isMounted){
				vm.setState({
					success: payload ? payload.success : false,
					loading: false,
					message: payload ? payload.message : 'Bir hata ile karşılaşıldı, lütfen tekrar deneyin.',
				});

				if (payload && payload.success) {
					setTimeout(function () {
						if(vm._isMounted){
							closeModal();
						}
					}, 1000);
				}
			}
		});
	}

	responseGoogle(response) {
		//console.log(response)
		let vm = this;

		vm.setState({
			loading: true,
		});

		socialLogin(response, 'google', function (payload) {
			if(vm._isMounted){
				vm.setState({
					success: payload ? payload.success : false,
					loading: false,
					message: payload ? payload.message : 'Bir hata ile karşılaşıldı, lütfen tekrar deneyin.',
				});

				if (payload && payload.success) {
					setTimeout(function () {
						if(vm._isMounted){
							closeModal();
						}
					}, 1000);
				}
			}
		});
	}

	render() {
		let vm = this;

		return (
			<div className={"section loginform type-" + vm.props.type}>
				<h2 className="loginform-title">Giriş yap</h2>

				<InputForm className="loginform-form" onSubmit={this.submit}>
					{vm.state.message &&
						<div className={"loginform-message " + (vm.state.success ? 'success' : 'error')}>
							<span>{vm.state.message}</span>
						</div>
					}
					<FormInput
						name="email"
						type="email"
						label="E-Posta"
						autoComplete="email"
						disabled={vm.state.loading}
						validation={{ required: "E-posta adresinizi girmelisiniz", email: true }}
						className="form-field" />
					<FormInput
						name="password"
						type="password"
						label="Şifre"
						autoComplete="current-password"
						disabled={vm.state.loading}
						validation={{ required: "Şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6] }}
						className="form-field" />
					<Btn
						className="form-field"
						type="submit"
						disabled={vm.state.loading}
						loading={vm.state.loading}
						block uppercase light>Giriş Yap</Btn>
				</InputForm>
				<div className="loginform-nav">
					<button type="button" className="nav-btn" onClick={() => { vm.goToRecovery() }}>Şifremi unuttum</button>
					{/*<button type="button" className="nav-btn" onClick={() => { vm.goToRegister() }}>Üye ol</button>*/}
				</div>

				<div className="loginform-others">
					<div className="others-seperator"><span>veya</span></div>

					<Btn className="others-opt" hollow block light uppercase onClick={() => { vm.goToRegister() }}>Üye Ol</Btn>
					<FacebookLogin
						appId={defaults.fClient}
						fields="name,email,picture"
						callback={this.responseFacebook}
						render={renderProps => (
							<Btn onClick={renderProps.onClick} className="others-opt facebook" icon="facebook" block>Facebook ile Giriş Yapın</Btn>
						)}
					/>
					<GoogleLogin
						clientId={defaults.gClient}
						buttonText="LOGIN WITH GOOGLE"
						onSuccess={this.responseGoogle}
						onFailure={this.responseGoogle}
						render={renderProps => (
							<Btn className="others-opt google" onClick={renderProps.onClick} icon="google" block>Google ile Giriş Yapın</Btn>
						)}
					/>
				</div>
			</div>
		)
	}

	goToRecovery() {
		if (this.props.type === "self") {
			redirect('account.recovery');
		}
		else {
			openModal('recovery')
		}
	}

	goToRegister() {
		if (this.props.type === "self") {
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
