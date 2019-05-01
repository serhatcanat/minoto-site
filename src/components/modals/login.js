import React from 'react'

// Partials

// Deps

export default class LoginModal extends React.Component {
	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<br /><br />Login<br /><br />
			</div>
		)
	}
}

LoginModal.defaultProps = {
	className: "",
	containerClass: "modal-login",
	name: "login"
}