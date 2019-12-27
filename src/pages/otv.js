import React from 'react'
import {formatMoney} from "../functions";
import parse from "html-react-parser";
import OtvCalculator from "../components/partials/otv-calculator";

export default class Otv extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="page content otv-calculator">
                <section className="section contentpage">
                    <div className="contentpage-wrap wrapper narrow">
                        <div className="contentpage-content">
                            <h1 className="content-title">Otv İndirimi Hesaplama</h1>
                            <OtvCalculator/>
                            {/*  Content  Wrapper Begin */}
                            <div className="row contents">
                                <div className="col">
                                    {contents &&
                                    <Contents contents={contents}/>
                                    }
                                </div>
                            </div>
                            {/*  Content  Wrapper End */}
                        </div>
                    </div>
                </section>
            </main>
        )
    }
}

function Result(props) {
    const {result} = props;
    return (
        <>
            <div className="row">
                <div className="col">
                    <p>Ötv Oranı</p>
                </div>
                <div className="col">
                    <p>%{result.otvRate * 100}</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>Ötv Tutarı</p>
                </div>
                <div className="col">
                    <p>{formatMoney(result.otvCost)} TL</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>Kdv Oranı</p>
                </div>
                <div className="col">
                    <p>%{result.kdvRate * 100}</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>KDV Tutarı</p>
                </div>
                <div className="col">
                    <p>{formatMoney(result.kdvCost)} TL</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>Toplam vergi</p>
                </div>
                <div className="col">
                    <p>{formatMoney(result.totalTax)} TL</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>Aracın Ötv İndiirmli Fiyatı</p>
                </div>
                <div className="col">
                    <p>{formatMoney(result.total)} TL</p>
                </div>
            </div>
        </>
    )
}

function Contents(props) {
    const {contents} = props;
    return (
        contents.map((content, nth) => (
            <div key={nth}>
                <h2>{content.title}</h2>
                <p>{parse(content.description)}</p>
            </div>
        ))
    )

}

const vehicleTypes = [
    {
        value: 'car',
        label: 'Otomobil'
    },
    {
        value: 'hybrid',
        label: 'Hibrit Araç'
    },
    {
        value: 'electric',
        label: 'Elektrikli Araç'
    },
    {
        value: 'autobus',
        label: 'Otobus'
    }
];


const contents = [
    {
        title: 'Ötv İndirimi Nasıl Hesaplanır',
        description: 'Taşıtların vergisiz (ham bedelleri) üzerine aşağıdaki tablolarda göre Özel Tüketim Vergisi( ÖTV ) uygulanıyor. Bulunan ÖTV\'li bedel üzerine ise %18 KDV uygulanıyor. Bu durumda ÖTV\'nin de KDV\'sinin alınmasına sebep olduğu için verginin, vergisini almak gibi bir durum ortaya çıkarıyor. Bu durum için hukuki yollardan itirazda bulunulsa da sonuç olarak Yargıtay bu uygulamanın diğer ülkelerdeki uygulamalara da atıfta bulunarak yerinde olduğuna karar verdi. KDV işlem ve tutarları hakkında daha detaylı bilgi almak ve hesaplama yapmak için KDV hesaplama aracımızı kullanın.'
    },
    {
        title: '2019 Ötv İndirimi',
        description: '31 Ekim 2018 tarihinde yapılan ve 30 Haziran 2019\'a kadar geçerli olan ÖTV indirimleri sonra erdi. 30 Haziran 2019\'a kadar uygulanan ÖTV indirimleri şu şekildeydi: "1600 cc ve 120 bin TL\'ye kadar vergisiz satış bedeli olan araçların ÖTV\'lerinde 15 puanlık indirim yapılmıştı. Bu değişiklik vergisiz satış bedeli 120 bin TL olan araç için 21.240 TL indirim anlamına geliyordu. Piyasada 1600 cc\'ye kadar olan araçların satış fiyatları incelendiğinde ise ortalamada 15 bin TL indirim söz konusu olmuştu.'
    },
    {
        title: 'Engelli Araç İndirimi Nedir Kimler Faydalanabilir',
        description: '%90 ve üzerinden engelli raporu olan kişiler ÖTV olmadan binek sınıfında yer alan taşıtlardan alabilir. Ancak alınacak taşıtın satış bedelinin 200 bin TL\'yi geçmemesi gerekiyor. Öte yandan önceki yıllarda uygulanan motor silindir hacmin 1.6\'yı (1600 cm³) geçmemesi kuralı ise 2018 yılı için ilgili mevzuat ile kaldırıldı. '
    },
    {
        title: 'Gazi ve şehit yakınları Ötv İndiriminden Faydalanabilir mi ?',
        description: 'Engelli kişilerde olduğu gibi gazi ve şehit yakınları da ÖTV olmadan binek sınıfında yer alan taşıtlardan alabilir. Yani satışı tutarı 200 bin TL\'yi geçmeyen araçları herhangi bir motor silindir hacmi sınırlaması olmadan alabilir.'
    },
]



