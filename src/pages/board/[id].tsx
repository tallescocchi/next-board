import { dataBase } from "@/services/firebaseConnection"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { doc, getDoc } from "firebase/firestore"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

import styles from './task.module.scss'
import Head from "next/head"
import { FiCalendar } from "react-icons/fi"
import { FaUser } from "react-icons/fa"

type Task = {
  id: string
  created_at: string | Date | any
  createdFormated?: string
  task: string
  userId: string
  name: string
}

interface TaskListProps {
  data: string
}

export default function Task({ data }: TaskListProps) {
  const task = JSON.parse(data) as Task
  return (
    <>
      <Head>
        <title>Next Board | Detalhes da tarefa</title>
      </Head>

      <article className={styles.TaskContainer}>
        <div className={styles.TaskAction}>
          <div>
            <FaUser size={20} color="#FFB800" />
            <span>{task.name}</span>
          </div>
          <time>
            <FiCalendar size={20} color="#FFB800" />
            {task.createdFormated}
          </time>
        </div>
        <p>{task.task}</p>
      </article>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { id } = params as Task
  const session = await getSession({ req })

  if(!session?.vip) {
    return {
      redirect: {
        destination: '/board',
        permanent: false
      }
    }
  }

  const docRef = doc(dataBase, 'tasks', id)
  const docSnap = await getDoc(docRef)

  if(!docSnap.exists()) { // verifica se a task não existe
    return {
      redirect: {
        destination: '/board',
        permanent: false
      }
    }
  }

  const docData = docSnap.data() as Task

  const data = {
  id: docSnap.id,
  created_at: docData.created_at,
  createdFormated: format(docData.created_at.toDate(), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR }),
  task: docData.task,
  userId: docData.userId,
  name: docData.name
  }

  return {
    props: {
      data: JSON.stringify(data)
    }
  }
}