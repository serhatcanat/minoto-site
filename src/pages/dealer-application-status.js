import React from 'react'

export default class Faq extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            applicationData: false,
        }
    }

    render() {
        return (
            <main className="page content">
                <section className="section contentpage">
                    <div className="contentpage-wrap wrapper narrow">
                        <div className="contentpage-content">
                            <h1 className="content-title">Başvurunuz Alındı</h1>
                            <p className="content-subtitle"></p>
                            <div className="layout-content">
                                <div className="content-innerwrap">
                                    <section className="section reservation-sum" style={{ paddingRight: '0' }}>
                                        <i className="sum-check icon-check-thin"></i>

                                        <h1 className="sum-title">Minoto'ya göstermiş olduğunuz ilgi için teşekkür ederiz. </h1>
                                        <div className="sum-text">Başvurunuzu inceleyip, size en kısa sürede dönüş sağlayacağız.</div>

                                        <div className="sum-ref">Referans Numarası: <span>{this.props.match.params.applicationNo}</span></div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        )
    }
}
