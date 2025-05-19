import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebaseConfig";
import { ScientificNamesService } from "./scientificNamesService";
import { AccountService } from "./accountService";


export interface Iscore {
    level: number | string,
    img: string | File,
    imgPath: string,
    description: Array<string>
}

export interface eimeriaProps{
    id: string,
    name: string,
    imgLocal: string | File,
    imgPath: string,
    category: string,
    general_description: string,
    place_of_action: string,
    clinical_signs: Array<string>,
    score: Array<Iscore>
}

export const EimeriaService = {
    async getEimerias(): Promise<{status: string, result: Array<eimeriaProps>}> {
        try {
            const querySnapshot = await getDocs(collection(db, 'eimerias'));
            const lista: eimeriaProps[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as eimeriaProps[];
            return {status: "OK", result: lista};
        } catch (error) {
            return {status: "Erro ao buscar eimérias" + error, result: []};
        }
    },
    
    async salvarEimeria(data: eimeriaProps, category: string) {
        try {
            // 1. Cria o documento com ID automático
            const eimeriaRef = await addDoc(collection(db, "eimerias"), {
                name: data.name,
                imgLocal: "", // temporário
                imgPath: "",
                category: category,
                general_description: data.general_description,
                place_of_action: data.place_of_action,
                clinical_signs: data.clinical_signs,
                score: [], // temporário
            });
            
            const id = eimeriaRef.id;
            
            // 2. Faz upload da imagem principal
            let imgLocalUrl = "";
            let imgLocalPath = "";
            
            if (data.imgLocal instanceof File) {
                const path = `eimerias/${id}/principal_${data.imgLocal.name}`;
                const imageRef = ref(storage, path);
                await uploadBytes(imageRef, data.imgLocal);
                imgLocalUrl = await getDownloadURL(imageRef);
                imgLocalPath = path;
            }
            
            // 3. Faz upload das imagens dos scores
            const updatedScores = await Promise.all(
                data.score.map(async (item, index) => {
                    if (item.img instanceof File) {
                        const path = `eimerias/${id}/score_${index}_${item.img.name}`;
                        const imageRef = ref(storage, path);
                        await uploadBytes(imageRef, item.img);
                        const url = await getDownloadURL(imageRef);
                        return {
                            level: item.level,
                            img: url,
                            imgPath: path,
                            description: item.description    
                        };
                    } else {
                        return {
                            level: item.level,
                            img: "",
                            imgPath: "",
                            description: item.description
                        }
                    }
                })
            );
            
            // 4. Atualiza o documento com as URLs e o próprio ID
            await updateDoc(eimeriaRef, {
                id,
                imgLocal: imgLocalUrl,
                imgPath: imgLocalPath,
                score: updatedScores,
            });

            await ScientificNamesService.addNew({id: '', name: data.name});

            const uid = auth.currentUser?.uid;

            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: id, 
                    name: data.name, 
                    action: 'Cadastro de nova espécie', 
                    entity: 'Eimeria', 
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
            await deleteDoc(doc(db, 'eimerias', id));

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: id, 
                    name: name, 
                    action: 'Excluido espécie', 
                    entity: 'Eimeria', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
          } catch (error) {
            throw error
          }
    },

    async update(data:eimeriaProps, category:string) {
        try {
            const docRef = doc(db, 'eimerias', data.id);
        
            let novaImgPrincipal = data.imgLocal;
            let novoImgPath = data.imgPath;
        
            // Atualiza imagem principal se for File
            if (data.imgLocal instanceof File) {
                // Deleta imagem antiga
                if (data.imgPath) {
                    const antigaRef = ref(storage, data.imgPath);
                    await deleteObject(antigaRef).catch(() => {});
                }
        
                const novoPath = `eimerias/${data.id}/principal_${data.imgLocal.name}`;
                const imageRef = ref(storage, novoPath);
                await uploadBytes(imageRef, data.imgLocal);
                const novaUrl = await getDownloadURL(imageRef);
        
                novaImgPrincipal = novaUrl;
                novoImgPath = novoPath;
            }
        
            // Atualiza as imagens dos níveis (score)
            const novosScores: Iscore[] = await Promise.all(
              data.score.map(async (item, index) => {
                if (item.img instanceof File) {
                  if (item.imgPath !== "") {
                    const antigaRef = ref(storage, item.imgPath);
                    await deleteObject(antigaRef).catch(() => {});
                  }
        
                  const novoPath = `eimerias/${data.id}/score_${index}_${item.img.name}`;
                  const imageRef = ref(storage, novoPath);
                  await uploadBytes(imageRef, item.img);
                  const novaUrl = await getDownloadURL(imageRef);
        
                  return {
                    level: item.level,
                    img: novaUrl,
                    imgPath: novoPath,
                    description: item.description
                  };
                }
        
                // Imagem não alterada
                return {
                    level: item.level,
                    img: item.img,
                    imgPath: item.imgPath,
                    description: item.description
                };
              })
            );
        
            // Monta dados atualizados
            const dadosAtualizados = {
              name: data.name,
              category: category,
              general_description: data.general_description,
              place_of_action: data.place_of_action,
              clinical_signs: data.clinical_signs,
              imgLocal: novaImgPrincipal,
              imgPath: novoImgPath,
              score: novosScores,
            };
        
            await updateDoc(docRef, dadosAtualizados);

            const uid = auth.currentUser?.uid;
            
            if (uid) {
                const newHistoric = {
                    uid: uid,
                    id: data.id, 
                    name: data.name, 
                    action: 'Atualizando espécie', 
                    entity: 'Eimeria', 
                    timestamp: Timestamp.now()
                }

                await AccountService.updateActivity(newHistoric)
            }
        
            console.log('Eimeria atualizada com sucesso!');
          } catch (error) {
            console.error('Erro ao atualizar eimeria:', error);
            throw error;
        }
    }
}