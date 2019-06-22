import React from 'react'

// Partials
import { FormInput, InputForm } from 'components/partials/forms'
import Btn from 'components/partials/btn'
import Link from 'components/partials/link'

// Deps
import { connect } from "react-redux"
import { serializeArray } from 'functions/helpers'
import request from 'controllers/request'
import { closeModal, openModal } from 'functions/modals'

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};

class BidModalRaw extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			complete: false,
			error: false,
			bid: false,
		}

		this.submit = this.submit.bind(this);
	}

	submit(e) {
		let vm = this;
		let payload = serializeArray(e.target)
		vm.setState({ loading: true, bid: false, error: false })

		console.log(serializeArray(e.target));

		request.post('messages/send-message', payload, function (response) {
			if(response && response.success){
				vm.setState({ loading: false, complete: true, bid: payload.bid });
			}
			else {
				vm.setState({ loading: false, error: true });
			}
		}); 
	}

	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<h1 className="bid-title"><strong>"{vm.props.advert.title}"</strong> başlıklı ilan için teklif ver</h1>
					{vm.props.user ?
						!vm.state.complete ?
							<InputForm className="bid-form" onSubmit={vm.submit}>
								<input type="hidden" name="advert-id" value={vm.props.advert.id} />
								<FormInput
									className="form-price"
									placeholder="Fiyat Teklifiniz"
									popLabel
									validation={{
										required: "Bir fiyat teklifi girmelisiniz.",
										minNum: ["Fiyat teklifi, liste fiyatının %3'ünden düşük olamaz.", (vm.props.advert.price * 0.97)],
										maxNum: ["Fiyat teklifi, liste fiyatının %3'ünden yüksek olamaz.", (vm.props.advert.price * 1.03)],
									}}
									name="bid"
									mask="10000000000"
									disabled={vm.state.loading}
									type="number" />
								<FormInput
									className="form-message"
									placeholder="Mesajınız"
									name="message"
									popLabel
									disabled={vm.state.loading}
									type="textarea" />

								<Btn
									className="form-submitbtn"
									big wide
									status={(vm.state.error ? 'error' : false)}
									loading={vm.state.loading}
									disabled={vm.state.loading}
									type="submit">Teklif Ver</Btn>
							</InputForm>
						:
							<div className="bid-complete">
								<i className="complete-icon icon-check-round"></i>
								<p className="complete-description">
									<strong>{vm.state.bid}TL</strong>'lik teklifiniz kaydedildi.
								</p>
								<div className="complete-controls">
									<button type="button" className="link" onClick={closeModal}>İlana Dön</button>
									<Link className="link" href="account.reservations">Rezervasyonlarıma Git</Link>
								</div>
							</div>
						
						:
						<div className="bid-login">
							<p>Teklif vermek için giriş yapmalısınız.</p>

							<Btn big wide onClick={() => openModal('login')}>Giriş Yap</Btn>
						</div>
					}
				</div>
			</div>
		)
	}
}

BidModalRaw.defaultProps = {
	className: "",
	containerClass: "modal-bid",
	name: "bid",
	advert: false,
}

let BidModal = connect(mapStateToProps)(BidModalRaw);
BidModal.props = BidModalRaw.defaultProps;
export default BidModal;