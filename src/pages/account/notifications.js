import React from 'react'

// Partials
//import Btn from 'components/partials/btn'

// Deps
//import { connect } from "react-redux"
import { setTitle } from 'controllers/head'

export default class Notifications extends React.Component {

	componentDidMount() {
		setTitle('Bildirimlerim');
	}

	render () {
		//let vm = this;
		return (
			<section className="section account-notifications">
				<div className="wrapper narrow">
					<h1>Bildirimler..</h1>
				</div>
			</section>
		)
	}
}