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

		this.state = {
			opts: this.setOpts()
		};

		this.instance = false;
		this.container = React.createRef();
		this.setOpts = this.setOpts.bind(this);
		this.id = (this.props.id ? this.props.id : uid('slider'));
	}

	componentDidMount(){
		if(this.container.current){
			this.instance = new Swiper('#' + this.id, this.state.opts);
		}
	}

	componentDidUpdate(prevProps, prevState){
		if(!isEqual(prevProps.children, this.props.children)){
			this.instance.update();
		}
	}

	componentWillUnmount(){
		this.instance.destroy(true);
	}

	setOpts() {
		let vm = this;
		let opts = {}

		if(vm.props.scrollBar){
			opts.direction = 'vertical';
			opts.freeMode = true;
			opts.slidesPerView = 'auto';
			opts.scrollbar = {
				el: '.swiper-scrollbar'
			};
			opts.mousewheel = true;
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
	opts: {},
};