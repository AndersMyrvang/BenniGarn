"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

export default function Header() {
  const router = useRouter();
  // Hold på info om innlogget bruker
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Lytt til endringer i innloggingsstatus
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Håndter utlogging
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Send brukeren til login-siden etter utlogging
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
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.homeBtn}>
      <i className="bi bi-house-heart"></i>
      </Link>
      
      <div className={styles.rightButtons}>
        <div className={styles.dropdown}>
          <button 
            className={styles.ordersBtn}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Mine bestillinger
          </button>
          {showDropdown && (
            <div className={styles.dropdownContent}>
              {/* Placeholder for orders */}
              <p>Ingen bestillinger ennå</p>
            </div>
          )}
        </div>
        
         {/* Hvis bruker er logget inn, vis "Logg ut"-knapp, ellers "Logg inn"-link */}
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
  )
}

