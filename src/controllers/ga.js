import React from 'react'

//Deps
import store from 'data/store'
import merge from 'lodash/merge'

export default class GAWatcher extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			lol: true,
		};
	}

	componentDidMount() {
		document.getElementsByTagName('BODY')[0].addEventListener('copy', (event) => {
			GA.send('clipboard', document.getSelection().toString())
		});
	}

	render() {
		return false;
	}
}

export const GA = {
	send: function(action, data) {
		if(GA.actions[action]) {
			GA.actions[action](data);
		}
	},
	sendData: function(data) {
		let gaData = merge(GA.getDefaultData(), data);
		console.log('GA - Parsed Data', gaData);
		window.dataLayer.push(gaData);
	},
	getDefaultData() {
		let state = store.getState();
		let userData = state.user.user;

		let data = {
			event: 'gaEvent',
			eventCategory: 'Category',
			eventAction: 'Action',
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
		console.log('GA - Current User Data:', userData);

		return data;
	},
	actions: {
		'clipboard': function(text) {
			console.log('GA - Clipboard:', text)
			GA.sendData({
				eventAction: text,
				eventCategory: 'Copy Item',
			})
		}
	}
} 