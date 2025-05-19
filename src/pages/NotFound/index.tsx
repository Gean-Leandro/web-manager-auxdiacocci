import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="h-screen bg-[#103356] flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-[90px] font-bold mb-4 text-white">404</h1>
      <p className="text-lg mb-4 text-white">Página não encontrada.</p>
      <Link to="/" className="text-blue-500 underline text-white hover:text-blue-500">Voltar ao início</Link>
    </div>
  );
};