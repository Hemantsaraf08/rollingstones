import React, { useState, useEffect, useContext } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { database } from "../firebase"
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import Header from './Feeds/Header';
import './profile.css'
const useStyles = makeStyles(theme => ({
    loader: {
        position: 'absolute',
        left: '50%',
        top: '60%'
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    }
}))

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

function Myprofile(props) {
    const userProfileObj = props.history.location.state.userDocumentData;
    console.log(userProfileObj)
    const classes = useStyles();
    const [postsArr, setPostsArr] = useState(null);
    useEffect(() => {
        async function fetchPosts() {
            let tempArr = [];
            for (let i = 0; i < userProfileObj?.postIds?.length; i++) {
                let postid = userProfileObj.postIds[i];
                let eachPost = await database.posts.doc(postid).get();
                tempArr.push(eachPost.data())
            }
            setPostsArr(tempArr);
        }
        fetchPosts();
    }, [])
    return (
        <>
            <Header></Header>
            <div style={{ height: '10px' }}></div>
            <div style={{ width: '75vw', minWidth: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#e6f8f9', borderRadius: '1.5rem', boxShadow: "0px 2px 5px 2px darkslategrey", padding: '10px', marginTop: '15px', margin: 'auto', justifyContent: 'center' }}>
                <div className="profileInfo" style={profileInfostyle}>
                    <div className="profileAvatar">
                        <Avatar style={{ height: '6rem', width: '6rem' }} src={userProfileObj?.profileUrl} />
                    </div>
                    <div className="otherInfo" style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ textAlign: 'center', margin: '4px' }}>{userProfileObj?.username}</h2>
                        <div className="proflestats" style={profilestatsstyle}>
                            <div className='postsStats' style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography className="statsNumber" style={{ display: "block" }} variant='h4'>{userProfileObj?.postIds?.length}</Typography>
                                <Typography className="statsText" style={{ display: "block" }}>Posts</Typography>
                            </div>
                            <div className='followersStats' style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography className="statsNumber" style={{ display: "block" }} variant='h4'>{userProfileObj?.friends?.length}</Typography>
                                <Typography className="statsText" style={{ display: "block" }}>Followers</Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider style={{ height: '1.5px' }} />
                <div className="VideoPosts" style={VideoPostsstyle}>
                    {

                        userProfileObj?.postIds?.length === 0 ? <Typography variant="h4" style={{ textAlign: 'center' }}>No Posts to display</Typography> : postsArr == null ? <CircularProgress className={classes.loader} color="secondary" /> :
                            <div className='otherUserVids' style={otherUserVidsstyle}>
                                {
                                    postsArr.map(post => (
                                        <div style={{ margin: '5px', borderRadius: '15px' }} key={post.pId}>
                                            <video src={post.pUrl} muted id={post.pId} width='400' ></video>
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

export default Myprofile
