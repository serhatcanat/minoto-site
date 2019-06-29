import React from 'react'

// Partials
import { CollapseGroup } from 'components/partials/collapse'

export default class Faq extends React.Component {
	render() {
		return (
			<main className="page content">
				<section className="section contentpage">
					<div className="contentpage-wrap wrapper narrow">
						<div className="contentpage-content">
							<h1 className="content-title">Sıkça Sorulan Sorular</h1>
							<ul className="section contentpage-faq">
								<li className="faq-item">
									<CollapseGroup label="Minoto'daki araçlar kimin?">
										<div className="wysiwyg">
											<p>Minoto'da sergilenen araçların tamamı yetkili satıcıların stoğunda bulunan araçlardır, mülkiyeti yetkili satıcılara aittir.</p>
										</div>
									</CollapseGroup>
								</li>
								<li className="faq-item">
									<CollapseGroup label="Minoto'daki araçları kim satıyor?">
										<div className="wysiwyg">
											<p>Minoto'da sergilenen araçların tamamı yetkili satıcılar tarafından satılmaktadır. Minoto satış sürecine dahil olmamaktadır.</p>
										</div>
									</CollapseGroup>
								</li>
								<li className="faq-item">
									<CollapseGroup label="Minoto komisyon alıyor mu?">
										<div className="wysiwyg">
											<p>Minoto, yapılan satışlardan ne kullanıcıdan ne de bayiden bir komisyon almaz. </p>
										</div>
									</CollapseGroup>
								</li>
								<li className="faq-item">
									<CollapseGroup label="Minoto'nun farkı nedir?">
										<div className="wysiwyg">
											<p>Minoto'nun en büyük farkı, sadece Yetkili Satıcıların showroomlarında bulunan "0 km" araç stoğunu, gerçek showroom fiyatları ile dijital platforma taşımasıdır.
											İş modeli olarak Türkiye haricinde Avrupa ve Amerika'da da sadece yetkili satıcıların "0 km" stoklarının bulunduğu başka bir platform yoktur.</p>
										</div>
									</CollapseGroup>
								</li>
								<li className="faq-item">
									<CollapseGroup label="Minoto'da teklif verilir mi?">
										<div className="wysiwyg">
											<p>Minoto'dan istediğiniz araç için bayiye teklifte bulunabilirsiniz. Ancak bu teklifin iletilebilmesi için, bayinin minimum teklif tutarının üzerinde bir teklif vermeniz gerekir.</p>
										</div>
									</CollapseGroup>
								</li>
								<li className="faq-item">
									<CollapseGroup label="Minoto'daki araçlar 2.el mi?">
										<div className="wysiwyg">
											<p>Minoto'da sergilenen araçların hepsi "0 km"dir ve hepsi yetkili satıcıların stoğundadır.</p>
										</div>
									</CollapseGroup>
								</li>
								<li className="faq-item">
									<CollapseGroup label="Minoto'da aracımı sergileyebilir miyim?">
										<div className="wysiwyg">
											<p>Minoto'da sadece yetkili satıcılar araçlarını sergileyebilir, şahıslar, 2.el ticareti yapan galeriler, filo şirketleri ve benzeri kurumlar sergileme yapamaz. Eğer bir yetkili satıcı iseniz buradan Minoto'ya başvurabilirsiniz.</p>
										</div>
									</CollapseGroup>
								</li>
							</ul>
						</div>
					</div>
				</section>
			</main>

		)
	}
}