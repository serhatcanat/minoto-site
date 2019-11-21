import React from 'react';
// Components
import Image from "../../partials/image";
import PriceTag from "../../partials/price-tag";
import Btn from "../../partials/btn";
//Functions
import {storageSpace} from "functions/helpers"
export default class CompareCard extends React.Component {
    render() {
        const {id, title, image, price} = this.props.productProp;
        const {removeFromList,mobile} = this.props;
        return(
            <div className='compare-cards__item'>
                {/*<button onClick={()=> this.removeFromCompareList('adCompareList',index)}>*/}
                {/*    <i className='icon-close'/>*/}
                {/*</button>*/}
                <Image src={storageSpace('car-posts', image)} alt={title}/>
                <h4>{title}</h4>
                <PriceTag price={price} />
                {!mobile &&
                    <Btn onClick={() => removeFromList(id)}>Listeden Kaldır</Btn>
                }
                { mobile &&
                    <button onClick={() => removeFromList(id)} className="btn__cancel-circle" type="button">
                        <i className="icon-close"></i>
                    </button>
                }

            </div>
        )
    }
}

