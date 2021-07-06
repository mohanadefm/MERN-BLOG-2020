import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { removeAuthToken } from "../config";
//===================================================================================================
const Header = ({ isLoggedIn }) => { // Or you can use (props), then (props.isLoggedIn) - isLoggedIn is the user
	const logout = () => {
		removeAuthToken();
		axios.defaults.headers.common["Authorization"] = null;
		window.location.href = "/"; // To convert you to Login page.
	};
	return <div className="header">
		<NavLink style={styles.default}  activeStyle={styles.active} exact to={"/"}>Home</NavLink>
		{ isLoggedIn? <LoggedInUser logout={logout} user={isLoggedIn}/> : <GuestUser/> }
	</div>
};
//===================================================================================================
// If you entered as a guest, you get (home,register,login)
function GuestUser() {
	return  <React.Fragment>
		<NavLink style={styles.default} activeStyle={styles.active} exact to={"/login"}>Login</NavLink>
		<NavLink style={styles.default} activeStyle={styles.active} exact to={"/register"}>Register</NavLink>
	</React.Fragment>
};
//===================================================================================================
// If you logged in, you get (home,posts,profile,logout)
function LoggedInUser(props) {
	return  <React.Fragment>
		{ 
			props.user.admin? <NavLink style={styles.default} activeStyle={styles.active} exact to={"/users"}>Users</NavLink> :
				<NavLink style={styles.default} activeStyle={styles.active} exact to={"/posts"}>Posts</NavLink> 
		}
		<NavLink style={styles.default} activeStyle={styles.active} exact to={"/profile"}>Profile</NavLink>
		<NavLink style={styles.default} activeStyle={styles.active} exact to={"/log-out"} onClick={props.logout}>Logout</NavLink>
	</React.Fragment>
};
//===================================================================================================
export default Header;

const styles = {
	active: {
		color: "#f3ca20",
		fontSize:"22px"
	},
	default: {
		textDecoration: "none",
		color: "#00c6ff",
		fontSize:"18px"
	}
};