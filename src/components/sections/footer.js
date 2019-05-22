import React from 'react'

// Partials
import Image from 'components/partials/image'
import Link from 'components/partials/link'
import Btn from 'components/partials/btn'
import Responsive from 'components/partials/responsive'

// Functions
import {formatNumber} from 'functions/helpers'

// Deps
import axios from 'axios'

// Assets
import image_icon_facebook from 'assets/images/icon/facebook.svg'
import image_icon_instagram from 'assets/images/icon/instagram.svg'
import image_icon_youtube from 'assets/images/icon/youtube.svg'
import image_logo_white from 'assets/images/logo-white.svg'

export default class Footer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			brands: false,
		}

		this.initialize = this.initialize.bind(this);
	}

	componentDidMount() {
		this.initialize();
	}

	initialize(){
		let vm = this;
		axios.get('/dummy/data/footer-brands.json').then(res => {
			if(res.data.status === 'ok'){
				vm.setState({
					brands: res.data.brands
				})
			}
			else {
				console.log('error');
			}
		})
	}

	render() {
		let vm = this;
		let brands = false;

		if(vm.state.brands){
			brands = [];
			let groupCount = Math.floor(vm.state.brands.length / 6);

			for(let k = 0; k < 6; k++){
				let group = vm.state.brands.slice(k*groupCount, (k*groupCount)+groupCount).map(function(brand, nth){
					if(((k*groupCount) + nth) < vm.state.brands.length){
						return brand;
					}
					else{
						return false;
					}
				});
				brands.push(group);
			}
		}

		return (
			<footer className="section footer">
				{vm.state.brands &&
					<Responsive type="only-web">
						<div className="footer-brands">
							<div className="brands-wrap wrapper narrow">
								<nav className="brands-list">
									{brands.map((group, nth) => (
										<div className="list-group" key={nth}>
											{group.map((brand, nt) => (
												<div className="brands-item" key={nt}>
													<Link href={brand.url}>
														{brand.title} {brand.count && <span className="item-count">({formatNumber(brand.count)})</span>}
													</Link>
												</div>
											))}
										</div>
									))}
								</nav>
							</div>
						</div>
					</Responsive>
				}
				<div className="footer-bottom">
					<div className="footer-wrap wrapper narrow">
						<div className="footer-col">
								<a className="footer-logo" href="/">
									<Image alt="Minoto" src={image_logo_white} />
								</a>
						</div>
						<nav className="footer-col footer-nav">
							<ul className="nav-col">
								<li>
									<a className="footer-link" href="/">Markalar</a>
								</li>
								<li>
									<Link className="footer-link" href="dealers">Bayiler</Link>
								</li>
								<li>
									<Link className="footer-link" href="sitemap">Site Haritası</Link>
								</li>
							</ul>
							<ul className="nav-col">
								<li>
									<Link className="footer-link" href="about">Hakkında</Link>
								</li>
								<li>
									<Link className="footer-link" href="blog">Blog</Link>
								</li>
								<li>
									<Link className="footer-link" href="contact" />
								</li>
							</ul>
							<ul className="nav-col">
								<li>
									<Link className="footer-link" href="faq">Yardım</Link>
								</li>
								<li>
									<Link className="footer-link" href="faq" />
								</li>
								<li>
									<Link className="footer-link" href="privacy" />
								</li>
							</ul>
							<div className="nav-col nav-contact">
								<div className="contact-text">
									<p className="contact-title">İletişim için</p>
									<p className="contact-phone"><a href="tel:08002129898" title="Telefon"><i className="icon-phone"></i> 0800 212 98 98</a></p>
									<p className="contact-phone"><a href="mailto:info@minoto.com" title="E-Posta"><i className="icon-envelope"></i> info@minoto.com</a></p>
								</div>

								<ul className="contact-social">
									<li>
										<a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi Instagram'da Takip Edin">
											<Image src={image_icon_instagram} alt="Instagram" />
										</a>
									</li>
									<li>
										<a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi YouTube'da Takip Edin">
											<Image src={image_icon_youtube} alt="YouTube" />
										</a>
									</li>
									<li>
										<a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi Facebook'da Takip Edin">
											<Image src={image_icon_facebook} alt="Facebook" />
										</a>
									</li>
								</ul>
							</div>
						</nav>

						<div className="footer-col">
							<div className="footer-app">
								<h3 className="app-title">Mobil uygulamamızı indirdiniz mi?</h3>
								<Btn tag="a" className="app-link" white href="http://www.google.com" target="_blank" rel="noopener noreferrer" icon="appstore">Apple Store</Btn>
								<Btn tag="a" className="app-link" white href="http://www.google.com" target="_blank" rel="noopener noreferrer" icon="playstore">Google Play</Btn>
							</div>

							<form className="footer-subscription">
								<input type="text" className="subscription-input" placeholder="E-postanızı yazın, bizden haberler verelim." />
							</form>
						</div>
					</div>
					<div className="footer-copyright footer-wrap wrapper narrow">
						<div className="copyright-disclaimer footer-col">
							COPYRIGHT © 2019 MINOTO. ALL RIGHTS RESERVED.
						</div>
						<div className="copyright-designby footer-col">
							Design by <a href="http://folstudio.com/" target="_blank" rel="noopener noreferrer">Fol</a>
						</div>
					</div>
				</div>
			</footer>
		)
	}
}