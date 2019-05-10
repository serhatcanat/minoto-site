import React, { Component } from 'react'

// Controllers
import history from './controllers/history'
import Navigator from './controllers/navigator'

// Deps
import { Router } from 'react-router-dom'
//import { openModal } from 'functions/modals'

class App extends Component {
	componentDidMount(){
		//openModal('login');
	}

	render() {
		return (
			<Router history={history}>
				<Navigator />
			</Router>
		);
	}
}

export default App;
