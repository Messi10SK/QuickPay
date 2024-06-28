import { useEffect, useState } from "react";
import  Appbar  from "../components/Appbar";
import  Balance  from "../components/Balance";
import  Users  from "../components/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

export  const Dashboard = () => {
  const [bal, setBal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");

    // Check if token exists in local storage
    if (!userToken) {
      navigate("/signin"); // Redirect to sign-in page if token doesn't exist
    } else {
      // Fetch balance if token exists
      axios
        .get( "http://localhost:3000/api/v1/account/balance",{
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then((response) => {
          setBal(response.data.balance);
          // console.log(response.data.balance)
        })
        .catch((error) => {
          navigate("/signin");
        });
    }
  }, [navigate]);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={bal} />
        <Users />
      </div>
    </div>
  );
};