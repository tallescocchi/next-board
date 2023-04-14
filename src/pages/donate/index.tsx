import { useState } from 'react'
import Head from 'next/head'
import styles from './Donate.module.scss'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { dataBase } from '@/services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

//clientId - AVvFED-1Inzu1XS0g48J4n-MvJDozvXmB3pAvib2tZrTxn_Er6rVoSaUc5yf99J3UfRBIBcAovAUkFHB
//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

interface DonateProps {
 user: {
  id: string
  name: string
  image: string
 }
}

export default function Donate({ user }: DonateProps) {
  const [vip, setVip] = useState(false)

  async function handleSaveDonate() {
    await addDoc(collection(dataBase, 'users', user.id, 'donations'), {
      donate: true,
      lastDonate: new Date(),
      image: user.image,
      userId: user.id 
    }).then(() => {
      setVip(true)
    })
  }

return (
  <>
    <Head>
        <title>Next Board | Apoie o Projeto</title>
    </Head> 
    <main className={styles.DonateContainer}>
      <Image src="/images/rocket.svg" alt="" width={409} height={340} />

      {vip && (
        <div className={styles.Vip}>
          <Image src={user.image} alt="" width={48} height={48} />
          <strong>Parabêns, agora você é um colaborador!</strong>
        </div>
      )}

      <h1>Seja um apoiador deste projeto! 🏆</h1>
      <h3>Contribua com apenas <span>R$ 1,00</span></h3>
      <p>Apareça na nossa home, tenha funcionalidades exclusivas.</p>

      <PayPalButtons 
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '1'
              }
            }]
          })
        }}
        //@ts-ignore
        onApprove={(data, actions) => {
          return actions.order?.capture()
            .then(function(details){
              console.log('Compra aprovada!' + details.payer.name?.given_name)
              handleSaveDonate()
            })
        }}
      />
    </main>
  </>
)
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if(!session?.userId) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const user = {
    id: session?.userId,
    name: session.user?.name,
    image: session.user?.image
  }

  return {
    props: {
      user
    }
  }
}