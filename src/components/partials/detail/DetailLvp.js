import React from "react";
//Sections
import ContentBox from "../contentbox";
import {storageSpace} from "../../../functions";

export class DetailLVP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listItems: null
        }
    }

    //todo : combine redux state with api

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if(prevProps !== this.props ){
    //         this.getData()
    //     }
    // }

    // getData(){
    //     const vm = this;
    //     request.get('car-post/viewed', null, function (payload, status) {
    //         if (payload) {
    //             vm.setState({
    //                 listItems: payload,
    //             });
    //         }
    //     });
    // }


    componentDidMount() {

        // setTimeout(()=>{
        //     this.getData()
        // },300)
    }

    render() {
        const listItems = this.props.lvpList.data;
        const currentProduct = this.props.currentProduct;
        return (
            <>
                {listItems.length > 1 &&
                <section className="section detail-related" style={{paddingBottom:"0px",marginBottom:"0px"}}>
                    <div className="wrapper">
                        <div className="related-innerwrap">
                            <h2 className="related-title">Son Görüntülenenler</h2>
                            {
                                currentProduct && (
                                    <section className="section listing loader-container related-listing size-5">
                                        <div className='listing-content type-listing'>
                                            <div className='content-results'>

                                                {listItems.map((item, nth) => {
                                                    if (item.id !== currentProduct.id) {
                                                        return (
                                                            <li key={nth} className="results-item">
                                                                <ContentBox
                                                                    className={((item.status === 2 || item.status === 3) ? 'inactive' : '')}
                                                                    title={item.title}
                                                                    subtitle={item.dealer.title}
                                                                    image={storageSpace('c_scale,q_auto:good,w_360/car-posts', item.image)}
                                                                    price={item.price}
                                                                    labels={item.labels}
                                                                    productionPlace={item.productionPlace}
                                                                    faved={item.favorited}
                                                                    bottomNote={(item.currentViesswers > 0 ? item.currentViewers + ' kişi Bakıyor' : false)}
                                                                    url={item.slug}
                                                                    urlParams={{
                                                                        dealer: "",
                                                                        slug: "",
                                                                        post: item.postNo
                                                                    }}
                                                                />
                                                            </li>
                                                        )
                                                    }else{
                                                        return ''
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    </section>
                                )
                            }
                        </div>
                    </div>
                </section>
                }
            </>
        )
    }
}
