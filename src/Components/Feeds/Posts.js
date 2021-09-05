import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { Divider } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Video from './Video';
import { database } from "../../firebase"
import './Posts.css'
import Likes from './Likes';
import Comments from './Comments';
import Addcomments from './Addcomments';
import { AuthContext } from '../../context/AuthProvider';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: '0px'
    },
    loader: {
        position: 'absolute',
        left: '50%',
        top: '50%'
    },
    typo: {
        marginLeft: '2%'
    },
    seeComments: {
        height: '85%',
        overflowY: 'auto'
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    dialogBox: {
        padding: '1rem'
    },
    fullCard: {
        width: '100%',
        height: '85%'
    },
    cardHeader: {
        height: '15%'
    },
    formControl: {
        marginLeft: '40%',
        minWidth:100,
    },
}));
function Posts({ userData = null }) {

    const classes = useStyles();
    const {currentUser}=useContext(AuthContext);
    const [posts, setPosts] = useState(null);
    const [openId, setOpenId] = useState(null);
    const handleClickOpen = (id) => {
        console.log("post id is", id)
        setOpenId(id);
    }
    const handleClose = () => {
        setOpenId(null);
    };

    //Setting Intersection observer
    const callback = entries => {
        //callback of interection observer takes in an array of entries as parameter
        entries.forEach(element => {
            console.log(element);
            let el = element.target.childNodes[1].childNodes[0];
            //play is async and pause is sync;
            //strategy is to play all videos at first and then pause non intersecting vids
            el.play().then(() => {
                //if this video is not in viewport then pause it
                if (!el.paused && !element.isIntersecting) {
                    el.pause();
                }
            })
        })
    }
    const observer = new IntersectionObserver(callback, {
        threshold: 0.85
    })
    useEffect(() => {
        let elements = document.querySelectorAll('.single-vid-container');
        //attaching observer after the component mounts
        elements.forEach(el => {
            observer.observe(el);
        })
        return () => {
            observer.disconnect();//doing cleanup so that we dont attach observer on
            //videos that had observer already attached to them; generally it is better to remove all observers and setTimeout when the component unmounts
        }
    }, [posts])//whenever new posts/videos are added there will be change in state that will lead to re-render
    //and observer will be attached to new posts, it will not be affected by state change of openId

    useEffect(() => {
        let postsArr = [];
        //fetch request is a side effect hence this part is in useEffect

        //attahing a onSnapshot on posts collections as we did on user collection to get real time data of docs/posts in posts collection
        const unsub = database.posts.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
            postsArr = [];//emptying postsArr as whenever new vid is put this method is called and 
            //querysnapshot provides info of all vids, therefore, if we dont empty postsArr it will lead to double entry of vids in our array
            querySnapshot.forEach((doc) => {
                console.log(doc.data(), +"  " + doc.id);
                let data = { ...doc.data(), postId: doc.id }
                // console.log(data);
                postsArr.push(data)
            })
            setPosts(postsArr);
        })
        return unsub;//cleanup
    }, [])

    const handlePostPrivacyChange=(e,id)=>{
        // console.log(id)
        database.posts.doc(id).update({
            public: e.target.value
        })
    }
    return (
        <>
            <div className='place'>
            </div>
            {
                posts === null ? <CircularProgress className={classes.loader} color="secondary" /> :
                    <div className='video-container' id='video-container'>
                        {
                            posts.map((post) => (
                                    <React.Fragment key={post.postId}>
                                        <div className='single-vid-container' style={{display:post?.public||userData?.friends?.includes(post?.userId)||post?.userId===currentUser.uid?'block':'none'}}>
                                            <div className='svid profile-info'>
                                                <Avatar src={post.uProfile} ></Avatar>
                                                <h4 style={{ marginLeft: '.8rem' }}>{post.uName}</h4>
                                                <FormControl disabled={post.userId!==currentUser.uid} className={classes.formControl}>
                                                    <InputLabel id="demo-simple-select-label">Post Privacy</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={post.public}
                                                        onChange={(e)=>handlePostPrivacyChange(e,post.postId)}
                                                    >
                                                        <MenuItem value={true}>Public</MenuItem>
                                                        <MenuItem value={false}>Private</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div style={{ height: "70%", overflow: "hidden" }}>
                                                <Video source={post.pUrl} id={post.pId} />
                                            </div>
                                            <div className='svid vid-actions'>
                                                <Likes userData={userData} userPostData={post} />
                                                <Divider orientation="vertical" variant="middle" />
                                                <div style={{ display: 'flex', width: '50%', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleClickOpen(post.pId)}>
                                                    <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", width: '100%' }}>
                                                        <Typography variant='h6'>Comment</Typography>
                                                        <ChatBubbleIcon color="action" className={`icon-styling`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Dialog maxWidth="md" className={classes.dialogBox} onClose={handleClose} aria-labelledby="customized-dialog-title" open={openId === post.pId}>
                                            <MuiDialogContent>
                                                <div className='dcontainer'>
                                                    <div className='video-part'>
                                                        <video autoPlay={true} className='video-styles2' controls id={post.id} muted="muted" type="video/mp4" >
                                                            <source src={post.pUrl} type="video/webm" />
                                                        </video>
                                                    </div>
                                                    <div className='info-part'>
                                                        <Card className={classes.fullCard}>
                                                            <CardHeader className={classes.cardHeader}
                                                                avatar={
                                                                    <Avatar src={post?.uProfile} aria-label="recipe" className={classes.avatar}>
                                                                    </Avatar>
                                                                }
                                                                action={
                                                                    <IconButton aria-label="settings">
                                                                        <MoreVertIcon />
                                                                    </IconButton>
                                                                }
                                                                title={post?.uName}

                                                            />
                                                            <hr style={{ border: "none", height: "1px", color: "#dfe6e9", backgroundColor: "#dfe6e9" }} />
                                                            <CardContent className={classes.seeComments}>
                                                                <Comments userData={userData} userPostData={post} />
                                                            </CardContent>
                                                        </Card>
                                                        <div className='extra'>
                                                            <div className='likes'>
                                                                <Typography className={classes.typo} variant='h6'>{post.likes.length === 0 ? "No likes yet" : post.likes.length === 1 ? `${post.likes.length} Like` : `${post.likes.length} Likes`}</Typography>
                                                            </div>
                                                            <Addcomments userData={userData} postData={post} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </MuiDialogContent>
                                        </Dialog>
                                    </React.Fragment>
                                )
                            )
                        }
                    </div>
            }
        </>
    )
}

export default Posts