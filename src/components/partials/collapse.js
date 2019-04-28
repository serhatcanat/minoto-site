import React from 'react';

// Partials
//import PopInfo from 'components/partials/popinfo.js';

// Deps
//import omit from 'lodash/omit'

// Assets

export default class Collapse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: props.open,
			wrapHeight: 0,
			active: props.open,
			show: props.open,
			shown: props.open,
		};

		this.calculateDom = this.calculateDom.bind(this);
		this.wrapper = React.createRef();
	}

	componentDidUpdate(prevProps){
		let vm = this;
		if(prevProps.open !== vm.props.open){
			if(vm.props.open){
				vm.setState({ active: true });
				setTimeout(function() {
					vm.calculateDom();
					vm.setState({ show: true });
					setTimeout(function() {
						vm.setState({ shown: true });
					}, 300);
				}, 30);
			}
			else{
				vm.setState({ show: false, shown: false });
				setTimeout(function() {
					vm.setState({ active: false });
				}, 300);
			}
		}
	}

	calculateDom() {
		this.setState({ wrapHeight: this.wrapper.current.offsetHeight });
	}

	render() {
		let vm = this;
		let classes = "collapse " + vm.props.className + (vm.state.active ? ' active' : '') + (vm.state.show ? ' show' : ' hide') + (vm.state.shown ? ' shown' : '');

		return (
			<div className={classes} style={{maxHeight: vm.state.wrapHeight}}>
				<div className="collapse-innerwrap" ref={vm.wrapper}>
					{vm.props.children}
				</div>
			</div>
		)
	}
}

Collapse.defaultProps = {
	className : '',
	open: false,
};

//