import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = ({ changeCurrentPage }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/users/login", {
        name: name,
        password: password,
      })
      .then((result) => {
        localStorage.setItem("name", name);
        setPassword("");
        setName("");
        changeCurrentPage("home");
        setTimeout(() => {
          toast("Login successful", {
            description: "User account logged in successfully",
          });
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 403) {
          toast("Login failed", {
            description: "Please enter the correct name and password",
          });
        } else if (error.response.status === 500) {
          toast("Internal server error.", {
            description: "Please try again later",
          });
        }
      });
  };
  return (
    <Card className="w-full justify-center  max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Please login in to your account.</CardDescription>
      </CardHeader>
      <form className="grid gap-4" onSubmit={(e) => handleLogin(e)}>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoComplete="off"
              type="text"
              placeholder="Enter you name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              autoComplete="off"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center w-full flex-col">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
