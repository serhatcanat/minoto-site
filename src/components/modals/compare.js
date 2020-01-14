import React from 'react'
//Partials
import {closeModal} from 'functions/modals'
import CompareCard from './compare/card'
import {addVehicleToCompare, deleteVehicleFromCompare} from "../../actions";
import {connect} from "react-redux";
import Btn from "../partials/btn";
//Functions

// Deps
class CompareModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compareList: [],
        };
        this.removeFromCompareList = this.removeFromCompareList.bind(this);
        this.openComparePage = this.openComparePage.bind(this);
    }

    openComparePage() {
        closeModal();
        this.props.history.push('/ilan-karsilastir')
    }

    removeFromCompareList(id) {
        this.props.deleteVehicleFromCompare(id);
    }

    render() {
        let vm = this;
        const compareList = this.props.compareList.data;
        const {mobile} = this.props;
        let message;
        message = compareList.length ? 'İlan karşılaştırma listesine eklenmiştir.' : 'Karşılaştırma listenizde ürün bulunmamaktadır.';
        return (
            <div className={vm.props.className}>
                <div className="modal-innercontent compare-modal">
                    <p>ARAÇ KARŞILAŞTIR</p>
                    <span className='compare-modal--message'>{message}</span>
                    <div className='modal-center'>
                        <div className='scroll-container'>
                            <div className="compare-cards">
                                {compareList &&
                                compareList.map((product, index) => (
                                    <CompareCard key={product.id} mobile={this.props.mobile} productProp={product}
                                                 index={index}
                                                 removeFromList={this.removeFromCompareList}/>
                                ))
                                }
                            </div>
                        </div>
                    </div>
                    {compareList.length > 1 ? (
                        mobile ? (
                                <div className='modal-footer'>
                                    <Btn onClick={() => {
                                        this.openComparePage()
                                    }}>{compareList.length} İlanı Karşılaştır</Btn>
                                </div>
                            ) :
                            <div className='modal-footer'>
                            <Btn onClick={() => {
                                this.openComparePage()
                            }}>İLANLARI KARŞILAŞTIR</Btn>
                            </div>

                    ) : ''
                    }
                </div>
                {vm.props.closeBtn}


            </div>
        )
    }
}

CompareModal.defaultProps = {
    className: "",
    containerClass: "modal-compare",
    name: "compare",
};


const mapStateToProps = ({generic, user, compareList, reservation}) => {
    return {mobile: generic.mobile, user: user.user, compareList, reservation};
};

const mapDispatchToProps = dispatch => {
    return {
        addVehicleToCompare: (data) => dispatch(addVehicleToCompare(data)),
        deleteVehicleFromCompare: (data) => dispatch(deleteVehicleFromCompare(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareModal);
