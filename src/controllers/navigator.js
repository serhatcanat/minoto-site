import React from 'react'

// Deps
import { Route, matchPath } from 'react-router-dom'
import history from 'controllers/history'
import routes from 'data/routes'

// Pages
import Home from 'pages/home'
import Sitemap from 'pages/sitemap'
import Dealers from 'pages/dealers'
import Detail from 'pages/detail'

const pageRegistry = {
	Home: Home,
	Sitemap: Sitemap,
	Dealers: Dealers,
	Detail: Detail,
}

export default class Navigator extends React.Component {
	componentDidMount() {
		window.dynamicHistory = history;

		history.listen(function (e) {
			console.log(e);
		});
	}

	renderRoutes(){
		//let vm = this

		return Object.keys(routes).map((key, index) => {
			let route = routes[key]
			let routeProps = {
				key: index,
				exact: route.exact,
				component: pageRegistry[route.component],
				name: route.component
			}

			if (route.path) {
				routeProps.path = route.path
			}

			return <Route {...routeProps} />
		})
	}

	render () {
		let data = this.renderRoutes();
		return (
			<main className="content-main">
				{data}
			</main>
		)
	}
}

export function ListingLink (params) {
	return '/ara/?' + params.map(function(param, nth){
		return param.key + '=' + param.val;
	});
}

export function getActiveRouteKey(url = false, getObject = false){
	if(url === false) { url = window.location.pathname.replace(/\/$/, ''); }

	let returnData = false;

	Object.keys(routes).forEach((key, index) => {
		let route = routes[key];
		let match = matchPath(url, route.path);
		if (match && match.isExact) {
			returnData = (getObject ? route : key);
		}
	});

	return returnData;
}

export function getActiveRoute(url = false){
	return getActiveRouteKey(url, true);
}

export function changeURLParam(value, param, route = false, noMismatch = false) {
	let routeObject = (route === false ? getActiveRoute() : routes[route]);
	let data = false;

	if(routeObject){
		data = routeObject.path.replace(':'+param+'?', value).replace(':'+param, value);
		if(noMismatch && data === routeObject.path){
			data = false;
		}
	}

	return data;
}