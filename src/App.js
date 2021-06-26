import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import Login from './pages/login';
import Home from './pages/home';
import UserProvider from './userContext'

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

function App() {

	return (
		<ThemeProvider theme={theme}>
			<UserProvider>
				<Router>
					<div>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/login" component={Login} />
						</Switch>
					</div>
				</Router>
			</UserProvider>
		</ThemeProvider>
	);
}

export default App;
