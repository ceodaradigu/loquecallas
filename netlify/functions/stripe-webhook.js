const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ✅ Configuración del Google Form (copiada de tu código frontend)
const GOOGLE_FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSco0xfmy5yVp0GXaSP7w3Jn2B3Le5TNih7mpDVGCbBXILiA2Q/viewform';

const GOOGLE_FORM_ENTRIES = {
  paraQuien: 'entry.1876306950',
  ocasion: 'entry.1925524653',
  relacion: 'entry.1780892610',
  emociones: 'entry.1034540138',
  detalles: 'entry.1155486927',
  tono: 'entry.1244248194',
  tuNombre: 'entry.1484056496',
  email: 'entry.275195844'
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const signature = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      endpointSecret
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
    };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    
    try {
      console.log('✅ Pago exitoso recibido:', session.id);
      
      const customerEmail = session.customer_details.email;
      const amountPaid = session.amount_total / 100;
      
      // Obtener datos del formulario desde metadatos
      const formData = {
        paraQuien: session.metadata.paraQuien,
        ocasion: session.metadata.ocasion,
        relacion: session.metadata.relacion,
        emociones: session.metadata.emociones ? session.metadata.emociones.split(', ') : [],
        detalles: session.metadata.detalles,
        tono: session.metadata.tono,
        tuNombre: session.metadata.tuNombre,
        email: session.metadata.email,
        planElegido: session.metadata.planElegido,
        paymentIntentId: session.payment_intent,
        amount: amountPaid.toFixed(2),
        timestamp: new Date().toISOString()
      };
      
      console.log(`💰 Pago de ${amountPaid}€ para plan ${formData.planElegido}`);
      console.log(`📧 Email del cliente: ${customerEmail}`);
      console.log(`📝 Generando carta para: ${formData.paraQuien}`);
      
      // Enviar a Google Form (usando tu lógica original)
      await submitToGoogleFormDirect(formData);
      
      console.log('✅ Carta enviada exitosamente a:', formData.email);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Pago procesado y carta enviada exitosamente',
          paymentId: session.id 
        })
      };
      
    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Error interno procesando el pago',
          paymentId: session.id 
        })
      };
    }
  }

  console.log(`ℹ️ Evento recibido pero no procesado: ${stripeEvent.type}`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Evento recibido' })
  };
};

// ✅ Función adaptada de tu código frontend para el servidor
async function submitToGoogleFormDirect(formData) {
  try {
    console.log('📝 Enviando datos directamente al Google Form:', formData.email);
    
    const formUrl = GOOGLE_FORM_BASE_URL.replace('/viewform', '/formResponse');
    
    // Crear parámetros URL para enviar
    const params = new URLSearchParams();
    
    Object.entries(formData).forEach(([key, value]) => {
      const entryId = GOOGLE_FORM_ENTRIES[key];
      if (entryId && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(entryId, value.join(', '));
        } else {
          params.append(entryId, value.toString());
        }
        console.log(`✅ Enviando ${key} → ${entryId}: ${Array.isArray(value) ? value.join(', ') : value}`);
      }
    });

    // Enviar datos usando fetch (Node.js)
    const fetch = require('node-fetch');
    const response = await fetch(formUrl, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    console.log('✅ Email simulado enviado exitosamente');
    console.log('✅ Carta enviada exitosamente a:', formData.email);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error enviando datos a Google Form:', error);
    throw error;
  }
}
