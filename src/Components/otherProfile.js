import React, { useState, useEffect, useContext } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { database } from "../firebase"
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import Header from './Feeds/Header';
import { AuthContext } from '../context/AuthProvider';
const useStyles = makeStyles({
    loader: {
        position: 'absolute',
        left: '50%',
        top: '60%'
    }
})
const profileInfostyle = {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    height: "25vh"
}

const profilestatsstyle = {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
}

const VideoPostsstyle = {
    width: '100%',
    height: "60vh",
    overflow: 'auto'
}
const otherUserVidsstyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
}

function OtherProfile(props) {

    let userProfileObj = props.history.location.state.obj;//INCORRECT
    //dont access location from history as history is mutable 
    
    //INSTEAD ACCESS LOCATION DIRECTLY FROM PROPS
    //let userProfileObj = props.location.state.obj;
    const classes = useStyles();
    const [postsArr, setPostsArr] = useState(null);
    const [buttontxt, setButtonTxt] = useState("Follow");
    const { currentUser } = useContext(AuthContext);

    useEffect(async () => {
        //first time, setPostsArr and check text of button and disable if needed
        let tempArr = [];
        for (let i = 0; i < userProfileObj.postIds.length; i++) {
            let postid = userProfileObj.postIds[i];
            let eachPost = await database.posts.doc(postid).get();
            if (eachPost.data()?.public) {
                //public post
                tempArr.push(eachPost.data())
            }
        }
        const currUserDoc = await database.users.doc(currentUser.uid).get();
        const accept = currUserDoc.data().friendRequests.includes(userProfileObj.userId)

        if (userProfileObj.friends?.includes(currentUser.uid)) {
            setButtonTxt("Following");
        } else if (userProfileObj.friendRequests?.includes(currentUser.uid)) {
            setButtonTxt("Request Sent");
        } else if (accept) {
            setButtonTxt("Accept Follow Request");
        }
        setPostsArr(tempArr);
    }, [])
    const handleClick = () => {
        if (buttontxt === 'Follow') {
            setButtonTxt("Request Sent");
            database.users.doc(userProfileObj.userId).update({
                friendRequests: [...userProfileObj?.friendRequests, currentUser.uid]
            });
        } else if (buttontxt === 'Accept Follow Request') {
            setButtonTxt("Following");
            database.users.doc(userProfileObj.userId).update({
                friends: [...userProfileObj.friends, currentUser.uid]
            });
            database.users.doc(currentUser.uid).get()
            .then(currUD => {
                database.users.doc(currentUser.uid).update({
                    friends: [...currUD.data().friends, userProfileObj.userId],
                    friendRequests:currUD.data().friendRequests.filter(id=>id!==userProfileObj.userId)
                }).catch(e=>console.log(e))
            }).catch(e => console.log(e))
        }
    }
    return (
        <>
            <Header></Header>
            <div style={{ height: '10px' }}></div>
            <div style={{ width: '75vw', minWidth: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#e6f8f9', borderRadius: '1.5rem', boxShadow: "0px 2px 5px 2px darkslategrey", padding: '10px', marginTop: '15px', margin: 'auto', justifyContent: 'center' }}>
                <div className="profileInfo" style={profileInfostyle}>
                    <div className="profileAvatar">
                        <Avatar style={{ height: '6rem', width: '6rem' }} src={userProfileObj.profileUrl} />
                    </div>
                    <div className="otherInfo" style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ textAlign: 'center', margin: '4px' }}>{userProfileObj.username}</h2>
                        <div className="proflestats" style={profilestatsstyle}>
                            <div className='postsStats' style={{ width: '50%',display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography className="statsNumber" style={{ display: "block" }} variant='h4'>{userProfileObj.postIds.length}</Typography>
                                <Typography className="statsText" style={{ display: "block" }}>Posts</Typography>
                            </div>
                            <div className='followersStats' style={{ width: '50%',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Typography className="statsNumber" style={{ display: "block" }} variant='h4'>{userProfileObj.friends?.length}</Typography>
                                <Typography className="statsText" style={{ display: "block" }}>Followers</Typography>
                            </div>
                        </div>
                        <Button onClick={handleClick} style={{width: '68%'}}variant="contained" color="primary" disabled={buttontxt === "Following" ||buttontxt === "Request Sent"}>{buttontxt}</Button>
                    </div>
                </div>
                <Divider style={{ height: '1.5px' }} />
                <div className="VideoPosts" style={VideoPostsstyle}>
                    {
                        userProfileObj.postIds.length === 0 ? <Typography style={{ textAlign: 'center' }} component="h4">No Posts to display</Typography> : postsArr == null ? <CircularProgress className={classes.loader} color="secondary" /> :
                            <div className='otherUserVids' style={otherUserVidsstyle}>
                                {
                                    postsArr.map(post => (
                                        <div style={{ margin: '5px', borderRadius: '15px' }} key={post.pId}>
                                        <video src={post.pUrl} muted id={post.pId} width='400'></video>
                                        </div>
                                    ))
                                }
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default OtherProfile
