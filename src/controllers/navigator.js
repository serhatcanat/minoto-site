import React from 'react'

// Sections
import Header from 'components/sections/header'
import Footer from 'components/sections/footer'

// Partials
import SearchBar from 'components/partials/searchbar'
import ConsentBar from 'components/partials/consentbar'

// Modals
import LoginModal from 'components/modals/login'
import RegisterModal from 'components/modals/register'
import RecoveryModal from 'components/modals/recovery'
import ConsentModal from 'components/modals/consent'
import MapModal from 'components/modals/map'
import BidModal from 'components/modals/bid'
import CreditModal from 'components/modals/credit'
import MessageModal from 'components/modals/message'
import YoutubeModal from 'components/modals/youtube'

// Controllers
import ResponsiveWatcher from 'controllers/responsive-watcher'
import ModalsWrap from 'controllers/modals-wrap'
import MessengerWrap from 'controllers/messenger'
import GAController from 'controllers/ga'

// Deps
import { Route, matchPath, Switch, Redirect } from 'react-router-dom'
import history from 'controllers/history'
import { setTitle, setMeta, setHead, setDescription } from 'controllers/head'
import routes from 'data/routes'
import store from "data/store";
import { setPage, setPageNotFound } from "data/store.generic";
import { resetListingData } from "data/store.listing";
import { resetData } from "data/store.ga";
//import { GA } from 'controllers/ga'
import extend from "lodash/extend";
import { connect } from "react-redux";


// Pages
import Home from 'pages/home'
import Posts from 'pages/posts'
import Search from 'pages/search'
import SearchBrand from 'pages/search-brand'
import SearchModel from 'pages/search-model'
import SearchModelSub from 'pages/search-model-sub'
import SearchVersion from 'pages/search-version'
import Sitemap from 'pages/sitemap'
import Brands from 'pages/brands'
import Brand from 'pages/brand'
import Dealers from 'pages/dealers'
import Dealer from 'pages/dealer'
import Branch from 'pages/branch'
import Detail from 'pages/detail'
import ListPrices from 'pages/listprices'
import Comparison from 'pages/comparison'
import AdCompare from 'pages/ad-compare'
import About from 'pages/about'
import Account from 'pages/account'
import Reservation from 'pages/reservation'
import Faq from 'pages/faq'
import Privacy from 'pages/privacy'
import GdprPolicy from 'pages/gdpr-policy'
import Contact from 'pages/contact'
import Blog from 'pages/blog'
import BlogDetail from 'pages/blog-detail'
import BlogRedirect from 'pages/blog-redirect'
import DealerApplication from 'pages/dealer-application'
import DealerApplicationStatus from 'pages/dealer-application-status'
import Otv from 'pages/otv'
import NotFound from 'pages/notfound'

const pageRegistry = {
	Home: Home,
	Search: Search,
	SearchBrand: SearchBrand,
	SearchModel: SearchModel,
	SearchModelSub: SearchModelSub,
	SearchVersion: SearchVersion,
	Sitemap: Sitemap,
	Brands: Brands,
	Brand: Brand,
	Dealers: Dealers,
	Dealer: Dealer,
	Branch: Branch,
	Detail: Detail,
	ListPrices: ListPrices,
	Comparison: Comparison,
	AdCompare: AdCompare,
	About: About,
	Account: Account,
	Reservation: Reservation,
	Faq: Faq,
	Otv: Otv,
	Privacy: Privacy,
	GdprPolicy: GdprPolicy,
	Contact: Contact,
	Blog: Blog,
	BlogDetail: BlogDetail,
	BlogRedirect: BlogRedirect,
	DealerApplication: DealerApplication,
	DealerApplicationStatus: DealerApplicationStatus,
	Posts: Posts,
	NotFound: NotFound,
}

const mapStateToProps = state => {
	return {
		pageNotFound: state.generic.pageNotFound,
	};
};

class Navigator extends React.Component {
	constructor(props) {
		super(props);
		changePage();
	}

	componentDidMount() {
		window.dynamicHistory = history;
		history.listen(function (e) {
			store.dispatch(setPageNotFound(false));
			/*let route = getRouteFromUrl(e.pathname, false, true);
			changePage(route[0], route[1]);*/
			changePage();
		});
	}

	render() {
		let routeData = this.props.pageNotFound ? <NotFound /> : renderRoutes();
		return (
			<div className="site-content">
				<ResponsiveWatcher />
				<GAController />
				<MessengerWrap />
				<SearchBar className="search-mobile" fullScreen={true} />
				<Header />
				<div className="router-wrap">
					{routeData}
				</div>
				<Footer />
				<ModalsWrap>
					<LoginModal />
					<RegisterModal />
					<RecoveryModal />
					<ConsentModal />
					<MapModal />
					<BidModal />
					<CreditModal />
					<MessageModal />
					<YoutubeModal />
				</ModalsWrap>
				<ConsentBar />
			</div>
		)
	}
}

export default connect(mapStateToProps)(Navigator);

export function ListingLink(params) {
	return '/arama/?' + params.map(function (param, nth) {
		return param.key + '=' + param.val;
	});
}

