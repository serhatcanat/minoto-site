import React from 'react'

import config from 'data/config'
// Partials
import ContentBox from 'components/partials/contentbox'
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import {FormInput} from 'components/partials/forms'
//import Link from 'components/partials/link'
import ListingBanner from 'components/partials/listing-banner'
// Sections
import ListingFilters from 'components/sections/listing-filters'
// Deps
import debounce from 'lodash/debounce';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import pull from 'lodash/pull';
import extend from 'lodash/extend';
import throttle from 'lodash/throttle';
import history from 'controllers/history'
import request from 'controllers/request'
import {connect} from "react-redux";
import {nextRandomPage, seoFriendlyUrl, storageSpace} from "functions/helpers";
import queryString from 'query-string';
import {setFilterQuery, setFiltersExpansion, setListingData, setListingQuery} from 'data/store.listing';
import {GA} from 'controllers/ga'
import {addImpressionProduct} from 'data/store.ga.js'
//import { openModal } from 'functions/modals'
import image_loader from 'assets/images/minoto-loading.gif'
import {turkishSort} from '../../functions/helpers'

const mapStateToProps = state => {
	return {
		mobile: state.generic.mobile,
		listingData: state.listing.listingData,
		filterData: state.listing.filterData,
		filterQuery: state.listing.filterQuery,
		listingQuery: state.listing.listingQuery,
	};
};

const mapScrollStateToProps = state => {
	return { scrollPos: state.generic.scrollPos };
}

const mapDispatchToProps = dispatch => {
	return {
		expandFilters: () => dispatch(setFiltersExpansion(true)),
		setListingQuery: (query) => dispatch(setListingQuery(query)),
		setFilterQuery: (query) => dispatch(setFilterQuery(query)),
		setListingData: (data) => dispatch(setListingData(data)),
	}
}

const orderOptions = [
	{ value: 'random', label: "Varsay??lan S??ralama" },
	{ value: 'price_desc', label: "Fiyata G??re (??nce Y??ksek)" },
	{ value: 'price_asc', label: "Fiyata G??re (??nce D??????k)" },
	{ value: 'date_desc', label: "Tarihe G??re (??nce Yeni)" },
	{ value: 'date_asc', label: "Tarihe G??re (??nce Eski)" }
]

