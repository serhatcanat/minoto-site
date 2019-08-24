import React from 'react'

// Partials
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import ContentBox from 'components/partials/contentbox'
import { InputForm, FormInput } from 'components/partials/forms'

// Deps
import request from 'controllers/request'
import history from 'controllers/history'
import { redirect } from 'controllers/navigator'
import { serializeArray, storageSpace } from 'functions/helpers'

// Assets
import image_blog_bg from 'assets/images/blog-bg.svg'
import image_blog_bg_mobile from 'assets/images/blog-bg-mobile.svg'

export default class Blog extends React.Component {
	constructor(props) {

		super(props)

		this.state = {
			loading: true,
			categories: false,
			results: false
		}

		this.initialize = this.initialize.bind(this);
		this.makeSearch = this.makeSearch.bind(this);
		this.listenerAbort = false;
		this.mounted = false;
	}

	componentDidMount() {
		let vm = this;
		vm.mounted = true;
		vm.initialize();


		vm.listenerAbort = history.listen(function (e) {

			vm.initialize();
		});
	}

	componentWillUnmount() {
		this.mounted = false;
		if (this.listenerAbort) {
			this.listenerAbort();
		}
	}

	initialize() {
		let vm = this;
		if (vm.mounted) {
			let category = window.location.pathname.split('/')[2];

			vm.setState({ results: false });

			let params = {}
			let endpoint = "articles";

			if (category) {
				if (category === 'arama') {
					let searchParam = window.location.pathname.split('/')[3];
					params.search = vm.props.match.params.search;
					endpoint = `articles/search?search=${searchParam}`
				}
				else if (category === 'son-eklenenler') {
					endpoint = `articles/recently?record=6`

				}
				else {
					params.category = category;
					endpoint = `${category}/articles`
				}
			}

			request.get(endpoint, null, function (payload, status) {
				if (vm.mounted && payload) {
					vm.setState({
						results: payload,
						loading: false,
					});

				}
			});

			request.get('articles/tags', params, function (payload, status) {
				if (vm.mounted && payload) {
					vm.setState({
						categories: payload,
					});
				}
			});
		}
	}

	makeSearch(e) {
		let formData = serializeArray(e.target);
		redirect('blog', { action: 'arama', search: formData.search });
	}

	render() {
		let categories = this.state.categories;
		let results = this.state.results;


		return (
			<main className="page blog loader-container">
				<Loader loading={this.state.loading} strict />
				<section className="section blog-head">
					<div className="head-wrap wrapper narrow">
						<h1 className="head-title">minoto <strong>blog</strong></h1>
						<Image className="head-bg" src={image_blog_bg} mobile={image_blog_bg_mobile} alt="minoto blog" />

						{categories &&
							<div className="head-controls">
								<nav className="controls-nav">
									<div className="nav-item">
										<Link href="blog" >
											TÜMÜ
										</Link>
									</div>
									<div className="nav-item">
										<Link href="blog" params={{ action: 'son-eklenenler' }}>
											SON EKLENENLER
										</Link>
									</div>
									{categories.map((category, nth) => (
										<div className="nav-item" key={nth}>
											<Link href="blog" params={{ action: category.slug }}>
												{category.title}
											</Link>
										</div>
									))}
								</nav>

								<InputForm className="controls-search" onSubmit={this.makeSearch}>
									<FormInput
										type="text"
										placeholder="Blog'da ara"
										validation={{
											required: true,
											minLength: ['..', 3]
										}}
										name="search"
										hideError
										hideAsterisk
										className="search-input" />
									<button type="submit" className="search-submit">
										<i className="icon-search"></i>
									</button>
								</InputForm>
							</div>
						}
					</div>
				</section>

				{!this.state.loading &&
					<section className="section blog-results loader-container">
						<Loader loading={!results} strict />
						<div className="wrapper narrow">
							{results &&
								<ul className="results-list">
									{results.map((result, nth) => (
										<li className="results-item" key={nth}>
											<ContentBox
												type="blogpost"
												pretitle={result.date}
												title={result.title}
												image={storageSpace('c_scale,q_auto:good,w_400/articles', result.image)}
												url="blogDetail"
												additionsOptional
												urlParams={{ slug: result.slug }}
												wrap={result.title.length > 50 ? true : false}
											/>
										</li>
									))}
								</ul>
							}
							{results && results.length === 0 &&
								<h2 className="results-error">Sonuç bulunamadı.</h2>
							}
						</div>
					</section>
				}
			</main>
		)
	}
}