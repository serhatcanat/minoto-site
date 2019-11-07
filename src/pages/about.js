import React from 'react'

// Sections

// Partials
import Image from 'components/partials/image'
import Link from 'components/partials/link'
import Slider from 'components/partials/slider'

// Deps
import { connect } from "react-redux";

// Assets
import image_icon_linkedin from 'assets/images/icon/linkedin.svg'
//import image_icon_facebook from 'assets/images/icon/facebook.svg'
//import image_icon_instagram from 'assets/images/icon/instagram.svg'
//import image_icon_youtube from 'assets/images/icon/youtube.svg'

const mapStateToProps = state => {
	return { mobile: state.generic.mobile };
};

class About extends React.Component {

	render() {
		let GalleryContainer = (this.props.mobile ? Slider : 'div');
		let galleryProps = (this.props.mobile ? { slides: 2 } : {});

		return (
			<main className="page about">
				<section className="section about-head">
					<h1 className="head-title" style={{ textTransform: 'none' }}>Minoto</h1>
					<h2 className="head-subtitle">Türkiye'nin sıfır km otomobil sitesi</h2>
				</section>

				<section className="section about-intro">
					<div className="wrapper narrow">
						<Image className="intro-image" src="/dummy/images/minoto.jpg" />

						<div className="intro-text wysiwyg" style={{ paddingBottom: '0' }}>
							<strong>Minoto</strong>, Türkiye Otomotiv Sektörü’nün dijitalleşmesine katkıda bulunacak ve sektörü yeni çağa taşıyacak bir online platformdur.
						<br /><br />
							İçerisinde <strong>sadece Yetkili Bayi’lerin</strong> olduğu ve <strong>sadece “0 km” araçların</strong> gerçek fotoğrafları ve fiyatları ile sergilendiği bir ilan sitesi, pazar yeri ve ötesidir.
						<br /><br />
							<strong>“Minimum efor, maksimum oto!”</strong> anlayışıyla yola çıkarak Türkiye’de bir ilke imza atan, bayiler tarafından satışa sunulan sıfır kilometre otomobillerin güncel fotoğraf ve bilgilerini, tüketicilerle buluşturan dijital pazar yeri <strong>Minoto</strong>’ya üye olan bayiler, stoklarındaki araçları platforma yükleyerek, otomobil ve hafif ticari araç satın almayı planlayan ülkenin her yerindeki kişilere ulaşabilecekler. <strong>Minoto</strong> sayesinde müşteriler; üye bayilerin sisteme girdiği dijital stoklarından satın almak için aradıkları araçların rengini, döşemesini, motor / şanzıman kombinasyonunu, donanımlarını olduğu gibi görebilme imkanı elde edecek.
						</div>
					</div>
				</section>

				<section className="section about-counts" style={{ display: 'none' }}>
					<div className="counts-wrap wrapper narrow">
						<div className="counts-item">
							<span className="item-num">1.5M</span>
							<strong className="item-title">Toplam <br className="only-mobile" />Bireysel Üye</strong>
						</div>
						<div className="counts-item">
							<span className="item-num">2.8M</span>
							<strong className="item-title">Aylık Farklı <br className="only-mobile" />Ziyaretçi</strong>
						</div>
						<div className="counts-item">
							<span className="item-num">38M</span>
							<strong className="item-title">Aylık Toplam Sayfa <br className="only-mobile" />Görüntülenmesi</strong>
						</div>
					</div>
				</section>

				<section className="section about-brands">
					<div className="brands-wrap wrapper narrow">
						<Image className="brands-image" src="/dummy/images/about-imgs2.png" mobile="/dummy/images/about-imgs-mobile2.png" />

						<div className="brands-content">
							<h3 className="content-title">10'larca otomobil markası ve yüzlerce bayi Minoto'da</h3>

							<div className="content-text wysiwyg">
								<p>Tüketicilere, <strong>Minoto</strong> aracılığıyla istedikleri araçları, nerede olursa olsun bulabilme ve bayiler ile irtibata geçerek teklif verip satın alabilme imkanı sunuluyor. Böylece <strong>Minoto</strong>, ikinci el araç alım satımındaki dijital platform mantığını, tamamen yenilikçi bir anlayış ile sıfır otomobil ve hafif ticari araç alımlarında da kuracak yepyeni bir pazar yeri oluşturmayı hedefliyor. Online satışın yapılmadığı yalnızca üye bayilerin araçlarının sergilendiği platform, bayiler için önemli bir satış kanalı oluşturmayı, perakende satış noktasında otomotiv pazarına ciddi bir hareketlilik getirmeyi amaçlıyor.</p>
							</div>
						</div>
					</div>
				</section>

				<section className="section about-team">
					<h3 className="team-title">Ekibimiz</h3>
					<div className="team-wrap wrapper narrow">
						<GalleryContainer className="team-container" {...galleryProps}>
							{/*<div className="team-member" style={{ border: 'none' }}></div>*/}

							<div className="team-member">
								<Image className="member-image" style={{ border: "1px solid #f2f2f2" }} src="/dummy/images/ferhat_albayrak2.JPG" bg contain abs alt="Ferhat Albayrak" />
								<div className="member-content">
									<strong className="member-position">Founder & CEO</strong>
									<h4 className="member-name">Ferhat Albayrak</h4>

									<div className="member-contact">
										<Link type="a" title="Ferhat Albayrak LinkedIn Profili" href="https://tr.linkedin.com/in/ferhatalbayrak" target="_blank" rel="nofollow">
											<Image src={image_icon_linkedin} alt="LinkedIn" />
										</Link>
									</div>
								</div>
							</div>

							<div className="team-member">
								<Image className="member-image" src="/dummy/images/kaan_boyner.png" bg contain abs alt="Kaan Boyner" />
								<div className="member-content">
									<strong className="member-position">Co-Founder</strong>
									<h4 className="member-name">Kaan Boyner</h4>

									<div className="member-contact">

									</div>
								</div>
							</div>

							{/*<div className="team-member" style={{ border: 'none' }}></div>*/}
						</GalleryContainer>
					</div>
				</section>
			</main>

		)
	}
}

export default connect(mapStateToProps)(About);
