import React from 'react'

//Deps
import store from 'data/store'
import merge from 'lodash/merge'
import throttle from 'lodash/throttle'
import { getCookie } from 'functions/helpers'
import { connect } from "react-redux"
import { clearImpressions } from 'data/store.ga'

const conversionTimeout = 1800000;
const conversionSessionPrefix = 'productConversion_';

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
				cd_userGender: userData.gender,
				cd_registrationDate: userData.created_at,
				cd_userAgeRange: userData.age,
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
	getProductData(product = false, opts = {}) {
		if(product === false) {
			product = store.getState().ga.productData;
		}

		let defaultOpts = {
			list: GA.getCurrentPage(),
		}

		opts = merge(defaultOpts, opts);

		if(product){

			let brand = "";
			let model = "";
			let	engineCapacity = "";
			let	bodyType = "";
			let	fuelType = "";
			let	city = "";
			let	color = "";
			let	district = "";
			let	year = "";
			let	tractionType = "";
			let	transmissionType = "";

			if(product.ga){
				brand = product.ga.brand;
				model = product.ga.model;
				engineCapacity = product.ga.engineCapacity;
				bodyType = product.ga.bodyType;
				fuelType = product.ga.fuelType;
				city = product.ga.city;
				color = product.ga.color;
				district = product.ga.district;
				year = product.ga.year;
				tractionType = product.ga.tractionType;
				transmissionType = product.ga.gearType;
			}

			return {	
				id: product.postNo,
				product: {
					'name': product.title,
					'id': product.postNo,
					'price': product.price,
					'brand': brand,
					'category': (brand+'/'+model+'/'+engineCapacity+'/'+bodyType+'/'+fuelType),
					'variant': engineCapacity,
					'list': opts.list,
				},
				cd: {
					cd_carCity: city,
					cd_carColor: color,
					cd_district: district,
					cd_productionYear: year,
					cd_engineCapacity: engineCapacity,
					cd_tractionType: tractionType,
					cd_transmissionType: transmissionType,
					cd_fuelType: fuelType,
					cd_vehicleBody: bodyType,
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
			let data = {
				dealer: {
					name: dealer.title,
					id: dealer.id,
				},
				cd: {
					cd_dealerID: dealer.id,
					cd_dealerName: dealer.title,
				}
			}

			if(dealer.district) {
				data.cd.cd_district = dealer.district;
			}
			if(dealer.city) {
				data.cd.cd_carCity = dealer.city;
			}

			return data;
		}
		else {
			return false;
		}
	},
	getCurrentPage() {
		let state = store.getState();
		return (state.generic.currentPage ? (state.generic.currentPage.data.GATitle ? state.generic.currentPage.data.GATitle : state.generic.currentPage.data.title) : '');
	},
	checkConversion(productID, endFunction) {
		const sessionKey = conversionSessionPrefix+productID;
		let conversionData = sessionStorage.getItem(sessionKey);
		let now = Date.now();

		if(conversionData === null || conversionData + conversionTimeout <= now){
			conversionData = now;
			sessionStorage.setItem(sessionKey, conversionData);
			endFunction(true);
		}
		else {
			endFunction(false);
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
					detail: {
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

			if(dealerData){
				GA.checkConversion(productData.id, function(status){
					if(status){
						let gaData = {
							event: 'eec.Event',
							eventCategory: 'Enhanced Ecommerce',
							eventAction:false,
							eventLabel: false,
							customMetrics: {
								hitLevel: {
								}
							},
							purchase: {
								actionField:  {
									affiliation: dealerData.dealer.name,
								},
								products: productData.product
							}
						};

						if(productData){
							gaData.purchase.actionField.revenue = productData.product.price;
						}

						switch(data.action){
							case "bid":
								gaData.eventAction = "Conversion - Ürün Sayfası - Teklif Ver"
								gaData.customMetrics.hitLevel.cm_offer = parseInt(data.offer.split('.').join(""));
								gaData.eventLabel = productData.id;
								gaData.purchase.actionField.id = data.threadID
							break;
							case "message":
								gaData.eventAction = "Conversion - Ürün Sayfası - Mesaj Gönder";
								gaData.eventLabel = productData.id;
								gaData.purchase.actionField.id = data.threadID
							break;
							case "callDealer":
								gaData.eventAction = (productData ? "Conversion - Ürün Sayfası - Telefon Et" : "Conversion - Bayi Sayfası - Telefon Et");
								gaData.eventLabel = (productData ? productData.id : dealerData.id);
							break;
							default:
							break;
						}

						if(gaData.eventAction !== false){
							GA.sendData(gaData);
						}
						else {
							console.log('HATA', gaData, data);
						}
					}
					else {
						console.log('NO');
					}
				})
			}
			else {
				console.log('GA Conversion Error: No product or dealer data. Product: ', productData, 'Dealer: ', dealerData);
			}
		},
		loginActions: function(data) {
			GA.sendData({
				'event': 'gaEvent',
				'eventCategory': 'Register',
				'eventAction': data.action,
				'eventLabel': data.label,
				'eventValue': 0,
				'eventNonInteraction': ''
			});
		},
		searchClick: function(data){
			GA.sendData({
				'event': 'gaEvent',
				'eventCategory': 'Search',
				'eventAction': data.searchInput,
				'eventLabel': data.product.title,
				'eventValue': 0,
				'eventNonInteraction': ''
			});
		},
		searchNotFound: function(data){
			GA.sendData({
				'event': 'gaEvent',
				'eventCategory': 'Search',
				'eventAction': 'Sonuç Bulunamadı.',
				'eventLabel': data.searchInput,
				'eventValue': 0,
				'eventNonInteraction': ''
			});
		}
	}
} 