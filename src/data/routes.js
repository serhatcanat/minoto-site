module.exports = {
	home: {
		path: "/",
		component: "Home",
		exact: true,
		linkTitle: "Anasayfa",
		title: "Anasayfa",
		meta: {
			keywords: "Minoto, Sıfır Otomobil, Bayiler",
			description: "Minoto: Sıfır Otomobilin Yeni Adresi"
		},
		// Bu şekilde head kısmına custom meta da eklenebilir.
		/*head: [
			{
				key: "meta",
				content: false,
				props: {
					name: "description",
					content: "Minoto, Sıfır Otomobilin Yeni Adresi"
				}
			},
			{
				key: "description",
				content: "Minoto, Sıfır Otomobilin Yeni Adresi",
				props: {}
			}
		]*/
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
		title: "Sayfa Bulunamadı"
	}
}