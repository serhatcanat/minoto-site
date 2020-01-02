import React from 'react'
import {FormInput} from "../../components/partials/forms";
import {formatMoney} from "../../functions";

export default class OtvCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedVehicleType: '',
            selectedCase: '',
            priceInput: null,
            result: null
        };
        this.handleChange = this.handleChange.bind(this)
        this.calculateBasePrice = this.calculateBasePrice.bind(this)
    }

    handleChange(name, value) {
        this.setState({
            [name]: value
        })
    }

    handlePriceInput(value){
        const seperator = '.';
        const formattedPrice = formatMoney(value.split(seperator).join(''),0,seperator,seperator);

        this.setState({priceInput: formattedPrice});
        setTimeout(() => {
            this.calculateBasePrice();
        }, 50)
    }

    calculateBasePrice() {
        const kdvRate = 0.18;
        const {selectedVehicleType, selectedCase} = this.state;
        let {priceInput} = this.state;
        priceInput=(priceInput.toString().replace(/\./g,''));
        let withoutKdv, kdvCost, withoutOtv, otvCost, totalTax, result, otvRate;
        priceInput = parseInt(priceInput);
        const otvObj = cases[selectedVehicleType];

        if (otvObj[selectedCase - 1].bases) {
            const conditionArr = otvObj[selectedCase - 1].bases;
            let borderArr = [];

            for (let i = 0; i < conditionArr.length; i++) {
                let conditionBorder = ((conditionArr[i] + conditionArr[i] * (otvObj[selectedCase - 1].subcases[0].otv)));
                conditionBorder = conditionBorder + conditionBorder * kdvRate;
                borderArr.push(conditionBorder)
            }

            if(borderArr.length === 2){
                if (priceInput < borderArr[0]) {
                    otvRate = otvObj[selectedCase - 1].subcases[0].otv;
                } else if (borderArr[1] > priceInput && priceInput > borderArr[0]) {
                    otvRate = otvObj[selectedCase - 1].subcases[1].otv;
                } else if (priceInput > borderArr[1]) {
                    otvRate = otvObj[selectedCase - 1].subcases[2].otv;
                }
            }else if(borderArr.length === 1){
                if(priceInput < borderArr[0]){
                    otvRate = otvObj[selectedCase - 1].subcases[0].otv;
                }
                if(priceInput > borderArr[0]){
                    otvRate = otvObj[selectedCase - 1].subcases[1].otv;
                }
            }

        } else {
            otvRate = otvObj[selectedCase - 1].otv
        }

        withoutKdv = priceInput / (1 + kdvRate);
        kdvCost = priceInput - withoutKdv;
        withoutOtv = withoutKdv / (1 + otvRate);
        otvCost = withoutKdv - withoutOtv;
        totalTax = otvCost + kdvCost;
        result = withoutOtv;

        //Set result only input higher than selected value
        if (priceInput > 40000) {
            this.setState({
                result: {
                    withoutKdv: withoutKdv,
                    kdvRate: kdvRate,
                    kdvCost: kdvCost,
                    withoutOtv: withoutOtv,
                    otvRate: otvRate,
                    otvCost: otvCost,
                    totalTax: totalTax,
                    total: result,
                }
            })
        } else {
            this.setState({
                result: null
            })
        }
        // const otvRate = otvObj[selectedCase-1].otv;
    }

    render() {
        const {selectedVehicleType, selectedCase, priceInput, result} = this.state;
        return (
            <div className="row">
                <div className="col">
                    <FormInput
                        type="select"
                        className="form-field name"
                        icon="user"
                        popLabel
                        name="selectedVehicleType"
                        placeholder="Araç türünü seçiniz"
                        validation={{
                            required: "Araç türünü seçiniz",
                        }}
                        options={vehicleTypes}
                        onChange={(v) => {
                            this.setState({selectedCase: ''});
                            this.handleChange('selectedVehicleType', v);
                        }}/>
                    <FormInput
                        type="select"
                        className="form-field name"
                        icon="user"
                        value={cases[selectedVehicleType] ? cases[selectedVehicleType][0].value : cases[selectedVehicleType]}
                        popLabel
                        name="selectedCase"
                        placeholder="Motor / Silindir Hacmi - Lütfen önce araç türünü seçiniz."
                        validation={{
                            required: "Motor / Silindir Hacmi - Lütfen önce araç türünü seçiniz.",
                        }}
                        options={cases[this.state.selectedVehicleType]}
                        onChange={(v) => {
                            this.setState({priceInput: ''})
                            this.handleChange('selectedCase', v);
                        }}/>
                    {selectedCase &&
                    // todo : add turkish lira icon

                    <FormInput
                        addon="try"
                        type="number"
                        className="form-field name"
                        value={priceInput}
                        popLabel
                        name="priceInput"
                        placeholder="Aracın Anahtar Teslim Vergili Fiyatı"
                        onChange={(e) => {
                            this.handlePriceInput(e);
                        }}/>
                    }
                </div>

                <div className="col calculator-results">
                    {result &&
                    <Result result={result}/>
                    }
                </div>
                <div >
                    <p className='info-paragraph'>* Fiyat tamamen bilgi amaçlı verilmiştir, gerçek fiyat bayide değişiklik gösterebilir.</p>
                </div>
            </div>
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
                    <p>Aracın Ötv İndirimli Fiyatı</p>
                </div>
                <div className="col">
                    <p>{formatMoney(result.total)} TL</p>
                </div>
            </div>
        </>
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

];

const cases = {

    "car": [
        {
            label: '1600 cm³\'e kadar',
            value: 1,
            bases: [70000, 120000],
            subcases: [
                {
                    case: 0,
                    otv: 0.45
                },
                {
                    case: 1,
                    otv: 0.5
                },
                {
                    case: 2,
                    otv: 0.6
                }
            ]
        },
        {
            label: '1601 cm³ ile 2.000 cm³ arası',
            value: 2,
            otv: 0.5,
            bases: [170000],
            subcases: [
                {
                    case: 0,
                    otv: 1
                },
                {
                    case: 1,
                    otv: 1.10
                },
            ]

        },
        {
            label: '2000 cm³ üzeri',
            value: 3,
            otv: 1.6
        }
    ],
    "hybrid": [
        {
            label: '50 kW\'ı geçip, 1800 cm³\'ü geçmeyen',
            value: 1,
            bases: [85000, 135000],
            subcases: [
                {
                    case: 0,
                    otv: 0.45
                },
                {
                    case: 1,
                    otv: 0.5
                },
                {
                    case: 2,
                    otv: 0.6
                }
            ]
        },
        {
            label: '100 kW’ı geçip, 2000 cm³\'- 2500 cm³ arasında',
            value: 2,
            otv: 0.5,
            bases: [170000],
            subcases: [
                {
                    case: 0,
                    otv: 1
                },
                {
                    case: 1,
                    otv: 1.10
                },
            ]

        },
        {
            label: '100 kW’ı geçip, 2000 cm³\'- 2500 cm³ arasında',
            value: 3,
            otv: 1.1
        },
        {
            label: 'Diğerleri',
            value: 4,
            otv: 1.6
        }
    ],
    "electric": [
        {
            label: '85 kW\'ı geçmeyen\n',
            value: 0,
            otv: 0.3
        },
        {
            label: '85 kW\'ı geçip, 120 kW\'ı geçmeyen\n',
            value: 1,
            otv: 0.4
        },
        {
            label: '120 kW üzeri\t',
            value: 3,
            otv: 0.15
        },
    ],
};
