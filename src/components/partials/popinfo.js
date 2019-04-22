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
	}

	show() {
		let vm = this;
		vm.setState({active: true});
		setTimeout(function() {
			vm.setState({ show: true });
		}, 20);
	}

	hide() {
		let vm = this;
		vm.setState({show: false});
		setTimeout(function() {
			vm.setState({ active: false });
		}, 220);
	}

	render() {
		let vm = this;
		let classes = 'popinfo-wrap ' + vm.props.className + (vm.props.nowrap ? ' nowrap' : '');
		return (
			<button className={classes} onMouseOver={vm.show} onMouseLeave={vm.hide}>
				{vm.props.children}
				{vm.state.active &&
					<div className={"popinfo-content"+ (vm.state.show ? ' show' : '')}>
						<span className="popinfo-text">{vm.props.content}</span>
						<div className="popinfo-bg">
						</div>
					</div>
				}

			</button>
		);
	}
}

export default PopInfo;

PopInfo.defaultProps = {
	className : '',
	content: '',
	nowrap: false,
};