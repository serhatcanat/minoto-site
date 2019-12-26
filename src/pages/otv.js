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
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. <br/> <br/> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    {
        title: '2019 Ötv İndirimi',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    {
        title: 'Engelli Araç İndirimi Nedir Kimler Faydalanabilir',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    {
        title: 'Gazi ve şehit yakınları Ötv İndiriminden Faydalanabilir mi ?',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
]



