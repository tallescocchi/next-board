import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './header.module.scss'

import { SignInButton } from '../SignInButton'

import { AiFillHome } from 'react-icons/ai'
import { BsFillClipboard2Fill } from 'react-icons/bs'

export function Header() {
  const { data: session } = useSession()
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <nav>
            <Link href="/">
              <Image className={styles.logoImg} src="/images/logo.svg" alt="" width={50} height={50} />
            </Link>
            <Link href="/">
              <AiFillHome size={20} />
              Home
              </Link>
              {session ? (
                <Link href="/board">
                  <BsFillClipboard2Fill size={20} />
                  Meu board
                </Link>
              ) : null}
          </nav>

          <SignInButton />
        </div>
      </header>
    </>
  )
}