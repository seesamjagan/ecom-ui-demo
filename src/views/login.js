import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from "reactstrap";
import { Redirect, Link } from "react-router-dom";
import { fetchConfig } from "../utils/fetch-config";

export const Login = ({ onLoginSuccess, className, userName }) => {
  useEffect(() => {
    let e = document.getElementById("userName");
    e && e.focus();
  }, [className]);

  const onKeyUp = e => {
    if (e.key === "Enter") {
      login(e.target.value);
    }
  };

  if (userName) {
    return <Redirect to="/" />;
  }

  const login = userName => {
    let data = { userName };
    fetch("http://localhost:3300/users/login", fetchConfig(data))
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status) {
          onLoginSuccess(userName);
        } else {
          alert(res.message);
        }
      })
      .catch(reason => {
        alert("error: " + reason);
        //alert("oops");
      });
  };

  return (
    <Card className={className}>
      <CardHeader>Login</CardHeader>
      <CardBody>
        <InputGroup>
          <InputGroupAddon addonType="prepend">Username</InputGroupAddon>
          <Input placeholder="eg. jagan" id="userName" onKeyUp={onKeyUp} />
        </InputGroup>
      </CardBody>
      <CardFooter>
        <Button
          color="primary"
          onClick={()=>login(document.getElementById("userName").value)}
        >
          Login
        </Button>
        <Link to="/">Cancel</Link>
      </CardFooter>
    </Card>
  );
};
