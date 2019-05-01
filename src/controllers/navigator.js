import React from 'react'

// Sections
import Header from 'components/sections/header'
import Footer from 'components/sections/footer'

// Modals
import LoginModal from 'components/modals/login'
import ConsentModal from 'components/modals/consent'

// Controllers
import ResponsiveWatcher from 'controllers/responsive-watcher'
import ModalsWrap from 'controllers/modals-wrap'

// Deps
import { Route, matchPath, Switch } from 'react-router-dom'
import history from 'controllers/history'
import { setTitle, setMeta, setHead } from 'controllers/head'
import routes from 'data/routes'
import store from "data/store";
import { setPage } from "data/store.generic";

// Pages
import Home from 'pages/home'
import Sitemap from 'pages/sitemap'
import Dealers from 'pages/dealers'
import Dealer from 'pages/dealer'
import Detail from 'pages/detail'
import ListPrices from 'pages/listprices'
import About from 'pages/about'
import Account from 'pages/account'

import NotFound from 'pages/notfound'

const pageRegistry = {
	Home: Home,
	Sitemap: Sitemap,
	Dealer: Dealer,
	Dealers: Dealers,
	Detail: Detail,
	ListPrices: ListPrices,
	About: About,
	Account: Account,
	NotFound: NotFound,
}

export default class Navigator extends React.Component {
	componentDidMount() {
		window.dynamicHistory = history;

		history.listen(function (e) {
			changePage(getRoute(e.pathname, false, true));
		});

		changePage(getRoute(false, false, true));
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
			<div className="site-content">
				<ResponsiveWatcher />
				<Header />
				<Switch>
					{data}
				</Switch>
				<Footer />
				<ModalsWrap>
					<LoginModal />
					<ConsentModal />
				</ModalsWrap>
			</div>
		)
	}
}

export function ListingLink (params) {
	return '/ara/?' + params.map(function(param, nth){
		return param.key + '=' + param.val;
	});
}

export function getRoute(url = false, getObject = false, includeCatch = false){
	if(url === false) { url = window.location.pathname.replace(/\/$/, ''); }
	let returnRoute = false;
	let catchRoute = false;
	Object.keys(routes).forEach((key, index) => {
		let route = routes[key];
		if(route.path){
			let match = matchPath(url, route.path);
			if (match && match.isExact) {
				returnRoute = (getObject ? route : key);
			}
		}
		else if(includeCatch) {
			catchRoute = (getObject ? route : key);
		}
	});

	return (returnRoute ? returnRoute : catchRoute);
}

export function getCurrentRoute(url = false, includeCatch = true){
	return getRoute(url, true, includeCatch);
}

export function changeURLParam(value, param, route = false, noMismatch = false) {
	let routeObject = (route === false ? getCurrentRoute() : routes[route]);
	let data = false;

	if(routeObject){
		data = routeObject.path.replace(':'+param+'?', value).replace(':'+param, value);
		if(noMismatch && data === routeObject.path){
			data = false;
		}
	}

	return data;
}

export function changePage(key){
	let route = routes[key];
	setTitle(route.title);
	let pageData = {
		key: key,
		data: route
	}
	if(store.getState().generic.currentPage.key !== key){
		window.scroll(0, 0);
		store.dispatch(setPage(pageData));
	}
	
	setMeta((route.meta ? route.meta : false), true);
	setHead((route.head ? route.head : false), true);
}