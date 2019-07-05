import React from 'react'

// Partials
import { FormInput, InputForm } from 'components/partials/forms'
import Btn from 'components/partials/btn'
import Link from 'components/partials/link'

// Deps
import { connect } from "react-redux"
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
			success: false,
			error: false,
			message: false
		}

		this.submit = this.submit.bind(this);
	}

	submit(e) {
		let vm = this;

		vm.setState({ loading: true, error: false })
		let record = {
			advertID: e.target.elements.advertID.value,
			message: e.target.elements.message.value,
			dealer: vm.props.dealer ? vm.props.dealer : null,
			title: vm.props.advert.title,
			email: vm.props.user.email,
			messageType: 'message'
		};

		request.post(`messages/send-message`, record, function (payload) {
			setTimeout(function () {
				if (payload && payload.status === '200') {
					vm.setState({ loading: false, success: true, message: payload.message });
				}
				else {
					vm.setState({ loading: false, error: true, message: payload.message });
				}
			}, 1000);
		})
	}

	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<h1 className="bid-title"><strong>"{vm.props.advert.title}"</strong> başlıklı ilan için mesaj gönder</h1>
					{vm.props.user ?
						!vm.state.success ?
							<InputForm className="bid-form" onSubmit={vm.submit}>
								<input type="hidden" name="advertID" value={vm.props.advert.id} />
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
									loading={vm.state.loading && !vm.state.error}
									disabled={vm.state.loading}
									type="submit">Mesaj Gönder</Btn>
							</InputForm>
							:
							<div className="bid-complete">
								<i className="complete-icon icon-check-round"></i>
								<p className="complete-description">
									Mesajınız gönderildi.
								</p>
								<div className="complete-controls">
									<button type="button" className="link" onClick={closeModal}>İlana Dön</button>
									<Link className="link" href="account.messages" onClick={closeModal}>Mesajlarıma Git</Link>
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