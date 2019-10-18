import React from 'react'
//Partials
import CompareCard from '../partials/compare-card'
//Functions
import {getFromLStorage} from '../../functions/localstorage'
// Deps

export default class CompareModal extends React.Component {
    render() {
        let vm = this;
        const compareList = getFromLStorage('adCompareList');

        return (
            <div className={'minoto-ui ' + vm.props.className}>
                {vm.props.closeBtn}
                <div className="modal-innercontent">
                    <h2>Karşılaştır</h2>
                    <div className="compare-cards">
                        {compareList &&
                            compareList.map((item, index) => (
                                    <CompareCard title={item.title} image={item.image} index={index}/>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

CompareModal.defaultProps = {
    className: "",
    containerClass: "modal-compare",
    name: "compare"
};
