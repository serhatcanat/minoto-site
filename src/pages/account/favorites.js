import React from 'react'

// Partials
import Loader from 'components/partials/loader'
import ContentBox from 'components/partials/contentbox.js'
import Link from 'components/partials/link.js'

// Deps
//import { connect } from "react-redux"
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import { storageSpace } from "functions/helpers";
// Assets

const converter = {
	araclar: 'post',
	bayiler: 'dealer',
	markalar: 'brand',
}

const categoryNames = {
	araclar: 'Araçlar',
	bayiler: 'Bayiler',
	markalar: 'Markalar',
};

export default class Favorites extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			favorites: false,
		}

		this.updateData = this.updateData.bind(this);
	}

	componentDidMount() {
		if (!this.props.match.params.section) {
			redirect('account.favorites', { section: "araclar" });
		}
		else {
			this.updateData();
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.section !== this.props.match.params.section) {
			this.updateData();
		}
	}

	updateData() {
		let vm = this;
		vm.setState({ favorites: false });

		request.get(`favorites/${converter[this.props.match.params.section]}`, {}, function (payload) {
			if (payload) {
				vm.setState({ favorites: payload })
			}
		}, { excludeApiPath: false });
	}

	render() {
		let favorites = this.state.favorites;
		let section = this.props.match.params.section;
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
						{favorites.length ?
							<ul className="favorites-list">
								{favorites.map((item, nth) => {
									let contents = [];
									switch (section) {
										case 'bayiler':
											contents.push(
												<li key={nth} className="list-item">
													<ContentBox
														type="plain"
														className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
														title={item.title}
														subtitle={item.dealer}
														additionTitle={item.count + ' ARAÇ'}
														image={storageSpace('dealers', item.image)}
														labels={item.labels}
														faved={item.favorited}
														//favControls={'/dummy/data/fav/dealer/'+item.id}
														badge={(item.status !== 1 ? false : (item.status === 2 ? { text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur' } : { text: 'Satıldı', type: 'error' }))}
														bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false)}
														url={`/bayi/${item.id}/${item.link}`}
													/>
												</li>
											)
											break;
										case 'markalar':
											contents.push(
												<li key={nth} className="list-item">
													<ContentBox
														type="plain"
														className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
														title={item.title}
														labels={item.labels}
														additionTitle={item.count + ' ARAÇ'}
														image={storageSpace('brands', item.image)}
														faved={item.favorited}
														//favControls={'/dummy/data/fav/dealer/'+item.id}
														url={`/markalar/${item.link}`}
													/>
												</li>
											)
											break;
										default:
											contents.push(
												<li key={nth} className="list-item">
													<ContentBox
														className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
														title={item.title}
														subtitle={item.dealer}
														image={storageSpace('car-posts', item.image)}
														price={item.price}
														labels={item.labels}
														faved={true}
														badge={(item.status === 1 ? false : (item.status === 2 ? { text: 'Rezerve', note: '02.02.2019 Tarihine Kadar Opsiyonludur' } : { text: 'Satıldı', type: 'error' }))}
														bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false)}
														url="detail"
														urlParams={{ id: item.id, slug: item.slug }}
													/>
												</li>
											)
											break;
									}
									return contents;
								})}
							</ul>
							: false
						}
						{favorites.length === 0 ?
							<div className="favorites-error"><div className="error-message">{categoryNames[section]} kategorisinde hiç favoriniz bulunmuyor.</div></div>
							: false
						}
					</div>
				}
			</section>
		)
	}
}