import React from 'react'
import parse from "html-react-parser";
import OtvCalculator from "../components/partials/otv-calculator";

export default class Otv extends React.Component {
    render() {
        return (
            <main className="page content otv-calculator">
                <section className="section contentpage">
                    <div className="contentpage-wrap wrapper narrow">
                        <div className="contentpage-content">
                            <h1 className="content-title">ÖTV İndirimi Hesaplama</h1>
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

const contents = [
    {
        title: 'Ötv Nedir?',
        description: 'Özel Tüketim Vergisi, kısaca ÖTV, belirli ürünler üzerinden maktu veya oransal olarak alınan bir harcama vergisidir. Avrupa Birliği ile uyum çerçevesinde yapılan kanun değişiklikleriyle ilk kez gündeme gelmiş ve AB\'ye uyum amacıyla 2002 yılında 4760 sayılı kanun ile kabul edilmiştir. Avrupa Birliği\'nde bu verginin uygulanmasındaki amaç, gelir elde etmekten ziyade sosyal fayda sağlamaktır. Bu nedende ÖTV, lüks (mücevher, kürk vb.),sağlığa zararlı (alkol, sigara vb.),çevreye zararlı (benzin vb.) ürünlere uygulanır.'
    },
    {
        title:'Engelli Araç İndirimi Nedir? Kimler Faydalanabilir?',
        description: '%90 ve üzerinde engelli raporuna sahip kişiler ÖTV ödemeden binek sınıfında araç satın alabilirler. KDV yine de vatandaşlarımızdan tahsil edilmektedir. Ancak satın alınacak otomobilin satış bedelinin 303.200' +
            ' bin TL üst limiti var. Daha önceden uygulanan 1600 cm³ motor hacmi sınırı 2018 yılında kaldırıldı. '
    },
    {
        title: 'Gazi ve şehit yakınları Ötv İndiriminden Faydalanabilir mi ?',
        description: 'Engelli vatandaşlarımız gibi gazilerimiz de bu ÖTV indiriminden faydalanabilirler. 303.200 TL üst limiti onlar için de geçerli değildir. Şehit olan kişi evliyse eşi veya çocuğu, evli değilse de annesi veya babası bu indirimden faydalanabilir. Bu dört yakın haricindeki akrabalar ÖTV indiriminden faydalanamazlar.'
    },
    {
        title: 'ÖTV İndiriminin Koşulları Neler?',
        description: 'Aslında çok fazla bir koşul yok. Engelliyseniz 303.200 TL\'yi aşmayan bir otomobili ÖTV ödemeden, gazi ya da birinci dereceden şehit yakınıysanız istediğiniz herhangi bir otomobili ÖTV ödemeden satın alıp kullanabilirsiniz. Tek koşul beş yıl boyunca satın aldığınız otomobili satmamak. Beş yıl dolmadan sattığınız takdirde muhaf olduğunuz ÖTV sizden tahsil edilmektedir. Beş yıl sonra otomobilinizi satıp, yenisini ÖTV indirimiyle satın alabilirsiniz.'
    },
]



