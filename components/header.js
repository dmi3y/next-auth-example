import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import styles from "./header.module.css";

export const createQueryParams = (params) => {
  return Object.keys(params)
    .filter((k) => typeof params[k] !== "undefined")
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
};
// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default () => {
  const [session, loading] = useSession();

  console.log(session);

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <a
                href={`/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session && (
            <>
              <span
                style={{ backgroundImage: `url(${session.user.image})` }}
                className={styles.avatar}
              />
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email || session.user.name}</strong>
              </span>
              <button
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault();
                  signOut({
                    callbackUrl: `https://${
                      process.env.AUTH0_DOMAIN
                    }/v2/logout?${createQueryParams({
                      returnTo: process.env.NEXTAUTH_URL,
                      client_id: process.env.AUTH0_ID,
                    })}`,
                  });
                }}
              >
                Sign out
              </button>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/client">
              <a>Client Side</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/server">
              <a>Server Side</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/protected">
              <a>Protected</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
