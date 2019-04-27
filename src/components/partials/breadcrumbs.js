import React from 'react'

// Deps


export default class Breadcrumbs extends React.Component {
	render() {
		return (
			<nav className={"breadcrumbs " + this.props.className}>
				<ul className="breadcrumbs-list">
					{this.props.data.map(function(crumb, nth){
						let href = crumb.href;
						let title = crumb.title
						return (
							<li key={nth} className="breadcrumbs-item">
								<a href={href}>
									{title}
								</a>
							</li>
						)
					})}
				</ul>
			</nav>
		);
	}
}

Breadcrumbs.defaultProps = {
	className: ''
}