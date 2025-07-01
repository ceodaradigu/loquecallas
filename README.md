# LoQueCallas - Sistema Completo de Producción

Una aplicación web completa para crear cartas personalizadas con pagos reales de Stripe y Google Form automático.

## 🚀 Características de Producción

- **✅ Pagos reales con Stripe** - Payment Intents seguros
- **✅ Backend serverless** - Netlify Functions para escalabilidad
- **✅ Google Form automático** - Se abre prellenado después del pago
- **✅ Workflow completo** - Desde pago hasta entrega por email
- **✅ Manejo de errores** - Sistema robusto con validaciones
- **✅ Diseño responsive** - Optimizado para todos los dispositivos

## 🔧 Configuración para Producción

### 1. Variables de Entorno

Crea un archivo `.env` con:
```env
# Stripe (PRODUCCIÓN)
VITE_STRIPE_PUBLIC_KEY=pk_live_51RfmRcLIrhbIGkEnmbJQcrKQKRyHUdHDTP9vrHOvTdBVAWbYuM5vgH0iHYsbeulwijgFUZMr4odmny9o9vrlUL9B00XS1NwxEL

# Google Form
VITE_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/1FAIpQLSco0xfmy5yVp0GXaSP7w3Jn2B3Le5TNih7mpDVGCbBXILiA2Q/viewform

# API
VITE_API_URL=/.netlify/functions
```

### 2. Configuración de Netlify

**Variables de entorno en Netlify:**
```
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_de_stripe
```

### 3. Configuración del Google Form

**MÉTODO SIMPLE - Google Form Prellenado:**

1. **Ve a tu Google Form:** https://docs.google.com/forms/d/e/1FAIpQLSco0xfmy5yVp0GXaSP7w3Jn2B3Le5TNih7mpDVGCbBXILiA2Q/viewform

2. **Abre herramientas de desarrollador (F12)**

3. **Busca los campos del formulario** en la pestaña "Elements"

4. **Copia los entry IDs** de cada campo (ej: `name="entry.1234567890"`)

5. **Actualiza `src/services/googleForms.ts`** con los entry IDs reales:

```javascript
const GOOGLE_FORM_ENTRIES = {
  paraQuien: 'entry.TU_ENTRY_ID_REAL',      // ¿Para quién es esta carta?
  ocasion: 'entry.TU_ENTRY_ID_REAL',        // ¿Cuál es la ocasión?
  relacion: 'entry.TU_ENTRY_ID_REAL',       // ¿Qué relación tienes?
  // ... resto de campos
};
```

**Campos necesarios en tu Google Form:**
1. ¿Para quién es esta carta?
2. ¿Cuál es la ocasión?
3. ¿Qué relación tienes con el destinatario?
4. ¿Qué emociones quieres transmitir?
5. Detalles, recuerdos o anécdotas
6. ¿Qué tono prefieres?
7. Tu nombre
8. Tu email
9. Plan elegido
10. Payment Intent ID
11. Monto pagado
12. Timestamp

## 🏗️ Arquitectura del Sistema

```
Frontend (React + Vite)
    ↓
Netlify Functions (Backend)
    ↓
Stripe API (Pagos)
    ↓
Google Form Prellenado (Automático)
    ↓
Google Apps Script (Procesamiento)
    ↓
OpenAI API (Generación de cartas)
    ↓
Email Service (Entrega)
```

## 📦 Deployment

### Netlify (Recomendado)

1. **Conecta tu repositorio** a Netlify
2. **Configura las variables de entorno:**
   - `STRIPE_SECRET_KEY`
3. **Deploy automático** - Netlify detectará la configuración

### Configuración automática:
- ✅ Build command: `npm run build`
- ✅ Functions directory: `netlify/functions`
- ✅ Publish directory: `dist`

## 🔄 Flujo Completo

1. **Usuario completa formulario** → Datos validados
2. **Selecciona plan** → Scroll automático al formulario
3. **Procesa pago con Stripe** → Payment Intent seguro
4. **Pago confirmado** → Verificación en backend
5. **Google Form se abre automáticamente** → Con todos los datos prellenados
6. **Usuario hace clic en "Enviar"** → Datos enviados a Google Apps Script
7. **Google Apps Script procesa** → Genera carta con OpenAI
8. **Email enviado automáticamente** → Usuario recibe carta

## 🛡️ Seguridad

- **✅ Claves secretas** solo en backend
- **✅ Validación de pagos** en servidor
- **✅ CORS configurado** correctamente
- **✅ Datos encriptados** en tránsito
- **✅ No almacenamiento** de datos sensibles

## 🧪 Testing

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview
```

## 📊 Monitoreo

- **Stripe Dashboard** - Monitoreo de pagos
- **Netlify Analytics** - Métricas de la aplicación
- **Google Forms** - Datos de usuarios
- **Console logs** - Debugging en tiempo real

## 🚨 Troubleshooting

### Pagos no funcionan:
1. Verifica `STRIPE_SECRET_KEY` en Netlify
2. Confirma que las functions están desplegadas
3. Revisa logs en Netlify Functions

### Google Form no se abre:
1. Verifica que los entry IDs están actualizados
2. Confirma que la URL del form es correcta
3. Revisa si hay bloqueadores de pop-ups

### Emails no llegan:
1. Verifica Google Apps Script
2. Confirma que el usuario envió el Google Form
3. Revisa configuración de OpenAI

## 📞 Soporte

Para consultas técnicas: daradigu@gmail.com

---

**🎉 ¡Sistema listo para producción!** 
Todos los componentes están configurados para manejar tráfico real y pagos seguros con Google Form automático.