import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'
import Link from 'components/partials/link'
import Loader from 'components/partials/loader'

// Deps
import { serializeArray } from "functions/helpers";
import request from 'controllers/request'

export default class ResetForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			submitting: false,
			complete: false,
			error: false,
		}

		this.submit = this.submit.bind(this);
	}

	componentDidMount() {
		let vm = this;
		request.get('users/control-token/'+vm.props.email+'/'+vm.props.token, {}, function(payload){
			if(payload && payload.success){
				vm.setState({
					loading: false,
				});
			}
			else{
				vm.setState({
					loading: false,
					error: true,
				});
			}
		});
	}

	submit(e) {
		let vm = this;

		let formData = serializeArray(e.target);

		this.setState({
			submitting: true,
		});

		request.post('users/reset-password', formData, function(payload){
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

	render() {
		let vm = this;
		if(vm.state.complete){
			return (
				<div className="section loginform type-self">
					<h2 className="loginform-title">Şifrenizi Sıfırlayın</h2>

					<div className="loginform-info wysiwyg">
						<p><strong>Eski şifreniz yenisi ile değiştirildi.</strong></p>
						<p>Yeni şifreniz ile hesabınıza giriş yapabilirsiniz.</p>
					</div>
					<div className="loginform-nav center">
						<Link href="home" className="nav-btn"><i className="icon-arrow-left"></i> Ana Sayfaya Git</Link>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="section loginform loader-container type-self">
					<Loader loading={vm.state.loading} strict />
					<h2 className="loginform-title">Şifrenizi Sıfırlayın</h2>

					<InputForm className="loginform-form" onSubmit={vm.submit}>
					{vm.state.error ?
						<div className="loginform-message error">
							<span>Eriştiğiniz sıfırlama bilgileri hatalı.</span>
						</div>
						:
						<div>
							{vm.state.message &&
								<div className={"loginform-message " + (vm.state.success ? 'success' : 'error')}>
									<span>{vm.state.message}</span>
								</div>
							}
							<FormInput type="hidden" name="email" value={vm.props.email} />
							<FormInput type="hidden" name="token" value={vm.props.token} />
							<FormInput
								name="password"
								id="reset-password"
								type="password"
								label="Yeni Şifre"
								disabled={vm.state.submitting || vm.state.loading}
								validation={{ required: "Yeni şifrenizi girmelisiniz.", minLength: ["Yeni şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Girdiğiniz şifreler uyumlu değil.", "#reset-password-repeat"] }}
								className="form-field" />
							<FormInput
								name="password_repeat"
								id="reset-password-repeat"
								type="password"
								label="Yeni Şifre (Tekrar)"
								disabled={vm.state.submitting || vm.state.loading}
								validation={{ required: "Yeni şifrenizi girmelisiniz.", minLength: ["Yeni şifreniz en az {length} karakter içermelidir.", 6], "compare": ["Girdiğiniz şifreler uyumlu değil.", "#reset-password"] }}
								className="form-field" />
							<Btn
								className="form-field"
								block uppercase light loading={vm.state.submitting}
								disabled={vm.state.submitting || vm.state.loading}
								type="submit">
									Şifremi Sıfırla
							</Btn>
						</div>
					}
					</InputForm>
					<div className="loginform-nav center">
					{vm.state.error ?
						<Link href="account.recovery" className="nav-btn"><i className="icon-arrow-left"></i> Şifre Sıfırlama Sayfasına Dön</Link>
						:
						<Link href="home" className="nav-btn"><i className="icon-arrow-left"></i> Ana Sayfaya Git</Link>
					}
					</div>
				</div>
			)
		}
	}
}