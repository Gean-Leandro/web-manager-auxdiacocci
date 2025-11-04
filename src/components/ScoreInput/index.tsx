import { useState, useRef } from "react";
import { Notification } from "../Notification";
import { Check, Edit2, Image, Search, Trash2, X } from "lucide-react";

interface Iscore {
    level: number | string,
    img: string | File,
    imgUrlTemp: string,
    imgPath: string,
    imgRef: string,
    description: Array<string>
}

interface ScoreInputProps {
    onAdd: (newScore: Iscore) => void;
    onRemove: (index: number) => void;
    onEdit: (index:number, score:Iscore) => void;
    list: Array<Iscore>
}

export function ScoreInput(props:ScoreInputProps) {
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [imageModal, setImageModal] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [level, setLevel] = useState<number | string>("");
    const [description, setDescription] = useState<Array<string>>([]);
    const [newDescription, setNewDescription] = useState<string>("");
    const [editDescriptionIndex, setEditDescriptionIndex] = useState<number | null>(null);
    const [editScoreIndex, setEditScoreIndex] = useState<number | null>(null);
    const [image, setImage] = useState<string | File>("");
    const [imageUrlFile, setImageUrlFile] = useState<string>("");
    const [imageRef, setImageRef] = useState<string>("");
    const [imageView, setImageView] = useState<string | File>("");
    const [imageUrlFileView, setImageUrlFileView] = useState<string>("");
    const [alertLevel, setAlertLevel] = useState<boolean>(false);
    const [alertImageRef, setAlertImageRef] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSelectImage = () => {
        fileInputRef.current?.click();
    };

    const editScore = (index:number, level:number|string) => {
        setEditScoreIndex(index);
        setLevel(level);
        if (props.list[index].img !== ""){
            setImage(props.list[index].img);
            setImageRef(props.list[index].imgRef);
        }
    }
    
    const editScoreCancel = () => {
        setLevel("");
        setEditScoreIndex(null);
        setImage("");
        setAlertLevel(false);
    }

    const editScoreSave = () => {
        if (editScoreIndex !== null) {
            if (Number(level) > 0) {
                const editScore:Iscore = {
                    level: level, 
                    img:image,
                    imgUrlTemp: imageUrlFile,
                    imgPath: '',
                    imgRef: imageRef,
                    description:props.list[editScoreIndex].description
                };
    
                props.onEdit(editScoreIndex, editScore);
                setEditScoreIndex(null);
                setImage("");
                setLevel("");
                setImageUrlFile("");
                setShowNotification({
                    active: true,
                    mensage: "Score atualizado",
                    bgColor: "bg-green-600"
                });
            } else {
                setShowNotification({
                    active: true,
                    mensage: "Nível não pode ser menor que 1",
                    bgColor: "bg-orange-500"
                })
                setAlertLevel(true);
            }
            
        }
    }

    const editScoreDescriptionActive = (index:number) => {
        setDescription(props.list[index].description)
        setEditScoreIndex(index);
        setIsOpen(true);
    }

    const editScoreDescriptionSave = () => {
        if (editScoreIndex !== null) {
            if (description.length === 0){
                setShowNotification({
                    active: true,
                    mensage: "Adicione pelo menos uma descrição",
                    bgColor: "bg-orange-500"
                });
            } else {
                if (props.list[editScoreIndex].level !== level){
                    const editScore:Iscore = {
                        level: props.list[editScoreIndex].level, 
                        img: props.list[editScoreIndex].img, 
                        imgUrlTemp: props.list[editScoreIndex].imgUrlTemp,
                        imgPath: props.list[editScoreIndex].imgPath,
                        imgRef: props.list[editScoreIndex].imgRef,
                        description: description
                    };

                    props.onEdit(editScoreIndex, editScore);
                    setEditScoreIndex(null);
                    setEditDescriptionIndex(null);
                    setNewDescription("");
                    setDescription([]);
                    setIsOpen(false);
                    setShowNotification({
                        active: true,
                        mensage: "Score atualizado",
                        bgColor: "bg-green-600"
                    });
                } else {
                    setShowNotification({
                        active: true,
                        mensage: "Nível é idêntico ao anterior, ação cancelada",
                        bgColor: "bg-orange-500"
                    });
                }
            }
        }
    }

    const editDescriptionActivate = (index:number, description:string) => {
        setEditDescriptionIndex(index);
        setNewDescription(description);
    }
    
    const editDescriptionCancel = () => {
        setNewDescription("");
        setEditDescriptionIndex(null);
    }

    const editDescriptionSave = () => {
        if (editDescriptionIndex !== null) {
            if (description[editDescriptionIndex] !== newDescription.trim()){
                const updateDescription = [...description];
                updateDescription[editDescriptionIndex] = newDescription.trim();
                setDescription(updateDescription);
                setEditDescriptionIndex(null);
                setNewDescription("");
                setShowNotification({
                    active: true,
                    mensage: "Descrição atualizada",
                    bgColor: "bg-green-600"
                });
            } else {
                setShowNotification({
                    active: true,
                    mensage: "Descrição é idêntica a anterior, ação cancelada",
                    bgColor: "bg-orange-500"
                });
            }
        }
    }

    const cancelDescriptionbutton = () => {
        setNewDescription("");
        setLevel("");
        setDescription([]);
        setImage("");
        setEditScoreIndex(null);
        setIsOpen(false);
        setEditDescriptionIndex(null);
    }

    const addNewScoreButton = () => {
        if (description.length > 0) {
            setNewDescription("");
            props.onAdd({
                level: level, 
                img: image, 
                imgPath: '',
                imgUrlTemp: imageUrlFile,
                imgRef: imageRef,
                description: description
            });
            setDescription([]);
            setImage("");
            setLevel("");
            setImageUrlFile("");
            setIsOpen(false);
            setShowNotification({
                active: true,
                mensage: "Score adicionado",
                bgColor: "bg-green-600"
            });
        } else {
            setShowNotification({
                active: true,
                mensage: "Adicione pelo menos uma descrição",
                bgColor: "bg-orange-500"
            });
        }
    }

    const addNewDescriptionButton = () => {
        if (newDescription.trim() !== "") {
            setDescription([...description, newDescription.trim()]);
            setNewDescription("");
        } else {
            setShowNotification({
                active: true,
                mensage: "Preencha o campo para poder adicionar uma nova descrição",
                bgColor: "bg-orange-500"
            })
        }
    }

    const removeItemListDescription = (index:number) => {
        setDescription(description.filter((_,i) => i !== index))
    }

    const openModal = () => {
        if (level !== "") {
            if (!props.list.some((score) => score.level === level)){
                if (!(Number(level) < 1)){
                    if (image !== "" && imageRef === "") {
                        setShowNotification({
                            active: true,
                            mensage: "Ao adicionar uma imagem é necessario adcionar uma referência",
                            bgColor: "bg-orange-500"
                        })
                        setAlertImageRef(true)
                    } else {
                        setIsOpen(true);
                        setAlertLevel(false);
                    }
                } else {
                    setShowNotification({
                        active: true,
                        mensage: "Nível não pode ser menor que 1",
                        bgColor: "bg-orange-500"
                    })
                    setAlertLevel(true);
                }
            } else {
                setShowNotification({
                    active: true,
                    mensage: "Não pode ter níveis iguais",
                    bgColor: "bg-orange-500"
                })
                setAlertLevel(true);
            }
        } else {
            setAlertLevel(true);
        }
    }

    // Capturar imagem e convertê-la em URL temporária
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const imageUrl = URL.createObjectURL(file); // Pré-visualização local da imagem
            setImageUrlFile(imageUrl);
            setImage(file);
        } else {
            setShowNotification({
                active: true,
                mensage: "Por favor, selecione uma imagem JPG ou PNG.",
                bgColor: "bg-orange-500"
            });
        }
        event.target.value = "";
    };

    return(
        <>
        {showNotification.active && (
            <Notification
            message={showNotification.mensage}
            bgColor={showNotification.bgColor}
            onClose={() => setShowNotification({active: false, mensage:"", bgColor:""})}
            />
        )}
        <label className="block text-sm font-medium text-gray-700 mb-2">SCORE:</label>

        <div className={`flex space-x-2 justify-between ${editScoreIndex !== null && !isOpen ? "hidden" : ""}`}>
            <div className="w-[20%]">
                <input 
                    value={level}
                    onChange={(e) => setLevel(e.target.value ? Number(e.target.value) : "")} 
                    type="number" 
                    className={`${alertLevel ? "border-red-600" : "border-gray-500"} border rounded-md px-3 py-2 w-[100%]`} 
                    placeholder="NÍVEL" 
                    />
                <p className={`text-red-600 mt-1 w-[100%] text-center ${alertLevel ? "" : "hidden"}`}>Adicione um nível válido</p>
            </div>

            <div className="w-[70%]">
                <button 
                    onClick={handleSelectImage}
                    type="button" 
                    className={`${image !== "" ? "bg-green-500 text-white" : "bg-mygray-300"} w-[100%] ${!alertLevel && "h-[42px]"} text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300`}>
                    {image !== "" ? "IMAGEM SELECIONADA" : "SELECIONAR IMAGEM"}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"/>

                <input type="text"
                    value={imageRef}
                    onChange={(e) => setImageRef(e.target.value ? e.target.value : "")}
                    className={`${image === "" && "hidden"} ${alertImageRef ? "border-red-600" : "border-gray-500"} mt-2 border rounded-md px-3 py-2 w-[100%]`} 
                    placeholder="Referência" 
                />
                <p className={`text-red-600 mt-1 w-[100%] text-center ${alertImageRef ? "" : "hidden"}`}>Adicione uma referência</p>
            </div>

                        
            <button className={`${image !== "" ? "" : "hidden"} ${alertLevel && "h-[42px]"} bg-white border-red-600 border-[2px] rounded-[8px] px-2`}
                type="button"
                onClick={() => {
                    setImage("")
                    setImageRef("")
                }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <button onClick={openModal} type="button" className={`${alertLevel && "h-[42px]"} bg-gray-800 rounded-md p-2 hover:bg-gray-300 w-[10%] flex justify-center items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path color="#FFFFFF" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
            
        {/* Campo para editar */}
        <div className={`flex space-x-2 justify-between ${editScoreIndex !== null && !isOpen ? "" : "hidden"}`}>
            <div className="w-[20%]">
                <input 
                    value={level}
                    onChange={(e) => setLevel(e.target.value ? Number(e.target.value) : "")} 
                    className={`${alertLevel ? "border-red-600" : "border-mygray-500"} border rounded-md px-3 py-2 w-[100%]`} 
                    type="number" 
                    placeholder="Nível"/>
                <p className={`text-red-600 mt-1 w-[100%] text-center ${alertLevel ? "" : "hidden"}`}>Adicione um nível válido</p>
            </div>

            <div className={`${image !== "" ? "w-[50%]" : "w-[70%]"}`}>
                <button onClick={handleSelectImage} 
                    type="button" 
                    className={`${image !== "" ? "bg-green-500 text-white" : "bg-mygray-300"} ${alertLevel && "h-[42px]"} w-[100%] text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300`}>
                    {image !== "" ? "IMAGEM SELECIONADA" : "SELECIONAR IMAGEM"}
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"/>
                
                <input type="text"
                        value={imageRef}
                        onChange={(e) => setImageRef(e.target.value ? e.target.value : "")}
                        className={`${image === "" && "hidden"} ${alertImageRef ? "border-red-600" : "border-gray-500"} mt-2 border rounded-md px-3 py-2 w-[100%]`} 
                        placeholder="Referência" 
                        />
                <p className={`text-red-600 mt-1 w-[100%] text-center ${alertImageRef ? "" : "hidden"}`}>Adicione uma referência</p>
            </div>

            <button className={`${image !== "" ? "" : "hidden"} ${alertLevel && "h-[42px]"} w-[20%] bg-white flex justify-center text-red-600 items-center border-red-600 border-[2px] rounded-[8px] px-2`}
                type="button"
                onClick={() => {
                    setImage("")
                    setImageRef("")
                }}>
                REMOVER IMAGEM
            </button>

            <button
                onClick={editScoreCancel}
                type="button" 
                className={`${alertLevel && "h-[42px]"} text-red-500 hover:text-red-700 w-[5%] bg-red-200 flex items-center justify-center rounded-[8px]`}>
                <X size={20}/>
            </button>
            <button
                onClick={editScoreSave}
                type="button" 
                className={`${alertLevel && "h-[42px]"} text-green-500 hover:text-green-700 w-[5%] flex items-center bg-green-200 justify-center rounded-[8px]`}>
                <Check size={20}/>
            </button>
        </div>
        
        <div className="mt-2 border border-gray-400 rounded-md bg-gray-50">
            <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
            { props.list.length === 0 ? (
                        <p className="text-center text-gray-500 p-2 mt-1">Nenhum score disponível.</p>
                    ): (
                        <ul>
                            {props.list.map((score, index) => (
                                <li key={index} className="py-2 px-4 border-b flex first-letter:uppercase items-center justify-between">
                                    {score.level}
                                    <div className="flex items-center gap-2 *:p-1">
                                        {/* Botão visualizar imagem */}
                                        <button onClick={() => {
                                            setImageView(score.img);
                                            setImageUrlFileView(score.imgUrlTemp);
                                            setImageRef(score.imgRef);
                                            setImageModal(true);
                                        }} 
                                            type="button" 
                                            className={`${score.img === "" ? "hidden": ""} hover:text-blue-500 flex justify-center items-center`}>
                                            <Image size={20}/>
                                        </button>
                                        
                                        {/* Botão de edição */}
                                        <button onClick={() => editScore(index, score.level)}
                                            type="button" 
                                            className={`text-gray-600 hover:text-blue-600 rounded-[8px] ${index === editScoreIndex ? "hidden": ""}`}>
                                            <Edit2 size={20} />
                                        </button>
                                        
                                        {/* Botão de visualizar */}
                                        <button 
                                            onClick={() => editScoreDescriptionActive(index)}
                                            type="button" 
                                            className="hover:text-blue-500">
                                            <Search size={20}/>
                                        </button>

                                        {/* Botão de exclusão */}
                                        <button onClick={() => props.onRemove(index)} type="button" className="text-red-500 hover:text-red-700 rounded-[8px]">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </div>

        {/* Modal */}
        {isOpen && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-[8px] w-[50%]">
                    <div className="flex justify-between h-[10%] mb-3">
                        <div className="font-bold text-[18px] flex justify-center pl-16 items-center w-[90%]">
                            <strong className="text-mygray-600 mr-1">SCORE {">"}</strong>INFORMAÇÕES ADICIONAIS
                        </div>
                        <button type="button" onClick={cancelDescriptionbutton}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div className="bg-mygray-300 p-2  rounded-[8px] border-[1px] border-mygray-500">
                        <div className={`relative ${editDescriptionIndex !== null ? "hidden": ""} border border-gray-400 rounded-md bg-gray-50`}>
                            <input 
                                type="text" 
                                className="border border-gray-300 pr-10 rounded-md px-3 py-2 w-full" 
                                placeholder="DESCRIÇÃO"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                            <button className="absolute right-2 top-2 bg-gray-200 rounded-md p-1 hover:bg-gray-300"
                                onClick={addNewDescriptionButton}
                                type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Campo de edição */}
                        <div className={`relative ${editDescriptionIndex === null ? "hidden": ""} border border-gray-400 rounded-md bg-gray-50`}>
                            <input 
                                type="text" 
                                className=" pr-10 rounded-md px-3 py-3 w-full" 
                                placeholder="DESCRIÇÃO"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />

                            <div className="absolute right-2 top-[3.5%] flex gap-2 py-1 *:py-2 *:px-2">
                                <button
                                    onClick={editDescriptionCancel}
                                    type="button" 
                                    className="text-red-500 hover:text-red-700 bg-red-200 flex items-center justify-center rounded-[8px]">
                                    <X size={20}/>
                                </button>
                                <button
                                    onClick={editDescriptionSave}
                                    type="button" 
                                    className="text-green-500 hover:text-green-700 flex items-center bg-green-200 justify-center rounded-[8px]">
                                    <Check size={20}/>
                                </button>
                            </div>
                        </div>

                        <div className="mt-2 border h-[75%] border-gray-400 rounded-md bg-gray-50">
                            <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
                                    { description.length === 0 ? (
                                        <p className="text-gray-500 pt-[15px] text-sm text-center">Nenhuma descrição adicionada</p>
                                    ): (
                                        <ul className="px-2 py-1">
                                            {description.map((desc, index) => (
                                                <li key={index} className="p-1 border-b flex items-center justify-between">
                                                    <div className="w-[85%] break-words">
                                                        {desc}
                                                    </div>
                                                    <div className="flex items-center gap-2 *:p-2">
                                                        {/* Botão de edição */}
                                                        <button onClick={() => editDescriptionActivate(index, desc)}
                                                            type="button" 
                                                            className={`text-gray-600 hover:text-blue-600 rounded-[8px] ${index === editDescriptionIndex ? "hidden": ""}`}>
                                                            <Edit2 size={20} />
                                                        </button>
                                                        <button onClick={() => removeItemListDescription(index)} type="button" className="text-red-500 hover:text-red-700 rounded-[8px]">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className="h-[20%] mt-4 flex justify-end items-center gap-4 *:font-bold *:py-1 *:px-10">
                        <button onClick={cancelDescriptionbutton} className="border border-gray-300 bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </button>
                        <button type="button" 
                            onClick={() => {
                                if (editScoreIndex !== null) {
                                    editScoreDescriptionSave()
                                } else {
                                    addNewScoreButton()
                                }
                            }} 
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
                            ADICIONAR
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal Imagem */}
        {imageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white px-4 pb-1 pt-4 rounded-lg shadow-lg max-w-[90%] max-h-[90%] overflow-auto relative">
                    <div className="flex justify-between h-[10%] mb-3">
                        <div className="font-bold text-[18px] flex justify-center items-center w-[90%] pl-12">
                            IMAGEM
                        </div>
                        <button type="button" onClick={() => {
                            setImageView("");
                            setImageRef("");
                            setImageModal(false);
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <img src={typeof imageView === "string"? imageView : imageUrlFileView} alt="Visualização" className="max-w-full max-h-[70vh] rounded mb-4" />
                    <p className="font-bold">Referência:</p>
                    <p className="border-gray-500 bg-gray-50 my-2 border rounded-md px-3 py-2 w-[100%]">{imageRef}</p>
                </div>
            </div>
        )}

        </>
    )
}