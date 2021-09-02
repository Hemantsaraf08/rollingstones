import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {database} from '../../firebase'
const useStyles = makeStyles({
    like:{
        color:'#e74c3c',
        cursor:'pointer',
        // fill: "red",
        // fontSize: "large"
    },
    unlike:{
        color:'white',
        cursor:'pointer'
    }
})
function Likes({userData=null, userPostData=null}) {
    const[like, setLike]=useState(null);
    const classes = useStyles();    
    useEffect(()=>{
        let check = userPostData.likes.includes(userData?.userId)?true:false;
        setLike(check);
    },[userPostData])

    const handleLike=async()=>{
        if(like==true){
            //then unlike
            let newArr=userPostData.likes.filter(li=>{
                return li!=userData.userId;
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
        <div>
        {
            like!=null?<>
            {
                like==false?<FavoriteIcon className={`${classes.unlike} icon-styling`} onClick={handleLike}/>:
                <FavoriteIcon className={`${classes.like} icon-styling`} onClick={handleLike} />
            }
            </>:<></>
        }
        </div>
    )
}

export default Likes
