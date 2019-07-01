import React from 'react';

// Partials
import ContentBox from 'components/partials/contentbox'
import Image from 'components/partials/image';
import Loader from 'components/partials/loader';
import { FormInput } from 'components/partials/forms';

// Sections
import ListingFilters from 'components/sections/listing-filters';

// Deps
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import extend from 'lodash/extend';
import throttle from 'lodash/throttle';
import history from 'controllers/history'
import request from 'controllers/request'
import { connect } from "react-redux";
import { isExact, storageSpace } from "functions/helpers";
import queryString from 'query-string';
import { setListingFiltersExpansion } from 'data/store.generic';

const mapStateToProps = state => {
	return { mobile: state.generic.mobile };
};

const mapScrollStateToProps = state => {
	return { scrollPos: state.generic.scrollPos };
}

const mapDispatchToProps = dispatch => {
	return {
		expandFilters: () => dispatch(setListingFiltersExpansion(true))
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
			listingData: false,
			results: false,
			query: (this.props.query ? this.props.query : ((history.location.search && history.location.search !== '') ? queryString.parse(history.location.search) : {})),
			order: null,
			initialLoad: true,
			extending: false,
			activeFilters: 0,
			page: 1,
		}

		this.removeFilter = this.removeFilter.bind(this);
		this.updateOrder = this.updateOrder.bind(this);
		this.extendResults = this.extendResults.bind(this);
		this.makeRequest = this.makeRequest.bind(this);
		//this.filtersUpdated = this.filtersUpdated.bind(this);
		//this.formRef = (props.filtersForm ? props.filtersForm : React.createRef());

		//this.query = ((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '');
		this.dummyBool = false;
		this.listenerAbort = false;
		this.urlTimeout = false;
	}

	componentDidMount() {
		let vm = this;

		vm.updateResults();

		if (vm.props.urlBinding) {
			vm.listenerAbort = history.listen(function (e) {
				vm.urlChanged(e.search.replace('?', ''));
			});
		}
	}

	componentWillUnmount() {
		if (this.urlTimeout) { clearTimeout(this.urlTimeout); this.urlTimeout = false; }
		if (this.listenerAbort) { this.listenerAbort(); }
	}

	componentDidUpdate(prevProps, prevState) {
		/*if(this.props.query && !isEqual(prevState.query, this.state.query)){
			this.filtersToQuery();
		}*/

		if (!isEqual(prevState.listingData, this.state.listingData)) {
			//this.filtersToQuery();
			if (this.props.onDataChange) {
				this.props.onDataChange(this.state.listingData);
			}
		}

		if (!isEqual(prevState.query, this.state.query)) {
			this.updateURL();
			this.updateResults();
			console.log(this.state.query);

			let activeFilters = Object.keys(this.state.query).length;
			if (this.state.query.siralama) { activeFilters--; }
			this.setState({ activeFilters: activeFilters })
		}

		if (!isEqual(prevProps.query, this.props.query)) {
			let newQuery = clone(this.props.query);

			if (this.state.order !== null) {
				newQuery.siralama = this.state.order;
			}

			this.setState({ query: newQuery });
		}
	}

	urlChanged() {
		let vm = this;
		if (vm.urlTimeout) { clearTimeout(vm.urlTimeout); vm.urlTimeout = false; }
		vm.urlTimeout = setTimeout(function () {
			let query = queryString.parse((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '');
			if (!isEqual(vm.state.query, query)) {
				vm.setState({ query: query });

				if (query.siralama) {
					vm.setState({ order: query.siralama });
				}
			}
		}, 30);
	}

	updateURL() {
		if (this.props.urlBinding) {
			let query = queryString.stringify(this.state.query);
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
		let newData = clone(this.state.listingData);
		newData.filters = newData.filters.map((filter) => {
			if (filter.name === name || name === false) {
				let newFilter = clone(filter);

				if (newFilter.value) { newFilter.value = "" };
				if (newFilter.opts) {
					newFilter.opts = newFilter.opts.map((opt) => {
						let newOpt = clone(opt);
						if (newOpt.selected) {
							newOpt.selected = false;
						}
						if (newOpt.value) {
							newOpt.value = "";
						}

						return newOpt;
					});
				}

				return newFilter;
			}
			else return filter;
		});

		this.setState({ listingData: newData });
	}

	updateResults() {
		let vm = this;

		vm.setState({ loading: true });

		setTimeout(function () {
			vm.makeRequest();
		}, 500); /// Dummy Delay
	}

	makeRequest(opts = {}, endFunction = false) {
		let vm = this;
		opts = extend({ page: 1 }, opts);

		//let q = queryString.stringify(vm.state.query);
		let requestURL = vm.props.source; //+'?'+q;
		//requestURL = '/dummy/data/listing.json';

		request.get(requestURL, { ...vm.state.query, ...{ sayfa: opts.page } }, function (payload, status) {
			if (payload) {
				if (opts.page > 1) {
					payload.results = vm.state.results.concat(payload.results);
				}
				vm.setState({
					listingData: payload,
					results: payload.results,
					order: payload.order ? payload.order : orderOptions[0].value,
					loading: false,
					total: (payload.totalResults ? payload.totalResults : 0),
					page: payload.page ? payload.page : 1,
				});

				if (vm.state.initialLoad) {
					setTimeout(function () {
						vm.setState({ initialLoad: false });
					}, 40);
				}

				if (endFunction) {
					endFunction();
				}
			}
		}, { excludeApiPath: requestURL === '/dummy/data/listing.json' || requestURL === '/dummy/data/detail-related.json' });
	}

	updateOrder(order) {
		let newQuery = clone(this.state.query);

		if (order === null && newQuery.order) {
			delete newQuery.order;
		}
		else if (order !== null) {
			newQuery['siralama'] = order;
		}

		this.setState({ query: newQuery, order: order });
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
		if (vm.state.order && vm.state.order !== null) {
			for (let k = 0; k < orderOptions.length; k++) {
				if (orderOptions[k].value === vm.state.order) {
					orderVal = orderOptions[k];
				}
			}
		}
		return (
			<section className={"section listing loader-container " + vm.props.className + (vm.props.filters ? ' has-filters' : '') + ' size-' + vm.props.size}>
				<Loader loading={vm.state.loading || !vm.state.results} strict={!vm.state.initialLoad} />
				{vm.props.filters &&
					<ListingFilters
						order={vm.state.order}
						data={vm.state.listingData}
						onUpdate={(newQuery) => {
								console.log('onupd');
							vm.setState({
								query: newQuery
							})
						}}
					/>
				}
				<div className={"listing-content type-" + vm.state.listingData.type}>
					{vm.props.topSection &&
						<aside className="content-top">
							{vm.props.mobile &&
								<button className="top-filterstrigger" type="button" onClick={vm.props.expandFilters}>
									<i className="icon-filter"></i> Filtrele
									{(vm.state.listingData.filters && vm.state.activeFilters > 0) &&
										<span> ({vm.state.activeFilters})</span>
									}
								</button>
							}
							{!vm.props.mobile &&
								<ActiveFilters data={vm.state.listingData} onFilterRemove={vm.removeFilter} />
							}

							<FormInput
								type="select"
								placeholder="Sırala"
								isSearchable={false}
								value={orderVal}
								onChange={vm.updateOrder}
								options={orderOptions}
								className="top-order" />
						</aside>
					}
					<ListingResults loading={vm.state.loading} data={vm.state.listingData} mobile={vm.props.mobile} />
					{(vm.state.results.length < vm.state.total) &&
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
	query: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(Listing);

// Results
class ListingResults extends React.Component {
	render() {
		let vm = this;
		let itemsAt = 0;
		let data = vm.props.data;
		let loading = vm.props.loading;
		let results = data.results;
		if (results && results.length) {
			return (
				<ul className="content-results">
					{results.map((item, nth) => {
						itemsAt += (item.size ? item.size : 1);
						let contents = [];
						switch (item.type) {
							case 'banner':
								let Item = (item.url ? 'a' : 'div');
								contents.push(
									<li key={nth} className={"results-item banner x" + item.size}>
										<Item className="item-banner"><Image className="banner-image" src={item.image} alt={item.title} bg={!vm.props.mobile} /></Item>
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