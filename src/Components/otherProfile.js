import React,{ useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { database } from "../../firebase"
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Feeds/Header';
import { AuthContext } from '../context/AuthProvider';
const useStyles=makeStyles({
    loader: {
        position: 'absolute',
        left: '50%',
        top: '60%'
    }
})
const profileInfostyle={
    display: 'flex',
    width: '100vw',
    flexDirection: 'row',
    height: "25vh"
}

const profilestatsstyle={
    display: 'flex',
    width: '100%',
    flexDirection: 'row', 
    alignItems: 'center'
}

const VideoPostsstyle={
    width: '100vw',
    height: "60vh"
}
const otherUserVidsstyle={
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
}

function otherProfile(props) {

    let userProfileObj=props.history.location.state.obj;
    const classes = useStyles();
    const [postsArr, setPostsArr]=useState(null);
    const [buttontxt, setButtonTxt]=useState("Follow");
    const { currentUser } = useContext(AuthContext);

    useEffect(async ()=>{
        //first time, setPostsArr and check text of button and disable if needed
        let tempArr=[];
        for(let i=0;i<userProfileObj.postIds.length;i++){
            let postid=userProfileObj.postIds[i];
            let eachPost=await database.posts.doc(postid).get();
            if(eachPost.data()?.public){
                //public post
                tempArr.push(eachPost.data())
            }
        }
        if(userProfileObj.friends?.includes(currentUser.uid)){
            setButtonTxt("Following");
        }else if(userProfileObj.friendRequests?.includes(currentUser.uid)){
            setButtonTxt("Request Sent");
        }
        setPostsArr(tempArr);
    },[])
    useEffect(async ()=>{
        //check text of button and disable if needed
        
    },[userProfileObj])
    const handleClick=()=>{
        setButtonTxt("Request Sent");      
        database.users.doc(userProfileObj.userId).update({
            friendRequests: [...userProfileObj.friendRequests, currentUser.uid]
        });
    }
    return (
        <>
        <Header></Header>
        <div className="profileInfo" style={profileInfostyle}>
            <div className="profileAvatar" style={{width='30%'}}>
                <Avatar src={userProfileObj.profileUrl}/>
            </div>
            <div className="otherInfo" style={{width='70%'}}>
                <h2>userProfileObj.username</h2>
                <div className="proflestats"  style={profilestatsstyle}>
                    <div className='postsStats' style={{width:'50%'}}>
                        <Typography className="statsNumber" style={{ display="block"}}>{userProfileObj.postIds.length}</Typography>
                        <Typography className="statsText" style={{ display="block"}}>Posts</Typography>
                    </div>
                    <div className='followersStats' style={{width:'50%'}}>
                        <Typography className="statsNumber" style={{ display="block"}}>{userProfileObj.friends?.length}</Typography>
                        <Typography className="statsText" style={{ display="block"}}>Followers</Typography>
                    </div>
                </div>
                <Button onClick={handleClick} variant="contained" color="primary" disabled={buttontxt==="Following"||"Request Sent"}>{buttontxt}</Button>
            </div>
        </div>
        <div className="VideoPosts" style={VideoPostsstyle}>
            {
                userProfileObj.postIds.length==0?<Typography component="h4">No Posts to display</Typography>:postsArr==null?<CircularProgress className={classes.loader} color="secondary"/>:
                <div className='otherUserVids' style={otherUserVidsstyle}>
                    {
                        postsArr.map(post=>(
                            <video src={post} muted></video>
                        ))
                    }    
                </div>
            }
        </div>
        </>
    )
}

export default otherProfile
