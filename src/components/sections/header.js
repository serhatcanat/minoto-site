import React from 'react'

// Assets
import image_logo from 'assets/images/logo.svg'

export default class Header extends React.Component {
	render() {
		return (
			<header className="section header">
				<div className="header-wrap wrapper">
					<a className="header-logo" href="/">
						<img alt="Minoto" src={image_logo} />
					</a>

					<nav className="header-nav">
						
						<a className="nav-link" href="/">Tüm Bayiler</a>
						
						<a className="nav-link" href="/">Üye Ol</a>
						
						<a className="nav-link" href="/">Giriş Yap</a>

						<button className="nav-menubtn">
							<div className="menubtn-inner">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</button>
					</nav>
				</div>
			</header>
		)
	}
}