"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

type Order = {
  id: string;
  width: string;
  widthSrc?: string;
  pattern: string;
  patternSrc?: string;
  colours: string[];
  coloursSrc?: string[];
  mostColour?: string;
  length: number | string;
  status: string;
  createdAt: Timestamp | { toDate: () => Date };
};

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auth + admin check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        setIsAdmin((snap.exists() && (snap.data() as any).isAdmin) === true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch current user's orders
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    const q = query(
      collection(db, "orders"),
      where("email", "==", user.email),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setOrders(fetched);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
    alert("Logget ut");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.homeBtn}>
          <i className="bi bi-house-heart"></i>
        </Link>
        <div className={styles.rightButtons}>
          {isAdmin && (
            <button
              className={styles.ordersBtn}
              onClick={() => router.push("/admin")}
            >
              Alle bestillinger
            </button>
          )}
          {user && (
            <div className={styles.dropdown}>
              <button
                className={styles.ordersBtn}
                onClick={() => setShowDropdown((v) => !v)}
              >
                Mine bestillinger
              </button>
              {showDropdown && (
                <div className={styles.dropdownContent}>
                  {orders.length === 0 ? (
                    <p>Ingen bestillinger ennå</p>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className={styles.orderItem}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDropdown(false);
                        }}
                      >
                        <p><strong>{order.pattern}</strong></p>
                        <p>{order.width} – {order.length} cm</p>
                        <p>Status: <em>{order.status}</em></p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          {user ? (
            <button onClick={handleLogout} className={styles.loginBtn}>
              Logg ut
            </button>
          ) : (
            <button onClick={handleLogin} className={styles.loginBtn}>
              Logg inn
            </button>
          )}
        </div>
      </header>

      {selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
            <h2>Ordredetaljer</h2>
            <p>
              <strong>Bestilt:</strong>{" "}
              {selectedOrder.createdAt
                .toDate()
                .toLocaleString("no-NB")}
            </p>

            <section className={styles.detailSection}>
              <h3>Bredde</h3>
              {selectedOrder.widthSrc && (
                <img
                  src={selectedOrder.widthSrc}
                  alt={selectedOrder.width}
                  className={styles.detailImage}
                />
              )}
              <p>{selectedOrder.width}</p>
            </section>

            <section className={styles.detailSection}>
              <h3>Mønster</h3>
              {selectedOrder.patternSrc && (
                <img
                  src={selectedOrder.patternSrc}
                  alt={selectedOrder.pattern}
                  className={styles.detailImage}
                />
              )}
              <p>{selectedOrder.pattern}</p>
            </section>

            <section className={styles.detailSection}>
              <h3>Farge(r)</h3>
              <div className={styles.colourList}>
                {selectedOrder.coloursSrc?.map((src, i) => (
                  <div key={i} className={styles.colourItem}>
                    <img
                      src={src}
                      alt={selectedOrder.colours[i]}
                      className={styles.detailImage}
                    />
                    <p>{selectedOrder.colours[i]}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.detailSection}>
              <h3>Mest av</h3>
              <p>{selectedOrder.mostColour || "Ikke angitt"}</p>
            </section>

            <section className={styles.detailSection}>
              <h3>Lengde</h3>
              <p>{selectedOrder.length} cm</p>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
