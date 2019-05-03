import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import { FormInput, InputForm } from 'components/partials/forms'

// Deps
import { connect } from "react-redux"
import axios from 'axios'
import parse from 'html-react-parser'

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
		}
	}

	componentDidMount() {
		let vm = this;

		axios.get(
			'/dummy/data/user-messages-conversation.json',
			{ params: {} }
		).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({conversation: res.data.conversation})
			}
		});
	}

	render () {
		let conversation = this.state.conversation;
		return (
			<section className="section account-message-conversation loader-container">
				<Loader loading={conversation === false} />
				{conversation &&
					<div className="wrapper narrow">
						<div className="conversation-head">
							<Link href="account.messages"><i className="icon-angle-left"></i></Link>
							<span className="head-advertid">İlan no: {conversation.advertID}</span>
						</div>
						{conversation.sender.dealer &&
							<Link className="conversation-dealer" href="dealer" params={{id: conversation.sender.dealer.id}}>
								<Image src={conversation.sender.dealer.avatar} className="dealer-avatar" />
								<span className="dealer-title">{conversation.sender.dealer.title}</span>
							</Link>
						}

						{conversation.sender &&
							<div className="conversation-sender">
								<Image className="sender-avatar" bg src={(conversation.sender.avatar ? conversation.sender.avatar : image_avatar)} /> <span>{conversation.sender.title}</span>
							</div>
						}

						<div className="conversation-content">
							{conversation.title &&
								<h1 className="conversation-title">{conversation.title}</h1>
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
												src={(message.from === 'dealer' ? (conversation.sender.avatar ? conversation.sender.avatar : image_avatar) : (this.props.user.avatar ? this.props.user.avatar : image_avatar))}
												alt={(message.from === 'dealer' ? conversation.sender.title : this.props.user.fullname)}
												title={(message.from === 'dealer' ? conversation.sender.title : this.props.user.fullname)}
											/>
										</div>
										<div className="message-content">
											<div className="message-text">
												{parse(message.content.replace(/(?:\r\n|\r|\n)/g, '<br />'))}
											</div>
											<div className="message-datetime"><i className="icon-calendar"></i> {message.datetime}</div>
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

							<InputForm className="conversation-composeform">
								<Image className="composeform-avatar" bg alt={this.props.user.fullname} src={(this.props.user.avatar ? this.props.user.avatar : image_avatar)} />
								<FormInput name="message" placeholder="Cevap yaz..." />
								<Btn type="submit" className="composeform-submit" primary uppercase low>Gönder</Btn>
							</InputForm>
						</div>
					</div>
				}
			</section>
		)
	}
}

export default connect(mapStateToProps)(MessageDetail);