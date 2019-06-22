import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import ContentBox from 'components/partials/contentbox.js'
import Link from 'components/partials/link.js'

// Deps
//import { connect } from "react-redux"
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'

// Assets

export default class Favorites extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			favorites: false,
		}

		this.updateData = this.updateData.bind(this);
	}

	componentDidMount() {
		if(!this.props.match.params.section){
			redirect('account.favorites', {section: "araclar"});
		}
		else{
			this.updateData();
		}
	}

	componentDidUpdate(prevProps) {
		if(prevProps.match.params.section !== this.props.match.params.section){
			this.updateData();
		}
	}

	updateData() {
		let vm = this;
		vm.setState({ favorites: false });
		request.get('/dummy/data/user-favorites.json', { group: this.props.match.params.section }, function(payload){
			if(payload){
				vm.setState({favorites: payload})
			}
		}, { excludeApiPath: true });
	}

	render () {
		let favorites = this.state.favorites;
		return (
			<section className="section account-favorites loader-container">
				<nav className="favorites-nav">
					<Link className="nav-link" navLink href="account.favorites" params={{ section: "araclar" }}>Araçlar</Link>
					<Link className="nav-link" navLink href="account.favorites" params={{ section: "bayiler" }}>Bayiler</Link>
					<Link className="nav-link" navLink href="account.favorites" params={{ section: "markalar" }}>Markalar</Link>
				</nav>
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