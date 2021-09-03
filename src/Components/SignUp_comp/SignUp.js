import React, { useContext, useState, useEffect } from 'react'
import { storage, database } from '../../firebase';
import { AuthContext } from '../../context/AuthProvider';
import styles from "./signup.module.css"
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {InputAdornment } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import { Link } from '@material-ui/core';
import {Link as RouterLink} from "react-router-dom"
import bpic from "./signup_bg.png"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { useHistory } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    formBlock: {
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-evenly",
        // padding: "5px",
        "& *": {
            // textAlign: "center",
            margin: ".2rem"
        }
    },
    // root>*{ //see how to select children above
    //     margin:"5px"
    // }
    SignUpcomp: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundSize: "100% 100%",
        height: "100vh",
    },
    signUpcard: {
        backgroundColor: "white",
        width: "24rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "34rem",
        boxShadow: "5px 10px 30px 10px darkslategrey",
        borderRadius: "13px",
        paddingBottom: "1rem",
        paddingTop: "1rem",
    },
    messageLogin: {
        width: "100%",
        height: "15px",
        borderBottom: "1px solid black",
        textAlign: "center",
        opacity: "0.3"
    },
    messageBody: {
        fontSize: "20px",
        backgroundColor: "white",
        padding: "5px",
        fontStyle: "sans-serif cursive",
    },
    ForgotPassword: {
        textAlign: "center",
        margin: "5px",
        marginBottom: "10px"
    },
    message: {
        fontSize: "18px",
        fontStyle: "italic",
        marginTop: "0rem"
    },
    uploadButton:{
        boxShadow: 'none',
        border: "solid",
        borderWidth: "thin",
        fontWeight: 'bold',
        fontFamily:'cursive'
        // fontSize: 16,
    },
}));
function SignUp() {
    const history = useHistory();
    const { signup, currentUser } = useContext(AuthContext);
    // console.log(currentUser);
    const [Email, setEmail] = useState("");
    const [passwordObj, setPasswordObj] = useState({
        password: "",
        showPassword: false
    });
    const [name, setName] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const classes = useStyles();
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let res = await signup(Email, passwordObj.password);
            let uid = res.user.uid;
            console.log(uid);
            // setLoading(false);
            const uploadTaskListener = storage.ref(`/user/${uid}/profileImage`).put(file);  //here file is stored in state
            uploadTaskListener.on("state_changed", fn1, fn2, fn3);
            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            // fn 1 -> progress tracking
            // fn2 -> error
            // fn3 -> success
            function fn1(snapshot) {
                //snapshot is given by firestore and applies to both image and audio all file types
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            }
            function fn2(error) {
                setError(error);
                setTimeout(() => {
                    setError('')
                }, 2000);
                setLoading(false)
            }
            async function fn3() {
                //on success
                let downloadUrl = await uploadTaskListener.snapshot.ref.getDownloadURL();//snapshot means any file audio, video, image==> given by firebase
                console.log(downloadUrl);
                await database.users.doc(uid).set({
                    email: Email,
                    userId: uid,
                    username: name,
                    createdAt: database.getCurrentTimeStamp(),
                    profileUrl: downloadUrl,
                    postIds: [],
                    friendRequests:[],
                    friends:[]
                })
            }
            setLoading(false);
            console.log('User has Signed up');
            history.push('/')
        } catch (e) {
            setError(e.message)
            setTimeout(() => setError(''), 2000);
            setLoading(false)
        }
    }
    const handleFileSubmit = (e) => {
        let file = e.target.files[0];
        console.log(file);
        if (file != null) {
            setFile(file)
        }
    }
    useEffect(() => {
        // /useeffect of type comp did mount
        //we will check if our AuthProvider observer has any user loged in, 
        //if yes we will display feeds page else we will show him the SignUp page
        console.log(currentUser)
        if(currentUser){
            history.push('/')   //'/' here means home page i.e. our feeds page 
         }
    }, [])
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowPassword = () => {
        setPasswordObj({ ...passwordObj, showPassword: !passwordObj.showPassword });
    };
    const handlePasswordChange = (e) => {
        setPasswordObj({ ...passwordObj, password: e.target.value })
    }
    return (
        <div className={classes.SignUpcomp}
            style={{
                backgroundImage: `url(${bpic})`,
            }}>
            {error ? <h1>{error}</h1> : <div className={classes.signUpcard}>
                <div className={styles.appName}>RollingStones</div>
                <p className={classes.message}>A place to share your travel memories</p>
                <div className={classes.messageLogin}>
                    <span className={classes.messageBody}>Sign Up</span>
                </div>
                <form className={classes.formBlock} autoComplete="off" onSubmit={handleSignUp}>

                    <TextField id="outlined-basic"
                        type="text"
                        placeholder="Enter Your User Name"
                        variant="outlined" required autoFocus
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <TextField id="outlined-basic"
                        type="email"
                        placeholder="Enter valid Email"
                        variant="outlined" required
                        onChange={(e) => setEmail(e.target.value)}
                        value={Email}
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
                    <input 
                    type="file" 
                    accept='image/*'
                    onChange={handleFileSubmit}
                    style={{ display: "none" }}
                    id='icon-button-file'
                    ></input> 
                    <label htmlFor='icon-button-file' style={{alignItems:"center", display:"flex", justifyContent:'center'}}>
                    <Button
                        variant="contained"
                        color="default"
                        startIcon={<PhotoCamera/>}
                        size="small"
                        disabled={loading}
                        className={classes.uploadButton}
                        component="span"
                    >
                        Select Profile Image
                    </Button>
                    </label>
                    <Button variant="contained" color="primary" type="submit" disabled={loading}>
                        Create Account
                    </Button>
                </form>
                <span style={{marginTop: "1rem"}}><ArrowBackIosIcon style={{fontSize: "large", color: "blue"}}/><Link component={RouterLink} to="/login">Sign In</Link></span>
            </div>
            }
        </div>
    )
}

export default SignUp