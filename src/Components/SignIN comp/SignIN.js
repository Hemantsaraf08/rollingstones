import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider';
import styles from "./signIN.module.css"
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FormControl, Input, InputAdornment } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
// import { Link as RouterLink } from 'react-router-dom';
import bpic from "./signIN_bg.png"
import { useHistory } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import SignUp from '../SignUp_comp/SignUp';
const useStyles = makeStyles((theme) => ({
    formBlock: {
        marginTop: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-evenly",
        // padding: "5px",
        "& *":{
            // textAlign: "center",
            margin: ".15rem"
        }
    },
    // root>*{ //see how to select children above
    //     margin:"5px"
    // }
    SignINcomp:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundSize: "100% 100%",
        height: "100vh",
    },
    signINcard:{
        backgroundColor: "white",
        width: "24rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "34rem",
        boxShadow: "5px 10px 30px 10px darkslategrey",
        borderRadius: "13px"
    },
    messageLogin:{
        width: "100%",
        height: "15px",
        borderBottom: "1px solid black",
        textAlign:"center",
        opacity: "0.3"
    },
    messageBody: {
        fontSize: "20px",
        backgroundColor: "white",
        padding: "5px",
        fontStyle:"sans-serif cursive",
    },
    ForgotPassword:{
        textAlign: "center",
        margin: "5px",
        marginBottom: "10px"
    },
    message:{
        fontSize: "18px",
        fontStyle: "italic",
        
    }
}));


function SignIN() {
    const {login, currentUser}=useContext(AuthContext)
    const [email, setEmail] = useState("");
    const [loading, setLoading]=useState(false)
    const [error, setError]=useState("")
    const [passwordObj, setPasswordObj] = useState({
        password: "",
        showPassword: false
    })
    const classes = useStyles();
    const history=useHistory()
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowPassword = () => {
        setPasswordObj({ ...passwordObj, showPassword: !passwordObj.showPassword });
    };
    const handlePasswordChange=(e)=>{
        setPasswordObj({...passwordObj, password:e.target.value})
    }
    const handleSignIn=async (e)=>{
        e.preventDefault();
        try{
            setLoading(true);
            await login(email,passwordObj.password);    //because login fn gave promise from AuthProvider.js
            setLoading(false);
            history.push("./")
            console.log('User has Signed IN');
        }catch(e){
            setError(e)
            setTimeout(() => setError(''), 2000);
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(currentUser)
        {
          history.push('/')
        }
      },[])
    return (
        <div className={classes.SignINcomp}  
            style={{backgroundImage:`url(${bpic})`,
            }}>
            {error?<h1>{error}</h1>:<div className={classes.signINcard}>
                <div className={styles.appName}>RollingStones</div>
                <p className={classes.message}>A place to share your travel memories</p>
                <div className={classes.messageLogin}>
                    <span className={classes.messageBody}>Log in</span>
                </div>
            <form className={classes.formBlock} noValidate autoComplete="off" onSubmit={handleSignIn}>
                
                <TextField id="outlined-basic"
                    type="email"
                    placeholder="Enter Email"
                    variant="outlined" required autoFocus
                    onChange={(e)=>setEmail(e.target.value)}
                    value={email}
                    required
                    />
     
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={passwordObj.showPassword ? 'text' : 'password'}
                    value={passwordObj.password}
                    onChange={handlePasswordChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {passwordObj.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                    placeholder="Password"
                    variant="outlined" required
                    />
                <Link className={classes.ForgotPassword}>Forgot Password?</Link>
                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                    LOG IN
                </Button>
            </form>
            <p>Don't have an account? <Link component={RouterLink} to="/signup">Sign up</Link></p>
            </div>
        }
        </div>
    )
}

export default SignIN
