# Guía de Configuración de Vercel y AI Gateway

## 🚀 Deployment en Vercel

### Paso 1: Importar el Proyecto

1. Ve a [vercel.com](https://vercel.com) y haz login
2. Click en "Add New..." → "Project"
3. Busca `braincolab-app` en tu lista de repositorios
4. Click en "Import"

### Paso 2: Configuración de Build

Las configuraciones ya están en `vercel.json`, pero verifica:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Paso 3: Variables de Entorno

En la pantalla de configuración, añade estas variables:

```bash
# API Keys (REQUERIDAS)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxx

# Vercel AI Gateway (OPCIONAL - se configura después)
AI_GATEWAY_URL=https://gateway.vercel.sh/xxxxxxxx
```

⚠️ **IMPORTANTE**: No uses las keys de producción hasta tener todo configurado

### Paso 4: Deploy

Click en "Deploy" y espera a que termine (aproximadamente 1-2 minutos)

---

## 🔧 Configuración del AI Gateway

### Paso 1: Acceder a AI Gateway

1. En tu dashboard de Vercel, ve a la pestaña "AI Gateway"
2. Si no la ves, ve a: https://vercel.com/dashboard/stores/ai-gateway
3. Click en "Create Gateway"

### Paso 2: Configurar el Gateway

1. **Gateway Name**: `braincolab-gateway`
2. **Description**: `Multi-AI Gateway for BrainColab App`
3. Click en "Create"

### Paso 3: Añadir Proveedores

Para cada proveedor (Anthropic, OpenAI, Google):

1. Click en "Add Provider"
2. Selecciona el proveedor
3. Añade la API Key correspondiente
4. Configura los límites:
   - **Rate Limit**: 60 requests/minute (ajusta según tu plan)
   - **Monthly Limit**: Según tu presupuesto
   - **Cache TTL**: 60 segundos (opcional)

### Paso 4: Obtener la URL del Gateway

1. Una vez configurado, copia la URL del gateway
2. Formato: `https://gateway.vercel.sh/v1/YOUR_GATEWAY_ID`
3. Ve a Settings → Environment Variables en tu proyecto
4. Añade: `AI_GATEWAY_URL=tu_url_aquí`
5. Redeploy el proyecto

---

## 🌐 Configuración del Dominio Personalizado

### Opción A: Subdominio (app.braincolab.com)

1. En tu proyecto Vercel → Settings → Domains
2. Añade: `app.braincolab.com`
3. En tu proveedor DNS, añade:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

### Opción B: Subdirectorio (braincolab.com/app)

1. En tu proyecto Vercel → Settings → Domains
2. Añade: `braincolab.com/app`
3. En tu proveedor DNS principal, configura:
   - El dominio principal apuntando a tu sitio web
   - Vercel manejará automáticamente la ruta `/app`

El archivo `vercel.json` ya incluye las reglas de rewrite necesarias:

```json
{
  "rewrites": [
    {
      "source": "/app",
      "destination": "/"
    },
    {
      "source": "/app/(.*)",
      "destination": "/$1"
    }
  ]
}
```

---

## 🔑 Obtener las API Keys

### Anthropic (Claude)

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Click en "API Keys" → "Create Key"
3. Guarda la key que empieza con `sk-ant-`

### OpenAI

1. Ve a [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click en "Create new secret key"
3. Guarda la key que empieza con `sk-`

### Google (Gemini)

1. Ve a [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click en "Create API Key"
3. Selecciona o crea un proyecto
4. Guarda la key que empieza con `AIza`

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

1. En tu proyecto Vercel → Functions
2. Click en la función `/api/chat`
3. Pestaña "Logs" para ver en tiempo real

### Monitorear Uso del AI Gateway

1. Ve a AI Gateway → Analytics
2. Puedes ver:
   - Requests por modelo
   - Tokens usados
   - Costos estimados
   - Rate limit status

### Alertas

Configura alertas en Vercel:
1. Settings → Notifications
2. Añade alertas para:
   - Build failures
   - Function errors
   - Rate limit warnings

---

## 🐛 Troubleshooting

### Error: "API key not configured"

- Verifica que las variables de entorno estén configuradas en Vercel
- Redeploy después de añadir variables

### Error: "Rate limit exceeded"

- Revisa los límites en AI Gateway
- Considera implementar cache o aumentar límites

### El dominio no funciona

- Verifica los DNS (puede tardar hasta 48h)
- Comprueba en Settings → Domains el estado

### La app no responde

- Revisa los logs de la función
- Verifica que las API keys sean válidas
- Comprueba el status de los servicios

---

## 🔐 Mejores Prácticas de Seguridad

1. **Nunca expongas las API keys en el código**
2. **Usa AI Gateway para centralizar y limitar acceso**
3. **Configura CORS apropiadamente si es necesario**
4. **Implementa rate limiting por usuario**
5. **Monitorea el uso para detectar anomalías**

---

## 📈 Optimización de Costos

1. **Usa el cache del AI Gateway** (reduce llamadas repetidas)
2. **Implementa streaming** para respuestas más rápidas
3. **Configura límites mensuales** para cada proveedor
4. **Usa modelos más económicos** para tareas simples
5. **Monitorea el dashboard** regularmente

---

## 🚀 Próximos Pasos

Una vez configurado todo:

1. **Prueba cada modelo** para verificar que funcionan
2. **Configura analytics** (Vercel Analytics, Posthog, etc.)
3. **Implementa autenticación** si es necesario
4. **Añade más features** según necesites

---

¿Necesitas ayuda? Abre un issue en GitHub o contacta soporte de Vercel.
