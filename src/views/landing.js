import React, { Component } from "react";
import { fetchConfig } from "../utils/fetch-config";
import {
  Row,
  Col,
  CardImg,
  Card,
  CardImgOverlay,
  CardTitle,
  CardText,
  CardFooter,
  Button,
  Badge,
  CardBody,
  CardHeader,
  InputGroup,
  InputGroupText,
  Input,
  InputGroupAddon,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

export default class Landing extends Component {

  login = (userName) => {
    let data = {userName};
    fetch(
      "http://localhost:3300/users/login",
      fetchConfig(data)
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if(res.status) {
            this.props.onLoginSuccess(userName);
            this.setState({showLoginModel: false});
        } else {
          alert(res.message);
        }
      })
      .catch((reason) => {
        alert("error: " + reason);
        //alert("oops");
      });
  };

  state = {
    products: [],
    items: [],
    showLoginModel: false
  };

  loadProducts = () => {
    let payload = {};

    fetch("http://localhost:3300/products", fetchConfig(payload))
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status) {
          this.setState({
            products: res.data,
            items: res.data
          });
        } else {
          alert(res.message);
        }
      })
      .catch(reason => {
        alert(reason);
      });
  };

  addToCart = id => {
    if (!this.props.userName) {
      this.setState({ showLoginModel: true, pendingCartId: id });
      return;
    }

    let payload = { id, userName: this.props.userName };

    fetch("http://localhost:3300/products/add-to-cart", fetchConfig(payload))
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status) {
          this.props.onAddToCart(res.data);
        } else {
          alert(res.message);
        }
      })
      .catch(reason => {
        alert(reason);
      });
  };

  componentDidMount() {
    this.loadProducts();
  }

  componentDidUpdate() {
    if(this.props.userName && this.state.pendingCartId) {
      this.addToCart(this.state.pendingCartId);
      this.setState({pendingCartId: null})
    }
  }

  onChange = e => {
    let { items } = this.state;
    let key = e.target.value.toLowerCase();
    this.setState({
      products: items.filter(item => {
        if (
          item.name.toLowerCase().indexOf(key) >= 0 ||
          item.desc.toLowerCase().indexOf(key) >= 0
        ) {
          return true;
        }
        return false;
      })
    });
  };

  onCancelLogin = e => {
    this.setState({ showLoginModel: false });
  };

  onLogin = userName => {
    this.login(userName);
  };

  render() {
    let { products, showLoginModel } = this.state;
    return (
      <>
        <Row>
          <Col>
            <InputGroup>
              <Input placeholder="search" onChange={this.onChange} />
              <InputGroupAddon addonType="append">🔍</InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <hr />
        <Row>
          {products.map((product, i) => (
            <Product data={product} key={i} addToCart={this.addToCart} />
          ))}
        </Row>
        <LoginModel
          isOpen={showLoginModel}
          onLogin={this.onLogin}
          onCancel={this.onCancelLogin}
        />
      </>
    );
  }
}

const Product = ({ data, addToCart }) => (
  <Col md={3}>
    <Card>
      <CardImg width="100%" src={data.url[0]} alt={data.desc} />
      <CardBody>
        <CardTitle>
          <h3>{data.name}</h3>
        </CardTitle>
        <CardText>{data.desc}</CardText>
        <CardText>
          <small className="text-muted">{data.stock} left in stock</small>
        </CardText>
      </CardBody>
      <CardFooter>
        <Badge color="success" className="float-left">
          ${data.unitPrice}
        </Badge>
        <Badge color="primary" className="float-right">
          <span onClick={() => addToCart(data.id)}>Add to Card</span>
        </Badge>
      </CardFooter>
    </Card>
  </Col>
);

const LoginModel = ({ isOpen, onLogin, onCancel, className }) => (
  <Modal isOpen={isOpen} toggle={onCancel} className={className}>
    <ModalHeader toggle={onCancel}>Login</ModalHeader>
    <ModalBody>
      <InputGroup>
        <InputGroupAddon addonType="prepend">Username</InputGroupAddon>
        <Input placeholder="eg. jagan" id="userName" />
      </InputGroup>
    </ModalBody>
    <ModalFooter>
      <Button
        color="primary"
        onClick={() => onLogin(document.getElementById("userName").value)}
      >
        Login
      </Button>{" "}
      <Button color="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
);
