import React from 'react'
// Partials
import Image from 'components/partials/image'
import Loader from 'components/partials/loader'
import Link from 'components/partials/link'
import ContentBox from 'components/partials/contentbox'
import {FormInput, InputForm} from 'components/partials/forms'
// Deps
import request from 'controllers/request'
import history from 'controllers/history'
import {redirect} from 'controllers/navigator'
import {serializeArray, storageSpace} from 'functions/helpers'
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
			//let category = window.location.pathname.split('/')[2];
			let category = history.location.search.split('=')[1];
			vm.setState({ results: false });

			let params = {}
			let endpoint = "articles";

			if (category) {
				if (category === 'arama&key') {
					let searchParam = history.location.search.split('=')[2];
					params.search = vm.props.match;
					endpoint = `articles/search?search=${searchParam}`

				}
				else if (category === 'son-eklenenler') {
					endpoint = `articles/recently`

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
		redirect('blog', null, { kategori: 'arama', key: formData.search });
	}

	render() {
		let categories = this.state.categories;
		let results = this.state.results;
		console.log(this.props);

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
										<Link href="blog" query={{ kategori: 'son-eklenenler' }}>
											SON EKLENENLER
										</Link>
									</div>
									{categories.map((category, nth) => (
										<div className="nav-item" key={nth}>
											<Link href="blog" query={{ kategori: category.slug }}>
												{category.title}
											</Link>
										</div>
									))}
								</nav>

								<InputForm className="controls-search" onSubmit={this.makeSearch}>
									<label>
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
											className="search-input"/>
									</label>
									<button type="submit" className="search-submit" aria-label="search-icon">
										<i className="icon-search"/>
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
