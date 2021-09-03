import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
import PrivateRoute from './Components/PrivateRoute'
import Feed from './Components/Feeds/Feed'
import SignUp from './Components/SignUp_comp/SignUp';
import SignIN from './Components/SignIN comp/SignIN'
import OtherProfile from './Components/OtherProfile';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute  exact path='/' component={Feed}/>
          <Route path="/login" component={SignIN}/>
          <Route path='/signup' component={SignUp}/>
          <Route path="/otherUserProfile" component={OtherProfile}/>
        </Switch>
       </AuthProvider> 
    </Router>
  );
}

export default App;
