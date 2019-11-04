module.exports = {
	types: [
		{
			name: 'amex',
			title: "American Express",
			pattern: /^3[47]/,
			valid_length: [15],
			cvv_length: 4,
		}, {
			name: 'troy',
			title: 'Troy',
			pattern: /^9792/,
			valid_length: [16],
			cvv_length: 3,
		}, {
			name: 'diners_club_carte_blanche',
			title: "Diners Club Carte Blanche",
			pattern: /^30[0-5]/,
			valid_length: [14],
			cvv_length: 3,
		}, {
			name: 'diners_club_international',
			title: "Diners Club International",
			pattern: /^36/,
			valid_length: [14],
			cvv_length: 3,
		}, {
			name: 'jcb',
			title: "JCB",
			pattern: /^35(2[89]|[3-8][0-9])/,
			valid_length: [16],
			cvv_length: 3,
		}, {
			name: 'laser',
			title: 'Laser',
			pattern: /^(6304|670[69]|6771)/,
			valid_length: [16, 17, 18, 19],
			cvv_length: 3,
		}, {
			name: 'visa_electron',
			title: 'Visa Electron',
			pattern: /^(4026|417500|4508|4844|491(3|7))/,
			valid_length: [16],
			cvv_length: 3,
		}, {
			name: 'visa',
			title: 'Visa',
			pattern: /^4/,
			valid_length: [16],
			cvv_length: 3,
		}, {
			name: 'mastercard',
			title: 'Master Card',
			pattern: /^5[1-5]/,
			valid_length: [16],
			cvv_length: 3,
		}, {
			name: 'maestro',
			title: 'Maestro',
			pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
			valid_length: [12, 13, 14, 15, 16, 17, 18, 19],
			cvv_length: 3,
		}, {
			name: 'discover',
			title: 'Discover',
			pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
			valid_length: [16],
			cvv_length: 3,
		}
	],
	check: function(number){
		let numberOK = false;
		let typeOK = true;

		let type = this.getType(number);
		if(type){
			if(type.valid_length.indexOf(number.toString().length) === -1){
				typeOK = false;
			}
		}

		// Step1
		let numberArray = number.toString().split('').map(function(str){ return parseInt(str) }).reverse();
		let i = 0;
		for (i = 0; i < numberArray.length; i++) {
			if (i % 2 !== 0) {
				numberArray[i] = numberArray[i] * 2;
				if (numberArray[i] > 9) {
					numberArray[i] = parseInt(String(numberArray[i]).charAt(0)) + parseInt(String(numberArray[i]).charAt(1))
				}
			}
		}
		let sum = 0;
		for (i = 1; i < numberArray.length; i++) {
			sum += numberArray[i];
		}
		sum = sum * 9 % 10;
		if (numberArray[0] === sum) {
			numberOK = true
		}

		return (numberOK && typeOK);
	},
	getType: function(number){
		let ret = false;
		for (let i = 0; i < this.types.length; i++) {
			if (number.match(this.types[i].pattern)) {
				ret = this.types[i];
			}
		}
		return ret;
	}
}
