import React, { useState } from "react";
import axios from "axios";
import { URL } from "../config";
//===================================================================================================
const Register = (props) => {
	const [form   , setValues ] = useState({ username:"", email:"", password:"", password2:"" });
	const [message, setMessage] = useState("");
	const [successfullyRegister,setSuccessfullyRegister] = useState(null);

	const handleChange = (e) => {
		setValues({ ...form, [e.target.name]: e.target.value });
		// or use this way for each one (one by one)
		// const handleChangePass = (e) => {
		//   let data = e.target.value;
		//   form.password = data;
		//   setValues(form);
		// };
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		try{
			const response = await axios.post(`${URL}/users/register`, {username:form.username, email: form.email, password: form.password, password2: form.password2});
			const { ok,message } = response.data;
			if(ok){
				setMessage(message);
				setSuccessfullyRegister(true); // what true mean?
				setTimeout( () => {
					props.history.push("/login"); // why props not window
				}, 2000);
			}else{
				setMessage(message);
				setSuccessfullyRegister(false);
			};
		}
		catch(e){
			setMessage("Try again!");
			setSuccessfullyRegister(false);
		}
	};

	return <div className="register">
		<form onSubmit={handleSubmit} onChange={handleChange} className="register-box">

			<label>Username		  </label>	<input name="username" 	required/>
			<label>Email		  </label>	<input name="email" 	required/>
			<label>Password		  </label>	<input name="password" 	required/>
			<label>Repeat password</label> 	<input name="password2" required/>
			<button type="submit" name="submit">register</button>
			
			{ message? <h4 style={{color: successfullyRegister? "green" : "red"}}>{message}</h4> : null }

		</form>
	</div>
};
//===================================================================================================
export default Register;