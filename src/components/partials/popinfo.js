import React from 'react';

class PopInfo extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			active: false,
			show: false,
		}

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.timeout = false;
	}

	show() {
		let vm = this;
		if(vm.timeout){
			clearTimeout(vm.timeout);
		}

		vm.setState({active: true});
		vm.timeout = setTimeout(function() {
			vm.setState({ show: true });
			vm.timeout = false;
		}, 20);
	}

	hide() {
		let vm = this;
		if(vm.timeout){
			clearTimeout(vm.timeout);
		}

		vm.setState({show: false});
		vm.timeout = setTimeout(function() {
			vm.setState({ active: false });
			vm.timeout = false;
		}, 220);
	}

	render() {
		let vm = this;
		let classes = 'popinfo-wrap ' + vm.props.className + (vm.props.nowrap ? ' nowrap' : '');
		let Tag = vm.props.tag;
		return (
			<Tag className={classes} onMouseOver={vm.show} onMouseLeave={vm.hide}>
				{vm.props.children}
				{vm.state.active &&
					<div className={"popinfo-content"+ (vm.state.show ? ' show' : '')}>
						<span className="popinfo-text">{vm.props.content}</span>
						<div className="popinfo-bg">
						</div>
					</div>
				}

			</Tag>
		);
	}
}

export default PopInfo;

PopInfo.defaultProps = {
	className : '',
	content: '',
	nowrap: false,
	tag: 'button',
};