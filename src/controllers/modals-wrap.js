import React from 'react';

// Modals
import ShareModal from 'components/modals/share'
import OptionsModal from 'components/modals/options'
import TextModal from 'components/modals/text'
import Compare from 'components/modals/compare'

// Deps
import { connect } from "react-redux";
import { closeModal } from "data/store.modals";
import { blockOverflow } from "functions/helpers";
import isEqual from "lodash/isEqual";
import extend from "lodash/extend";
import omit from "lodash/omit";

const mapStateToProps = state => {
	return {
		modalData: state.modals.modalData,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		closeModal: () => dispatch(closeModal())
	}
}

class ModalsWrap extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			data: false,
			show: false,
		}

		this.closeModal = this.closeModal.bind(this);

		this.closeBtn = <button className="modal-closebtn" type="button" onClick={this.closeModal}><i className="icon-close"></i></button>;

		this.defaultOpts = {
			modal: "",
			url: false,
			urlTitle: false,
			closeBtn: this.closeBtn,
			onClose: this.onClose,
			className: "",
		}
	}

	componentDidMount(){}

	componentDidUpdate(prevProps, prevState){
		let vm = this;
		if(!isEqual(prevProps.modalData, vm.props.modalData)){
			let opts = (vm.props.modalData === false ? false : extend({}, vm.defaultOpts, vm.props.modalData));

			if(vm.state.show){
				vm.setState({show: false});

				setTimeout(function() {
					vm.setState({data: false});
					vm.setState({data: opts});
					blockOverflow(false);
				}, 600);
			}
			else {
				vm.setState({data: opts});
			}
		}

		if(!isEqual(prevState.data, vm.state.data)){
			if(vm.state.data !== false){
				setTimeout(function() {
					blockOverflow();
					vm.setState({show: true});
				}, 30);
			}
		}
	}

	componentWillUnmount(){}

	closeModal(){
		this.props.closeModal();
	}

	render() {
		let vm = this;

		let children = React.Children.toArray(vm.props.children);
		let Content = false;


		if(vm.state.data){
			let props = omit(vm.state.data, ['modal'])
			props.className = 'modal-content ' + props.className;
			switch(vm.state.data.modal){
				case "share":
					Content = <ShareModal {...props} />
				break;
				case "confirm":
					props = extend({}, props, {
						opts: [
							{
								text: "Evet",
								className: (props.reverse ? "dark" : "primary"),
								onClick: (props.onConfirm ? props.onConfirm : false),
							},
							{
								text: "Hayır",
								className: (props.reverse ? "primary" : "dark"),
								onClick: (props.onDeny ? props.onDeny : false),
							},
						]
					})
					Content = <OptionsModal {...props} />
				break;
				case "options":
					Content = <OptionsModal {...props} />
				break;
				case "text":
					Content = <TextModal {...props} />
				break;
				case "compare":
					Content = <Compare {...props} containerClass={'minoto-ui'} outerWraperClass={'modal-compare'}/>
					break;
				default:
					for(let k = 0; k < children.length; k++){
						let item = children[k];
						if(item.props.name === vm.state.data.modal || (item.type.props && item.type.props.name === vm.state.data.modal)){
							Content = React.cloneElement(
								item, {...props}
							);
						}
					}
				break;
			}
		}

		if(Content){
			let props = (Content.type.props ? Content.type.props : Content.props);
			return (
				<div className={"modal-container " + props.containerClass + (vm.state.show ? ' show' : '')}>
					<div className={"modal-outerwrap"+props.outerWraperClass ? props.outerWraperClass:''}>
						{Content}
						{(props.preventClose ?
							<div className="modal-overlay"></div>
						:
							<button className="modal-overlay" onClick={() => { if(!props.preventClose){vm.closeModal()}}}></button>
						)}
					</div>
				</div>
			);
		}
		else {
			if(vm.state.data){ console.log('Modals Error: Modal "'+vm.state.data.modal+'" not found.') };
			return false;
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalsWrap);
