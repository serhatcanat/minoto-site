import React from 'react'
// import {FormInput} from "../components/partials/forms";

export default class Otv extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOtv: null,
            totalPrice: null,
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(name, value) {
        this.setState({
            name: value
        })
    }

    render() {
        // const vehicleTypes = [
        //     {
        //         value: 'car',
        //         label: 'Otomobil'
        //     },
        //     {
        //         value: 'hybrid',
        //         label: 'Hibrit Araç'
        //     },
        //     {
        //         value: 'electric',
        //         label: 'Elektrikli Araç'
        //     },
        //     {
        //         value: 'autobus',
        //         label: 'Otobus'
        //     }
        // ];

        // const cases = {
        //     "car": [
        //         {
        //             label: '1600 cm³\'e kadar',
        //             value: '0'
        //         },
        //         {
        //             label: '1600 cm³\'e kadar',
        //             value: '0'
        //         },
        //         {
        //             label: '1600 cm³\'e kadar',
        //             value: '0'
        //         }
        //     ]
        // }

        return (
            <main className="page content">
                <section className="section contentpage">
                    <div className="contentpage-wrap wrapper narrow">
                        <div className="contentpage-content">
                            <h1 className="content-title">Otv Hesaplama</h1>
                            {/*<FormInput*/}
                            {/*    type="select"*/}
                            {/*    className="form-field name"*/}
                            {/*    icon="user"*/}
                            {/*    value={this.state.cardName}*/}
                            {/*    popLabel*/}
                            {/*    name="totalPrice"*/}
                            {/*    placeholder="Araç Fiyatı"*/}
                            {/*    validation={{*/}
                            {/*        required: "Ad ve soyadınızı girmelisiniz.",*/}
                            {/*    }}*/}
                            {/*    options={[{label: 'taha', value: '1'}]}*/}
                            {/*    onChange={(v) => {*/}
                            {/*        this.handleChange('totalPrice', v);*/}
                            {/*    }}/>*/}
                        </div>
                    </div>
                </section>
            </main>

        )
    }
}
