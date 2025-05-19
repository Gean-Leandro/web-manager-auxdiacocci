import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { AccountService } from "./accountService";

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

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: id, 
                    name: data.name, 
                    action: 'Cadastro de novo nome científico', 
                    entity: 'Nomes Cientificos', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
        } catch (error) {
            throw error;
        }
    },

    async update(data:IScientificNames) {
        try {
            await updateDoc(doc(db, 'scientificNames', data.id), {
                name: data.name.trim(),
            });

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: data.id, 
                    name: data.name, 
                    action: 'Atualizando nome científico', 
                    entity: 'Nomes Cientificos', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
        } catch (error) {
            throw error;
        }

    },

    async delete(id:string, name: string) {
        try {
            await deleteDoc(doc(db, 'scientificNames', id));
            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: id, 
                    name: name, 
                    action: 'Excluindo nome científico', 
                    entity: 'Nomes Cientificos', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
          } catch (error) {
            throw error
          }
    },
}