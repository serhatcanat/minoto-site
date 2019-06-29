import React from 'react';

class PopInfo extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			active: false,
			show: false,
			rtl: props.rtl,
		}

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		this.contentWrap = React.createRef();
		this.timeout = false;
	}

	show() {
		let vm = this;
		if(!this.state.show){
			if(vm.timeout){
				clearTimeout(vm.timeout);
				vm.setState({active: false, rtl: false});
			}

			vm.setState({active: true, rtl: false});
			vm.timeout = setTimeout(function() {
				let rect = vm.contentWrap.current.getBoundingClientRect();
				let rtl = (vm.props.rtl ? 
					!(rect.x < 10)
					:
					((rect.x + rect.width) > (window.innerWidth - 10))
				);

				vm.setState({ rtl: rtl });

				vm.timeout = setTimeout(function() {
					vm.setState({ show: true });
				}, 30);

				vm.timeout = false;
			}, 30);
		}
	}

	hide() {
		let vm = this;
		if(vm.timeout){
			clearTimeout(vm.timeout);
		}

		vm.timeout = setTimeout(function() {
			vm.setState({show: false});
			vm.timeout = setTimeout(function() {
				vm.setState({ active: false, rtl: false });
				vm.timeout = false;
			}, 220);
		}, 60);
	}

	render() {
		let vm = this;
		let classes = 'popinfo-wrap ' + vm.props.className + (vm.props.nowrap ? ' nowrap' : '') + (vm.props.wide ? ' wide' : '');
		let Tag = vm.props.tag;
		return (
			<Tag className={classes} onMouseOver={vm.show} onMouseLeave={vm.hide}>
				{vm.props.children}
				{vm.state.active &&
					<div className={"popinfo-content"+ (vm.state.show ? ' show' : '') + (vm.state.rtl ? ' rtl' : '')} ref={this.contentWrap}>
						<div className="popinfo-text">{vm.props.content}</div>
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
	rtl: false,
	tag: 'button',
	wide: false,
};