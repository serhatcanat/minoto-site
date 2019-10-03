import React from 'react';
//Deps
import { imageLoad } from 'functions/helpers.js';
import extend from 'lodash/extend';
import omit from 'lodash/omit';
import { connect } from "react-redux";

class Image extends React.Component {
	render() {
		let props = omit(this.props, ['src', 'mobile', 'mobileState', 'dispatch']);
		if (this.props.mobile) {
			return (
				<ImageElem {...props} src={(this.props.mobileState ? this.props.mobile : this.props.src)} />
			)
		}
		else {
			return (<ImageElem {...props} src={this.props.src} />)
		}
	}
}

class ImageElem extends React.Component {

	constructor(props) {
		super(props);
		let vm = this;

		vm.state = {
			loading: true,
			src: false,
		};
	}

	componentDidMount() {
		var vm = this;
		vm._isMounted = true
		vm.updateSrc();
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;
		if (prevProps.src !== vm.props.src) {
			vm.updateSrc();
		}

		if (prevState.src !== vm.state.src) {
			vm.watchLoad();
		}
	}

	updateSrc() {
		let vm = this;
		let change = true;

		if (String.prototype.endsWith) {
			if (vm.props.src) {
				if (vm.props.src.endsWith("/null")) {
					change = false;
				}
			}
			else {
				change = false;
			}
		}

		if (change) {
			vm.setState({ src: vm.props.src });
		}
	}

	watchLoad() {
		var vm = this;
		vm.setState({ loading: true });
		imageLoad(vm.state.src, function () {
			if (vm._isMounted) {
				vm.setState({ loading: false });
				if (vm.props.onLoad) {
					vm.props.onLoad();
				}
			}
		});
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	render() {
		let vm = this;
		let ImageElem = false;

		if (vm.state.src || vm.props.bg) {
			let classes = 'image ' + vm.props.className + ((!vm.props.noLoad && vm.state.loading) ? ' image-loading' : '');
			let props = omit(vm.props, ['src', 'className', 'webStyle', 'mobileStyle', 'contain', 'bg', 'abs', 'alt', 'iconLoader']);

			let style = (vm.props.mobile ? extend({}, vm.props.style, vm.props.mobileStyle) : extend({}, vm.props.style, vm.props.webStyle));

			if (vm.props.bg) {
				classes += ' imagewrap bg';

				if (vm.props.iconLoader) {
					classes += ' image-iconloader';
				}

				if (vm.props.contain) {
					classes += ' contain';
				}

				if (vm.props.abs) {
					classes += ' abs';
				}
				let styles = {
					//backgroundImage: 'url(' + vm.state.src + ')',
					...style
				};

				ImageElem = <div
					className={classes}
					style={styles}
					{...props}>
					{(vm.props.iconLoader && !vm.props.noLoad && vm.state.loading) ?
						<div className="imagewrap-loaderwrap">
							<div className="imagewrap-image" style={{ backgroundImage: 'url(' + vm.state.src + ')' }}></div>
							<i className="loaderwrap-icon icon-minoto" />
						</div>
						:
						<div className="imagewrap-image" style={{ backgroundImage: 'url(' + vm.state.src + ')' }}></div>
					}
				</div>
			}
			else {
				ImageElem =
					<img
						className={classes}
						src={vm.state.src}
						style={style}
						alt={vm.props.alt}
						{...props}
					/>
			}
		}

		return ImageElem;
	}
}

Image.defaultProps = {
	className: '',
	alt: "Görsel",
	mobile: false,
	mobileStyle: false,
	webStyle: false,
	contain: false,
	bg: false,
	iconLoader: true,
};

const mapStateToProps = state => {
	return { mobileState: state.generic.mobile };
};

export default connect(mapStateToProps)(Image);