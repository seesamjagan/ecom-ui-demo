import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Media, Row, Table } from "reactstrap";
import { fetchConfig } from "../utils/fetch-config";

export default class Cart extends Component {
  state = {
    cartItems: []
  };

  componentDidMount() {
    this.loadCart(this.props.userName);
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
            cartItems: res.data
          });
        } else {
          alert(res.message);
        }
      })
      .catch(reason => {
        alert(reason);
      });
  };

  render() {
    return (
      <>
        <Row>
          <Col>
            <h2>Items in your Cart</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Qnt</th>
                  <th>Unit Price</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {this.state.cartItems.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <Media
                          object
                          className="rounded-circle"
                          src={item.url[0].replace("150", "64")}
                          alt={item.name}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>
                        <input defaultValue={1} />
                      </td>
                      <td>{item.unitPrice}</td>
                      <td>{item.unitPrice * 1}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-right">
            <Link to="/">Back</Link>
          </Col>
          <Col>
            <Link to="/order">Buy Now</Link>
          </Col>
        </Row>
      </>
    );
  }
}
