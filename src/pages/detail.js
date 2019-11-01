import React from 'react'
// Sections
import SubscriptionBar from 'components/sections/subscriptionbar'
// Partials
import Breadcrumbs from 'components/partials/breadcrumbs'
import Loader from 'components/partials/loader'
import FavBtn from 'components/partials/favbtn'
import ContentBox from 'components/partials/contentbox'
import {DetailExtras, DetailInfo, DetailRelated, DetailTopInfo} from 'components/partials/detail'
// Deps
//import { ListingLink } from 'controllers/navigator'
import {set404} from 'controllers/navigator'
import {openModal} from "functions/modals"
import {connect} from "react-redux"
import request from 'controllers/request'
import {setDescription, setHead, setTitle} from 'controllers/head'
import {storageSpace} from "functions/helpers"
import {setDealerData, setProductData} from 'data/store.ga'
import {GA} from 'controllers/ga'
//Functions
import {CompareListService} from '../functions'
// Assets
import {addVehicleToCompare, setVehicleToReservation} from "../actions";
import {DetailGallery} from "../components/partials/detail/DetailGallery";


class Detail extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			productData: false,
			loading: true,
			galleryFullScreen: false,
		};

		this.initialize = this.initialize.bind(this);
		this.setFullScreen = this.setFullScreen.bind(this);
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
		this.initialize();
	}

	componentWillMount() {
		this.setState({
			externalId: this.props.match.params.post.substring(this.props.match.params.post.lastIndexOf('M'))
		});
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	componentDidUpdate(prevProps, prevState) {

		let user = this.props.user;
		if (prevProps.user === false && user !== false) {
			this.initialize()
		}

		if (prevProps.match.params.post !== this.props.match.params.post) {
			window.scroll(0, 0);
			this.setState({
				productData: false,
			});
		}

		if (prevState.productData !== false && this.state.productData === false) {
			this.initialize();
		}
	}

	setCompareList(){
		const product = this.state.productData;
		const storedList = this.props.compareList.data;

		const _compareListService = new CompareListService();

		if (!_compareListService.isExist(product,storedList)){
			this.props.addVehicleToCompare(product);
		}
		openModal('compare',{history:this.props.history});
	}

	initialize() {
		let vm = this;
		const {externalId} = vm.state;

		if (vm.state.productData === false) {
			request.get(`car-post/${externalId}`, {email: this.props.user.email}, function (payload, status) {
				//request.get('/dummy/data/detail.json', { id: vm.props.match.params.id }, function (payload, status) {
				if (payload) {
					vm.setState({
						productData: payload
					});

					vm.props.setGaProductData(payload);
					vm.props.setGaDealerData(payload.dealer);
					GA.send('productView', payload);

					setTitle(`${payload.title} - ${payload.dealer.title}`);

					setDescription(`Sıfır Km ${payload.title} araba fiyatları ve araç özellikleri Minoto'da! ${payload.dealer.title} şubesinden ${payload.title} satın almak için hemen tıkla, fırsatları kaçırma!`);

					if (payload.image) {
						setHead([{
							key: "meta",
							props: {
								property: "og:image",
								content: storageSpace('car-posts', payload.image),
							}
						}]);
					};
				}
				else {
					set404();
				}
			}, { excludeApiPath: false });
		}
	}

	setFullScreen(state) {
		let vm = this;
		if (vm.mounted) {
			vm.setState({ galleryFullScreen: state });
		}
	}


	render() {
		let vm = this;
		let product = vm.state.productData;
		const {reservation,setVehicleToReservation} = this.props;
		const {mobile} = vm.props;
		return (
			<main className={"page detail minoto-ui" + (vm.state.galleryFullScreen ? ' gallery-fullscreen' : '')}>
				<Loader loading={product === false} strict={true} />
				{product !== false &&
					<div>
						<section className="section detail-top">
							{!mobile &&
								<div className="top-wrap wrapper" lang="en">
									<Breadcrumbs className="top-breadcrumbs" data={[
										{
											"href": "home",
											"title": "Anasayfa"
										},
										{
											"href": `/${product.breadCrumbs[0].value}`,
											"title": product.breadCrumbs[0].title
										},
										{
											"href": `/${product.breadCrumbs[0].value}/${product.breadCrumbs[1].value}`,
											"title": product.breadCrumbs[1].title
										},
										{
											"href": `/${product.breadCrumbs[0].value}/${product.breadCrumbs[1].value}/${product.breadCrumbs[2].value}`,
											"title": product.breadCrumbs[2].title
										},
										{
											"href": `/${product.breadCrumbs[0].value}/${product.breadCrumbs[1].value}/${product.breadCrumbs[2].value}/${product.breadCrumbs[3].value}`,
											"title": product.breadCrumbs[3].title
										},
										{
											"href": `/${product.breadCrumbs[0].value}/${product.breadCrumbs[1].value}/${product.breadCrumbs[2].value}/${product.breadCrumbs[3].value}/${product.breadCrumbs.length > 4 ? product.breadCrumbs[4].value : ''} `,
											"title": product.breadCrumbs.length > 4 ? product.breadCrumbs[4].title : ''
										},
										/* {
											"href": ListingLink([
												{ 'key': 'tip', 'val': 'otomobil' },
												{ 'key': 'marka', 'val': 'audi' },
												{ 'key': 'model', 'val': 'a3' },
											]),
											"title": "A3"
										},
										{
											"href": ListingLink([
												{ 'key': 'tip', 'val': 'otomobil' },
												{ 'key': 'marka', 'val': 'audi' },
												{ 'key': 'model', 'val': 'a3' },
												{ 'key': 'kasa', 'val': 'a3-sportsback' },
											]),
											"title": "A3 Sportback"
										},
										{
											"href": ListingLink([
												{ 'key': 'tip', 'val': 'otomobil' },
												{ 'key': 'marka', 'val': 'audi' },
												{ 'key': 'model', 'val': 'a3' },
												{ 'key': 'kasa', 'val': 'a3-sportsback' },
											]),
											"title": "1.8 TDI"
										},
										{
											"href": ListingLink([
												{ 'key': 'tip', 'val': 'otomobil' },
												{ 'key': 'marka', 'val': 'audi' },
												{ 'key': 'model', 'val': 'a3' },
												{ 'key': 'kasa', 'val': 'a3-sportsback' },
											]),
											"title": "Ambiente"
										} */
									]} />

									<div className="top-controls">
										{(product.activeViewers && product.activeViewers > 0) &&
											<span className="controls-viewers" style={{ opacity: '0' }}>{product.activeViewers} kişi bakıyor</span>
										}
										<span className="controls-date">{product.date}</span>
										<FavBtn className="controls-btn" faved={product.favorited} type="post" id={product.id}> {product.favorited ? 'Favori İlan' : 'Favorilere Ekle'}</FavBtn>
										<button className="controls-btn"
												onClick={() => this.setCompareList()}><i
											className="icon-compare"/>Karşılaştır
											({this.props.compareList.data.length})
										</button>
										<button className="controls-btn" onClick={() => openModal('share')}><i className="icon-share"></i> Paylaş</button>
									</div>
								</div>
							}
							{mobile &&
							<DetailTopInfo product={product} mobile={mobile}
										   addVehicleToCompare={this.props.addVehicleToCompare}
										   compareList={this.props.compareList} productData={this.state.productData}
										   history={this.props.history}/>
							}
						</section>
						<section className="section detail-content">
							<div className="content-wrap wrapper">
								<div className="content-left">
									<DetailGallery product={product} mobile={mobile} onFullScreenChange={vm.setFullScreen} fullScreen={vm.state.galleryFullScreen} />
									{mobile &&
									<DetailInfo product={product} mobile={mobile} reservation={reservation} setVehicleToReservation={setVehicleToReservation} history={this.props.history}/>
									}
									<DetailExtras product={product} mobile={mobile} />
								</div>
								{!mobile &&
									<div className="content-right">
										<DetailTopInfo product={product} mobile={mobile} />
										<DetailInfo product={product} mobile={mobile} reservation={reservation} setVehicleToReservation={setVehicleToReservation} history={this.props.history}/>
									</div>
								}
							</div>
						</section>

						{!mobile &&
							<section className="section detail-related">
								<div className="wrapper">
									<div className="related-innerwrap">
										<h2 className="related-title">Benzer araçlar</h2>
										{
											product && (
												<DetailRelated postId={product.id} mobile={mobile} />
											)
										}
									</div>
								</div>
							</section>

						}

						<SubscriptionBar className="detail-subscription" heading={"Daha fazla " + product.brand.title + " modelleri için sizi bilgilendirelim!"} />
						{/*product.ads &&
							<section className="section detail-banners">
								<div className="wrapper">
									{product.ads.map((ad, nth) => (
										<Link type='a' href={`/ blog / detay / ${ ad.url }`} title={ad.title} key={nth} className={"banners-item x-" + ad.size}>
											<Image src={storageSpace('articles', ad.image)} />
										</Link>
									))}
								</div>
							</section>
						*/}
						{product.ads &&
							<section className="section detail-blogposts">
								<div className="wrapper">
									<ul className="blogposts-list">
										{product.ads.map((ad, nth) => (
											<li className="blogposts-item" key={nth}>
												<ContentBox
													type="blogpost"
													//pretitle={ad.date}
													title={ad.title}
													image={storageSpace('c_scale,q_auto:good,w_500/articles', ad.image)}
													url="blogDetail"
													additionsOptional
													urlParams={{ slug: ad.url }}
												/>
											</li>
										))}
									</ul>
								</div>
							</section>
						}
					</div>
				}
			</main>
		)
	}
}


const mapStateToProps = ({generic, user, compareList,reservation}) => {
	return {mobile: generic.mobile, user: user.user, compareList,reservation};
};

const mapDispatchToProps = dispatch => {
	return {
		setGaProductData: (data) => dispatch(setProductData(data)),
		setGaDealerData: (data) => dispatch(setDealerData(data)),
		addVehicleToCompare: (data) => dispatch(addVehicleToCompare(data)),
		setVehicleToReservation: (data) => dispatch(setVehicleToReservation(data)),
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(Detail);






