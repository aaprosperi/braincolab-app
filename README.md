# BrainColab App - Multi-AI Assistant

Aplicación web que integra Claude (Anthropic), Gemini (Google) y OpenAI a través de Vercel AI Gateway.

## 🚀 Setup Inicial

### 1. Clonar el Repositorio
```bash
git clone https://github.com/aaprosperi/braincolab-app.git
cd braincolab-app
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
- Copia el archivo `.env.example` a `.env.local`
- Añade tus API keys (NO las subas a GitHub)

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000)

## 📋 Configuración en Vercel

### Paso 1: Importar Proyecto
1. Ve a [vercel.com](https://vercel.com)
2. Click en "Import Project"
3. Selecciona este repositorio: `aaprosperi/braincolab-app`

### Paso 2: Configurar Dominio
1. En Settings → Domains
2. Añade: `braincolab.com`
3. Configura subdirectorio `/app`

### Paso 3: Variables de Entorno
En Settings → Environment Variables, añade:
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_API_KEY`

### Paso 4: Configurar AI Gateway
1. Ve a la sección AI Gateway en Vercel
2. Crea un nuevo gateway
3. Añade los providers:
   - Anthropic
   - OpenAI
   - Google AI
4. Copia la URL del gateway

## 🏗️ Estructura del Proyecto

```
braincolab-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # API endpoint
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Página principal
│   │   └── globals.css         # Estilos globales
│   └── components/             # Componentes (próximamente)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vercel.json                 # Configuración de Vercel
```

## 📝 Próximos Pasos

### En v0 de Vercel:
1. Crear componentes de UI mejorados
2. Añadir funcionalidades de chat
3. Mejorar el diseño visual

### Con Claude Desktop:
1. Revisar y corregir código de v0
2. Implementar integración real con AI Gateway
3. Añadir manejo de errores

### Con Claude Code (futuro):
1. Optimizar rendimiento
2. Añadir tests
3. Implementar features avanzados

## 🔧 Comandos Disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run start    # Ejecutar build
npm run lint     # Verificar código
```

## 🌐 URLs Importantes

- **Repositorio**: https://github.com/aaprosperi/braincolab-app
- **Producción**: https://braincolab.com/app (pendiente de deploy)
- **Vercel Dashboard**: https://vercel.com/dashboard

## 📚 Documentación de Referencia

- [Next.js](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ⚠️ Importante

- **NUNCA** subas API keys al repositorio
- Usa `.env.local` para desarrollo local
- Configura las keys en Vercel Dashboard para producción

---
Desarrollado por: Alfredo Arenas
