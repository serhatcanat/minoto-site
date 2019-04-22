import React from 'react';

// Partials
import ContentBox from 'components/partials/contentbox.js'
import Image from 'components/partials/image.js';
import { FormInput } from 'components/partials/forms.js';

// Deps
import axios from 'axios';

export default class ProductListing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			results: false,
			filters: false,
		}

		this.initialize = this.initialize.bind(this);
	}

	componentDidMount() {
		this.initialize();
	}

	initialize() {
		this.updateResults();
	}

	updateResults() {
		let vm = this;
		axios.get('/dummy/data/listing.json').then(res => {

			if(res.data.status === 'ok'){
				vm.setState({ results: res.data.results, filters: res.data.filters })
			}
			else {
				console.log('error');
			}
		})
	}

	render() {
		let vm = this;
		let itemsAt = 0;
		return (
			<section className="section listing">
				{(vm.props.filters ? (
					<ProductFilters filters={vm.state.filters} />
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

class ProductFilters extends React.Component {	
	getFilters() {
		let vm = this;
		console.log(vm.props.filters);
		if(vm.props.filters){
			return vm.props.filters.map(function(filter, nth){
				return <ProductFilter data={filter} key={nth} />
			});
		}
		else {
			return <div>...</div>
		}
	}

	render () {
		let vm = this;

		return (
			<aside className="listing-filters">
				{(vm.props.filters ?
				vm.props.filters.map((filter, nth) => (
					<ProductFilter data={filter} key={nth} />
				)) : false )}
			</aside>
		)
	}
}

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
				filterContent = <ListFilter data={filterData} />;
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
class ListFilter extends React.Component {
	changed(data) {
		//console.log(data);
	}

	render() {
		let vm = this;
		let data = vm.props.data
		return (
			<ul className="filter-list">
				{data.opts.map((opt, nth) => (
					<li className="filter-item" key={nth}>
						<FormInput className="item-input no-select" type="checkbox" name={data.name + '[]'} value={opt.value} label={opt.title} onChange={vm.changed} checked={opt.selected} />
					</li>
				))}
			</ul>
		)
	}
}

ProductListing.defaultProps = {
	className : '',
	filters: true,
};