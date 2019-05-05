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
						<Btn tag="link" className="btn" dark href="reservation.info" params={{id: "432943312"}} />
						<Btn tag="link" className="btn" dark href="reservation.payment" params={{id: "432943312"}} />
						<Btn tag="link" className="btn" dark href="reservation.sum" params={{id: "A5011CMinoto"}} />
						<Btn tag="link" className="btn" dark href="faq" />
						<Btn tag="link" className="btn" dark href="privacy" />
					</section>

					<section>
						<h2>Komponentler</h2>
						<h3>Modallar</h3>
						<button className="btn" type="button" onClick={() => openModal('consent')}>Veri İzni</button>
						<button className="btn" type="button" onClick={() => openModal({action: 'share', url: 'http://www.thinkerfox.com'})}>Paylaş</button>
						<button className="btn" type="button" onClick={() => openModal({action: 'options', question: "Bu işlemi gerçekleştirmek istediğinize emin misiniz?", title: "Soru", opts: [{
							text: "Evet, Eminim", onClick: ()=>{alert('Evet, Emin')}, className: "primary"}, {text: "Hayır"}]})}>Soru</button>
						<button className="btn" type="button" onClick={() => openModal({action: 'confirm', question: "Bu işlemi gerçekleştirmek istediğinize emin misiniz?", title: "Onay", onConfirm: () => { alert("Onaylıyor") }, onDeny: () => { alert("Onaylamıyor") }})}>Onay</button>

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