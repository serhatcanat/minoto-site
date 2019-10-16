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
			success: false,
			touched: false,
			promoChecked: false,
			email: "-",
		}

		//this._registerUser = this._registerUser.bind(this);
		this.submit = this.submit.bind(this);
	}

	submit(e) {
		let vm = this;

		vm.setState({
			loading: true,
		});

		register(e.target, function (payload) {
			vm.setState({
				success: payload.success,
				loading: false,
				message: payload.message,
				email: e.target.elements.email.value,
			});

			/*if (payload.success) {
				setTimeout(function () {
					closeModal();
				}, 1000);
			}*/
		});
	}

	render() {
		let vm = this;
		return (
			<div className={"section loginform type-" + vm.props.type}>
				{vm.state.success ?
					<React.Fragment>
						<h2 className="loginform-title">Üyelik kaydınız oluşturuldu</h2>
						<div className="loginform-info wysiwyg">
							<p>Şimdi tek yapmanız gereken <strong>{vm.state.email}</strong> adresine gönderdiğimiz e-postayı açarak e-posta adresinizi onaylamak.</p>
							<p><strong>Onay e-postası elinize ulaşmadıysa:</strong></p>
							<ul>
								<li>Spam klasörünü kontrol ediniz.</li>
								<li>Girdiğiniz e-posta adresini kontrol ediniz.</li>
								<li>Eğer hala e-posta elinize ulaşmadıysa tekrar deneyiniz.</li>
							</ul>
						</div>
						<div className="loginform-nav center">
							<button type="button" className="nav-btn" onClick={closeModal}>Kapat</button>
						</div>
					</React.Fragment>
					:
					<React.Fragment>
						<h2 className="loginform-title">Üye ol</h2>
						<InputForm className="loginform-form" onSubmit={this.submit} onTouch={() => { vm.setState({ touched: true }) }}>
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
								autoComplete="name"
								validation={{ required: "Adınızı ve soyadınızı girmelisiniz.", minLength: ["Çok kısa bir ad-soyad girdiniz", 5] }}
								className="form-field" />
							<FormInput
								name="email"
								disabled={vm.state.loading}
								type="email"
								label="E-Posta"
								autoComplete="email"
								validation={{ required: "E-posta adresinizi girmelisiniz.", email: true }}
								className="form-field" />
							<FormInput
								name="password"
								id="register-password"
								disabled={vm.state.loading}
								type="password"
								label="Şifre"
								autoComplete="new-password"
								validation={{ required: "Şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Girdiğiniz şifreler uyumlu değil.", "#register-password-repeat"] }}
								className="form-field" />
							<FormInput
								name="password_repeat"
								id="register-password-repeat"
								disabled={vm.state.loading}
								type="password"
								label="Şifre Tekrar"
								autoComplete="new-password"
								validation={{ required: "Şifrenizi girmelisiniz.", minLength: ["Şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Girdiğiniz şifreler uyumlu değil.", "#register-password"] }}
								className="form-field" />
							<FormInput
								name="agreement"
								value="1"
								disabled={vm.state.loading}
								type="checkbox"
								validation={{ required: "Üye olmak için kullanıcı sözleşmesini kabul etmeniz gerekmektedir." }}
								className="form-field">
								"Üye Ol" butonuna tıklayarak Minoto’nun <Link className="field-link text-minoto" href="privacy" target="_blank" rel="noopener noreferrer">Kullanıcı Sözleşmesi</Link>’ni kabul etmiş sayılacaksınız.
							</FormInput>
							<FormInput
								name="promotions"
								value="1"
								disabled={vm.state.loading}
								type="checkbox"
								onChange={(e) => { vm.setState({ promoChecked: e }) }}
								className="form-field">
								Size özel kampanya ve fırsatlarımızdan haberdar olabilirsiniz.
							</FormInput>
							{vm.state.touched && !vm.state.promoChecked &&
								<div className="form-fakeerror inputwrap">
									<div className="input-error">Size özel fiyat tekliflerinden yararlanmak istemez misiniz?</div>
								</div>
							}
							<Btn
								className="form-field"
								type="submit"
								disabled={vm.state.loading}
								loading={vm.state.loading}
								block uppercase light>Üye Ol</Btn>
						</InputForm>
						<div className="loginform-nav">
							<span>
								Zaten üye misiniz? <button type="button" className="nav-btn" onClick={() => { vm.goToLogin() }}>Giriş Yap</button>
							</span>
						</div>
					</React.Fragment>
				}
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