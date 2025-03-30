"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";


export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Sjekk om brukeren er admin
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        setIsAdmin(snap.exists() && snap.data().isAdmin === true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);


  // Fetch user's orders from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("email", "==", user.email),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      alert("Logget ut");
    } catch (error) {
      console.error("Feil ved utlogging:", error);
    }
  };

  const handleLogin = async () => {
    try {
      router.push("/login");
    } catch (error) {
      console.error("Feil ved innlogging:", error);
    }
  };

  return (
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
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Mine bestillinger
            </button>
            {showDropdown && (
              <div className={styles.dropdownContent}>
                {orders.length === 0 ? (
                  <p>Ingen bestillinger ennå</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className={styles.orderItem}>
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
  );
}
