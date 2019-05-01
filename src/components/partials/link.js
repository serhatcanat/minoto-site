import React from 'react';

// Deps
import { Link, NavLink } from 'react-router-dom'
import routes from 'data/routes'
import omit from 'lodash/omit'

export default class LinkItem extends React.Component {
	render() {
		let to = this.props.href;
		let props = omit(this.props, ['href', 'type', 'navLink', 'params']);
		let params = this.props.params;
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
					content = (this.props.children ? this.props.children : (this.props.linkTitle ? target.linkTitle : target.title));

					if(target.path){
						props.to = target.path
						if(params){
							for(let k = 0; k < Object.keys(params).length; k++){
								let key = Object.keys(params)[k];
								props.to = props.to.replace(':'+key+'?', params[key]).replace(':'+key, params[key]);
							}
						}
					}
					else{
						props.to = "-";
					}
				}
				else {
					props.to = this.props.href;
				}

				props.to = props.to.split('/:')[0];

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

LinkItem.defaultProps = {
	navLink: false,
	params: false,
}