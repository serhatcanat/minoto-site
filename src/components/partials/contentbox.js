import React from 'react';

// Partials
import PopInfo from 'components/partials/popinfo.js';
import Image from 'components/partials/image.js';
import Link from 'components/partials/link.js';

// Deps
import { formatNumber } from 'functions/helpers.js';
import extend from 'lodash/extend'; 

// Assets
import image_default from 'assets/images/contentbox-placeholder.jpg'

class ContentBox extends React.Component {
	render() {
		let vm = this;
		let classes = 'contentbox ' + vm.props.className + (this.props.url && ' has-link') + ' type-' + vm.props.type;

		let bottomNote = false;
		let badge = false;

		if(vm.props.bottomNote){
			let opts = extend({}, {type: 'success', text: ''}, (Object.prototype.toString.call(vm.props.bottomNote) === "[object String]" ? {text: vm.props.bottomNote} : vm.props.bottomNote));

			bottomNote = <span className={"additions-bottomnote " + opts.type}>{opts.text}</span>
		}

		if(vm.props.badge){
			let opts = extend({}, {type: 'primary', text: ''}, (Object.prototype.toString.call(vm.props.badge) === "[object String]" ? {text: vm.props.badge} : vm.props.badge));

			if(opts.note){
				badge = <PopInfo className={"contentbox-badge " + opts.type} content={opts.note} nowrap>{opts.text}</PopInfo>
			}
			else {
				badge = <span className={"contentbox-badge " + opts.type}>{opts.text}</span>
			}
		}

		let favControls = false;

		if(vm.props.favControls){
			favControls = <button type="button" className="contentbox-favicon"><i className={'icon-'+(vm.props.faved ? 'heart' : 'heart-empty')}></i></button>
		}
		else if(vm.props.faved){
			favControls = <span className="contentbox-favicon"><i className="icon-heart"></i></span>
		}

		const Wrap = (this.props.url ? Link : 'div');

		let content = false;

		switch(vm.props.type){
			case 'plain':
				content = (
					<Wrap className="contentbox-innerwrap" href={this.props.url}>
						<div className="contentbox-imagewrap">
							{badge}
							{favControls}
							<Image bg contain className="contentbox-image" src={vm.props.image} />
						</div>
						<div className="contentbox-content">
							<strong className="contentbox-title">{vm.props.title}</strong>
							{(vm.props.subtitle) && (
								<p className="contentbox-subtitle">{vm.props.subtitle}</p>
							)}
							{((vm.props.labels.length || bottomNote || !vm.props.additionsOptional) ?
								<div className="contentbox-additions">
									{vm.props.additionTitle && (
										<div className="additions-title">{vm.props.additionTitle}</div>
									)}
									{((vm.props.labels.length) ?
										<div className="additions-labels">
											{vm.props.labels.map((label, nth) => {
											return (
												<span key={nth}>{label}</span>
											)
											})}
										</div>
									: null )}
									{bottomNote}
								</div>
							: null )}
						</div>
					</Wrap>
				)
			break;
			default:
				content = (
					<Wrap className="contentbox-innerwrap" href={this.props.url}>
						<div className="contentbox-imagewrap">
							{badge}
							{favControls}
							<Image bg className="contentbox-image" src={vm.props.image} />
						</div>
						<div className="contentbox-content">
							<strong className="contentbox-title">{vm.props.title}</strong>
							{(vm.props.subtitle || vm.props.price) && (
								<div className="contentbox-info">
									<p className="info-subtitle">{vm.props.subtitle}</p>
									{vm.props.price && <strong className="info-price">{formatNumber(vm.props.price)} TL</strong>}
								</div>
							)}
							{((vm.props.labels.length || bottomNote || !vm.props.additionsOptional) ?
								<div className="contentbox-additions">
									{((vm.props.labels.length) ?
										<div className="additions-labels">
											{vm.props.labels.map((label, nth) => {
											return (
												<span key={nth}>{label}</span>
											)
											})}
										</div>
									: null )}
									{bottomNote}
								</div>
							: null )}
						</div>
					</Wrap>
				);
			break;
		}

		return (
			<div className={classes}>
				{content}
			</div>
		);
	}
}

export default ContentBox;

ContentBox.defaultProps = {
	className : '',
	image: image_default,
	badge: false,
	labels: [],
	url: false,
	bottomNote: false,
	additionsOptional: false,
	faved: false,
	type: 'regular',
	faveControls: false,
};