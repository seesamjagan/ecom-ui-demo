import React, { Component } from "react";
import "./App.css";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Nav,
  NavItem,
  Badge
} from "reactstrap";
import Landing from "./views/landing";
import Cart from "./views/cart";
import {
  BrowserRouter as Router,
  Route,
  NavLink as Link,
  Switch
} from "react-router-dom";
import { Login } from "./views/login";
import { fetchConfig } from "./utils/fetch-config";

class App extends Component {
  state = {
    cart: [],
    userName: sessionStorage.getItem("ecom-current-session-id")
  };

  componentDidMount() {
    if(this.state.userName) {
      this.loadCart(this.state.userName);
    }
  }

  loadCart = userName => {
    let payload = { userName };

    fetch("http://localhost:3300/products/get-cart", fetchConfig(payload))
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status) {
          this.setState({
            cart: res.data
          });
        } else {
          alert(res.message);
        }
      })
      .catch(reason => {
        alert(reason);
      });
  };

  updateCart = cart => {
    this.setState({ cart });
  };

  onLoginSuccess = userName => {
    sessionStorage.setItem("ecom-current-session-id", userName);
    this.setState({ userName });
    this.loadCart(userName);
  };

  render() {
    let { userName, cart } = this.state;
    return (
      <Router>
        <Card>
          <AppHeader userName={userName} cart={cart} />
          <AppBody
            userName={userName}
            onLoginSuccess={this.onLoginSuccess}
            onAddToCart={this.updateCart}
          />
          <AppFooter />
        </Card>
      </Router>
    );
  }
}

const AppBody = props => (
  <CardBody>
    <AppNavBar />
    <hr />
    <AppRoutes {...props} />
  </CardBody>
);

const AppNavBar = props => (
  <Nav>
    <NavItem>
      <Link className="nav-link" to="/">
        Home
      </Link>
    </NavItem>
    <NavItem>
      <Link className="nav-link" to="/about">
        About us
      </Link>
    </NavItem>
  </Nav>
);

const AppRoutes = ({ userName, onAddToCart, onLoginSuccess }) => (
  <Switch>
    <Route
      exact
      path="/"
      render={props => (
        <Landing
          {...props}
          userName={userName}
          onAddToCart={onAddToCart}
          onLoginSuccess={onLoginSuccess}
        />
      )}
    />
    <Route
      path="/cart"
      render={props => <Cart {...props} userName={userName} />}
    />
    <Route
      path="/login"
      render={props => (
        <Login {...props} onLoginSuccess={onLoginSuccess} userName={userName} />
      )}
    />
    <Route path="/about" render={props => <div>About us Will Come Soon</div>} />
    <Route
      path="/profile"
      render={props => <div>Profile Will Come Soon</div>}
    />
    <Route render={props => <div>404: what do you want?</div>} />
  </Switch>
);

const AppHeader = ({ userName, cart }) => (
  <CardHeader>
    <h1 className="float-left">E-Com</h1>
    {userName && (
      <Link to="/profile" className="float-right">
        <Badge color="info"> {userName} </Badge>
      </Link>
    )}
    {!userName && (
      <Link to="/login" className="float-right">
        Login
      </Link>
    )}
    <Link to="/cart" className="float-right">
      Cart <Badge> ({cart.length}) </Badge>
    </Link>
  </CardHeader>
);

const AppFooter = props => (
  <CardFooter>
    <span>Copyrights &copy; </span>
    <span>{new Date().getFullYear()}</span> <span>E-Com Inc.</span>
  </CardFooter>
);

export default App;
