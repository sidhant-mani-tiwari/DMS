import "../assets/CSS/Login.css";
import {useState, useEffect} from "react";
import DMS from "../api/DMS"
import { useNavigate } from "react-router-dom";
import { changeRole} from "../store/roleSlice";
import { useDispatch } from "react-redux";

const Login=()=>{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    useEffect(() => {
        // Check token validity on component mount
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        const validateToken = async () => {
            if (token && user) {
                try {
                    const response = await fetch("http://localhost:5000/api/v1/auth/validate-token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ UserID: user.UserID })
                    });

                    if (response.status === 200) {
                        const role = {
                            role: user.UserType,
                            loggedIn: true,
                            isAdmin: user.UserType.includes("admin")
                        }
                        dispatch(changeRole(role));
                        navigate("/");
                    } else {
                        // Token is invalid, clear localStorage
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                    }
                } catch (error) {
                    console.error("Token validation error", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
        };

        validateToken();
    }, [dispatch, navigate]);

    async function sendLogInfo(e){
       e.preventDefault();
       try{
           const logInfo=await fetch("http://localhost:5000/api/v1/auth/login",{
                method:"POST",
                headers:{
                     "Content-Type":"application/json"
                },
                body:JSON.stringify({
                     Email:email,
                     Password:password
                })
              });
                console.log(logInfo);
                
                const data=await logInfo.json();
                console.log(data);
                if(logInfo.status===200){
                    // Set token with expiration
                    const tokenExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
                    localStorage.setItem("user",JSON.stringify(data.user));
                    localStorage.setItem("token",data.token);
                    localStorage.setItem("tokenExpiry", tokenExpiry.toString());
                    
                    const role = {
                        role:data.user.UserType,
                        loggedIn:true,
                        isAdmin : data.user.UserType.includes("admin")
                    }
                    console.log(role);
                    
                    dispatch(changeRole(role));
                    navigate("/");
                }
                
       }catch(error){
        console.log(error);
       }
    }

    return (
        <div className="login">
            <div className="loginTitle">login</div>
            <div><span>Email</span>
            <input 
                id="loginEmail" 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value);}}
            /></div>
            <div><span>password</span><input 
                id="loginPass" 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value);}}    
            /></div>
            <div className="loginButton"><button onClick={sendLogInfo}>Log In</button></div>
        </div>
    )
}

export default Login;