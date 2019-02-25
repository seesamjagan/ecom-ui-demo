import React, { Component, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import {NavLink as Link} from "react-router-dom";

import { fetchConfig } from "../utils/fetch-config";

const PAGE_SIZE = 12;

export default class Landing extends Component {
  login = userName => {
    let data = { userName };
    fetch("http://localhost:3300/users/login", fetchConfig(data))
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status) {
          this.props.onLoginSuccess(userName);
          this.setState({ showLoginModel: false });
        } else {
          alert(res.message);
        }
      })
      .catch(reason => {
        alert("error: " + reason);
        //alert("oops");
      });
  };

  state = {
    products: [],
    items: [],
    showLoginModel: false,
    total: PAGE_SIZE,
    page: 1
  };

  loadProducts = (page) => {
    let payload = { page, size:PAGE_SIZE };

    fetch("http://localhost:3300/products", fetchConfig(payload))
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status) {
          this.setState({
            products: res.data,
            items: res.data,
            page: Number(res.page),
            total: Number(res.total)
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
    this.loadProducts(1);
  }

  componentDidUpdate() {
    if (this.props.userName && this.state.pendingCartId) {
      this.addToCart(this.state.pendingCartId);
      this.setState({ pendingCartId: null });
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

  onPageClick = page => {
    this.loadProducts(page)
  }

  render() {
    let { products, showLoginModel, page, total } = this.state;
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
        <hr/>
        <PageNav current={page} total={total} onPageClick={this.onPageClick} />
        <hr/>
        <LoginModel
          isOpen={showLoginModel}
          onLogin={this.onLogin}
          onCancel={this.onCancelLogin}
        />
      </>
    );
  }
}

const PageNav = ({current, total, onPageClick}) => {
  
  let size = Math.ceil(total / PAGE_SIZE)
  let navs = Array.apply(null, {length: size}).map((item, index)=>{
    return (<PaginationItem key={index}>
    <PaginationLink onClick={()=>onPageClick(index+1)} className={(index+1)===current ? "active" : ""}>{index+1}</PaginationLink>
  </PaginationItem>)
  })
  
  return (<Row>
  <Col md={12} className="text-center">
    <Pagination size="sm" aria-label="Product Page Navigation" className="d-inline-block">
    {/* 
      <PaginationItem>
        <PaginationLink first href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink previous href="#" />
      </PaginationItem>
       */}
      {navs}
      {/* 
      <PaginationItem>
        <PaginationLink next href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink last href="#" />
      </PaginationItem>
       */}
    </Pagination>
  </Col>
</Row>)}

const Product = ({ data, addToCart }) => (
  <Col md={3} lg={3} sm={6}>
    <Card>
      <CardImg width="100%" src={data.url[0]} alt={data.desc} />
      <CardBody>
        <CardTitle>
          <strong className="text-truncate text-capitalize" title={data.name}><Link to={"/products/"+data.id}>{data.name}</Link></strong>
        </CardTitle>
        <CardText>{data.desc}</CardText>
        <CardText>
          <small className="text-muted">
            <Badge>{data.stock}</Badge> left in stock
          </small>
        </CardText>
      </CardBody>
      <CardFooter>
        <Badge color="success" className="float-left">
          <span>$ {data.unitPrice}</span>
        </Badge>
        <Badge color="primary" className="float-right">
          <span onClick={() => addToCart(data.id)}>Add to Card</span>
        </Badge>
      </CardFooter>
    </Card>
  </Col>
);

const LoginModel = ({ isOpen, onLogin, onCancel, className }) => {
  useEffect(() => {
    let e = document.getElementById("userName");
    e && e.focus();
    console.log("inside effects");
  }, [isOpen]);

  const onKeyUp = e => {
    if (e.key === "Enter") {
      onLogin(e.target.value);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onCancel} className={className}>
      <ModalHeader toggle={onCancel}>Login</ModalHeader>
      <ModalBody>
        <InputGroup>
          <InputGroupAddon addonType="prepend">Username</InputGroupAddon>
          <Input placeholder="eg. jagan" id="userName" onKeyUp={onKeyUp} />
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
};
