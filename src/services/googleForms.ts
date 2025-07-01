import { LetterFormData } from '../types';

const GOOGLE_FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSco0xfmy5yVp0GXaSP7w3Jn2B3Le5TNih7mpDVGCbBXILiA2Q/viewform';

// ✅ TODOS LOS ENTRY IDS COMPLETOS Y ACTUALIZADOS
const GOOGLE_FORM_ENTRIES = {
  paraQuien: 'entry.1876306950',      // ¿Para quién es esta carta?
  ocasion: 'entry.1925524653',        // ¿Cuál es la ocasión?
  relacion: 'entry.1780892610',       // ¿Qué relación tienes?
  emociones: 'entry.1034540138',      // ¿Qué emociones quieres transmitir?
  detalles: 'entry.1155486927',       // Detalles, recuerdos o anécdotas
  tono: 'entry.1244248194',           // ¿Qué tono prefieres?
  
  // ✅ LOS 2 QUE FALTABAN - AHORA COMPLETOS:
  tuNombre: 'entry.1484056496',       // Tu nombre (para firmar la carta)
  email: 'entry.275195844',           // Tu email para recibir la carta
  
  // Campos adicionales del sistema (estos se pueden agregar al form si quieres)
  planElegido: 'entry.PLAN_ID',       // Plan elegido (opcional)
  paymentIntentId: 'entry.PAYMENT_ID', // ID del pago (opcional)
  amount: 'entry.AMOUNT_ID',          // Monto pagado (opcional)
  timestamp: 'entry.TIMESTAMP_ID'     // Timestamp (opcional)
};

export interface GoogleFormData extends LetterFormData {
  paymentIntentId?: string;
  amount?: string;
  timestamp?: string;
}

/**
 * ✅ Abre el Google Form en una nueva pestaña con los datos prellenados
 */
export const openPrefilledGoogleForm = (formData: GoogleFormData): void => {
  try {
    console.log('🔗 Abriendo Google Form prellenado con datos:', formData);
    
    // Crear URL con parámetros prellenados
    const url = new URL(GOOGLE_FORM_BASE_URL);
    
    // Añadir cada campo como parámetro en la URL
    Object.entries(formData).forEach(([key, value]) => {
      const entryId = GOOGLE_FORM_ENTRIES[key as keyof typeof GOOGLE_FORM_ENTRIES];
      if (entryId && value !== undefined && value !== null && !entryId.includes('_ID')) {
        if (Array.isArray(value)) {
          // Para arrays (como emociones), unir con comas
          url.searchParams.append(entryId, value.join(', '));
        } else {
          url.searchParams.append(entryId, value.toString());
        }
        console.log(`✅ Prellenando ${key} → ${entryId}: ${Array.isArray(value) ? value.join(', ') : value}`);
      }
    });

    console.log('🔗 URL del Google Form prellenado:', url.toString());

    // Abrir en nueva pestaña
    const newWindow = window.open(url.toString(), '_blank');
    
    if (newWindow) {
      console.log('✅ Google Form abierto en nueva pestaña');
      // Enfocar la nueva pestaña
      newWindow.focus();
    } else {
      console.warn('⚠️ No se pudo abrir nueva pestaña (bloqueador de pop-ups?)');
      // Fallback: redirigir en la misma pestaña
      window.location.href = url.toString();
    }
    
  } catch (error) {
    console.error('❌ Error abriendo Google Form:', error);
    throw new Error('Error abriendo el formulario de Google');
  }
};

/**
 * ✅ Método alternativo: envío directo por fetch (como backup)
 */
export const submitToGoogleFormDirect = async (formData: GoogleFormData): Promise<void> => {
  try {
    console.log('📝 Enviando datos directamente al Google Form:', formData);
    
    const formUrl = GOOGLE_FORM_BASE_URL.replace('/viewform', '/formResponse');
    
    // Crear FormData para enviar
    const googleFormData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      const entryId = GOOGLE_FORM_ENTRIES[key as keyof typeof GOOGLE_FORM_ENTRIES];
      if (entryId && value !== undefined && value !== null && !entryId.includes('_ID')) {
        if (Array.isArray(value)) {
          googleFormData.append(entryId, value.join(', '));
        } else {
          googleFormData.append(entryId, value.toString());
        }
        console.log(`✅ Enviando ${key} → ${entryId}: ${Array.isArray(value) ? value.join(', ') : value}`);
      }
    });

    // Enviar datos
    await fetch(formUrl, {
      method: 'POST',
      body: googleFormData,
      mode: 'no-cors'
    });

    console.log('✅ Datos enviados directamente a Google Form');
    
  } catch (error) {
    console.error('❌ Error enviando datos directamente:', error);
    throw error;
  }
};

/**
 * ✅ Función principal que combina ambos métodos
 */
export const processGoogleFormSubmission = async (formData: GoogleFormData): Promise<void> => {
  try {
    console.log('🚀 Procesando envío a Google Form con TODOS los entry IDs completos');
    
    // Método principal: abrir form prellenado
    openPrefilledGoogleForm(formData);
    
    // Método backup: envío directo automático (para asegurar que lleguen los datos)
    setTimeout(() => {
      submitToGoogleFormDirect(formData);
    }, 2000); // Esperar 2 segundos para que el usuario vea el form prellenado
    
  } catch (error) {
    console.error('❌ Error procesando envío a Google Form:', error);
    throw error;
  }
};

/**
 * ✅ Verificar que todos los entry IDs están completos
 */
export const verifyEntryIds = (): void => {
  const requiredFields = ['paraQuien', 'ocasion', 'relacion', 'emociones', 'detalles', 'tono', 'tuNombre', 'email'];
  const missingEntries = requiredFields.filter(field => {
    const entryId = GOOGLE_FORM_ENTRIES[field as keyof typeof GOOGLE_FORM_ENTRIES];
    return !entryId || entryId.includes('_ID') || entryId.includes('BUSCAR');
  });

  if (missingEntries.length === 0) {
    console.log('✅ TODOS LOS ENTRY IDS ESTÁN COMPLETOS Y LISTOS:');
    requiredFields.forEach(field => {
      const entryId = GOOGLE_FORM_ENTRIES[field as keyof typeof GOOGLE_FORM_ENTRIES];
      console.log(`   ${field}: ${entryId}`);
    });
    console.log('🚀 ¡SISTEMA LISTO PARA PRODUCCIÓN!');
  } else {
    console.warn('⚠️ Entry IDs faltantes:', missingEntries);
  }
};

// Verificar automáticamente al cargar
verifyEntryIds();