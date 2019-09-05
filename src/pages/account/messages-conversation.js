import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import Responsive from 'components/partials/responsive'
import { FormInput, InputForm } from 'components/partials/forms'
import PriceTag from 'components/partials/price-tag'

// Deps
import { connect } from "react-redux"
import parse from 'html-react-parser'
import { storageSpace } from 'functions/helpers'
import { setTitle } from 'controllers/head'
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import { getUnreadMessageCount } from "data/store.user";

// Assets
import image_avatar from 'assets/images/defaults/avatar.svg';

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};

class MessageDetail extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			conversation: false,
			loading: false,
		}

		this.sendMessage = this.sendMessage.bind(this);

		this.composeForm = React.createRef();
	}

	componentDidMount() {
		let vm = this;

		request.get(
			`messages/${vm.props.match.params.id}`,
			{ email: vm.props.user.email },
			function (payload) {
				if (payload) {

					getUnreadMessageCount();
					
					vm.setState({
						conversation: payload
					})

					setTitle(payload.sender.title + ' Mesajları');
				}
				else {
					redirect("notfound");
				}
			}
		);
	}

	sendMessage(e) {
		let vm = this;

		vm.setState({ loading: true });

		let record = {
			code: e.target.elements.code.value,
			message: e.target.elements.message.value,
			email: vm.props.user.email
		};

		request.post(`messages/send-message`, record, function (payload) {
			setTimeout(function () {
				if (payload && payload.status === '200') {
					vm.setState({ loading: false, success: true, message: payload.message });
					vm.composeForm.current.reset();
					window.location.reload();
				}
				else {
					vm.setState({ loading: false, error: true, message: payload.message });
				}
			}, 1000);
		})

		//burası aslında post olacak, netekim dummy json data'da 404 verdiği için get şimdilik
		//request.post(
		/* request.get(
			'/dummy/data/user-messages-conversation.json',
			formData,
			function (payload) {
				vm.setState({ loading: false });
				if (payload) {
					vm.composeForm.current.reset();
				}
			}
		); */
	}

	render() {
		let conversation = this.state.conversation;

		return (
			<section className="section account-message-conversation loader-container">
				<Loader loading={conversation === false} />
				{conversation &&
					<div className="wrapper narrow">
						<div className="conversation-head">
							<Link className="head-back" href="account.messages">
								<i className="icon-angle-left"></i>
								<Responsive type="only-mobile"><span>Geri Dön</span></Responsive>
							</Link>
							<Responsive>
								<span className="head-advertid">İlan no: {conversation.advertID}</span>
								<Link className="head-advertlink" href="detail" params={{ id: conversation.advertID, slug: conversation.advertSlug }}>İlana Git</Link>
							</Responsive>
						</div>
						{conversation.sender.dealer &&
							<Link
								className="conversation-dealer"
								href={(conversation.sender.dealer.branchUrl ? "branch" : "dealer")}
								params={(conversation.sender.dealer.branchUrl ? { dealer: conversation.sender.dealer.dealerUrl, slug: conversation.sender.dealer.branchUrl } : { slug: conversation.sender.dealer.dealerUrl })}>
								<Image src={storageSpace('dealers', conversation.sender.dealer.avatar)} className="dealer-avatar" />
								<span className="dealer-title">{conversation.sender.dealer.title}</span>
							</Link>
						}

						{conversation.sender &&
							<div className="conversation-sender">
								<Image className="sender-avatar" bg src={(conversation.sender.avatar ? storageSpace('profile-photos', conversation.sender.avatar) : image_avatar)} />
								<span className="sender-name">{conversation.sender.title}</span>
								<Responsive type="only-mobile">
									<span className="sender-advertid">İlan no: {conversation.advertID}</span>
								</Responsive>
							</div>
						}

						<div className="conversation-content">
							{conversation.title &&
								<h1 className="conversation-title">{conversation.title} <small> {conversation.offerPrice && <React.Fragment> - <PriceTag price={conversation.offerPrice} /> TEKLİF</React.Fragment>}</small></h1>
							}

							{conversation.messages.length &&
								<ul className="conversation-messages">
									<li className="messages-message first">
										<div className="message-content">
											<div className="message-text">
												{parse(conversation.messages[0].content.replace(/(?:\r\n|\r|\n)/g, '<br />'))}
											</div>
											<div className="message-datetime"><i className="icon-calendar"></i> {conversation.messages[0].datetime}</div>
										</div>
									</li>
									{conversation.messages.length > 1 && conversation.messages.slice(1).map((message, nth) => (
										<li key={nth} className="messages-message">
											<div className="message-profile">
												<Image
													className="profile-image"
													bg
													src={(message.from === 'dealer' ? (conversation.sender.avatar ? storageSpace('dealers', conversation.sender.dealer.avatar) : image_avatar) : (this.props.user.avatar ? storageSpace('profile-photos', this.props.user.avatar) : image_avatar))}
													alt={(message.from === 'dealer' ? conversation.sender.title : this.props.user.name)}
													title={(message.from === 'dealer' ? conversation.sender.title : this.props.user.name)}
												/>
											</div>
											<div className="message-content">
												<div className="message-text">
													{parse(message.content.replace(/(?:\r\n|\r|\n)/g, '<br />'))}
												</div>
												<div className="message-datetime"><i className="icon-calendar"></i> {message.datetime} - {message.name}</div>
											</div>
										</li>
									))}
								</ul>
							}
							{conversation.length === 0 &&
								<div className="conversation-error">
									Bu kişiyle daha önce mesajlaşmamışsınız
								</div>
							}

							<InputForm className="conversation-composeform" onSubmit={this.sendMessage} ref={this.composeForm}>
								<Image className="composeform-avatar" bg alt={this.props.user.fullname} src={(this.props.user.avatar ? storageSpace('profile-photos', this.props.user.avatar) : image_avatar)} />
								<input type="hidden" name="code" value={conversation.code} />
								<FormInput
									type="textarea"
									name="message"
									validation={{ required: "Mesaj alanını doldurmalısınız.", minLength: ["Mesajınız en az {length} karakter içermelidir.", 10] }}
									placeholder="Cevap yaz..." disabled={this.state.loading} />
								<Btn type="submit" className="composeform-submit" primary uppercase low loading={this.state.loading} disabled={this.state.loading}>Gönder</Btn>
							</InputForm>
						</div>
					</div>
				}
			</section>
		)
	}
}

export default connect(mapStateToProps)(MessageDetail);