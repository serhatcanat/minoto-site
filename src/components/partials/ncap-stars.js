import React from 'react';
import PopInfo from "./popinfo";


const ncapDescriptions = [
    "1 yıldızlı güvenlik: Marjinal çarpışma koruması.",
    "2 yıldızlı güvenlik: Nominal çarpışma koruması ancak çarpışmadan kaçınma teknolojisi yok.",
    "3 yıldızlı güvenlik: Yolcu koruma konusunda ortalama ile iyi arasında ancak çarpışmadan kaçınma teknolojisi yok.",
    "4 yıldızlı güvenlik: Çarpışma korumasına yönelik toplam iyi performans; ilave çarpışmadan kaçınma teknolojisi mevcut olabilir.",
    "5 yıldızlı güvenlik: Çarpışma korumasına yönelik toplam iyi performans. Sağlam çarpışmadan kaçınma ekipmanı ile donatılmış."
];

export default function NcapStars(props) {
    const {ncap, info} = props;
    return (
        <div className="info-ncap">
            <div className="ncap-stars" title={ncap + ' Yıldız'}>
                <i className={"icon-star" + (ncap >= 1 ? ' active' : '')}/>
                <i className={"icon-star" + (ncap >= 2 ? ' active' : '')}/>
                <i className={"icon-star" + (ncap >= 3 ? ' active' : '')}/>
                <i className={"icon-star" + (ncap >= 4 ? ' active' : '')}/>
                <i className={"icon-star" + (ncap >= 5 ? ' active' : '')}/>
            </div>
            {info &&
                <PopInfo className="ncap-info" wide content={ncapDescriptions[ncap - 1]}>
                    <i className="icon-question"/>
                </PopInfo>
            }

        </div>

    );
}

NcapStars.defaultProps = {
    info: true,
}
