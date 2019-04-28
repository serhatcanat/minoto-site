import React from 'react';

// Partials
import PopInfo from 'components/partials/popinfo.js';

// Deps
import omit from 'lodash/omit'

// Assets

export default class Btn extends React.Component {
	render() {
		let vm = this;
		let Elem = vm.props.tag;
		let props = omit(vm.props, ['tag', 'icon', 'leftIcon', 'rightIcon', 'note', 'block', 'hollow', 'uppercase', 'primary', 'low', 'white', 'dark', 'smallIcon']);

		let leftIcon = (vm.props.leftIcon ? vm.props.leftIcon : (vm.props.icon ? vm.props.icon : false));
		let rightIcon = (vm.props.rightIcon ? vm.props.rightIcon : false);

		if(vm.props.block) { props.className += ' block'; }

		if(vm.props.primary) { props.className += ' primary'; }
		if(vm.props.white) { props.className += ' white'; }
		if(vm.props.dark) { props.className += ' dark'; }

		if(vm.props.hollow) { props.className += ' hollow'; }
		if(vm.props.uppercase) { props.className += ' uppercase'; }
		if(vm.props.low) { props.className += ' low'; }
		if(vm.props.smallIcon) { props.className += ' small-icon'; }

		if(vm.props.note) { props.className += ' has-info'; }

		if(Elem === 'button'){ props.type = (vm.props.type ? vm.props.type : 'button'); }

		props.className += ' btn';

		return (
			<Elem {...props}>
				{leftIcon && <i className={"pre icon-" + leftIcon}></i>}
				{vm.props.children}
				{rightIcon && <i className={"post icon-" + rightIcon}></i>}

				{vm.props.note &&
					<PopInfo className="btn-info icon-question" content={vm.props.note} tag="i" nowrap></PopInfo>
				}
			</Elem>
		)
	}
}

Btn.defaultProps = {
	className : '',
	icon: false,
	leftIcon: false,
	rightIcon: false,
	note: false,
	tag: 'button'
};

//