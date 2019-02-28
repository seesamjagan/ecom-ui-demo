import React, { Component } from "react";
import {
  BrowserRouter as Router,
  NavLink as Link,
  Route,
  Switch
} from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Nav,
  NavItem
} from "reactstrap";
import "./App.css";
import { fetchConfig } from "./utils/fetch-config";
import Cart from "./views/cart";
import Landing from "./views/landing";
import { Login } from "./views/login";
import { ProductDetail } from "./views/product-detail";

class App extends Component {
  state = {
    cart: [],
    userName: sessionStorage.getItem("ecom-current-session-id")
  };

  componentDidMount() {
    if (this.state.userName) {
      this.loadCart(this.state.userName);
    }
  }

  loadCart = userName => {
    let payload = { userName };

    fetch("/products/get-cart", fetchConfig(payload))
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

const AppNavBar = props => {
  let navs = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/products", label: "Products" }
  ];
  return (
    <Nav>
      {navs.map(({ to, label }, index) => (
        <NavItem key={index}>
          <Link className="nav-link" to={to}>
            {label}
          </Link>
        </NavItem>
      ))}
    </Nav>
  );
};

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
      exact
      path="/products"
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
      exact
      path="/products/:id"
      render={props => (
        <ProductDetail
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

    <div className="float-right">
      <Link to="/cart">
        Cart <Badge> ({cart.length}) </Badge>
      </Link>
      <span> | </span>
      {userName && (
        <Link to="/profile">
          <Badge color="info"> {userName} </Badge>
        </Link>
      )}
      {!userName && <Link to="/login">Login</Link>}
    </div>
  </CardHeader>
);

const AppFooter = props => (
  <CardFooter>
    <span>Copyrights &copy; </span>
    <span>{new Date().getFullYear()}</span> <span>E-Com Inc.</span>
  </CardFooter>
);

export default App;
