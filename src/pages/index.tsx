import { useState } from "react"

import Head from "next/head";
import { GetStaticProps } from "next";
import Image from "next/image"

import { collectionGroup, getDocs } from "firebase/firestore";
import { dataBase } from "@/services/firebaseConnection"

import styles from '../styles/home.module.scss'

type Data = {
  id: string
  donate: boolean
  lastDonate: Date
  image: string
}

interface HomeProps {
  querySnapshot: string
}

export default function Home({ querySnapshot }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(querySnapshot))

  return (
    <>
      <Head>
        <title>Next Board | Home</title>
      </Head>

      <main className={styles.HomeContainer}>
        <Image className={styles.BoardImg} src="/images/board-user.svg" alt="" width={390} height={390} priority={true} />
        <section className={styles.HomeDetails} >
          <h1>Uma ferramenta para seu dia a dia Escreva, planeje e organize-se.</h1>
          <h2><span>100% Gratuita</span> e online</h2>
        </section>
        {donaters.length !== 0 && (
        <section className={styles.Donaters}>
          <div className={styles.Avatars}>
            {donaters.map(item => (
            <Image key={item.id} src={item.image} alt="1" width={50} height={50} />
            ))}             
          </div>
          <p><span>{donaters.length}</span> {donaters.length >= 2 ? 'Apoiadores' : 'Apoiador'}</p>
        </section>
          )}

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

const q = collectionGroup(dataBase, 'donations')

const tasksList = await getDocs(q)

const querySnapshot = JSON.stringify(tasksList.docs.map(u => {
  return {
    id: u.id,
    ...u.data(),
  }
  }))

  return {
    props: {
      querySnapshot
    },
    revalidate: 60 * 60 // Atualiza a página a cada 1h
  }
}
