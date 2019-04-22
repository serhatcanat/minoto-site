import React, { Component } from 'react'

// Sections
import Header from './components/sections/header'
import Footer from './components/sections/footer'

// Controllers
import ResponsiveWatcher from './controllers/responsive-watcher'
import Navigator from './controllers/navigator'

class App extends Component {
	render() {
		return (
			<main id="site-content">
				<ResponsiveWatcher />
				<Header />
				<Navigator />
				<Footer />
			</main>
		);
	}
}

export default App;
