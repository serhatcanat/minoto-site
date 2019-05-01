import React from 'react'

// Partials
//import Btn from 'components/partials/btn'
import Image from 'components/partials/image'

// Deps
import { connect } from "react-redux"
import { setTitle } from 'controllers/head'

// Assets
import image_avatar from 'assets/images/defaults/avatar.svg';

const mapStateToProps = state => {
	return {
		user: state.user.user,
	};
};

class Profile extends React.Component {

	componentDidMount() {
		setTitle('Profilim');
	}

	render () {
		let vm = this;
		let user = vm.props.user;
		return (
			<section className="section account-profile">
				<div className="profile-wrap wrapper narrow">
					<aside className="profile-sum">
						<Image className="sum-image" bg src={(user.avatar ? user.avatar : image_avatar)} />
						<h1 className="sum-name">{user.name}</h1>
						<p className="sum-location"><i className="icon-marker"></i> {user.location}</p>

						<div className="sum-completion">
							<div className="completion-bar">
								<div className="bar-progress" style={{width: user.profileCompletion+'%'}}></div>
							</div>

							<div class="completion-status">Profiliniz <span>%{user.profileCompletion}</span> dolu</div>
						</div>
					</aside>
				</div>
			</section>
		)
	}
}

export default connect(mapStateToProps)(Profile);