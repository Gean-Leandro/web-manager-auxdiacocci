import { useEffect, useState, useRef } from "react";
import { Sidebar } from "../../components/sidebar";
import { DynamicListInput } from "../../components/DynamicListInput";
import { Notification } from "../../components/Notification";
import { ScoreInput } from "../../components/ScoreInput";
import { Link, useNavigate } from 'react-router-dom';
import { EimeriaService } from "../../services/eimeriaService"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AccountService } from "../../services/accountService";
import { ScreamLoading } from "../../components/ScreamLoading";
import { Egg } from "lucide-react";

interface Iscore {
    level: number | string,
    img: string | File,
    imgUrlTemp: string,
    imgPath: string,
    description: Array<string>
}

interface eimeriaProps{
    id: string,
    name: string,
    imgLocal: string | File,
    imgLocalUrlTemp: string,
    imgPath: string,
    category: string,
    general_description: string,
    place_of_action: string,
    clinical_signs: Array<string>,
    score: Array<Iscore>
}

export function NewEimeria(){
    useEffect(() => {
        document.title = "Nova Eimeria";
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

    const navigate = useNavigate();
    const [eimeria, setEimeria] = useState<eimeriaProps>({
        id: '',
        name: '',
        imgLocal: '',
        imgLocalUrlTemp: '',
        imgPath:'',
        category: '',
        general_description: '',
        place_of_action: '',
        clinical_signs: [],
        score: []
    });

    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [login, setLogin] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(e.target.value);
        setEimeria((prev) => ({...prev, category: e.target.value}))
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const imageUrl = URL.createObjectURL(file);
            setEimeria((prev) => ({
                ...prev,
                imgLocal: file,
                imgLocalUrlTemp: imageUrl
            }))
        } else {
            setShowNotification({
                active: true,
                mensage: "Por favor, selecione uma imagem JPG ou PNG.",
                bgColor: "bg-orange-500"
            });
        }
        event.target.value = "";
    };

    const validateFields = (): boolean => {
        if (eimeria.name !== ''){
            if(eimeria.imgLocal !== ''){
                if (category !== ""){
                    if(eimeria.general_description !== ''){
                        if(eimeria.place_of_action !== ''){
                            if (eimeria.clinical_signs.length > 0){
                                return true;
                            } else {
                                setShowNotification({
                                    active: true,
                                    mensage: "Insira pelo menos um sinal clínicio ou Sinal macroscópico",
                                    bgColor: "bg-orange-500",
                                });
                                return false;
                            }
                        } else {
                            setShowNotification({
                                active: true,
                                mensage: "Preencha o local de ação",
                                bgColor: "bg-orange-500",
                            });
                            return false;
                        }
                    } else {
                        setShowNotification({
                            active: true,
                            mensage: "Preencha a descrição geral",
                            bgColor: "bg-orange-500",
                        });
                        return false;
                    }
                } else {
                    setShowNotification({
                        active: true,
                        mensage: "Selecione uma categoria",
                        bgColor: "bg-orange-500",
                    });
                    return false;
                }
            } else {
                setShowNotification({
                    active: true,
                    mensage: "Selecione uma imagem da área de ação",
                    bgColor: "bg-orange-500",
                });
                return false;
            }
        } else {
            setShowNotification({
                active: true,
                mensage: "Preencha o campo nome",
                bgColor: "bg-orange-500",
            });
            return false;
        }
    } 

    const addNewEimeria = async () => {   
        setLoading(true);
        if (validateFields()){
            try {
                await EimeriaService.salvarEimeria(eimeria, category);
                setLoading(false);
                navigate('/eimerias');
            } catch (error) { 
                setLoading(false);
                setShowNotification({
                    active: true,
                    mensage: "Erro: " + error,
                    bgColor: "bg-orange-500",
                });
            }
        }
        setLoading(false);
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

        {loading && <ScreamLoading />}
        
        <div className="flex h-screen bg-gray-100">
            <Sidebar levelAccount={login} selected={2}/>
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center py-6">
                    <div className="py-2 pl-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <Egg className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Nova eimeria</h1>
                        </div>
                        <p className="text-gray-500">Preencha o cadastro para adicionar uma nova espécie</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">CADASTRANDO EIMERIA</h2>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">NOME:</label>
                    <input 
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setEimeria((prev) => ({...prev, name: e.target.value}));
                    }}
                    placeholder="Nome"
                    className="border border-gray-500 rounded-md px-3 py-2 w-full" 
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">IMAGEM DA ÁREA DE LESÃO:</label>

                    <div className="flex justify-start items-center gap-2">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            type="button" 
                            className={`${eimeria.imgLocal !== "" ? "bg-green-500 text-white" : "bg-mygray-300"} text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300`}>
                        {eimeria.imgLocal !== "" ? "IMAGEM SELECIONADA" : "SELECIONAR IMAGEM"}
                        </button>

                        <button
                            onClick={() => setEimeria((prev) => ({...prev, imgLocal: "", imgLocalUrlTemp:""}))} 
                            type="button"
                            className={`${eimeria.imgLocal === ""? "hidden": ""} hover:bg-mygray-300 h-[100%] rounded-[8px] p-2`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"/>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">CATEGORIA:</label>
                    <div className="flex space-x-6">
                    <label className="flex items-center">
                        <input type="radio" name="category" className="h-4 w-4 text-blue-600" 
                            onChange={handleChange}
                            checked={category === "Principais espécies"}
                            value={'Principais espécies'}/>
                        <span className="ml-2 text-sm text-gray-700">Principais espécies</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="category" className="h-4 w-4 text-blue-600" 
                            onChange={handleChange}
                            checked={category === "Espécies menos frequentes"}
                            value={'Espécies menos frequentes'}/>
                        <span className="ml-2 text-sm text-gray-700">Espécies menos frequentes</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="category" className="h-4 w-4 text-blue-600" 
                            onChange={handleChange}
                            checked={category === "Espécies menos patogênicas"}
                            value={'Espécies menos patogênicas'}/>
                        <span className="ml-2 text-sm text-gray-700">Espécies menos patogênicas</span>
                    </label>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">DESCRIÇÃO GERAL:</label>
                    <div className="relative">
                        <textarea name="description" 
                        id="description"
                        value={eimeria.general_description}
                        className="border border-gray-500 rounded-md px-3 py-2 w-full" 
                        placeholder="DESCRIÇÃO"
                        onChange={(e) => setEimeria((prev) => ({...prev, general_description: e.target.value}))}/>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">LOCAL DE AÇÃO:</label>
                    <div className="relative">
                        <textarea name="placeOfAction" 
                            id="placeOfAction"
                            value={eimeria.place_of_action}
                            className="border border-gray-500 rounded-md px-3 py-2 w-full" 
                            placeholder="LOCAL"
                            onChange={(e) => setEimeria((prev) => ({...prev, place_of_action: e.target.value}))}/>
                    </div>
                </div>
                
                <div className="mb-6">
                    <DynamicListInput title="SINAIS CLÍNICOS E SINAIS MACROSCÓPICOS:"  
                        placeholder="Sinais" 
                        textEmptyReport="Nenhum sinal disponível" 
                        list={eimeria.clinical_signs} 
                        onEdit={(index:number|null, newDescription:string):boolean => {
                            if (index !== null) {
                                const description = newDescription.trim()
                                if (eimeria.clinical_signs[index] !== description){
                                    const updateDescription = [...eimeria.clinical_signs];
                                    updateDescription[index] = newDescription;
                                    setEimeria((prev) => ({
                                        ...prev,
                                        clinical_signs: updateDescription
                                    }))
                                    return true;
                                }
                            }
                            return false
                        }}
                        onRemove={(index: number) => {
                            setEimeria((prev) => ({
                                ...prev,
                                clinical_signs: prev.clinical_signs.filter((_,i) => i !== index)
                            }));
                        }}
                        onAdd={(newItem: string) => {
                            setEimeria((prev) => ({
                                ...prev,
                                clinical_signs: [...prev.clinical_signs, newItem]
                        }));
                    }}/>
                </div>
                
                <div className="mb-6">
                    <ScoreInput list={eimeria.score} 
                        onAdd={(newScore:Iscore)=> {
                            setEimeria((prev) => ({
                                ...prev,
                                score: [...prev.score, newScore]
                            }))
                        }} 
                        onEdit={(index:number, score:Iscore) => {
                            setEimeria((prev) => ({
                                ...prev,
                                score: prev.score.map((e,i) => {
                                    if (i === index) {
                                        return score
                                    } else {
                                        return e
                                    }
                                } )
                            }))
                        }}
                        onRemove={(index: number) => {
                            setEimeria((prev) => ({
                                ...prev,
                                score: prev.score.filter((_,i) => i !== index)
                            }));
                    }}/>
                </div>
                
                    <div className="flex justify-end space-x-4 mt-8">
                        <Link to={'/eimerias'} className="border border-gray-300 bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100">
                        CANCELAR
                        </Link>
                        <button onClick={addNewEimeria} type="button" className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
                        CADASTRAR
                        </button>
                    </div>
                </div>
            </div>       
        </div>
        </>
    )
}