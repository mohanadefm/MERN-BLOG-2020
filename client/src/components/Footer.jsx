import React from "react";
import "../style.css"

function Footer() {
	const date = new Date().getFullYear();
	
	return <div className="footer">
		<p>Copyright Reserved {date}</p>
	</div>
};

export default Footer;