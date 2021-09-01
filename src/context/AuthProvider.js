import React, {useState, useEffect} from 'react'
import {auth} from '../firebase'    //from firebase file

export const AuthContext=React.createContext();


function AuthProvider({children}) {
    const[currentUser,setCurrentUser] =useState();
    const[loading,setLoading] =useState(true);
    const loginFn=(email,password)=>{
        return auth.signInWithEmailAndPassword(email,password);        //return promise
    }
    const signUpFn=(email,password)=>{
        return auth.createUserWithEmailAndPassword(email,password); //return promise
    }
    const logoutFn=()=>{
        return auth.signOut(); 
    }
    const value={
        login:loginFn,
        logout:logoutFn,
        currentUser,
        signup: signUpFn
    }
    //just called signUpfn doesn't set user, firebase gives us auth.onAuthStateChanged to set user, but we don't want to do this in every render so we do this once only
    //using useEffect

    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged(user=>{
            //Note we are adding observer on Auth obj not on user
            setCurrentUser(user);//can be null when no user or user logs out
            setLoading(false);
        })
        return ()=>{
            unsubscribe();  //it removes the observer from the auth obj when component unmounts (or tab closes),
            //but note that it doesn't signout user (when tab closes or comp. unmounts) as that can only be done through the fns login or logout 
        }
    },[])
    return (
        <AuthContext.Provider value={value}>
         {!loading&&children} 
            {/* this is how logical operators work in JS:(exp1&&exp2) Returns expr1 if it can be converted to false; otherwise, 
            returns expr2.
            Thus, when used with Boolean values, && returns true if both operands are true; otherwise, returns false. */}
            {/* {!loading?children:} //this is another way of doing this, if loading is false render children */}
        </AuthContext.Provider>
    )
}

export default AuthProvider
