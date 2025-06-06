import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { AccountService } from "./accountService";

export interface IReference {
    id:string,
    title: string,
    tipoReferencia: string,
    autor: string,
    ano: string,
    instituicao: string,
    organizador: string,
    titleCapitulo: string,
    titlePeriodic: string,
    volume: string,
    numero: string,
    paginas: string,
    editora: string,
    edicao: string,
    doi: string,
    mes: string,
    local: string,
    tituloSite: string,
    url: string,
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
                title: data.title,
                tipoReferencia: data.tipoReferencia,
                autor: data.autor,
                instituicao: data.instituicao,
                titlePeriodic: data.titlePeriodic,
                ano: data.ano,
                paginas: data.paginas,
                volume: data.volume,
                numero: data.numero,
                mes: data.mes,
                doi: data.doi,
                edicao: data.edicao,
                editora: data.editora,
                local: data.local,
                tituloSite: data.tituloSite,
                url: data.url,
                titleCapitulo: data.titleCapitulo,
                organizador: data.organizador
            });

            const id = referenceRef.id;

            await updateDoc(referenceRef, {
                id: id
            });

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: id, 
                    name: data.title, 
                    action: 'Cadastro de nova referência', 
                    entity: 'Referencias', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
        } catch (error) {
            throw error;
        }
    },

    async update(data:IReference) {
        try {
            await updateDoc(doc(db, 'reference', data.id), {
                title: data.title,
                tipoReferencia: data.tipoReferencia,
                autor: data.autor,
                instituicao: data.instituicao,
                titlePeriodic: data.titlePeriodic,
                ano: data.ano,
                paginas: data.paginas,
                volume: data.volume,
                numero: data.numero,
                mes: data.mes,
                doi: data.doi,
                edicao: data.edicao,
                editora: data.editora,
                local: data.local,
                tituloSite: data.tituloSite,
                url: data.url,
                titleCapitulo: data.titleCapitulo,
                organizador: data.organizador,
            });

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: data.id, 
                    name: data.title, 
                    action: 'Atualizando referência', 
                    entity: 'Referencias', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }

        } catch (error) {
            throw error;
        }

    },

    async delete(id:string, title: string) {
        try {
            await deleteDoc(doc(db, 'reference', id));

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: id, 
                    name: title, 
                    action: 'Excluido referência', 
                    entity: 'Referencias', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
          } catch (error) {
            throw error
          }
    },
}