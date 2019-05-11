import React from 'react'

// Partials
import GoogleMap from 'components/partials/google-map'
import Link from 'components/partials/link'

export default class Faq extends React.Component {
	render () {
		return (
			<main className="page contact">
				<section className="section contact-map">
					<GoogleMap
						className="map-container"
						markers={[{
							html: false,
							lat: 41.109604,
							lng: 29.022052
						}]}

						settings={{
							maxZoom: 16,
						}}
					/>
				</section>
				<section className="section contact-info">
					<div className="info-wrap wrapper medium">
						<ul className="info-section info-details">
							<li className="details-item">
								<strong className="item-heading">Ticaret Ünvanı</strong>
								<span className="item-content">Minoto A.Ş.</span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Ticari Sicil No</strong>
								<span className="item-content">742942</span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Sorumlu Kişi</strong>
								<span className="item-content">Kaan Boyner / Ferhat Albayram</span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Telefon</strong>
								<span className="item-content"><Link type="a" href="tel:08002129898">0800 212 98 98</Link></span>
							</li>
							<li className="details-item">
								<strong className="item-heading">E-Posta</strong>
								<span className="item-content"><Link type="a" href="mailto:info@minoto.com">info@minoto.com</Link></span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Mersis No</strong>
								<span className="item-content">69486208399</span>
							</li>
							<li className="details-item">
								<strong className="item-heading">Adres</strong>
								<span className="item-content">Maslak Mahallesi, Meydan Sokak Spring Giz Plaza 3630 Sarıyer İstanbul</span>
							</li>
						</ul>

						<div className="info-section">
							r
						</div>
					</div>
				</section>
			</main>

		)
	}
}