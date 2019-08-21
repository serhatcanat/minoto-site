import React from 'react'

//Deps
import store from 'data/store'
import merge from 'lodash/merge'
//import { connect } from "react-redux"
//import { resetData } from 'data/store.ga'

/*const mapStateToProps = state => {
	return {
		productData: state.ga.productData,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		resetGaData: () => dispatch(resetData()),
	}
}*/

export default class GAWatcher extends React.Component {
	/*constructor(props){
		super(props);

		this.state = {
			lol: true,
		};
	}*/

	componentDidMount() {
		document.getElementsByTagName('BODY')[0].addEventListener('copy', (event) => {
			GA.send('clipboard', document.getSelection().toString())
		});
	}

	render() {
		return false;
	}
}

//export default connect(mapStateToProps, mapDispatchToProps)(GAWatcher);

export const GA = {
	send: function(action, data) {
		if(GA.actions[action]) {
			GA.actions[action](data);
		}
	},
	sendData: function(data) {
		let gaData = merge(GA.getDefaultData(), data);
		console.log('GA - Data:\n', gaData);
		window.dataLayer.push(gaData);
	},
	getDefaultData() {
		let state = store.getState();
		let userData = state.user.user;

		let data = {
			event: 'gaEvent',
			eventCategory: '',
			eventAction: '',
			eventLabel: '',
			eventValue: 0,
			customDefinitions: {
				userLevel: {
				},
				hitLevel: {
					cd_pageType: (state.generic.currentPage.data.GATitle ? state.generic.currentPage.data.GATitle : state.generic.currentPage.data.title)
				}
			}
		};

		if(userData) {
			data.customDefinitions.userLevel = {
				cd_userLogin: true,
				cd_userID: userData.id,
			}
		}
		else {
			data.customDefinitions.userLevel.cd_userLogin = false;
		}

		if(state.ga.productData) {
			data.products = GA.getProductData(state.ga.productData);
		}

		return data;
	},
	getProductData(product) {
		let state = store.getState();

		let fuel = 'BİLİNMEYEN';
		let body = 'BİLİNMEYEN';
		let capacity = 'BİLİNMEYEN';

		if(product.technicalSpecs){
			product.technicalSpecs.forEach((group) => {
				group.specs.forEach((spec) => {
					if(spec.label.trim() === 'Yakıt'){
						fuel = spec.content.trim();
					}
					if(spec.label.trim() === 'Kasa Tipi / Kapı Sayısı'){
						body = spec.content.split('/')[0].trim();
					}
				});
			});
		}

		return {	
			'name': product.title,
			'id': product.id,
			'price': product.price,
			'brand': (product.brand ? product.brand.title : ''),
			'category': (product.breadCrumbs ? product.breadCrumbs[0].title+'/'+product.breadCrumbs[1].title+'/'+capacity+'/'+body+'/'+fuel : ''),
			'variant': (product.breadCrumbs ? product.breadCrumbs[1].title : ''),
			'list': (state.generic.currentPage ? (state.generic.currentPage.data.GATitle ? state.generic.currentPage.data.GATitle : state.generic.currentPage.data.title) : '')
		}
	},
	actions: {
		clipboard: function(text) {
			console.log('GA - Clipboard:\n', text)
			GA.sendData({
				eventCategory: 'Copy Element',
				eventAction: text,
			})
		},
		bid: function(value) {
			GA.sendData({
				customMetrics: {
					hitLevel: {
						cm_offer: value,
					}
				}
			})
		},
		pageChange: function() {
			//console.log('GA - Page Change: ', (store.getState().generic.currentPage.data.GATitle ? store.getState().generic.currentPage.data.GATitle : store.getState().generic.currentPage.data.title));
			GA.sendData({
				eventCategory: 'Change Page',
				eventAction: '',
			});
		},
		productClick: function(product) {
			GA.sendData({
				event: 'eec.Event',
				eventCategory: 'Enhanced Ecommerce',
				eventAction: 'Product Clicks',
				eventLabel: '',
				eventValue: 0,
				ecommerce: {
					click: {
						actionField : {
							list: '<listValue>'
						},
						product: GA.getProductData(product)
					}
				}
			});
		},
		productView: function(product) {
			GA.sendData({
				event: 'eec.Event',
				eventCategory: 'Enhanced Ecommerce',
				eventAction: 'Product Detail Views',
				eventLabel: '',
				eventValue: 0,
				ecommerce: {
					click: {
						actionField : {
							list: '<listValue>'
						},
						product: GA.getProductData(product)
					}
				}
			});
		}
	}
} 