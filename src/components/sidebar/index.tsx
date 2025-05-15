import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from '../../../firebaseConfig';
import { BookOpen, Egg, FileText, LayoutDashboard, LogOut, Microscope, User, UserCog } from "lucide-react";
import logo from '../../assets/Logo.png';

interface ISidebar {
    levelAccount: string,
}

export function Sidebar(props:ISidebar){
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/')
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
      };

    return(
        <div className="bg-[#103356] w-52 flex flex-col">
            {/* Logo */}
            <div className="p-4 mb-6 h-[112px] flex justify-center items-center bg-[#FBFBFB] rounded-bl-[20px]">
                <img className='w-[90%]' src={logo}/>
            </div>
            
            {/* Menu de navegação */}
            <nav className="flex-grow">
            <ul className="space-y-2">
                <li>
                <Link to={'/dashboard'} className="flex items-center px-4 py-3 text-white bg-blue-800">
                    <LayoutDashboard className="mr-3" size={20} />
                    <span>Dashboard</span>
                </Link>
                </li>
                <li>
                <Link to={'/eimerias'} className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-800 hover:text-white">
                    <Egg className="mr-3" size={20} />
                    <span>Eimeria</span>
                </Link>
                </li>
                <li>
                <Link to={'/glossario'} className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-800 hover:text-white">
                    <BookOpen className="mr-3" size={20} />
                    <span>Glossário</span>
                </Link>
                </li>
                <li>
                <Link to={'/nomes-cientificos'} className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-800 hover:text-white">
                    <Microscope className="mr-3" size={20} />
                    <span>Nomes científicos</span>
                </Link>
                </li>
                <li>
                <Link to={'/referencias'} className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-800 hover:text-white">
                    <FileText className="mr-3" size={20} />
                    <span>Referências</span>
                </Link>
                </li>
                <li>
                <Link to={'/perfil'} className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-800 hover:text-white">
                    <User className="mr-3" size={20} />
                    <span>Perfil</span>
                </Link>
                </li>
                <li>
                <Link to={'/contas'} className={`${props.levelAccount !== "admin"? "hidden" : ""} flex items-center px-4 py-3 text-gray-300 hover:bg-blue-800 hover:text-white`}>
                    <UserCog className="mr-3" size={20} />
                    <span>Contas</span>
                </Link>
                </li>
            </ul>
            </nav>
            
            {/* Botão de sair */}
            <div className="mt-auto mb-6">
                <a onClick={handleLogout} className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-800 hover:text-white">
                    <LogOut className="mr-3" size={20} />
                    <span>Sair</span>
                </a>
            </div>
        </div>


        // <div className="bg-mygray-800 text-white flex flex-col">
        //     <div className="h-[80%]">
        //         <div className="flex justify-center py-[44px]">
        //             <img src="./src/assets/chicken_icon.svg" style={{width:86, height:102.53}}/>
        //         </div>

        //         <div className="grid grid-cols-1 mt-5 *:font-bold *:text-center *:text-[15px] *:py-3">
        //             <Link to='/cadastros-eimerias' className="hover:bg-mygray-700 mx-1 rounded-[3px]">EIMERIAS</Link>
        //             <Link to='/glossario' className="hover:bg-mygray-700 mx-1 rounded-[3px]">GLOSSÁRIO</Link>
        //             <Link to='/nomes-cientificos' className="hover:bg-mygray-700 mx-1 rounded-[3px]">NOMES CIENTÍFICOS</Link>
        //             <Link to='/referencias' className="hover:bg-mygray-700 mx-1 rounded-[3px]">REFERÊNCIAS</Link>
        //             <Link to='/perfil' className="hover:bg-mygray-700 mx-1 rounded-[3px]">PERFIL</Link>
        //             <Link to='/contas' className={`${props.levelAccount !== "admin"? "hidden" : ""} hover:bg-mygray-700 mx-1 rounded-[3px]`}>CONTAS</Link>
        //         </div>
        //     </div>
        //     <div className="h-[20%] flex items-end justify-center">
        //         <button type="button"
        //             onClick={handleLogout} 
        //             className="hover:bg-mygray-700 mb-5 mx-2 py-2 rounded-[3px] text-white font-bold text-center w-[100%]">
        //             SAIR
        //         </button>
        //     </div>
        // </div>
    )
}