import React from "react";
//Sections
import Listing from '../../sections/listing'

export class DetailRelated extends React.Component {
    render() {
        return (
            <>
                <Listing
                    className="related-listing"
                    urlBinding={false}
                    filters={false}
                    topSection={false}
                    GAGroup="Benzer İlanlar"
                    source={`car-posts/detail/${this.props.postId}/similar`}
                    //source="/dummy/data/detail-related.json"
                    query={this.props.postId} size={5} showAds={false}/>
            </>
        )
    }
}
