import { FormEvent, useState } from 'react'

import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { format, formatDistance } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { dataBase } from '../../services/firebaseConnection'
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'

import { FaPlus } from 'react-icons/fa'
import { FiTrash } from 'react-icons/fi'
import { AiOutlineCalendar } from 'react-icons/ai'
import { AiOutlineEdit, AiFillCloseSquare } from 'react-icons/ai'
import { TfiTimer } from 'react-icons/tfi'

import styles from './board.module.scss'

import { SupportButton } from '@/components/SupportButton'

type TaskList = {
  id: string
  created_at: string | Date
  createdFormated?: string
  task: string
  userId: string
  name: string
}

interface BoardProps {
  user: {
    id: string
    name: string
    vip: string | boolean
    lastDonate: string | Date
  }
  querySnapshot: string
}

export default function Board({ user, querySnapshot }: BoardProps) {
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState<TaskList[]>(JSON.parse(querySnapshot));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)

  async function handleAddTask(e: FormEvent) {
    e.preventDefault()

    if(input === '') {
      alert('Preencha alguma tarefa')
      return
    }

    if(taskEdit) {
      const taskId = taskEdit.id;
      const updates = {
        task: input,
        created_at: new Date(),
      };
      const taskRef = doc(dataBase, 'tasks', taskId);

      await updateDoc(taskRef, updates)
        .then(() => {
          const data = tasks
          const taskIndex = tasks.findIndex(item => item.id === taskEdit.id)
          data[taskIndex].task = input

          setTasks(data)
          setTaskEdit(null)
          setInput('')
        })

      return
    }

    await addDoc(collection(dataBase, 'tasks'), {
      created_at: new Date(),
      task: input,
      userId: user.id,
      name: user.name,
    })
    .then((doc) => {
      const data = {
        id: doc.id,
        created_at: new Date(),
        createdFormated: format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR }),
        task: input,
        userId: user.id,
        name: user.name,
      }

      setTasks([...tasks, data])
      setInput('')
    })
  }

  async function handleDeleteTask(id: string) {
    await deleteDoc(doc(dataBase, 'tasks', id))

    const taskListDelete = tasks.filter((task) => task.id !== id)
    setTasks(taskListDelete)
  }

  function handleEditTask(task: TaskList) {
    setTaskEdit(task)
    setInput(task.task)
  }

  function handleCancelEdit() {
    setInput('')
    setTaskEdit(null)
  }

  //@ts-ignore
  const lastDonateDate = user.lastDonate ? new Date(user.lastDonate.seconds * 1000 + user.lastDonate.nanoseconds / 1000000) : null;

  return (
    <>
      <Head>
        <title>Next Board | Board</title>
      </Head>
      <main className={styles.BoardContainer}>
        <form onSubmit={handleAddTask}>
          <input 
            type="text" 
            placeholder="Qual sua tarefa?" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit"><FaPlus size={16} /></button>
        </form>

        {taskEdit && (
          <span>
            Você está editando uma tarefa
            <button onClick={handleCancelEdit}>
             <AiFillCloseSquare size={24} color="#FF3636" />
            </button>
          </span>
        )}

        <section className={styles.BoardTasks}>
          <h4> ({tasks.length}) {tasks.length === 1 ? 'Tarefa' : 'Tarefas'}</h4>
          {tasks.map((task) => (
          <article key={task.id} className={styles.TaskList}>
              <Link href={`/board/${task.id}`}>
              <p>{task.task}</p>
            </Link>
            <div className={styles.ActionsDateDelete}>
              <div className={styles.Calendar}>
                <AiOutlineCalendar size={20} />
                <p>{task.createdFormated}</p>
              </div>
              <div className={styles.EditAndDeleteButton}>
                {user.vip ? (
                  <button 
                    className={styles.Edit}
                    onClick={() => handleEditTask(task)}
                    >
                    <AiOutlineEdit size={20}/>
                  </button>
                ): null}
                <button 
                  className={styles.Delete}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FiTrash size={20}/>
                </button>
              </div>
            </div>
          </article>
        ))}
        </section>
      </main>
      {user.vip ? (
        <section className={styles.CongratulationSession}>
        <h3>Obrigado por apoiar esse projeto.</h3>
        <time>
          <TfiTimer size={20} />
          {lastDonateDate ? (
            <p>Última doação foi há {formatDistance(lastDonateDate, new Date(), { locale: ptBR })} atrás</p>
            ) : (
            <p>Nenhuma doação registrada ainda</p>
          )}
        </time>
      </section>
      ) : null}
      <SupportButton />
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

const q = query(collection(dataBase, 'tasks'),
    where('userId', '==', session?.userId))

const tasksList = await getDocs(q)

const querySnapshot = JSON.stringify(tasksList.docs.map(u => {
  return {
    id: u.id, 
    createdFormated: format(u.data().created_at.toDate(), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR }),
    ...u.data(),
  }
  }))

  const user = {
    id: session?.userId,
    name: session.user?.name,
    vip: session?.vip,
    lastDonate: session?.lastDonate
  }

  return {
    props: {
      user,
      querySnapshot
    }
  }
}