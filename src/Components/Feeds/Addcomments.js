import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import "./Addcomments.css"
import {database} from "../../firebase"
import { Smile } from 'react-feather';
import { Picker } from 'emoji-mart';
const useStyles = makeStyles({
    cbtn:{
        marginRight:'1%',
        marginTop:'4%'
    }
 })

function Addcomments({userData=null, postData=null}) {
    const classes = useStyles();
    const [text,setText] = useState('');
    const[showEmojiPicker, setEmojiPicker]=useState(false)
    const manageText =(e)=>{
        let comment = e.target.value;
        setText(comment);
    }
    const toggleEmojiPicker=()=>{
        setEmojiPicker(!showEmojiPicker);
    }
    const addEmoji=(emoji)=>{
        const fulltext=`${text}${emoji.native}`;
        setText(fulltext);
        setEmojiPicker(false);
    }

    const handleOnEnter=()=>{
        // console.log(userData);
        let obj={
            text:text,
            uName: userData.username,
            uUrl:userData.profileUrl
        }
        // console.log(obj);
        database.comments.add(obj).then(docRef=>{
            database.posts.doc(postData.postId).update({
                comments:[...postData.comments,docRef.id]
            })
        })
        .catch(e=>{
            console.log(e+" ");
        })
        setText('');
    }
    return (
        <div className='emojibox'>
            {showEmojiPicker?<Picker set="emojione" onSelect={addEmoji} />:<></>}
            <Button className="toggle-emoji" onClick={toggleEmojiPicker}>
                <Smile/>
            </Button>
            <TextField value={text} fullWidth={true} label='Add a comment' onChange={manageText}/>
            <Button onClick={handleOnEnter} disabled={text===''?true:false} className ={classes.cbtn} color='primary'>Post</Button>
        </div>
    )
}

export default Addcomments
