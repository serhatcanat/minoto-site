import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import Image from 'components/partials/image'
import ContentBox from 'components/partials/contentbox.js'

// Deps
//import { connect } from "react-redux"
import { setTitle } from 'controllers/head'
import axios from 'axios'

// Assets
import image_notification_default from 'assets/images/defaults/autocomplete-thumb.jpg'

export default class Favorites extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			favorites: false,
		}
	}

	componentDidMount() {
		let vm = this;
		setTitle('Favorilerim');

		axios.get(
			'/dummy/data/user-favorites.json',
			{ params: {} }
		).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({favorites: res.data.favorites})
			}
		});
	}

	render () {
		let favorites = this.state.favorites;
		return (
			<section className="section account-favorites loader-container">
				<Loader loading={favorites === false} />
				{favorites &&
					<div className="wrapper narrow">
						{favorites.length &&
							<ul className="favorites-list">
							{favorites.map((item, nth) => (
								<li key={nth} className="list-item">
									<ContentBox
										className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
										title={item.title}
										subtitle={item.dealer}
										image={item.image}
										price={item.price}
										labels={item.labels}
										faved={true}
										badge={(item.status === 1 ? false : (item.status === 2 ? {text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur'} : {text : 'Satıldı', type : 'error'}))}
										bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false )}
										url={item.link}
									/>
								</li>
							))}
							</ul>
						}
						{favorites.length === 0 &&
							<div className="favorites-error">
								Hiç favoriniz bulunmuyor.
							</div>
						}
					</div>
				}
			</section>
		)
	}
}