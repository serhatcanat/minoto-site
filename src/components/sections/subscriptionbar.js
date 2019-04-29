import React from 'react'

// Partials
import Btn from 'components/partials/btn'
import { InputForm, FormInput } from 'components/partials/forms'

// Functions
import { serializeArray } from 'functions/helpers'

// Assets

export default class SubscriptionBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		let vm = this;
		console.log(serializeArray(e.target));
		vm.setState({ loading: true, status: false });

		setTimeout(function() {
			vm.setState({ loading: false, status: 'check' });
		}, 3000);
	}

	render() {
		let vm = this;
		return (
			<section className={"section subscriptionbar " + vm.props.className}>
				<InputForm className="subscriptionbar-form" onSubmit={vm.handleSubmit}>
					<h3 className="form-title">{vm.props.heading}</h3>
					<FormInput className="form-input" validation hideError type="email" name="email" placeholder="E-posta adresiniz" disabled={vm.state.loading} />
					<Btn className="form-submit" uppercase type="submit" disabled={vm.state.loading ? true : undefined} status={(vm.state.loading ? 'loading' : vm.state.status)}>Gönder</Btn>
				</InputForm>
			</section>
		)
	}
}

SubscriptionBar.defaultProps = {
	className: '',
	heading: "Daha fazlası için bültenimize kayıt olun!",
}