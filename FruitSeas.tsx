import React, { useState, useEffect } from "react";
import axios from "axios";
import AnimatedNumbers from "react-animated-numbers";

async function getGameData(placeId) {
  try {
    const placeIdsString = placeId.join(",");
    const universeIdResponse = await axios.get(
      `https://apis.roproxy.com/universes/v1/places/${placeIdsString}/universe`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (!universeIdResponse) {
      return;
    }
    const universeId = universeIdResponse.data.universeId;
    if (!universeId) {
      return;
    }

    const response = await axios.get(
      `https://games.roproxy.com/v1/games?universeIds=${universeId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const games = response.data.data;
    return games;
  } catch (err) {
    console.log("error getting game data:", err);
    throw err;
  }
}

export function PlaceNumber({ placeId }) {
  const [count, setCount] = useState(0);

  function Update() {
    getGameData([placeId]).then((data) => {
      setCount(data[0].playing);
    });
  }

  useEffect(() => {
    Update();

    const intervalId = setInterval(() => {
      Update();
    }, 5000); // Every 5 seconds, update the playing count

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AnimatedNumbers
      includeComma
      transitions={(index) => ({
        type: "spring",
        duration: index + 0.3,
      })}
      animateToNumber={count}
      fontStyle={{
        fontSize: 30,
        color: "green",
      }}
    />
  );
}

export default function App() {
  return <PlaceNumber placeId={6897167394} />;
}
