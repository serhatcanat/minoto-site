import React from 'react'

// Partials
import Link from 'components/partials/link'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'

// Deps
import { openModal } from 'functions/modals'
import { storageSpace } from "functions/helpers"
import config from "data/config"

// Static Assets
import image_instagram from 'assets/images/listing/banners/instagram.jpg'
import image_youtube from 'assets/images/listing/banners/youtube.png'

// Banners
class InstagramBanner extends React.Component {
	render() {
		return (
			<a className="banner-instagram" target="_blank" rel="noopener noreferrer" href={config.social.instagramURL}>
				{/* 
					<div className="instagram-text">
					<strong>Instagram</strong>'da'<br />
					bizi takip <br />
					ediyor musunuz?
				</div>
				*/}
				<Image className="instagram-image banner-image" bg={true} src={image_instagram} />
			</a>
		)
	}
}

class YoutubeBanner extends React.Component {
	render() {
		return (
			<a className="banner-youtube" target="_blank" rel="noopener noreferrer" href={config.social.youtubeURL}>
				<div className="youtube-text">
					<h3 className="text-heading">
						<strong>Minoto</strong> YouTube <br />
						Kanalı Yayında!
					</h3>
					<p className="text-subheading">Güncel içerik ve test videoları</p>
				</div>

				<Image className="youtube-image" src={image_youtube} />
			</a>
		)
	}
}

class HrBanner extends React.Component {
	render() {
		return (
			<div className="banner-hr">
				<div className="hr-content">
					<div className="inner-triangle"></div>
					<h3 className="content-title">
						Birlikte çalışalım!
					</h3>
					<p className="content-description">
						Bizimle çalışmak ister misiniz? <br />
						<strong>Minoto</strong> ailesine katılmak için bize ulaşın.
					</p>

					<Btn href="mailto:merhaba@minoto.com?subject=Minoto’da Çalışmak İstiyorum" target="_blank" rel="noopener noreferrer" className="content-cta" tag="a" uppercase wide>CV Gönder</Btn>
				</div>
			</div>
		)
	}
}

const componentRegistry = {
	"instagram": InstagramBanner,
	"youtube": YoutubeBanner,
	"hr": HrBanner,
}

export default class ListingBanner extends React.Component {
	render() {
		let data = this.props.data;
		let elem = false;

		if (data.component && componentRegistry.hasOwnProperty(data.component)) {
			let El = componentRegistry[data.component];
			elem = <El mobile={this.props.mobile} />
		}
		else if (data.image) {
			let Item = 'div';
			let props = {
				className: "item-banner"
			};

			if (data.url) {
				switch (data.action) {
					case "youtube":
						Item = 'button';
						props.onClick = () => { openModal('youtube', { url: data.url }) }
						break;
					case "externalLink":
						Item = 'a';
						props.herf = data.url;
						break;
					default:
						Item = Link;
						props.href = data.url;
						break;
				}
			}

			elem = (<Item {...props}><Image className="banner-image" src={storageSpace('promo-videos', data.image)} alt={data.title} bg={!this.props.mobile} /></Item>);
		}

		return elem ? (
			<li className={"results-item banner x" + data.size}>
				{elem}
			</li>
		) : false;
	}
}