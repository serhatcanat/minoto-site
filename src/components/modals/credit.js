import React from 'react'
// Partials
import {FormInput, InputForm} from 'components/partials/forms'
import Btn from 'components/partials/btn'
import Link from 'components/partials/link'
import request from 'controllers/request'
// Deps
import {connect} from "react-redux"
import {closeModal} from 'functions/modals'
import {storageSpace} from "../../functions";

const mapStateToProps = state => {
    return {
        user: state.user.user,
    };
};

class CreditModalRaw extends React.Component {
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
        const {banksInterest} = vm.props;

        vm.setState({loading: true, error: false});
        let record = {
            postNo: e.target.elements.advertID.value,
            identityNumber: e.target.elements.tck.value,
            phone: e.target.elements.phone.value,
            bankName: banksInterest.name,
            id: banksInterest.id
        };

        let blockPrevent = window.open('', '_blank');
        request.post(`credit-requests`, record, function (payload) {
            setTimeout(function () {
                vm.setState({ loading: false, success: true, message: "" });
                blockPrevent.document.write("Yönlendirme Yapılıyor Lütfen Bekleyiniz...");
                blockPrevent.location.href = banksInterest.url;
            }, 1000);
        })
    }

    render() {
        let vm = this;
        const {type,banksInterest} = vm.props;
        return (
            <div className={vm.props.className}>
                {vm.props.closeBtn}
                <div className="modal-innercontent left-align">
                    <div className="modalHeadContent">
                        {type === 'Garanti BBVA' ?
                            (<img src={storageSpace('c_scale,q_auto:good,w_400/library', banksInterest.image)} alt={banksInterest.name} width="170"/>)
                            : (<img src={storageSpace('c_scale,q_auto:good,w_400/library', banksInterest.image)} alt={banksInterest.name} width="170"/>)
                        }
                        <div>KREDİ BAŞVURU</div>
                    </div>
                    <div className="info-credit-results">
                        <table className="table listprices-table">
                            <thead>
                            <tr>
                                <th>Kredi Tutarı</th>
                                <th>
                                    <div className="tablePadLeft">Vade</div>
                                </th>
                                <th>
                                    <div className="tablePad">Taksit</div>
                                </th>
                                <th>Faiz</th>
                            </tr>
                            </thead>

                            <tbody>
                            <tr>
                                <td>{vm.props.amount} TL</td>
                                <td>
                                    <div className="tablePadLeft">{vm.props.month} AY</div>
                                </td>
                                <td>
                                    <div className="tablePad">{vm.props.installment} TL</div>
                                </td>
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
                                        TC Kimlik numaramın, başvurumun takibi amacıyla
                                        {type === 'garanti' ?
                                            ' Garanti BBVA '
                                            : ' İş Bankası '
                                        }
                                        ile paylaşılmasına izin veriyorum.
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
                                <div className="bid-complete" style={{textAlign: 'center'}}>
                                    <i className="complete-icon icon-check-round"></i>
                                    <p className="complete-description">
                                        Bilgileriniz kaydedildi,
                                        {type === 'Garanti BBVA' ?
                                            ' Garanti Bankası '
                                            : ' İş Bankası '
                                        }
                                         Kredi Başvuru sayfasına
                                        yönlendiriliyorsunuz.
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

CreditModalRaw.defaultProps = {
    className: "",
    containerClass: "modal-bid",
    name: "credit",
    advert: false,
}

let GarantiModal = connect(mapStateToProps)(CreditModalRaw);
GarantiModal.props = CreditModalRaw.defaultProps;
export default GarantiModal;
