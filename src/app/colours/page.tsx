// src/app/colours/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./colours.module.css";
import { useOrder } from "@/context/orderContext";

export default function ColoursPage() {
  const router = useRouter();
  const { order, setOrder } = useOrder();

  // Alle tilgjengelige farger
  const items = [
    { src: "../../../brun.jpg", text: "Brun" },
    { src: "../../../fuchsia.jpg", text: "Fuchsia" },
    { src: "../../../gul.jpg", text: "Gul" },
    { src: "../../../hvit.jpg", text: "Hvit" },
    { src: "../../../lyseblå.jpg", text: "Lyseblå" },
    { src: "../../../lysegrønn.jpg", text: "Lysegrønn" },
    { src: "../../../lysegrå.jpg", text: "Lysegrå" },
    { src: "../../../lyselilla.jpg", text: "Lyselilla" },
    { src: "../../../lyserosa.jpg", text: "Lyserosa" },
    { src: "../../../mellomblå.jpg", text: "Mellomblå" },
    { src: "../../../mellomlilla.jpg", text: "Mellomlilla" },
    { src: "../../../mellomrosa.jpg", text: "Mellomrosa" },
    { src: "../../../mørkeblå.jpg", text: "Mørkeblå" },
    { src: "../../../mørkegrønn.jpg", text: "Mørkegrønn" },
    { src: "../../../neongrønn.jpg", text: "Neongrønn" },
    { src: "../../../oransje.jpg", text: "Oransje" },
    { src: "../../../rød.jpg", text: "Rød" },
    { src: "../../../sjøgrønn.jpg", text: "Sjøgrønn" },
    { src: "../../../sort.jpg", text: "Sort" },
    { src: "../../../turkis.jpg", text: "Turkis" },
    { src: "../../../vinrød.jpg", text: "Vinrød" },
    { src: "../../../makersChoice.jpg", text: "Makers Choice" },
  ];

  const [selected, setSelected] = useState<typeof items>([]);
  const [limit, setLimit] = useState<number>(0);

  // Når siden laster, regn ut hvor mange som er lov:
  useEffect(() => {
    if (!order.pattern) {
      router.push("/patterns");
      return;
    }

    const txt = order.pattern.text; // f.eks. "2 farger" eller "2–4 farger"
    const numMatch = txt.match(/\d+/g)?.map(Number) || [];
    const max = numMatch.length > 1
      ? Math.max(...numMatch)
      : (numMatch[0] ?? Infinity);

    // Makers Choice → ingen øvre grense
    setLimit(txt.toLowerCase().includes("makers") ? Infinity : max);
  }, [order.pattern, router]);

  const toggle = (item: typeof items[0]) => {
    // Hvis brukeren velger Makers Choice, fjern alle andre og velg kun denne
    if (item.text === "Makers Choice") {
      setSelected([item]);
      return;
    }
    // Dersom Makers Choice allerede er valgt, ignorer alle andre klikk
    if (selected.some((c) => c.text === "Makers Choice")) {
      return;
    }

    const isSel = selected.some((c) => c.text === item.text);
    if (isSel) {
      setSelected((prev) => prev.filter((c) => c.text !== item.text));
    } else if (selected.length < limit) {
      setSelected((prev) => [...prev, item]);
    }
  };

  const handleNext = () => {
    // Lagre valgte farger i context og gå videre
    setOrder((prev) => ({ ...prev, colours: selected }));
    router.push("/size");
  };

  // Kan gå videre hvis Makers Choice er valgt,
  // ellers må man ha valgt nøyaktig limit (eller minst én hvis limit er uendelig)
  const hasMakers = selected.some((c) => c.text === "Makers Choice");
  const canProceed = hasMakers
    ? true
    : limit === Infinity
      ? selected.length > 0
      : selected.length === limit;

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Velg farge(r) ({selected.length}
          {limit !== Infinity && `/${limit}`})
        </h1>
      </section>

      <section className={styles.grid}>
        {items.map((item, i) => {
          const isSel = selected.some((c) => c.text === item.text);
          // Dersom Makers Choice er valgt, deaktiver alle andre.
          // Ellers deaktiver ikke-valgte når man har nådd limit.
          const hasMakersChoice = selected.some((c) => c.text === "Makers Choice");
          const disabled =
            (!isSel && hasMakersChoice) ||
            (!isSel && selected.length >= limit);

          return (
            <div
              key={i}
              className={`${styles.gridItem} ${
                isSel ? styles.selected : ""
              } ${disabled ? styles.disabled : ""}`}
              onClick={() => !disabled && toggle(item)}
            >
              <img src={item.src} alt={item.text} className={styles.photo} />
              <p className={styles.text}>{item.text}</p>
            </div>
          );
        })}
      </section>

      <button
        className={styles.button}
        onClick={handleNext}
        disabled={!canProceed}
      >
        Neste
      </button>
    </div>
  );
}
