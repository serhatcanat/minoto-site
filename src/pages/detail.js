import React from 'react'

// Sections
import Listing from 'components/sections/listing'
import SubscriptionBar from 'components/sections/subscriptionbar'

// Partials
import Breadcrumbs from 'components/partials/breadcrumbs'
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import PopInfo from 'components/partials/popinfo.js'
import Collapse from 'components/partials/collapse.js'
import Slider from 'components/partials/slider.js'
import Tabs from 'components/partials/tabs.js'
import Link from 'components/partials/link.js'
import FavBtn from 'components/partials/favbtn'
import ContentBox from 'components/partials/contentbox'
import PriceTag from 'components/partials/price-tag'
import { InputForm, FormInput } from 'components/partials/forms'
// Deps
//import { ListingLink } from 'controllers/navigator'
import { set404 } from 'controllers/navigator'
import { openModal } from "functions/modals"
import { blockOverflow, nl2br, remToPx, formatNumber } from 'functions/helpers.js'
import parse from 'html-react-parser'
import { connect } from "react-redux"
import request from 'controllers/request'
import { setTitle, setDescription, setHead } from 'controllers/head'
import { storageSpace } from "functions/helpers"
import { setProductData, setDealerData } from 'data/store.ga'
import { GA } from 'controllers/ga'

// Assets
import image_avatar from 'assets/images/defaults/avatar.svg';
import image_loader from 'assets/images/minoto-loading.gif'
import image_garanti from 'assets/images/garabtiBBVA.png'
//import image_isbank from 'assets/images/turkiye-is-bankasi.png'

const ncapDescriptions = [
	"1 yıldızlı güvenlik: Marjinal çarpışma koruması.",
	"2 yıldızlı güvenlik: Nominal çarpışma koruması ancak çarpışmadan kaçınma teknolojisi yok.",
	"3 yıldızlı güvenlik: Yolcu koruma konusunda ortalama ile iyi arasında ancak çarpışmadan kaçınma teknolojisi yok.",
	"4 yıldızlı güvenlik: Çarpışma korumasına yönelik toplam iyi performans; ilave çarpışmadan kaçınma teknolojisi mevcut olabilir.",
	"5 yıldızlı güvenlik: Çarpışma korumasına yönelik toplam iyi performans. Sağlam çarpışmadan kaçınma ekipmanı ile donatılmış."
]

const mapStateToProps = state => {
	return { mobile: state.generic.mobile, user: state.user.user, };
};

const mapDispatchToProps = dispatch => {
	return {
		setGaProductData: (data) => dispatch(setProductData(data)),
		setGaDealerData: (data) => dispatch(setDealerData(data)),
	}
}

