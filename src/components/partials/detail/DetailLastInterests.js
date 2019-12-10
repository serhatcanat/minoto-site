import React from "react";
//Sections
import Listing from '../../sections/listing'

export class DetailLastInterests extends React.Component {
    render() {
        return (
            <Listing
                className="related-listing"
                urlBinding={false}
                filters={false}
                topSection={false}
                GAGroup="Son Görüntülediğiniz Araçlar"
                source={`car-post/viewed`}
                //source="/dummy/data/detail-related.json"
                size={5} showAds={false}/>
        )
    }
}
