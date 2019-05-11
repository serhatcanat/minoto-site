import React from 'react'

// Partials
import Image from 'components/partials/image'
import Link from 'components/partials/link'
import Slider from 'components/partials/slider'
import SearchBar from 'components/partials/searchbar.js'

// Deps
import { openModal } from "functions/modals";
import { blockOverflow } from "functions/helpers";
import { connect } from "react-redux";

// Assets
import image_icon_facebook from 'assets/images/icon/facebook.svg'
import image_icon_instagram from 'assets/images/icon/instagram.svg'
import image_icon_youtube from 'assets/images/icon/youtube.svg'
import image_logo from 'assets/images/logo.svg'
import image_logo_primary from 'assets/images/logo-primary.svg'

const mapStateToProps = state => {
	return {
		currentPage: state.generic.currentPage,
		user: state.user.user,
	};
};

class Header extends React.Component {
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

	componentWillUnmount() {
		if(this.menuTimeout){ clearTimeout(this.menuTimeout); this.menuTimeout = false; }
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;

		if(prevState.menuOpen !== vm.state.menuOpen){
			if(vm.menuTimeout !== false){ clearTimeout(vm.menuTimeout); }
			if(vm.state.menuOpen === true){
				vm.setState({ menuActive: true });
				vm.menuTimeout = setTimeout(function() {
					vm.setState({ menuShow: true });
					blockOverflow(true);
				}, 20);
			}
			else {
				vm.setState({ menuShow: false });
				vm.menuTimeout = setTimeout(function() {
					vm.setState({ menuActive: false });
					blockOverflow(false);
				}, 600);
			}
		}

		if(prevProps.currentPage.key !== vm.props.currentPage.key && vm.state.menuOpen){
			vm.setState({menuOpen: false});
		}
	}

	toggleMenu(){
		this.setState({ menuOpen : !this.state.menuOpen });
	}

	render() {
		let vm = this;
		let user = vm.props.user;
		return (
			<header className="section header">
				<div className="header-wrap wrapper">
					<Link className="header-logo" href="home">
						<Image alt="Minoto" src={image_logo} />
					</Link>

					<nav className="header-nav">
						
						<Link className="nav-link" navLink href="dealers">Tüm Bayiler</Link>
						
						{user &&
							<div className="nav-user">
								<Link className="user-item avatar" href="account.profile" title={user.fullname}>
									<Image bg src={user.avatar} />
								</Link>

								<Link className="user-item notifications" href="account.notifications" title="Bildirimlerim">
									<i className="icon-notification"></i>
								</Link>
							</div>
						}
						{!user &&
							<button className="nav-link" onClick={() => {openModal('register')}}>Üye Ol</button>
						}
						{!user &&
							<button className="nav-link" onClick={() => {openModal('login')}}>Giriş Yap</button>
						}

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
													<Link href="dealers">
														<span>Bayiler</span>
														<span className="item-count">192</span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="brands">
														<span>Markalar</span>
														<span className="item-count">82</span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="about">
														<span>Minoto Nedir?</span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="blog">
														<span>Blog</span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="contact">
														<span>İletişim</span>
													</Link>
												</li>
											</ul>

											<ul className="menu-sublinks">
												<li className="sublinks-item">
													<Link href="/">Araç Karşılaştır</Link>
												</li>
												<li className="sublinks-item">
													<Link href="listprices">Araç Liste Fiyatları</Link>
												</li>
												<li className="sublinks-item">
													<Link href="faq" />
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
				{!vm.props.currentPage.data.hideSearchFromHeader &&
					<SearchBar className="header-search" />
				}
			</header>
		)
	}
}

export default connect(mapStateToProps)(Header);