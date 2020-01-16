import React from 'react';
import loader from 'assets/images/minoto-loading.gif'

export default class Loader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: this.props.loading,
			show: this.props.loading,
			timeInstance: null,
		}

		this.container = React.createRef();
		this.checkDimensions = this.checkDimensions.bind(this);
	}

	componentDidMount() {
		this.checkDimensions();
	}

	componentDidUpdate(prevProps) {
		let vm = this;

		if (prevProps.loading !== vm.props.loading) {

			if (vm.timeout !== null) {
				clearTimeout(vm.timeout);
			}

			if (vm.props.loading) {
				vm.setState({ active: true });
				vm.timeout = setTimeout(() => {
					this.checkDimensions();
					vm.setState({ show: true });
					vm.timeout = null;
				}, 50);
			}
			else {
				vm.setState({ show: false });
				vm.timeout = setTimeout(() => {
					vm.setState({ active: false });
					vm.timeout = null;
				}, 400);
			}
		}
	}

	checkDimensions() {
		if (this.state.active) {
			this.setState({ oversize: this.container.current.offsetHeight > this.props.oversizeLimit });
		}
	}

	componentWillUnmount() {
		if (this.timeout !== null) {
			clearTimeout(this.timeout);
		}

	}

	render() {
		//<i className="loader-icon spin icon-spinner"></i>
		return (this.state.active ? (
			<div className={"loader" + this.props.className + (this.props.strict ? ' strict' : '') + (this.state.show ? ' show' : '') + (this.state.oversize ? ' oversize' : '')} ref={this.container}>
				<div className="loader-spinnerwrap">
					{/* <i className="icon-spinner"></i> */}
					<img src={loader} alt="Minoto Loding Gif" style={{
						margin: "0 auto",
						marginTop: "20%"
					}} />
				</div>
			</div>
		) : false);
	}
}

Loader.defaultProps = {
	loading: true,
	className: '',
	oversizeLimit: 500,
};
