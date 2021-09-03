import React, { useState, useEffect, useContext } from 'react'
import Header from './Header'
import { AuthContext } from '../../context/AuthProvider';
import { database } from '../../firebase'
import CircularProgress from '@material-ui/core/CircularProgress';
import Posts from './Posts';
import './Feed.css'
function Feed() {
    const { currentUser } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [otherUserData, setOtherUser]=useState(null);
    // useEffect(() => {
    //     const unsub = database.users.doc(currentUser.uid).onSnapshot((doc) => {
    //         // You can listen to a document with the onSnapshot() method. An initial call using the callback you provide creates a document snapshot immediately with the current contents of the single document.
    //         // Then, each time the contents change, another call updates the document snapshot.
    //         console.log(doc.data());
    //         // setUserData(doc.data())

    //         //any change in users.doc by header or uploadvideo will be noticed by onSnapshot and it will run statements in useEffect
    //         //also will re-render any children of feed component
    //     })
    // }, [currentUser])
    useEffect(()=>{
        let otherUsers=[]
    const unsub = database.users.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
        let userDataIn;
        querySnapshot.forEach(doc=>{
            if(doc.data().userId!==currentUser.uid){
                let oUser=doc.data();
                otherUsers.push(oUser)
            }else{
                userDataIn=doc.data();
            }
        });
        setUserData({...userDataIn});
        setOtherUser(otherUsers);
    })

    return ()=>unsub()
},[currentUser])
console.log(otherUserData)
    return (
        <>
            {userData === null ? <CircularProgress style={{ position: "fixed", top: "50%", left: "50%" }} /> : <>
                <Header otherUsers={otherUserData} userDocumentData={userData} />
                <div style={{ height: '2.5vh' }} />
                <div className='feed-container'>
                        <Posts userData={userData} />
                </div>
            </>
            }
        </>
    )
}

export default Feed
