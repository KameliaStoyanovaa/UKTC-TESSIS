import React from "react";
import { checkIn, checkOut } from "../services/api";

const CheckInOut = () => {
  return (
    <div>
      <button onClick={checkIn}>Вписване</button>
      <button onClick={checkOut}>Отписване</button>
    </div>
  );
};

export default CheckInOut;