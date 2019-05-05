module.exports = {
	pages: {
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
			],*/
			hideSearchFromHeader: true,
		},
		sitemap: {
			path: "/sitemap",
			component: "Sitemap",
			exact: true,
			linkTitle: "Site Haritası",
			title: "Site Haritası",
		},
		dealers: {
			path: "/bayiler",
			component: "Dealers",
			exact: true,
			linkTitle: "Bayiler",
			title: "Bayiler",
		},
		dealer: {
			path: "/bayi/:id/:prettylink?",
			component: "Dealer",
			exact: true,
			linkTitle: "Bayi",
			title: "Bayi",
		},
		detail: {
			path: "/ilan/:id/:prettylink?",
			component: "Detail",
			exact: true,
			linkTitle: "İlan Detay",
			title: "İlan Detay",
		},
		listprices: {
			path: "/liste-fiyatlari/:brand?/:year?",
			component: "ListPrices",
			exact: true,
			linkTitle: "Araç Liste Fiyatları",
			title: "Araç Liste Fiyatları",
		},
		about: {
			path: "/minoto-nedir",
			component: "About",
			exact: true,
			linkTitle: "Minoto Nedir",
			title: "Minoto Nedir",
		},
		account: {
			path: "/hesabim/:page?/:section?/:param?",
			component: "Account",
			exact: true,
			linkTitle: "Hesabım",
			title: "Hesabım",
		},
		reservation: {
			path: "/rezervasyon/:id/:section?",
			component: "Reservation",
			exact: true,
			linkTitle: "Rezervasyon",
			title: "Rezervasyon",
		},
		notfound: {
			path: false,
			component: "NotFound",
			exact: false,
			linkTitle: "404",
			title: "Sayfa Bulunamadı",
		}
	},
	account: {
		profile: {
			path: "/hesabim/profilim",
			component: "Profile",
			exact: true,
			linkTitle: "Profilim",
			title: "Profilim",
		},
		notifications: {
			path: "/hesabim/bildirimler",
			component: "Notifications",
			exact: true,
			linkTitle: "Bildirimler",
			title: "Bildirimler",
		},
		favorites: {
			path: "/hesabim/favorilerim",
			component: "Favorites",
			exact: true,
			linkTitle: "Favorilerim",
			title: "Favorilerim",
		},
		messages: {
			path: "/hesabim/mesajlarim",
			component: "Messages",
			exact: true,
			linkTitle: "Mesajlarım",
			title: "Mesajlarım",
		},
		messageDetail: {
			path: "/hesabim/mesajlarim/mesaj/:id",
			component: "MessageConversation",
			exact: true,
			linkTitle: "Mesaj Detay",
			title: "Mesaj Detay",
		},
		reservations: {
			path: "/hesabim/rezervasyonlarim",
			component: "Reservations",
			exact: true,
			linkTitle: "Rezerve Ettiklerim",
			title: "Rezerve Ettiklerim",
		},
		login: {
			path: "/hesabim/giris",
			component: "Login",
			exact: true,
			linkTitle: "Giriş",
			title: "Giriş",
		}
	},
	reservation: {
		info: {
			path: "/rezervasyon/:id/bilgi",
			component: "Info",
			exact: false,
			linkTitle: "Rezervasyon",
			title: "Rezervasyon",
		},
		payment: {
			path: "/rezervasyon/:id/odeme",
			component: "Payment",
			exact: false,
			linkTitle: "Ödeme",
			title: "Ödeme",
		},
		sum: {
			path: "/rezervasyon/:id/ozet",
			component: "Sum",
			exact: false,
			linkTitle: "Rezervasyon Özeti",
			title: "Rezervasyon Özeti",
		},
	}
}