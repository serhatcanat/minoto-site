import React from 'react'

// Partials
import Image from 'components/partials/image'
import Slider from 'components/partials/slider'

// Deps
import debounce from 'lodash/debounce'
import { redirect } from 'controllers/navigator'
import { blockOverflow, isExact } from "functions/helpers";
import request from 'controllers/request'
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { setSearchBarValue, setSearchBarOpen } from 'data/store.generic';

// Assets
import image_autocomplete_default from 'assets/images/defaults/autocomplete-thumb.jpg'

const mapStateToProps = state => {
	return {
		mobile: state.generic.mobile,
		inputValue: state.generic.searchBarValue,
		open: state.generic.searchBarOpen,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setValue: (value) => dispatch(setSearchBarValue(value)),
		setOpen: (value) => dispatch(setSearchBarOpen(value)),
	}
}

class SearchBar extends React.Component {
	_isMounted = false;
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			data: false,
			cacheData: false,
			active: props.open,
			show: props.open,
			primary: ((props.mobile && props.fullScreen) || (!props.mobile && !props.fullScreen)),
			focusedGroup: -1,
			focusedResult: -1,
			oversize: false
		}

		this.inputChange = this.inputChange.bind(this);
		this.show = this.show.bind(this);
		this.showSelf = this.showSelf.bind(this);
		this.hide = this.hide.bind(this);
		this.hideSelf = this.hideSelf.bind(this);
		this.focus = this.focus.bind(this);
		this.formSubmit = this.formSubmit.bind(this);
		this.blur = this.blur.bind(this);
		this.keyInput = this.keyInput.bind(this);
		this.bindInputs = this.bindInputs.bind(this);
		this.unbindInputs = this.unbindInputs.bind(this);
		this.updateSearch = debounce(this.updateSearch.bind(this), 300);
		this.input = React.createRef();
		this.animTimeout = false;
		this.blurTimeout = false;

		this.slideInstances = [];

		this.inputsBound = false;
	}

	componentDidMount() {
		this._isMounted = true;
		this.bindInputs();
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.unbindInputs();
	}

	bindInputs() {
		if (this.input.current) {
			this.input.current.addEventListener("keydown", this.keyInput);
			this.input.current.addEventListener("blur", this.blur);
			this.input.current.addEventListener("focus", this.focus);
			this.input.current.addEventListener("click", this.focus);
		}
	}

	unbindInputs() {
		if (this.input.current) {
			this.input.current.removeEventListener("keydown", this.keyInput);
			this.input.current.removeEventListener("blur", this.blur);
			this.input.current.removeEventListener("focus", this.focus);
			this.input.current.removeEventListener("click", this.focus);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!this._isMounted) {
			this.hide();
		}
		if (prevProps.inputValue !== this.props.inputValue && this.state.primary) {
			this.updateSearch();
		}

		if ((prevState.data === false && this.state.data !== false) || (this.state.data !== false && (prevProps.inputValue !== this.props.inputValue) && !this.state.active)) {
			this.show();
		}
		else if (this.state.data === false && prevState.data !== false) {
			this.hide();
		}

		if (prevProps.open !== this.props.open || (this.props.open && this.state.data && this.state.data.groups && !(isExact(prevState.data, this.state.data) && !this.state.active))) {
			if (this.props.open && this.state.primary && !(this.state.data.groups.length <= 1 && this.state.data.groups[0].results.length === 0)) {
				if (!this.state.active) {
					this.showSelf();
				}
			}
			else if (this.state.active) {
				this.hideSelf();
			}
		}

		if (prevProps.mobile !== this.props.mobile) {
			this.setState({ primary: ((this.props.mobile && this.props.fullScreen) || (!this.props.mobile && !this.props.fullScreen)) });
		}

		if (prevState.primary !== this.state.primary) {
			if (this.props.open && this.state.primary) {
				this.bindInputs();
				this.setState({ active: true, show: true });
			}
			else {
				if (this.props.fullScreen && this.state.active) {
					blockOverflow(false);
				}
				this.setState({ active: false, show: false });
			}
		}
	}

	show() {
		this.props.setOpen(true);
	}

	showSelf() {
		if (!this.state.show) {
			let vm = this;
			vm.setState({ cacheData: vm.state.data, active: true });
			if (vm.props.fullScreen) { blockOverflow(true); }

			vm.animTimeout = setTimeout(function () {
				vm.setState({ show: true });

				if (vm.input.current) {
					setTimeout(function () {
						vm.input.current.focus();
					}, 10);
				}
			}, 30);
		}
	}

	hide() {
		this.props.setOpen(false);
	}

	hideSelf() {
		let vm = this;
		if (vm.state.show) {
			vm.setState({ show: false });
			if (vm.props.fullScreen) { blockOverflow(false); }
			vm.animTimeout = setTimeout(function () {
				vm.setState({ cacheData: false, active: false });
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
		if (this.state.data !== false && this.props.inputValue !== '' && !this.state.active) {
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
		let active = vm.props.inputValue.length;

		if (this._isMounted) {
			if (active) {
				vm.setState({ loading: true });

				request.get('search', { search: vm.props.inputValue, }, function (payload, status) {

					if (payload) {
						vm.setState({ data: payload, loading: false });
					}
					else {
						console.log('error');
					}
				});
			}
			else {
				vm.setState({ data: false, loading: false })
			}
		}


	}

	inputChange(e) {
		//this.setState({ inputVal: e.target.value })
		this.props.setValue(e.target.value);
	}

	formSubmit(e) {
		e.preventDefault();
		this.hide();
		redirect('search', false, { ara: this.props.inputValue });
	}

	render() {
		let vm = this;

		if (!(!vm.state.primary && vm.props.fullScreen)) {

			let containerClasses = "searchbar " + vm.props.className + (vm.props.fullScreen ? ' fullscreen' : ' regular');
			let inputClasses = 'searchbar-input';

			let data = vm.state.data;

			if (vm.state.active) { containerClasses += ' active'; }
			if (vm.state.show) { containerClasses += ' show'; }

			let GroupWrap = 'div';
			let groupParams = {};

			if (!vm.props.fullScreen) {
				GroupWrap = Slider;
				groupParams = {
					scrollBar: true
				}
			}

			return (
				<div className={containerClasses}>
					{vm.state.loading && (
						<i className="searchbar-loader icon-spinner"></i>
					)}
					<form className="searchbar-form" onSubmit={vm.formSubmit}>
						{vm.props.fullScreen && <i className="searchbar-icon icon-search"></i>}
						<input
							type="text"
							ref={vm.input}
							className={inputClasses}
							value={vm.props.inputValue}
							placeholder={vm.props.placeholder}
							onChange={vm.inputChange}>
						</input>
						{vm.props.fullScreen ?
							<button type="button" className="searchbar-close" onClick={this.hide}><i className="icon-close"></i></button>
							:
							<button
								type="button"
								className="searchbar-submit btn primary">
								<i className="icon-search"></i>Ara
							</button>
						}

					</form>

					{(data && (
						<div className={"searchbar-results " + (vm.state.loading ? ' loading' : '')}>
							{(data.groups && data.groups.length) && (
								data.groups.map((group, g_nth) => (
									<div className="results-group" key={g_nth}>
										{group.title && <strong className="group-title">{group.title}</strong>}
										<GroupWrap className="group-wrap" {...groupParams} ref={(ref) => vm.slideInstances[g_nth] = ref}>
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
										</GroupWrap>
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
		else { return false; }
	}
}

SearchBar.defaultProps = {
	className: '',
	placeholder: 'BMW 520i ara',
	fullScreen: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);