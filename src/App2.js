import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import Login from './pages/login';
import UserProvider, { UserContext } from './userContext'
import Logout from './pages/logout'
import MyBadgesRedirect from './pages/mybadgesredirect';
import Layout from './components/layout'
import Note from './components/note'
import Account from './components/account'
import Badges from './components/badges'
import TeacherClasses from './components/classes';
import AddClass from './components/addclass'
import BadgeDetails from './components/badgedetails';
import Feedback from './components/feedback';
import Students from './components/students'
import StudentDetails from './components/studentdetails'
import BadgeForm from './components/badgeform2'
import MyBadges from './components/mybadges'
import MyBadgeDetails from './components/mybadgedetails';
import FeedbackView from './components/feedbackview';

const theme = createTheme({
	palette: {
		primary: {
			light: '#33c9dc',
			main: '#FF5722',
			dark: '#d50000',
			contrastText: '#fff'
		}
  }
});

function UserRoute({ component: Component, ...rest }) {
	const { isAdmin } = useContext(UserContext)
	const location = useLocation()
	console.log('in UserRoute isAdmin is '+isAdmin)
	return (
		<Route {...rest}>
			{!isAdmin === true ? <Layout><Component /></Layout> : 
			<Redirect to={{ pathname: "/classes", state: { from: location } }} />
			}
		</Route>
	)
}

function AdminRoute({ component: Component, ...rest }) {
	const { isAdmin } = useContext(UserContext)
	const location = useLocation()
	console.log('in AdminRoute isAdmin is '+isAdmin)
	return (
		<Route {...rest}>
			{isAdmin === true ? <Layout><Component /></Layout> : 
			<Redirect to={{ pathname: "/", state: { from: location } }} />
			}
		</Route>
	)
}

function App() {

	const [ aStudentId, setAStudentId ] = useState()
	const [ aStudentName, setAStudentName ] = useState()
	console.log("in App, aStudentId is "+aStudentId)

	return (
		<ThemeProvider theme={theme}>
			<UserProvider>
                <Router>
                    <div>
                        <Switch>
                            <UserRoute exact path="/" component={Note}/>
                            <Route exact path="/account"><Layout><Account /></Layout></Route>
                            <Route exact path="/badges"><Layout><Badges /></Layout></Route>
							<Route exact path="/students"><Layout><Students /></Layout></Route>
                            <Route exact path="/feedback"><Layout><Feedback /></Layout></Route>
							<Route exact path="/students/:studentId"><Layout><StudentDetails /></Layout></Route>
                            <AdminRoute exact path="/classes" component={TeacherClasses}/>
							<AdminRoute exact path="/addclass" component={AddClass}/>
							<Route exact path="/badges/:badgeId"><Layout><BadgeDetails /></Layout></Route>
							<Route exact path="/badgeForm"><Layout><BadgeForm></BadgeForm></Layout></Route>
							<Route exact path="/myBadges"><MyBadgesRedirect /></Route>
							<Route exact path="/myBadges/:myBadgeId"><Layout><MyBadgeDetails /></Layout></Route>
							<Route exact path="/students/:studentId/myBadges/:myBadgeId"><Layout><MyBadgeDetails /></Layout></Route>
							<Route exact path="/students/:studentId/myBadges"><Layout><MyBadges /></Layout></Route>
							<Route exact path="/students/:studentId/myBadges/:myBadgeId/feedback/:feedbackId"><Layout><FeedbackView /></Layout></Route>
							<Route exact path="logout"><Logout /></Route>

                            <Route exact path="/login"><Login /></Route>
                        </Switch>
                    </div>
                </Router>
			</UserProvider>
		</ThemeProvider>
	);
}

export default App;
