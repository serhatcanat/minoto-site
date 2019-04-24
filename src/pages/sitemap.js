import React from 'react'

// Sections

// Partials
import Link from 'components/partials/link'

// Assets

export default class Home extends React.Component {
	render () {
		return (
			<main className="page sitemap">
				<div className="wrapper">
					<h1>Site Haritası</h1>
					<p><Link href="home" /></p>
				</div>
			</main>

		)
	}
}