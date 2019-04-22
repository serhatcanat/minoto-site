import React from 'react';
//Deps
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import store from "data/store";
import { setMobile, setWw } from "data/store.generic";

const mapStateToProps = state => {
	return {
		mobileBreakPoint: state.generic.mobileBreakPoint,
		mobile: state.generic.mobile,
	};
};

class ResponsiveWatcher extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			isMobile: false,
		}

		this.dResize = debounce(this.dResize.bind(this), 50);
	}

	resize(){
		let vm = this;
		let newState = vm.isMobile();
		if(vm.state.isMobile !== newState){
			window.isMobile = newState;
			vm.setState({isMobile: newState});
			store.dispatch(setMobile(newState));
		}
		
		store.dispatch(setWw(window.innerWidth));
	}

	dResize(){
		this.resize();
	}

	isMobile() {
		if(window.innerWidth <= this.props.mobileBreakPoint){
			return true;
		}
		else{
			return false;
		}
	}

	componentDidMount(){
		window.addEventListener('resize', this.dResize);
		this.resize();
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.dResize);
	}

	render() {
		return (this.props.children ? this.props.children : false);
	}
}

export default connect(mapStateToProps)(ResponsiveWatcher);