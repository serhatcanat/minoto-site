import React from 'react'

// Partials

// Deps
import Image from 'components/partials/image'

// Assets
import image_consent_banner from 'assets/images/modals/consent-banner.svg'

export default class ConsentModal extends React.Component {
	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}

				<Image className="consent-banner" src={image_consent_banner} bg />
				<div className="modal-innercontent">
					<p className="confirm-question">Bana özel kampanya ve fırsatlardan haberdar olmayı kabul ediyorum.</p>

					<div className="confirm-opts">
						<button className="opts-opt btn primary big uppercase hollow" onClick={vm.props.onClose}>Reddet</button>
						<button className="opts-opt btn primary big uppercase" onClick={vm.props.onClose}>Kabul Et</button>
					</div>
				</div>
			</div>
		)
	}
}

ConsentModal.defaultProps = {
	className: "",
	containerClass: "modal-consent modal-confirm narrow",
	name: "consent",
	preventClose: true,
}