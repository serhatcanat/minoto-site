import React from 'react'

// Sections

// Partials
import Link from 'components/partials/link'
import Btn from 'components/partials/btn'

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
						<Link className="btn primary" href="dealers" />
						<Link className="btn primary" href="dealer" params='12321' />
					</section>

					<section>
						<h2>Komponentler</h2>
						<h3>Modallar</h3>
						<button className="btn primary" type="button" onClick={() => openModal('consent')}>Veri İzni</button>
						<button className="btn primary" type="button" onClick={() => openModal({action: 'share', url: 'http://www.thinkerfox.com'})}>Paylaş</button>

						<h3>Butonlar</h3>
						<Btn primary>Ana Renk</Btn>
						<Btn dark>Koyu</Btn>
						<Btn white>Beyaz</Btn>
						<Btn primary hollow>Ana Renk</Btn>
						<Btn dark hollow>Koyu</Btn>
						<Btn white hollow>Beyaz</Btn><br />
						<Btn status="loading">Yükleniyor</Btn>
						<Btn icon="check">İkon</Btn>
						<Btn rightIcon="check">Sağ İkon</Btn>
						<Btn note="Bu araç için teklif verebilirsiniz">Not</Btn>

					</section>
				</div>
			</main>

		)
	}
}