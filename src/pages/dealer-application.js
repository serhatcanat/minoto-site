import React from 'react'

// Partials
import { InputForm, FormInput } from 'components/partials/forms'
import Btn from 'components/partials/btn'

// Deps
import request from 'controllers/request'
import { openModal } from 'functions/modals'
import isEqual from "lodash/isEqual";

const agreement = "<p><strong>www.minoto.com</strong> alan adlı internet sitesinde sunulan ve aşağıda şartları yer alan işbu sözleşme tüm hakları Minimum Otomotiv Bilişim A.Ş.’ye (Bundan böyle kısaca “<strong>Minoto</strong>” olarak anılacaktır.) ait ve <strong>www.minoto.com</strong> alan adı altında, Maltepe Mh. Litros Yolu Sk.  No. 3-1 Topkapı 34010 Zeytinburnu İstanbul adresinde faaliyet gösteren internet sitesinin <strong>Üye Firma</strong>’sı arasında akdedilmiştir. İşbu sözleşmenin konusu Üye Firma’nın <strong>Minoto</strong>’dan yararlanma şartlarının belirlenmesidir. Bu sözleşme ekleriyle birlikte ayrılmaz bir bütün olup, sözleşmenin kabulü ile birlikte üye firma <strong>www.minoto.com</strong>  sitesinde sunulan <strong>ek sözleşmeleri (ekler)</strong> de kabul etmiş sayılacaktır. Bu sözleşme sadece Üye Firma için hazırlanmış olup, kullanıcı ve/veya üye sözleşmesinden ayrı tutulmaktadır.</p><h2>ÜYE FİRMA’NIN YÜKÜMLÜLÜKLERİ</h2><ol><li>Üye Firma, işbu sözleşmeyi okuduğunu, içeriğini tüm şartları ile birlikte anladığını; sözleşmede ve www.minoto.com alan adlı internet sitesinde yer alan tüm hususları itiraz etmeksizin, kayıtsız ve şartsız olarak kabul ettiğini ve onayladığını kabul eder.<br/><br/></li><li>Üye Firma, www.minoto.com alan adlı internet sitesine üye olurken belirlediği veya Minoto tarafından verilen şifrenin ve kullanıcı adının güvenliğini sağlamanın kendi sorumluluğunda olduğunu, bunun için gereken önlemleri alacağını, aksi takdirde doğacak hukuki ve cezai sorumlukların kendisine ait olacağını; üye firma hesaplarının yetkisi olmayanlarca kullanılması veya şifrelerinin başkalarının eline geçmesi halinde derhal Minoto’ya durumu bildireceğini taahhüt eder. Üye firmaya sağlanan şifre ve kullanıcı adı imza niteliğinde olup, www.minoto.com sitesinde üye firma adına şifreyi kullanan bütün şahıslar yetkili ve sorumlu sayılacaktır. Bu şifrenin üçüncü kişilerce kullanılmasından Üye Firma sorumlu olup, Minoto bu nedenle ödemek zorunda kalacağı her türlü adli/idari para cezası ve/veya tazminat için Üye Firma’ya rücu hakkına sahiptir. Üye Firma’nın kullanım hakları başkalarına devredilemez.<br/><br/></li><li>Üye Firma, kanunen yasak bilgiler içeren mesajlar, zincir posta, yazılım virüsü gibi üçüncü şahıslara zarar verebilecek içerikleri dağıtmayacağını; diğer kullanıcıların ve/veya üyelerin bilgisayarındaki bilgilere ya da yazılımlara zarar verecek program ve/veya bilgiler göndermeyeceğini, siteyi kullanmalarından doğan nedenle üçüncü şahısların maruz kalabilecekleri her türlü zarar ve ziyanı tazmin edeceğini kabul ve taahhüt eder. Üye Firma, Fikir ve Sanat Eserleri Yasası, Sınai Mülkiyet Kanunu ve diğer mevzuat hükümleri ile Minoto tarafından yayınlanan duyuru ve bildirimlere uymayı kabul ve taahhüt eder. Bu bahisle Minoto, bu duruma uymayan Üye Firmalar tarafından uğrayacağı her türlü maddi ve manevi zarar Üye Firma’ya rücu edilecektir.<br/><br/></li><li>Üye firma, www.minoto.com sitesinde yayınlayacağı görsel ve bilgilerin güncel olmasını kabul ve taahhüt eder. Söz konusu görsel ve bilgilerin güncel olması durumu tamamen kullanıcı memnuniyeti odaklı olup, aksi halde yaşanacak zarar ve ziyanlarda üye firmanın bu konuda bulunan hakları, üye ve/veya kullanıcılarla yapılan sözleşmelerle koruma altındadır. Üye Firma, isterse Fotoğraf ve bilgileri kendi hazırlayabileceği gibi, isterse de bu hazırlığın yapılması için Minoto tarafından sağlanan uzman ekibi talep edebilir. Üye Firma’nın yapacağı fotoğraf ve bilgi paylaşımları, Minoto tarafından önceden haber verilmeksizin tek taraflı olarak kaldırılıp, değiştirilebilir. Üye Firma, Minoto’ya bilgileri sunulan ve üzerinden aktarma yapılacak olan telefonun numarasının sorumluluğunu taşımaktadır. Minoto üzerinden ve/veya dolaylı yoldan Minoto ile ilgili gelecek ve/veya yönlendirilecek aramalardan doğacak zararlardan Minoto sorumlu tutulamaz. <br/><br/></li><li>www.minoto.com alan adı altında faaliyet gösteren internet sitesinin logosu, içeriği ve yazılımı, her türlü mali, fikri ve sınai hakları Minimum Otomotiv Bilişim A.Ş.’ye aittir. Üye Firma, internet sitesini veya içeriğini izlemek ve/veya kopyalamak, çoğaltmak, değiştirmek amacıyla ya da izin ve yetki verilmeyen başka amaçlarla ve açık ve yazılı izin olmaksızın herhangi bir yöntem kullanmayacağını; bu içerikten işleme eserler yaratmayacağını ya da bunları herhangi bir şekilde kamuya sunmayacağını herhangi bir mecrada teşhir etmeyeceğini kabul ve taahhüt eder.<br/><br/></li></ol><h2>MİNOTO’NUN YETKİLERİ</h2><ol><li>Minoto dilediği zaman ve şekilde tek taraflı olarak Üye Firma’ya verilen hizmeti sürekli veya geçici olarak durdurabileceği bilgisi ile birlikte www.minoto.com alan adlı internet sitesinin içeriğinin hatasız, hizmetinin kesintisiz olacağını ya da sitenin veya içeriğinin kullanılmasıyla ya da siteye bağlantı yapılmasıyla belirli sonuçların elde edileceğini garanti veya taahhüt etmemektedir. <br/><br/></li><li>Minoto, dilediği zaman www.minoto.com alan adlı internet sitesinde yer alan fiyatları güncelleyebilir, değiştirebilir. Online teknik nedenlerden kaynaklanan fiyat, ürün ve her türlü güncelleme hatalarından sorumlu değildir.<br/><br/></li><li>Firma Üye, Minoto’ya üye olurken ve/veya başka yollarla geçmişte vermiş olduğu ve/veya gelecekte vereceği firma ve alışveriş bilgileri ve tüketici davranış bilgilerinin  sipariş almak, ödemeleri gerçekleştirmek, kendisine ürün ve hizmet tanıtımları, reklamlar, kampanyalar, avantajlar, anketler  ve diğer müşteri memnuniyeti uygulamaları sunulması, üyelik bilgilerinin güncellenmesi, müşteri hizmeti sunulması amaçlarıyla toplanmasına, yurt içinde veya dışında arşivlenmesine, saklanmasına, biçimlendirilmene, derlenmesine, Minoto iştiraki olan şirketler, iş ortakları, halefleri, servis sağlayıcılar, tedarikçiler ve bunların belirlediği üçüncü kişiler ve kuruluşlar ile paylaşılmasına, kullanılmasına ve arşivlenmesine izin verdiğini beyan ve kabul eder. Firma Üye aksini bildirmediği sürece üyeliği sona erdiğinde de verilerin toplanmasına, online olan tüm şirketler ile paylaşılmasına, Minoto iştiraki olan tüm şirketler tarafından kullanılmasına ve arşivlenmesine izin verdiğini beyan ve kabul eder. Firma Üye, Minoto’nun iletişim kanalları üzerinden güncelleyerek (minoto.com veya Çağrı Merkezi vb.) onay vererek iletişim kanalları (elektronik posta adresi, internet, telefon, sms, sosyal mecra gönderisi vb) kullanarak her türlü ürün ve hizmete ilişkin tanıtım, reklam, pazarlama, promosyon, satış amacı ile irtibata geçilmesine, ticari elektronik iletilerin gönderilmesine, Minoto ve iştiraki olan şirketlere, izin verdiğini beyan ve kabul eder. Firma Üye yukarıda belirlenen bilgilerin toplanması, paylaşılması, kullanılması, arşivlenmesi ve erişilmesi nedeniyle doğrudan ve/veya dolaylı maddi ve/veya manevi herhangi bir zarara uğradığı konusunda talepte bulunmayacağını ve Minoto ve iştiraklerini sorumlu tutmayacağını beyan ve kabul eder. Firma Üye tarafından paylaşılan bilgiler hiçbir durumda burada öngörülen amaçlar ve hizmetler dışında kullanılmayacaktır.<br/><br/></li><li>Sistemle ilgili sorunların tanımlanması ve www.minoto.com alan adlı internet sitesinde çıkabilecek sorunların giderilebilmesi için gerektiğinde Firma Üye’ye ait IP adresi tespit edilmekte ve kullanılmaktadır. Minoto, mevzuat uyarınca yetkili merci ve makamlardan talep gelmesi halinde Firma Üye’nin tespit edilen IP bilgisi dahil tüm bilgilerini ilgili yetkili makamlarla paylaşacaktır. <br/><br/></li></ol><h2>FESİH VE DEĞİŞİKLİKLER</h2><ol><li>Minoto, www.minoto.com adlı internet sitesinin içeriğinde önceden bildirim yapmaksızın, dilediği zaman ve şekilde, tek taraflı olarak değişiklik ve güncelleme yapabilir. Bu değişiklikler, ayarlamalar ve güncellemeler internet sitesinde yayınlandıkları andan itibaren geçerlilik kazanırlar. Üye Firma www.minoto.com alan adlı internet sitesine her yeni girişinde, güncellenmiş/değiştirilmiş/ayarlanmış maddeleri kabul etmiş sayılmaktadırlar.<br/><br/></li><li>Firma Üye sözleşmede belirtilen hak ve yükümlülüklere aykırı hareketleri ve/veya edim ve taahhütlerini yerine getirmemeleri ve/veya kullanma nedeniyle, Minoto’nun ve/veya üçüncü kişilerin uğrayacağı her türlü zarar ve ziyanı derhal tazmin etmeyi kabul ve taahhüt eder.<br/><br/></li></ol><h2>İHTİLAF</h2><p>İşbu sözleşme kanunlar ihtilâfı kurallarına bakılmaksızın Türkiye Cumhuriyeti kanunlarına tâbi olup, uyuşmazlıklar halinde İstanbul Mahkemeleri ve İcra Daireleri yetkilidir. </p><p>Taraflar, Minimum Otomotiv Bilişim A.Ş.’ye tüm bilgisayar kayıtlarının tek ve gerçek münhasır delil olarak esas alınacağını ve söz konusu kayıtların bir delil sözleşmesi teşkil ettiği hususunu kabul ve beyan eder.</p><h2>TEBLİGAT ADRESLERİ</h2><p>Firma Üye’nin, Minoto’ya bildirdiği adres, bu sözleşme ile ilgili olarak yapılacak her türlü bildirim ve taraflar arasındaki iletişim için yasal adres kabul edilir. </p><p>Taraflar, mevcut adreslerindeki değişiklikleri yazılı olarak diğer tarafa 3 (üç) gün içinde bildirmedikçe, eski adreslere yapılacak bildirimlerin geçerli olacağını ve kendilerine yapılmış sayılacağını kabul ederler. </p><p>Firma Üye’nin kayıtlı e-posta adresini kullanılarak yapılacak her türlü bildirim yasal tebligatın sonuçlarını doğuracak olup bildirimi havi elektronik postanın yollanmasından 1 (bir) gün sonra üyeye ulaştığı ve okunduğu kabul edilecektir. </p><h2>YÜRÜRLÜK</h2><p>Firma Üye’nin elektronik ortamda www.minoto.com internet sitesi üzerinden üyelik kaydı yapması ve/veya sözleşmeyi fiziksel şekilde, karşılıklı olarak imzalaması bu üyelik sözleşmesinde yer alan maddelerin tümünü okuduğu, anladığı, kabul ettiği ve kendisiyle ilgili olarak verdiği bilgilerin doğruluğunu onayladığı anlamına gelir. İşbu Üye Firma sözleşmesi üyenin üye olması anında ve/veya sözleşmenin imzalanması anında akdedilmiş ve karşılıklı olarak yürürlüğe girmiştir. </p><p>Sözleşme üyeliğin sona ermesi ile veya işbu sözleşmede sayılan fesih hallerinden herhangi birinin gerçekleşmesi ile hiçbir ihtara gerek kalmaksızın kendiliğinden hükümsüz kalacaktır.</p><h2>EKLER</h2><p><a target='_blank' rel='noopener noreferrer' href='/kullanici-sozlesmesi'><strong>EK. 1</strong> <span style='color: #145aff'>(Site Kullanım Şartları, Üyelik, Gizlilik Kuralları, Kişisel Verilerinizle İlgili Sözleşme ve Koşullar)</span></a></p><p><a target='_blank' rel='noopener noreferrer' href='/kisisel-verilerin-korunmasi'><strong>EK. 2</strong><span style='color: #145aff'> (Kişisel Verilerin Korunması ve Çerez Politası Hakkında Aydınlatma)</span></a><br/><br/></p>"


