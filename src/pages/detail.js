import React from 'react'

// Sections
import Listing from 'components/sections/listing'
import SubscriptionBar from 'components/sections/subscriptionbar'

// Partials
import Breadcrumbs from 'components/partials/breadcrumbs'
import Loader from 'components/partials/loader'
import Image from 'components/partials/image'
import Btn from 'components/partials/btn'
import PopInfo from 'components/partials/popinfo.js';
import Collapse from 'components/partials/collapse.js';
import Slider from 'components/partials/slider.js';
import Tabs from 'components/partials/tabs.js';
import Link from 'components/partials/link.js';

// Deps
import { ListingLink } from 'controllers/navigator'
import { openModal } from "functions/modals";
import { formatNumber, blockOverflow } from 'functions/helpers.js';
import parse from 'html-react-parser';
import axios from 'axios';
import { setTitle } from 'controllers/head'

// Assets
import image_avatar from 'assets/images/defaults/avatar.svg';

export default class Detail extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			productData: false,
			loading: true,
			showCosts: false,
		}

		this.initialize = this.initialize.bind(this);
	}

	initialize() {
		let vm = this;
		axios.get('/dummy/data/detail.json?id='+vm.props.match.params.id).then(res => {
			if(res.data.status === 'ok'){
				vm.setState({
					productData: res.data.info
				})

				setTitle(res.data.info.title);
			}
			else {
				console.log('error');
			}
		})
	}

	componentDidMount() {
		this.initialize();
	}

	render () {
		let vm = this;
		let product = vm.state.productData;
		return (
			<main className="page detail">
			<Loader loading={product === false} strict={true} />
			{product !== false &&
				<div>
					<section className="section detail-top">
						<div className="top-wrap wrapper">
							<Breadcrumbs className="top-breadcrumbs" data={[
								{
									"href": ListingLink([{ 'key': 'tip', 'val': 'otomobil' }]),
									"title": "Otomobil"
								},
								{
									"href": ListingLink([
										{ 'key': 'tip', 'val': 'otomobil' },
										{ 'key': 'marka', 'val': 'audi' },
									]),
									"title": "Audi"
								},
								{
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
								}
							]} />

							<div className="top-controls">
								{(product.activeViewers && product.activeViewers > 0) &&
									<span className="controls-viewers">{product.activeViewers} kişi bakıyor</span>
								}
								<span className="controls-date">{product.date}</span>
								<button className="controls-btn"><i className="icon-heart-empty"></i> Favorilere Ekle</button>
								<button className="controls-btn"><i className="icon-compare"></i> Karşılaştır (3)</button>
								<button className="controls-btn" onClick={() => openModal('share')}><i className="icon-share"></i> Paylaş</button>
							</div>
						</div>
					</section>

					<section className="section detail-content">
						<div className="content-wrap wrapper">
							<div className="content-left">
								<DetailGallery product={product} />
								<DetailInfo product={product} />
							</div>

							<div className="content-right">
								<div className="content-topinfo">
									{product.highlights && 
										<ul className="topinfo-highlights">
										{product.highlights.map((highlight, nth) => (
											<li key={nth} title={highlight.title}>{(highlight.image ?
												<Image alt={highlight.title} src={highlight.image} />
												:
												<span>{highlight.label}</span>
											)}</li>
										))}
										</ul>
									}
									<div className="topinfo-id">
										<strong>İlan No:</strong> {product.id}
									</div>
								</div>
								<h1 className="content-title">{product.title}</h1>
								{(product.mainFeatures && product.mainFeatures.length) &&
									<ul className="content-mainfeatures">
									{product.mainFeatures.map((feature, nth) => (
										<li key={nth}>
											<span title={feature.title+': '+feature.label}>
												{feature.icon && <i className={"icon-" + feature.icon}></i>}
												<label>{feature.label}</label>
											</span>
										</li>
									))}
									</ul>
								}
								{product.ncap &&
									<div className="content-ncap">
										<strong title="Euro NCAP Puanı">NCAP</strong>
										<div className="ncap-stars" title={product.ncap + ' Yıldız'}>
											<i className={"icon-star" + (product.ncap >=1 ? ' active' : '')}></i>
											<i className={"icon-star" + (product.ncap >=2 ? ' active' : '')}></i>
											<i className={"icon-star" + (product.ncap >=3 ? ' active' : '')}></i>
											<i className={"icon-star" + (product.ncap >=4 ? ' active' : '')}></i>
											<i className={"icon-star" + (product.ncap >=5 ? ' active' : '')}></i>
										</div>
									</div>
								}

								<div className="content-price">
									<strong className="price-current">
										{formatNumber(product.price)} TL
									</strong>
									{product.listingPrice && 
										<div className="price-listing">
											<strong>Liste Fiyatı:</strong> <span>{formatNumber(product.listingPrice)}</span>
										</div>
									}
								</div>

								{product.costs &&
									<div className="content-costs">
										<button className="costs-sum" type="button" onClick={() => {vm.setState({showCosts: !vm.state.showCosts})}}><strong>Bu aracın yıllık kullanım maliyeti:</strong> 3590 TL</button>
										<Collapse className="costs-wrap" open={vm.state.showCosts}>
											<ul className="costs-list">
												{product.costs.expenses.map((cost, nth) => (
													<li className="list-cost" key={nth}>
														<strong>{cost.title}</strong>
														<span className="cost-num">{formatNumber(cost.cost)} TL</span>
													</li>
												))}
												<li className="list-cost total">
													<strong>
														Toplam
														<PopInfo className="cost-info" content="İstanbul Sanayi Odası'ndan alınmıştır" nowrap>
															<i className="icon-question"></i>
														</PopInfo>
													</strong>
													<span className="cost-num">{formatNumber(product.costs.total)} TL</span>
												</li>
											</ul>
										</Collapse>
									</div>
								}

								<div className="content-controls">
									<div className="controls-buttons">
										<Btn className="controls-button" primary hollow uppercase note="Bu aracı rezerve edebilirsiniz" disabled={product.reserved}>
											Rezerve Et
										</Btn>
										<Btn className="controls-button" primary uppercase note="Bu araç için teklif verebilirsiniz">
											Teklif Ver
										</Btn>
									</div>

									{(product.reserved && product.reservationEndDate) &&
										<span className="controls-note">{product.reservationEndDate}'a kadar rezerve edilmiştir.</span>
									}
								</div>

								{product.dealer &&
									<div className="content-dealer">
										<div className="dealer-head">
											<Link href={product.dealer.url}>
												{product.dealer.validated && 
													<span className="dealer-badge"><i className="badge-bg icon-ribbon"></i><i className="badge-icon icon-check"></i></span>
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
											<Btn type="a" icon="phone" block uppercase href={"tel:+9"+product.dealer.phone.replace(' ', '')}>{product.dealer.phone}</Btn>
											<Btn type="link" icon="envelope" text uppercase block href={'/user/message/todealer/'+product.dealer.id}>Mesaj Gönder</Btn>
										</div>
									</div>
								}
							</div>
						</div>
					</section>

					<section className="section detail-related">
						<div className="wrapper">
							<div className="related-innerwrap">
								<h2 className="related-title">Benzer araçlar</h2>
								<Listing urlBinding={false} filters={false} source="/dummy/data/detail-related.json" query="id=1234" size={5} showAds={false} />
							</div>
						</div>
					</section>

					<SubscriptionBar className="detail-subscription" heading={"Daha fazla "+ product.brand.title +" modelleri için sizi bilgilendirelim!"} />

					{product.ads &&
						<section className="section detail-banners">
							<div className="wrapper">
								{product.ads.map((ad, nth) => (
									<Link type='a' href={ad.url} title={ad.title} key={nth} className={"banners-item x-"+ad.size}>
										<Image src={ad.image} />
									</Link>
								))}
							</div>
						</section>
					}
				</div>
			}
			</main>
		)
	}
}

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
	}

	componentDidUpdate(prevProps, prevState){
		const nth = this.state.activeImage;
		if(this.mainSlider.current.instance.realIndex !== nth){
			this.mainSlider.current.instance.slideToLoop(nth);
		}

		if(this.thumbSlider.current.instance.realIndex !== nth){
			this.thumbSlider.current.instance.slideTo(nth);
		}

		if(prevState.fullScreen !== this.state.fullScreen){
			this.mainSlider.current.instance.update();
			this.thumbSlider.current.instance.update();

			blockOverflow(this.state.fullScreen);
		}
	}

	imageChange(nth){
		this.setState({activeImage: nth});
	}

	render() {
		let vm = this;
		let product = vm.props.product
		let images = product.gallery;
		return (
			<div className={"content-gallery" + (vm.state.fullScreen ? ' fullscreen' : '')}>
				<Btn className="gallery-close" low white uppercase icon="close" onClick={() => { vm.setState({fullScreen: false})}}>
					Kapat
				</Btn>
				<div className="gallery-mainslider">
					<button className="mainslider-nav prev" onClick={() => { vm.mainSlider.current.prev(); }}><i className="icon-angle-left"></i></button>
					<button className="mainslider-nav next" onClick={() => { vm.mainSlider.current.next(); }}><i className="icon-angle-right"></i></button>
					<Slider className="mainslider-slider" ref={vm.mainSlider} loop opts={{lazy: true}} onChange={vm.imageChange}>
						{images.map((image, nth) => (
							<div className="slider-imagewrap" key={nth}>
								<div className="imagewrap-image swiper-lazy" data-background={image.medium}>
								</div>
								<i className="imagewrap-loader icon-spinner"></i>
							</div>
						))}
					</Slider>
					<Btn className="mainslider-fullscreen" low white uppercase icon="search" onClick={() => { vm.setState({fullScreen: true})}}>
						Büyük Fotoğraf
					</Btn>
				</div>
				<div className="gallery-thumbs">
					<button className="thumbs-nav prev" onClick={() => { vm.thumbSlider.current.prev(); }}><i className="icon-angle-left"></i></button>
					<button className="thumbs-nav next" onClick={() => { vm.thumbSlider.current.next(); }}><i className="icon-angle-right"></i></button>
					<Slider className="thumbs-carousel" slides={10} ref={vm.thumbSlider}>
						{images.map((image, nth) => (
							<button type="button" className={"carousel-imagebtn" + (vm.state.activeImage === nth ? ' active' : '')} key={nth} onClick={() => { vm.imageChange(nth); }}>
								<Image className="carousel-image" key={nth} bg src={image.thumb} alt={product.title} />
							</button>
						))}
					</Slider>
				</div>
			</div>
		)
	}
}

