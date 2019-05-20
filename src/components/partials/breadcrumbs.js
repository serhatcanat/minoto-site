import React from 'react'

// Deps


export default class Breadcrumbs extends React.Component {
	render() {
		let vm = this;
		let classes = "breadcrumbs " + vm.props.className;
		if(vm.props.standalone){ classes += ' section' }

		let content = <ul className="breadcrumbs-list">
			{vm.props.data && vm.props.data.map(function(crumb, nth){
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
			{vm.props.children && React.Children.toArray(vm.props.children).map((crumb, nth) => {
				return (
					<li key={nth} className="breadcrumbs-item">
						{crumb}
					</li>
				)
			})}
			
		</ul>

		return (
			<nav className={classes}>
				{vm.props.standalone ?
					<div className="breadcrumbs-wrap wrapper">
						{content}
					</div>
					:
					<div className="breadcrumbs-wrap">
						{content}
					</div>
				}
			</nav>
		);
	}
}

Breadcrumbs.defaultProps = {
	className: '',
	standalone: false,
}