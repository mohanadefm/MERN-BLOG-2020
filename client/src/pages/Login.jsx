import React, { useState } from "react";
import axios from "axios";
import { URL } from "../config";
import jwt_decode from "jwt-decode";
import { saveAuthToken } from "../config";
//===================================================================================================
const Login = (props) => {
	const [form   , setValues ] = useState({ email:"", password:"" });
	const [message, setMessage] = useState("");
	const [successfullyLoggedIn, setSuccessfullyLoggedIn] = useState(null);
	
	const handleChange = (e) => {
		setValues({ ...form, [e.target.name]: e.target.value });
	};
	// how to make blog logout user if he did not start button or not active?
	const handleSubmit = async (e) => { // why welcome message is not working??
		e.preventDefault();
		try{
			const response = await axios.post(`${URL}/users/login`, {email:form.email, password:form.password});
			const { ok,message,data } = response.data;
			if(ok){
				setMessage(message);
				setSuccessfullyLoggedIn(true);
				//save user token inside browser localstorage.
				saveAuthToken(data.token); 
				props.setUser(jwt_decode(data.token));
				// setTimeout(() => {
				//   props.history.push("/posts");
				// }, 2000);
			}else{
				setMessage(message);
				setSuccessfullyLoggedIn(false);
			};
		}
		catch(e){
			setMessage("Try again!");
			setSuccessfullyLoggedIn(false);
		}
	};
	
	return <div className="login">
		<form onSubmit={handleSubmit} onChange={handleChange} className="login-box">

			<label>Email   </label>	<input name="email"    />
			<label>Password</label>	<input name="password" />

			<button type="submit" name="submit">Login</button>

			{ message? <h4 style={{color: successfullyLoggedIn? "green" : "red"}}>{message}</h4> : null }

		</form>
	</div>
};
//===================================================================================================
export default Login;
