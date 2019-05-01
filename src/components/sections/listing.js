import React from 'react';

// Partials
import ContentBox from 'components/partials/contentbox.js'
import Image from 'components/partials/image.js';
import SVG from 'react-inlinesvg';
import Loader from 'components/partials/loader.js';

// Deps
import axios from 'axios';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import {serialize } from 'functions/helpers';
import history from 'controllers/history'

export default class ProductListing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			results: false,
			filters: false,
			loading: true,
			listingType: 'dealer',
			query: (this.props.query ? this.props.query : ((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '')),
			initialLoad: false,
		}

		this.initialize = this.initialize.bind(this);
		this.filtersUpdated = this.filtersUpdated.bind(this);
		this.formRef = React.createRef();

		//this.query = ((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '');
		this.dummyBool = false;
		this.listenerAbort = false;
		this.urlTimeout = false;
	}

	componentDidMount() {
		let vm = this;
		vm.initialize();

		vm.listenerAbort = history.listen(function (e) {
			vm.urlChanged(e.search.replace('?', ''));
		});
	}

	componentWillUnmount() {
		if(this.urlTimeout){ clearTimeout(this.urlTimeout); this.urlTimeout = false; }
		this.listenerAbort();
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.props.filters && !isEqual(prevState.filters, this.state.filters)){
			this.filtersToQuery();
		}

		if(!isEqual(prevState.query, this.state.query)){
			this.updateResults();
		}
	}

	initialize() {
		this.updateResults();
	}

	urlChanged(){
		let vm = this;
		if(vm.urlTimeout){ clearTimeout(vm.urlTimeout); vm.urlTimeout = false; }
		vm.urlTimeout = setTimeout(function() {
			let query = ((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '')
			if(query !== vm.statequery){
				vm.setState({query: query});
			}
		}, 30);
	}

	filtersToQuery() {
		let newQuery = serialize(this.formRef.current, '|', true)
		if(history.location.search !== '?'+newQuery){
			window.dynamicHistory.push((newQuery !== '' ? '?'+newQuery : ''));
		}
	}

	updateResults(queryString = false) {
		let vm = this;

		vm.setState({loading: true});
		if(!queryString){
			queryString = vm.state.query;
		}

		setTimeout(function() {
			let requestURL = vm.props.source+'?'+queryString;

			/*if(vm.dummyBool){
				requestURL = '/dummy/data/listing-test.json?'+queryString
			}
			vm.dummyBool = !vm.dummyBool;*/
			/*if(queryString === ''){
				requestURL = '/dummy/data/listing-test-first.json?'+queryString
			}*/

			axios.get(requestURL).then(res => {

				if(res.data.status === 'ok'){
					vm.setState({
						results: res.data.results,
						filters: res.data.filters,
						initialLoad: true,
						loading: false,
						listingType: res.data.listingType,
					})
				}
				else {
					console.log('error');
				}
			})
		}, 1000);
	}



	filtersUpdated(){
		console.log('Debug: Inputs Updated');
		this.filtersToQuery();
	}

	render() {
		let vm = this;
		let itemsAt = 0;
		return (
			<section className={"section listing loader-container " + vm.props.className + (vm.props.filters ? ' has-filters' : '') + ' size-'+vm.props.size}>
				<Loader loading={vm.state.loading || !vm.state.results} strict={!vm.state.initialLoad} />
				{(vm.props.filters ? (
					<ProductFilters filters={vm.state.filters} onUpdate={vm.filtersUpdated} ref={vm.formRef} />
				) : null)}
				<div className={"listing-content type-" + vm.state.listingType}>
					{(vm.state.results.length ?
						<ul className="content-results">
							{vm.state.results.map((item, nth) => {
								itemsAt += (item.size ? item.size : 1);
								let contents = [];
								switch(item.type){
									case 'banner':
										let Item = (item.url ? 'a' : 'div');
										contents.push(
											<li key={nth} className={"results-item x"+item.size}>
												<Item className="item-banner"><Image className="banner-image" src={item.image} alt={item.title} bg /></Item>
											</li>
										);
									break;
									default:
										switch(vm.state.listingType){
											case "dealer":
												contents.push(
													<li key={nth} className="results-item">
														<ContentBox
															type="plain"
															className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
															title={item.title}
															subtitle={item.dealer}
															additionTitle={item.count + ' ARAÇ'}
															image={item.image}
															labels={item.labels}
															faved={item.favorited}
															favControls={'/dummy/data/fav/dealer/'+item.id}
															badge={(item.status !== 1 ? false : (item.status === 2 ? {text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur'} : {text : 'Satıldı', type : 'error'}))}
															bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false )}
															url={item.link}
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
															image={item.image}
															price={item.price}
															labels={item.labels}
															faved={item.favorited}
															badge={(item.status === 1 ? false : (item.status === 2 ? {text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur'} : {text : 'Satıldı', type : 'error'}))}
															bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false )}
															url={item.link}
														/>
													</li>
												);
											break;
										}
									break;
								}

								if(itemsAt === 8 && vm.props.showAds){
									contents.push(<div key={"adwrap_" + nth} className="results-adwrap results-item x4">
										<a className="adwrap-link" href="http://www.citroen.com.tr" target="_blank" title="Citroen" rel="noopener noreferrer" >
											<Image src="/dummy/images/listing-ad.jpg" />
										</a>
									</div>);
								}

								return contents;
							})}
						</ul>
					:
						<div className="results-error">Sonuç bulunamadı..</div>
					)}
				</div>
			</section>
		);
	}
}

ProductListing.defaultProps = {
	className : '',
	filters: true,
	urlBinding: true,
	source: '/dummy/data/listing.json',
	showAds: true,
	size: 4,
	query: false,
};

// Filters
const ProductFilters = React.forwardRef(function(props, ref){
	return (
		<aside className="listing-filters">
			<form className="filters-form" ref={ref}>
				{(props.filters ?
				props.filters.map((filter, nth) => (
					<ProductFilter data={filter} key={nth} onUpdate={props.onUpdate} />
				)) : false )}
			</form>
		</aside>
	)
});

class ProductFilter extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: props.data.expanded,
			active: props.data.expanded,
			show: props.data.expanded,
		}

		this.toggle = this.toggle.bind(this);
		this.timeout = false;
	}

	componentDidUpdate(prevProps, prevState){
		let vm = this;

		if(prevState.expanded !== vm.state.expanded){
			if(vm.timeout){
				clearTimeout(vm.timeout);
			}

			if(vm.state.expanded){
				vm.setState({active: true});
				vm.timeout = setTimeout(function() {
					vm.setState({show: true});
				}, 30);
			}
			else {
				vm.setState({show: false});
				vm.timeout = setTimeout(function() {
					vm.setState({active: false});
				}, 210);
			}
		}
	}

	toggle(){
		this.setState({expanded: !this.state.expanded})
	}

	render() {
		let vm = this;

		let filterContent = false;
		let filterData = vm.props.data;


		switch(filterData.display){
			case "list":
				filterContent = <FilterTypeList data={filterData} onUpdate={vm.props.onUpdate} />;
			break;
			case "icons":
				filterContent = <FilterTypeIcons data={filterData} onUpdate={vm.props.onUpdate} />;
			break;
			case "range":
				filterContent = <FilterTypeRange data={filterData} onUpdate={vm.props.onUpdate} />;
			break;
			default: break;
		}

		if(filterContent){
			return (
				<div className={"filters-filter type-" + filterData.display + (vm.state.active ? ' active' : '') + (vm.state.show ? ' show' : '')}>
					<button type="button" className="filter-title" onClick={vm.toggle}>{filterData.title}</button>

					<div className="filter-content">
						{filterContent}
					</div>
				</div>
			)
		}
		else { return false; }
	}
}

// Filter Types
class FilterTypeList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			opts: props.data.opts,
		}

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidUpdate(prevProps){
		if(!isEqual(prevProps.data, this.props.data)){
			this.setState({opts: this.props.data.opts});
		}
	}

	handleChange(e, nth) {
		let newOpts = this.state.opts;
		newOpts[nth].selected = e.target.checked;

		this.setState({opts: newOpts});

		this.props.onUpdate();
	}

	render() {
		let vm = this;
		let data = vm.props.data;
		let opts = vm.state.opts;
		return (
			<ul className="filter-list">
				{opts.map((opt, nth) => {
					let id = 'filter_input'+vm.props.data.name+'_'+nth;
					return(
						<li className="filter-item" key={nth}>
							<div className="inputwrap type-checkbox no-select">
								<div className="checkwrap">
									<input
										key={id}
										type="checkbox"
										name={data.name + '[]'}
										id={id}
										value={opt.value}
										checked={opt.selected ? true : false}
										onChange={(e) => vm.handleChange(e, nth)} />
									<label htmlFor={id}>
										<span></span>
										<div className="item-text checkwrap-content">
											<div className="text-title">
												{opt.title}
												{(data.showCounts ?
													<span className="title-count">({opt.count})</span>
												: false)}
												</div>
											{(opt.logo ?
												<Image className="item-logo" src={opt.logo} />
											: false )}
										</div>
									</label>
								</div>
							</div>
						</li>
					)
				})}
			</ul>
		)
	}
}

