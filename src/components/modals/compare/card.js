import React from 'react';
import PropTypes from 'prop-types';

// Partials
import PopInfo from 'components/partials/popinfo.js';
import Link from 'components/partials/link.js';
//Functions
import { storageSpace } from "functions/helpers"

// Deps
import omit from 'lodash/omit'
import clone from 'lodash/clone'
import PriceTag from "../../partials/price-tag";
import Btn from "../../partials/btn";
import {openModal} from "../../../functions";

// Assets

export default class CompareCard extends React.Component {
    render() {
        const {id,title,image,index,listingPrice,price} = this.props.productProp;
        const {removeFromList} = this.props;
        return(
            <div className='compare-cards__item'>
                {/*<button onClick={()=> this.removeFromCompareList('adCompareList',index)}>*/}
                {/*    <i className='icon-close'/>*/}
                {/*</button>*/}
                <h4>{title}</h4>
                <img src={storageSpace('car-posts', image)} alt={title}/>
                <PriceTag price={price} />
                <Btn onClick={() => removeFromList(id)}>Listeden Kaldır</Btn>
            </div>
        )
    }
}

