import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './App.css';
import Home from './components/Home'
import ProductsPage from './containers/ProductsPage'
import MyNavbar from "./components/Navbar";
import AddProductsPage from './containers/AddProductsPage'
import SalesPage from "./containers/SalesPage";
import EditProductsPage from "./containers/EditProductsPage";
import AddSalesPage from "./containers/AddSalesPage";
import EditSalesPage from './containers/EditSalesPage';
import PurchasesPage from './containers/PurchasesPage'
import AddPurchasesPage from "./containers/AddPurchasesPage";
import EditPurchasesPage from "./containers/EditPurchasesPage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { Provider } from 'react-redux'
import store from './store';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/Dashboard";

if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set User isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // To get in milliseconds

  if (decoded.exp < currentTime) {
    // Logout User
    store.dispatch(logoutUser());


    // Redirect User to login
    window.location.href = "./login"
  }

}

function App() {
  return (
    <Provider store={store}>
      <MyNavbar />
      <ReactNotification />
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <Route exact path="/products">
            <ProductsPage />
          </Route>
          <Route path="/products/addnew">
            <AddProductsPage />
          </Route>
          <Route path="/products/:productId">
            <EditProductsPage />
          </Route>
          <Route exact path="/sales">
            <SalesPage />
          </Route>
          <Route path="/sales/addnew">
            <AddSalesPage />
          </Route>
          <Route path="/sales/:saleId">
            <EditSalesPage />
          </Route>
          <Route exact path="/purchases">
            <PurchasesPage />
          </Route>
          <Route path="/purchases/addnew">
            <AddPurchasesPage/>
          </Route>
          <Route path="/purchases/:saleId">
            <EditPurchasesPage />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
