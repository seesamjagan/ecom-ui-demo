import React, { Component } from "react";
import "./App.css";
import { Card, CardHeader, CardBody, CardFooter } from "reactstrap";
import Landing from "./views/landing";
import Cart from "./views/cart";

const Views = {
  LANDING: "landing",
  CART: "cart"
};
class App extends Component {
  state = {
    view: Views.LANDING,
    cart: [],
    userName: null
  };

  onAddToCart = cart => {
    this.setState({ cart });
  };

  onCartClick = e => {
    this.setState({ view: Views.CART });
  };

  onLoginSuccess = userName => {
    this.setState({ userName });
  };

  backToLandingPage = e => {
    this.setState({ view: Views.LANDING });
  }

  getView = () => {
    let { view, userName } = this.state;
    switch (view) {
      case Views.LANDING:
        return (
          <Landing
            onAddToCart={this.onAddToCart}
            onLoginSuccess={this.onLoginSuccess}
            userName={userName}
          />
        );
      case Views.CART:
        return <Cart data={this.state.cart} userName={userName} onBack={this.backToLandingPage} />;
      default:
        return <div>404: Unknow View</div>;
    }
  };

  render() {
    let { userName, cart } = this.state;
    return (
      <Card>
        <CardHeader>
          <h1 className="float-left">E-Com</h1>
          {userName && <small className="float-right"> {userName} </small>}
          <small className="float-right" onClick={this.onCartClick}>
            <span> Cart </span> <span> ({cart.length}) </span>
          </small>
        </CardHeader>
        <CardBody>{this.getView()}</CardBody>
        <CardFooter>
          <span>Copyrights &copy; </span>
          <span>{new Date().getFullYear()}</span> <span>E-Com Inc.</span>
        </CardFooter>
      </Card>
    );
  }
}

export default App;
