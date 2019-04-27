import React from 'react'

// Partials
import Image from 'components/partials/image'
import Slider from 'components/partials/slider'

// Deps
import debounce from 'lodash/debounce'
import axios from 'axios'

// Assets
import image_autocomplete_default from 'assets/images/defaults/autocomplete-thumb.jpg'

export default class SearchBar extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			inputVal: '',
			loading: false,
			data: false,
			cacheData: false,
			active: false,
			show: false,
		}

		this.inputChange = this.inputChange.bind(this);
		this.updateSearch = debounce(this.updateSearch.bind(this), 300);
		this.animTimeout = false;
	}

	componentDidMount(){
		
	}

	componentDidUpdate(prevProps, prevState){
		let vm = this;

		if(prevState.inputVal !== vm.state.inputVal){
			vm.updateSearch();
		}

		if(prevState.data === false && vm.state.data !== false){
			vm.setState({cacheData: vm.state.data});
			vm.animTimeout = setTimeout(function(){
				vm.setState({ show: true });
			}, 30);
		}
		else if(vm.state.data === false && prevState.data !== false){
			vm.setState({show: false});
			vm.animTimeout = setTimeout(function(){
				vm.setState({cacheData: false });
			}, 500);
		}
	}

	checkDimensions(){
		this.setState({ oversize: this.container.current.offsetHeight > this.props.oversizeLimit });
	}

	componentWillUnmount(){
		/*if(this.timeout !== null){
			clearTimeout(this.timeout);
		}*/
	}

	updateSearch(){
		let vm = this;
		let active = vm.state.inputVal.length;


		if(active){
			vm.setState({loading : true});
			axios.get('/dummy/data/search-autocomplete.json').then(res => {
				if(res.data.status === 'ok'){
					vm.setState({ data: res.data, loading: false });
				}
				else {
					console.log('error');
				}
			})
		}
		else {
			vm.setState({ data: false, loading: false})
		}
	}

	inputChange(e){
		this.setState({inputVal: e.target.value})
	}

	formSubmit(e){
		e.preventDefault();
		console.log('Submit');
	}

	render() {	
		let vm = this;
		let containerClasses = "searchbar " + vm.props.className;
		let inputClasses = 'searchbar-input';

		let data = vm.state.cacheData;

		if(vm.state.show) { containerClasses += ' show'; }

		return (
			<div className={containerClasses}>
				{vm.state.loading && (
					<i className="searchbar-loader icon-spinner"></i>
				)}
				<form className="searchbar-form" onSubmit={vm.formSubmit}>
					<input
						type="text"
						className={inputClasses}
						value={vm.state.inputVal}
						placeholder={vm.props.placeholder}
						onChange={vm.inputChange}>
					</input>
					<button
						type="submit"
						className="searchbar-submit btn primary">
						<i className="icon-search"></i>Ara
					</button>

				</form>

				{(data && (
				<div className={"searchbar-results " + (vm.state.loading ? ' loading' : '')}>
					{(data.groups && data.groups.length) && (
						data.groups.map((group, g_nth) => (
						<div className="results-group" key={g_nth}>
							{group.title && <strong className="group-title">{group.title}</strong>}
							<Slider className="group-wrap" scrollBar>
								<ul className="group-list">
									{group.results.map((result, r_nth) => (
										<li className="list-item" key={'g_'+r_nth}>
											<a href={result.link}>
												{group.hasimages && (
													<Image className="item-image" src={(result.image ? result.image : image_autocomplete_default)} />
												)}
												{result.title}
											</a>
										</li>
									))}
								</ul>
							</Slider>
							{group.cta && (
								<div className="group-cta">
									<a className="cta-link" href={group.cta.link}>{group.cta.title} <i className="icon-angle-right"></i></a>
								</div>
							)}
						</div>
						))
					)}
				</div>
				))}
			</div>
		)
	}
}

SearchBar.defaultProps = {
	className: '',
	placeholder: 'Volvo CX40 ara',
};