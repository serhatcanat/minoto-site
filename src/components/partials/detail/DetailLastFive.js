import React from "react";
//Sections
import request from '../../../controllers/request'
import ContentBox from "../contentbox";
import {seoFriendlyUrl, storageSpace} from "../../../functions";

export class DetailLastFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listItems: null
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props ){
            this.getData()
        }
    }


    getData(){
        const vm = this;
        request.get('car-post/viewed', null, function (payload, status) {
            if (payload) {

                vm.setState({
                    listItems: payload,
                });
            }
        });
    }
    componentDidMount() {
    setTimeout(()=>{
        this.getData()
    },300)

    }

    render() {
        const {listItems} = this.state;
        return (
            <>
                <section className="section listing loader-container related-listing size-5">
                    <div className='listing-content type-listing'>
                        <div className='content-results'>
                            {listItems &&
                            listItems.results.map((item, nth) => {
                                return (
                                    <li key={nth} className="results-item">
                                        <ContentBox
                                            className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
                                            title={item.title}
                                            subtitle={item.dealer}
                                            image={storageSpace('c_scale,q_auto:good,w_360/car-posts', item.image)}
                                            price={item.price}
                                            labels={item.labels}
                                            productionPlace={item.productionPlace}
                                            faved={item.favorited}
                                            badge={(item.status === 1 ? false : (item.status === 2 ? {
                                                text: 'Rezerve',
                                                note: '02.02.2019 Tarihine Kadar Opsiyonludur'
                                            } : {text: 'Satıldı', type: 'error'}))}
                                            bottomNote={(item.currentViewers > 0 ? item.currentViewers + ' kişi Bakıyor' : false)}
                                            url="detail"
                                            urlParams={{
                                                dealer: seoFriendlyUrl(item.dealer),
                                                slug: item.slug.substring(0, item.slug.lastIndexOf('-M')),
                                                post: item.postNo
                                            }}
                                        />
                                    </li>
                                )
                            })
                            }
                        </div>
                    </div>
                </section>
            </>
        )
    }
}

