import React from 'react';

// Partials
import ContentBox from 'components/partials/contentbox.js'
import Image from 'components/partials/image.js';
import SVG from 'react-inlinesvg';
import Loader from 'components/partials/loader.js';
import { FormInput } from 'components/partials/forms.js';

// Deps
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import {serializeArray } from 'functions/helpers';
import history from 'controllers/history'
import request from 'controllers/request'
import { connect } from "react-redux";
import queryString from 'query-string';

const mapStateToProps = state => {
	return { mobile: state.generic.mobile };
};

class Listing extends React.Component {
	constructor(props) {
		super(props)
		
		this.state = {
			loading: true,
			listingData: false,
			query: (this.props.query ? this.props.query : ((history.location.search && history.location.search !== '') ? queryString.parse(history.location.search) : {})),
			order: null,
			initialLoad: true,
		}

		this.removeFilter = this.removeFilter.bind(this);
		this.filtersUpdated = this.filtersUpdated.bind(this);
		this.updateOrder = this.updateOrder.bind(this);
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
		/*if(this.props.query && !isEqual(prevState.query, this.state.query)){
			this.filtersToQuery();
		}*/

		if(!isEqual(prevProps.query, this.props.query)){
			this.updateURL();
			this.updateResults();
		}

		if(!isEqual(prevState.listingData, this.state.listingData)){
			this.filtersToQuery();
		}

		if(!isEqual(prevState.query, this.state.query)){
			this.updateURL();
			this.updateResults();
		}
	}

	urlChanged(){
		let vm = this;
		if(vm.urlTimeout){ clearTimeout(vm.urlTimeout); vm.urlTimeout = false; }
		vm.urlTimeout = setTimeout(function() {
			let query = queryString.parse((history.location.search && history.location.search !== '') ? history.location.search.replace('?', '') : '');
			if(!isEqual(vm.state.query, query)){
				vm.setState({query: query});

				if(query.siralama){
					vm.setState({order: query.siralama});
				}
			}
		}, 30);
	}

	filtersToQuery(){
		let newQuery = serializeArray(this.formRef.current, '|', true);

		if(this.state.order !== null){
			newQuery.siralama = this.state.order;
		}
		else if(newQuery.siralama){
			delete newQuery.siralama;
		}

		if(!isEqual(this.state.query, newQuery)){
			this.setState({query: newQuery});
		}

	}

	updateURL() {
		let query = queryString.stringify(this.state.query);
		if(history.location.search !== '?'+query){
			if(query !== ''){
				if(this.state.initialLoad){
					window.dynamicHistory.replace('?'+query);
				}
				else{
					window.dynamicHistory.push('?'+query);
				}
			}
		}
	}

	removeFilter(name = false) {
		let newData = clone(this.state.listingData);
		newData.filters = newData.filters.map((filter) => {
			if(filter.name === name || name === false){
				let newFilter = filter;

				if(newFilter.value){ newFilter.value = "" };
				if(newFilter.opts){
					newFilter.opts = newFilter.opts.map((opt) => {
						let newOpt = opt;
						if(newOpt.selected){
							newOpt.selected = false;
						}
						if(newOpt.value){
							newOpt.value = "";
						}

						return newOpt;
					});
				}

				return newFilter;
			}
			else return filter;
		});
		
		this.setState({listingData: newData});
	}

	updateResults() {
		let vm = this;

		vm.setState({loading: true});

		let q = queryString.stringify(vm.state.query);
		let requestURL = vm.props.source+'?'+q;

		setTimeout(function() {
			request.get(requestURL, false, function(payload, status){
				if(payload){
					vm.setState({
						listingData: payload,
						results: payload.results,
						order: payload.order ? payload.order : null,
						loading: false,
						//listingData.type: payload.type,
						total: (payload.totalResults ? payload.totalResults : 0),
					});

					if(vm.state.initialLoad){
						setTimeout(function() {
							vm.setState({ initialLoad: false });
						}, 40);
					}
				}
			});
		}, 500); /// Dummy Delay
	}

	updateOrder(order){
		let newQuery = clone(this.state.query);

		if(order === null && newQuery.order){
			delete newQuery.order;
		}
		else if(order !== null){
			newQuery['siralama'] = order;
		}

		this.setState({query: newQuery, order: order});
	}

	filtersUpdated(){
		this.filtersToQuery();
	}

