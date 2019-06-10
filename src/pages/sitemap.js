import React from 'react'

// Sections

// Partials
//import Link from 'components/partials/link'
import Btn from 'components/partials/btn'

// Deps
import { openModal } from 'functions/modals'

// Assets

export default class Home extends React.Component {
	render() {
		return (
			<main className="page sitemap">
				<div className="wrapper">
					<h1>Site Haritası</h1>

					<section>
						<h2>Sayfalar</h2>
						<Btn tag="link" className="btn" dark href="home" />
						<Btn tag="link" className="btn" dark href="search" />
						<Btn tag="link" className="btn" dark href="detail" params={{ id: "12345", slug: "audi-a3-30-t-premium-plus-cdi" }} />
						<Btn tag="link" className="btn" dark href="brands" />
						<Btn tag="link" className="btn" dark href="brand" params={{ id: "21446", slug: "audi" }} />
						<Btn tag="link" className="btn" dark href="dealers" />
						<Btn tag="link" className="btn" dark href="dealer" params={{ id: "12345", slug: "dogus-otomotiv" }} />
						<Btn tag="link" className="btn" dark href="listprices" />
						<Btn tag="link" className="btn" dark href="account" />
						<Btn tag="link" className="btn" dark href="notfound" />
						<Btn tag="link" className="btn" dark href="about" />
						<Btn tag="link" className="btn" dark href="reservation.info" params={{ id: "432943312" }} />
						<Btn tag="link" className="btn" dark href="reservation.payment" params={{ id: "432943312" }} />
						<Btn tag="link" className="btn" dark href="reservation.sum" params={{ id: "A5011CMinoto" }} />
						<Btn tag="link" className="btn" dark href="faq" />
						<Btn tag="link" className="btn" dark href="privacy" />
						<Btn tag="link" className="btn" dark href="contact" />
						<Btn tag="link" className="btn" dark href="blog" />
						<Btn tag="link" className="btn" dark href="blogDetail" params={{ slug: "lorem-ipsum-dolor-sit-amet" }}>Blog Detay</Btn>
						<Btn tag="link" className="btn" dark href="dealerApplication" />
					</section>

					<section>
						<h2>Komponentler</h2>
						<h3>Modallar</h3>
						<button className="btn" type="button" onClick={() => openModal('login')}>Giriş</button>
						<button className="btn" type="button" onClick={() => openModal('register')}>Üye Ol</button>
						<button className="btn" type="button" onClick={() => openModal('recovery')}>Şifremi Unuttum</button>
						<button className="btn" type="button" onClick={() => openModal('consent')}>Veri İzni</button>
						<button className="btn" type="button" onClick={() => openModal('share', { url: 'http://www.thinkerfox.com' })}>Paylaş</button>
						<button className="btn" type="button" onClick={() => openModal('options', {
							question: "Bu işlemi gerçekleştirmek istediğinize emin misiniz?",
							title: "Soru", opts: [
								{
									text: "Evet, Eminim",
									onClick: () => { alert('Evet, Emin') },
									className: "primary"
								},
								{ text: "Hayır" }
							]
						})}>Soru</button>
						<button className="btn" type="button" onClick={() => openModal('confirm', {
							question: "Bu işlemi gerçekleştirmek istediğinize emin misiniz?",
							title: "Onay",
							onConfirm: () => { alert("Onaylıyor") },
							onDeny: () => { alert("Onaylamıyor") }
						})}>Onay</button>
						<button className="btn" type="button" onClick={() => openModal('map', {
							markers: [{
								html: false,
								lat: 41.109604,
								lng: 29.022052
							}]
						})}>Harita</button>

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