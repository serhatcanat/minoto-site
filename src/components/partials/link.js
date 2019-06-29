import React from 'react';

// Deps
import { Link, NavLink } from 'react-router-dom'
import omit from 'lodash/omit'
import { isDefined } from 'functions/helpers'
import { getRoute } from 'controllers/navigator'

export default class LinkItem extends React.Component {
	render() {
		let to = this.props.href;
		let props = omit(this.props, ['href', 'type', 'navLink', 'params', 'routeGroup', 'activeClassName']);
		let params = this.props.params;
		let content = this.props.children;
		let type = this.props.type;
		let Elem = Link;

		if(this.props.navLink){
			Elem = NavLink;
			props.activeClassName = this.props.activeClassName
		}

		switch(type){
			case "a":
				props.href = to;
				Elem = 'a';
			break;
			case "route":
				props.to = to;
			break;
			default: // link
				let target = getRoute(this.props.href, this.props.routeGroup);
				
				if(target){

					if(target.exact && this.props.navLink && !isDefined(props.exact)){ props.exact = true; }
					content = (this.props.children ? this.props.children : (target.linkTitle ? target.linkTitle : target.title));

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
		
		return <Elem {...props}>{content}</Elem>
	}
}

LinkItem.defaultProps = {
	navLink: false,
	params: false,
	type: 'link',
	routeGroup: 'pages',
	activeClassName: 'active',
}