import React from 'react'
import { Router, Route } from 'react-router-dom'
import history from 'controllers/history'

// Pages
import Home from 'pages/home'

export default class Navigator extends React.Component {
	render () {
		return (
			<Router history={history}>
				<Route path="/" exact component={Home} />
			</Router>
		)
	}
}