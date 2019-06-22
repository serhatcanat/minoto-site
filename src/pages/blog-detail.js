import React from 'react'

// Partials
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import ContentBox from 'components/partials/contentbox'
import Responsive from 'components/partials/responsive'
import Breadcrumbs from 'components/partials/breadcrumbs'

// Deps
import request from 'controllers/request'
import { redirect } from 'controllers/navigator'
import parse from 'html-react-parser';
import { storageSpace } from 'functions/helpers'

// Assets
import image_icon_facebook from 'assets/images/icon/facebook.svg'
import image_icon_instagram from 'assets/images/icon/instagram.svg'
import image_icon_youtube from 'assets/images/icon/youtube.svg'
import image_icon_twitter from 'assets/images/icon/twitter.svg'
import image_icon_whatsapp from 'assets/images/icon/whatsapp.svg'
import image_icon_link from 'assets/images/icon/link.svg'

export default class BlogDetail extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			blogData: false
		}
	}

	componentDidMount() {
		let vm = this;

		request.get(`articles/${vm.props.match.params.slug}`, { slug: vm.props.match.params.slug }, function (payload, status) {
			if (payload) {
				vm.setState({
					blogData: payload
				});
			}
			else {
				redirect('notfound');
			}
			console.log(payload)
		});
	}

	render() {
		let data = this.state.blogData;

		return (
			<main className="page blog-detail loader-container">
				<Loader loading={!data} strict />
				{data &&
					<section className="section blog-detail">
						<Image className="detail-image" src={storageSpace('articles', data.image)} mobile={storageSpace('articles', data.mobileImage)} />

						<Responsive type="only-web">
							<Breadcrumbs className="detail-breadcrumbs" standalone>
								<Link href="blog">Blog</Link>
								<Link href="blog" params={{ action: data.tags[0].tagSlug }}>{data.tags[0].tag}</Link>
							</Breadcrumbs>
						</Responsive>

						<div className="detail-wrap wrapper narrow">
							<div className="detail-meta">
								<span className="meta-date">
									{data.userTwitterUsername ? (<a style={{ color: '#1da1f2' }} href={`https://twitter.com/${data.userTwitterUsername}`} target="_blank" rel="noopener noreferrer"><i className="icon-twitter"></i> {data.user} </a>) : data.user}


									@ {data.date}
								</span>
							</div>

							<Responsive type="only-web">
								<Sharer title={data.title} />
							</Responsive>
							<div className="detail-content">
								<div className="content-text wysiwyg">
									<h1 className="text-title">{data.title}</h1>
									{parse(data.content)}
								</div>
							</div>
						</div>
						{(data.relevant && data.relevant.length) &&
							<aside className="detail-relevant">
								<strong className="relevant-title">Diğer Haberler</strong>

								<div className="wrapper narrow">
									<ul className="relevant-items">
										{data.relevant.map((article, nth) => (
											<li className="relevant-item" key={nth}>
												<ContentBox
													type="blogpost"
													pretitle={article.date}
													title={article.title}
													image={article.image}
													url="blogDetail"
													urlParams={{ slug: article.slug }}
												/>
											</li>
										))}
									</ul>
								</div>
							</aside>
						}
					</section>
				}
			</main>
		)
	}
}

class Sharer extends React.Component {
	render() {
		return (
			<div className="detail-sharer">
				<strong className="sharer-title">Paylaş</strong>

				<ul className="sharer-opts">
					<li className="opts-item">
						<Link type="a" className="sharer-link facebook" href={"https://www.facebook.com/sharer/sharer.php?u=" + window.location.href} target="_blank">
							<Image src={image_icon_facebook} alt="Facebook" />
						</Link>
					</li>
					<li className="opts-item">
						<Link type="a" className="sharer-link twitter" href={"http://www.instagram.com/"} target="_blank">
							<Image src={image_icon_instagram} alt="Instagram" />
						</Link>
					</li>
					<li className="opts-item">
						<Link type="a" className="sharer-link twitter" href={"http://www.youtube.com/"} target="_blank">
							<Image src={image_icon_youtube} alt="YouTube" />
						</Link>
					</li>
					<li className="opts-item">
						<Link type="a" className="sharer-link twitter" href={"http://twitter.com/share?text=" + this.props.title + "&url=" + window.location.href + "&hashtags=minoto,sifirarac"} target="_blank">
							<Image src={image_icon_twitter} alt="Twitter" />
						</Link>
					</li>
					<li className="opts-item">
						<Link type="a" className="sharer-link icon email" href={"mailto:?subject=Bak Minoto'da Ne Buldum!&body=" + this.props.title + window.location.href} target="_blank">
							<i className="icon-envelope"></i>
						</Link>
					</li>
					<li className="opts-item">
						<Link type="a" className="sharer-link twitter" href={"http://www.google.com/"} target="_blank">
							<Image src={image_icon_link} alt="Link Kopyala" />
						</Link>
					</li>
					<li className="opts-item">
						<Link type="a" className="sharer-link whatsapp" href={"whatsapp://send?text=" + window.location.href} data-action="share/whatsapp/share" target="_blank">
							<Image src={image_icon_whatsapp} alt="WhatsApp" />
						</Link>
					</li>
				</ul>
			</div>
		)
	}
}