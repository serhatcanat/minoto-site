import React from 'react'

// Partials
import Image from 'components/partials/image'
import Slider from 'components/partials/slider'

// Deps
import debounce from 'lodash/debounce'
import request from 'controllers/request'
import { Link } from 'react-router-dom'
import { apiPath } from 'functions/helpers';

// Assets
import image_autocomplete_default from 'assets/images/defaults/autocomplete-thumb.jpg'

export default class SearchBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inputVal: '',
			loading: false,
			data: false,
			cacheData: false,
			show: false,
			focusedGroup: -1,
			focusedResult: -1,
		}

		this.inputChange = this.inputChange.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.focus = this.focus.bind(this);
		this.blur = this.blur.bind(this);
		this.keyInput = this.keyInput.bind(this);
		this.updateSearch = debounce(this.updateSearch.bind(this), 300);
		this.input = React.createRef();
		this.animTimeout = false;
		this.blurTimeout = false;

		this.slideInstances = []
	}

	componentDidMount() {
		this.input.current.addEventListener("keydown", this.keyInput);
		this.input.current.addEventListener("blur", this.blur);
		this.input.current.addEventListener("focus", this.focus);
		this.input.current.addEventListener("click", this.focus);
	}

	componentWillUnmount() {
		this.input.current.removeEventListener("keydown", this.keyInput);
		this.input.current.removeEventListener("blur", this.blur);
		this.input.current.removeEventListener("focus", this.focus);
		this.input.current.removeEventListener("click", this.focus);
		/*if(this.timeout !== null){
			clearTimeout(this.timeout);
		}*/
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.inputVal !== this.state.inputVal) {
			this.updateSearch();
		}

		if ((prevState.data === false && this.state.data !== false) || (this.state.data !== false && (prevState.inputVal !== this.state.inputVal) && !this.state.active)) {
			this.show();
		}
		else if (this.state.data === false && prevState.data !== false) {
			this.hide();
		}
	}

	show() {
		if (!this.state.show) {
			let vm = this;
			vm.setState({ cacheData: vm.state.data });
			vm.animTimeout = setTimeout(function () {
				vm.setState({ show: true });
			}, 30);
		}
	}

	hide() {
		if (this.state.show) {
			let vm = this;
			vm.setState({ show: false });
			vm.animTimeout = setTimeout(function () {
				vm.setState({ cacheData: false });
			}, 500);
		}
	}

	blur() {
		let vm = this;
		if (vm.blurTimeout) {
			clearTimeout(vm.blurTimeout);
			vm.blurTimeout = false;
		}
		vm.blurTimeout = setTimeout(function () {
			//vm.hide();
			vm.blurTimeout = false;
		}, 60);
	}

	focus() {
		if (this.blurTimeout) {
			clearTimeout(this.blurTimeout);
			this.blurTimeout = false;
		}
		if (this.state.data !== false && this.state.inputVal !== '' && !this.state.active) {
			this.show();
		}
	}

	keyInput(e) {
		let vm = this;
		let data = vm.state.data;

		if (data) {
			let fG = vm.state.focusedGroup;
			let fR = vm.state.focusedResult;

			switch (e.key) {
				case "ArrowUp":
					if (fR <= 0) {
						fG = (fG <= 0 ? -1 : fG - 1);
						fR = (fG >= 0 ? data.groups[fG].results.length - 1 : -1);
					}
					else {
						fR--;

						this.slideInstances[fG].slideTo(fR);
					}
					vm.setState({ focusedGroup: fG, focusedResult: fR })
					break;
				case "ArrowDown":
					let curGroup = data.groups[fG];
					if (!curGroup || fR >= curGroup.results.length - 1) {
						fG = (fG >= data.groups.length - 1 ? data.groups.length : fG + 1);
						fR = 0;
					}
					else {
						fR++;

						this.slideInstances[fG].slideTo(fR);
					}
					vm.setState({ focusedGroup: fG, focusedResult: fR })
					break;
				case "Escape":
					vm.hide();
					break;
				default: break;
			}
		}
	}

	checkDimensions() {
		this.setState({ oversize: this.container.current.offsetHeight > this.props.oversizeLimit });
	}

	updateSearch() {
		let vm = this;
		let active = vm.state.inputVal.length;


		if (active) {
			vm.setState({ loading: true });

			request.get(apiPath('search'), { search: vm.state.inputVal, }, function (payload, status) {

				if (payload) {
					vm.setState({ data: payload, loading: false });
				}
				else {
					console.log('error');
				}
			}, { excludeApiPath: true });
		}
		else {
			vm.setState({ data: false, loading: false })
		}

	}

	inputChange(e) {
		this.setState({ inputVal: e.target.value })
	}

	formSubmit(e) {
		e.preventDefault();
	}

	render() {
		let vm = this;
		let containerClasses = "searchbar " + vm.props.className;
		let inputClasses = 'searchbar-input';

		let data = vm.state.data;

		if (vm.state.show) { containerClasses += ' show'; }

		return (
			<div className={containerClasses}>
				{vm.state.loading && (
					<i className="searchbar-loader icon-spinner"></i>
				)}
				<form className="searchbar-form" onSubmit={vm.formSubmit}>
					<input
						type="text"
						ref={vm.input}
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
									<Slider className="group-wrap" scrollBar ref={(ref) => vm.slideInstances[g_nth] = ref}>
										{group.results.map((result, r_nth) => (
											<div className={"group-item" + ((g_nth === vm.state.focusedGroup && r_nth === vm.state.focusedResult) ? ' focused' : '')} key={'g_' + r_nth}>
												<Link to={result.link} onClick={vm.hide}>
													{group.hasimages && (
														<Image className="item-image" src={(result.image ? result.image : image_autocomplete_default)} />
													)}
													{result.title}
												</Link>
											</div>
										))}
									</Slider>
									{group.cta && (
										<div className="group-cta">
											<Link className="cta-link" onClick={vm.hide} to={group.cta.link}>{group.cta.title} <i className="icon-angle-right"></i></Link>
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
	placeholder: 'Volvo XC40 ara',
};