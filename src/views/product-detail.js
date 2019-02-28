import React, { useEffect, useState } from "react";
import { NavLink as Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Media,
  Row
} from "reactstrap";
import { fetchConfig } from "../utils/fetch-config";

export const ProductDetail = ({ history, match }) => {
  let [product, setProduct] = useState(null);
  useEffect(() => {
    let url = `/products/product/${match.params.id}`;
    let payload = { id: match.params.id };

    fetch(url, fetchConfig(payload))
      .then(res => res.json())
      .then(res => {
        setProduct(res.data);
      })
      .catch(reason => {
        alert(reason);
      });
  }, [match.params.id]);

  //console.log(history)
  const onBack = e => {
    e.preventDefault();
    if (history.length > 2) {
      history.goBack();
    } else {
      history.push("/");
    }
  };
  return (
    <Card>
      <CardHeader><h2 className="text-capitalize">{product ? product.name : "Product Details"}</h2></CardHeader>

      <CardBody>
        {!product && <p>{match.params.id} is the id of the selected product</p>}
        {product && (
          <div>
            <Row>
              {product.url.map(url => (
                <Col key={url} >
                  <Media src={url} alt={product.desc}/>
                </Col>
              ))}
            </Row>

            {/* <CardTitle>{product.name}</CardTitle> */}
            <CardText>{product.desc}</CardText>
          </div>
        )}
      </CardBody>
      <CardFooter>
        <Link to="/" onClick={onBack}>
          Back
        </Link>
      </CardFooter>
    </Card>
  );
};
