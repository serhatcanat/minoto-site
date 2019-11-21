import React from 'react'
// Sections
// Partials
import Image from '../image'
import FavBtn from '../favbtn'
//Functions
import {openModal} from "../../../functions/modals"
import {CompareListService} from "../../../functions";
export class DetailTopInfo extends React.Component {

    setCompareList(){
        const product = this.props.productData;

        const storedList = this.props.compareList.data;

        const _compareListService = new CompareListService();

        if (!_compareListService.isExist(product,storedList)){
            this.props.addVehicleToCompare(product);
        }
        openModal('compare',{history:this.props.history});
    }

    render() {
        let product = this.props.product;
        const {highlights, id, postNo, favorited} = product;
        return <div className="section detail-topinfo">
            {(highlights && !this.props.mobile) &&
            <ul className={"topinfo-highlights"}>
                {highlights.map((highlight, nth) => (
                    <React.Fragment key={nth}>
                        {
                            highlight.label && (
                                <li key={nth} title={highlight.title}>{(highlight.image ?
                                        <Image alt={highlight.title} src={`/dummy/images/${highlight.image}`}/>
                                        :
                                        <span>{highlight.label}</span>
                                )}</li>
                            )
                        }
                    </React.Fragment>
                ))}
            </ul>
            }
            <div className={"topinfo-id"}>
                <strong>İlan No:</strong> {postNo}
            </div>
            {this.props.mobile &&
            <div className={"topinfo-controls"}>
                {/*<button className="controls-btn"*/}
                {/*        onClick={() => this.setCompareList()}><i*/}
                {/*    className="icon-compare" aria-label="Karşılaştır"/>*/}
                {/*    <span>*/}
                {/*        ({ this.props.compareList.data.length})*/}
                {/*    </span>*/}
                {/*</button>*/}
                <button className="controls-btn" onClick={() => openModal('share')} aria-label="Paylaş"><i className="icon-share"/></button>
                <FavBtn className="controls-btn" faved={favorited} type={"post"} id={id}/>
            </div>
            }
        </div>
    }
}
