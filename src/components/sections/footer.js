import React from 'react'

// Partials
import Image from 'components/partials/image'

// Assets
import image_icon_facebook from 'assets/images/icon/facebook.svg'
import image_icon_instagram from 'assets/images/icon/instagram.svg'
import image_icon_youtube from 'assets/images/icon/youtube.svg'
import image_logo_white from 'assets/images/logo-white.svg'

export default class Footer extends React.Component {
	render() {
		return (
			<footer className="section footer">
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
								<a className="footer-link" href="/">Bayiler</a>
							</li>
						</ul>
						<ul className="nav-col">
							<li>
								<a className="footer-link" href="/">Hakkında</a>
							</li>
							<li>
								<a className="footer-link" href="/">Blog</a>
							</li>
							<li>
								<a className="footer-link" href="/">İletişim</a>
							</li>
						</ul>
						<ul className="nav-col">
							<li>
								<a className="footer-link" href="/">Yardım</a>
							</li>
							<li>
								<a className="footer-link" href="/">Sıkça Sorulan Sorular</a>
							</li>
							<li>
								<a className="footer-link" href="/">Kullanıcı Sözleşmesi</a>
							</li>
						</ul>
						<div className="nav-col nav-contact">
							<p className="contact-title">İletişim için</p>
							<p className="contact-phone"><a href="tel:08002129898" title="Telefon"><i className="icon-phone"></i> 0800 212 98 98</a></p>
							<p className="contact-phone"><a href="mailto:info@minoto.com" title="E-Posta"><i className="icon-envelope"></i> info@minoto.com</a></p>

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

					<div className="nav-col">
						<div className="nav-app">
							<h3 className="app-title">Mobil uygulamamızı indirdiniz mi?</h3>
							<a className="app-link btn white" href="http://www.google.com" target="_blank" rel="noopener noreferrer">
								<i className="icon-appstore pre"></i> Apple Store
							</a>
							<a className="app-link btn white" href="http://www.google.com" target="_blank" rel="noopener noreferrer">
								<i className="icon-playstore pre"></i> Google Play
							</a>
						</div>

						<form className="nav-subscription">
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
			</footer>
		)
	}
}