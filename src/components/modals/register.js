import React from 'react'

// Partials

// Deps

export default class RegisterModal extends React.Component {
	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<br /><br />Kayıt<br /><br />
			</div>
		)
	}
}

RegisterModal.defaultProps = {
	className: "",
	containerClass: "modal-register",
	name: "register"
}