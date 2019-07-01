import React from 'react'

// Partials
import Image from 'components/partials/image'
import Link from 'components/partials/link'
//import Btn from 'components/partials/btn'
import Responsive from 'components/partials/responsive'
import Btn from 'components/partials/btn.js'
import { InputForm, FormInput } from 'components/partials/forms'
// Functions
import { formatNumber } from 'functions/helpers'

// Deps
import { connect } from "react-redux";
import request from 'controllers/request'

// Assets
import image_icon_facebook from 'assets/images/icon/facebook.svg'
import image_icon_instagram from 'assets/images/icon/instagram.svg'
import image_icon_youtube from 'assets/images/icon/youtube.svg'
import image_logo_white from 'assets/images/logo-white.svg'
import image_icon_twitter from 'assets/images/icon/twitter2.svg'

const mapStateToProps = state => {
	return { mobile: state.generic.mobile };
};

class Footer extends React.Component {
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

	initialize() {
		let vm = this;
		request.get('brands/footer', {}, function (payload) {
			if (payload) {
				vm.setState({
					brands: payload
				});
			}
		});
	}

	render() {
		let vm = this;
		let brands = false;

		if (vm.state.brands) {
			brands = [];
			let groupCount = (vm.props.mobile ? 2 : 6);
			let groupSize = Math.ceil(vm.state.brands.length / groupCount);

			for (let k = 0; k < groupCount; k++) {
				let group = vm.state.brands.slice(k * groupSize, (k * groupSize) + groupSize).map(function (brand, nth) {
					if (((k * groupSize) + nth) < vm.state.brands.length) {
						return brand;
					}
					else {
						return false;
					}
				});
				brands.push(group);
			}
		}

		return (
			<footer className="section footer">
				{vm.state.brands &&
					<div className="footer-brands">
						<div className="brands-wrap wrapper narrow">
							<nav className="brands-list">
								{brands.map((group, nth) => (
									<div className="list-group" key={nth}>
										{group.map((brand, nt) => (
											<div className="brands-item" key={nt}>
												<Link href={`/markalar/${brand.url}`}>
													{brand.title} {brand.count && <span className="item-count">({formatNumber(brand.count)})</span>}
												</Link>
											</div>
										))}
									</div>
								))}
							</nav>
						</div>
					</div>
				}
				<div className="footer-bottom">
					<div className="footer-wrap wrapper narrow">
						<div className="footer-col">
							<a className="footer-logo" href="/">
								<Image alt="Minoto" src={image_logo_white} />
							</a>
						</div>
						<nav className="footer-col footer-nav">
							<Responsive>
								<ul className="nav-col">
									<li>
										<Link className="footer-link" href="brands">Markalar</Link>
									</li>
									<li>
										<Link className="footer-link" href="dealers">Bayiler</Link>
									</li>
									{/*<li>
										<Link className="footer-link" href="sitemap">Site Haritası</Link>
									</li>*/}
								</ul>
								<ul className="nav-col">
									<li>
										<Link className="footer-link" href="brands">Markalar</Link>
									</li>
									<li>
										<Link className="footer-link" href="dealers">Bayiler</Link>
									</li>
									<li>
										<Link className="footer-link" href="about">Hakkında</Link>
									</li>
									<li>
										<Link className="footer-link" href="blog">Blog</Link>
									</li>
									{/*<li>
										<Link className="footer-link" href="sitemap">Site Haritası</Link>
									</li>*/}
								</ul>
							</Responsive>
							<Responsive>
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
										<Link className="footer-link" href="contact" />
									</li>
									<li>
										<Link className="footer-link" href="faq" />
									</li>
									<li>
										<Link className="footer-link" href="privacy" />
									</li>
									<li>
										<Link className="footer-link" href="gdprPolicy" />
									</li>
								</ul>
							</Responsive>
							<Responsive type="only-web">
								<ul className="nav-col">
									<li>
										<Link className="footer-link" href="faq" />
									</li>
									<li>
										<Link className="footer-link" href="privacy" />
									</li>
									<li>
										<Link className="footer-link" href="gdprPolicy" />
									</li>
								</ul>
							</Responsive>
							<div className="nav-col nav-contact">
								<div className="contact-text">
									<p className="contact-title">İletişim</p>
									<p className="contact-phone"><a href="tel:+902122833995" title="Telefon"><i className="icon-phone"></i> 0212 283 39 95</a></p>
									<p className="contact-phone"><a href="mailto:merhaba@minoto.com" title="E-Posta"><i className="icon-envelope"></i> merhaba@minoto.com</a></p>
								</div>

								<ul className="contact-social">
									<li>
										<a href="http://www.instagram.com/minotocom" target="_blank" rel="noopener noreferrer" title="Bizi Instagram'da Takip Edin">
											<Image src={image_icon_instagram} alt="Instagram" />
										</a>
									</li>
									<li>
										<a href="https://www.youtube.com/channel/UCz_v-QZCXSX8RRowWV8GrHA" target="_blank" rel="noopener noreferrer" title="Bizi YouTube'da Takip Edin">
											<Image src={image_icon_youtube} alt="YouTube" />
										</a>
									</li>
									<li>
										<a href="http://www.facebook.com/minotocom" target="_blank" rel="noopener noreferrer" title="Bizi Facebook'da Takip Edin">
											<Image src={image_icon_facebook} alt="Facebook" />
										</a>
									</li>
									<li>
										<a href="https://twitter.com/minotocom" target="_blank" rel="noopener noreferrer" title="Bizi Facebook'da Takip Edin">
											<Image src={image_icon_twitter} alt="Twitter" />
										</a>
									</li>
								</ul>
							</div>
						</nav>

						{vm.props.mobile &&
							<FooterSubscription />
						}

						<div className="footer-col">
							{!vm.props.mobile &&
								<React.Fragment>
									<h3 className="app-title" >E-BÜLTENİMİZE ÜYE OLUN</h3>
									<FooterSubscription />
								</React.Fragment>

							}
							{false &&
								<div className="footer-app" style={{ opacity: '0' }}>
									<h3 className="app-title">Mobil uygulamamızı indirdiniz mi?</h3>
									<Btn tag="a" className="app-link" white {...(vm.props.mobile ? { low: true } : {})} href="http://www.google.com" target="_blank" rel="noopener noreferrer" icon="appstore">Apple Store</Btn>
									<Btn tag="a" className="app-link" white {...(vm.props.mobile ? { low: true } : {})} href="http://www.google.com" target="_blank" rel="noopener noreferrer" icon="playstore">Google Play</Btn>
								</div>
							}

						</div>
					</div>
					<div className="footer-copyright footer-wrap wrapper narrow">
						<div className="copyright-disclaimer footer-col">
							COPYRIGHT © 2019 MINOTO. ALL RIGHTS RESERVED.
						</div>
						<div className="copyright-designby footer-col">

						</div>
					</div>
				</div>
			</footer>
		)
	}
}

