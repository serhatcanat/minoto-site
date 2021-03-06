import React, { Component } from 'react'
//test
// Controllers
import history from './controllers/history'
import Navigator from './controllers/navigator'

// Deps
import { Router } from 'react-router-dom'
import { checkLoginStatus } from "data/store.user"
import "@babel/polyfill";
require('intersection-observer');
//require('es6-object-assign/auto');
//require('es6-promise').polyfill();

class App extends Component {
	componentDidMount(){
		checkLoginStatus();
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
