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
	dealer: {
		path: "/bayi/:id/:prettylink?",
		component: "Dealer",
		exact: true,
		linkTitle: "Bayi",
		title: "Bayi"
	},
	detail: {
		path: "/ilan/:id/:prettylink?",
		component: "Detail",
		exact: true,
		linkTitle: "İlan Detay",
		title: "İlan Detay"
	},
	notfound: {
		path: false,
		component: "NotFound",
		exact: false,
		linkTitle: "404",
		title: "404"
	}
}