import React from 'react'

// Partials
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import ContentBox from 'components/partials/contentbox'
import Breadcrumbs from 'components/partials/breadcrumbs'
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import request from 'controllers/request'
import history from 'controllers/history'
import { redirect } from 'controllers/navigator'
import { serializeArray } from 'functions/helpers'
import parse from 'html-react-parser';

// Assets
import image_blog_bg  from 'assets/images/blog-bg.svg'

export default class BlogDetail extends React.Component {
	constructor(props) {
		super(props)
		
		this.state = {
			blogData: false
		}
	}

	componentDidMount() {
		let vm = this;

		request.get('/dummy/data/blog-detail.json', {slug: vm.props.match.params.slug}, function(payload, status){
				console.log(payload);
			if(payload){
				vm.setState({
					blogData: payload
				});
			}
			else {
				redirect('notfound');
			}
		});
	}

	render () {
		let data = this.state.blogData;

		return (
			<main className="page blog-detail loader-container">
				<Loader loading={!data} strict />
				{data &&
					<section className="section blog-detail">
						<Image className="detail-image" src={data.image} />

						<Breadcrumbs className="detail-breadcrumbs" standalone>
							<Link href="blog">Blog</Link>
							<Link href="blog" params={{ action: data.categorySlug }}>{data.category}</Link>
						</Breadcrumbs>

						<div className="wrapper narrower">
							<div className="detail-content wysiwyg">
								<h1 className="content-title">{data.title}</h1>
								{parse(data.content)}
							</div>
						</div>
					</section>
				}
			</main>
		)
	}
}