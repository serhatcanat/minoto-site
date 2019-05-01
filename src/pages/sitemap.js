import React from 'react'

// Sections

// Partials
//import Link from 'components/partials/link'
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
						<Btn tag="link" className="btn" dark href="home" />
						<Btn tag="link" className="btn" dark href="detail" params={{id: "12345"}} />
						<Btn tag="link" className="btn" dark href="dealers" />
						<Btn tag="link" className="btn" dark href="dealer" params={{id: "12345"}} />
						<Btn tag="link" className="btn" dark href="listprices" />
						<Btn tag="link" className="btn" dark href="account" />
						<Btn tag="link" className="btn" dark href="notfound" />
						<Btn tag="link" className="btn" dark href="about" />
					</section>

					<section>
						<h2>Komponentler</h2>
						<h3>Modallar</h3>
						<button className="btn" type="button" onClick={() => openModal('consent')}>Veri İzni</button>
						<button className="btn" type="button" onClick={() => openModal({action: 'share', url: 'http://www.thinkerfox.com'})}>Paylaş</button>

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