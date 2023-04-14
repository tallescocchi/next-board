import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { dataBase } from '@/services/firebaseConnection'
import { collectionGroup, getDocs, query} from "firebase/firestore"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async session({session, token}) {
      try {
        const q = query(collectionGroup(dataBase, 'donations'))
        const querySnapshot = await getDocs(q)
        const hasDonated = !querySnapshot.empty
        const hasLastDonate = hasDonated ? querySnapshot.docs[0].data().lastDonate : null;
          
          return {
            ...session,
            userId: token.sub,
            vip: hasDonated,
            lastDonate: hasLastDonate
          }
        } catch (error) {
          return {
            ...session,
            userId: null,
            vip: false,
          }
      }
    },
    async signIn({ user, account }){
      const { email } = user

      try {
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    }
  }
}

export default NextAuth(authOptions)