class Listing extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			order: props.defaultOrder,
			extending: false,
			page: 1,
			keyword: false,
			pageOrder: 'first',
			usedPages: [],
			total: false,
			currentTotal: false
		}

		this.removeFilter = this.removeFilter.bind(this);
		this.getQuery = this.getQuery.bind(this);
		this.extendResults = this.extendResults.bind(this);
		this.makeRequest = this.makeRequest.bind(this);
		this.updateResults = debounce(this.updateResults.bind(this), 50);
		this.listenerAbort = false;
		this.urlTimeout = false;
		this.mounted = false;
		this.initialized = false;
		this.containerRef = React.createRef();
	}

	componentDidMount() {
		let vm = this;

		if (vm.props.urlBinding) {
			vm.listenerAbort = history.listen(function (e) {
				vm.urlChanged();
			});
		}

		vm.urlChanged(); // Bu fonksiyon ayn?? zamanda ilk request'i at??yor.

		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.urlTimeout) { clearTimeout(this.urlTimeout); this.urlTimeout = false; }
		if (this.listenerAbort) { this.listenerAbort(); }

		this.mounted = false;
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;
		if (vm.props.topSection) {
			if (prevState.order !== vm.state.order) {

				vm.props.setListingQuery(extend({}, vm.props.listingQuery, { siralama: vm.state.order }));
				this.setState({
					page: 1,
					pageOrder: "first"
				})
			}


		}

		if (prevState.page !== vm.state.page) {
			vm.props.setListingQuery(extend({}, vm.props.listingQuery, { sayfa: parseInt(vm.state.page) }));
		}

		if (prevProps.source !== vm.props.source) {
			vm.updateResults();
		}

		if (prevProps.listingQuery.siralama && !isEqual(prevProps.listingQuery.siralama, this.props.listingQuery.siralama)) {
			let page = (prevProps.listingQuery.siralama === "random" && Object.keys(vm.getQuery()).length < 4) ? Math.floor(Math.random() * Math.floor(10)) + 1 : 1;
			
			this.setState({ page: page, order: (this.props.listingQuery.siralama ? this.props.listingQuery.siralama : vm.props.defaultOrder) });
			vm.updateResults();
		}

		if(prevProps.listingQuery.ara !== this.props.listingQuery.ara){
			vm.updateResults();
		}

		//console.log(Object.keys(this.props.filterQuery).indexOf('ara') === -1)

		//console.log(this.props.filterQuery)

		if (!isEqual(prevProps.filterQuery, this.props.filterQuery)) {

			vm.updateResults();
		}

		//setTimeout(function () { console.log(vm.props.filterQuery) }, 300)
	}

	getQuery() {
		let querySelf = extend({}, this.props.listingQuery, { siralama: this.state.order, sayfa: parseInt(this.state.page), pageOrder: this.state.pageOrder });
		this.props.setListingQuery(querySelf);
		let newQuery = extend({}, this.props.listingQuery, this.props.filterQuery);
		return newQuery;
	}

	urlChanged() {
		let vm = this;

		if (vm.urlTimeout) { clearTimeout(vm.urlTimeout); vm.urlTimeout = false; }

		vm.urlTimeout = setTimeout(function () {
			let query = queryString.parse((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '');

			if (Object.keys(query).length && !isEqual(query, vm.getQuery())) {
				let listingQuery = vm.props.topSection ? pick(query, ['siralama', 'sayfa', 'pageOrder', 'ara']) : {};

				if (!listingQuery.siralama) { listingQuery.siralama = vm.props.defaultOrder }

				let filterQuery = omit(query, ['siralama', 'sayfa', 'pageOrder', 'ara']);

				vm.props.setListingQuery(listingQuery);
				vm.props.setFilterQuery(filterQuery);

			}
			else if (!vm.initialized) {

				vm.updateResults();
				// Listelemelerde patlak oluyorsa buray?? eski haline getiririz.
				//vm.updateResults();
				//vm.getQuery();
			}
		}, 30);
	}

	updateURL() {
		if (this.props.urlBinding) {

			//let defaultQuery = 'siralama=' + this.props.defaultOrder;
			let rawQuery = this.getQuery();
			let initialQuery = queryString.stringify(rawQuery);

			if (rawQuery.siralama === this.props.defaultOrder) {
				rawQuery = omit(rawQuery, ['siralama', 'sayfa', 'pageOrder']);
			}

			let query = queryString.stringify(rawQuery);

			if (history.location.search !== '?' + query && history.location.search !== query && history.location.search !== '?' + initialQuery && history.location.search !== initialQuery) {

				if (!this.initialized) {
					if (query !== '') {
						window.dynamicHistory.replace('?' + query);
					}
				}
				else {
					if (query === '') {
						if (history.location.search !== '') {
							window.dynamicHistory.push('?');
						}
					}
					else {
						window.dynamicHistory.push('?' + query);
					}
				}
			}

		}
	}

	removeFilter(keys = false, value = false) {
		let newQuery = clone(this.props.filterQuery);

		if (keys !== false && value !== false) {
			let newItem = pull(newQuery[keys[0]].split(config.filterSeperator), value.toString()).join(config.filterSeperator);

			if (newItem.length) {
				newQuery[keys[0]] = newItem;
			}
			else {
				newQuery = omit(newQuery, [keys[0]]);
			}

			this.props.setFilterQuery(newQuery);
		}
		else if (keys !== false) {
			newQuery = omit(newQuery, keys);
			this.props.setFilterQuery(newQuery);
		}
	}

	
	updateResults = () =>  {
		let vm = this;
		let page = (vm.state.order === "random" && Object.keys(vm.getQuery()).length < 4) ? Math.floor(Math.random() * 4)+1 : 1;
		
		let order = vm.state.order ? vm.state.order : this.props.defaultOrder;
		vm.setState({ loading: true, pageOrder: "first", page: vm.props.source === 'filters' ? page : 1, order: order, usedPages: [] });
		setTimeout(function () { vm.makeRequest(); }, 50)
	};

	makeRequest(opts = {}, endFunction = false) {
		let vm = this;
		vm.initialized = true;
		let requestURL = vm.props.source; //+'?'+q;
		let query = vm.getQuery();
		request.get(requestURL, query, function (payload, status) {

			if (vm.mounted && payload) {
				if (payload.redirect) {
					setTimeout(function () { window.location.href = payload.link; }, 30)
				}

				if (opts.page > 0) {
					payload.results = vm.props.listingData.results.concat(payload.results);
				}

				vm.props.setListingData(payload);

				let usedPages = vm.state.usedPages;
				if ((payload.page && vm.state.usedPages.length === 0) || vm.state.usedPages.indexOf(payload.page) === -1) {
					usedPages.push(parseInt(payload.page))
				}
				let searchInput = query.ara ? query.ara : false;

				vm.setState({
					loading: false,
					extending: false,
					page: payload.page ? parseInt(payload.page) : 1,
					results: payload.results,
					order: payload.order ? payload.order : 'date_desc',
					keyword: payload.keyword ? payload.keyword : null,
					pageOrder: 'regular',
					total: (payload.totalResults ? payload.totalResults : 0),
					currentTotal: (payload.currentResults ? payload.currentResults : 0),
					filterResults: (payload.filterResults ? payload.filterResults : 0),
					usedPages: usedPages,
					searchInput: searchInput,
				});

				if ((payload.totalResults === 0 || payload.similar) && searchInput) {
					GA.send('searchNotFound', { searchInput: searchInput });
				}

				/*vm.setState({
					listingData: payload,
					results: payload.results,
					//order: payload.order ? payload.order : orderOptions[0].value,
					loading: false,
					total: (payload.totalResults ? payload.totalResults : 0),
					page: payload.page ? payload.page : 1,
				});*/

				/*if (vm.state.initialLoad) {
					setTimeout(function () {
						vm.setState({ initialLoad: false });
					}, 40);
				}*/

				/* if (Object.keys(vm.props.filterQuery).length > 0 && vm.props.scrollOnFilterChange && vm.containerRef.current) {
					window.scroll({
						behavior: 'smooth',
						left: 0,
						top: vm.containerRef.current.offsetTop
					});
					//scrollTo({ to: vm.containerRef.current});
				} */

				if (endFunction) {
					endFunction();
				}
			}

		}, { excludeApiPath: requestURL === '/dummy/data/listing.json' || requestURL === '/dummy/data/detail-related.json' });


	}

	extendResults() {
		let vm = this;
		if (!vm.state.extending && vm.state.results) {
			let page, pageArray;
			if (vm.state.order === 'random') {
				let nextRandom = nextRandomPage(vm.state.filterResults, vm.state.usedPages);

				pageArray = nextRandom.alreadyUsed;
				page = nextRandom.pickedPage;

			} else {
				pageArray = [];
				page = parseInt(vm.state.page) + 1;
			}

			if (page) {

				vm.setState({
					extending: true,
					page: page,
					usedPages: pageArray
				});

				setTimeout(function () {
					vm.makeRequest({ page: page }, function () {
						vm.setState({
							extending: false,
						})
					})
				}, 30)
			}

		}
	}

	render() {
		let vm = this;
		let orderVal = null;
		let activeFilters = Object.keys(vm.props.filterQuery).length;

		if (vm.state.order && vm.state.order !== null) {
			for (let k = 0; k < orderOptions.length; k++) {
				if (orderOptions[k].value === vm.state.order) {
					orderVal = orderOptions[k];
				}
			}
		}
		return (
			<React.Fragment>
				{/*<section className="section listing-title"><h1>{vm.props.title}</h1></section> */}
				<section ref={vm.containerRef} className={"section listing loader-container " + vm.props.className + (vm.props.filters ? ' has-filters' : '') + ' size-' + vm.props.size} id={vm.props.id} >
					{vm.props.filters &&
						<ListingFilters loading={vm.state.loading} mobile={vm.props.mobile} showMoreBrands={vm.props.showMoreBrands} />
					}

					<div className={"listing-content type-" + vm.props.listingData.type}>
						<Loader loading={vm.state.loading || !vm.props.listingData} strict={true} />
						{(vm.props.topSection || vm.props.mobile) &&
							<aside className="content-top">
								{vm.props.mobile &&
									<button className="top-filterstrigger" type="button" onClick={vm.props.expandFilters}>
										<i className="icon-filter"></i> Filtrele
									{(vm.props.listingData.filters && activeFilters > 0) &&
											<span> ({activeFilters})</span>
										}
									</button>
								}
								{!vm.props.mobile && vm.props.topSection &&
									<ActiveFilters data={vm.props.listingData} onFilterRemove={vm.removeFilter} />
								}

								{vm.props.topSection &&
									<FormInput
										type="select"
										placeholder="S??rala"
										isSearchable={false}
										value={orderVal}
										onChange={(order) => { vm.setState({ order: order }); }}
										options={orderOptions}
										className="top-order" />
								}
							</aside>
						}
						{/* <ListingResults loading={vm.state.loading} data={vm.props.listingData} mobile={vm.props.mobile} />
						{(vm.props.listingData.results && vm.props.listingData.results.length < vm.props.listingData.totalResults) &&
							<InfiniteScroller loading={vm.state.extending} onExtend={vm.extendResults} />
						} */}
						<ListingResults
							loading={vm.state.loading}
							data={vm.props.listingData}
							GAGroup={vm.props.GAGroup}
							searchInput={vm.state.searchInput}
							mobile={vm.props.mobile} />
						{(vm.state.results && vm.state.results.length < vm.props.listingData.totalResults) &&
							<InfiniteScroller
								loading={vm.state.extending}
								onExtend={vm.extendResults} />
						}
					</div>
				</section>
			</React.Fragment>
		);
	}
}

