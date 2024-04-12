import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
require("dotenv").config();
import { Label } from "@/components/ui/label";

const Register = ({ changeCurrentPage, changeCurrentTab }) => {
  const URL = process.env.BACKEND_URL
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    console.log(name);
    console.log(password);
    const userToSave = {
      name: name,
      password: password,
    };
    axios
      .post(`${URL}/api/users`, userToSave)
      .then((result) => {
        localStorage.setItem("name", name);
        setPassword("");
        setName("");
        changeCurrentPage("home");
        setTimeout(() => {
          toast("Registration successful", {
            description: "User account registered successfully",
          });
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 404) {
          toast("User already exists", {
            description: "Please enter a unique username.",
          });
        } else if (error.response.status === 500) {
          toast("Internal server error.", {
            description: "Please try again later",
          });
        } else {
          toast("An error occurred.", {
            description: "Please try again later.",
          });
        }
      });
  };

  return (
    <Card className="w-full justify-center  max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter a name and password to create your account.
        </CardDescription>
      </CardHeader>
      <form className="grid gap-4" onSubmit={(e) => handleRegister(e)}>
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
              Register
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Register;