export function redirect(opts, params = false, getParams = false) {
	const defaultOpts = {
		type: 'push'
	}

	opts = (Object.prototype.toString.call(opts) === "[object String]" ? extend({}, defaultOpts, { to: opts }) : extend({}, defaultOpts, opts));

	let route = getRoute(opts.to).path;

	if (params) {
		for (let k = 0; k < Object.keys(params).length; k++) {
			let key = Object.keys(params)[k];
			route = route.replace(':' + key + '?', params[key]).replace(':' + key, params[key]);
		}
	}

	let getString = "";
	if (getParams) {
		for (let p = 0; p < Object.keys(getParams).length; p++) {
			let key = Object.keys(getParams)[p];

			if (getString !== "") {
				getString += "&";
			}
			getString += key + "=" + encodeURIComponent(getParams[key]);
		}
	}

	if (route) {
		route = route.split('/:')[0];
		if (getString !== "") { route = route + "?" + getString }
		switch (opts.type) {
			case "replace":
				history.replace(route);
				break;
			default:
				history.push(route);
				break;
		}
		changePage();
		return true;
	}
	else {
		return false;
	}
}

export function getRoute(key = false, group = 'pages') {
	let routeGroup = group;
	if (key) {
		let keyParts = key.split('.');
		if (keyParts.length === 2) {
			routeGroup = keyParts[0];
			key = keyParts[1];
		}
	}

	let target = routes[routeGroup][key];
	return (target ? target : false);
}

export function getRouteFromUrl(url = false, getObject = false, includeCatch = false) {
	if (url === false) { url = window.location.pathname.replace(/\/$/, ''); }
	let returnRoute = false;
	let returnRouteRaw = false;
	let catchRoute = false;
	Object.keys(routes).forEach((groupKey, index) => {
		let group = routes[groupKey];

		Object.keys(group).forEach((key, index) => {
			let route = routes[groupKey][key];
			if (route.path) {
				if (!returnRoute) {
					let match = matchPath(url, route.path);
					if (match && match.isExact) {
						returnRouteRaw = route;
						returnRouteRaw.key = key;
						returnRouteRaw.groupKey = groupKey;
						if (getObject) {
							returnRoute = returnRouteRaw;
						}
						else {
							returnRoute = [key, groupKey];
						}
					}
				}
			}
			else if (includeCatch) {
				catchRoute = (getObject ? route : [key, groupKey]);
			}
		});
	});

	function checkSubRoutes() {
		if (returnRouteRaw && returnRouteRaw.childRoutes) {
			let subRouteRaw = false;
			let subRoute = false;
			let groupKey = returnRouteRaw.childRoutes
			Object.keys(routes[groupKey]).forEach((key, index) => {
				let route = routes[groupKey][key];
				if (route.path) {
					if (!subRoute) {
						let match = matchPath(url, route.path);
						if (match && match.isExact) {
							subRouteRaw = route;
							subRouteRaw.key = key;
							subRouteRaw.groupKey = groupKey;

							if (getObject) {
								subRoute = subRouteRaw;
							}
							else {
								subRoute = [key, groupKey];
							}
						}
					}
				}
			});

			if (subRouteRaw && subRouteRaw.key !== returnRouteRaw.key) {
				returnRoute = subRoute;
				returnRouteRaw = subRouteRaw;

				checkSubRoutes();
			}
		}
	}

	checkSubRoutes();

	return (returnRoute ? returnRoute : catchRoute);
}

export function getCurrentRoute(url = false, includeCatch = true) {
	return getRouteFromUrl(false, true, true);
}

export function changeURLParam(value, param, route = false, noMismatch = false) {
	let routeObject = (route === false ? getCurrentRoute() : routes[route]);
	let data = false;

	if (routeObject) {
		data = routeObject.path.replace(':' + param + '?', value).replace(':' + param, value);
		if (noMismatch && data === routeObject.path) {
			data = false;
		}
	}

	return data;
}

export function changePage(key = false, group = 'pages') {
	let route = (key ? routes[group][key] : getRouteFromUrl(false, true, true));

	if (route) {
		if (route.key) {
			key = route.key;
			group = route.groupKey;

		}

		if (key === 'notfound') {
			store.dispatch(setPageNotFound(true));
		}

		let pageData = {
			key: key,
			group: group,
			fullKey: group + "." + key,
			data: route
		}

		if (store.getState().generic.currentPage.key !== key) {
			resetListingData();
			window.scroll(0, 0);
			store.dispatch(setPage(pageData));
			resetData();

			if (window.location.hash) {
				setTimeout(function () {
					let hashTarget = document.querySelector(window.location.hash)
					if (hashTarget) {
						hashTarget.scrollIntoView();
					}
				}, 500);
			}
		}

		setMeta((route.meta ? route.meta : false), true);
		setHead((route.head ? route.head : false), true);

		setTitle(route.title, route.postTitle);

		if (route.description) {
			setDescription(route.description);
		}

		setHead([
			{
				key: "link",
				props: {
					rel: "canonical",
					href: window.location.href,
				}
			},
			{
				key: "meta",
				props: {
					property: "og:url",
					content: window.location.href,
				}
			}
		]);
	}
	else {
		console.log('Change page error. Route not found: ' + key)
	}
}

export function renderRoutes(opts = {}) {
	const defaultOpts = {
		registry: pageRegistry,
		group: 'pages',
		catchRedirect: false,
	}
	opts = extend({}, defaultOpts, opts);
	let routeData = Object.keys(routes[opts.group]).map((key, index) => {
		let route = routes[opts.group][key]
		let routeProps = {
			key: index,
			exact: route.exact,
			component: opts.registry[route.component],
			name: route.component
		}

		if (route.path) {
			routeProps.path = route.path
		}
		return <Route {...routeProps} />
	});

	if (opts.catchRedirect) {
		let catchOpts = opts.catchRedirect.split('.');
		let to = routes[(catchOpts.length > 1 ? catchOpts[0] : 'pages')][catchOpts[catchOpts.length - 1]].path;
		routeData.push(<Redirect to={to} key="redir" />)
	}

	return <Switch>{routeData}</Switch>;
}

export function set404() {
	changePage('notfound');
}
