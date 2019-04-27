module.exports = {
	home: {
		path: "/",
		component: "Home",
		exact: true,
		linkTitle: "Anasayfa",
		title: "Anasayfa"
	},
	sitemap: {
		path: "/sitemap",
		component: "Sitemap",
		exact: true,
		linkTitle: "Site Haritası",
		title: "Site Haritası"
	},
	dealers: {
		path: "/bayiler",
		component: "Dealers",
		exact: true,
		linkTitle: "Bayiler",
		title: "Bayiler"
	},
	detail: {
		path: "/ilan/:id/:prettylink?",
		component: "Detail",
		exact: true,
		linkTitle: "İlan Detay",
		title: "İlan Detay"
	}
}