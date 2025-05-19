import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { AccountService } from "./accountService";

export interface Iglossary {
    id: string,
    word: string,
    meaning: string
}

export const GlossaryService = {
    async getGlossary() {
        try {
            const querySnapshot = await getDocs(collection(db, 'glossary'));
            const lista: Iglossary[] = querySnapshot.docs.map(doc => ({
                ...doc.data()
            })) as Iglossary[];
            return {status: "OK", result: lista};
        } catch (error) {
            return {status: "Erro ao buscar glossario" + error, result: []};
        }
    },

    async addNew(data:Iglossary) {
        try {
            const glossaryRef = await addDoc(collection(db, "glossary"), {
                word: data.word.trim(),
                meaning: data.meaning.trim()
            });

            const id = glossaryRef.id;

            await updateDoc(glossaryRef, {
                id: id
            });

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: id, 
                    name: data.word, 
                    action: 'Cadastro de nova palavra', 
                    entity: 'Glossário', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }

        } catch (error) {
            throw error;
        }
    },

    async update(data:Iglossary) {
        try {
            await updateDoc(doc(db, 'glossary', data.id), {
                word: data.word.trim(),
                meaning: data.meaning.trim()
            });

            const uid = auth.currentUser?.uid;

            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: data.id, 
                    name: data.word, 
                    action: 'Atualizando palavra', 
                    entity: 'Glossário', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
        } catch (error) {
            throw error;
        }

    },

    async delete(id:string, word: string) {
        try {
            await deleteDoc(doc(db, 'glossary', id));

            const uid = auth.currentUser?.uid;

            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: id, 
                    name: word, 
                    action: 'Excluido palavra', 
                    entity: 'Glossário', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
          } catch (error) {
            throw error
          }
    },
}