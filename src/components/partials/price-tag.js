import React from 'react';

// Partials

// Deps
import { formatNumber } from 'functions/helpers'

// Assets

export default class PriceTag extends React.Component {

	render() {
		let priceData = formatNumber(this.props.price, {showDecimals: true}).split(',');
		return (
			<span className={"pricetag " + this.props.className}>
				<span className="pricetag-base">{priceData[0]}</span>{priceData[1] && <React.Fragment><span className="pricetag-decimal">,{priceData[1]}</span></React.Fragment>} <span className="pricetag-currency">TL</span>
			</span>
		)
	}
}

PriceTag.defaultProps = {
	className: "",
}