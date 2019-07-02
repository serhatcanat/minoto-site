import React from 'react'

// Partials
import Btn from 'components/partials/btn'
import { InputForm, FormInput } from 'components/partials/forms'

// Functions
import request from 'controllers/request'

// Assets

export default class SubscriptionBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			submitting: false,
			complete: false,
		}

		this.handleSubmit = this.handleSubmit.bind(this);

		this.form = React.createRef();
	}

	handleSubmit(e) {
		let vm = this;
		vm.setState({ submitting: true });

		let record = {
			email: e.target.elements.email.value
		};

		request.post('mail/newsletter', record, function (payload) {
			if (payload.success) {
				vm.setState({ complete: true, submitting: false });
				if (vm.form.current) {
					vm.form.current.reset();
				}
			}
		}, { excludeApiPath: false });
	}

	render() {
		let vm = this;
		return (
			<section className={"section subscriptionbar " + vm.props.className}>
				<InputForm className="subscriptionbar-form" onSubmit={vm.handleSubmit} ref={vm.form}>
					{
						vm.state.complete ? (
							<React.Fragment>
								<br />
								<h3 className="form-title">Minoto'ya duyduğunuz ilgi için teşekkür ederiz.</h3>
							</React.Fragment>
						) :
							(
								<React.Fragment>
									<h3 className="form-title">{vm.props.heading}</h3>
									<FormInput
										className="form-input"
										disabled={vm.state.submitting}
										type="email"
										name="email"
										placeholder="E-posta adresiniz"
										validation={{
											required: "E-posta adresinizi girmelisiniz.",
											email: true
										}}
									/>
									<Btn className="form-submit" uppercase type="submit" disabled={vm.state.submitting ? true : undefined} status={(vm.state.submitting ? 'loading' : vm.state.complete)}>Gönder</Btn>
								</React.Fragment>
							)
					}
				</InputForm>
			</section>
		)
	}
}

SubscriptionBar.defaultProps = {
	className: '',
	heading: "Daha fazlası için bültenimize kayıt olun!",
}