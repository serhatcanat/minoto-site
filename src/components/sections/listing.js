import React from 'react';

// Partials
import ContentBox from 'components/partials/contentbox'
import Image from 'components/partials/image';
import Loader from 'components/partials/loader';
import { FormInput } from 'components/partials/forms';
import Link from 'components/partials/link'

// Sections
import ListingFilters from 'components/sections/listing-filters';

// Deps
import debounce from 'lodash/debounce';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
//import clone from 'lodash/clone';
import extend from 'lodash/extend';
import throttle from 'lodash/throttle';
import history from 'controllers/history'
import request from 'controllers/request'
import { connect } from "react-redux";
import { storageSpace } from "functions/helpers";
import queryString from 'query-string';
import { setFiltersExpansion, setListingQuery, setFilterQuery, setListingData } from 'data/store.listing';
import { openModal } from 'functions/modals'

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
	{ value: 'random', label: "Varsayılan Sıralama" },
	{ value: 'price_desc', label: "Fiyata Göre (Önce Yüksek)" },
	{ value: 'price_asc', label: "Fiyata Göre (Önce Düşük)" },
	{ value: 'date_desc', label: "Tarihe Göre (Önce Yeni)" },
	{ value: 'date_asc', label: "Tarihe Göre (Önce Eski)" }
]

