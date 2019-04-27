import React from 'react'

// Sections

// Partials
import Breadcrumbs from 'components/partials/breadcrumbs'

// Deps
import { ListingLink } from 'controllers/navigator'
import { openModal } from "functions/modals";

// Assets

export default class Dealers extends React.Component {
	render () {
		return (
			<main className="page detail">
				<section className="section detail-top">
					<div className="top-wrap wrapper">
						<Breadcrumbs className="top-breadcrumbs" data={[
							{
								"href": ListingLink([{ 'key': 'tip', 'val': 'otomobil' }]),
								"title": "Otomobil"
							},
							{
								"href": ListingLink([
									{ 'key': 'tip', 'val': 'otomobil' },
									{ 'key': 'marka', 'val': 'audi' },
								]),
								"title": "Audi"
							},
							{
								"href": ListingLink([
									{ 'key': 'tip', 'val': 'otomobil' },
									{ 'key': 'marka', 'val': 'audi' },
									{ 'key': 'model', 'val': 'a3' },
								]),
								"title": "A3"
							},
							{
								"href": ListingLink([
									{ 'key': 'tip', 'val': 'otomobil' },
									{ 'key': 'marka', 'val': 'audi' },
									{ 'key': 'model', 'val': 'a3' },
									{ 'key': 'kasa', 'val': 'a3-sportsback' },
								]),
								"title": "A3 Sportback"
							},
							{
								"href": ListingLink([
									{ 'key': 'tip', 'val': 'otomobil' },
									{ 'key': 'marka', 'val': 'audi' },
									{ 'key': 'model', 'val': 'a3' },
									{ 'key': 'kasa', 'val': 'a3-sportsback' },
								]),
								"title": "1.8 TDI"
							},
							{
								"href": ListingLink([
									{ 'key': 'tip', 'val': 'otomobil' },
									{ 'key': 'marka', 'val': 'audi' },
									{ 'key': 'model', 'val': 'a3' },
									{ 'key': 'kasa', 'val': 'a3-sportsback' },
								]),
								"title": "Ambiente"
							}
						]} />

						<div className="top-controls">
							<span className="controls-viewers">5 kişi bakıyor</span>
							<span className="controls-date">07.12.2018</span>
							<button className="controls-btn"><i className="icon-heart-empty"></i> Favorilere Ekle</button>
							<button className="controls-btn"><i className="icon-compare"></i> Karşılaştır (3)</button>
							<button className="controls-btn" onClick={() => openModal({action: 'share', 'url': 'http//www.google.com/'})}><i className="icon-share"></i> Paylaş</button>
						</div>
					</div>
				</section>

				<section className="section detail-content">
					<div className="content-wrap wrapper">
						<div className="content-left">
							Sol alan
						</div>

						<div className="content-right">
							Sağ alan
						</div>
					</div>
				</section>
			</main>

		)
	}
}