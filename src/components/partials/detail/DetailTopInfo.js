import React from 'react'
// Sections
// Partials
import Image from '../image'
import FavBtn from '../favbtn'
//Functions
import {openModal} from "../../../functions/modals"
export class DetailTopInfo extends React.Component {
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
                <button className="controls-btn" onClick={() => openModal('share')}><i className="icon-share"/></button>
                <FavBtn className="controls-btn" faved={favorited} type={"post"} id={id}/>
            </div>
            }
        </div>
    }
}
