import React from 'react'

// Sections

// Partials
import Link from 'components/partials/link'

// Deps
import { openModal } from 'functions/modals'

// Assets

export default class Home extends React.Component {
	render () {
		return (
			<main className="page sitemap">
				<div className="wrapper">
					<h1>Site Haritası</h1>

					<section>
						<h2>Sayfalar</h2>
						<Link className="btn primary" href="home" />
						<Link className="btn primary" href="detail" params='12345' />
					</section>

					<section>
						<h2>Komponentler</h2>
						<button className="btn primary" type="button" onClick={() => openModal('consent')}>Veri İzni</button>
						<button className="btn primary" type="button" onClick={() => openModal({action: 'share', url: 'http://www.thinkerfox.com'})}>Paylaş</button>
					</section>
				</div>
			</main>

		)
	}
}