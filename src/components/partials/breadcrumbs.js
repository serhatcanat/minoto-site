import React from 'react'

// Deps

// Partials
import Link from 'components/partials/link'


export default class Breadcrumbs extends React.Component {
	render() {
		let vm = this;
		let classes = "breadcrumbs " + vm.props.className;
		if(vm.props.standalone){ classes += ' section' }

		let content = <ul className="breadcrumbs-list">
			{vm.props.data && vm.props.data.map(function(crumb, nth){
				return (
					<li key={nth} className="breadcrumbs-item">
						{crumb.href ?
							<Link href={crumb.href} params={crumb.params}>
								{crumb.title}
							</Link>
							:
							<span>{crumb.title}</span>
						}
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