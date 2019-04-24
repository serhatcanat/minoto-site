import React from 'react';

// Deps
import { Link, NavLink } from 'react-router-dom'
import routes from 'data/routes'
import omit from 'lodash/omit'

export default class LinkItem extends React.Component {
	render() {
		let to = this.props.href;
		let props = omit(this.props, ['href', 'type', 'navLink']);
		let content = this.props.children;
		let Elem = Link;
		switch(this.props.type){
			case "a":
				props.href = to;
				Elem = 'a';
			break;
			case "route":
				props.to = to;
			break;
			default:
				let target = routes[this.props.href];
				
				if(target){
					if(target.exact){ props.exact = 'true'; }
					props.to = target.path;
					content = (this.props.children ? this.props.children : (this.props.linkTitle ? target.linkTitle : target.title));
				}
				else{
					props.to = to;
				}
			break;
		}


		if(this.props.navLink){
			Elem = NavLink;
			props.activeClassName = (this.props.activeClassName ? this.props.activeClassName : 'active')
			if(props.exact === 'true'){ props.exact = true; }
		}
		
		return <Elem {...props}>{content}</Elem>
	}
}