export default connect(mapStateToProps)(Footer);

class FooterSubscription extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			submitting: false,
			complete: false,
		}

		this.submit = this.submit.bind(this);

		this.form = React.createRef();
	}

	submit(e) {
		let vm = this;
		vm.setState({ submitting: true });

		let record = {
			email: e.target.elements.email.value
		};

		request.post('mail/newsletter', record, function (payload) {
			if (payload.success) {
				vm.setState({ complete: true, submitting: false });
				if (vm.form.current) {
					vm.form.current.reset();
				}
			}
		}, { excludeApiPath: false });
	}

	render() {
		let vm = this;
		return (
			<InputForm className="footer-subscription" onSubmit={vm.submit} ref={vm.form}>
				<FormInput
					className="subscription-input"
					disabled={vm.state.submitting}
					placeholder="E-postanızı yazın, bizden haberler verelim."
					validation={{
						required: "E-posta adresinizi girmelisiniz.",
						email: true
					}}
					name="email"
					hideAsterisk
					type="text" />
				<div className="subscription-submitwrap">
					{vm.state.complete ?
						<button type="button" onClick={() => { vm.setState({ complete: false }) }} className="submitwrap-complete"><i className="icon-check"></i></button>
						:
						<React.Fragment>
							{vm.state.submitting ?
								<i className="submitwrap-loader icon-spinner"></i>
								:
								<button type="submit" className="submitwrap-submit"><i className="icon-angle-right"></i></button>
							}
						</React.Fragment>
					}
				</div>
				{
					vm.state.complete && (
						<React.Fragment>
							<br />
							Minoto'ya duyduğunuz ilgi için teşekkür ederiz.
						</React.Fragment>
					)
				}
			</InputForm>
		)
	}
}