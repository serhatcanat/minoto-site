import React from 'react'
import { withRouter } from 'react-router-dom'

// Deps
import { scrollTo } from 'functions/helpers'
import { changeURLParam } from 'controllers/navigator'

export class Tabs extends React.Component {
	constructor(props) {
		super(props)

		let activeTab = 0;
		let children = React.Children.toArray(this.props.children);
		children.forEach((tab, index) => {
			if (tab.props.active) {
				activeTab = index;
			}

			if (this.props.bindUrlParam && tab.props.urlVal && this.props.match.params) {
				if (tab.props.urlVal === this.props.match.params[this.props.bindUrlParam]) {
					activeTab = index;
				}
			}
		});

		this.state = {
			activeTab: children[activeTab].props.index
		}
		this.activeTab = children[activeTab].props.index;

		this.unlisten = null;
		this.containerRef = React.createRef();
	}

	componentDidMount() {
		let vm = this;
		if (vm.props.bindUrlParam) {
			let children = React.Children.toArray(this.props.children);
			vm.unlisten = window.dynamicHistory.listen(location => {
				children.forEach((tb, index) => {
					let linkURL = changeURLParam(tb.props.urlVal, vm.props.bindUrlParam, false, true);
					if (linkURL !== false && linkURL === location.pathname && vm.activeTab !== tb.props.index) {
						vm.changeTab(tb.props.index, true);
					}
				});
			});
		}
	}

	componentWillUnmount() {
		if (this.unlisten !== null) {
			this.unlisten();
		}
	}

	changeTab(tab, scroll = false) {
		let vm = this;
		this.activeTab = tab;
		vm.setState({ activeTab: tab });
		if (scroll && window.isMobile) {
			scrollTo({ to: vm.containerRef.current});
		}

		if (vm.props.bindUrlParam) {
			let children = React.Children.toArray(this.props.children);
			children.forEach((tb, index) => {
				if (tb.props.urlVal && tb.props.index === tab) {
					let newURL = changeURLParam(tb.props.urlVal, vm.props.bindUrlParam);
					if (newURL !== window.dynamicHistory.location.pathname) {
						window.dynamicHistory.push({
							pathname: newURL,
							state: { scroll: false }
						});
					}
				}
			});
		}

		if(vm.props.onChange){
			vm.props.onChange(tab);
		}

	}

	render() {
		let classes = this.props.className + ' tabs-container'
		let children = React.Children.toArray(this.props.children);

		return (
			<section className={classes} ref={this.containerRef}>
				<div className="tabs-labels">
					<div className="labels-innerwrap">
						{children.map(child => {
							const { label, index, className } = child.props

							return (
								<button
									key={index}
									className={'labels-item ' + (className || '') + (index === this.state.activeTab ? ' active' : '')}
									onClick={() => {
										this.changeTab(index)
									}}
								>
									{label}
								</button>
							)
						})}
					</div>
				</div>
				<div className="tabs-items">
					{children.map(child => {
						const { index, children, className } = child.props
						return (
							<Tab className={className || ''} key={index} active={index === this.state.activeTab}>
								{children}
							</Tab>
						)
					})}
				</div>
			</section>
		)
	}
}

class Tab extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			active: this.props.active,
			show: this.props.active
		}
	}

	componentDidUpdate(prevProps) {
		let vm = this

		if (prevProps.active !== vm.props.active) {
			if (vm.props.active) {
				setTimeout(() => {
					vm.setState({ active: true })
					setTimeout(() => {
						vm.setState({ show: true })
					}, 50)
				}, 350)
			} else {
				vm.setState({ show: false })
				setTimeout(() => {
					vm.setState({ active: false })
				}, 350)
			}
		}
	}

	render() {
		if (this.state.active) {
			return <div className={'items-tab' + (this.state.show ? ' show ' : '')}>{this.props.children}</div>
		} else {
			return false
		}
	}
}

Tabs.defaultProps = {
	className: '',
	title: false
}

export default withRouter(Tabs);