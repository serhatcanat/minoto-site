import React from 'react'

// Partials
import { FormInput, InputForm } from 'components/partials/forms'
import Btn from 'components/partials/btn'
import Link from 'components/partials/link'
import request from 'controllers/request'

// Deps
import { connect } from "react-redux"
import { closeModal } from 'functions/modals'
import image_garanti from 'assets/images/garabtiBBVA.png'

const mapStateToProps = state => {
    return {
        user: state.user.user,
    };
};

class GarantiModalRaw extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            success: false,
            error: false,
            bid: false,
        }

        this.submit = this.submit.bind(this);
    }

    submit(e) {
        let vm = this;

        vm.setState({ loading: true, error: false })

        let record = {
            postNo: e.target.elements.advertID.value,
            identityNumber: e.target.elements.tck.value,
            phone: e.target.elements.phone.value,
            bankName: 'Garanti'
        };
        request.post(`credit-requests`, record, function (payload) {
            setTimeout(function () {
                vm.setState({ loading: false, success: true, message: "" });
                window.open('https://www.garantibbva.com.tr/tr/bireysel/krediler/tasit-arac-kredisi-hesaplama.page?cid=oth:oth:oth:bireysel-hedeffilotasitkredisi:tasitkredisi::::::375x400:oth', '_blank');
            }, 1000);
        })
    }

    render() {
        let vm = this;
        return (
            <div className={vm.props.className}>
                {vm.props.closeBtn}
                <div className="modal-innercontent left-align">
                    <div className="modalHeadContent">
                        <img src={image_garanti} alt="" width="170" />
                        <div>KREDİ BAŞVURU</div>
                    </div>
                    <div className="info-credit-results">
                        <table className="table listprices-table">
                            <thead>
                                <tr>
                                    <th>Kredi Tutarı</th>
                                    <th><div className="tablePadLeft">Vade</div></th>
                                    <th><div className="tablePad">Taksit</div></th>
                                    <th>Faiz</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>{vm.props.amount} TL</td>
                                    <td><div className="tablePadLeft">{vm.props.month} AY</div></td>
                                    <td><div className="tablePad">{vm.props.installment} TL</div></td>
                                    <td>%{vm.props.interest}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {
                        !vm.state.success ? (
                            <React.Fragment>
                                <p>Devam etmek istiyorsanız aşağıdaki formları onaylayınız.</p>
                                <InputForm className="login-form" onSubmit={vm.submit}>
                                    <input type="hidden" name="advertID" value={vm.props.advert.postNo} />
                                    <br /><br />
                                    <FormInput
                                        name="tck"
                                        type="text"
                                        label="* T.C. Kimlik Numarası"
                                        mask="00000000000"
                                        disabled={vm.state.loading}
                                        validation={{
                                            required: "TCK numaranızı girmelisiniz",
                                            minLength: ["TCK numaranızı 11 hane olmalıdır", 11],
                                            maxLength: ["TCK numaranızı 11 hane olmalıdır", 11],
                                            ID: ["Girdiğiniz TCK numarası geçersizdir."]
                                        }}
                                        className="form-field"
                                    />
                                    <br />
                                    <FormInput
                                        name="phone"
                                        type="text"
                                        label="* Cep Telefonu"
                                        disabled={vm.state.loading}
                                        mask="01000000000"
                                        validation={{ required: "Cep telefonunuzu girmelisiniz", minLength: ["Geçerli bir cep telefonunu girmelisiniz", 7] }}
                                        className="form-field" />
                                    <br /><br />
                                    <FormInput
                                        name="agreement"
                                        value="1"
                                        disabled={vm.state.loading}
                                        checked
                                        type="checkbox"
                                        validation={{ required: "Üye olmak için bu bildirimi kabul etmeniz gerekmektedir." }}
                                        className="form-field small-font">
                                        TC Kimlik numaramın, başvurumun takibi amacıyla Garanti BBVA ile paylaşılmasına izin veriyorum.
                                </FormInput>
                                    <br />
                                    <FormInput
                                        name="kvkk"
                                        value="1"
                                        disabled={vm.state.loading}
                                        type="checkbox"
                                        validation={{ required: "Üye olmak bu bilgilendirmeyi kabul etmeniz gerekmektedir." }}
                                        className="form-field small-font">
                                        Kişisel verilerimin belirlenen şartlarda işlenmesine izin verdiğimi ve <Link className="field-link text-minoto" href="gdprPolicy" target="_blank" rel="noopener noreferrer">Kişisel Verilerin Korunması Hakkında Bilgilendirme</Link>’yi okuduğumuz ve kabul ettiğimi onaylıyorum.
                                </FormInput>
                                    <Btn
                                        className="form-submitbtn full-width"
                                        big wide
                                        status={(vm.state.error ? 'error' : false)}
                                        loading={vm.state.loading}
                                        disabled={vm.state.loading}
                                        type="submit">DEVAM </Btn>
                                </InputForm>
                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    <div className="bid-complete" style={{ textAlign: 'center' }}>
                                        <i className="complete-icon icon-check-round"></i>
                                        <p className="complete-description">
                                            Bilgileriniz kaydedildi, Garanti Bankası Kredi Başvuru sayfasına yönlendiriliyorsunuz.
                                             </p>
                                        <div className="complete-controls">
                                            <button type="button" className="link" onClick={closeModal}>İlana Dön</button>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                    }


                </div>
            </div>
        )
    }
}

GarantiModalRaw.defaultProps = {
    className: "",
    containerClass: "modal-bid",
    name: "garanti",
    advert: false,
}

let GarantiModal = connect(mapStateToProps)(GarantiModalRaw);
GarantiModal.props = GarantiModalRaw.defaultProps;
export default GarantiModal;