import Link from 'next/link'
import styles from './supportButton.module.scss'
import { FaDonate } from 'react-icons/fa'

export function SupportButton() {
  return (
    <>
      <div className={styles.DonateContainer}>
        <Link href="/donate">
          <button title='Apoie esse projeto'><FaDonate size={24} /></button>
        </Link>
      </div>
    </>
  )
}