class Detail extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			productData: false,
			loading: true,
			galleryFullScreen: false,
		}

		this.initialize = this.initialize.bind(this);
		this.setFullScreen = this.setFullScreen.bind(this);

		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;

		this.initialize();
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

	initialize() {
		let vm = this;
		if (vm.state.productData === false) {
			request.get(`car-post/${vm.props.match.params.post.substring(vm.props.match.params.post.lastIndexOf('M'))}`, { email: this.props.user.email }, function (payload, status) {
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

		return (
			<main className={"page detail" + (vm.state.galleryFullScreen ? ' gallery-fullscreen' : '')}>
				<Loader loading={product === false} strict={true} />
				{product !== false &&
					<div>
						<section className="section detail-top">
							{!vm.props.mobile &&
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
										{/*<button className="controls-btn"><i className="icon-heart-empty"></i> Favorilere Ekle</button>*/}
										{/*
											<button className="controls-btn"><i className="icon-compare"></i> Karşılaştır (3)</button>
										*/}
										<button className="controls-btn" onClick={() => openModal('share')}><i className="icon-share"></i> Paylaş</button>
									</div>
								</div>
							}
							{vm.props.mobile &&
								<DetailTopInfo product={product} mobile={vm.props.mobile} />
							}
						</section>

						<section className="section detail-content">
							<div className="content-wrap wrapper">
								<div className="content-left">
									<DetailGallery product={product} mobile={vm.props.mobile} onFullScreenChange={vm.setFullScreen} fullScreen={vm.state.galleryFullScreen} />
									{vm.props.mobile &&
										<DetailInfo product={product} mobile={vm.props.mobile} />
									}
									<DetailExtras product={product} mobile={vm.props.mobile} />
								</div>
								{!vm.props.mobile &&
									<div className="content-right">
										<DetailTopInfo product={product} mobile={vm.props.mobile} />
										<DetailInfo product={product} mobile={vm.props.mobile} />
									</div>
								}
							</div>
						</section>

						{!vm.props.mobile &&
							<section className="section detail-related">
								<div className="wrapper">
									<div className="related-innerwrap">
										<h2 className="related-title">Benzer araçlar</h2>
										{
											product && (
												<DetailRelated postId={product.id} mobile={vm.props.mobile} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Detail);

class DetailGallery extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			activeImage: false,
		}

		this.mainSlider = React.createRef();
		this.thumbSlider = React.createRef();
		this.imageChange = this.imageChange.bind(this);
		this.keyPress = this.keyPress.bind(this);
	}

	componentDidMount() {
		this.setState({ activeImage: 0 })

		document.addEventListener('keydown', this.keyPress);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.keyPress);
	}

	componentDidUpdate(prevProps, prevState) {
		const nth = this.state.activeImage;
		let vm = this;
		if (vm.mainSlider.current.instance.realIndex !== nth) {
			vm.mainSlider.current.instance.slideToLoop(nth);
		}

		if (vm.thumbSlider.current && vm.thumbSlider.current.instance.realIndex !== nth) {
			vm.thumbSlider.current.instance.slideTo(nth);
		}


		if (prevProps.fullScreen !== vm.props.fullScreen) {
			setTimeout(function () {
				vm.mainSlider.current.instance.update();

				if (vm.thumbSlider.current) {
					vm.thumbSlider.current.instance.update();

				}
				window.dispatchEvent(new Event('resize'));

				blockOverflow(vm.props.fullScreen);
			}, 200)
		}

	}

	imageChange(nth) {
		this.setState({ activeImage: nth });
	}

	keyPress(e) {
		if (this.mainSlider.current && document.activeElement.tagName === 'BODY') {
			switch (e.key) {
				case "ArrowLeft":
					//this.mainSlider.current.prev();
					this.mainSlider.current.slideTo(this.state.activeImage);
					break;
				case "ArrowRight":
					//this.mainSlider.current.next();
					this.mainSlider.current.slideTo(this.state.activeImage + 2);
					break;
				default: break;
			}
		}
	}

	render() {
		let vm = this;
		let product = vm.props.product
		let images = product.gallery;

		return (
			<div className="content-gallery">
				{this.props.fullScreen &&
					<Btn className="gallery-close" low white uppercase icon="close" onClick={() => { vm.props.onFullScreenChange(false) }}>
						Kapat
					</Btn>
				}
				<div className="gallery-mainslider">
					<button className="mainslider-nav prev" onClick={() => { vm.mainSlider.current.prev(); }}><i className="icon-angle-left"></i></button>
					<button className="mainslider-nav next" onClick={() => { vm.mainSlider.current.next(); }}><i className="icon-angle-right"></i></button>
					<Slider className="mainslider-slider" ref={vm.mainSlider} loop opts={{ lazy: true }} onChange={vm.imageChange}>
						{images.map((image, nth) => (
							<div className="slider-imagewrap" key={nth}>
								<div className="imagewrap-image swiper-lazy" data-background={storageSpace('c_scale,q_60,w_1100/car-posts/gallery', image.medium)} onClick={() => { if (!vm.props.fullScreen && vm.props.mobile) { vm.props.onFullScreenChange(true); } }}>
								</div>
								<Image className="imagewrap-loader" width="100" bg src={image_loader} alt="Yükleniyor..." />
							</div>
						))}
					</Slider>
					{(!vm.props.mobile && !vm.props.fullScreen) &&
						<Btn className="mainslider-fullscreen" low white uppercase icon="search" onClick={() => { vm.props.onFullScreenChange(true) }}>
							Büyük Fotoğraf
						</Btn>
					}
				</div>
				{!vm.props.mobile &&
					<div className="gallery-thumbs">
						<button className="thumbs-nav prev" onClick={() => { vm.thumbSlider.current.prev(); }}><i className="icon-angle-left"></i></button>
						<button className="thumbs-nav next" onClick={() => { vm.thumbSlider.current.next(); }}><i className="icon-angle-right"></i></button>
						<Slider className="thumbs-carousel" slides={10} ref={vm.thumbSlider} opts={{ preventClicks: false }}>
							{images.map((image, nth) => (
								<button type="button" className={"carousel-imagebtn" + (vm.state.activeImage === nth ? ' active' : '')} key={nth} onClick={() => { vm.imageChange(nth); }}>
									<Image className="carousel-image" key={nth} bg src={storageSpace('c_scale,q_auto:eco,w_130/car-posts/gallery', image.thumb)} alt={product.title} />
								</button>
							))}
						</Slider>
					</div>
				}
			</div>
		)
	}
}

class DetailInfo extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showCosts: false,
			showDealers: false,
			selectedBranch: false,
		}

	}



	render() {
		let vm = this;
		let product = vm.props.product
		let selectedBranch = vm.state.selectedBranch

		return (
			<div className="detail-info">
				<h2 className="info-title">{product.title}</h2>
				{(product.mainFeatures && product.mainFeatures.length) &&
					<ul className="info-mainfeatures">
						{product.mainFeatures.map((feature, nth) => (
							<li key={nth}>
								<span title={feature.title + ': ' + feature.label}>
									{feature.icon && <i className={"icon-" + feature.icon}></i>}
									<label>{feature.label}</label>
								</span>
							</li>
						))}
					</ul>
				}
				{(product.highlights && vm.props.mobile) &&
					<ul className="info-highlights">
						{product.highlights.map((highlight, nth) => (
							<React.Fragment key={nth}>
								{
									highlight.label && (
										<li key={nth} title={highlight.title}>{(highlight.image ?
											<Image alt={highlight.title} src={`/dummy/images/${highlight.image}`} />
											:
											<span>{highlight.label}</span>
										)}</li>
									)
								}
							</React.Fragment>


						))}
					</ul>
				}
				{product.ncap &&
					<div className="info-ncap">
						<strong title="Euro NCAP Puanı">NCAP</strong>
						<div className="ncap-stars" title={product.ncap + ' Yıldız'}>
							<i className={"icon-star" + (product.ncap >= 1 ? ' active' : '')}></i>
							<i className={"icon-star" + (product.ncap >= 2 ? ' active' : '')}></i>
							<i className={"icon-star" + (product.ncap >= 3 ? ' active' : '')}></i>
							<i className={"icon-star" + (product.ncap >= 4 ? ' active' : '')}></i>
							<i className={"icon-star" + (product.ncap >= 5 ? ' active' : '')}></i>
						</div>
						<PopInfo className="ncap-info" wide content={ncapDescriptions[product.ncap - 1]}>
							<i className="icon-question"></i>
						</PopInfo>
					</div>
				}

				<div className="info-price">
					<strong className="price-current">
						{product.price ? <PriceTag price={product.price} /> : 'SORUNUZ'}
					</strong>
					{(product.listingPrice && product.price > 0 && (product.listingPrice > product.price)) &&
						<div className={"price-listing" + ((product.listingPrice > product.price) ? ' higher' : '')}>
							<strong>Liste Fiyatı:</strong> <span style={{ textDecoration: parseInt(product.listingPrice, 10) > parseInt(product.price, 10) ? 'line-through' : 'none' }}>
								<PriceTag stroke={parseInt(product.listingPrice, 10) > parseInt(product.price, 10) ? true : false} price={parseInt(product.listingPrice, 10) > parseInt(product.price, 10) ? product.listingPrice : product.price} /></span>
						</div>
					}
				</div>

				{(product.price > 0 && product.costs.expenses.length) &&
					<div className="info-costs">
						<button className="costs-sum" type="button" onClick={() => { vm.setState({ showCosts: !vm.state.showCosts }) }}><strong>Bu aracın yıllık kullanım maliyeti:</strong> <PriceTag price={product.costs.total} /></button>
						<Collapse className="costs-wrap" open={vm.state.showCosts}>
							<ul className="costs-list">
								{product.costs.expenses.map((cost, nth) => (
									<React.Fragment key={nth}>
										{
											(cost.cost > 0) && (
												<React.Fragment>
													<li className="list-cost" key={nth}>
														<strong>
															{cost.title}
															{nth === 1 &&
																<PopInfo className="cost-info" content="İlk defa araç sahibi olanlar için öngörülen ortalama fiyattır" nowrap>
																	<i className="icon-question"></i>
																</PopInfo>
															}
														</strong>
														<span className="cost-num"><PriceTag price={cost.cost} /></span>
													</li>

												</React.Fragment>
											)

										}
									</React.Fragment>
								))}
								<li className="list-cost total">
									<strong>
										Toplam
										{/*<PopInfo className="cost-info" content="İstanbul Sanayi Odası'ndan alınmıştır" nowrap>
									<i className="icon-question"></i>
										</PopInfo>*/}
									</strong>
									<span className="cost-num"><PriceTag price={product.costs.total} /></span>
								</li>
							</ul>
						</Collapse>
					</div>
				}

				<div className="info-controls">
					<div className="controls-buttons">
						<Btn className="controls-button reservate" primary hollow uppercase note="Bu aracı çok yakında rezerve edebileceksiniz." disabled={true}>
							Rezerve Et
						</Btn>
						{
							((vm.props.mobile && product.dealer.phone) ?
								<a
									className="controls-phone"
									onClick={()=>{
										GA.send('conversion', {
											action: 'callDealer',
										});
									}}
									href={"tel:+9" + product.dealer.phone.replace(' ', '')}>
									<i className="icon-phone-nude"></i>
								</a>
								:
								<React.Fragment>
									{
										((vm.props.mobile && product.dealerPhone) &&
											<a
												className="controls-phone"
												onClick={()=>{
													GA.send('conversion', {
														action: 'callDealer',
													});
												}}
												href={"tel:+9" + product.dealerPhone.replace(' ', '')}>
												<i className="icon-phone-nude"></i>
											</a>
										)
									}
								</React.Fragment>
							)

						}
						{(product.bidThreadId)
							?
							<Btn className="controls-button bid" note="Bu araç için daha önce teklif verdiniz." primary uppercase tag="a" href={`/hesabim/mesajlarim/mesaj/${product.bidThreadId}`}>Tekliflerim</Btn>
							:
							<Btn disabled={(product.status === 3 || product.price === null) ? true : false} className="controls-button bid" onClick={() => openModal('bid', { advert: product })} primary uppercase note={product.status === 3 ? 'Bu araç "satıldı".' : (product.price === null ? 'Fiyat için bayi ile iletişime geçebilirsiniz' : 'Bu araç için teklif verebilirsiniz.')}>
								{product.status === 3 ? 'SATILDI' : 'Teklif Ver'}
							</Btn>}

					</div>

					{(product.reserved && product.reservationEndDate) &&
						<span className="controls-note">{product.reservationEndDate}'a kadar rezerve edilmiştir.</span>
					}
				</div>

				{
					!product.dealer.list ?
						(
							<React.Fragment>
								{
									product.dealer &&
									<div className="info-dealer">
										<div className="dealer-head">
											<Image className="dealer-image" bg src={storageSpace('dealers', product.dealer.logo)} />
											<div className="head-content">
												<Link href="branch" params={{ dealer: product.dealer.dealerUrl, slug: product.dealer.url }}>

													<strong className="dealer-title">
														<span className="dealer-badge">
															<PopInfo nowrap upsideDown content="Yetkili Bayi" noMarginLeft>
																<i className="badge-bg icon-ribbon"></i><i className="badge-icon icon-check"></i>
															</PopInfo>
														</span>

														{product.dealer.title}
													</strong>
												</Link>
												<p className="dealer-info">
													<span className="info-location">{product.dealer.location}</span>
													{product.dealer.workingHours && (
														<span className={"info-workinghours " + (product.dealer.open ? 'open' : 'closed')}>
															{product.dealer.workingHours}
															<span>|</span>
															{(product.dealer.open ? 'Şu an açık' : 'Şu an kapalı')}
														</span>
													)}

												</p>
											</div>
										</div>
										{product.dealer.rep &&
											<div className="dealer-rep">
												<Image src={product.dealer.rep.image ? product.dealer.rep.image : image_avatar} className="rep-image" />
												<strong className="rep-title">{product.dealer.rep.name}</strong>
												<span className="rep-role">{product.dealer.rep.role}</span>
											</div>
										}
										<div className="dealer-controls">
											{
												product.dealer.phone && (
													<Btn
														tag="a"
														icon="phone"
														block uppercase
														onClick={()=>{
															GA.send('conversion', {
																action: 'callDealer',
															});
														}}
														href={"tel:+9" + product.dealer.phone.replace(' ', '')}>
														{product.dealer.phone}
													</Btn>
												)

											}


											{
												product.messageThreadId ? <Btn icon="envelope" text uppercase block tag="a" href={`/hesabim/mesajlarim/mesaj/${product.messageThreadId}`}>Mesajlara Git</Btn> : <Btn icon="envelope" text uppercase block onClick={() => openModal('message', { advert: product })}>Mesaj Gönder</Btn>
											}

										</div>
									</div>
								}
							</React.Fragment>
						) : (
							<React.Fragment>
								{
									product.dealer.list && (
										<div className="info-dealers" style={{ marginTop: '1rem' }}>
											<button className="dealers-sum" type="button" onClick={() => { vm.setState({ showDealers: !vm.state.showDealers }) }}><strong>Bu aracı satın alabileceğiniz yetkili bayiler ({product.dealer.list.length}):</strong> </button>
											<Collapse className="dealers-wrap" open={vm.state.showDealers}>
												<ul className="dealers-list">
													{product.dealer.list.map((dealerLoc, nth) => (
														<React.Fragment key={nth}>
															{
																(dealerLoc) && (
																	<React.Fragment>
																		<li className="list-cost" key={nth} style={{ paddingTop: nth === 0 ? '' : '0' }}>
																			<div className="info-dealers" style={{ width: '100%', padding: '0' }}>
																				<button onClick={() => { vm.setState({ selectedBranch: dealerLoc, showDealers: !vm.state.showDealers }) }}>{dealerLoc.title}</button>
																			</div>
																		</li>

																	</React.Fragment>
																)

															}
														</React.Fragment>
													))}
												</ul>
											</Collapse>
											<React.Fragment>
												{
													selectedBranch && (
														<div className="info-dealer">
															<div className="dealer-head">
																<Image className="dealer-image" bg src={product.dealer.image} />
																<div className="head-content">
																	<Link href="branch" params={{ id: selectedBranch.id, slug: selectedBranch.url }}>
																		{selectedBranch.validated ?
																			<span className="dealer-badge"><i className="badge-bg icon-ribbon"></i><i className="badge-icon icon-check" ></i></span>
																			:
																			false
																		}
																		<strong className="dealer-title">{selectedBranch.title}</strong>
																	</Link>
																	<p className="dealer-info">
																		<span className="info-location">{selectedBranch.location}</span>
																		<span className={"info-workinghours " + (selectedBranch.open ? 'open' : 'closed')}>
																			{selectedBranch.workingHours}
																			<span>|</span>
																			{(selectedBranch.open ? 'Şu an açık' : 'Şu an kapalı')}
																		</span>
																	</p>
																</div>
															</div>
															{selectedBranch.rep &&
																<div className="dealer-rep">
																	<Image src={selectedBranch.rep.image ? selectedBranch.rep.image : image_avatar} className="rep-image" />
																	<strong className="rep-title">{selectedBranch.rep.name}</strong>
																	<span className="rep-role">{selectedBranch.rep.role}</span>
																</div>
															}
															<div className="dealer-controls">
																{
																	selectedBranch.phone && (
																		<Btn
																			tag="a"
																			icon="phone"
																			block uppercase
																			onClick={()=>{
																				GA.send('conversion', {
																					action: 'callDealer',
																				});
																			}}
																			href={"tel:+9" + selectedBranch.phone.replace(' ', '')}>
																			{selectedBranch.phone}
																		</Btn>
																	)

																}

																{
																	product.messageThreadId ? <Btn icon="envelope" text uppercase block tag="a" href={`/hesabim/mesajlarim/mesaj/${product.messageThreadId}`}>Mesajlara Git</Btn> : <Btn icon="envelope" text uppercase block onClick={() => openModal('message', { advert: product, dealer: selectedBranch })}>Mesaj Gönder</Btn>
																}

															</div>
														</div>
													)
												}
											</React.Fragment>
										</div>
									)

								}
							</React.Fragment>
						)
				}
				{!vm.props.mobile && <DetailCredit product={product} mobile={vm.props.mobile} />}

			</div>
		)
	}
}

class DetailExtras extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			expandDesc: false,
			expandableDesc: false,
			expandSpecs: false,
			expandableSpecs: false,
			activeTab: false,
		}

		this.descWrap = React.createRef();
		this.specsWrap = React.createRef();
		this.galleryWrap = React.createRef();

		this.checkSizes = this.checkSizes.bind(this);

		this.sizeLimit = 39.6;
	}

	componentDidMount() {
		this.checkSizes();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.activeTab !== this.state.activeTab) {
			this.checkSizes();
		}

		if (prevProps.mobile !== this.props.mobile) {
			this.checkSizes();
		}
	}

	checkSizes() {
		if (this.descWrap.current) {
			this.setState({ expandableDesc: (this.props.mobile ? false : (this.descWrap.current.offsetHeight > remToPx(this.sizeLimit))) });
		}
		if (this.specsWrap.current) {
			this.setState({ expandableSpecs: (this.props.mobile ? false : (this.specsWrap.current.offsetHeight > remToPx(this.sizeLimit))) });
		}
	}

	render() {
		let vm = this;
		let product = vm.props.product;
		let GalleryContainer = (vm.props.mobile ? 'div' : Slider);
		let galleryProps = (vm.props.mobile ? {} : { scrollBar: true, horizontal: true, ref: vm.galleryWrap });

		return (
			<div className="content-details">
				<Tabs className="details-tabs" onChange={(tab) => { vm.setState({ activeTab: tab }) }}>
					{product.description &&
						<div label="Bayi Notu" index="description">
							<div className="tabs-tab">
								<div className={"tab-content" + (vm.state.expandableDesc ? ' expandable' : '') + (vm.state.expandDesc ? ' expanded' : '')}>
									<div className="content-innerwrap" ref={vm.descWrap}>
										<div className="tab-textarea wysiwyg">
											{parse(nl2br(product.description))}
										</div>
									</div>
								</div>
								{vm.state.expandableDesc &&
									<Btn className="tab-expand" uppercase block hollow low smallIcon dark rightIcon={(vm.state.expandDesc ? 'angle-up' : 'angle-down')} onClick={() => { vm.setState({ expandDesc: !vm.state.expandDesc }) }}>{(vm.state.expandDesc ? 'Gizle' : 'Devamını Gör')}</Btn>
								}
							</div>
						</div>
					}
					{product.technicalSpecs &&
						<div label="Teknik Özellikler" index="techspecs">
							<div className="tabs-tab">
								<div className={"tab-content" + (vm.state.expandableSpecs ? ' expandable' : '') + (vm.state.expandSpecs ? ' expanded' : '')}>
									<div className="content-innerwrap" ref={vm.specsWrap}>
										<div className="tab-specslist">
											{product.technicalSpecs.map((group, nth) => (
												<div className="specslist-group" key={nth}>
													<h3 className="group-title">{group.title}</h3>
													<table className="group-table table">
														<tbody>
															{group.specs.map((spec, nth) => (
																<tr key={nth}>
																	<th>{spec.label}</th>
																	<td>{spec.content}</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											))}
										</div>
									</div>
								</div>
								{vm.state.expandableSpecs &&
									<Btn className="tab-expand" uppercase block hollow low smallIcon dark rightIcon={(vm.state.expandDesc ? 'angle-up' : 'angle-down')} onClick={() => { vm.setState({ expandSpecs: !vm.state.expandSpecs }) }}>{(vm.state.expandSpecs ? 'Gizle' : 'Devamını Gör')}</Btn>
								}
							</div>
						</div>
					}
					{product.pressGallery &&
						<div label="Basın Fotoğrafları" index="pressgallery">
							<div className="tabs-tab">
								<GalleryContainer className="tab-gallery" {...galleryProps} >
									{product.pressGallery.map((image, nth) => (
										<div className="gallery-item" key={nth}>
											<button type="button" className="item-btn">
												<Image src={image.thumb} className="item-image" onLoad={() => { if (vm.galleryWrap.current) { vm.galleryWrap.current.update() } }} />
											</button>
										</div>
									))}
								</GalleryContainer>
							</div>
						</div>
					}
					{vm.props.mobile &&
						<div label="Benzer Araçlar" index="similar">
							<div className="tabs-tab">
								<div className="tab-related">
									{
										product && <DetailRelated postId={product.id} />
									}
								</div>
							</div>
						</div>
					}

				</Tabs>
				{vm.props.mobile &&
					<DetailCredit product={product} mobile={vm.props.mobile} />
				}
			</div>
		)
	}
}

class DetailCredit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			garantiInterest: "1.39",
			garantiInstallment: false,
			isbankInterest: "1.39",
			isbankInstallment: false,
			productPrice: this.props.product.price ? this.props.product.price : 500000,
			loading: false,
			error: false,
			month: 36,
			amount: false,
		}
		this.calculateInstallments = this.calculateInstallments.bind(this)
	}
	calculateInstallments() {
		this.setState({ loading: true, error: false })
		let credit = document.getElementById('creditAmount').value.replace('.', '');
		let month = document.getElementById('creditDuration').value;
		let interestGaranti = this.state.garantiInterest / 100 * 1.2;
		let interestIsbank = this.state.isbankInterest / 100 * 1.2;
		let installmentsGaranti = credit * (interestGaranti * Math.pow((1 + interestGaranti), month)) / (Math.pow(1 + interestGaranti, month) - 1)
		let installmentsIsbank = credit * (interestIsbank * Math.pow((1 + interestIsbank), month)) / (Math.pow(1 + interestIsbank, month) - 1)
		this.setState({
			loading: false, error: false,
			month: month,
			amount: formatNumber(Math.round(credit * 100) / 100, { showDecimals: false }),
			//garantiInstallment: parseFloat(installments).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
			//garantiInstallment: parseFloat(Math.round(installments * 100) / 100).toFixed(2)
			garantiInstallment: formatNumber(Math.round(installmentsGaranti * 100) / 100, { showDecimals: true }),
			isbankInstallment: formatNumber(Math.round(installmentsIsbank * 100) / 100, { showDecimals: true })
		});
	}

	componentDidMount() {

		this.calculateInstallments();
	}

	render() {
		let vm = this;

		return (
			<div className="detail-info">
				<div className="info-credit-calculation">
					<h2>KREDİ HESAPLAMA</h2>
					<p>Kredi tutarı aracın fiyatına göre otomatik olarak hesaplanır.</p>
					<InputForm className="section contentpage-form grid-container" onSubmit={this.calculateInstallments}>
						<div className="grid-row">
							<div className="grid-col x5 m-x6">
								<FormInput
									id="creditAmount"
									placeholder="Kredi tutarı"
									className="credit-price currency-after"
									value={this.state.productPrice ? parseInt(this.state.productPrice / 2, 10).toString() : 50000}
									validation={{
										required: "Bir tutar girmelisiniz.",
										minNum: ["En az 5.000TL girebilirsiniz.", 5000],
										maxNum: ["En fazla 500.000TL girebilirsiniz.", 500000],
									}}
									name="credit_amount"
									mask="1++++++++++++++"
									disabled={vm.state.loading}
									formatNumber
									type="number" />
							</div>
							<div className="grid-col x3 m-x6 no-padding">
								<FormInput
									id="creditDuration"
									placeholder="Vade"
									className="credit-price month-after"
									value="36"
									validation={{
										required: "Bir vade girmelisiniz.",
										minNum: ["En az 12 ay seçebilirsiniz.", 12],
										maxNum: ["En fazla 60 ay seçebilirsiniz.", 60],
									}}
									name="credit_duration"
									mask="1+"
									disabled={vm.state.loading}
									formatNumber
									type="number" />
							</div>
							<div className="grid-col x4 m-x12 center">
								<Btn
									type="submit"
									uppercase
									block
									disabled={vm.state.loading}
									status={this.state.submitting && 'loading'}
									//onClick={() => {  }}
									className="form-submitbtn">
									HESAPLA
								</Btn>
							</div>
						</div>
					</InputForm>
				</div>
				<div className="info-credit-results">
					<table className="table listprices-table">
						<thead>
							<tr>
								<th>Taksit</th>
								<th><div className="tablePad">Faiz</div></th>
								<th>Banka</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							<tr>
								<td>{this.state.garantiInstallment} TL</td>
								<td>
									<div className="tablePad">%{this.state.garantiInterest.replace('.', ',')}</div>
								</td>
								<td><img src={image_garanti} alt="" width="121" /></td>
								<td>
									<Btn
										type="submit"
										uppercase
										block
										disabled={this.state.submitting}
										status={this.state.submitting && 'loading'}
										onClick={() => openModal('garanti', { advert: vm.props.product, installment: this.state.garantiInstallment, interest: this.state.garantiInterest, month: this.state.month, amount: this.state.amount })}
										//onClick={() => { window.open('https://www.garantibbva.com.tr/tr/bireysel/krediler/tasit-arac-kredisi-hesaplama.page?cid=oth:oth:oth:bireysel-hedeffilotasitkredisi:tasitkredisi::::::375x400:oth', '_blank'); }}
										className="form-submitbtn">
										{vm.props.mobile ? (<i className="icon-new-tab"></i>) : <i className="icon-new-tab"></i>}
									</Btn>
								</td>
							</tr>
							{/*<tr>
								<td>{this.state.isbankInstallment} TL</td>
								<td>
									<div className="tablePad">%{this.state.isbankInterest.replace('.', ',')}</div>
								</td>
								<td><img src={image_isbank} alt="" height="50" /></td>
								<td>
									<Btn
										type="submit"
										uppercase
										block
										disabled={this.state.submitting}
										status={this.state.submitting && 'loading'}
										onClick={() => { window.open('https://www.isbank.com.tr/TR/bireysel/krediler/kredi-hesaplama/Sayfalar/kredi-hesaplama.aspx?gclid=EAIaIQobChMIzcmbhZr45AIVRs-yCh0HgA-EEAAYASAAEgK1NfD_BwE#Taksit_tasit', '_blank'); }}
										className="form-submitbtn">
										{vm.props.mobile ? (<i className="icon-new-tab"></i>) : 'BAŞVUR'}
									</Btn>
								</td>
							</tr>*/}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}

class DetailRelated extends React.Component {
	render() {
		return (
			<Listing
				className="related-listing"
				urlBinding={false}
				filters={false}
				topSection={false}
				GAGroup="Benzer İlanlar"
				source={`car-posts/detail/${this.props.postId}/similar`}
				//source="/dummy/data/detail-related.json"
				query={this.props.postId} size={5} showAds={false} />
		)
	}
}

class DetailTopInfo extends React.Component {
	render() {
		let product = this.props.product;

		return (
			<div className="section detail-topinfo">
				{(product.highlights && !this.props.mobile) &&
					<ul className="topinfo-highlights">
						{product.highlights.map((highlight, nth) => (
							<React.Fragment key={nth}>
								{
									highlight.label && (
										<li key={nth} title={highlight.title}>{(highlight.image ?
											<Image alt={highlight.title} src={`/dummy/images/${highlight.image}`} />
											:
											<span>{highlight.label}</span>
										)}</li>
									)
								}
							</React.Fragment>


						))}
					</ul>
				}
				<div className="topinfo-id">
					<strong>İlan No:</strong> {product.postNo}
				</div>
				{this.props.mobile &&
					<div className="topinfo-controls">
						<button className="controls-btn" onClick={() => openModal('share')}><i className="icon-share"></i></button>
						<FavBtn className="controls-btn" faved={product.favorited} type="post" id={product.id}></FavBtn>
					</div>
				}
			</div>
		)
	}
}