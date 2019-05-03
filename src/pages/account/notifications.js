import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import Image from 'components/partials/image'

// Deps
//import { connect } from "react-redux"
import axios from 'axios'

// Assets
import image_notification_default from 'assets/images/defaults/autocomplete-thumb.jpg'

export default class Notifications extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			notfications: false,
		}
	}

	componentDidMount() {
		let vm = this;

		axios.get(
			'/dummy/data/notifications.json',
			{ params: {} }
		).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({notifications: res.data.groups})
			}
		});
	}

	render () {
		let notificationGroups = this.state.notifications;
		const contentPattern = /\[(.*?)\]\((.*?)\)/gm;
		const linkPattern = /\[(.*?)\]\((.*?)\)/;
		return (
			<section className="section account-notifications loader-container">
				<Loader loading={notificationGroups === false} />
				{notificationGroups &&
					<div className="wrapper narrow">
						{notificationGroups.map((group, nth) => (
							<div className="notifications-group" key={nth}>
								<h2 className="group-title">{group.title}</h2>
								<ul className="group-items">
								{group.notifications.map(function(notification, xnth){
									let content = notification.content;
									let match = content.match(contentPattern);
									let finalContent = false;
									
									if(match.length){
										finalContent = [];
										match.forEach(function(link, nth){
											let patLink = link.match(linkPattern);
											let fragments = content.split(patLink[0]);
											content = fragments[1];
											finalContent.push(fragments[0]);
											finalContent.push(<Link className="notification-link" href={patLink[2]} key={nth}>{patLink[1]}</Link>);
										});

										if(content.length > 0){
											finalContent.push(content);
										}
									}
									else {
										finalContent = content;
									}
									return (
										<li className={"items-notification" + (!notification.read ? ' unread' : '')} key={xnth}>
											<Image className="notification-image" bg src={(notification.image ? notification.image : image_notification_default)} />
											<div className="notification-content">
												{finalContent}
												<p className="notification-datetime">{notification.datetime}</p>
											</div>
										</li>
									)
								})}
								</ul>
							</div>
						))}
					</div>
				}
			</section>
		)
	}
}