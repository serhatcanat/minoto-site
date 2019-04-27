import React, { Component } from 'react'

// Sections
import Header from './components/sections/header'
import Footer from './components/sections/footer'

// Modals
import LoginModal from './components/modals/login'
import ConsentModal from './components/modals/consent'

// Controllers
import ResponsiveWatcher from './controllers/responsive-watcher'
import Navigator from './controllers/navigator'
import history from './controllers/history'
import ModalsWrap from './controllers/modals-wrap'

// Deps
import { Router } from 'react-router-dom'
//import { openModal } from 'functions/modals'

class App extends Component {
	/*componentDidMount(){
		let vm = this;
	}*/

	render() {
		return (
			<Router history={history}>
				<div id="site-content">
					<ResponsiveWatcher />
					<Header />
					<Navigator />
					<Footer />
					<ModalsWrap>
						<LoginModal />
						<ConsentModal />
					</ModalsWrap>
				</div>
			</Router>
		);
	}
}

export default App;
