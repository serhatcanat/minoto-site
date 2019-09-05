import React from 'react'

// Partials
import { FormInput, InputForm } from 'components/partials/forms'
import Btn from 'components/partials/btn'
import Link from 'components/partials/link'

// Deps
import { connect } from "react-redux"
import request from 'controllers/request'
import { closeModal, openModal } from 'functions/modals'
import { GA } from 'controllers/ga'

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
			success: false,
			error: false,
			bid: false,
		}

		this.submit = this.submit.bind(this);
	}

	submit(e) {
		let vm = this;

		vm.setState({ loading: true, error: false })

		let record = {
			advertID: e.target.elements.advertID.value,
			message: e.target.elements.message.value,
			title: vm.props.advert.title,
			email: vm.props.user.email,
			offerPrice: parseInt(e.target.elements.bid.value.replace('.', '')),
			messageType: 'bid'
		};

		/*request.post(`messages/send-message`, record, function (payload) {
			setTimeout(function () {
				if (payload && payload.status === '200') {
					vm.setState({ loading: false, success: true, message: payload.message, bid: e.target.elements.bid.value });
					GA.send('conversion', {
						revenue: e.target.elements.bid.value,
					});
				}
				else {
					vm.setState({ loading: false, error: true, message: payload.message });
				}
			}, 1000);
		})*/

		setTimeout(function() {
			vm.setState({ loading: false, success: true, message: 'TMM', bid: e.target.elements.bid.value });
			GA.send('conversion', {
				revenue: e.target.elements.bid.value,
			});
		}, 1000);
	}

	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<h1 className="bid-title"><strong>"{vm.props.advert.title}"</strong> başlıklı ilan için teklif ver</h1>
					{vm.props.user ?
						!vm.state.success ?
							<InputForm className="bid-form" onSubmit={vm.submit}>
								<input type="hidden" name="advertID" value={vm.props.advert.id} />
								<FormInput
									className="form-price"
									placeholder="Fiyat Teklifiniz"
									popLabel
									validation={{
										required: "Bir fiyat teklifi girmelisiniz.",
										minNum: ["Fiyat teklifiniz minimum teklif tutarının altındadır.", (vm.props.advert.price * 0.93)],
										maxNum: ["Teklifiniz araç fiyatının üzerindedir.", (vm.props.advert.price * 1.07)],
									}}
									name="bid"
									mask="1++++++++++++++"
									disabled={vm.state.loading}
									formatNumber
									type="number" />
								<FormInput
									className="form-message"
									placeholder="Mesajınız"
									name="message"
									validation={{
										required: "Bir mesaj girmelisiniz."
									}}
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
									<Link className="link" href="account.messages">Mesajlarıma Git</Link>
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