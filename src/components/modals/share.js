import React from 'react'

// Partials
import Link from 'components/partials/link'

// Deps
//import Image from 'components/partials/image'

// Assets

export default class ShareModal extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			copied: false,
		}

		this.copyTimeout = false;
		this.copyURL = this.copyURL.bind(this);
	}
	copyURL() {
		let vm = this;
		if(vm.copyTimeout){
			clearTimeout(vm.copyTimeout);
		}
		const el = document.createElement('textarea');
		el.style.opacity = "0"
		el.value = vm.props.url;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
		vm.setState({copied: true});

		vm.copyTimeout = setTimeout(function() {
			vm.setState({copied: false});
		}, 1500)
	}

	render() {
		let vm = this;
		return (
			<div className={vm.props.className}>
				{vm.props.closeBtn}
				<div className="modal-innercontent">
					<p className="sharer-title">Paylaş</p>

					<div className="sharer-media">
						<Link type="a" className="media-link twitter" href={"http://twitter.com/share?text=text goes here&url="+vm.props.url+"&hashtags=minoto,sifirarac"} target="_blank">
							<i className="icon-twitter"></i>
						</Link>
						<Link type="a" className="media-link facebook" href={"https://www.facebook.com/sharer/sharer.php?u=" + vm.props.url} target="_blank">
							<i className="icon-facebook"></i>
						</Link>
						<Link type="a" className="media-link whatsapp" href={"whatsapp://send?text="+vm.props.url} data-action="share/whatsapp/share" target="_blank">
							<i className="icon-whatsapp"></i>
						</Link>
						<Link type="a" className="media-link email" href={"mailto:?subject=Bak Minoto'da Ne Buldum!&body=" + (vm.props.urlTitle ? vm.props.urlTitle + ': ' : '') + vm.props.url} target="_blank">
							<i className="icon-envelope"></i>
						</Link>
					</div>

					<div className="sharer-info">
						<span className="info-link">{vm.props.url}</span>
						<button className="info-copy btn primary wide low hollow uppercase" onClick={vm.copyURL}>{(vm.state.copied ? 'Kopyalandı!' : 'Linki Kopyala')}</button>
					</div>
				</div>
			</div>
		)
	}
}

ShareModal.defaultProps = {
	className: "",
	containerClass: "modal-consent modal-sharer narrow",
	name: "consent",
	preventClose: false,
	url: false,
	urlTitle: false
}