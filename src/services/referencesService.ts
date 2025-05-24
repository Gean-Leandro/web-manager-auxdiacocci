import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { AccountService } from "./accountService";

export interface IReference {
    id:string,
    title: string,
    tipoReferencia: string,
    autor?: string,
    ano?: string,
    instituicao?: string,
    organizador?: string,
    titleCapitulo?: string,
    titlePeriodic?: string,
    volume?: string,
    numero?: string,
    paginas?: string,
    editora?: string,
    edicao?: string,
    doi?: string,
    mes?: string,
    local?: string,
    tituloSite?: string,
    url?: string,
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
                tipoReferencia: data.tipoReferencia.trim()
            });

            if (data.autor){
                await updateDoc(referenceRef, {
                    autor: data.autor
                });
            } 
            if (data.instituicao){
                await updateDoc(referenceRef, {
                    instituicao: data.instituicao
                });
            } 
            if (data.titlePeriodic){
                await updateDoc(referenceRef, {
                    titlePeriodic: data.titlePeriodic
                });
            } 
            if (data.ano){
                await updateDoc(referenceRef, {
                    ano: data.ano
                });
            } 
            if (data.paginas){
                await updateDoc(referenceRef, {
                    paginas: data.paginas
                });
            } 
            if (data.volume){
                await updateDoc(referenceRef, {
                    volume: data.volume
                });
            } 
            if (data.numero){
                await updateDoc(referenceRef, {
                    numero: data.numero
                });
            } 
            if (data.mes){
                await updateDoc(referenceRef, {
                    mes: data.mes
                });
            } 
            if (data.doi){
                await updateDoc(referenceRef, {
                    doi: data.doi
                });
            } 
            if (data.edicao){
                await updateDoc(referenceRef, {
                    edicao: data.edicao
                });
            } 
            if (data.editora){
                await updateDoc(referenceRef, {
                    editora: data.editora
                });
            } 
            if (data.local){
                await updateDoc(referenceRef, {
                    local: data.local
                });
            } 
            if (data.tituloSite){
                await updateDoc(referenceRef, {
                    tituloSite: data.tituloSite
                });
            } 
            if (data.url){
                await updateDoc(referenceRef, {
                    url: data.url
                });
            } 
            if (data.titleCapitulo){
                await updateDoc(referenceRef, {
                    titleCapitulo: data.titleCapitulo
                });
            } 
            if (data.organizador){
                await updateDoc(referenceRef, {
                    organizador: data.organizador
                });
            } 

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
                title: data.title.trim(),
                tipoReferencia: data.tipoReferencia.trim()
            });
        
            if (data.autor){
                await updateDoc(doc(db, 'reference', data.id), {
                    autor: data.autor
                });
            } 
            if (data.instituicao){
                await updateDoc(doc(db, 'reference', data.id), {
                    instituicao: data.instituicao
                });
            } 
            if (data.titlePeriodic){
                await updateDoc(doc(db, 'reference', data.id), {
                    titlePeriodic: data.titlePeriodic
                });
            } 
            if (data.ano){
                await updateDoc(doc(db, 'reference', data.id), {
                    ano: data.ano
                });
            } 
            if (data.paginas){
                await updateDoc(doc(db, 'reference', data.id), {
                    paginas: data.paginas
                });
            } 
            if (data.volume){
                await updateDoc(doc(db, 'reference', data.id), {
                    volume: data.volume
                });
            } 
            if (data.numero){
                await updateDoc(doc(db, 'reference', data.id), {
                    numero: data.numero
                });
            } 
            if (data.mes){
                await updateDoc(doc(db, 'reference', data.id), {
                    mes: data.mes
                });
            } 
            if (data.doi){
                await updateDoc(doc(db, 'reference', data.id), {
                    doi: data.doi
                });
            } 
            if (data.edicao){
                await updateDoc(doc(db, 'reference', data.id), {
                    edicao: data.edicao
                });
            } 
            if (data.editora){
                await updateDoc(doc(db, 'reference', data.id), {
                    editora: data.editora
                });
            } 
            if (data.local){
                await updateDoc(doc(db, 'reference', data.id), {
                    local: data.local
                });
            } 
            if (data.tituloSite){
                await updateDoc(doc(db, 'reference', data.id), {
                    tituloSite: data.tituloSite
                });
            } 
            if (data.url){
                await updateDoc(doc(db, 'reference', data.id), {
                    url: data.url
                });
            } 
            if (data.titleCapitulo){
                await updateDoc(doc(db, 'reference', data.id), {
                    titleCapitulo: data.titleCapitulo
                });
            } 
            if (data.organizador){
                await updateDoc(doc(db, 'reference', data.id), {
                    organizador: data.organizador
                });
            } 

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