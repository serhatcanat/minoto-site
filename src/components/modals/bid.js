import React from 'react'

// Partials
import { FormInput, InputForm } from 'components/partials/forms'
import Btn from 'components/partials/btn'

// Deps

export default class BidModal extends React.Component {
	render() {
		console.log(this.props.advert);
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<h1 className="bid-title"><strong>"{vm.props.advert.title}"</strong> başlıklı ilan için teklif ver</h1>
					<InputForm className="bid-form">
						<input type="hidden" name="advert-id" value={vm.props.advert.id} />
						<FormInput
							className="form-price"
							placeholder="Fiyat Teklifiniz"
							popLabel
							mask="000.000.000.00"
							type="number" />
						<FormInput
							className="form-message"
							placeholder="Mesajınız"
							popLabel
							type="textarea" />

						<Btn
							big wide
							type="submit">Teklif Ver</Btn>
					</InputForm>
				</div>
			</div>
		)
	}
}

BidModal.defaultProps = {
	className: "",
	containerClass: "modal-bid",
	name: "bid",
	advert: false,
}