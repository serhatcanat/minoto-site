import React from 'react'

// Partials
import Image from 'components/partials/image'

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
		if(prevState.menuOpen !== vm.state.menuOpen){
			if(vm.menuTimeout !== false){ clearTimeout(vm.menuTimeout); }
			if(vm.state.menuOpen === true){
				vm.setState({ menuActive: true });
				vm.menuTimeout = setTimeout(function() {
					vm.setState({ menuShow: true });
				}, 20);
			}
			else {
				vm.setState({ menuShow: false });
				vm.menuTimeout = setTimeout(function() {
					vm.setState({ menuActive: false });
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
					<a className="header-logo" href="/">
						<Image alt="Minoto" src={image_logo} />
					</a>

					<nav className="header-nav">
						
						<a className="nav-link" href="/">Tüm Bayiler</a>
						
						<a className="nav-link" href="/">Üye Ol</a>
						
						<a className="nav-link" href="/">Giriş Yap</a>

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
								<div className="menu-content">
									<div className="content-innerwrap">
										<div className="menu-header">
											<Image className="menu-logo" src={image_logo_primary} />

											<div className="menu-social">
												<a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi Instagram'da Takip Edin">
													<Image src={image_icon_instagram} alt="Instagram" />
												</a>
												<a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi YouTube'da Takip Edin">
													<Image src={image_icon_youtube} alt="YouTube" />
												</a>
												<a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Bizi Facebook'da Takip Edin">
													<Image src={image_icon_facebook} alt="Facebook" />
												</a>
											</div>
										</div>

										<ul className="menu-items">
											<li className="menu-item">
												<a href="/">
													<span>Bayiler</span>
													<span className="item-count">192</span>
												</a>
											</li>
											<li className="menu-item">
												<a href="/">
													<span>Markalar</span>
													<span className="item-count">82</span>
												</a>
											</li>
											<li className="menu-item">
												<a href="/">
													<span>Minoto Nedir?</span>
												</a>
											</li>
											<li className="menu-item">
												<a href="/">
													<span>Blog</span>
												</a>
											</li>
											<li className="menu-item">
												<a href="/">
													<span>İletişim</span>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						)}
					</nav>
				</div>
			</header>
		)
	}
}