import React from 'react'

// Partials
import { FormInput, InputForm } from 'components/partials/forms'
import Btn from 'components/partials/btn'
import Link from 'components/partials/link'

// Deps
import { connect } from "react-redux"
import { serializeArray, apiPath } from 'functions/helpers'
import request from 'controllers/request'
import { closeModal, openModal } from 'functions/modals'

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};

class MessageModalRaw extends React.Component {
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

		request.post(apiPath('mail/contact'), payload, function (response) {
			console.log(response);
			vm.setState({ loading: false, complete: true, bid: payload.bid });
			/*if (response !== false) {
				vm.setState({ loading: false, complete: true, bid: payload.bid });
			}
			else {
				vm.setState({ loading: false, error: true });

				setTimeout(function() {
					vm.setState({ error: false })
				}, 3000);
			}*/
		}); 
	}

	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<h1 className="bid-title"><strong>"{vm.props.advert.title}"</strong> başlıklı ilan için mesaj gönder</h1>
					{vm.props.user ?
						!vm.state.complete ?
							<InputForm className="bid-form" onSubmit={vm.submit}>
								<input type="hidden" name="advert-id" value={vm.props.advert.id} />
								<FormInput
									className="form-message"
									placeholder="Mesajınız"
									name="message"
									popLabel
									validation={{
										required: "Bir mesaj yazmalısınız.",
										minLength: ["Mesajınız en az {length} karakter içermelidir.", 15]
									}}
									disabled={vm.state.loading}
									type="textarea" />

								<Btn
									className="form-submitbtn"
									big wide
									status={(vm.state.error ? 'error' : false)}
									loading={vm.state.loading}
									disabled={vm.state.loading}
									type="submit">Mesaj Gönder</Btn>
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
							<p>Mesaj göndermek için giriş yapmalısınız.</p>

							<Btn big wide onClick={() => openModal('login')}>Giriş Yap</Btn>
						</div>
					}
				</div>
			</div>
		)
	}
}

MessageModalRaw.defaultProps = {
	className: "",
	containerClass: "modal-bid",
	name: "message",
	advert: false,
}

let MessageModal = connect(mapStateToProps)(MessageModalRaw);
MessageModal.props = MessageModalRaw.defaultProps;
export default MessageModal;