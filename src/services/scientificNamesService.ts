import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export interface IScientificNames {
    id: string,
    name: string,
}

export const ScientificNamesService = {
    async getScientificNames() {
        try {
            const querySnapshot = await getDocs(collection(db, 'scientificNames'));
            const lista: IScientificNames[] = querySnapshot.docs.map(doc => ({
                ...doc.data()
            })) as IScientificNames[];
            return {status: "OK", result: lista};
        } catch (error) {
            return {status: "Erro ao buscar glossario" + error, result: []};
        }
    },

    async addNew(data:IScientificNames) {
        try {
            const scientifcNameRef = await addDoc(collection(db, "scientificNames"), {
                name: data.name.trim(),
            });

            const id = scientifcNameRef.id;

            await updateDoc(scientifcNameRef, {
                id: id
            });
        } catch (error) {
            throw error;
        }
    },

    async update(data:IScientificNames) {
        try {
            await updateDoc(doc(db, 'scientificNames', data.id), {
                name: data.name.trim(),
            });
        } catch (error) {
            throw error;
        }

    },

    async delete(id:string) {
        try {
            await deleteDoc(doc(db, 'scientificNames', id));
          } catch (error) {
            throw error
          }
    },
}