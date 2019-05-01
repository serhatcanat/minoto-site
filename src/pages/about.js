import React from 'react'

// Sections

// Partials
import Image from 'components/partials/image'
import Link from 'components/partials/link'

// Deps

// Assets
import image_icon_linkedin from 'assets/images/icon/linkedin.svg'
//import image_icon_facebook from 'assets/images/icon/facebook.svg'
//import image_icon_instagram from 'assets/images/icon/instagram.svg'
//import image_icon_youtube from 'assets/images/icon/youtube.svg'

export default class About extends React.Component {

	render () {
		return (
			<main className="page about">
				<section className="section about-head">
					<h1 className="head-title">Minoto</h1>
					<h2 className="head-subtitle">Türkiye'nin sıfır km otomobil sitesi</h2>
				</section>

				<section className="section about-intro">
					<div className="wrapper narrow">
						<Image className="intro-image" src="/dummy/images/about-image.jpg" />

						<div className="intro-text wysiwyg">
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
						</div>
					</div>
				</section>

				<section className="section about-counts">
					<div className="counts-wrap wrapper narrow">
						<div className="counts-item">
							<span className="item-num">1.5M</span>
							<strong className="item-title">Toplam Bireysel Üye</strong>
						</div>
						<div className="counts-item">
							<span className="item-num">2.8M</span>
							<strong className="item-title">Aylık Farklı Ziyaretçi</strong>
						</div>
						<div className="counts-item">
							<span className="item-num">38M</span>
							<strong className="item-title">Aylık Toplam Sayfa Göüntülenmesi</strong>
						</div>
					</div>
				</section>

				<section className="section about-brands">
					<div className="brands-wrap wrapper narrow">
						<Image className="brands-image" src="/dummy/images/about-imgs.png" />

						<div className="brands-content">
							<h3 className="content-title">100'den fazla otomobil markası ve binlerce bayi minoto'da</h3>

							<div className="content-text wysiwyg">
								<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
							</div>
						</div>
					</div>
				</section>

				<section className="section about-team">
					<h3 className="team-title">Ekibimiz</h3>
					<div className="team-wrap wrapper narrow">
						<div className="team-member">
							<Image className="member-image" src="/dummy/images/profile-picture.jpg" bg alt="Kaan Boyner" />
							<div className="member-content">
								<strong className="member-position">CEO</strong>
								<h4 className="member-name">Kaan Boyner</h4>

								<div className="member-contact">
									<Link tag="a" title="Kaan Boyner LinkedIn Profili" href="http://www.linkedin.com" target="_blank" rel="nofollow">
										<Image src={image_icon_linkedin} alt="LinkedIn" />
									</Link>
								</div>
							</div>
						</div>

						<div className="team-member">
							<Image className="member-image" src="/dummy/images/profile-picture.jpg" bg alt="Ferhat Albayrak" />
							<div className="member-content">
								<strong className="member-position">CEO</strong>
								<h4 className="member-name">Ferhat Albayrak</h4>

								<div className="member-contact">
									<Link tag="a" title="Ferhat Albayrak LinkedIn Profili" href="http://www.linkedin.com" target="_blank" rel="nofollow">
										<Image src={image_icon_linkedin} alt="LinkedIn" />
									</Link>
								</div>
							</div>
						</div>

						<div className="team-member">
							<Image className="member-image" src="/dummy/images/profile-picture.jpg" bg alt="Kaan Boyner" />
							<div className="member-content">
								<strong className="member-position">CEO</strong>
								<h4 className="member-name">Kaan Boyner</h4>

								<div className="member-contact">
									<Link tag="a" title="Kaan Boyner LinkedIn Profili" href="http://www.linkedin.com" target="_blank" rel="nofollow">
										<Image src={image_icon_linkedin} alt="LinkedIn" />
									</Link>
								</div>
							</div>
						</div>

						<div className="team-member">
							<Image className="member-image" src="/dummy/images/profile-picture.jpg" bg alt="Ferhat Albayrak" />
							<div className="member-content">
								<strong className="member-position">CEO</strong>
								<h4 className="member-name">Ferhat Albayrak</h4>

								<div className="member-contact">
									<Link tag="a" title="Ferhat Albayrak LinkedIn Profili" href="http://www.linkedin.com" target="_blank" rel="nofollow">
										<Image src={image_icon_linkedin} alt="LinkedIn" />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

		)
	}
}