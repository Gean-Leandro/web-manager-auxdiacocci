import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { ReferencesService, IReference } from "../../services/referencesService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AccountService } from "../../services/accountService";
import { Check, Edit2, Eye, FileText, Plus, Trash2, X } from "lucide-react";

export function References() {
    const [references, setReferences] = useState<IReference[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [busca, setBusca] = useState<string>('');
    const [fieldBusca, setFieldBusca] = useState<boolean>(true);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [openView, setOpenView] = useState<boolean>(false);
    const [viewReferenceItem, setViewReferenceItem] = useState<IReference>({
        id:'',
        title: '',
        tipoReferencia: '',
        ano: ''
    });
    const [referenceItem, setReferenceItem] = useState<IReference>({
        id:'',
        title: '',
        tipoReferencia: '',
        ano: ''
    });
    const [idDelet, setIdDelet] = useState<IReference | null>(null);
    const [editReference, setEditReference] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [login, setLogin] = useState<string>("");

    
    const resetForm = () => {
        setReferenceItem({id: '', title: '', ano: '', tipoReferencia: ''})
    };
    

    useEffect(() => {
        document.title = "Referências";
        const fetchReferences = async () => {
            const query = await ReferencesService.getReferences();
            if (query.status === "OK") {
                setReferences(query.result);
            } else {
                setShowNotification({
                    active: true, 
                    mensage: query.status, 
                    bgColor: "bg-orange-500"
                })
            }
        }
        fetchReferences();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const query = await AccountService.getAccountLevel(uid);
                setLogin(query);
            } 
        })
        return () => {
            unsubscribe();
        };
    }, []);

    const handleBuscar = () => {
        filtradas
    };

    const filtradas = useMemo(() => {
        return references
          .filter(item => item.title.toLowerCase().includes(busca.toLowerCase()))
          .sort((a, b) => a.title.localeCompare(b.title));
    }, [references, busca]);

    const validateFields = () => {
        switch (referenceItem.tipoReferencia) {
            case "artigo":
                if (referenceItem.title !== '' && referenceItem.autor 
                    && referenceItem.ano !== '' && referenceItem.local 
                    && referenceItem.mes && referenceItem.volume 
                    && referenceItem.numero) {

                    if (referenceItem.autor !== '' && referenceItem.local !== '' 
                        && referenceItem.mes !== '' && referenceItem.volume !== '' 
                        && referenceItem.numero !== '') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            case "livro":
                if (referenceItem.title !== '' && referenceItem.autor
                    && referenceItem.ano !== '' && referenceItem.mes 
                    && referenceItem.edicao && referenceItem.editora 
                    && referenceItem.local && referenceItem.paginas) {

                    if (referenceItem.autor !== '' && referenceItem.local !== '' 
                        && referenceItem.mes !== '' && referenceItem.edicao !== '' 
                        && referenceItem.editora !== ''  && referenceItem.paginas !== '') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            case "pdf":
                if (referenceItem.title !== '' && referenceItem.autor  
                    && referenceItem.local  && referenceItem.mes  
                    && referenceItem.volume  && referenceItem.numero  
                    && referenceItem.ano !== '' 
                    && referenceItem.url) {

                    if (referenceItem.autor !== '' && referenceItem.local !== '' 
                        && referenceItem.mes !== '' && referenceItem.volume !== '' 
                        && referenceItem.numero !== '' && referenceItem.url) {
                        return true;
                    } else {
                        return false;
                    }
                    
                } else {
                    return false;
                }
            case "site":
                if (referenceItem.title !== '' && referenceItem.autor 
                    && referenceItem.mes && referenceItem.url 
                    && referenceItem.ano !== '' && referenceItem.tituloSite) {

                    if (referenceItem.autor !== '' && referenceItem.mes !== '' 
                        && referenceItem.tituloSite !== '' && referenceItem.url) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
        }
    }

    const updateReferenceList = async () => {
        const query = await ReferencesService.getReferences();

        if (query.status === "OK") {
            setReferences(query.result);
        } else {
            setShowNotification({
                active: true, 
                mensage: query.status, 
                bgColor: "bg-orange-500"
            })
        }
    }

    const addNewReference = async () => {
        if (validateFields()) {

            const titleExist = references.some(
                (item) => item.title.trim().toLowerCase() === referenceItem.title.trim().toLowerCase()
            )

            if (!titleExist) {
                try {
                    await ReferencesService.addNew(referenceItem);
                    resetForm();
    
                    updateReferenceList();
    
                    setShowNotification({
                        active: true, 
                        mensage: "Nova referência adicionada", 
                        bgColor: "bg-green-600"
                    })
                } catch (error) {
                    setShowNotification({
                        active: true, 
                        mensage: "Error: " + error, 
                        bgColor: "bg-orange-500"
                    })
                }
            } else {
                setShowNotification({
                    active: true, 
                    mensage: "Titulo já existe", 
                    bgColor: "bg-orange-500"
                })
            }
        } else {
            setShowNotification({
                active: true, 
                mensage: "Preencha todos os campos", 
                bgColor: "bg-orange-500"
            })
        }
        
    }

    const updateReference = async () => {
        setDisableButton(true);

        if (validateFields()) {
            try {

                await ReferencesService.update(referenceItem);
                setReferenceItem({id:'', title:'', ano:'', tipoReferencia: ''});
                setEditReference(false);
                
                updateReferenceList();
                setFieldBusca(true);
                
                setShowNotification({
                    active: true, 
                    mensage: "Referência atualizada", 
                    bgColor: "bg-green-600"
                })
            } catch (error) {

                setShowNotification({
                    active: true, 
                    mensage: "Error: " + error, 
                    bgColor: "bg-orange-500"
                })
            }
        } else {
            setShowNotification({
                active: true, 
                mensage: "Preencha todos os campos", 
                bgColor: "bg-orange-500"
            })
        }
        setDisableButton(false);
    }
    
    const deleteReference = async () => {
        try {
            if (idDelet) {
                await ReferencesService.delete(idDelet.id, idDelet.title);
            }
            updateReferenceList();
            setShowNotification({
                active: true, 
                mensage: "Referência excluida", 
                bgColor: "bg-green-600"
            })
            setConfirmModal(false);
        } catch (error) {
            setShowNotification({
                active: true, 
                mensage: "Error:" + error, 
                bgColor: "bg-orange-500"
            })
            setConfirmModal(false);
        }
    }


    return(
        <>
        {showNotification.active && (
            <Notification
            message={showNotification.mensage}
            bgColor={showNotification.bgColor}
            onClose={() => setShowNotification({active: false, mensage:"", bgColor:""})}
            />
        )}

        <div className="flex h-screen bg-gray-100">
            <Sidebar levelAccount={login} selected={5}/>
            <div className="flex-grow overflow-auto">
                {/* Header */}
                <div className="flex items-center p-6">
                    <div className="p-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <FileText className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Referências</h1>
                        </div>
                        <p className="text-gray-500">Gerencie as referências cadastradas.</p>
                    </div>
                </div>


                {openView && (
                <div className="p-6">
                    <div className="bg-white rounded-lg border shadow-lg overflow-hidden p-4">
                        <div className="flex border-b pb-2 justify-between h-[10%] mb-3">
                            <div className="font-bold h-[24px] justify-center text-[18px] pl-12 flex items-center w-[90%]">
                                <h2 className="text-lg font-semibold">VISUALIZAÇÃO</h2>
                            </div>
                            <button type="button" onClick={() => {
                                    setOpenView(false);
                                }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <div>
                        <form>
                                <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">TIPO DE REFERÊNCIA:</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={viewReferenceItem.tipoReferencia}
                                    required
                                    disabled={true}
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="artigo">Artigo Científico</option>
                                    <option value="livro">Livro</option>
                                    <option value="pdf">PDF</option>
                                    <option value="site">Site/Página Web</option>
                                </select>
                                </div>
                                
                                {viewReferenceItem.tipoReferencia === "artigo" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO ARTIGO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.title}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={viewReferenceItem.autor}
                                                disabled={true}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={viewReferenceItem.local}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                            value={viewReferenceItem.mes}
                                            disabled={true}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">VOLUME:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.volume}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">NÚMERO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.numero}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.ano}
                                                disabled={true}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">DOI:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.doi}
                                                disabled={true}/>
                                    </div>
                                    </div>
                                )}
                                
                                {viewReferenceItem.tipoReferencia === "livro" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.title}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={viewReferenceItem.autor}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">EDIÇÃO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: 2. ed." 
                                                value={viewReferenceItem.edicao}
                                                disabled={true}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={viewReferenceItem.local}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">EDITORA:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.editora}
                                                disabled={true}/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.ano}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={viewReferenceItem.mes}
                                                disabled={true}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">TOTAL DE PÁGINAS:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.paginas}
                                                disabled={true}/>
                                        </div>
                                    </div>
                                    </div>
                                )}
                                
                                {viewReferenceItem.tipoReferencia === "pdf" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO ARTIGO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.title}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={viewReferenceItem.autor}
                                                disabled={true}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={viewReferenceItem.local}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={viewReferenceItem.mes}
                                                disabled={true}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">VOLUME:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.volume}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">NÚMERO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.numero}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.ano}
                                                disabled={true}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">DOI:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.doi}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">URL DO DOCUMENTO:</label>
                                        <input type="url" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.url}
                                                disabled={true}/>
                                    </div>
                                    </div>
                                )}
                                
                                {viewReferenceItem.tipoReferencia === "site" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DA PÁGINA:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.title}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR/RESPONSÁVEL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                            value={viewReferenceItem.autor}
                                            disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO SITE:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.tituloSite}
                                                disabled={true}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO DE PUBLICAÇÃO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.ano}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS (SE HOUVER):</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={viewReferenceItem.mes}
                                                disabled={true}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">URL:</label>
                                        <input type="url" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.url}
                                                disabled={true}/>
                                    </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                )}

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg border shadow-lg overflow-hidden">

                        {/* Campo editar */}
                        <div className={`${fieldBusca && 'hidden'} p-4 border-b`}>
                            <div className="pb-4 mb-4 border-b bg-white">
                                <h2 className="text-lg font-semibold">{!editReference ? "Preencha o formulário": "Editando"}</h2>
                            </div>

                            <form>
                                <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">TIPO DE REFERÊNCIA:</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={referenceItem.tipoReferencia}
                                    onChange={(e) => setReferenceItem((prev) => ({ ...prev, tipoReferencia:e.target.value}))}
                                    required
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="artigo">Artigo Científico</option>
                                    <option value="livro">Livro</option>
                                    <option value="pdf">PDF</option>
                                    <option value="site">Site/Página Web</option>
                                </select>
                                </div>
                                
                                {referenceItem.tipoReferencia === "artigo" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO ARTIGO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.title}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, title:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={referenceItem.autor}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, autor:e.target.value}))}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={referenceItem.local}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, local:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                            value={referenceItem.mes}
                                            onChange={(e) => setReferenceItem((prev) => ({ ...prev, mes:e.target.value}))}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">VOLUME:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.volume}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, volume:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">NÚMERO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.numero}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, numero:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.ano}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, ano:e.target.value}))}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">DOI:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.doi}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, doi:e.target.value}))}/>
                                    </div>
                                    </div>
                                )}
                                
                                {referenceItem.tipoReferencia === "livro" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.title}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, title:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={referenceItem.autor}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, autor:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">EDIÇÃO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: 2. ed." 
                                                value={referenceItem.edicao}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, edicao:e.target.value}))}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={referenceItem.local}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, local:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">EDITORA:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.editora}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, editora:e.target.value}))}/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.ano}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, ano:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={referenceItem.mes}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, mes:e.target.value}))}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">TOTAL DE PÁGINAS:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.paginas}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, paginas:e.target.value}))}/>
                                        </div>
                                    </div>
                                    </div>
                                )}
                                
                                {referenceItem.tipoReferencia === "pdf" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO ARTIGO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.title}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, title:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={referenceItem.autor}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, autor:e.target.value}))}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={referenceItem.local}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, local:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={referenceItem.mes}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, mes:e.target.value}))}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">VOLUME:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.volume}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, volume:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">NÚMERO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.numero}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, numero:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.ano}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, ano:e.target.value}))}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">DOI:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.doi}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, doi:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">URL DO DOCUMENTO:</label>
                                        <input type="url" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.url}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, url:e.target.value}))}/>
                                    </div>
                                    </div>
                                )}
                                
                                {referenceItem.tipoReferencia === "site" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DA PÁGINA:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.title}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, title:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR/RESPONSÁVEL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                            value={referenceItem.autor}
                                            onChange={(e) => setReferenceItem((prev) => ({ ...prev, autor:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO SITE:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.tituloSite}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, tituloSite:e.target.value}))}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO DE PUBLICAÇÃO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.ano}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, ano:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS (SE HOUVER):</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={referenceItem.mes}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, mes:e.target.value}))}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">URL:</label>
                                        <input type="url" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.url}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, url:e.target.value}))}/>
                                    </div>
                                    </div>
                                )}
                                    
                                    <div className={`${!editReference && 'hidden'} flex justify-end gap-2 mt-8`}>
                                    
                                        {/* Cancelar Button */}
                                        <button
                                            onClick={() => {
                                                setEditReference(false);
                                                resetForm();
                                                setFieldBusca(true);
                                            }}
                                            type="button" 
                                            className={`w-[10%] py-2 text-red-500 hover:text-red-700 bg-red-200 flex items-center justify-center rounded-[8px]`}>
                                            <X size={25}/>
                                        </button>

                                        {/* Salvar Button */}
                                        <button
                                            disabled={disableButton}
                                            onClick={updateReference}
                                            type="button" 
                                            className={`w-[10%] py-2 text-green-500 hover:text-green-700 flex items-center bg-green-200 justify-center rounded-[8px]`}>
                                            <Check size={25}/>
                                        </button>
                                    </div>

                                    <div className={`${editReference && 'hidden'} flex justify-end mt-8`}>
                                    
                                        <button onClick={addNewReference}
                                            type="button" 
                                            className={`${referenceItem.tipoReferencia === "" && 'hidden'} w-[10%] flex items-center justify-center px-4 py-2 border-[2px] border-black bg-black rounded text-white hover:bg-mygray-600`}
                                        >
                                            <img width={25} height={25} src="\src\assets\AddWhite.png" alt="" />
                                        </button>
                                    </div>
                            </form>
                        </div>

                        <div className="p-4 border-b bg-white">
                            <h2 className="text-lg font-semibold">Lista de referências</h2>
                        </div>
                        
                        {/* Search and Add */}
                        <div className="p-4 bg-gray-100">
                            <div className="flex items-center">
                                <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Título"
                                    className="w-full pl-4 pr-24 py-2 border border-gray-500 rounded"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                                <button type="button" 
                                    onClick={handleBuscar} 
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-blue-800 bg-blue-600 text-white rounded-r">
                                    BUSCAR
                                </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Species List - Simple Version like second image */}
                        <div className="max-h-80 overflow-y-auto">
                        {filtradas.length !== 0 ? filtradas.map((reference) => (
                            <div 
                            key={reference.id} 
                            className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                            >
                            <div className="font-medium">{reference.title}</div>
                            
                            <div className="flex space-x-2">
                                <button type="button" onClick={() => {
                                        setReferenceItem((prev) => (reference));
                                        console.log(referenceItem);
                                        setFieldBusca(false);
                                        setEditReference(true);
                                    }} className={`${login !== "admin"? "hidden" : ""} ${editReference && referenceItem.id === reference.id ? "hidden": ""}  p-1 text-gray-600 hover:text-blue-600`}>
                                    <Edit2 size={18} />
                                </button>

                                <button type="button" 
                                    onClick={() => {
                                        setViewReferenceItem((prev) => (reference));
                                        setOpenView(true);
                                    }}
                                    className="p-1 text-gray-600 hover:text-blue-600">
                                    <Eye size={18} />
                                </button>
                                
                                <button type="button"
                                        onClick={() => {
                                            setConfirmModal(true);
                                            setIdDelet(reference);
                                        }} 
                                        className={`${login !== "admin"? "hidden" : ""} p-1 text-red-500 hover:text-red-700`}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            </div>
                        ))
                        :   <div className="h-[100%] w-[100%] py-10 flex justify-center items-center text-mygray-700">
                                Nenhuma referência cadastrada
                            </div>
                        }
                        </div>
                        
                        {/* Cadastrar Button */}
                        <div className="p-4 border-t flex justify-end gap-2 items-center">
                            <button type="button"
                                onClick={() => {
                                    setFieldBusca(true)
                                    setEditReference(false);
                                }}
                                className={`${fieldBusca && "hidden"} flex items-center px-4 py-2 border-slate-500 border-[2px] rounded bg-white hover:bg-gray-100`}>
                                CANCELAR
                            </button>
                            <button type="button"
                                onClick={() => {
                                        setFieldBusca(false);
                                        resetForm();    
                                    }} className={`${!fieldBusca && "hidden"} flex items-center px-4 py-2 border-[2px] border-black bg-black rounded text-white hover:bg-mygray-600`}>
                                <Plus size={18} className="mr-1" />
                                <span>CADASTRAR</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>        
        </div>

        {confirmModal && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-md w-[25%]">
                    <div className="flex justify-between h-[10%] mb-3">
                        <div className="font-bold h-[24px] justify-center text-[18px] pl-8 flex items-center w-[90%]">
                            CONFIRMAÇÃO
                        </div>
                        <button type="button" onClick={() => {
                                setConfirmModal(false);
                                setIdDelet(null);
                            }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="text-center mb-10">
                        <div className="flex mt-[50px] mb-4 items-center justify-center">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_514_1034)">
                                    <path d="M41.625 2H18.375L1.875 18.25V41.7501L18.375 58.0001H41.625L58.125 41.7501V18.25L41.625 2Z" stroke="#F97316" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M29.875 46.25C31.946 46.25 33.625 44.5712 33.625 42.5C33.625 40.429 31.946 38.75 29.875 38.75C27.8038 38.75 26.125 40.429 26.125 42.5C26.125 44.5712 27.8038 46.25 29.875 46.25Z" stroke="#F97316" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M34.875 17.5C34.875 20.25 29.875 31.25 29.875 31.25C29.875 31.25 24.8749 20.25 24.8749 17.5C24.8749 14.75 27.125 12.5 29.875 12.5C32.625 12.5 34.875 14.75 34.875 17.5Z" stroke="#F97316" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_514_1034">
                                        <rect width="60" height="60" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        Deseja excluir essa referência?
                    </div>


                    
                    <div className="h-[20%] flex justify-end items-center gap-4 *:font-bold *:py-1 *:px-10">
                        <button onClick={() => {
                                setConfirmModal(false);
                                setIdDelet(null);
                            }} 
                            className="flex justify-center items-center border border-gray-500 bg-white text-gray-800 w-[150px] px-1 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </button>
                        <button type="button"
                            disabled={disableButton}
                            onClick={deleteReference} 
                            className="flex justify-center items-center w-[150px] bg-gray-900 text-white px-10 py-2 rounded-md hover:bg-gray-800">
                            EXCLUIR
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}