import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Cadastro from "./paginas/cadastro";

import Login from "./paginas/login";
import Cursos from "./paginas/cursos";
import Maker from "./paginas/makerspaces";
import Home from "./paginas/home";

import Cursoview from "./paginas/testecurso"
import { Perfil } from "./paginas/perfil";
import Comunidades from "./paginas/comunidades";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/makerspaces" element={<Maker />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:cursoId" element={<Cursoview />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/comunidades" element={<Comunidades />} />
          <Route path="/cadastrar" element={<Cadastro />} />

          <Route path="*" element={<p className="p-6">Página não encontrada</p>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;