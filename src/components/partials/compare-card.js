import React from 'react';
// Partials
//Functions
import {storageSpace} from "functions/helpers"
// Deps
import Image from "./image";

// Assets

export default class CompareCard extends React.Component {
    constructor(props) {
        super(props);
        this.removeFromCompareList = this.removeFromCompareList.bind(this);
    }

    render() {
        const {title,image} = this.props;
        return(
            <div className='compare-cards__item'>
                <h2>{title}</h2>
                <Image src={storageSpace('car-posts', image)} alt={title}/>
            </div>
        )
    }
}

