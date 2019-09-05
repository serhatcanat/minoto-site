import React from 'react'

//Deps
import store from 'data/store'
import merge from 'lodash/merge'
import throttle from 'lodash/throttle'
import { getCookie } from 'functions/helpers'
import { connect } from "react-redux"
import { clearImpressions, checkConversion } from 'data/store.ga'

const mapStateToProps = state => {
	return {
		impressions: state.ga.impressions,
	};
};

/*
const mapDispatchToProps = dispatch => {
	return {
		clearImpressions: () => dispatch(clearImpressions()),
	}
}
*/

class GAWatcher extends React.Component {
	constructor(props){
		super(props);

		this.updateImpressions = throttle(this.updateImpressions.bind(this), 500, {leading: false});
	}

	componentDidMount() {
		document.getElementsByTagName('BODY')[0].addEventListener('copy', (event) => {
			GA.send('clipboard', document.getSelection().toString())
		});
	}

	componentDidUpdate(prevProps) {
		if(this.props.impressions.timestamp !== 0 && prevProps.impressions.timestamp !== this.props.impressions.timestamp){
			this.updateImpressions();
		}
	}

	updateImpressions() {
		GA.send('productImpressions', this.props.impressions);
	}

	render() {
		return false;
	}
}

export default connect(mapStateToProps, null)(GAWatcher);

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
					cd_pageType: GA.getCurrentPage()
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
			data.customDefinitions.userLevel = {
				cd_userLogin: false,
				cd_visitorID: getCookie('_gid')
			}
		}

		if(state.ga.productData) {
			let productData = GA.getProductData()
			//data.products = [productData.product];
			data.customDefinitions.hitLevel = merge(data.customDefinitions.hitLevel, productData.cd);
			//data.customDefinitions.
		}

		if(state.ga.dealerData) {
			let dealerData = GA.getDealerData()
			data.customDefinitions.hitLevel = merge(data.customDefinitions.hitLevel, dealerData.cd);
			//data.customDefinitions.
		}

		return data;
	},
	getProductData(product = false) {
		if(product === false) {
			product = store.getState().ga.productData;
		}

		if(product){

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
				product: {
					'name': product.title,
					'id': product.id,
					'price': product.price,
					'brand': (product.brand ? product.brand.title : ''),
					'category': (product.breadCrumbs ? product.breadCrumbs[0].title+'/'+product.breadCrumbs[1].title+'/'+capacity+'/'+body+'/'+fuel : ''),
					'variant': (product.breadCrumbs ? product.breadCrumbs[1].title : ''),
					'list': GA.getCurrentPage()
				},
				cd: {
					cd_carCity: '',
					cd_carColor: '',
					cd_district: '',
					cd_productionYear: '',
					cd_engineCapacity: capacity,
					cd_tractionType: '',
					cd_transmissionType: '',
					cd_fuelType: fuel,
					cd_vehicleBody: body,
					cd_productionPlace: '',
				}
			}
		}
		else {
			return false;
		}
	},
	getDealerData(dealer = false) {
		let state = store.getState();
		if(dealer === false) { dealer = state.ga.dealerData; }

		if(dealer){
			return {
				dealer: {
					name: dealer.title,
					id: dealer.id,
				},
				cd: {
					cd_dealerID: dealer.id,
					cd_dealerName: dealer.title,
					cd_district: '',
					cd_carCity: '',
				}
			}
		}
		else {
			return false;
		}
	},
	getCurrentPage() {
		let state = store.getState();
		return (state.generic.currentPage ? (state.generic.currentPage.data.GATitle ? state.generic.currentPage.data.GATitle : state.generic.currentPage.data.title) : '');
	},
	actions: {
		clipboard: function(text) {
			console.log('GA - Clipboard:\n', text)
			GA.sendData({
				eventCategory: 'Copy Element',
				eventAction: text,
			})
		},
		bid: function(data) {
			let productData = GA.getProductData();
			let dealerData = GA.getDealerData();
			GA.sendData({
				event: 'eec.Event',
				eventCategory: 'Enhanced Ecommerce',
				eventAction:'Conversion - Ürün Sayfası - Teklif Ver',
				eventLabel: productData.product.id,
				customMetrics: {
					hitLevel: {
						cm_offer: data.value,
					}
				},
				purchase: {
					actionField:  {
						id: dealerData.dealer.id,
						affiliation: dealerData.dealer.name,
						revenue: data.value,
					},
					products: productData.product
				}
			})
		},
		/*pageChange: function() {
			//console.log('GA - Page Change: ', (store.getState().generic.currentPage.data.GATitle ? store.getState().generic.currentPage.data.GATitle : store.getState().generic.currentPage.data.title));
			GA.sendData({
				eventCategory: 'Change Page',
				eventAction: '',
			});
		},*/
		productClick: function(data) {
			GA.sendData({
				event: 'eec.Event',
				eventCategory: 'Enhanced Ecommerce',
				eventAction: 'Product Clicks',
				eventLabel: '',
				eventValue: 0,
				ecommerce: {
					click: {
						actionField : {
							list: GA.getCurrentPage()
						},
						product: GA.getProductData(data.product).product
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
							list: GA.getCurrentPage()
						},
						product: GA.getProductData(product).product
					}
				}
			});
		},
		productImpressions: function(data) {
			Object.keys(data.groups).forEach((key)=>{
				let group = data.groups[key];

				GA.sendData({
					event: 'eec.Event',
					eventCategory: 'Enhanced Ecommerce',
					eventAction: 'Product Impressions',
					eventLabel: key,
					eventValue: group.totalCount,
					ecommerce: {
						impressions: group.items
					}
				});
			});

			clearImpressions();
		},
		conversion: function(data) {
			let productData = GA.getProductData();
			let dealerData = GA.getDealerData();

			if(productData){
				checkConversion(productData.product.id, function(status){
					if(status){
						console.log('YES: ' + productData.product.id);
						/*
						revenue data test edelim
						GA.sendData({
							event: 'eec.Event',
							eventCategory: 'Enhanced Ecommerce',
							eventAction:'Conversion - Ürün Sayfası - Teklif Ver',
							eventLabel: productData.product.id,
							customMetrics: {
								hitLevel: {
									cm_offer: data.revenue,
								}
							},
							purchase: {
								actionField:  {
									id: dealerData.dealer.id,
									affiliation: dealerData.dealer.name,
									revenue: data.revenue,
								},
								products: productData.product
							}
						})
						*/
					}
					else {
						console.log('NO');
					}
				})
			}

		}
	}
} 