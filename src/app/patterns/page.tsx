// src/app/patterns/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./patterns.module.css";
import { useOrder } from "@/context/orderContext";

const patternsByWidth: Record<string, { src: string; text: string }[]> = {
  "6 tråder": [
  { src: "../../../2farger6tråder1.jpg", text: "2 farger" },
  { src: "../../../2farger6tråder2.jpg", text: "2 farger" },
  { src: "../../../3farger6tråder1.jpg", text: "3 farger" },
  { src: "../../../3farger6tråder2.jpg", text: "3 farger" },
  { src: "../../../3farger6tråder3.jpg", text: "3 farger" },
  { src: "../../../6farger6tråder1.jpg", text: "6 farger" },
  { src: "../../../makersChoice3.2.jpg", text: "Makers Choice" },
],
 "8 tråder": [
  { src: "../../../2farger8tråder1.jpg", text: "2 farger" },
  { src: "../../../2-4farger8tråder1.jpg", text: "2–4 farger" },
  { src: "../../../2-4farger8tråder2.jpg", text: "2–4 farger" },
  { src: "../../../2-4farger8tråder3.jpg", text: "2–4 farger" },
  { src: "../../../2-4farger8tråder4.jpg", text: "2–4 farger" },
  { src: "../../../3farger8tråder1.jpg", text: "3 farger" },
  { src: "../../../4farger8tråder1.jpg", text: "4 farger" },
  { src: "../../../4farger8tråder2.jpg", text: "4 farger" },
  { src: "../../../4farger8tråder3.jpg", text: "4 farger" },
  { src: "../../../4farger8tråder4.jpg", text: "4 farger" },
  { src: "../../../4farger8tråder5.jpg", text: "4 farger" },
  { src: "../../../4farger8tråder6.jpg", text: "4 farger" },
  { src: "../../../5farger8tråder1.jpg", text: "5 farger" },
  { src: "../../../makersChoice3.2.jpg", text: "Makers Choice" },
],
 "10 tråder": [
  { src: "../../../5farger10tråder1.jpg", text: "5 farger" },
  { src: "../../../5farger10tråder2.jpg", text: "5 farger" },
  { src: "../../../5farger10tråder3.jpg", text: "5 farger" },
  { src: "../../../makersChoice3.2.jpg", text: "Makers Choice" },
],
};

export default function PatternsPage() {
  const router = useRouter();
  const { order, setOrder } = useOrder();
  const [items, setItems] = useState<typeof patternsByWidth[string]>([]);

  useEffect(() => {
    if (!order.width) {
      router.push("/width");
      return;
    }
    setItems(patternsByWidth[order.width.text] || []);
  }, [order.width, router]);

  const handleClick = (item: { src: string; text: string }) => {
    setOrder((prev) => ({ ...prev, pattern: item }));
    router.push("/colours");
  };

  return (
    <div className={styles.container}>
       <section className={styles.hero}>
        <h1 className={styles.title}>Mønster ({order.width?.text})</h1>
      </section>
      <div className={styles.grid}>
        {items.map((item, i) => (
          <div
            key={i}
            className={styles.gridItem}
            onClick={() => handleClick(item)}
            style={{ cursor: "pointer" }}
          >
            <img src={item.src} alt={item.text} className={styles.photo} />
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
