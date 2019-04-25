import React from 'react'

// Partials
import Image from 'components/partials/image'
import Link from 'components/partials/link'
import Slider from 'components/partials/slider'

// Assets
import image_icon_facebook from 'assets/images/icon/facebook.svg'
import image_icon_instagram from 'assets/images/icon/instagram.svg'
import image_icon_youtube from 'assets/images/icon/youtube.svg'
import image_logo from 'assets/images/logo.svg'
import image_logo_primary from 'assets/images/logo-primary.svg'

export default class Header extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			menuOpen: false,
			menuActive: false,
			menuShow: false,
		}

		this.toggleMenu = this.toggleMenu.bind(this);
		this.menuTimeout = false;
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;
		let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

		if(prevState.menuOpen !== vm.state.menuOpen){
			if(vm.menuTimeout !== false){ clearTimeout(vm.menuTimeout); }
			if(vm.state.menuOpen === true){
				vm.setState({ menuActive: true });
				vm.menuTimeout = setTimeout(function() {
					vm.setState({ menuShow: true });
					document.documentElement.style.marginRight = scrollBarWidth + 'px'
					document.body.classList.add('block-overflow');
				}, 20);
			}
			else {
				vm.setState({ menuShow: false });
				vm.menuTimeout = setTimeout(function() {
					vm.setState({ menuActive: false });
					document.documentElement.style.marginRight = ''
					document.body.classList.remove('block-overflow');
				}, 600);
			}
		}
	}

	toggleMenu(){
		this.setState({ menuOpen : !this.state.menuOpen });
	}

	render() {
		let vm = this;
		return (
			<header className="section header">
				<div className="header-wrap wrapper">
					<Link className="header-logo" href="home">
						<Image alt="Minoto" src={image_logo} />
					</Link>

					<nav className="header-nav">
						
						<Link className="nav-link" navLink href="dealers">Tüm Bayiler</Link>
						
						<Link className="nav-link" href="/">Üye Ol</Link>
						
						<Link className="nav-link" href="/">Giriş Yap</Link>

						<button className={"nav-menubtn" + (vm.state.menuOpen ? ' open' : '')} onClick={vm.toggleMenu}>
							<div className="menubtn-inner">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
						</button>

						{vm.state.menuActive && (
							<div className={"nav-menu" + (vm.state.menuShow ? ' show' : '')}>
								<div className="menu-outerwrap">
									<Slider className="menu-content" scrollBar>
										<div className="content-innerwrap">
											<div className="menu-header">
												<Image className="menu-logo" src={image_logo_primary} />

												<div className="menu-social">
													<Link href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi Instagram'da Takip Edin">
														<Image src={image_icon_instagram} alt="Instagram" />
													</Link>
													<Link href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi YouTube'da Takip Edin">
														<Image src={image_icon_youtube} alt="YouTube" />
													</Link>
													<Link href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi Facebook'da Takip Edin">
														<Image src={image_icon_facebook} alt="Facebook" />
													</Link>
												</div>
											</div>

											<ul className="menu-items">
												<li className="menu-item">
													<Link href="/">
														<span>Bayiler</span>
														<span className="item-count">192</span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="/">
														<span>Markalar</span>
														<span className="item-count">82</span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="/">
														<span>Minoto Nedir?</span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="/">
														<span>Blog</span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="/">
														<span>İletişim</span>
													</Link>
												</li>
											</ul>

											<ul className="menu-sublinks">
												<li className="sublinks-item">
													<Link href="/">Araç Karşılaştır</Link>
												</li>
												<li className="sublinks-item">
													<Link href="/">Araç Liste Fiyatları</Link>
												</li>
												<li className="sublinks-item">
													<Link href="/">Sıkça Sorulan Sorular</Link>
												</li>
												<li className="sublinks-item">
													<Link href="/">Nasıl Bayi Olurum?</Link>
												</li>
											</ul>

											<ul className="menu-thumblinks">
												<li className="thumblinks-item">
													<Link href="/">
														<Image className="thumblinks-image" src="/dummy/images/sidemenu-thumb.jpg" />
														Volvo XC 40 İncelemesi
													</Link>
												</li>
												<li className="thumblinks-item">
													<Link href="/">
														<Image className="thumblinks-image" src="/dummy/images/sidemenu-thumb.jpg" />
														VW T-Cross İlk İnceleme
													</Link>
												</li>
											</ul>

											<div className="menu-applinks">
												<Link className="applinks-link btn block white" href="http://www.google.com" target="_blank" rel="noopener noreferrer">
													<i className="icon-appstore pre"></i> Apple Store
												</Link>
												<Link className="applinks-link btn block white" href="http://www.google.com" target="_blank" rel="noopener noreferrer">
													<i className="icon-playstore pre"></i> Google Play
												</Link>
											</div>
										</div>
									</Slider>
								</div>
							</div>
						)}
					</nav>
				</div>
			</header>
		)
	}
}