export default class Faq extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submitting: false,
			cities: false,
			districts: false,
			brands: false,
			selectedBrands: [],
			availableBrands: [],
			touched: false,
			selectedDistrict: false,
			selectedCity: false
		}

		this.changeCity = this.changeCity.bind(this);
		this.changeDistrict = this.changeDistrict.bind(this);
		this.saveData = this.saveData.bind(this);
		this.addBrand = this.addBrand.bind(this);
		this.removeBrand = this.removeBrand.bind(this);

		this.form = React.createRef();
	}

	componentDidMount() {
		let vm = this;
		request.get('cities/lookup', {}, function (payload) {
			if (payload) {
				vm.setState({
					cities: payload
				});
			}
		}, { excludeApiPath: false });

		request.get('brands/lookup/all', {}, function (payload) {
			if (payload) {
				vm.setState({
					brands: payload,
				});
			}
		}, { excludeApiPath: false });
	}

	componentDidUpdate(prevProps, prevState) {
		let vm = this;
		if (!isEqual(prevState.brands, vm.state.brands) || !isEqual(prevState.selectedBrands, vm.state.selectedBrands)) {
			vm.setState({
				availableBrands: vm.state.brands.reduce(function (filtered, brand) {
					if (!vm.state.selectedBrands.filter(sBrand => (sBrand.value === brand.value)).length) {
						filtered.push(brand);
					}
					return filtered;
				}, [])
			});
		}
	}

	saveData(e) {
		let vm = this;
		// Form Data:
		if (vm.state.selectedBrands.length) {
			this.setState({
				submitting: true,
			});

			let record = {
				dealer_name: e.target.elements.name.value,
				dealer_representative: e.target.elements.manager.value,
				email: e.target.elements.email.value,
				mobile: e.target.elements.phone.value,
				phone: e.target.elements.phone_land.value,
				address: e.target.elements.address.value,
				brand_list: vm.state.selectedBrands,
				city_id: vm.state.selectedCity,
				district_id: vm.state.selectedDistrict,
				note: e.target.elements.note.value,
				tax_no: e.target.elements.taxnumber.value,
				tax_office: e.target.elements.taxoffice.value
			};


			request.post('dealers/apply', record, function (payload) {
				if (payload.success) {
					setTimeout(function () {
						vm.setState({ loading: false, complete: true });

						if (vm.form.current) {
							vm.form.current.reset();
						}

						vm.props.history.push(`/bayi-basvuru-durumu/${payload.applicationNo}`);


					}, 1000);
				}
			}, { excludeApiPath: false });
		}
	}

	changeCity(city) {
		let vm = this;

		vm.setState({ districts: false, selectedCity: city });

		if (city) {
			request.get(`districts/lookup/${city}`, { id: city }, function (payload) {
				if (payload) {
					vm.setState({
						districts: payload
					});
				}
			}, { excludeApiPath: false });
		}


	}

	changeDistrict(district) {
		let vm = this;

		vm.setState({ districts: false, selectedDistrict: district });
	}

	addBrand(selected) {
		if (selected) {
			let newSelected = this.state.selectedBrands.concat(this.state.availableBrands.filter(brand => { return brand.value === selected; }));
			this.setState({
				selectedBrands: newSelected
			});
		}
	}

	removeBrand(id) {
		this.setState({
			selectedBrands: this.state.selectedBrands.filter(brand => (brand.value !== id))
		});
	}

	render() {
		return (
			<main className="page content">
				<section className="section contentpage">
					<div className="contentpage-wrap wrapper narrow">
						<div className="contentpage-content">
							<h1 className="content-title">Bayi Başvuru Formu</h1>
							<p className="content-subtitle">Eğer bir Yetkili Satıcı iseniz ve Minoto'da araçlarınızın listelenmesini istiyorsanız <br /> lütfen formu doldurun. Ekibimiz sizinle en kısa zamanda iletişime geçecektir.</p>
							<InputForm className="section contentpage-form grid-container" ref={this.form} onSubmit={this.saveData}>
								<div className="grid-row">
									<div className="grid-col x6 m-x12">
										<FormInput
											type="text"
											name="name"
											placeholder="Bayi Adı"
											validation={"Bir isim girmelisiniz."}
											popLabel />
									</div>
									<div className="grid-col x6 m-x12">
										<FormInput
											type="text"
											name="manager"
											placeholder="Yetkili Kişi"
											validation={"Bir isim girmelisiniz."}
											popLabel />
									</div>
								</div>
								<div className="grid-row">
									<div className="grid-col x6 m-x12">
										<FormInput
											type="text"
											name="taxoffice"
											placeholder="Vergi Dairesi"
											validation={"Vergi dairenizi girmelisiniz."}
											popLabel />
									</div>
									<div className="grid-col x6 m-x12">
										<FormInput
											type="number"
											name="taxnumber"
											placeholder="Vergi Numarası"
											mask="00000000000"
											validation={"Vergi numaranızı girmelisiniz."}
											popLabel />
									</div>
								</div>
								<div className="grid-row">
									<div className="grid-col x6 m-x12">
										<FormInput
											name="phone_land"
											disabled={this.state.submitting}
											placeholder="Telefon Numarası"
											mask="(199) 999 99 99"
											validation={{
												required: "Telefon numaranızı girmelisiniz.",
												minLength: ["Geçerli bir telefon numarası girmelisiniz.", 15]
											}}
											popLabel />
									</div>
									<div className="grid-col x6 m-x12">
										<FormInput
											name="phone"
											disabled={this.state.submitting}
											placeholder="Cep Telefonu"
											mask="(199) 999 99 99"
											validation={{
												required: "Cep telefonunuzu girmelisiniz.",
												minLength: ["Geçerli bir telefon numarası girmelisiniz.", 15]
											}}
											popLabel />
									</div>
								</div>

								<div className="grid-row">
									<div className="grid-col x12">
										<FormInput
											disabled={this.state.submitting}
											placeholder="E-postan Adresiniz"
											validation={{
												required: "E-posta adresinizi girmelisiniz.",
												email: true
											}}
											name="email"
											type="text" />
									</div>
								</div>
								<div className="grid-row">
									<div className="grid-col x12">
										<FormInput
											type="textarea"
											name="address"
											placeholder="Adres"
											validation={"Bir adres girmelisiniz."}
											popLabel />
									</div>
								</div>
								<div className="grid-row">
									<div className={"grid-col x6 m-x12 inputwrap" + ((!this.state.selectedCity && this.state.touched) ? ' error' : '')}>
										<FormInput
											className="high city"
											type="select"
											name="city"
											placeholder="İl"
											options={(this.state.cities ? this.state.cities : undefined)}
											disabled={!this.state.cities}
											onChange={this.changeCity}
											value={null}
											popLabel />
										{(!this.state.selectedCity && this.state.touched) &&
											<div className="input-error">İl seçiniz.</div>
										}
									</div>
									<div className={"grid-col x6 m-x12 inputwrap" + ((!this.state.selectedDistrict && this.state.touched) ? ' error' : '')}>
										<FormInput
											className="high district"
											type="select"
											name="district"
											placeholder="İlçe"
											options={(this.state.districts ? this.state.districts : undefined)}
											disabled={!this.state.districts}
											onChange={this.changeDistrict}
											value={null}
											popLabel />
										{(!this.state.selectedDistrict && this.state.touched) &&
											<div className="input-error">İlçe seçiniz.</div>
										}
									</div>
								</div>
								<div className="grid-row">
									<div className="grid-col x12">
										<FormInput
											type="textarea"
											name="note"
											placeholder="Notunuz"
											required={false}
											popLabel />
									</div>
								</div>
								<div className="grid-row">
									<div className={"grid-col x6 m-x12 inputwrap" + ((!this.state.selectedBrands.length && this.state.touched) ? ' error' : '')}>
										<FormInput
											className="high brands"
											type="select"
											name="brand-selector"
											placeholder="Marka ya da markalar seçiniz."
											options={(this.state.availableBrands ? this.state.availableBrands : undefined)}
											disabled={!this.state.availableBrands}
											value={null}
											onChange={this.addBrand}
											popLabel />
										{(!this.state.selectedBrands.length && this.state.touched) &&
											<div className="input-error">Marka seçiniz.</div>
										}
									</div>
								</div>
								<div className="grid-row">
									<div className="grid-col x12 form-opts">
										<div className="opts-inner">
											{this.state.selectedBrands.map((brand, nth) => (
												<span className="opts-item" key={nth}>
													<input type="hidden" name="brands[]" value={brand.value} />
													{brand.label}
													<button type="button" onClick={() => { this.removeBrand(brand.value) }}><i className="icon-close"></i></button>
												</span>
											))}
										</div>
									</div>
								</div>
								<div className="grid-row">
									<div className="grid-col x12" >
										<FormInput
											type="checkbox"
											className="form-agreement"
											name="agreement"
											value={this.state.agreementSelected}
											validation={"Kullanıcı sözleşmesini kabul etmelisiniz."}
											onChange={this.agreementChanged}>
											"Formu Gönder" butonuna tıklayarak Minoto'nun <button type="button" className="check-link" onClick={() => { openModal('text', { content: agreement, title: "Üye Firma Sözleşmesi" }) }}>Kullanıcı Sözleşmesi</button>'ni kabul etmiş sayılacaksınız.
												</FormInput>
									</div>
								</div>
								<div className="grid-row">
									<div className="grid-col x12 center">
										<Btn
											type="submit"
											uppercase
											block
											disabled={this.state.submitting}
											status={this.state.submitting && 'loading'}
											onClick={() => { this.setState({ touched: true }) }}
											className="form-submitbtn">
											Formu Gönder
											</Btn>
									</div>
								</div>
							</InputForm>
						</div>
					</div>
				</section>
			</main>

		)
	}
}