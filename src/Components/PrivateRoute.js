import React, {useContext} from 'react'
import {AuthContext} from '../context/AuthProvider'
import {Route, Redirect} from "react-router-dom"

function PrivateRoute({component: PassedComponent},...otherProps) {
    const {currentUser}=useContext(AuthContext);

    return (
        <Route {...otherProps} render={props=>{
            return currentUser?<PassedComponent {...props}/>:<Redirect to='/signup'/>
        }} />
    )
}

export default PrivateRoute
