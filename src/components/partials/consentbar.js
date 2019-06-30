import React from 'react';
//Deps
import CookieConsent from "react-cookie-consent";

export default class ConsentBar extends React.Component {
	render() {
		return (
			<CookieConsent
				buttonText="Tamam"
				containerClasses="consentbar"
				contentClasses="consentbar-textwrap"
				buttonClasses="btn wide low"
				cookieName="minoto-consent"
				disableStyles={true}
				expires={150}
			>
				Hizmetlerimizden en iyi şekilde faydalanabilmeniz <strong>minoto.com</strong>'da çerez teknolojisini kullanıyoruz. <strong>minoto.com</strong>'u kullanarak çerezlere izin vermiş olursunuz.
			</CookieConsent>
		)
	}
}
