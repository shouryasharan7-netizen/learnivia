import Link from "next/link"
import Image from "next/image"
import styles from "./Navbar.module.css"

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/images/logo.png" alt="Learnivia Logo" width={40} height={40} />
          <span>Learnivia</span>
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link href="/">Home</Link>
        <Link href="/find">Find a Tutor</Link>
        <Link href="/apply">Become a Tutor</Link>
        <Link href="/how-it-works">How It Works</Link>
        <Link href="/about">About</Link>
        <Link href="/login" className={styles.loginBtn}>Login</Link>
      </div>
    </nav>
  )
}
