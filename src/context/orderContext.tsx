"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Order = {
   width?: { src: string; text: string };
   pattern?: { src: string; text: string };
   length?: string;
   colours?: { src: string; text: string }[];
   mostColour?: string;  
};

type OrderContextType = {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within OrderProvider");
  return context;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Order>({
    colours: [], 
  });
  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
