import React from 'react';

// Modals
import ShareModal from 'components/modals/share'

// Deps
import { connect } from "react-redux";
import { closeModal } from "data/store.modals";
import isEqual from "lodash/isEqual";
import extend from "lodash/extend";

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

		this.defaultOpts = {
			action: "show",
			modalKey: false,
			url: false,
			urlTitle: false,
			opts: [
				{
					title: "Evet",
					className: "primary",
					onClick: function(){ console.log('Evet')},
				},
				{
					title: "Hayır",
					className: "",
					onClick: function(){ console.log('Hayır')},
				},
			]
		}

		this.closeModal = this.closeModal.bind(this);

		this.closeBtn = <button className="modal-closebtn" onClick={this.closeModal}><i className="icon-close"></i></button>;
	}

	componentDidMount(){
		
	}

	componentDidUpdate(prevProps, prevState){
		let vm = this;
		if(!isEqual(prevProps.modalData, vm.props.modalData)){
			let opts = (vm.props.modalData === false ? false : (Object.prototype.toString.call(vm.props.modalData) === "[object String]" ? 
				extend({}, vm.defaultOpts, {modalKey: vm.props.modalData}) : extend({}, vm.defaultOpts, vm.props.modalData))
			);

			if(vm.state.show){
				vm.setState({show: false});

				setTimeout(function() {
					vm.setState({data: false});
					vm.setState({data: opts});
				}, 600);
			}
			else {
				vm.setState({data: opts});
			}
		}

		if(!isEqual(prevState.data, vm.state.data)){
			if(vm.state.data !== false){
				setTimeout(function() {
					vm.setState({show: true});
				}, 30);
			}
		}
	}

	componentWillUnmount(){
		
	}

	closeModal(){
		this.props.closeModal();
	}

	render() {
		let vm = this;

		let children = React.Children.toArray(vm.props.children);
		let Content = false;

		if(vm.state.data){

			switch(vm.state.data.action){
				case "show":
					for(let k = 0; k < children.length; k++){
						let item = children[k];
						if(item.props.name === vm.state.data.modalKey){
							Content = React.cloneElement(
								item, {
									className: "modal-content",
									onClose: vm.closeModal,
									closeBtn: vm.closeBtn,
								}
							);
						}
					}
				break;
				case "share":
					Content = <ShareModal className="modal-content" onClose={vm.closeModal} closeBtn={vm.closeBtn} url={vm.state.data.url} />
				break;
				default: break;
			}
		}

		if(Content){
			return (
				<div className={"modal-container " + Content.props.containerClass + (vm.state.show ? ' show' : '')}>
					<div className="modal-outerwrap">
						{Content}
						{(Content.props.preventClose ? 
							<div className="modal-overlay"></div>
						:
							<button className="modal-overlay" onClick={() => { if(!Content.props.preventClose){vm.closeModal()}}}></button>
						)}
					</div>
				</div>
			);
		}
		else { 
			if(vm.state.data){ console.log('Modals Error: Modal not found.') };
			return false;
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalsWrap);