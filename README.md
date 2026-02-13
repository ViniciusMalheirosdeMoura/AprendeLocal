


<div align="center">

 
  <img src="banner.png" alt="Aprende Local - Banner" width="100%" style="border-radius:16px; max-width:1100px;" />

  <h1 style="margin:18px 0 6px; font-size:42px; line-height:1.1;">
    Aprende Local
  </h1>

  <p style="max-width:860px; margin:0 auto; font-size:16px; opacity:.9;">
    Plataforma educacional interativa para acompanhar progresso, conquistas e comunidades — com autenticação segura,
    foco em acessibilidade e arquitetura pronta para escalar.
  </p>

  <br />

 
  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Vite-20232A?style=for-the-badge&logo=vite&logoColor=646CFF" />
    <img src="https://img.shields.io/badge/Tailwind-20232A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8" />
    <img src="https://img.shields.io/badge/Supabase-20232A?style=for-the-badge&logo=supabase&logoColor=3ECF8E" />
    <img src="https://img.shields.io/badge/PostgreSQL-20232A?style=for-the-badge&logo=postgresql&logoColor=4169E1" />
    <img src="https://img.shields.io/badge/Framer%20Motion-20232A?style=for-the-badge&logo=framer&logoColor=white" />
  </div>

  <br />


  <p>
    <a href="#-visão-geral">Visão geral</a> •
    <a href="#-funcionalidades">Funcionalidades</a> •
    <a href="#-stack">Stack</a> •
    <a href="#-rodando-localmente">Rodando localmente</a> •
    <a href="#-segurança">Segurança</a> •
    <a href="#-autor">Autor</a>
  </p>

  <br />

 
  <div style="
      width:100%;
      max-width:1100px;
      border-radius:18px;
      padding:18px;
      border:1px solid rgba(255,255,255,.08);
      background:
        radial-gradient(1200px 400px at 10% 10%, rgba(56,189,248,.22), transparent 55%),
        radial-gradient(1200px 400px at 90% 30%, rgba(99,102,241,.22), transparent 55%),
        radial-gradient(900px 420px at 50% 90%, rgba(34,197,94,.18), transparent 55%),
        linear-gradient(180deg, rgba(17,24,39,.35), rgba(17,24,39,.10));
    ">
    <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;">
      <div style="min-width:240px; border-radius:14px; padding:14px 16px; border:1px solid rgba(255,255,255,.10);">
        <b>🎯 Objetivo</b><br/>
        <span style="opacity:.9;">Ensino STEM com progresso, comunidades e gamificação.</span>
      </div>
      <div style="min-width:240px; border-radius:14px; padding:14px 16px; border:1px solid rgba(255,255,255,.10);">
        <b>🔒 Segurança</b><br/>
        <span style="opacity:.9;">Supabase Auth + RLS (Row Level Security).</span>
      </div>
      <div style="min-width:240px; border-radius:14px; padding:14px 16px; border:1px solid rgba(255,255,255,.10);">
        <b>♿ Acessibilidade</b><br/>
        <span style="opacity:.9;">WCAG + validações com WAVE.</span>
      </div>
      <div style="min-width:240px; border-radius:14px; padding:14px 16px; border:1px solid rgba(255,255,255,.10);">
        <b>📈 Qualidade</b><br/>
        <span style="opacity:.9;">Boas práticas alinhadas à ISO/IEC 25010.</span>
      </div>
    </div>
  </div>

</div>

<br />

<hr />

<h2 id="-visão-geral">🌍 Visão geral</h2>

<p>
O <b>Aprende Local</b> é uma plataforma web educacional que permite ao usuário manter seu perfil,
acompanhar cursos ativos, visualizar conquistas (badges) e interagir com comunidades.
O projeto foi desenhado com foco em <b>UX</b>, <b>acessibilidade</b> e <b>segurança</b>, utilizando Supabase (Auth + PostgreSQL + RLS).
</p>

<br />

<h2 id="-funcionalidades">✨ Funcionalidades</h2>

<table>
  <tr>
    <td width="50%">
      <h3 style="margin:0;">👤 Perfil do usuário</h3>
      <ul>
        <li>Autenticação segura (Supabase Auth)</li>
        <li>Dados do perfil persistidos no PostgreSQL</li>
        <li>Avatar, idade e CEP</li>
        <li>Consulta de cidade/UF via ViaCEP</li>
      </ul>
    </td>
    <td width="50%">
      <h3 style="margin:0;">🏅 Progresso e Engajamento</h3>
      <ul>
        <li>Badges e conquistas</li>
        <li>Cursos ativos</li>
        <li>Comunidades</li>
        <li>Animações com Framer Motion</li>
      </ul>
    </td>
  </tr>
</table>

<br />

<h2 id="-stack">🧰 Stack</h2>

<div style="display:flex; flex-wrap:wrap; gap:10px;">
  <img alt="React" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="34" />
  <img alt="JavaScript" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="34" />
  <img alt="Vite" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" height="34" />
  <img alt="Tailwind" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" height="34" />
  <img alt="Supabase" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" height="34" />
  <img alt="PostgreSQL" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" height="34" />
</div>

<ul>
  <li><b>Frontend:</b> React + Vite + Tailwind CSS + Framer Motion</li>
  <li><b>Backend (BaaS):</b> Supabase (Auth, PostgreSQL, RLS)</li>
  <li><b>Integrações:</b> ViaCEP (localização por CEP) • Gemini (quando aplicado)</li>
</ul>

<br />


<h2 id="-segurança">🔒 Segurança</h2>

<ul>
  <li>Autenticação via <b>Supabase Auth</b></li>
  <li>Controle de acesso ao banco com <b>RLS (Row Level Security)</b></li>
  <li>Proteção de rotas baseada em sessão</li>
</ul>

<br />

<h2 id="-a11y">♿ Acessibilidade e Qualidade</h2>

<ul>
  <li>Diretrizes <b>WCAG</b></li>
  <li>Validações com ferramentas como <b>WAVE</b></li>
  <li>Boas práticas alinhadas à <b>ISO/IEC 25010</b></li>
</ul>

<br />


<h2 id="-roadmap">🧭 Roadmap</h2>

<ul>
  <li>📚 Evolução do sistema de cursos e trilhas</li>
  <li>🏆 Gamificação avançada</li>
  <li>📊 Painel de progresso mais completo</li>
  <li>📱 Expansão para mobile</li>
</ul>

<br />

<h2 id="-autor">👨‍💻 Autor</h2>

<p>
<b>Vinicius Malheiros de Moura</b><br/>
Desenvolvedor Full Stack<br/>
</p>



<br />

<hr />

>>>>>>> e1cc70629059940ffabac5c6dfd50706ccbe9559
