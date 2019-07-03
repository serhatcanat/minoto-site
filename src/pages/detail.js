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

// Deps
//import { ListingLink } from 'controllers/navigator'
import { redirect } from 'controllers/navigator'
import { openModal } from "functions/modals"
import { blockOverflow, nl2br, remToPx } from 'functions/helpers.js'
import parse from 'html-react-parser'
import { connect } from "react-redux"
import request from 'controllers/request'
import { setTitle, setDescription, setHead } from 'controllers/head'
import { storageSpace } from "functions/helpers"

// Assets
import image_avatar from 'assets/images/defaults/avatar.svg';
import image_loader from 'assets/images/minoto-loading.gif'

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
		if (user !== prevProps.user) {
			this.initialize()
		}

		if (prevProps.match.params.id !== this.props.match.params.id) {
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
			request.get(`car-posts/${vm.props.match.params.id}/${vm.props.match.params.slug}`, { id: vm.props.match.params.id, email: this.props.user.email }, function (payload, status) {
				//request.get('/dummy/data/detail.json', { id: vm.props.match.params.id }, function (payload, status) {
				if (payload) {
					vm.setState({
						productData: payload
					})

					setTitle(payload.title);

					if (payload.description) {
						setDescription(payload.description);
					};

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
					redirect('notfound');
				}
			}, { excludeApiPath: false });
		}
	}

	setFullScreen(state) {
		if (this.mounted) {
			this.setState({ galleryFullScreen: state });
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
											"href": "/",
											"title": "Anasayfa"
										},
										{
											"href": `/arama/${product.breadCrumbs[0].value}`,
											"title": product.breadCrumbs[0].title
										},
										{
											"href": `/arama/${product.breadCrumbs[0].value}/${product.breadCrumbs[1].value}`,
											"title": product.breadCrumbs[1].title
										},
										{
											"href": `/arama/${product.breadCrumbs[0].value}/${product.breadCrumbs[1].value}/${product.breadCrumbs[2].value}`,
											"title": product.breadCrumbs[2].title
										},
										{
											"href": null,
											"title": product.title
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
										<DetailRelated postId={product.id} mobile={vm.props.mobile} />
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
													image={storageSpace('articles', ad.image)}
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

export default connect(mapStateToProps)(Detail);

class DetailGallery extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			activeImage: 0,
			fullScreen: false,
		}

		this.mainSlider = React.createRef();
		this.thumbSlider = React.createRef();
		this.imageChange = this.imageChange.bind(this);
		this.keyPress = this.keyPress.bind(this);
	}

	componentDidMount() {
		document.addEventListener('keydown', this.keyPress);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.keyPress);
	}

	componentDidUpdate(prevProps, prevState) {
		const nth = this.state.activeImage;
		if (this.mainSlider.current.instance.realIndex !== nth) {
			this.mainSlider.current.instance.slideToLoop(nth);
		}

		if (this.thumbSlider.current && this.thumbSlider.current.instance.realIndex !== nth) {
			this.thumbSlider.current.instance.slideTo(nth);
		}

		if (prevProps.fullScreen !== this.props.fullScreen) {
			this.mainSlider.current.instance.update();
			if (this.thumbSlider.current) {
				this.thumbSlider.current.instance.update();
			}

			blockOverflow(this.props.fullScreen);
		}
	}

	imageChange(nth) {
		this.setState({ activeImage: nth });
	}

	keyPress(e) {
		if (this.mainSlider.current) {
			switch (e.key) {
				case "ArrowLeft":
					this.mainSlider.current.prev();
					break;
				case "ArrowRight":
					this.mainSlider.current.next();
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
				<Btn className="gallery-close" low white uppercase icon="close" onClick={() => { vm.props.onFullScreenChange(false) }}>
					Kapat
				</Btn>
				<div className="gallery-mainslider">
					<button className="mainslider-nav prev" onClick={() => { vm.mainSlider.current.prev(); }}><i className="icon-angle-left"></i></button>
					<button className="mainslider-nav next" onClick={() => { vm.mainSlider.current.next(); }}><i className="icon-angle-right"></i></button>
					<Slider className="mainslider-slider" ref={vm.mainSlider} loop opts={{ lazy: true }} onChange={vm.imageChange}>
						{images.map((image, nth) => (
							<div className="slider-imagewrap" key={nth}>
								<div className="imagewrap-image swiper-lazy" data-background={storageSpace('car-posts/gallery', image.medium)}>
								</div>
								<Image className="imagewrap-loader" width="100" bg src={image_loader} alt="Yükleniyor..." />
							</div>
						))}
					</Slider>
					{!vm.props.mobile &&
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
									<Image className="carousel-image" key={nth} bg src={storageSpace('car-posts/gallery', image.thumb)} alt={product.title} />
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
		}
	}

	render() {
		let vm = this;
		let product = vm.props.product;

		return (
			<div className="detail-info">
				<h1 className="info-title">{product.title}</h1>
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
											<Image alt={highlight.title} src={highlight.image} />
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
					{(product.listingPrice && product.price > 0) &&
						<div className={"price-listing" + ((product.listingPrice > product.price) ? ' higher' : '')}>
							<strong>Liste Fiyatı:</strong> <span style={{ textDecoration: parseInt(product.listingPrice, 10) > parseInt(product.price, 10) ? 'line-through' : 'none' }}><PriceTag stroke={parseInt(product.listingPrice, 10) > parseInt(product.price, 10) ? true : false} price={parseInt(product.listingPrice, 10) > parseInt(product.price, 10) ? product.listingPrice : product.price} /></span>
						</div>
					}
				</div>

				{product.costs.expenses.length &&
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
						{(vm.props.mobile && product.dealer.phone) && <a className="controls-phone" href={"tel:+9" + product.dealer.phone.replace(' ', '')}><i className="icon-phone-nude"></i></a>}
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
					product.dealer &&
					<div className="info-dealer">
						<div className="dealer-head">
							<Link href="branch" params={{ id: product.dealer.id, slug: product.dealer.url }}>
								{product.dealer.validated ?
									<span className="dealer-badge"><i className="badge-bg icon-ribbon"></i><i className="badge-icon icon-check"></i></span>
									:
									false
								}
								<strong className="dealer-title">{product.dealer.title}</strong>
							</Link>
							<p className="dealer-info">
								<span className="info-location">{product.dealer.location}</span>
								<span className={"info-workinghours " + (product.dealer.open ? 'open' : 'closed')}>
									{product.dealer.workingHours}
									<span>|</span>
									{(product.dealer.open ? 'Şu an açık' : 'Şu an kapalı')}
								</span>
							</p>
						</div>
						{product.dealer.rep &&
							<div className="dealer-rep">
								<Image src={product.dealer.rep.image ? product.dealer.rep.image : image_avatar} className="rep-image" />
								<strong className="rep-title">{product.dealer.rep.name}</strong>
								<span className="rep-role">{product.dealer.rep.role}</span>
							</div>
						}
						<div className="dealer-controls">
							<Btn tag="a" icon="phone" block uppercase href={"tel:+9" + product.dealer.phone.replace(' ', '')}>{product.dealer.phone}</Btn>
							{
								product.messageThreadId ? <Btn icon="envelope" text uppercase block tag="a" href={`/hesabim/mesajlarim/mesaj/${product.messageThreadId}`}>Mesajlara Git</Btn> : <Btn icon="envelope" text uppercase block onClick={() => openModal('message', { advert: product })}>Mesaj Gönder</Btn>
							}

						</div>
					</div>
				}
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
									<DetailRelated postId={product.id} />
								</div>
							</div>
						</div>
					}
				</Tabs>
			</div>
		)
	}
}

class DetailRelated extends React.Component {
	render() {
		return (
			<Listing className="related-listing" urlBinding={false} filters={false} topSection={false}
				source={`car-posts/detail/${this.props.postId}/similar`}
				//source="/dummy/data/detail-related.json"
				query="id=1234" size={5} showAds={false} />
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
											<Image alt={highlight.title} src={highlight.image} />
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