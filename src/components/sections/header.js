import React from 'react'

// Partials
import Image from 'components/partials/image'
import Link from 'components/partials/link'
import Slider from 'components/partials/slider'
import SearchBar from 'components/partials/searchbar.js'
import Responsive from 'components/partials/responsive.js'
import Btn from 'components/partials/btn.js'

// Deps
import { openModal } from "functions/modals";
import { blockOverflow } from "functions/helpers";
import { connect } from "react-redux";
import { storageSpace } from "functions/helpers";
// Assets
import image_icon_facebook from 'assets/images/icon/facebook.svg'
import image_icon_instagram from 'assets/images/icon/instagram.svg'
import image_icon_youtube from 'assets/images/icon/youtube.svg'
import image_icon_twitter from 'assets/images/icon/twitter2.svg'
import image_logo from 'assets/images/logo.svg'
import image_logo_primary from 'assets/images/logo-primary.svg'
import image_avatar from 'assets/images/defaults/avatar.svg'

const mapStateToProps = state => {
	return {
		currentPage: state.generic.currentPage,
		user: state.user.user,
		//mobile: state.generic.mobile,
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
		this.closeMenu = this.closeMenu.bind(this);
		this.menuTimeout = false;

		this.menuScroller = React.createRef();
	}

	componentWillUnmount() {
		if (this.menuTimeout) { clearTimeout(this.menuTimeout); this.menuTimeout = false; }
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;

		if (prevState.menuOpen !== vm.state.menuOpen) {
			if (vm.menuTimeout !== false) { clearTimeout(vm.menuTimeout); }
			if (vm.state.menuOpen === true) {
				vm.setState({ menuActive: true });
				vm.menuTimeout = setTimeout(function () {
					vm.setState({ menuShow: true });
					blockOverflow(true);

					if (vm.menuScroller.current) {
						setTimeout(function () {
							console.log('upd');
							vm.menuScroller.current.instance.update();
						}, 250);
					}
				}, 20);
			}
			else {
				vm.setState({ menuShow: false });
				vm.menuTimeout = setTimeout(function () {
					vm.setState({ menuActive: false });
					blockOverflow(false);
				}, 600);
			}
		}

		if (prevProps.currentPage.key !== vm.props.currentPage.key && vm.state.menuOpen) {
			vm.setState({ menuOpen: false });
		}
	}

	toggleMenu() {
		this.setState({ menuOpen: !this.state.menuOpen });
	}

	closeMenu() {
		this.setState({ menuOpen: false })
	}

	render() {
		let vm = this;
		let user = vm.props.user;
		return (
			<header className={"section header" + (vm.state.menuActive ? ' menu-active' : '')}>
				<div className="header-wrap wrapper">
					<Link className="header-logo" href="home">
						<Image alt="Minoto" src={image_logo} />
					</Link>

					<nav className="header-nav">

						<Responsive type="only-web">
							<Link className="nav-link" navLink href="dealers">Bayiler</Link>
							<Link className="nav-link" navLink href="brands">Markalar</Link>

							{user &&
								<div className="nav-user">
									<Link className="user-item avatar" href="account.profile" title={user.fullname}>
										<Image bg src={(user.avatar ? storageSpace('profile-photos', user.avatar) : image_avatar)} />
									</Link>

									{/*<Link className="user-item notifications" href="account.notifications" title="Bildirimlerim">
										<i className="icon-notification"></i>
									</Link>*/}
								</div>
							}
							{!user &&
								<button className="nav-link" onClick={() => { openModal('register') }}>Üye Ol</button>
							}
							{!user &&
								<button className="nav-link" onClick={() => { openModal('login') }}>Giriş Yap</button>
							}
						</Responsive>

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
									<Slider className="menu-content" scrollBar ref={this.menuScroller}>
										<div className="content-innerwrap">
											<div className="menu-header">
												<Responsive type="only-web">
													<Image className="menu-logo" src={image_logo_primary} />
												</Responsive>

												<div className="menu-social">
													<a href="http://www.instagram.com/minotocom" target="_blank" rel="noopener noreferrer" title="Bizi Instagram'da Takip Edin">
														<Image src={image_icon_instagram} alt="Instagram" />
													</a>
													<a href="https://www.youtube.com/channel/UCz_v-QZCXSX8RRowWV8GrHA" target="_blank" rel="noopener noreferrer" title="Bizi YouTube'da Takip Edin">
														<Image src={image_icon_youtube} alt="YouTube" />
													</a>
													<a href="http://www.facebook.com/minotocom" target="_blank" rel="noopener noreferrer" title="Bizi Facebook'da Takip Edin">
														<Image src={image_icon_facebook} alt="Facebook" />
													</a>
													<a href="http://www.twitter.com/minotocom" target="_blank" rel="noopener noreferrer" title="Bizi Twitter'da Takip Edin">
														<Image src={image_icon_twitter} alt="Twitter" />
													</a>
												</div>
											</div>

											<Responsive type="only-mobile">
												<div className="menu-userbar">
													{user &&
														<Link className="userbar-link" href="account.profile">Hesabım</Link>
													}
													{!user &&
														<button className="userbar-link" onClick={() => { vm.toggleMenu(); openModal('register') }}>Üye Ol</button>
													}
													{!user &&
														<button className="userbar-link" onClick={() => { vm.toggleMenu(); openModal('login') }}>Giriş Yap</button>
													}
												</div>
											</Responsive>

											<ul className="menu-items">
												<li className="menu-item">
													<Link href="dealers">
														<span>Bayiler</span>
														<span className="item-count"></span>
													</Link>
												</li>
												<li className="menu-item">
													<Link href="brands">
														<span>Markalar</span>
														<span className="item-count"></span>
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
												<li className="sublinks-item" style={{ display: 'none' }}>
													<Link href="/">Araç Karşılaştır</Link>
												</li>
												<li className="sublinks-item">
													<Link href="listprices">Araç Liste Fiyatları</Link>
												</li>
												<li className="sublinks-item">
													<Link href="faq" />
												</li>
												<li className="sublinks-item">
													<Link href="dealerApplication">Yetkili Bayi'yim, Nasıl Üye Olurum?</Link>
												</li>
											</ul>

											<ul className="menu-thumblinks" style={{ display: 'none' }}>
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

											{false &&
												<div className="menu-applinks" style={{ opacity: '0' }}>
													<Btn tag="link" className="applinks-link btn block white" href="http://www.google.com" target="_blank" rel="noopener noreferrer" icon="appstore">
														Apple Store
													</Btn>
													<Btn className="applinks-link btn block white" href="http://www.google.com" target="_blank" rel="noopener noreferrer" icon="playstore">
														Google Play
													</Btn>
												</div>
											}
										</div>
									</Slider>
								</div>
								<button className="menu-overlay" onClick={vm.closeMenu}></button>
							</div>
						)}
					</nav>
				</div>
				{!vm.props.currentPage.data.hideSearchFromHeader &&
					<Responsive type="only-web">
						<SearchBar className="header-search" />
					</Responsive>
				}
			</header>
		)
	}
}

export default connect(mapStateToProps)(Header);