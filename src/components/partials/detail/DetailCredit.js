import React from "react";
// Partials
import {FormInput, InputForm} from "../forms";
import Btn from "../btn";
//Functions
import {openModal} from "../../../functions/modals"
import {formatNumber} from "../../../functions/helpers";
import {storageSpace} from "../../../functions";

export class DetailCredit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            garantiInterest: "1.23",
            garantiInstallment: false,
            isbankInterest: "1.10",
            isbankInstallment: false,
            productPrice: this.props.product.price ? this.props.product.price : 500000,
            loading: false,
            error: false,
            amount: false,
            credit:this.props.product.initialCredit ? this.props.initialCredit : 500000,
            month: this.props.product.initialMonth ? this.props.product.initialMonth : 36,
        };
        this.calculateInstallments = this.calculateInstallments.bind(this);
        this.calculateMaxCredit = this.calculateMaxCredit.bind(this);
        this.calculateMaxTerm = this.calculateMaxTerm.bind(this);
    }


    calculateMaxTerm() {
        const price = this.props.product.price;
        const rateChangeLimit = 120000;
        // If product price lower than 120.000 TL maxTerm = 60  else maxTerm = 48
        let maxTerm;
        maxTerm = parseInt(price, 10) < rateChangeLimit ? 60 : 48;

        return maxTerm
    }

    calculateMaxCredit() {
        const price = this.props.product.price;
        // When price lower than 120.0000 TL multiply by .70 else .50
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
        let maxCredit = this.calculateMaxCredit();
        let maxTerm = this.calculateMaxTerm();

        this.setState({
            loading: false, error: false,
            credit: credit,
            month: month,
            maxCredit: maxCredit,
            maxTerm: maxTerm,
            amount: formatNumber(Math.round(credit * 100) / 100, { showDecimals: false }),
        });
    }


    componentDidMount() {
        this.calculateInstallments();
    }

    render() {
        const {carCredits, banksInterests} = this.props.product;
        const {month,credit} = this.state
        let vm = this;

        return (
            <>
                {carCredits &&
                <div className="detail-info">
                    <div className="info-credit-calculation">
                        <h2>KREDİ HESAPLAMA</h2>
                        <p>Kredi tutarı aracın fiyatına göre otomatik olarak hesaplanır.</p>
                        <InputForm className="section contentpage-form grid-container"
                                   onSubmit={this.calculateInstallments}>
                            <div className="grid-row">
                                <div className="grid-col x5 m-x6">
                                    <FormInput
                                        id="creditAmount"
                                        placeholder="Kredi tutarı"
                                        className="credit-price currency-after"
                                        value={parseInt(carCredits.initialCredit).toString()}
                                        validation={{
                                            required: "Bir tutar girmelisiniz.",
                                            minNum: ["En az 5.000TL girebilirsiniz.", 5000],
                                            maxNum: [`En fazla ${formatNumber(Math.round(parseInt(carCredits.maxCreditForPrice) * 100) / 100, {showDecimals: false})} girebilirsiniz.`, parseInt(carCredits.maxCreditForPrice)],
                                        }}
                                        name="credit_amount"
                                        mask="1++++++++++++++"
                                        disabled={vm.state.loading}
                                        formatNumber
                                        type="number"/>
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
                                            maxNum: [`En fazla ${carCredits.maxTerm} ay seçebilirsiniz.`, carCredits.maxTerm],
                                        }}
                                        name="credit_duration"
                                        mask="1+"
                                        disabled={vm.state.loading}
                                        formatNumber
                                        type="number"/>
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
                                <th>
                                    <div className="tablePad">Faiz</div>
                                </th>
                                <th>Banka</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {banksInterests.map((bank, nth) => {
                                const interest = bank.rate / 100 * 1.2;

                                let installments = credit * (interest * Math.pow((1 + interest), month)) / (Math.pow(1 + interest, month) - 1);
                                installments= formatNumber(Math.round(installments * 100) / 100, { showDecimals: true });
                                return (
                                    <tr key={nth}>
                                        <td>{installments} TL</td>
                                        <td>
                                            <div className="tablePad">%{bank.rate.toString().replace('.', ',')}</div>
                                        </td>
                                        <td><img src={storageSpace('c_scale,q_auto:good,w_400/library', bank.image)}
                                                 alt="" width="121"/></td>
                                        <td>
                                            <Btn
                                                type="submit"
                                                uppercase
                                                block
                                                disabled={this.state.submitting}
                                                status={this.state.submitting && 'loading'}
                                                onClick={() => openModal('credit', {
                                                    advert: vm.props.product,
                                                    installment: installments,
                                                    interest: bank.rate,
                                                    month: month,
                                                    amount: credit,
                                                    type: bank.name,
                                                    banksInterest: bank,
                                                })}
                                                className="form-submitbtn">
                                                {vm.props.mobile ? (<i className="icon-new-tab"/>) :
                                                    <i className="icon-new-tab"></i>}
                                            </Btn>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
                }
            </>
        )
    }
}
