import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { AccountService } from "./accountService";

export interface IReference {
    id:string,
    title: string,
    tipoReferencia: string,
    ano: string,
    autor?: string,
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
            let referenceRef = null
            let id = ''

            if (data.tipoReferencia === 'artigo' && data.autor && data.local && data.mes && data.volume && data.numero) {

                if (data.doi){
                    referenceRef = await addDoc(collection(db, "reference"), {
                        title: data.title.trim(),
                        tipoReferencia: data.tipoReferencia.trim(),
                        autor: data.autor.trim(),
                        ano: data.ano.trim(),
                        local: data.local.trim(),
                        mes: data.mes.trim(),
                        volume: data.volume.trim(),
                        numero: data.numero.trim(),
                        doi: data.doi.trim(),
                    });

                } else {
                    referenceRef = await addDoc(collection(db, "reference"), {
                        title: data.title.trim(),
                        tipoReferencia: data.tipoReferencia.trim(),
                        autor: data.autor.trim(),
                        ano: data.ano.trim(),
                        local: data.local.trim(),
                        mes: data.mes.trim(),
                        volume: data.volume.trim(),
                        numero: data.numero.trim(),
                    });
                }

                id = referenceRef.id;

                await updateDoc(referenceRef, {
                    id: id
                });
            } else if (data.tipoReferencia === 'pdf' && data.autor && data.url && data.local && data.mes && data.volume && data.numero) {
                
                if (data.doi){
                    
                    referenceRef = await addDoc(collection(db, "reference"), {
                        title: data.title.trim(),
                        tipoReferencia: data.tipoReferencia.trim(),
                        autor: data.autor.trim(),
                        ano: data.ano.trim(),
                        local: data.local.trim(),
                        mes: data.mes.trim(),
                        volume: data.volume.trim(),
                        numero: data.numero.trim(),
                        doi: data.doi.trim(),
                        url: data.url.trim(),
                    });

                } else {
                    referenceRef = await addDoc(collection(db, "reference"), {
                        title: data.title.trim(),
                        tipoReferencia: data.tipoReferencia.trim(),
                        autor: data.autor.trim(),
                        ano: data.ano.trim(),
                        local: data.local.trim(),
                        mes: data.mes.trim(),
                        volume: data.volume.trim(),
                        numero: data.numero.trim(),
                        url: data.url.trim(),
                    });
                }

                id = referenceRef.id;

                await updateDoc(referenceRef, {
                    id: id
                });
            } else if (data.tipoReferencia === 'livro' && data.autor && data.edicao && data.local && data.mes && data.editora && data.paginas) {
                referenceRef = await addDoc(collection(db, "reference"), {
                    title: data.title.trim(),
                    tipoReferencia: data.tipoReferencia.trim(),
                    autor: data.autor.trim(),
                    ano: data.ano.trim(),
                    local: data.local.trim(),
                    mes: data.mes.trim(),
                    edicao: data.edicao.trim(),
                    editora: data.editora.trim(),
                    paginas: data.paginas.trim(),
                });

                id = referenceRef.id;

                await updateDoc(referenceRef, {
                    id: id
                });
            } else if (data.tipoReferencia === 'site' && data.autor && data.local && data.mes && data.url && data.tituloSite) {
                referenceRef = await addDoc(collection(db, "reference"), {
                    title: data.title.trim(),
                    tipoReferencia: data.tipoReferencia.trim(),
                    autor: data.autor.trim(),
                    ano: data.ano.trim(),
                    url: data.url.trim(),
                    mes: data.mes.trim(),
                    tituloSite: data.tituloSite.trim(),
                });
                id = referenceRef.id;

                await updateDoc(referenceRef, {
                    id: id
                });
            } else {
                throw "Campos inválidos"
            }


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
            if (data.tipoReferencia === 'artigo' && data.autor && data.local && data.mes && data.volume && data.numero) {
                if (data.doi) {
                    await updateDoc(doc(db, 'reference', data.id), {
                        title: data.title.trim(),
                        tipoReferencia: data.tipoReferencia.trim(),
                        autor: data.autor.trim(),
                        ano: data.ano.trim(),
                        local: data.local.trim(),
                        mes: data.mes.trim(),
                        volume: data.volume.trim(),
                        numero: data.numero.trim(),
                        doi: data.doi.trim(),
                    });
                } else {
                    await updateDoc(doc(db, 'reference', data.id), {
                        title: data.title.trim(),
                        tipoReferencia: data.tipoReferencia.trim(),
                        autor: data.autor.trim(),
                        ano: data.ano.trim(),
                        local: data.local.trim(),
                        mes: data.mes.trim(),
                        volume: data.volume.trim(),
                        numero: data.numero.trim()
                    });
                }
                

            } else if (data.tipoReferencia === 'pdf' && data.autor && data.url && data.local && data.mes && data.volume && data.numero) {
                if (data.doi) {
                    await updateDoc(doc(db, 'reference', data.id), {
                        title: data.title.trim(),
                        tipoReferencia: data.tipoReferencia.trim(),
                        autor: data.autor.trim(),
                        ano: data.ano.trim(),
                        local: data.local.trim(),
                        mes: data.mes.trim(),
                        volume: data.volume.trim(),
                        numero: data.numero.trim(),
                        doi: data.doi.trim(),
                        url: data.url.trim(),
                    });
                }  else {
                    await updateDoc(doc(db, 'reference', data.id), {
                        title: data.title.trim(),
                        tipoReferencia: data.tipoReferencia.trim(),
                        autor: data.autor.trim(),
                        ano: data.ano.trim(),
                        local: data.local.trim(),
                        mes: data.mes.trim(),
                        volume: data.volume.trim(),
                        numero: data.numero.trim(),
                        url: data.url.trim(),
                    });
                }

            } else if (data.tipoReferencia === 'livro' && data.autor && data.edicao && data.local && data.mes && data.editora && data.paginas) {
                await updateDoc(doc(db, 'reference', data.id), {
                    title: data.title.trim(),
                    tipoReferencia: data.tipoReferencia.trim(),
                    autor: data.autor.trim(),
                    ano: data.ano.trim(),
                    local: data.local.trim(),
                    mes: data.mes.trim(),
                    edicao: data.edicao.trim(),
                    editora: data.editora.trim(),
                    paginas: data.paginas.trim(),
                });

            } else if (data.tipoReferencia === 'site' && data.autor && data.local && data.mes && data.url && data.tituloSite) {
                await updateDoc(doc(db, 'reference', data.id), {
                    title: data.title.trim(),
                    tipoReferencia: data.tipoReferencia.trim(),
                    autor: data.autor.trim(),
                    ano: data.ano.trim(),
                    url: data.url.trim(),
                    mes: data.mes.trim(),
                    tituloSite: data.tituloSite.trim(),
                });
            } else {
                throw "Campos inválidos"
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