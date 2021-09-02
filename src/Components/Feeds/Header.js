import React, { useState } from 'react';
import { makeStyles, alpha } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import PeopleIcon from '@material-ui/icons/People';
import Tooltip from '@material-ui/core/Tooltip';
import MoreIcon from '@material-ui/icons/MoreVert';
import { v4 as uuidv4 } from 'uuid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { storage, database } from '../../firebase'
import Alert from '@material-ui/lab/Alert';
import Search from './Search'
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    marginTop: ".5rem",
    paddingTop: ".2rem",
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontFamily: 'Great Vibes, cursive',
      fontSize: "3rem",
    },
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
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: "space-between",
      width: "16rem"
      // justifyContent: "center"
    },
  },
  uploadProgressbarShow:{
    width: "100vw",
  },
  uploadProgressbarHide:{
    display: "none",
  },
  sectionMobile: {
    display: 'flex',
    // justifyContent: "center",
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

}));

function Header({userDocumentData, otherUsers}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  // console.log(database.users);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>Feedback</MenuItem>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="home" color="inherit">
          <HomeIcon />
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="upload video" color="inherit">
          <PhotoCamera />
        </IconButton>
        <p>Upload Video</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="notifications" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <PeopleIcon />
          </Badge>
        </IconButton>
        <p>Follow Requests</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const [progress, setProgress]=useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const types = ['video/mp4', 'video/webm', 'video/ogg'];
  const handleOnChange = (e) => {
    const file = e?.target?.files[0];
    console.log("cliked", file)
    if (!file) {
      setError('Please select a file');
      setTimeout(() => { setError(null) }, 2000)
      return;
    }
    if (types.indexOf(file.type) == -1) {
      setError('Please select a video file');
      setTimeout(() => { setError(null) }, 2000)
      return;
    }
    if (file.size / (1024 * 1024) > 100) {     //file size must be less than 100mb
      setError('The selected file is too big');
      setTimeout(() => { setError(null) }, 2000)
      return;
    }
    const id = uuidv4();
    // console.log(props.userDocumentData.userId);//gets user Id
    //dump video in storage
    const uploadTaskListener = storage.ref(`/posts/${props.userDocumentData.userId}/${file.name}`).put(file);
    uploadTaskListener.on('state_changed', fn1, fn2, fn3);
    function fn1(snapshot) {
      //progress
      let progressval = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log('Upload is ' + progress + '% done');
      setProgress(progressval);
    }
    function fn2(error) {
      setError(error);
      setTimeout(() => {
        setError(null)
      }, 2000);
      setLoading(false)
    }
    async function fn3() {
      try {
        setLoading(true)
        //get video url to be set in database.collection in firestore database
        const url = await uploadTaskListener.snapshot.ref.getDownloadURL()
        console.log(url);

        //create post obj with reference of user who created the post
        let obj = {
          comments: [],
          likes: [],
          pId: id,
          pUrl: url,
          uName: props?.userDocumentData?.username,
          uProfile: props?.userDocumentData?.profileUrl,
          userId: props?.userDocumentData?.userId,
          public: true,
          createdAt: database.getCurrentTimeStamp()
        }
        console.log(obj)

        //using firestore to add data to cloud firestore instead of set as we want unique id for our doc 
        //to be generated by firestore, for more info: https://firebase.google.com/docs/firestore/manage-data/add-data
        const docref = await database.posts.add(obj);
        console.log(docref);  //we get doc ref back from firestore when we use add method
        //id generated by firestore is got by docref.id
        //later we update user doc with the info of post doc id, to access posts of user later
        await database.users.doc(props.userDocumentData.userId).update({
          postIds: [...props.userDocumentData.postIds, docref.id]
        })
        setLoading(false)
      } catch (e) {
        setError(e);
        setTimeout(() => {
          setError(null)
        }, 2000);
        setLoading(false)
      }
    }
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static" color="default" >
        <Toolbar style={{ display: "flex", justifyContent: "space-around" }}>
          <Typography className={classes.title} noWrap>
            RollingStones
          </Typography>
          <Search oUsers={otherUsers}/>
          <div className={classes.sectionDesktop}>
            <Tooltip title="Upload Video">
              <div>
                <input
                  color="primary"
                  type="file"
                  id='icon-button-file'
                  onChange={handleOnChange}
                  style={{ display: "none" }}
                />
                <label htmlFor='icon-button-file'>
                  <IconButton component="span" color="inherit">
                    <PhotoCamera />
                  </IconButton>
                </label>
              </div>
            </Tooltip>
            <IconButton color="inherit">
              <HomeIcon />
            </IconButton>
            <Tooltip title="view follow requests">
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <PeopleIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <div className={progress==0||progress==100?classes.uploadProgressbarHide:classes.uploadProgressbarShow}>
      <LinearProgress variant="determinate" value={progress} />
      </div>
      {
        error!=null? <Alert severity="error">{error}</Alert>:<></>
      }
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default Header