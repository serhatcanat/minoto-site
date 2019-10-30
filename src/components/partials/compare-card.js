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
import Image from "./image";

// Assets

export default class CompareCard extends React.Component {

    constructor(props) {
        super(props);

        this.removeFromCompareList = this.removeFromCompareList.bind(this);

    }

    componentDidUpdate(prevProps) {

    }



    render() {
        const {title,image,index} = this.props;
        return(
            <div className='compare-cards__item'>
                {/*<button onClick={()=> this.removeFromCompareList('adCompareList',index)}>*/}
                {/*    <i className='icon-close'/>*/}
                {/*</button>*/}
                <h2>{title}</h2>
                <Image src={storageSpace('car-posts', image)} alt={title}/>
            </div>
        )
    }
}

