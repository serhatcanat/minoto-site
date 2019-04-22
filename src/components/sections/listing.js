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
			query: (history.location.search ? history.location.search.replace('?=', '') : ''),
			filters: false,
			loading: true,
			initialLoad: false,
		}

		this.initialize = this.initialize.bind(this);
		this.filtersUpdated = this.filtersUpdated.bind(this);
		this.formRef = React.createRef();
	}

	componentDidMount() {
		this.initialize();

		//history.listen(function (e) {
			//console.log(e)
		//});
	}

	componentDidUpdate(prevProps, prevState) {
		if(!isEqual(prevState.filters, this.state.filters)){
			if(window.dynamicHistory){
				this.setState({query: serialize(this.formRef.current)});
			}
		}

		if(prevState.query !== this.state.query){
			window.dynamicHistory.push('?='+this.state.query);
		}
	}

	initialize() {
		this.updateResults();
	}

	updateResults() {
		let vm = this;

		if(vm.state.initialLoad){
			this.setState({query: serialize(this.formRef.current)});
		}

		setTimeout(function() {
			axios.get('/dummy/data/listing.json?='+vm.state.query).then(res => {

				if(res.data.status === 'ok'){
					vm.setState({ results: res.data.results, filters: res.data.filters, initialLoad: true, loading: false })
				}
				else {
					console.log('error');
				}
			})
		}, 1000);
	}

	filtersUpdated(){
		this.setState({loading: true});
		this.updateResults();
	}

	render() {
		let vm = this;
		let itemsAt = 0;
		return (
			<section className="section listing loader-container">
				<Loader loading={vm.state.loading || !vm.state.results} strict={!vm.state.initialLoad} />
				{(vm.props.filters ? (
					<ProductFilters filters={vm.state.filters} onUpdate={vm.filtersUpdated} ref={vm.formRef} />
				) : null)}
				<div className="listing-content">
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
													badge={item.status !== 1 && (item.status === 2 ? {text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur'} : {text : 'Satıldı', type : 'error'})}
													bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false )}
													url='http://www.google.com/'
												/>
											</li>
										);
									break;
								}

								if(itemsAt === 8){
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
		let filterData = vm.props.data;

		let filterContent = false;


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
					<button className="filter-title" onClick={vm.toggle}>{filterData.title}</button>

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

	/*componentDidUpdate(prevProps){
		if(!isEqual(prevProps.data, this.props.data)){
			this.setState({opts: this.props.data.opts});
		}
	}*/

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
									<img src={opt.icon} />
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

	handleChange(e, nth) {
		let newOpts = clone(this.state.opts);
		newOpts[nth].value = e.target.value;

		this.setState({opts: newOpts});
		this.lateUpdate();
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