	render() {
		let vm = this;

		let options = [
			{value: 'price_desc', label: "Fiyata Göre (Önce Yüksek)"},
			{value: 'price_asc', label: "Fiyata Göre (Önce Düşük)"},
			{value: 'date_desc', label: "Tarihe Göre (Önce Yüksek)"},
			{value: 'date_asc', label: "Tarihe Göre (Önce Düşük)"}
		]

		let orderVal = null;
		//(vm.state.order === null ? null : {value: vm.state.order, label: vm.state.order});
		if(vm.state.order && vm.state.order !== null){
			for(let k = 0; k < options.length; k++){
				if(options[k].value === vm.state.order){
					orderVal = options[k];
				}
			}
		}

		return (
			<section className={"section listing loader-container " + vm.props.className + (vm.props.filters ? ' has-filters' : '') + ' size-'+vm.props.size}>
				<Loader loading={vm.state.loading || !vm.state.results} strict={!vm.state.initialLoad} />
				{vm.props.filters &&
					<ListingFilters data={vm.state.listingData} mobile={vm.props.mobile} onUpdate={vm.filtersUpdated} formRef={vm.formRef} />
				}
				<div className={"listing-content type-" + vm.state.listingData.type}>
					<aside className="content-top">
						{!vm.props.mobile &&
							<ActiveFilters data={vm.state.listingData} onFilterRemove={vm.removeFilter} />
						}

						<FormInput
							type="select"
							placeholder="Sırala"
							isSearchable={false}
							value={orderVal}
							onChange={vm.updateOrder}
							options={options}
							className="top-order" />
					</aside>
					<ListingResults data={vm.state.listingData} mobile={vm.props.mobile} />
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

export default connect(mapStateToProps)(Listing);

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
									<li key={nth} className={"results-item banner x"+item.size}>
										<Item className="item-banner"><Image className="banner-image" src={item.image} alt={item.title} bg={!vm.props.mobile} /></Item>
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

class ListingFilters extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			active: false,
			show: false,
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.mobile !== this.props.mobile){
			this.setState({active: false, expanded: false})
		}
	}

	render() {
		let data = this.props.data;
		return (
			<aside className={"listing-filters" + (this.state.active ? ' active' : '') + (this.state.show ? ' show' : '')}>
				<div className="filters-innerwrap">
					{data.filtersTitle && 
						<div className="filters-header">
							<h1 className="header-title">{data.filtersTitle}</h1>
						</div>
					}
					<form className="filters-form" ref={this.props.formRef}>
						{(data && data.filters ?
						data.filters.map((filter, nth) => (
							<ListingFilter data={filter} key={nth} onUpdate={this.props.onUpdate} />
						)) : false )}
					</form>
				</div>
			</aside>
		)
	}
}

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
			case "tree":
				filterContent = <FilterTypeTree data={filterData} onUpdate={vm.props.onUpdate} />;
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

class FilterTypeTree extends React.Component {
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

	handleChange(newChild, nth) {
		/*let newOpts = this.state.opts;
		newOpts[nth].selected = e.target.checked;

		this.setState({opts: newOpts});

		this.props.onUpdate();*/

		let newOpts = clone(this.state.opts);
		newOpts[nth] = newChild;
		this.setState({ opts: newOpts });

		this.props.onUpdate();
	}

