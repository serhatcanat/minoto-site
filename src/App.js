import React, { Component } from 'react'

// Sections
import Header from './components/sections/header'
import Footer from './components/sections/footer'

// Controllers
import ResponsiveWatcher from './controllers/responsive-watcher'
import Navigator from './controllers/navigator'
import history from './controllers/history'

// Deps
import { Router } from 'react-router-dom'

class App extends Component {
	render() {
		return (
			<Router history={history}>
				<div id="site-content">
					<ResponsiveWatcher />
					<Header />
					<Navigator />
					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;
