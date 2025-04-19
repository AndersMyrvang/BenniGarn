// src/app/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { auth } from "@/firebase/config";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Du må være logget inn for å bestille. Logg inn først.");
      router.push("/login");
      return;
    }
    router.push("/width");
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>BenniGarn</h1>
      </section>
      <section className={styles.content}>
        <h4 className={styles.subtitle}>
          Her kan du bestille et armbånd med ønsket bredde, mønster og farger.
        </h4>
        <button className={styles.button} onClick={handleButtonClick}>
          Bestill armbånd
        </button>
        <p className={styles.disclaimer}>
          Hvis du ved noen av stegene velger makers choice kan det forekomme nye mønstre og farger som ikke blir vist på siden.
          Dette er fordi jeg hele tiden leter etter nye garn og patterns.
        </p>
      </section>
    </div>
  );
}
