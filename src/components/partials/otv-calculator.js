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
            if (priceInput < 303200) {
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
                    },
                    message: null
                })
            } else {
                this.setState({
                    result: null,
                    message: "??tv indirimi i??in maksimum ara?? de??eri 303.200 TL'nin alt??nda olmal??d??r."
                })
            }
        } else {
            this.setState({
                result: null,
                message: 'Minimum 40.000 TL tutar??nda giri?? yapmal??s??n??z.'
            })
        }
        // const otvRate = otvObj[selectedCase-1].otv;
    }

    render() {
        const {selectedVehicleType, selectedCase, priceInput, result, message} = this.state;
        return (
            <div className="row">
                <div className="col">
                    <FormInput
                        type="select"
                        className="form-field name"
                        icon="user"
                        popLabel
                        name="selectedVehicleType"
                        placeholder="Ara?? t??r??n?? se??iniz"
                        validation={{
                            required: "Ara?? t??r??n?? se??iniz",
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
                        placeholder="Motor / Silindir Hacmi - L??tfen ??nce ara?? t??r??n?? se??iniz."
                        validation={{
                            required: "Motor / Silindir Hacmi - L??tfen ??nce ara?? t??r??n?? se??iniz.",
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
                        placeholder="Arac??n Anahtar Teslim Vergili Fiyat??"
                        onChange={(e) => {
                            this.handlePriceInput(e);
                        }}/>
                    }
                </div>

                <div className="col calculator-results">
                    {message &&
                    <p className='calculator-results--message'>{message}</p>
                    }
                    {result &&
                    <Result result={result}/>
                    }
                </div>
                <div >
                    <p className='info-paragraph'>* Fiyat tamamen bilgi ama??l?? verilmi??tir, ger??ek fiyat bayide de??i??iklik g??sterebilir.</p>
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
                    <p>??tv Oran??</p>
                </div>
                <div className="col">
                    <p>%{result.otvRate * 100}</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>??tv Tutar??</p>
                </div>
                <div className="col">
                    <p>{formatMoney(result.otvCost)} TL</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>Kdv Oran??</p>
                </div>
                <div className="col">
                    <p>%{result.kdvRate * 100}</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>KDV Tutar??</p>
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
                    <p>Arac??n ??tv ??ndirimli Fiyat??</p>
                </div>
                <div className="col">
                    <p>{formatMoney(result.total+result.kdvCost)} TL</p>
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
        label: 'Hibrit Ara??'
    },
    {
        value: 'electric',
        label: 'Elektrikli Ara??'
    },

];

const cases = {

    "car": [
        {
            label: '1600 cm??\'e kadar',
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
            label: '1601 cm?? ile 2.000 cm?? aras??',
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
            label: '2000 cm?? ??zeri',
            value: 3,
            otv: 1.6
        }
    ],
    "hybrid": [
        {
            label: '50 kW\'?? ge??ip, 1800 cm??\'?? ge??meyen',
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
            label: '100 kW????? ge??ip, 2000 cm??\'- 2500 cm?? aras??nda',
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
            label: '100 kW????? ge??ip, 2000 cm??\'- 2500 cm?? aras??nda',
            value: 3,
            otv: 1.1
        },
        {
            label: 'Di??erleri',
            value: 4,
            otv: 1.6
        }
    ],
    "electric": [
        {
            label: '85 kW\'?? ge??meyen\n',
            value: 0,
            otv: 0.3
        },
        {
            label: '85 kW\'?? ge??ip, 120 kW\'?? ge??meyen\n',
            value: 1,
            otv: 0.4
        },
        {
            label: '120 kW ??zeri\t',
            value: 3,
            otv: 0.15
        },
    ],
};