Listing.defaultProps = {
	className: '',
	filters: true,
	topSection: true,
	urlBinding: true,
	source: '/dummy/data/listing.json',
	showAds: true,
	size: 4,
	defaultOrder: "date_desc",
	scrollOnFilterChange: false,
	keyword: false,
	GAGroup: 'Listeleme'
};

export default connect(mapStateToProps, mapDispatchToProps)(Listing);

// Results
class ListingResults extends React.Component {

	render() {
		let vm = this;
		let itemsAt = 0;
		let loading = vm.props.loading;
		let data = vm.props.data
		let results = data.results;
		let productResultsCount = (results ? results.filter((result) => { return result.type === 'advert' }).length : 0);
		if (results && results.length && !loading) {
			return (
				<React.Fragment>
					{
						(data.similar || data.totalResults === 0) && (
							<React.Fragment>
								{
									loading === false && (<div className="results-error"><div className="error-message">Arad??????n??z kriterlere uygun bir ara?? bulamad??k. Ancak a??a????daki ara??lar ilginizi ??ekebilir. </div></div>)
								}
							</React.Fragment>
						)
					}

					<ul className="content-results">

						{
							data.type === 'dealer'
								?
								(<React.Fragment>
									{
										results.sort(turkishSort).map((item, nth) => {
											itemsAt += (item.size ? item.size : 1);
											let contents = [];
											switch (item.type) {
												case 'banner':
													let contentItem = <ListingBanner key={nth} mobile={vm.props.mobile} data={item} />

													if (contentItem) {
														contents.push(contentItem);
													}
													break;
												default:
													contents.push(
														<li key={nth} className="results-item">
															<ContentBox
																type="plain"
																className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
																title={item.title}
																subtitle={item.dealer}
																additionTitle={item.count + ' ARA??'}
																image={item.image ? storageSpace('c_scale,q_auto:best,w_360/dealers', item.image) : ''}
																labels={item.labels}
																faved={item.favorited}
																//favControls={'/dummy/data/fav/dealer/'+item.id}
																badge={(item.status !== 1 ? false : (item.status === 2 ? { text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur' } : { text: 'Sat??ld??', type: 'error' }))}
																bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' ki??i Bak??yor' : false)}
																url={`bayiler/${item.link}`}
															/>
														</li>
													)
													break;
											}

											if (itemsAt === 8 && vm.props.showAds) {
												contents.push(<Ad key={nth} />);
											}

											return contents;
										})
									}
								</React.Fragment>)
								:
								(<React.Fragment>
									{

										results.map((item, nth) => {
											itemsAt += (item.size ? item.size : 1);
											let contents = [];

											switch (item.type) {
												case 'banner':
													let contentItem = <ListingBanner key={nth} mobile={vm.props.mobile} data={item} />

													if (contentItem) {
														contents.push(contentItem);
													}
													break;
												default:
													switch (data.type) {
														case "brand":
															contents.push(
																<li key={nth} className="results-item">
																	<ContentBox
																		type="plain"
																		className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
																		title={item.title}
																		labels={item.labels}
																		additionTitle={item.count + ' ARA??'}
																		image={storageSpace('c_scale,q_auto:best,w_360/brands', item.image)}
																		faved={item.favorited}
																		//favControls={'/dummy/data/fav/dealer/'+item.id}
																		url={`markalar/${item.link}`}
																	/>
																</li>
															)
															break;
														default: //listing
															contents.push(
																<li key={nth} className="results-item">
																	<ContentBox
																		className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
																		title={item.title}
																		subtitle={item.dealer}
																		image={storageSpace('c_scale,q_auto:best,w_360/car-posts', item.image)}
																		price={item.price}
																		labels={item.labels}
																		productionPlace={item.productionPlace}
																		faved={item.favorited}
																		badge={(item.status === 1 ? false : (item.status === 2 ? { text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur' } : { text: 'Sat??ld??', type: 'error' }))}
																		bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' ki??i Bak??yor' : false)}
																		url="detail"
																		urlParams={{ dealer: seoFriendlyUrl(item.dealer), slug: item.slug.substring(0,item.slug.lastIndexOf('-M')), post: item.postNo }}
																		onClick={() => {
																			GA.send('productClick', {
																				product: item,
																				totalResults: results.length
																			});

																			if (vm.props.searchInput) {
																				GA.send('searchClick', {
																					product: item,
																					searchInput: vm.props.searchInput,
																				});
																			}
																		}}

																		onDisplay={() => { addImpressionProduct(vm.props.GAGroup, item, productResultsCount); }}
																	/>
																</li>
															);
															break;
													}
													break;
											}

											if (itemsAt === 8 && vm.props.showAds) {
												contents.push(<Ad key={nth} />);
											}

											return contents;
										})
									}
								</React.Fragment>)}
					</ul>
				</React.Fragment>
			)
		}
		else {
			return (
				<React.Fragment>
					{
						loading === false && (<div className="results-error"><div className="error-message">Arad??????n??z kriterlere uygun bir ara?? bulamad??k. </div></div>)
					}
				</React.Fragment>
			)
		}
	}
}

class InfiniteScrollerRaw extends React.Component {
	constructor(props) {
		super(props)
		this.scrollElem = React.createRef();
		this.trigger = throttle(this.trigger.bind(this), 1000);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.scrollPos !== this.props.scrollPos) {
			let boundRect = this.scrollElem.current.getBoundingClientRect();
			let viewport = {
				top: 0,
				bottom: window.innerHeight,
			}

			let bounds = {
				top: boundRect.top,
				bottom: boundRect.top + this.scrollElem.current.clientHeight
			}

			if ((bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom) || (bounds.top <= viewport.bottom && bounds.top >= viewport.top)) {
				this.trigger();
			}
		}
	}

	trigger() {
		this.props.onExtend();
	}

	render() {
		return (
			<div className={"content-infinitescroll" + (this.props.loading ? ' loading' : '')} ref={this.scrollElem}>
				{/*<span><i className="icon-spinner"></i></span>*/}
				<img width="50" src={image_loader} alt="Y??kleniyor..." style={{ display: 'inline' }} />
			</div>
		)
	}
}

let InfiniteScroller = connect(mapScrollStateToProps)(InfiniteScrollerRaw);

// Top Filter Controls
class ActiveFilters extends React.Component {

	render() {
		let filters = [];
		if (this.props.data && this.props.data.filters) {
			filters = this.props.data.filters.reduce((activeFilters, group, nth) => {
				let values = false;
				let data = false;
				let groupName = [group.name];

				switch (group.display) {
					case "range":
						groupName = [];
						data = group.opts.reduce((filteredOpts, filter) => {
							if (filter.value !== "" && filter.value !== null) {
								groupName.push(filter.name);
								filteredOpts.push((filter.prefix !== "" ? filter.prefix + " " : '') + filter.value + (filter.postfix ? " " + filter.postfix : ''));
							}
							return filteredOpts;
						}, []);
						if (data.length) { values = [{ value: false, title: data.join(' - ') }]; }
						break;
					case "text":
						values = (group.value ? [{ value: false, title: group.value }] : false);
						break;
					default: // list, icons
						data = group.opts.reduce((selectedOpts, filter) => {
							if (filter.selected) { selectedOpts.push({ value: filter.value, title: filter.title }); }

							return selectedOpts;
						}, []);

						if (data.length) { /*values = data.join(', ');*/ values = data; }
						break;
				}

				if (values) { activeFilters.push({ name: groupName, title: group.title, values: values }); }
				return activeFilters;
			}, []);
		}

		if (filters.length) {
			return (
				<div className="top-activefilters">
					{filters.map((filter, fnth) => (
						<React.Fragment key={fnth}>
							{
								filter.title !== 'Model' && (
									<React.Fragment>
										{filter.values.map((opt, nth) => (
											<span className="activefilters-item" key={nth} title={filter.title + ': ' + opt.title}>
												<span className="item-title">{filter.title}:</span>
												<span className="item-value">
													{opt.title}
												</span>
												<button type="button" onClick={() => { this.props.onFilterRemove(filter.name, opt.value); }} className="item-remove"><i className="icon-close"></i></button>
											</span>
										))}
									</React.Fragment>
								)
							}
						</React.Fragment>
					))}
				</div>
			)
		}
		else return false;
	}
}

// Ads
class Ad extends React.Component {
	render() {
		return (
			<div className="results-ad results-item x4">
				<a className="ad-link" href="http://www.citroen.com.tr" target="_blank" title="Citroen" rel="noopener noreferrer" >
					<Image src="/dummy/images/listing-ad.jpg" />
				</a>
			</div>
		)
	}
}
