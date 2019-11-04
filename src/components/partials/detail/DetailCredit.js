import React from "react";
import image_garanti from '../../../assets/images/garabtiBBVA.png'
import image_isbank from '../../../assets/images/turkiye-is-bankasi.png'
// Partials
import {FormInput, InputForm} from "../forms";
import Btn from "../btn";
//Functions
import {openModal} from "../../../functions/modals"
import {formatNumber} from "../../../functions/helpers";

export class DetailCredit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            garantiInterest: "1.39",
            garantiInstallment: false,
            isbankInterest: "1.39",
            isbankInstallment: false,
            productPrice: this.props.product.price ? this.props.product.price : 500000,
            loading: false,
            error: false,
            month: 36,
            amount: false,

        };
        this.calculateInstallments = this.calculateInstallments.bind(this);
        this.calculateMaxCredit = this.calculateMaxCredit.bind(this);
        this.calculateMaxTerm = this.calculateMaxTerm.bind(this);
    }

    calculateMaxTerm() {
        const price = this.props.product.price;
        const rateChangeLimit = 120000;
        let maxTerm;

        maxTerm = parseInt(price, 10) < rateChangeLimit ? 60 : 48;
        return maxTerm
    }

    calculateMaxCredit() {
        const price = this.props.product.price;
        const rateChangeLimit = 120000;
        let maxCreditForPrice;

        if (price < rateChangeLimit) {
            maxCreditForPrice = price * 0.70;
        } else {
            let topCredit = rateChangeLimit * 0.70;
            let subCredit = (parseInt(price, 10) - rateChangeLimit) * 0.50;

            maxCreditForPrice = topCredit + subCredit;
        }
        return maxCreditForPrice;
    }

    calculateInstallments() {
        this.setState({ loading: true, error: false });
        // General rate limit for credit up top 120.000 tl rate 50% otherwise %70
        let credit = document.getElementById('creditAmount').value.replace('.', '');
        let month = document.getElementById('creditDuration').value;
        let interestGaranti = this.state.garantiInterest / 100 * 1.2;
        let interestIsbank = this.state.isbankInterest / 100 * 1.2;
        let installmentsGaranti = credit * (interestGaranti * Math.pow((1 + interestGaranti), month)) / (Math.pow(1 + interestGaranti, month) - 1);
        let installmentsIsbank = credit * (interestIsbank * Math.pow((1 + interestIsbank), month)) / (Math.pow(1 + interestIsbank, month) - 1);
        let maxCredit = this.calculateMaxCredit();
        let maxTerm = this.calculateMaxTerm();

        this.setState({
            loading: false, error: false,
            month: month,
            maxCredit: maxCredit,
            maxTerm: maxTerm,
            amount: formatNumber(Math.round(credit * 100) / 100, { showDecimals: false }),
            //garantiInstallment: parseFloat(installments).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
            //garantiInstallment: parseFloat(Math.round(installments * 100) / 100).toFixed(2)
            garantiInstallment: formatNumber(Math.round(installmentsGaranti * 100) / 100, { showDecimals: true }),
            isbankInstallment: formatNumber(Math.round(installmentsIsbank * 100) / 100, { showDecimals: true })
        });
    }


    componentDidMount() {
        this.calculateInstallments();
    }

    render() {
        let vm = this;
        const {maxCredit, maxTerm} = vm.state;
        return (
            <div className="detail-info">
                <div className="info-credit-calculation">
                    <h2>KREDİ HESAPLAMA</h2>
                    <p>Kredi tutarı aracın fiyatına göre otomatik olarak hesaplanır.</p>
                    <InputForm className="section contentpage-form grid-container" onSubmit={this.calculateInstallments}>
                        <div className="grid-row">
                            <div className="grid-col x5 m-x6">
                                <FormInput
                                    id="creditAmount"
                                    placeholder="Kredi tutarı"
                                    className="credit-price currency-after"
                                    value={this.state.productPrice ? parseInt(this.state.productPrice / 2, 10).toString() : 50000}
                                    validation={{
                                        required: "Bir tutar girmelisiniz.",
                                        minNum: ["En az 5.000TL girebilirsiniz.", 5000],
                                        maxNum: [`En fazla ${formatNumber(Math.round(maxCredit * 100) / 100, {showDecimals: false})} girebilirsiniz.`, maxCredit],
                                    }}
                                    name="credit_amount"
                                    mask="1++++++++++++++"
                                    disabled={vm.state.loading}
                                    formatNumber
                                    type="number" />
                            </div>
                            <div className="grid-col x3 m-x6 no-padding">
                                <FormInput
                                    id="creditDuration"
                                    placeholder="Vade"
                                    className="credit-price month-after"
                                    value="36"
                                    validation={{
                                        required: "Bir vade girmelisiniz.",
                                        minNum: ["En az 12 ay seçebilirsiniz.", 12],
                                        maxNum: [`En fazla ${maxTerm} ay seçebilirsiniz.`, maxTerm],
                                    }}
                                    name="credit_duration"
                                    mask="1+"
                                    disabled={vm.state.loading}
                                    formatNumber
                                    type="number" />
                            </div>
                            <div className="grid-col x4 m-x12 center">
                                <Btn
                                    type="submit"
                                    uppercase
                                    block
                                    disabled={vm.state.loading}
                                    status={this.state.submitting && 'loading'}
                                    //onClick={() => {  }}
                                    className="form-submitbtn">
                                    HESAPLA
                                </Btn>
                            </div>
                        </div>
                    </InputForm>
                </div>
                <div className="info-credit-results">
                    <table className="table listprices-table">
                        <thead>
                        <tr>
                            <th>Taksit</th>
                            <th><div className="tablePad">Faiz</div></th>
                            <th>Banka</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{this.state.garantiInstallment} TL</td>
                            <td>
                                <div className="tablePad">%{this.state.garantiInterest.replace('.', ',')}</div>
                            </td>
                            <td><img src={image_garanti} alt="" width="121" /></td>
                            <td>
                                <Btn
                                    type="submit"
                                    uppercase
                                    block
                                    disabled={this.state.submitting}
                                    status={this.state.submitting && 'loading'}
                                    onClick={() => openModal('credit', {
                                        advert: vm.props.product,
                                        installment: this.state.garantiInstallment,
                                        interest: this.state.garantiInterest,
                                        month: this.state.month,
                                        amount: this.state.amount,
                                        type: 'garanti'
                                    })}
                                    //onClick={() => { window.open('https://www.garantibbva.com.tr/tr/bireysel/krediler/tasit-arac-kredisi-hesaplama.page?cid=oth:oth:oth:bireysel-hedeffilotasitkredisi:tasitkredisi::::::375x400:oth', '_blank'); }}
                                    className="form-submitbtn">
                                    {vm.props.mobile ? (<i className="icon-new-tab"/>) : <i className="icon-new-tab"></i>}
                                </Btn>
                            </td>
                        </tr>
                        <tr>
                            <td>{this.state.isbankInstallment} TL</td>
                            <td>
                                <div className="tablePad">%{this.state.isbankInterest.replace('.', ',')}</div>
                            </td>
                            <td><img src={image_isbank} alt="" height="50"/></td>
                            <td>
                                <Btn
                                    type="submit"
                                    uppercase
                                    block
                                    disabled={this.state.submitting}
                                    status={this.state.submitting && 'loading'}
                                    onClick={() => openModal('credit', {
                                        advert: vm.props.product,
                                        installment: this.state.isbankInstallment,
                                        interest: this.state.isbankInterest,
                                        month: this.state.month,
                                        amount: this.state.amount,
                                        type: 'isbank'
                                    })}
                                    //onClick={() => { window.open('https://www.garantibbva.com.tr/tr/bireysel/krediler/tasit-arac-kredisi-hesaplama.page?cid=oth:oth:oth:bireysel-hedeffilotasitkredisi:tasitkredisi::::::375x400:oth', '_blank'); }}
                                    className="form-submitbtn">
                                    {vm.props.mobile ? (<i className="icon-new-tab"/>) :
                                        <i className="icon-new-tab"></i>}
                                </Btn>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