class Listing extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			order: props.defaultOrder,
			extending: false,
			page: 1,
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

		vm.urlChanged(); // Bu fonksiyon aynı zamanda ilk request'i atıyor.

		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.urlTimeout) { clearTimeout(this.urlTimeout); this.urlTimeout = false; }
		if (this.listenerAbort) { this.listenerAbort(); }

		this.mounted = false;
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;

		if(vm.props.topSection){
			if(prevState.order !== vm.state.order){
				vm.props.setListingQuery(extend({}, vm.props.listingQuery, { siralama: vm.state.order }));
			}
		}

		if(prevState.page !== vm.state.page){
			vm.props.setListingQuery(extend({}, vm.props.listingQuery, { sayfa: vm.state.page }));
		}

		if(!isEqual(prevProps.listingQuery, this.props.listingQuery)){
			this.setState({order: (this.props.listingQuery.siralama ? this.props.listingQuery.siralama : vm.props.defaultOrder)});
			vm.updateResults();
		}

		if(!isEqual(prevProps.filterQuery, this.props.filterQuery)){
			vm.updateResults();		
		}
	}

	getQuery() {
		let newQuery = extend({}, this.props.listingQuery, this.props.filterQuery);
		return newQuery;
	}

	urlChanged() {
		let vm = this;
		if (vm.urlTimeout) { clearTimeout(vm.urlTimeout); vm.urlTimeout = false; }
		vm.urlTimeout = setTimeout(function () {
			let query = queryString.parse((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '');

			if (!isEqual(query, vm.getQuery())) {
				let listingQuery = vm.props.topSection ? pick(query, ['siralama', 'sayfa']) : {};
				let filterQuery = omit(query, ['siralama', 'sayfa']);

				vm.props.setListingQuery(listingQuery);
				vm.props.setFilterQuery(filterQuery);
			}
			else if(!vm.initialized){
				vm.updateResults();
			}
		}, 30);
	}

	updateURL() {
		if (this.props.urlBinding) {
			let query = queryString.stringify(this.getQuery());
			if (history.location.search !== '?' + query) {
				if (this.state.initialLoad) {
					if (query !== '') {
						window.dynamicHistory.replace('?' + query);
					}
				}
				else {
					window.dynamicHistory.push('?' + query);
				}
			}
		}
	}

	removeFilter(name = false) {
		if(name !== false){
			let newQuery = omit(this.props.filterQuery, [name]);
			this.props.setFilterQuery(newQuery);
		}
	}

	updateResults() {
		let vm = this;
		vm.setState({ loading: true });
		vm.makeRequest();
	}

	makeRequest(opts = {}, endFunction = false) {
		let vm = this;

		vm.initialized = true;
		let requestURL = vm.props.source; //+'?'+q;
		vm.updateURL();

		request.get(requestURL, vm.getQuery(), function (payload, status) {
			if (vm.mounted && payload) {
				if (payload.redirect) {
					setTimeout(function () { window.location.href = payload.link; }, 30)
				}
				if (opts.page > 1) {
					payload.results = vm.props.listingData.results.concat(payload.results);
				}

				vm.props.setListingData(payload);

				vm.setState({
					loading: false,
					page: payload.page ? payload.page : 1,
					order: payload.order
				});

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

				if (Object.keys(vm.props.filterQuery).length > 0 && vm.props.scrollOnFilterChange && vm.containerRef.current) {
					window.scroll({
						behavior: 'smooth',
						left: 0,
						top: vm.containerRef.current.offsetTop
					});
					//scrollTo({ to: vm.containerRef.current});
				}

				if (endFunction) {
					endFunction();
				}
			}
		}, { excludeApiPath: requestURL === '/dummy/data/listing.json' || requestURL === '/dummy/data/detail-related.json' });
	}

	extendResults() {
		let vm = this;

		if (!vm.state.extending && vm.state.results) {
			let page = vm.state.page + 1;
			vm.setState({
				extending: true,
				page: page,
			});

			vm.makeRequest({ page: page }, function () {
				vm.setState({
					extending: false
				})
			});
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
			<section ref={vm.containerRef} className={"section listing loader-container " + vm.props.className + (vm.props.filters ? ' has-filters' : '') + ' size-' + vm.props.size}>
				<Loader loading={vm.state.loading || !vm.props.listingData} strict={true} />
				{vm.props.filters &&
					<ListingFilters />
				}
				<div className={"listing-content type-" + vm.props.listingData.type}>
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
									placeholder="Sırala"
									isSearchable={false}
									value={orderVal}
									onChange={(order) => { vm.setState({ order: order}); }}
									options={orderOptions}
									className="top-order" />
							}
						</aside>
					}
					<ListingResults loading={vm.state.loading} data={vm.props.listingData} mobile={vm.props.mobile} />
					{(vm.state.results && vm.state.results.length < vm.props.listingData.totalResults) &&
						<InfiniteScroller loading={vm.state.extending} onExtend={vm.extendResults} />
					}
				</div>
			</section>
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
	defaultOrder: "random",
	scrollOnFilterChange: false,
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
		if (results && results.length) {
			return (
				<ul className="content-results">
					{results.map((item, nth) => {
						itemsAt += (item.size ? item.size : 1);
						let contents = [];
						switch (item.type) {
							case 'banner':
								let Item = 'div';
								let props = {};

								if (item.url) {
									switch (item.action) {
										case "youtube":
											Item = 'button';
											props.onClick = () => { openModal('youtube', { url: item.url }) }
											break;
										case "externalLink":
											Item = 'a';
											props.herf = item.url;
											break;
										default:
											Item = Link;
											props.href = item.url;
											break;
									}
								}

								contents.push(
									<li key={nth} className={"results-item banner x" + item.size}>
										<Item className="item-banner" {...props}><Image className="banner-image" src={item.image} alt={item.title} bg={!vm.props.mobile} /></Item>
									</li>
								);
								break;
							default:
								switch (data.type) {
									case "dealer":
										contents.push(
											<li key={nth} className="results-item">
												<ContentBox
													type="plain"
													className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
													title={item.title}
													subtitle={item.dealer}
													additionTitle={item.count + ' ARAÇ'}
													image={storageSpace('dealers', item.image)}
													labels={item.labels}
													faved={item.favorited}
													//favControls={'/dummy/data/fav/dealer/'+item.id}
													badge={(item.status !== 1 ? false : (item.status === 2 ? { text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur' } : { text: 'Satıldı', type: 'error' }))}
													bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false)}
													url={`bayi/${item.id}/${item.link}`}
												/>
											</li>
										)
										break;
									case "brand":
										contents.push(
											<li key={nth} className="results-item">
												<ContentBox
													type="plain"
													className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
													title={item.title}
													labels={item.labels}
													additionTitle={item.count + ' ARAÇ'}
													image={storageSpace('brands', item.image)}
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
													image={storageSpace('car-posts', item.image)}
													price={item.price}
													labels={item.labels}
													faved={item.favorited}
													badge={(item.status === 1 ? false : (item.status === 2 ? { text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur' } : { text: 'Satıldı', type: 'error' }))}
													bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false)}
													url="detail"
													urlParams={{ id: item.id, slug: item.slug }}
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
					})}
				</ul>
			)
		}
		else {
			return (
				<React.Fragment>
					{
						loading === false && (<div className="results-error"><div className="error-message">Aradığınız Kriterlere Uygun Bir Sonuç Bulunamadı.</div></div>)
					}

				</React.Fragment>
			)
		}
	}
}

class InfiniteScrollerRaw extends React.Component {
	constructor(props) {
		super(props)

		this.state = {

		}

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
				<span><i className="icon-spinner"></i></span>
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
			filters = this.props.data.filters.map((group, nth) => {
				let text = false;
				let data = false;
				switch (group.display) {
					case "range":
						data = group.opts.filter((filter) => {
							return filter.value !== "";
						}).map((filter) => {
							return (filter.prefix !== "" ? filter.prefix + " " : '') + filter.value + (filter.postfix ? " " + filter.postfix : '');
						});
						if (data.length) { text = data.join(' - '); }
						break;
					case "text":
						text = (group.value ? group.value : false);
						break;
					default: // list, icons
						data = group.opts.filter((filter) => {
							return (filter.selected);
						}).map((filter) => {
							return filter.title;
						});

						if (data.length) { text = data.join(', '); }
						break;
				}

				return text ? { name: group.name, title: group.title, label: text } : false;
			}).filter((filter) => { return filter !== false; });
		}

		if (filters.length) {
			return (
				<div className="top-activefilters">
					{filters.map((filter, nth) => (
						<span className="activefilters-item" key={nth} title={filter.title}>
							{filter.label}
							<button type="button" onClick={() => { this.props.onFilterRemove(filter.name); }} className="item-remove"><i className="icon-close"></i></button>
						</span>
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