import React from 'react';

class PopInfo extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			active: false,
			show: false,
			rtl: false,
		}

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		this.contentWrap = React.createRef();
		this.timeout = false;
	}

	show() {
		let vm = this;
		if(vm.timeout){
			clearTimeout(vm.timeout);
			vm.setState({active: false, rtl: false});
		}

		vm.setState({active: true, rtl: false});
		vm.timeout = setTimeout(function() {
			let rect = vm.contentWrap.current.getBoundingClientRect();
			let rtl = ((rect.x + rect.width) > (window.innerWidth - 10));

			vm.setState({ rtl: rtl });

			vm.timeout = setTimeout(function() {
				vm.setState({ show: true });
			}, 20);

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
			vm.setState({ active: false, rtl: false });
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
					<div className={"popinfo-content"+ (vm.state.show ? ' show' : '') + (vm.state.rtl ? ' rtl' : '')} ref={this.contentWrap}>
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