import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

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
        } catch (error) {
            throw error;
        }

    },

    async delete(id:string) {
        try {
            await deleteDoc(doc(db, 'glossary', id));
          } catch (error) {
            throw error
          }
    },
}