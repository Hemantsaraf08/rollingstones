import React from 'react'
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
const useStyle=makeStyles({
    videoElement:{
        width: "100%",
        height: "80vh",
        scrollSnapAlign: "start"
    }
})
function Video(props) {
    //only post collection info is passed here as props
    const classes=useStyle();
    const handleMute=(e)=>{
        e.preventDefault();//becoz browser default behaviour for video is play and pause
        e.target.muted=!e.target.muted;
    }
    const handleAutoScroll=(e)=>{
        //if the current video has ended and there is a next video then trigger scroll
        const next=ReactDOM.findDOMNode(e.target).parentNode.nextSibling;
        if(next){
            next.scrollIntoView({behaviour:"smooth"}); //Element.scrollIntoView() method refer: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
            e.target.muted=true;
        }
    }
    return (
        <>
          <video onEnded={handleAutoScroll} src={props.source} className={classes.videoElement} onClick={handleMute} muted="muted" type='video/mp4'/>  
        </>
    )
}

export default Video


