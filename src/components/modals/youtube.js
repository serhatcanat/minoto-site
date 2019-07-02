import React from 'react'

// Partials

// Deps
import { closeModal } from 'functions/modals'

// Assets

export default class YoutubeModal extends React.Component {
	optionClick(opt) {
		if(opt.onClick){
			opt.onClick();
			if(opt.closeOnClick){
				closeModal();
			}
		}
		else {
			closeModal();
		}
	}

	getVideoID(url){
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		var match = url.match(regExp);
		return (match&&match[7].length===11)? match[7] : false;
	}

	render() {
		let vm = this;
		let src = vm.getVideoID(this.props.url);

		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<div className="youtube-wrap">
						<iframe className="youtube-video" title="youtube-video" src={'https://www.youtube.com/embed/' + src} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
					</div>
				</div>
			</div>
		)
	}
}

YoutubeModal.defaultProps = {
	className: "",
	containerClass: "modal-youtube",
	name: "youtube",
	title: false,
	content: false,
}