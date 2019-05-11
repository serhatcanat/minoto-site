import React from 'react';

// Partials
import ContentBox from 'components/partials/contentbox.js'
import Image from 'components/partials/image.js';
import SVG from 'react-inlinesvg';
import Loader from 'components/partials/loader.js';

// Deps
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import {serialize } from 'functions/helpers';
import history from 'controllers/history'
import request from 'controllers/request'

export default class Listing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			listingData: false,
			query: (this.props.query ? this.props.query : ((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '')),
			initialLoad: false,
		}

		this.removeFilter = this.removeFilter.bind(this);
		this.filtersUpdated = this.filtersUpdated.bind(this);
		this.formRef = React.createRef();

		//this.query = ((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '');
		this.dummyBool = false;
		this.listenerAbort = false;
		this.urlTimeout = false;
	}

	componentDidMount() {
		let vm = this;

		vm.updateResults();

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

		/*if(!isEqual(prevState.filters, this.state.filters)){
			console.log(this.state.filters);
		}*/
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
			if(this.state.query === ""){
				if(newQuery !== ''){
					window.dynamicHistory.replace('?'+newQuery);
				}
			}
			else{
				window.dynamicHistory.push((newQuery !== '' ? '?'+newQuery : '?empty=empty'));
			}
		}
	}

	removeFilter(name) {
		let newFilters = clone(this.state.filters).filter((filter) => { return !(filter.name === name); });
		this.setState({filters: newFilters});
	}

	updateResults(queryString = false) {
		let vm = this;

		vm.setState({loading: true});
		if(!queryString){
			queryString = vm.state.query;
		}

		let requestURL = vm.props.source+'?'+queryString;

		request.get(requestURL, false, function(payload, status){
			if(payload){
				vm.setState({
					listingData: payload,
					results: payload.results,
					initialLoad: true,
					loading: false,
					//listingData.type: payload.type,
					total: (payload.totalResults ? payload.totalResults : 0),
				})
			}
		})
	}

	filtersUpdated(){
		this.filtersToQuery();
	}

	render() {
		let vm = this;
		return (
			<section className={"section listing loader-container " + vm.props.className + (vm.props.filters ? ' has-filters' : '') + ' size-'+vm.props.size}>
				<Loader loading={vm.state.loading || !vm.state.results} strict={!vm.state.initialLoad} />
				{vm.props.filters &&
					<ListingFilters data={vm.state.listingData} onUpdate={vm.filtersUpdated} ref={vm.formRef} />
				}
				<div className={"listing-content type-" + vm.state.listingData.type}>
					<aside className="content-top">
						<ActiveFilters filters={vm.state.filters} onFilterRemove={vm.removeFilter} />
					</aside>
					<ListingResults data={vm.state.listingData} />
				</div>
			</section>
		);
	}
}

Listing.defaultProps = {
	className : '',
	filters: true,
	urlBinding: true,
	source: '/dummy/data/listing.json',
	showAds: true,
	size: 4,
	query: false,
};

// Results
class ListingResults extends React.Component {
	render() {
		let vm = this;
		let itemsAt = 0;
		let data = vm.props.data;
		let results = data.results;
		if(results && results.length){
			return (
				<ul className="content-results">
					{results.map((item, nth) => {
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
								switch(data.type){
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
									case "brand":
										contents.push(
											<li key={nth} className="results-item">
												<ContentBox
													type="plain"
													className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
													title={item.title}
													labels={item.labels}
													additionTitle={item.count + ' ARAÇ'}
													image={item.image}
													faved={item.favorited}
													favControls={'/dummy/data/fav/dealer/'+item.id}
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
			)
		}
		else {
			return (
				<div className="results-error">Sonuç bulunamadı..</div>
			)
		}
	}
}

// Filters
const ListingFilters = React.forwardRef(function(props, ref){
	let data = props.data;
	return (
		<aside className="listing-filters">
			{data.filtersTitle && 
				<div className="filters-header">
					<h1 className="header-title">{data.filtersTitle}</h1>
				</div>
			}
			<form className="filters-form" ref={ref}>
				{(props.data && data.filters ?
				data.filters.map((filter, nth) => (
					<ListingFilter data={filter} key={nth} onUpdate={props.onUpdate} />
				)) : false )}
			</form>
		</aside>
	)
});

// Single Filter
class ListingFilter extends React.Component {
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
			case "text":
				filterContent = <FilterTypeText data={filterData} onUpdate={vm.props.onUpdate} />;
			break;
			default: break;
		}

		if(filterContent){
			return (
				<div className={"filters-filter type-" + filterData.display + (filterData.expandable !== false ? ' expandable' : '') + (vm.state.active ? ' active' : '') + (vm.state.show ? ' show' : '')}>
					{filterData.expandable !== false &&
						<button type="button" className="filter-title" onClick={vm.toggle}>{filterData.title}</button>
					}

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

class FilterTypeText extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			value: props.data.value,
		}

		this.handleChange = this.handleChange.bind(this);
		this.update = this.update.bind(this);
	}

	componentDidMount(){
		this.update();
	}

	componentDidUpdate(prevProps){
		if(!isEqual(prevProps.data, this.props.data)){
			this.setState({value: this.props.data.value});
		}
	}

	handleChange(e) {
		this.setState({value: e.target.value});
	}

	update(){
		this.props.onUpdate();	
	}

	render() {
		let vm = this;
		let data = vm.props.data;
		return (
			<div className="filter-inputs">
				<div className="inputwrap type-text">
					 <input className="inputs-input" name={data.name} type="text" value={this.state.value} placeholder={data.title} onChange={(e) => vm.handleChange(e)} />
					 <button className="inputs-submit" type="button" onClick={this.update}><i className="icon-search"></i></button>
				</div>
				
			</div>
		)
	}
}

// Top Filter Controls
class ActiveFilters extends React.Component {

	render() {
		let filters = [];

		if(this.props.filters){
			filters = this.props.filters.map((group, nth) => {
				let text = false;
				let data = false;
				switch(group.display){
					case "range":
						data = group.opts.filter((filter) =>  {
							return filter.value !== "";
						}).map((filter) => {
							return (filter.prefix !== "" ? filter.prefix + " " : '') + filter.value + (filter.postfix ? " " + filter.postfix : '');
						});
						if(data.length){ text = data.join(' - '); }
					break;
					case "text":
						text = (group.value ? group.value : false);
					break;
					default: // list, icons
						data = group.opts.filter((filter) => {
							return(filter.selected);
						}).map((filter) => {
							return filter.title;
						});

						if(data.length){ text = data.join(', '); }
					break;
				}

				return text ? {name: group.name, title: group.title, label: text} : false;
			}).filter((filter) => { return filter !== false; });
		}

		return (
			<div className="top-activefilters">
				{filters.map((filter, nth) => (
					<span className="activefilters-item" key={nth} title={filter.title}>
						{filter.label}
						<button type="button" onClick={() => { this.props.onFilterRemove(filter.name); } } className="item-remove"><i className="icon-close"></i></button>
					</span>
				))}
			</div>
		)
	}
}