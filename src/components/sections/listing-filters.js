import React from 'react';

// Partials
import Image from 'components/partials/image.js';
import SVG from 'react-inlinesvg';
import Btn from 'components/partials/btn.js';
import Slider from 'components/partials/slider'

// Deps
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import extend from 'lodash/extend';
import { serializeArray, isExact } from 'functions/helpers';
import { connect } from "react-redux";
import { setListingFiltersExpansion } from 'data/store.generic';
import { blockOverflow } from "functions/helpers";

const mapStateToProps = state => {
	return {
		mobile: state.generic.mobile,
		expanded: state.generic.listingFiltersExpanded,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		hideFilters: () => dispatch(setListingFiltersExpansion(false))
	}
}

class ListingFilters extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			active: false,
			show: false,
			data: false,
			query: false,
			activeFilters: 0,
		}

		this.serializeFilters = this.serializeFilters.bind(this);
		this.clearFilters = this.clearFilters.bind(this);
		this.query = false;

		this.formRef = React.createRef();
	}

	componentDidMount() {
		this.serializeFilters();
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;

		if (prevProps.mobile !== vm.props.mobile) {
			vm.setState({ active: false, show: false });
			vm.props.hideFilters();

		}

		if (prevProps.expanded !== vm.props.expanded) {
			if (vm.props.expanded) {
				vm.setState({ active: true });
				blockOverflow(true);
				setTimeout(function () {
					vm.setState({ show: true })
				}, 30);
			}
			else {
				vm.setState({ show: false });
				setTimeout(function () {
					blockOverflow(false);
					vm.setState({ active: false })
				}, 250);
			}
		}

		if (!isExact(prevProps.data, vm.props.data)) {
			vm.serializeFilters();
		}
	}

	serializeFilters(echo = false) {
		let vm = this;
		let filterCount = 0;
		let newQuery = {};

		if (vm.formRef.current) {
			newQuery = serializeArray(vm.formRef.current, '|', true);
		}

		if (vm.props.query) {
			newQuery = extend({}, newQuery, vm.props.query);
		}

		filterCount = Object.keys(newQuery).length;

		if (vm.props.order !== null) {
			newQuery.siralama = vm.state.order;
		}
		else if (newQuery.siralama) {
			delete newQuery.siralama;
			filterCount--;
		}

		if (!isExact(vm.query, newQuery)) {
			vm.query = newQuery;
			vm.setState({activeFilters: filterCount})
			if (vm.props.onUpdate) {
				vm.props.onUpdate(vm.query);
			}
		}
		else if (!echo) {
			setTimeout(function () {
				vm.serializeFilters(true);
			}, 15);
		}
	}

	clearFilters() {
		let query = {};
		if (this.props.order !== null) {
			query.siralama = this.state.order;
		}

		this.query = query;
		this.props.hideFilters();
		if (this.props.onUpdate) {
			this.props.onUpdate(this.query);
		}
	}

	render() {
		let data = this.props.data;
		if (data) {
			return (
				<aside className={"section listing-filters " + this.props.className + (this.state.active ? ' active' : '') + (this.state.show ? ' show' : '')}>
					<div className="filters-content">
						<div className="filters-innerwrap">
							{data.filtersTitle &&
								<div className="filters-header">
									<h1 className="header-title">{data.filtersTitle}</h1>
									{this.state.activeFilters > 0 &&
										<button className="header-clear" onClick={this.clearFilters}>Filtreleri Temizle</button>
									}
								</div>
							}
							<form className="filters-form" ref={this.formRef}>
								{(data && data.filters ?
									data.filters.map((filter, nth) => (
										<ListingFilter data={filter} key={nth} onUpdate={this.serializeFilters} />
									)) : false)}
							</form>

						</div>
						{this.props.mobile &&
							<div className="filters-controls">
								<Btn block uppercase className="controls-btn" onClick={this.props.hideFilters}>Ara</Btn>
							</div>
						}
					</div>
					{this.props.mobile &&
						<button type="button" className="filters-overlay" onClick={this.props.hideFilters}></button>
					}
				</aside>
			)
		}
		else return false;
	}
}

