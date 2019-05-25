import React from 'react'

// Partials
import RecoveryForm from 'components/partials/form-recovery'

// Deps

export default class LoginModal extends React.Component {
	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<RecoveryForm type="modal" />
				</div>
			</div>
		)
	}
}

LoginModal.defaultProps = {
	className: "",
	containerClass: "modal-login recovery",
	name: "recovery"
}