class FilterTypeIcons extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			opts: props.data.opts,
		}

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidUpdate(prevProps){
		if(!isEqual(prevProps.data, this.props.data)){
			this.setState({opts: this.props.data.opts});
		}
	}

	handleChange(e, nth) {
		let newOpts = this.state.opts;
		newOpts[nth].selected = e.target.checked;

		this.setState({opts: newOpts});

		this.props.onUpdate();
	}

	render() {
		let vm = this;
		let data = vm.props.data;
		let opts = vm.state.opts;
		return (
			<ul className="filter-list">
				{opts.map((opt, nth) => {
					let id = 'filter_input'+vm.props.data.name+'_'+nth;
					return(
						<li className="filter-item" key={nth}>
							<input
								key={id}
								type="checkbox"
								name={data.name + '[]'}
								id={id}
								value={opt.value}
								checked={opt.selected ? true : false}
								onChange={(e) => vm.handleChange(e, nth)} />
							<label className="item-content" htmlFor={id}>
								{/*<i className={"content-icon icon-bodytype-"+opt.icon}></i>*/}
								<SVG
									className="content-icon"
									src={opt.icon}
								>
									<Image src={opt.icon} />
								</SVG>
								<p className="content-title">
									{opt.title}
								</p>
							</label>
						</li>
					)
				})}
			</ul>
		)
	}
}

class FilterTypeRange extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			opts: clone(props.data.opts),
		}

		this.lateUpdate = debounce(this.lateUpdate.bind(this), 500);
	}

	componentDidUpdate(prevProps){
		if(!isEqual(prevProps.data, this.props.data)){
			this.setState({opts: this.props.data.opts});
		}
	}

	handleChange(e, nth) {
		let newOpts = clone(this.state.opts);
		if(newOpts[nth].value !== e.target.value){
			newOpts[nth].value = e.target.value;

			this.setState({opts: newOpts});
			this.lateUpdate();
		}
	}

	lateUpdate(){
		this.props.onUpdate();
	}

	render() {
		let vm = this;
		let data = vm.props.data;
		let opts = vm.state.opts;

		return (
			<div className="filter-inputs">
				{opts.map((opt, nth) => (
					<div className="inputs-inputwrap" key={nth}>
						 <input className="inputs-input" name={data.name} type={data.type} value={(opt.value ? opt.value : '')} placeholder={opt.text} onChange={(e) => vm.handleChange(e, nth)} />
					</div>
				))}
				
			</div>
		)
	}
}