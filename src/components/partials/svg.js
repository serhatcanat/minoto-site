import React from 'react';

// Deps
import axios from 'axios';

export default class SVG extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			src: false
		}
	}

	componentDidMount() {
		let vm = this;
		axios.get(vm.props.src).then(res => {

			vm.setState({ src: res.data });
		});
	}
	
	render() {
		//return <div className={"svg " + this.props.className} dangerouslySetInnerHTML={{__html: import(/* webpackIgnore: true */ this.props.src) }} />;
		return (
			<div className={"inlinesvg " + this.props.className + (this.state.src !== false ? ' loaded' : 'loading')} dangerouslySetInnerHTML={{__html: this.state.src}}></div>
		)
	}
}