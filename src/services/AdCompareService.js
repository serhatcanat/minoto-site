import * as client from "./Client";

import UrlAssembler from "url-assembler";
import {GET_VEHICLE_DETAIL_ENDPOINT} from "./apiEndpoints";

export class AdCompareService {
    detail = (id,email) => {
        const url = UrlAssembler()
            .template(GET_VEHICLE_DETAIL_ENDPOINT)
            .param('id', id)
            .param('email', email);
        return client.get(url);
    };
}
