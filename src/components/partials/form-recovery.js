import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'

// Deps
import { openModal } from 'functions/modals'
import { redirect } from 'controllers/navigator'
import { serializeArray } from "functions/helpers";

export default class RecoveryForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submitting: false,
			complete: false,
			email: false,
		}

		this.submit = this.submit.bind(this);
		this.reset = this.reset.bind(this);
	}

	submit(e) {
		let vm = this;
		// Form Data:
		let data = serializeArray(e.target);
		console.log(serializeArray(e.target));
		this.setState({
			submitting: true,
			email: data.email,
		});

		setTimeout(function() {
			vm.setState({
				submitting: false,
				complete: true
			})
		}, 1000)
	}

	reset() {
		this.setState({
			submitting:false,
			complete:false,
			email: false
		});
	}

	goToLogin() {
		if(this.props.type === "self"){
			redirect('account.login');
		}
		else {
			openModal('login')
		}
	}

	render() {
		let vm = this;
		if(vm.state.complete){
			return (
				<div className={"section loginform type-" + vm.props.type}>
					<h2 className="loginform-title">Şifrenizi Yenileyin</h2>

					<div className="loginform-info wysiwyg">
						<p><strong>{vm.state.email} adresine şifre yenileme linkiniz gönderilmiştir.</strong></p>
						<p><strong>Şifre Yenileme e-postası elinize ulaşmadıysa:</strong></p>
						<ul>
							<li>Spam klasörünü kontrol ediniz.</li>
							<li>Girdiğiniz e-posta adresini kontrol ediniz.</li>
							<li>Eğer hala e-posta elinize ulaşmadıysa tekrar deneyiniz.</li>
						</ul>
					</div>
					<div className="loginform-nav center">
						<button type="button" className="nav-btn" onClick={this.reset}><i className="icon-arrow-left"></i> Geri Dön</button>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className={"section loginform type-" + vm.props.type}>
					<h2 className="loginform-title">Şifremi Unuttum</h2>

					<InputForm className="loginform-form" onSubmit={vm.submit}>
						<FormInput
							name="email"
							type="email"
							label="E-Postanızı giriniz"
							validation={{required: "E-posta adresinizi girmelisiniz", email: true}}
							className="form-field" />
						<Btn className="form-field" type="submit" block uppercase light loading={vm.state.submitting} disabled={vm.state.submitting}>Şifremi Sıfırla</Btn>
					</InputForm>
					<div className="loginform-nav center">
						<button type="button" className="nav-btn" onClick={() => { vm.goToLogin() }}><i className="icon-arrow-left"></i> Geri Dön</button>
					</div>
				</div>
			)
		}
	}
}

RecoveryForm.defaultProps = {
	type: "self"
}