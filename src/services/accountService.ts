import { createUserWithEmailAndPassword, EmailAuthProvider, getAuth, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword  } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from '../../firebaseConfig';



export interface IAccount {
    uid: string,
    name: string,
    email: string,
    level: string,
    active: boolean,
    historic: [{
        id: string,
        name: string, 
        action: string, 
        entity: string, 
        timestamp: Timestamp
    }] | []
}

export const AccountService = {
    async new(email: string, senha: string, nome: string, nivel: string, passwordAccountLog:string) {
        try {
            const adminEmail = auth.currentUser?.email;
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;
        
            if (adminEmail) {
                await signInWithEmailAndPassword(auth, adminEmail, passwordAccountLog);
            }

            // Cria documento com ID igual ao UID do usuário
            await setDoc(doc(db, "accounts", user.uid), {
                uid: user.uid,
                name: nome,
                level: nivel,
                email: email,
                active: true,
                historic: []
            });

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: user.uid, 
                    name: email, 
                    action: 'Cadastrando nova conta', 
                    entity: 'Contas', 
                    timestamp: Timestamp.now()
                }

                await this.updateActivity(newHistoric)
            }
        } catch (error) {
            throw error
        }
    },

    async getAccounts() {
        try {
            const querySnapshot = await getDocs(collection(db, 'accounts'));
            const lista: IAccount[] = querySnapshot.docs.map(doc => ({
                ...doc.data()
            })) as IAccount[];
            return {status: "OK", result: lista};
        } catch (error) {
            return {status: "Erro ao buscar contas" + error, result: []};
        }
    },

    async getAccountLevel(uid:string) {
        try {
            const docRef = doc(db, 'accounts', uid); // Supondo que o doc tem o UID como ID
            const docSnap = await getDoc(docRef);
  
            if (docSnap.exists()) {
                return docSnap.data().level;
            } else {
                console.log('Usuário não encontrado na coleção accounts.');
            }
        } catch (error) {
            return error;
        }
    },
    
    async getAccount(uid:string):Promise<IAccount> {
        try {
            const docRef = doc(db, 'accounts', uid); // Supondo que o doc tem o UID como ID
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return {
                    uid: docSnap.data().uid, 
                    name: docSnap.data().name,
                    email: docSnap.data().email,
                    level: docSnap.data().level,
                    active: docSnap.data().active,
                    historic: docSnap.data().historic
                };
            } else {
                throw "Usuário não encontrado na coleção accounts.";
            }
        } catch (error) {
            throw error;
        }
    },

    async redefinientPassword(email:string) {
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            throw error
        }
    },

    async updateAccount(account:IAccount, name?:string) {
        const docRef = doc(db, 'accounts', account.uid);

        try {
            if (name){
                await updateDoc(docRef, {
                    name: name,
                    level: account.level,
                    active: account.active
                });
            } else {
                await updateDoc(docRef, {
                    name: account.name,
                    level: account.level,
                    active: account.active
                });
            }

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: account.uid, 
                    name: account.email, 
                    action: 'Atualizando conta', 
                    entity: 'Contas', 
                    timestamp: Timestamp.now()
                }

                await this.updateActivity(newHistoric)
            }
          } catch (error) {
            throw error
          }
    },
    
    async updateActivity(data:{ uid: string, id: string, name: string, action: string, entity: string, timestamp: Timestamp }) {
        const docRef = doc(db, 'accounts', data.uid);

        try {

            const account = await this.getAccount(data.uid);
            
            const newHistoric = [{
                id: data.id,
                name: data.name,
                action: data.action,
                entity: data.entity,
                timestamp: data.timestamp
            }, ...(account.historic || [])];

            await updateDoc(docRef, {
                historic: newHistoric
            });
          } catch (error) {
            throw error
          }
    },

    async updatePasswordAccount(senhaAtual: string, novaSenha: string) {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.email) {
            throw new Error("Usuário não autenticado.");
        }

        try {
            // Reautenticar o usuário
            const credential = EmailAuthProvider.credential(user.email, senhaAtual);
            await reauthenticateWithCredential(user, credential);

            // Atualizar senha
            await updatePassword(user, novaSenha);
            return "Senha alterada com sucesso!";
        } catch (error: any) {
            switch (error.code) {
            case "auth/wrong-password":
                throw "Senha atual incorreta.";
            case "auth/weak-password":
                throw "A nova senha é muito fraca.";
            case "auth/requires-recent-login":
                throw "Faça login novamente para alterar a senha.";
            default:
                throw "Erro ao alterar senha: " + error.message;
            }
        }
        }
}