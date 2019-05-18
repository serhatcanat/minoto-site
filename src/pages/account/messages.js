import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import Image from 'components/partials/image'

// Deps
//import { connect } from "react-redux"
import { openModal } from 'functions/modals'
import axios from 'axios'

// Assets
import image_avatar from 'assets/images/defaults/avatar.svg';

export default class Messages extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			messages: false,
		}

		this.deleteConversation = this.deleteConversation.bind(this);
	}

	componentDidMount() {
		let vm = this;

		axios.get(
			'/dummy/data/user-messages.json',
			{ params: {} }
		).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({messages: res.data.messages})
			}
		});
	}

	deleteConversation(message){
		openModal('confirm', {
			question: '<strong>' + message.title + '</strong> başlıklı mesajı ve tüm içeriğini silmek istediğinizden emin misiniz?',
			onConfirm: () => { console.log('silindi..'); }
		});
	}

	render () {
		let messages = this.state.messages;
		return (
			<section className="section account-messages loader-container">
				<Loader loading={messages === false} />
				{messages &&
					<div className="wrapper narrow">
						{messages.length &&
							<ul className="messages-list">
							{messages.map((message, nth) => (
								<li key={nth} className="list-item">
									<Link className="item-link" href={"/hesabim/mesajlarim/mesaj/"+message.id}>
										<Image src={message.sender.avatar ? message.sender.avatar : image_avatar} className="item-avatar" bg />
										<div className="item-senderinfo">
											<p className="senderinfo-title">{message.sender.title}</p>
											<p className="senderinfo-subtitle">{message.sender.subtitle}</p>
										</div>
										<strong className="item-title">{message.title}</strong>
										<div className="item-info">
											<div className="info-field">
												<strong>İlan No:</strong> {message.advertID}
											</div>
											<div className="info-field">
												{message.time}
											</div>
											<div className="info-field">
												<button type="button" onClick={(e) => { e.preventDefault(); this.deleteConversation(message); }}><i className="icon-trash"></i></button>
											</div>
										</div>
									</Link>
								</li>
							))}
							</ul>
						}
						{messages.length === 0 &&
							<div className="messages-error">
								Hiç mesajınız bulunmuyor.
							</div>
						}
					</div>
				}
			</section>
		)
	}
}