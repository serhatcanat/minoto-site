import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'

// Deps
import { openModal } from 'functions/modals'
import { redirect } from 'controllers/navigator'
import { serializeArray } from "functions/helpers";
import request from 'controllers/request'

export default class RecoveryForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submitting: false,
			complete: false,
			email: false,
			message: false,
		}

		this.submit = this.submit.bind(this);
		this.reset = this.reset.bind(this);
	}

	submit(e) {
		let vm = this;

		let formData = serializeArray(e.target);

		this.setState({
			submitting: true,
			email: formData.email,
		});

		request.get('users/forgot-password/'+formData.email, {}, function(payload){
			if(payload && payload.success){
				vm.setState({
					submitting: false,
					complete: true,
				});
			}
			else{
				vm.setState({
					submitting: false,
					message: (payload && payload.message) ? payload.message : false,
				});
			}
		});
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
						{vm.state.message &&
							<div className={"loginform-message " + (vm.state.success ? 'success' : 'error')}>
								<span>{vm.state.message}</span>
							</div>
						}
						<FormInput
							name="email"
							type="email"
							label="E-Postanızı giriniz"
							disabled={vm.state.submitting}
							validation={{required: "E-posta adresinizi girmelisiniz", email: true}}
							className="form-field" />
						<Btn
							className="form-field"
							block uppercase light
							loading={vm.state.submitting}
							disabled={vm.state.submitting}
							type="submit">
							Şifremi Sıfırla
						</Btn>
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