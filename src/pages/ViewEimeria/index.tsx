import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { DynamicListInputDescription } from "../../components/DynamicListDescription";
import { Notification } from "../../components/Notification";
import { Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AccountService } from "../../services/accountService";

interface Iscore {
    level: number,
    img: string,
    imgUrlTemp: string,
    imgPath: string,
    description: Array<string>
}

interface eimeriaProps{
    name: string,
    imgLocal: string,
    imgPath: string,
    category: string,
    general_description: Array<string>,
    place_of_action: Array<string>,
    clinical_signs: Array<string>,
    score: Array<Iscore>
}

export function ViewEimeria(){
    useEffect(() => {
        document.title = "Visualizando Eimeria";
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

    const location = useLocation();
    const [eimeria, setEimeria] = useState<eimeriaProps>(location.state);
    const [image, setImage] = useState<string>("");
    const [imageModal, setImageModal] = useState<boolean>(false);
    const [scoreModal, setScoreModal] = useState<boolean>(false);
    const [scoreDescription, setScpreDescription] = useState<string[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [login, setLogin] = useState<string>('');

    function capitalizeFirstLetter(text: string) {
        const lowerText = text.toLowerCase();
        return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
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

        <div className="grid grid-cols-[250px_1fr] h-screen">
            <Sidebar levelAccount={login}/>
            <div className="px-[15svh] overflow-y-auto">
                <div className="rounded-[8px] bg-mygray-300 flex items-center px-8 mt-5 h-[10svh] text-[25px]">
                    VISUALIZANDO EIMERIA
                </div>

                <div className="grid grid-cols-6 gap-8 items-center justify-start mt-[10%] mb-5">
                    {/* Campo Nome */}
                    <div className="flex items-center col-span-4 gap-3">
                        Nome:
                        <div className="h-[45px] bg-mygray-200 border-[2px] border-mygray-500 rounded-[8px] px-4 flex items-center justify-center">
                            {eimeria.name}
                        </div>
                    </div>

                    {/* Campo Imagem */}
                    <div className="flex items-center col-span-4 gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Picture-Double-Landscape--Streamline-Ultimate" height="24" width="24"><desc>Picture Double Landscape Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M18.75 5.25v-0.978c0.0015 -0.26409 -0.0491 -0.52588 -0.1488 -0.77042 -0.0998 -0.24454 -0.2467 -0.46704 -0.4324 -0.6548 -0.1857 -0.18776 -0.4066 -0.3371 -0.65 -0.4395 -0.2435 -0.1024 -0.5047 -0.15584 -0.7688 -0.15728H2.75003c-0.26409 0.00144 -0.52531 0.05488 -0.76874 0.15728 -0.24344 0.1024 -0.46432 0.25174 -0.65004 0.4395 -0.18572 0.18776 -0.332633 0.41026 -0.432359 0.6548 -0.099726 0.24454 -0.150309 0.50633 -0.148861 0.77042v9.456c-0.001448 0.2641 0.049135 0.5259 0.148861 0.7704 0.099726 0.2446 0.246639 0.4671 0.432359 0.6548 0.18572 0.1878 0.4066 0.3371 0.65004 0.4395 0.24343 0.1024 0.50465 0.1559 0.76874 0.1573" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m11.339 21.7499 4.439 -6.307c0.1304 -0.1863 0.3015 -0.3404 0.5003 -0.4508 0.1987 -0.1105 0.42 -0.1743 0.6471 -0.1866 0.227 -0.0123 0.4539 0.0271 0.6634 0.1154 0.2096 0.0882 0.3964 0.223 0.5462 0.394l4.938 5.643" stroke-width="1.5"></path><path stroke="#000000" d="M10.875 13.5c-0.2071 0 -0.375 -0.1679 -0.375 -0.375s0.1679 -0.375 0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" d="M10.875 13.5c0.2071 0 0.375 -0.1679 0.375 -0.375s-0.1679 -0.375 -0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M22.25 8.25H7c-0.55228 0 -1 0.44772 -1 1v11.5c0 0.5523 0.44772 1 1 1h15.25c0.5523 0 1 -0.4477 1 -1V9.25c0 -0.55228 -0.4477 -1 -1 -1Z" stroke-width="1.5"></path></svg>
                        Imagem da área de lesão:

                        <button 
                            onClick={() => {
                                setImage(eimeria.imgLocal);
                                setImageModal(true);
                            }}
                            type="button" 
                            className={`h-[45px] bg-mygray-900 text-white border-[2px] border-mygray-500 rounded-[8px] font-bold px-8 hover:bg-mygray-400`}>
                            VER IMAGEM
                        </button>
                    </div>

                    {/* Campo Categoria */}
                    <div className="flex items-center col-span-6 gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Move-To-Bottom--Streamline-Ultimate" height="24" width="24"><desc>Move To Bottom Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M0.75 0.748047h6V6.74805h-6V0.748047Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M0.75 10.498v-0.74995h1.5" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M2.25 14.248H0.75v-0.75" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M6.75 13.498v0.75h-1.5" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M2.25 23.248H0.75v-1.5" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M6.75 21.748v1.5h-1.5" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M5.25 9.74805h1.5v0.74995" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M0.75 18.748v-1.5h1.5" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M5.25 17.248h1.5v1.5" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m15 15.748 -3.75 3.75 3.75 3.75" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M11.25 19.5h4.5c1.9891 0 3.8968 -0.7902 5.3033 -2.1967C22.4598 15.8968 23.25 13.9891 23.25 12s-0.7902 -3.89678 -2.1967 -5.3033C19.6468 5.29018 17.7391 4.5 15.75 4.5h-4.5" stroke-width="1.5"></path></svg>
                        Categoria:
                        <div className="h-[45px] bg-mygray-200 border-[2px] border-mygray-500 flex items-center rounded-[8px] px-4">
                            {eimeria.category}
                        </div>
                    </div>


                    {/* Campo Descrição geral */}
                    <div className="grid grid-cols-1 col-span-4 gap-3">
                        <DynamicListInputDescription title="Descrição geral" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Task-List-Approve--Streamline-Ultimate" height="24" width="24"><desc>Task List Approve Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M11.25 14.2612h5.25" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M11.25 18.7612h5.25" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M11.25 9.76123h5.25" stroke-width="1.5"></path><path stroke="#000000" d="M8.25 14.6362c-0.20711 0 -0.375 -0.1679 -0.375 -0.375s0.16789 -0.375 0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" d="M8.25 14.6362c0.20711 0 0.375 -0.1679 0.375 -0.375s-0.16789 -0.375 -0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" d="M8.25 19.1362c-0.20711 0 -0.375 -0.1679 -0.375 -0.375s0.16789 -0.375 0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" d="M8.25 19.1362c0.20711 0 0.375 -0.1679 0.375 -0.375s-0.16789 -0.375 -0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" d="M8.25 10.1362c-0.20711 0 -0.375 -0.16787 -0.375 -0.37497 0 -0.20711 0.16789 -0.375 0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" d="M8.25 10.1362c0.20711 0 0.375 -0.16787 0.375 -0.37497 0 -0.20711 -0.16789 -0.375 -0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M15.75 4.5h3.75c0.3978 0 0.7794 0.15804 1.0607 0.43934S21 5.60218 21 6v15.75c0 0.3978 -0.158 0.7794 -0.4393 1.0607s-0.6629 0.4393 -1.0607 0.4393h-15c-0.39782 0 -0.77936 -0.158 -1.06066 -0.4393C3.15804 22.5294 3 22.1478 3 21.75V6c0 -0.39782 0.15804 -0.77936 0.43934 -1.06066C3.72064 4.65804 4.10218 4.5 4.5 4.5h3.75c0 -0.99456 0.39509 -1.94839 1.09835 -2.65165C10.0516 1.14509 11.0054 0.75 12 0.75c0.9946 0 1.9484 0.39509 2.6517 1.09835C15.3549 2.55161 15.75 3.50544 15.75 4.5Z" stroke-width="1.5"></path><path stroke="#000000" d="M12 4.51123c-0.2071 0 -0.375 -0.1679 -0.375 -0.375 0 -0.20711 0.1679 -0.375 0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" d="M12 4.51123c0.2071 0 0.375 -0.1679 0.375 -0.375 0 -0.20711 -0.1679 -0.375 -0.375 -0.375" stroke-width="1.5"></path></svg>}
                        textEmptyReport="Nenhuma descrição disponível" 
                        list={eimeria.general_description}/>
                    </div>
                    
                    {/* Campo Local de Ação */}
                    <div className="grid grid-cols-1 col-span-4 gap-3">
                        <DynamicListInputDescription title="Local de ação" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Cursor-Target-1--Streamline-Ultimate" height="24" width="24"><desc>Cursor Target 1 Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M12.002 17.2471v6" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M12.002 0.74707v6" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M6.75201 11.9971H0.752014" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M23.252 11.9971h-6" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M3.75201 11.998c0 1.0835 0.2134 2.1562 0.628 3.1572 0.4146 1.0009 1.02229 1.9104 1.78837 2.6765 0.76609 0.7661 1.67556 1.3738 2.6765 1.7884 1.00093 0.4146 2.07372 0.6279 3.15712 0.6279 1.0834 0 2.1562 -0.2133 3.1572 -0.6279 1.0009 -0.4146 1.9104 -1.0223 2.6764 -1.7884 0.7661 -0.7661 1.3738 -1.6756 1.7884 -2.6765 0.4146 -1.001 0.628 -2.0737 0.628 -3.1572 0 -1.0834 -0.2134 -2.15616 -0.628 -3.15709 -0.4146 -1.00094 -1.0223 -1.91041 -1.7884 -2.67649 -0.766 -0.76609 -1.6755 -1.37378 -2.6764 -1.78838 -1.001 -0.4146 -2.0738 -0.62799 -3.1572 -0.62799 -1.0834 0 -2.15619 0.21339 -3.15712 0.62799 -1.00094 0.4146 -1.91041 1.02229 -2.6765 1.78838 -0.76608 0.76608 -1.37377 1.67555 -1.78837 2.67649 -0.4146 1.00093 -0.628 2.07369 -0.628 3.15709Z" stroke-width="1.5"></path></svg>} 
                            textEmptyReport="Nenhum local de ação disponível"  
                            list={eimeria.place_of_action}/>
                    </div>

                    {/* Campo Sinais clínicos */}
                    <div className="grid grid-cols-1 col-span-4 gap-3">
                        <DynamicListInputDescription title="Sinais clínicos e sinais macroscópicos" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Add-Circle-Bold--Streamline-Ultimate" height="24" width="24"><desc>Add Circle Bold Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M0.75 12c0 2.9837 1.18526 5.8452 3.29505 7.955C6.15483 22.0647 9.01631 23.25 12 23.25c2.9837 0 5.8452 -1.1853 7.955 -3.295 2.1097 -2.1098 3.295 -4.9713 3.295 -7.955 0 -2.98369 -1.1853 -5.84517 -3.295 -7.95495C17.8452 1.93526 14.9837 0.75 12 0.75c-2.98369 0 -5.84517 1.18526 -7.95495 3.29505C1.93526 6.15483 0.75 9.01631 0.75 12Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75h-3v-3c0 -0.39782 -0.158 -0.77936 -0.4393 -1.06066 -0.2813 -0.2813 -0.6629 -0.43934 -1.0607 -0.43934h-1.5c-0.3978 0 -0.7794 0.15804 -1.0607 0.43934 -0.28126 0.2813 -0.4393 0.66284 -0.4393 1.06066v3h-3c-0.39782 0 -0.77936 0.15804 -1.06066 0.4393 -0.2813 0.2813 -0.43934 0.6629 -0.43934 1.0607v1.5c0 0.3978 0.15804 0.7794 0.43934 1.0607s0.66284 0.4393 1.06066 0.4393h3v3c0 0.3978 0.15804 0.7794 0.4393 1.0607 0.2813 0.2813 0.6629 0.4393 1.0607 0.4393h1.5c0.3978 0 0.7794 -0.158 1.0607 -0.4393s0.4393 -0.6629 0.4393 -1.0607v-3h3c0.3978 0 0.7794 -0.158 1.0607 -0.4393s0.4393 -0.6629 0.4393 -1.0607v-1.5c0 -0.3978 -0.158 -0.7794 -0.4393 -1.0607 -0.2813 -0.28126 -0.6629 -0.4393 -1.0607 -0.4393Z" stroke-width="1.5"></path></svg>} 
                            textEmptyReport="Nenhum sinal disponível" 
                            list={eimeria.clinical_signs}/>
                    </div>

                    {/* Campo Score */}
                    <div className="grid grid-cols-1 col-span-4 gap-3">
                        <div className="flex gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Tags-1--Streamline-Ultimate" height="24" width="24"><desc>Tags 1 Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M1.13501 2.63403v6.258c0.00017 0.79559 0.31635 1.55857 0.879 2.12097L13.644 22.643c0.096 0.0961 0.2162 0.1643 0.3479 0.1974 0.1317 0.033 0.2699 0.0297 0.3999 -0.0096 0.1299 -0.0393 0.2468 -0.1132 0.338 -0.2137 0.0913 -0.1005 0.1536 -0.2239 0.1802 -0.3571l1.225 -6.126 6.126 -1.225c0.1331 -0.0266 0.2566 -0.0889 0.3571 -0.1801 0.1005 -0.0913 0.1744 -0.2082 0.2137 -0.3381 0.0393 -0.13 0.0426 -0.2682 0.0095 -0.3999 -0.033 -0.1317 -0.1012 -0.2519 -0.1973 -0.3479L11.014 2.01303c-0.5625 -0.56264 -1.32541 -0.87883 -2.12099 -0.879h-6.258c-0.39782 0 -0.77936 0.15804 -1.06066 0.43934 -0.2813 0.28131 -0.43934 0.66284 -0.43934 1.06066Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M4.88501 6.38403c0 0.19699 0.0388 0.39204 0.11418 0.57403 0.07538 0.18199 0.18587 0.34735 0.32516 0.48663 0.13929 0.13929 0.30465 0.24978 0.48663 0.32516 0.18199 0.07538 0.37705 0.11418 0.57403 0.11418 0.19698 0 0.39204 -0.0388 0.57402 -0.11418 0.18199 -0.07538 0.34735 -0.18587 0.48664 -0.32516 0.13929 -0.13928 0.24978 -0.30464 0.32516 -0.48663 0.07538 -0.18199 0.11418 -0.37704 0.11418 -0.57403 0 -0.19698 -0.0388 -0.39203 -0.11418 -0.57402 -0.07538 -0.18199 -0.18587 -0.34735 -0.32516 -0.48664 -0.13929 -0.13928 -0.30465 -0.24977 -0.48664 -0.32516 -0.18198 -0.07538 -0.37704 -0.11418 -0.57402 -0.11418s-0.39204 0.0388 -0.57403 0.11418c-0.18198 0.07539 -0.34734 0.18588 -0.48663 0.32516 -0.13929 0.13929 -0.24978 0.30465 -0.32516 0.48664 -0.07538 0.18199 -0.11418 0.37704 -0.11418 0.57402Z" stroke-width="1.5"></path></svg>
                            Score:
                        </div>
                        <div className="bg-mygray-200 p-2 rounded-[8px] border-[2px] border-mygray-500"> 
                            <div className="bg-white rounded-[8px] border-[2px] border-mygray-500 p-1">
                                <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
                                { eimeria.score.length === 0 ? (
                                            <p className="text-center text-gray-500 p-2 mt-1">Nenhum score disponível.</p>
                                        ): (
                                            <ul>
                                                {eimeria.score.map((score, index) => (
                                                    <li className="p-2 border-b flex first-letter:uppercase items-center justify-between">
                                                        {score.level}
                                                        <div className="flex items-center gap-2 *:p-1">

                                                            {/* Botão visualizar imagem */}
                                                            <button onClick={() => {
                                                                    setImage(score.img);
                                                                    setImageModal(true);
                                                                }} 
                                                                type="button" 
                                                                className={`${score.img === "" ? "hidden": ""} hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px]`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Picture-Double-Landscape--Streamline-Ultimate" height="24" width="24"><desc>Picture Double Landscape Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M18.75 5.25v-0.978c0.0015 -0.26409 -0.0491 -0.52588 -0.1488 -0.77042 -0.0998 -0.24454 -0.2467 -0.46704 -0.4324 -0.6548 -0.1857 -0.18776 -0.4066 -0.3371 -0.65 -0.4395 -0.2435 -0.1024 -0.5047 -0.15584 -0.7688 -0.15728H2.75003c-0.26409 0.00144 -0.52531 0.05488 -0.76874 0.15728 -0.24344 0.1024 -0.46432 0.25174 -0.65004 0.4395 -0.18572 0.18776 -0.332633 0.41026 -0.432359 0.6548 -0.099726 0.24454 -0.150309 0.50633 -0.148861 0.77042v9.456c-0.001448 0.2641 0.049135 0.5259 0.148861 0.7704 0.099726 0.2446 0.246639 0.4671 0.432359 0.6548 0.18572 0.1878 0.4066 0.3371 0.65004 0.4395 0.24343 0.1024 0.50465 0.1559 0.76874 0.1573" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m11.339 21.7499 4.439 -6.307c0.1304 -0.1863 0.3015 -0.3404 0.5003 -0.4508 0.1987 -0.1105 0.42 -0.1743 0.6471 -0.1866 0.227 -0.0123 0.4539 0.0271 0.6634 0.1154 0.2096 0.0882 0.3964 0.223 0.5462 0.394l4.938 5.643" stroke-width="1.5"></path><path stroke="#000000" d="M10.875 13.5c-0.2071 0 -0.375 -0.1679 -0.375 -0.375s0.1679 -0.375 0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" d="M10.875 13.5c0.2071 0 0.375 -0.1679 0.375 -0.375s-0.1679 -0.375 -0.375 -0.375" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M22.25 8.25H7c-0.55228 0 -1 0.44772 -1 1v11.5c0 0.5523 0.44772 1 1 1h15.25c0.5523 0 1 -0.4477 1 -1V9.25c0 -0.55228 -0.4477 -1 -1 -1Z" stroke-width="1.5"></path></svg>
                                                            </button>

                                                            {/* Botão de visualizar */}
                                                            <button 
                                                                onClick={() => {
                                                                    setScpreDescription(eimeria.score[index].description);
                                                                    setScoreModal(true);
                                                                }}
                                                                type="button" 
                                                                className="hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px]">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Search-Circle--Streamline-Ultimate" height="24" width="24"><desc>Search Circle Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M0.75 12c0 2.9837 1.18526 5.8452 3.29505 7.955C6.15483 22.0647 9.01631 23.25 12 23.25c2.9837 0 5.8452 -1.1853 7.955 -3.295 2.1097 -2.1098 3.295 -4.9713 3.295 -7.955 0 -2.98369 -1.1853 -5.84517 -3.295 -7.95495C17.8452 1.93526 14.9837 0.75 12 0.75c-2.98369 0 -5.84517 1.18526 -7.95495 3.29505C1.93526 6.15483 0.75 9.01631 0.75 12Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M6.75 11.125c0 1.1603 0.46094 2.2731 1.28141 3.0936 0.82047 0.8205 1.93327 1.2814 3.09359 1.2814 1.1603 0 2.2731 -0.4609 3.0936 -1.2814 0.8205 -0.8205 1.2814 -1.9333 1.2814 -3.0936 0 -1.16032 -0.4609 -2.27312 -1.2814 -3.09359C13.3981 7.21094 12.2853 6.75 11.125 6.75c-1.16032 0 -2.27312 0.46094 -3.09359 1.28141C7.21094 8.85188 6.75 9.96468 6.75 11.125Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m14.219 14.218 3.031 3.032" stroke-width="1.5"></path></svg>
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 flex justify-end gap-4 *:font-bold *:py-4 *:px-10">
                        <Link to={'/cadastros-eimerias'} className="border-[2px] border-black rounded-[8px] hover:bg-mygray-600 hover:text-white">
                            VOLTAR
                        </Link>
                        <Link to={'/atualizar-eimeria'} state={eimeria} className="bg-black rounded-[8px] text-white hover:bg-mygray-600">
                            EDITAR
                        </Link>
                    </div>
                </div>
            </div>        
        </div>

        {/* Modal Imagem */}
        {imageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white px-4 pb-1 pt-4 rounded-lg shadow-lg min-w-[30%] min-h-[30%] max-w-[90%] max-h-[90%] overflow-auto relative">
                    <div className="flex justify-between h-[10%] w-[100%] mb-3">
                        <div className="font-bold text-[18px] flex justify-center items-center w-[90%] pl-12">
                            IMAGEM
                        </div>
                        <button type="button" onClick={() => {
                            setImageModal(false);
                            setImage('');
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <img src={image} alt="Visualização" className="max-w-full max-h-[70vh] rounded border-[2px] border-mygray-500 mb-4" />
                    </div>
                </div>
            </div>
        )}

        {/* Modal Visualizar score*/}
        {scoreModal && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-[8px] w-[50%] min-h-[20%]">
                    <div className="flex justify-between h-[10%] mb-3">
                        <div className="font-bold text-[18px] flex justify-center items-center w-[90%] pl-10">
                            <strong className="text-mygray-600 mr-1">SCORE {">"}</strong>INFORMAÇÕES ADICIONAIS
                        </div>
                        <button type="button" onClick={() => {
                                setScoreModal(false);
                                setScpreDescription([]);
                            }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div className="h-[90%] w-[100%] flex items-center justify-center">
                        <div className="bg-mygray-200 p-2 rounded-[8px] border-[2px] border-mygray-500 w-[100%]">
                            <div className="bg-white rounded-[8px] border-[2px] border-mygray-500 p-1">
                                <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
                                        { scoreDescription.length === 0 ? (
                                            <p className="text-center text-gray-500 p-2 mt-1">Nenhuma descrição adicionada</p>
                                        ): (
                                            <ul>
                                                {scoreDescription.map((desc, _) => (
                                                    <li className="p-2 border-b flex first-letter:uppercase items-center justify-between">
                                                        <div className="w-[100%] break-words">
                                                            {capitalizeFirstLetter(desc)}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}