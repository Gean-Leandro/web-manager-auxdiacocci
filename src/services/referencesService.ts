import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export interface IReference {
    id:string,
    title: string,
    reference: string
}

export const ReferencesService = {
    async getReferences() {
        try {
            const querySnapshot = await getDocs(collection(db, 'reference'));
            const lista: IReference[] = querySnapshot.docs.map(doc => ({
                ...doc.data()
            })) as IReference[];
            return {status: "OK", result: lista};
        } catch (error) {
            return {status: "Erro ao buscar as referências" + error, result: []};
        }
    },

    async addNew(data:IReference) {
        try {
            const referenceRef = await addDoc(collection(db, "reference"), {
                title: data.title.trim(),
                reference: data.reference.trim()
            });

            const id = referenceRef.id;

            await updateDoc(referenceRef, {
                id: id
            });
        } catch (error) {
            throw error;
        }
    },

    async update(data:IReference) {
        try {
            await updateDoc(doc(db, 'reference', data.id), {
                title: data.title.trim(),
                reference: data.reference.trim()
            });
        } catch (error) {
            throw error;
        }

    },

    async delete(id:string) {
        try {
            await deleteDoc(doc(db, 'reference', id));
          } catch (error) {
            throw error
          }
    },
}