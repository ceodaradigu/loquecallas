const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Solo aceptar métodos POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Verificar webhook signature (importante para seguridad)
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

  // Procesar solo eventos de pago exitoso
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    
    try {
      console.log('✅ Pago exitoso recibido:', session.id);
      
      // Aquí extraeremos los datos del cliente desde los metadatos
      const customerEmail = session.customer_details.email;
      const amountPaid = session.amount_total / 100; // Convertir de centavos a euros
      
      // Determinar tipo de plan basado en el precio
      const planType = amountPaid === 0.99 ? 'basica' : 'premium';
      
      console.log(`💰 Pago de ${amountPaid}€ para plan ${planType}`);
      console.log(`📧 Email del cliente: ${customerEmail}`);
      
      // Aquí irá la lógica para generar y enviar la carta
      await generateAndSendLetter({
        email: customerEmail,
        planType: planType,
        paymentId: session.id,
        amount: amountPaid
      });
      
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

  // Para otros tipos de eventos de Stripe
  console.log(`ℹ️ Evento recibido pero no procesado: ${stripeEvent.type}`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Evento recibido' })
  };
};

// Función para generar y enviar la carta
async function generateAndSendLetter(paymentData) {
  console.log('🎨 Generando carta para:', paymentData.email);
  
  // NOTA: Aquí falta conectar con los datos del formulario
  // Por ahora, enviamos un email básico de confirmación
  
  const letterContent = generateBasicLetter(paymentData.planType);
  
  // Enviar email (necesitaremos configurar un servicio de email)
  await sendEmail({
    to: paymentData.email,
    subject: `Tu carta personalizada LoQueCallas - Plan ${paymentData.planType}`,
    content: letterContent,
    paymentId: paymentData.paymentId
  });
  
  console.log('✅ Carta enviada exitosamente a:', paymentData.email);
}

// Función temporal para generar carta básica
function generateBasicLetter(planType) {
  if (planType === 'basica') {
    return `
Querido/a destinatario/a,

¡Gracias por elegir LoQueCallas! 

Esta es tu carta personalizada del plan básico. Tu carta real se generará con todos los detalles que proporcionaste en el formulario.

Con cariño,
El equipo de LoQueCallas

---
Plan: Carta Básica (0.99€)
Entrega: Inmediata
    `;
  } else {
    return `
Querido/a destinatario/a,

¡Gracias por elegir LoQueCallas Premium! 

Esta es tu carta personalizada del plan premium. Tu carta real se generará con todos los detalles que proporcionaste en el formulario, con máxima personalización y lenguaje poético avanzado.

Con cariño y dedicación,
El equipo de LoQueCallas

---
Plan: Carta Premium (3.99€)
Entrega: Inmediata
    `;
  }
}

// Función para enviar email (temporal - necesita configuración real)
async function sendEmail(emailData) {
  console.log('📧 Enviando email a:', emailData.to);
  console.log('📝 Contenido:', emailData.content);
  
  // AQUÍ IRÁN LAS LLAMADAS REALES A UN SERVICIO DE EMAIL
  // Por ejemplo: SendGrid, Resend, EmailJS, etc.
  
  // Por ahora solo logueamos
  console.log('✅ Email simulado enviado exitosamente');
  
  return true;
}
