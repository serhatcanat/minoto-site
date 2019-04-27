import React from 'react'

// Deps
import { Route } from 'react-router-dom'
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