import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import styles from './signInButton.module.scss'
import { FaGithub } from 'react-icons/fa'
import { ImExit } from 'react-icons/im'

export function SignInButton() {
  const { data: session } = useSession()

  return session ? (
    <>  
      <div className={styles.signInButtonContainer}>
            <Image className={styles.avatarImg} src={typeof session?.user?.image === 'string' ? session.user.image : ''} alt="" height={45} width={45} />
            <span>Olá, {session.user?.name}</span>
            <button
              type="button"
              className={styles.signInButton}
              onClick={() => signOut()}
            >
              <ImExit size={24}/>
            </button>
        </div>
    </>
  ) : (
    <>
      <button
        type="button"
        className={styles.signInButton}
        onClick={() => signIn('github')}
      >
        <FaGithub size={24} />
        Login
      </button>
    </>
  )
}