ListingFilters.defaultProps = {
	className: '',
	order: null,
}

export default connect(mapStateToProps, mapDispatchToProps)(ListingFilters);

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
		this.filterExpandChange = this.filterExpandChange.bind(this);

		this.scrollElem = React.createRef();
		this.timeout = false;
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;

		if (prevState.expanded !== vm.state.expanded) {
			if (vm.timeout) {
				clearTimeout(vm.timeout);
			}

			if (vm.state.expanded) {
				vm.setState({ active: true });
				vm.timeout = setTimeout(function () {
					vm.setState({ show: true });
					console.log(vm.scrollElem.current);
					vm.scrollElem.current.instance.update();
				}, 30);
			}
			else {
				vm.setState({ show: false });
				vm.timeout = setTimeout(function () {
					vm.setState({ active: false });
				}, 210);
			}
		}
	}

	filterExpandChange(){
		let vm = this;
		setTimeout(function() {
			vm.scrollElem.current.instance.update();
		}, 30);
	}

	toggle() {
		this.setState({ expanded: !this.state.expanded })
	}

	render() {
		let vm = this;

		let filterContent = false;
		let filterData = vm.props.data;


		switch (filterData.display) {
			case "list":
				filterContent = <FilterTypeList data={filterData} onUpdate={vm.props.onUpdate} />;
				break;
			case "tree":
				filterContent = <FilterTypeTree data={filterData} onUpdate={vm.props.onUpdate} onExpand={this.filterExpandChange} />;
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

		if (filterContent) {
			return (
				<div className={"filters-filter type-" + filterData.display + (filterData.expandable !== false ? ' expandable' : '') + (vm.state.active ? ' active' : '') + (vm.state.show ? ' show' : '')}>
					{filterData.expandable !== false &&
						<button type="button" className="filter-title" onClick={vm.toggle}>{filterData.title}</button>
					}

					<div className="filter-content">
						<Slider className="filter-slidewrap" scrollBar ref={vm.scrollElem}>
							{filterContent}
						</Slider>
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

	componentDidUpdate(prevProps) {
		if (!isEqual(prevProps.data, this.props.data)) {
			this.setState({ opts: this.props.data.opts });
		}
	}

	handleChange(e, nth) {
		let newOpts = this.state.opts;
		newOpts[nth].selected = e.target.checked;

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
					let id = 'filter_input' + vm.props.data.name + '_' + nth;
					return (
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
												: false)}
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

	componentDidUpdate(prevProps) {
		if (!isEqual(prevProps.data, this.props.data)) {
			this.setState({ opts: this.props.data.opts });
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
					let idprefix = 'filter_input_' + data.name;
					return (
						<TreeFilterItem data={opt} name={data.name} idprefix={idprefix} nth={nth} key={nth} level={1} onChange={(e) => { this.handleChange(e, nth) }} onExpand={this.props.onExpand} />
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

	componentDidUpdate(prevProps, prevState) {
		let vm = this;
		if (isExact(prevState.data, vm.state.data)) {
			if (!isExact(vm.state.data, vm.props.data)) {
				let active = vm.calculateActive(vm.props.data);
				vm.setState({
					data: vm.props.data,
					active: active,
				});
			}
		}
		else {
			vm.props.onChange(vm.state.data);
		}
	}

	calculateActive(data = this.state.data) {
		let result = false;

		if (data.children && data.children.length) {
			for (let k = 0; k < data.children.length; k++) {
				if (data.children[k]) {
					if (data.children[k].value) {
						if (data.children[k].selected) {
							result = true;
						}
					}
					else if (result === false) {
						result = this.calculateActive(data.children[k]);
					}
				}
			}
		}

		return result;
	}

	deselectChildren(inputData = false) {
		let vm = this;
		let data = (inputData ? inputData : vm.state.data);
		let newData = clone(data);
		if (newData.children) {
			newData.children = newData.children.map(function (child, nth) {
				let newChild = clone(child);
				if (newChild.children) {
					newChild = vm.deselectChildren(newChild);
				}
				else {
					newChild.selected = false;
				}
				return newChild;
			});
		}

		if (inputData) {
			return newData;
		}
		else {
			vm.setState({ data: newData });
		}
	}

	selectChildren(inputData = false) {
		let vm = this;
		let data = (inputData ? inputData : vm.state.data);
		let newData = clone(data);
		if (newData.children) {
			newData.children = newData.children.map(function (child, nth) {
				let newChild = clone(child);
				if (newChild.children) {
					newChild = vm.selectChildren(newChild);
				}
				else {
					newChild.selected = true;
				}
				return newChild;
			});
		}

		if (inputData) {
			return newData;
		}
		else {
			vm.setState({ data: newData });
		}
	}

	toggleExpand() {
		this.setState({ expanded: !this.state.expanded });
		this.props.onExpand();
	}

	handleValueChange(e) {
		let newData = clone(this.state.data);
		newData.selected = e.target.checked;
		this.setState({ data: newData })
		this.props.onChange(newData, this.props.nth);
	}

	handleParentChange(e) {
		let active = e.target.checked;
		if (active) {
			this.selectChildren();
		}
		else {
			this.deselectChildren();
		}

		this.setState({ active: active });
	}

	handleChildrenChange(newChild, nth) {
		let newData = clone(this.state.data);
		newData.children[nth] = newChild;
		let active = this.calculateActive(newData);
		this.setState({ data: newData, active: active });
		this.props.onChange(newData, nth);
	}

	render() {
		let vm = this;
		let data = vm.state.data;
		let name = vm.props.name;

		return (
			<li className={"filter-item level-" + vm.props.level}>
				{data &&
					((data.value && !data.children) ?
						<div className="inputwrap type-checkbox no-select">
							<div className="item-wrap" style={{ display: data.title === '-' ? 'none' : '' }}>
								<div className="checkwrap">
									<input
										key={vm.id}
										type="checkbox"
										className="parent"
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
						<div className={"item-subgroup" + (vm.state.expanded ? ' expanded' : '')}>
							<div className={`item-wrap ${data.children[0].title !== '-' && 'expandable'}`}>
								<div className="inputwrap type-checkbox no-select ">
									<div className="checkwrap">
										<input
											key={vm.id}
											type="checkbox"
											className="child"
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
								{data.children[0].title !== '-' && <button className="item-expand" type="button" onClick={vm.toggleExpand}></button>}

							</div>
							<ul className="item-submenu">
								{data.children.map((opt, nth) => {
									return (
										<TreeFilterItem data={opt} name={name} idprefix={vm.id} key={nth} nth={nth} level={vm.props.level + 1} onChange={(e) => { this.handleChildrenChange(e, nth) }} onExpand={this.props.onExpand} />
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

	componentDidUpdate(prevProps) {
		if (!isEqual(prevProps.data, this.props.data)) {
			this.setState({ opts: this.props.data.opts });
		}
	}

	handleChange(e, nth) {
		let newOpts = clone(this.state.opts);
		newOpts[nth].selected = e.target.checked;

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
					let id = 'filter_input' + vm.props.data.name + '_' + nth;
					return (
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

	componentDidUpdate(prevProps) {
		if (!isEqual(prevProps.data, this.props.data)) {
			this.setState({ opts: this.props.data.opts });
		}
	}

	handleChange(e, nth) {
		let newOpts = clone(this.state.opts);
		if (newOpts[nth].value !== e.target.value) {
			newOpts[nth].value = e.target.value;

			this.setState({ opts: newOpts });
			this.lateUpdate();
		}
	}

	lateUpdate() {
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

	componentDidMount() {
		this.update();
	}

	componentDidUpdate(prevProps) {
		if (!isEqual(prevProps.data, this.props.data)) {
			this.setState({ value: this.props.data.value });
		}
	}

	handleChange(e) {
		this.setState({ value: e.target.value });
	}

	update() {
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