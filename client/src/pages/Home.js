import { useQuery } from "@tanstack/react-query";
import React from "react";
import Axios from "axios";

const fetchCars = async () => {
  const res = await fetch("http://localhost:3001/");
  return res.json();
};

const Home = () => {
  const { data } = useQuery(["car"], fetchCars);

  return (
    <div className="home">
      <h1>Global Craigslist Auto Scraper</h1>
      <input type="text" placeholder="model..."/>
      <input type="text"placeholder="mileage" />
      <input type="text"placeholder="mileage" />
      <button onClick={fetchCars}>Show Cars</button>
      <div className="home-body">
      {data?.key.map((list ,i) => (
        <div key={i} className="box">
          
          <a target="_blank" href={list.links}>{list.title}</a>
          <img src={list.img} alt="" />
          <h3>{list.title}</h3>
          <h3>{list.prices}</h3>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Home;
