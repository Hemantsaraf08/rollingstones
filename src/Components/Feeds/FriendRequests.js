import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
const modalStyle={
  position: 'fixed',
  zIndex: "4",
  right: '3rem',
  top: "12%",
  width: "18rem",
  backgroundColor: "azure",
  borderRadius: "10px"
}

function FriendRequests({requestArr, oUsers}) {
    const [resultArr, setResultArr]=useState(null);
    const history=useHistory();
    useEffect(()=>{
        let res=oUsers?.filter(userObj=>requestArr?.includes(userObj.userId))
        setResultArr(res);
    },[requestArr])

    const handleListItemClick = (obj) => {
        history.push({
          pathname: '/otherUserProfile',
          state: { obj }
        })
      }
    return (
        <div style={modalStyle}>
            {resultArr?.length === 0 ? <DialogTitle id="simple-dialog-title">No requests to display..</DialogTitle> : <>
          <List>
            {resultArr?.map((userObj) => (
              <ListItem button onClick={() => handleListItemClick(userObj)} key={userObj.userId} divider>
                <ListItemAvatar>
                  <Avatar src={userObj?.profileUrl} />
                </ListItemAvatar>
                <ListItemText primary={userObj.username} />
              </ListItem>
            ))}
          </List>
        </>}
        </div>
    )
}

export default FriendRequests