	render() {
		let vm = this;
		let data = vm.props.data;
		let opts = vm.state.opts;
		return (
			<ul className="filter-list">
				{opts.map((opt, nth) => {
					let idprefix = 'filter_input_'+data.name;
					return(
						<TreeFilterItem data={opt} name={data.name} idprefix={idprefix} nth={nth} key={nth} level={1} onChange={(e) => {this.handleChange(e, nth)}} />
					)
				})}
			</ul>
		)
	}
}

	class TreeFilterItem extends React.Component {
		constructor(props) {
			super(props)
			let active = this.calculateActive(props.data);

			this.state = {
				data: props.data,
				expanded: active,
				active: active,
			}

			//this.handleChange = this.handleChange.bind(this);
			this.toggleExpand = this.toggleExpand.bind(this);
			this.calculateActive = this.calculateActive.bind(this);
			this.handleValueChange = this.handleValueChange.bind(this);
			this.handleParentChange = this.handleParentChange.bind(this);
			this.deselectChildren = this.deselectChildren.bind(this);
			this.selectChildren = this.selectChildren.bind(this);
			this.handleChildrenChange = this.handleChildrenChange.bind(this);

			this.id = props.idprefix + '_' + props.nth;
		}

		componentDidUpdate(prevProps, prevState){
			if(isEqual(prevState.data, this.state.data)){
				if(!isEqual(this.state.data, this.props.data)){
					let active = this.calculateActive(this.props.data);
					this.setState({
						data: this.props.data,
						active: active,
					});
				}
			}
			else {
				this.props.onChange(this.state.data);
			}
		}

		calculateActive(data = this.state.data){
			let result = false;

			if(data.children && data.children.length){
				for(let k = 0; k < data.children.length; k++){
					if(data.children[k]){
						if(data.children[k].value){
							if(data.children[k].selected){
								result = true;
							}
						}
						else if(result === false) {
							result = this.calculateActive(data.children[k]);
						}
					}
				}
			}

			return result;
		}

		deselectChildren(data = this.state.data){
			let vm = this;
			let newData = clone(data);
			if(newData.children){
				newData.children = newData.children.map(function(child, nth){
					let newChild = child;
					if(newChild.children){
						newChild = vm.deselectChildren(newChild);
					}
					else {
						newChild.selected = false;
					}
					return newChild;
				});
			}

			vm.setState({data: newData});
		}

		selectChildren(data = this.state.data){
			let vm = this;
			let newData = clone(data);
			if(newData.children){
				newData.children = newData.children.map(function(child, nth){
					let newChild = child;
					if(newChild.children){
						newChild = vm.selectChildren(newChild);
					}
					else {
						newChild.selected = true;
					}
					return newChild;
				});
			}

			vm.setState({data: newData});
		}

		toggleExpand(){
			this.setState({expanded: !this.state.expanded});
		}

		handleValueChange(e){
			let newData = clone(this.state.data);
			newData.selected = e.target.checked;
			this.setState({ data: newData })
		}

		handleParentChange(e){
			let active = e.target.checked;
			if(active){
				this.selectChildren();
			}
			else{
				this.deselectChildren();
			}

			this.setState({active: active});
		}

		handleChildrenChange(newChild, nth){
			let newData = clone(this.state.data);
			newData.children[nth] = newChild;
			let active = this.calculateActive(newData);
			this.setState({ data: newData, active: active });
			this.props.onChange(newData);
		}

		render() {
			let vm = this;
			let data = vm.state.data;
			let name = vm.props.name;
			return (
				<li className={"filter-item level-"+vm.props.level}>
					{(data && data.value ?
						<div className="inputwrap type-checkbox no-select">
							<div className="item-wrap">
								<div className="checkwrap">
									<input
										key={vm.id}
										type="checkbox"
										name={name + '[]'}
										id={vm.id}
										value={data.value}
										checked={data.selected ? true : false}
										onChange={(e) => vm.handleValueChange(e)} />
									<label htmlFor={vm.id}>
										<span></span>
										<div className="item-text checkwrap-content">
											<div className="text-title">
												{data.title}
											</div>
										</div>
									</label>
								</div>
							</div>
						</div>
					:
						data &&
						<div className={"item-subgroup" + (vm.state.expanded ? ' expanded' : '')}>
							<button className="item-wrap" type="button" onClick={vm.toggleExpand}>
								<div className="inputwrap type-checkbox no-select">
									<div className="checkwrap">
										<input
											key={vm.id}
											type="checkbox"
											id={vm.id}
											checked={vm.state.active}
											onChange={vm.handleParentChange} />
										<label htmlFor={vm.id}>
											<span></span>
											<div className="item-text checkwrap-content">
												<div className="text-title">
													{data.title}
												</div>
											</div>
										</label>
									</div>
								</div>
							</button>
							<ul className="item-submenu">
								{data.children.map((opt, nth) => {
									return(
										<TreeFilterItem data={opt} name={name} idprefix={vm.id} key={nth} nth={nth} level={vm.props.level+1} onChange={(e) => {this.handleChildrenChange(e, nth)}} />
									)
								})}
							</ul>
						</div>
					)}
				</li>
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

		if(this.props.data && this.props.data.filters){
			filters = this.props.data.filters.map((group, nth) => {
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

		if(filters.length){
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
		else return false;
	}
}