class DetailInfo extends React.Component {
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

		this.sizeLimit = 39.6;
	}

	componentDidMount(){
		this.checkSizes();
	}

	componentDidUpdate(prevProps, prevState){
		if(prevState.activeTab !== this.state.activeTab){
			this.checkSizes();
		}
	}

	checkSizes(){
		if(this.descWrap.current){
			this.setState({expandableDesc: (this.descWrap.current.offsetHeight > 39.6)});
		}
		if(this.specsWrap.current){
			this.setState({expandableSpecs: (this.specsWrap.current.offsetHeight > 39.6)});
		}
	}

	render() {
		let vm = this;
		let product = vm.props.product
		return (
			<div className="content-details">
				<Tabs className="details-tabs" onChange={(tab) => { vm.setState({activeTab: tab}) }}>
					{product.description &&
						<div label="Bayi Notu" index="description">
							<div className="tabs-tab">
								<div className={"tab-content" + (vm.state.expandableDesc ? ' expandable' : '') + (vm.state.expandDesc ? ' expanded' : '')}>
									<div className="content-innerwrap" ref={vm.descWrap}>
										<div className="tab-textarea wysiwyg">
											{parse(product.description)}
										</div>
									</div>
								</div>
								{vm.state.expandableDesc &&
									<Btn className="tab-expand" uppercase block hollow low smallIcon dark rightIcon={(vm.state.expandDesc ? 'angle-up' : 'angle-down')} onClick={() => { vm.setState({expandDesc: !vm.state.expandDesc}) }}>{(vm.state.expandDesc ? 'Gizle' : 'Devamını Gör')}</Btn>
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
									<Btn className="tab-expand" uppercase block hollow low smallIcon dark rightIcon={(vm.state.expandDesc ? 'angle-up' : 'angle-down')} onClick={() => { vm.setState({expandSpecs: !vm.state.expandSpecs}) }}>{(vm.state.expandSpecs ? 'Gizle' : 'Devamını Gör')}</Btn>
								}
							</div>
						</div>
					}
					{product.pressGallery &&
						<div label="Basın Fotoğrafları" index="pressgallery">
							<div className="tabs-tab">
								<Slider className="tab-gallery" scrollBar horizontal ref={vm.galleryWrap}>
										{product.pressGallery.map((image, nth) => (
											<div className="gallery-item" key={nth}>
												<button type="button" className="item-btn">
													<Image src={image.thumb} className="item-image" onLoad={() => { vm.galleryWrap.current.update() }} />
												</button>
											</div>
										))}
								</Slider>
							</div>
						</div>
					}
				</Tabs>
			</div>
		)
	}
}