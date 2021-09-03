import { makeStyles, alpha } from '@material-ui/core'
import React, { useState } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { InputBase } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from 'react-router-dom';
const useStyle = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(5),
      width: 'auto',
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    border: "1px solid black"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
  }

}));

function Search({ oUsers }) {
  console.log(oUsers);
  const [text, setText] = useState("");
  const [resultArr, setResultArr] = useState(null)
  const classes = useStyle()
  const history=useHistory()
  const modalStyle={
    display: text.length===0?"none":'block',
    position: 'absolute',
    zIndex: "2",
    top: "10vh",
    width: "18rem",
    backgroundColor: "azure",
    borderRadius: "10px"
  }
  const handleChange = (e) => {
    let txt = e.target.value;
    
    console.log(txt)
    
    let res = oUsers.filter(usersObj => usersObj.username.toLowerCase().includes(txt.trim().toLowerCase()));
    if(txt.length === 0){
      res=[];
    }
    setText(txt);
    setResultArr(res);
    console.log(res)
  }
  const handleListItemClick = (obj) => {
    history.push({
      pathname: '/otherUserProfile',
      state: { obj }
    })
  }
  
  return (
    <>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="find travelers…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          value={text} onChange={(e)=>{handleChange(e)}}
        />
      </div>
      <div aria-labelledby="simple-dialog-title" style={modalStyle}>
        {resultArr?.length === 0 ? <DialogTitle id="simple-dialog-title">User not found..</DialogTitle> : <>
          <List>
            {resultArr?.map((userObj) => (
              <ListItem button onClick={() => handleListItemClick(userObj)} key={userObj.userId} divider>
                <ListItemAvatar>
                  <Avatar className={classes.avatar} src={userObj?.profileUrl} />
                </ListItemAvatar>
                <ListItemText primary={userObj.username} />
              </ListItem>
            ))}
          </List>
        </>}
      </div>
    </>
  )
}

export default Search
