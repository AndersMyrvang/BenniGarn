"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./size.module.css";
import { useOrder } from "@/context/orderContext";

export default function SizePage() {
  const [length, setLength] = useState("");
  const router = useRouter();
  const { setOrder } = useOrder();

  const handleNext = () => {
    if (!length || isNaN(Number(length))) {
      alert("Skriv inn et gyldig tall i cm.");
      return;
    }
    // lagre i state, context eller database før du sender videre
    router.push("/summary"); // eller hva neste steg er

    setOrder((prev) => ({ ...prev, length }));
    router.push("/summary");
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Størrelse</h1>
      </section>

      <section className={styles.content}>
        <p className={styles.instructions}>
          Mål rundt håndleddet ditt med et målebånd, og skriv inn lengden i centimeter under.
        </p>
        <img src="/measure_illustration.png" alt="Hvordan måle håndledd" className={styles.image} />
        <input
          type="number"
          placeholder="F.eks. 17.5"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className={styles.input}
        />

        <button className={styles.button} onClick={handleNext}>
          Neste
        </button>
      </section>
    </div>
  );
}
