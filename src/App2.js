import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import Login from './pages/login';
import UserProvider, { UserContext } from './userContext'
import Layout from './components/layout'
import Note from './components/note'
import Account from './components/account'
import Badges from './components/badges'
import TeacherClasses from './components/classes';
import BadgeDetails from './components/badgedetails';
import Feedback from './components/feedback';
import Students from './components/students'
import StudentDetails from './components/studentdetails'
import BadgeForm from './components/badgeform'

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

const NotesLayout = () => {
	return(
		<Layout><Note/></Layout>
	)
}

const ClassesLayout = () => {
	return(
		<Layout><TeacherClasses/></Layout>
	)
}

function UserRoute({ component: Component, ...rest }) {
	const { isAdmin } = useContext(UserContext)
	const location = useLocation()
	console.log('in UserRoute isAdmin is '+isAdmin)
	return (
		<Route {...rest}>
			{!isAdmin === true ? <Component /> : 
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
			{isAdmin === true ? <Component /> : 
			<Redirect to={{ pathname: "/", state: { from: location } }} />
			}
		</Route>
	)
}

function App() {

	return (
		<ThemeProvider theme={theme}>
			<UserProvider>
                <Router>
                    <div>
                        <Switch>
                            <UserRoute exact path="/" component={NotesLayout}/>
                            <Route exact path="/account"><Layout><Account /></Layout></Route>
                            <Route exact path="/badges"><Layout><Badges /></Layout></Route>
							<Route exact path="/students"><Layout><Students /></Layout></Route>
                            <Route exact path="/feedback"><Layout><Feedback /></Layout></Route>
							<Route exact path="/students/:studentId"><Layout><StudentDetails /></Layout></Route>
                            <AdminRoute exact path="/classes" component={ClassesLayout}/>
							<Route exact path="/badges/:badgeId"><Layout><BadgeDetails /></Layout></Route>
							<Route exact path="/badgeForm"><Layout><BadgeForm></BadgeForm></Layout></Route>

                            <Route exact path="/login"><Login /></Route>
                        </Switch>
                    </div>
                </Router>
			</UserProvider>
		</ThemeProvider>
	);
}

export default App;
