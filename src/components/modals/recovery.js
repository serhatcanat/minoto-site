import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'

// Deps
import { openModal } from 'functions/modals'
import { serializeArray } from "functions/helpers";

export default class LoginModal extends React.Component {
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

	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				{(vm.state.complete ?
					<div className="modal-innercontent">
						<h2 className="login-title">Şifrenizi Yenileyin</h2>

						<div className="login-info wysiwyg">
							<p><strong>{vm.state.email} adresine şifre yenileme linkiniz gönderilmiştir.</strong></p>
							<p><strong>Şifre Yenileme e-postası elinize ulaşmadıysa:</strong></p>
							<ul>
								<li>Spam klasörünü kontrol ediniz.</li>
								<li>Girdiğiniz e-posta adresini kontrol ediniz.</li>
								<li>Eğer hala e-posta elinize ulaşmadıysa tekrar deneyiniz.</li>
							</ul>
						</div>
						<div className="login-nav center">
							<button type="button" className="nav-btn" onClick={this.reset}><i className="icon-arrow-left"></i> Geri Dön</button>
						</div>
					</div>
				:
					<div className="modal-innercontent">
						<h2 className="login-title">Şifremi Unuttum</h2>

						<InputForm className="login-form" onSubmit={vm.submit}>
							<FormInput
								name="email"
								type="email"
								label="E-Postanızı giriniz"
								validation={{required: "E-posta adresinizi girmelisiniz", email: true}}
								className="form-field" />
							<Btn className="form-field" type="submit" block uppercase light loading={vm.state.submitting} disabled={vm.state.submitting}>Şifremi Sıfırla</Btn>
						</InputForm>
						<div className="login-nav center">
							<button type="button" className="nav-btn" onClick={() => {openModal('login')}}><i className="icon-arrow-left"></i> Geri Dön</button>
						</div>
					</div>
				)}
			</div>
		)
	}
}

LoginModal.defaultProps = {
	className: "",
	containerClass: "modal-login recovery",
	name: "recovery"
}