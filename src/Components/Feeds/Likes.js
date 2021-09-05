import React, {useState, useEffect} from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite';
import {database} from '../../firebase'
import Typography from '@material-ui/core/Typography';

function Likes({userData=null, userPostData=null}) {
    const[like, setLike]=useState(null);
    useEffect(()=>{
        let check = userPostData.likes.includes(userData?.userId)?true:false;
        setLike(check);
    },[userPostData, userData])

    const handleLike=async()=>{
        if(like===true){
            //then unlike
            let newArr=userPostData.likes.filter(li=>{
                return li!==userData.userId;
            })
            await database.posts.doc(userPostData.postId).update({
                likes:newArr
            })
        }else{
            //then like
            let newArr=[...userPostData.likes, userData.userId];
            await database.posts.doc(userPostData.postId).update({
                likes: newArr
            })
        }
    }
    return (
        <div style={{width: '50%', display: "flex", alignItems: 'center', justifyContent: 'center'}}>
        {
            like!=null?<>
            {
                like===false?<div style={{display: 'flex', flexDirection:'row', width: '100%', justifyContent: 'space-evenly'}}onClick={handleLike}><Typography variant="h6">Like</Typography><FavoriteIcon  color="action" className={`icon-styling`} /></div>:
                <div style={{display: 'flex', flexDirection:'row', width: '100%', justifyContent: 'space-evenly'}} onClick={handleLike}><Typography variant="h6">Liked</Typography><FavoriteIcon color="secondary" className={`icon-styling`}  /></div>
            }
            </>:<></>
        }
        </div>
    )
}

export default Likes
