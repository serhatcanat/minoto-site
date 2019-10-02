module.exports = {
	pages: {

		posts: {
			path: "/ilanlar",
			component: "Posts",
			exact: true,
			linkTitle: "İlanlar",
			title: "Sıfır Araba Modelleri ve Fiyatları - 0 Km Araç Satın Almak İçin Minoto!",
			postTitle: false,
			descriptiopn: "En yeni ve uygun sıfır araba modelleri, fiyatları ve kampanyaları Minoto'da! 0 km araç satın almak için hemen tıkla, fırsatları kaçırma!",
			meta: {
				keywords: "Minoto, Sıfır Otomobil, Bayiler"
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
		search: {
			path: "/arama",
			component: "Search",
			exact: true,
			linkTitle: "Arama",
			title: "Arama",
		},
		/*searchBrand: {
			path: "/arama/:brand",
			component: "SearchBrand",
			exact: true,
			linkTitle: "Arama",
			title: "Arama",
		},
		searchModel: {
			path: "/arama/:brand/:model",
			component: "SearchModel",
			exact: true,
			linkTitle: "Arama",
			title: "Arama",
		},
		searchModelSub: {
			path: "/arama/:brand/:model/:modelsub",
			component: "SearchModelSub",
			exact: true,
			linkTitle: "Arama",
			title: "Arama",
		},
		searchVersion: {
			path: "/arama/:brand/:model/:modelsub/:version",
			component: "SearchVersion",
			exact: true,
			linkTitle: "Arama",
			title: "Arama",
		},*/
		/* sitemap: {
			path: "/sitemap",
			component: "Sitemap",
			exact: true,
			linkTitle: "Site Haritası",
			title: "Site Haritası",
		}, */
		brands: {
			path: "/markalar",
			component: "Brands",
			exact: true,
			linkTitle: "Markalar",
			title: "Araba Markaları ve Araç Listesi - Türkiye'nin Sıfır Km Oto Sitesi Minoto",
			description: "Araba markalarına ve araç listesine ulaşmak için hemen tıkla, fırsatları kaçırma! Türkiye'nin Sıfır Km Oto Sitesi Minoto!",
			postTitle: false,
			meta: {
				keywords: "Minoto, Sıfır Otomobil, Bayiler"
			},
		},
		brand: {
			path: "/markalar/:id/:slug?",
			component: "Brand",
			exact: true,
			linkTitle: "Marka",
			title: "Araba Markaları ve Araç Listesi - Türkiye'nin Sıfır Km Oto Sitesi Minoto",
			description: "Sıfır Km araba mı aradınız? Sıfır Km araba modelleri ve fiyatları Minoto'da! Hemen tıkla, fırsatları kaçırma!",
			postTitle: false,
		},
		dealer: {
			path: "/bayiler/:slug",
			component: "Dealer",
			exact: true,
			linkTitle: "Bayi",
			title: "Araba Markaları ve Araç Listesi - Türkiye'nin Sıfır Km Oto Sitesi Minoto",
			description: "Sıfır Km araba mı aradınız? Sıfır Km araba modelleri ve fiyatları Minoto'da! Hemen tıkla, fırsatları kaçırma!",
			postTitle: false,
		},
		dealers: {
			path: "/bayiler",
			component: "Dealers",
			exact: true,
			linkTitle: "Bayiler",
			title: "Yetkili Araba Bayileri, Araç Satıcıları ve Servisleri",
			description: "Yetkili araba bayileri, araç satıcıları ve servisleri Minoto'da! Hemen tıkla, fırsatları kaçırma!"
		},
		branch: {
			path: "/bayiler/:dealer/:slug",
			component: "Branch",
			exact: true,
			linkTitle: "Şube",
			title: "Şube",
		},
		listprices: {
			path: "/araba-fiyat-listesi",
			component: "ListPrices",
			exact: true,
			linkTitle: "Araç Liste Fiyatları",
			title: "Araba Fiyat Listesi ve Özellikleri - Türkiye'nin Sıfır Km Oto Sitesi Minoto",
			description: "Sıfır Km araba fiyat listesi mi aradınız? Sıfır Km araba fiyat listesi ve özellikleri Minoto'da! Hemen tıkla, fırsatları kaçırma!",
			postTitle: false,
		},
		listpricesDetail: {
			path: "/:data(.*-fiyat-listesi)",
			component: "ListPrices",
			exact: true,
			linkTitle: "Araç Eki Liste Fiyatları",
			title: "Araba Fiyat Listesi ve Özellikleri - Türkiye'nin Sıfır Km Oto Sitesi Minoto",
			description: "Sıfır Km araba fiyat listesi mi aradınız? Sıfır Km araba fiyat listesi ve özellikleri Minoto'da! Hemen tıkla, fırsatları kaçırma!",
			postTitle: false,
		},
		dealerApplication: {
			path: "/bayi-basvuru-formu",
			component: "DealerApplication",
			exact: true,
			linkTitle: "Bayi Başvuru Formu",
			title: "Bayi Başvuru Formu",
		},
		dealerApplicationStatus: {
			path: "/bayi-basvuru-durumu/:applicationNo",
			component: "DealerApplicationStatus",
			exact: true,
			linkTitle: "Bayi Başvuru Durumu",
			title: "Bayi Başvuru Durumu",
		},
		detail: {
			path: "/:slug-:dealer-:post",
			component: "Detail",
			exact: true,
			linkTitle: "İlan Detay",
			title: "İlan Detay",
			head: [
				{
					key: "meta",
					props: {
						property: "og:type",
						content: "product"
					}
				}
			],
		},


		comparison: {
			path: "/arac-karsilastir/:car1?/:model1?/:car2?/:model2?",
			component: "Comparison",
			exact: true,
			linkTitle: "Araç Karşılaştırma",
			title: "Araç Karşılaştırma",
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
			childRoutes: "account",
		},
		reservation: {
			path: "/rezervasyon/:id/:section?",
			component: "Reservation",
			exact: true,
			linkTitle: "Rezervasyon",
			title: "Rezervasyon",
			childRoutes: "account",
		},
		faq: {
			path: "/sss",
			component: "Faq",
			exact: true,
			linkTitle: "Sıkça Sorulan Sorular",
			title: "Sıkça Sorulan Sorular",
		},
		privacy: {
			path: "/kullanici-sozlesmesi",
			component: "Privacy",
			exact: true,
			linkTitle: "Kullanıcı Sözleşmesi ve Koşullar",
			title: "Kullanıcı Sözleşmesi ve Koşullar",
		},
		gdprPolicy: {
			path: "/kisisel-verilerin-korunmasi",
			component: "GdprPolicy",
			exact: true,
			linkTitle: "Kişisel Verilerin Korunması ve Çerez Politikası",
			title: "Kişisel Verilerin Korunması ve Çerez Politikası",
		},
		contact: {
			path: "/iletisim",
			component: "Contact",
			exact: true,
			linkTitle: "İletişim",
			title: "İletişim",
		},
		blogSearch: {
			path: "/blog/arama/:search",
			component: "Blog",
			exact: true,
			linkTitle: "Minoto Blog",
			title: "Minoto Blog",
		},
		blogRedirect: {
			path: "/blog/detay/:slug",
			component: "BlogRedirect",
			exact: true,
			linkTitle: "Minoto Blog",
			title: "Minoto Blog",
		},
		blogDetail: {
			path: "/blog/:slug",
			component: "BlogDetail",
			exact: true,
			linkTitle: "Minoto Blog",
			title: "Minoto Blog",
		},
		blog: {
			path: "/blog",
			component: "Blog",
			exact: true,
			linkTitle: "Minoto Blog",
			title: "Minoto Blog",
		},




		/*searchBrand: {
			path: "/:brand/:model?/:optdata1?/:optdata2?/:optdata3?",
			component: "SearchBrand",
			exact: false,
			linkTitle: "Arama",
			title: "Arama",
		},*/
		home: {
			path: "/:brand?/:model?/:optdata1?/:optdata2?/:optdata3?",
			component: "Home",
			exact: true,
			linkTitle: "Anasayfa",
			title: "Sıfır Araba Modelleri ve Fiyatları - 0 Km Araç Satın Almak İçin Minoto!",
			postTitle: false,
			descriptiopn: "En yeni ve uygun sıfır araba modelleri, fiyatları ve kampanyaları Minoto'da! 0 km araç satın almak için hemen tıkla, fırsatları kaçırma!",
			meta: {
				keywords: "Minoto, Sıfır Otomobil, Bayiler"
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
			hideSearchFromHeader: false,
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
			requiresLogin: true,
		},
		notifications: {
			path: "/hesabim/bildirimler",
			component: "Notifications",
			exact: true,
			linkTitle: "Bildirimler",
			title: "Bildirimler",
			requiresLogin: true,
		},
		favorites: {
			path: "/hesabim/favorilerim/:section?",
			component: "Favorites",
			exact: false,
			linkTitle: "Favorilerim",
			title: "Favorilerim",
			requiresLogin: true,
		},
		messages: {
			path: "/hesabim/mesajlarim",
			component: "Messages",
			exact: true,
			linkTitle: "Mesajlarım",
			title: "Mesajlarım",
			requiresLogin: true,
		},
		messageDetail: {
			path: "/hesabim/mesajlarim/mesaj/:id",
			component: "MessageConversation",
			exact: true,
			linkTitle: "Mesaj Detay",
			title: "Mesaj Detay",
			requiresLogin: true,
		},
		reservations: {
			path: "/hesabim/rezervasyonlarim",
			component: "Reservations",
			exact: true,
			linkTitle: "Rezerve Ettiklerim",
			title: "Rezerve Ettiklerim",
			requiresLogin: true,
		},
		login: {
			path: "/hesabim/giris",
			component: "Login",
			exact: true,
			linkTitle: "Giriş",
			title: "Giriş",
			requiresLogin: false,
		},
		register: {
			path: "/hesabim/uye-ol",
			component: "Register",
			exact: true,
			linkTitle: "Üye Ol",
			title: "Üye Ol",
			requiresLogin: false,
		},
		recovery: {
			path: "/hesabim/sifremi-unuttum/:email?/:token?",
			component: "Recovery",
			exact: true,
			linkTitle: "Şifremi Unuttum",
			title: "Şifre Hatırlatma",
			requiresLogin: false,
		},
		confirmEmail: {
			path: "/hesabim/e-postami-onayla/:email/:token",
			component: "ConfirmEmail",
			exact: true,
			linkTitle: "E-Postamı Onayla",
			title: "E-Postamı Onayla",
			requiresLogin: false,
		}
	},
	reservation: {
		info: {
			path: "/rezervasyon/:id/bilgi",
			component: "Info",
			exact: false,
			linkTitle: "Rezervasyon Bilgileri",
			title: "Rezervasyon Bilgileri",
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