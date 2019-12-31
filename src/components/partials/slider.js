import React from 'react'

//Deps
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
import extend from 'lodash/extend';
import isEqual from 'lodash/isEqual';
import { uid } from 'functions/helpers';

export default class Slider extends React.Component {

	constructor(props) {
		super(props);

		/*this.state = {
			opts: this.setOpts()
		};*/

		this.instance = false;
		this.container = React.createRef();
		this.setOpts = this.setOpts.bind(this);
		this.slideChanged = this.slideChanged.bind(this);
		this.id = (this.props.id ? this.props.id : uid('slider'));
	}

	componentDidMount() {
		let vm = this;
		if (vm.container.current) {
			vm.instance = new Swiper('#' + vm.id, vm.setOpts());

			setTimeout(function () {
				vm.instance.update();
			}, 50);
		}

		if (window.inss) {
		}
		else {

			window.inss = [];
		}

		window.inss.push(vm.instance);
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;

		if (!isEqual(prevProps.children, vm.props.children)) {
			vm.instance.update();
		}
	}

	componentWillUnmount() {
		this.instance.destroy(true);
	}

	update() {
		this.instance.update();
		if (this.instance.params.loop) {
			this.instance.loopDestroy();
			this.instance.loopCreate();
		}
	}

	next() {
		this.instance.slideNext();
	}

	prev() {
		this.instance.slidePrev();
	}

	slideTo(index, speed = undefined, runCallbacks = undefined) {
		this.instance.slideTo(index, speed, runCallbacks);
	}

	slideChanged(e) {
		if (this.instance) {
			if (this.props.onChange) {
				this.props.onChange(this.instance.realIndex);
			}
		}
	}

	setOpts() {
		let vm = this;
		let opts = {
			loop: vm.props.loop,
			loopedSlides: 1,
			slidesPerView: vm.props.slides,
			preventClicks: false,
			preventClicksPropagation: false,
			on: {
				slideChange: function () { vm.slideChanged(); }
			}
		}

		if (vm.props.scrollBar) {
			opts = extend({}, opts, {
				direction: (vm.props.horizontal ? 'horizontal' : 'vertical'),
				freeMode: true,
				freeModeMomentum: true,
				slidesPerView: 'auto',
				mousewheel: {
					sensitivity: 0.6,
					releaseOnEdges: true,
				},
				scrollbar: {
					el: '.swiper-scrollbar',
				}
			});
		}

		return extend({}, opts, vm.props.opts);
	}

	render() {

		let vm = this;
		let children = (vm.props.children.length > 1 ? vm.props.children : [vm.props.children]);
		let classes = "swiper-container slider-component " + vm.props.className + (vm.props.scrollBar ? ' slider-scrollbar' : '');
		return (
			<div id={vm.id} ref={vm.container} className={classes}>
				<div className="swiper-wrapper">
					{children && (children.map((item, nth) => (
						<div className="swiper-slide" key={nth}>
							{item}
						</div>
					)))}
				</div>
				{vm.props.scrollBar && (<div className="swiper-scrollbar"></div>)}
			</div>
		)
	}
}

Slider.defaultProps = {
	className: "",
	scrollBar: false,
	id: false,
	loop: false,
	slides: 1,
	opts: {},
};
