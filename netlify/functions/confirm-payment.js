const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { paymentIntentId } = JSON.parse(event.body);

    if (!paymentIntentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'paymentIntentId es requerido' }),
      };
    }

    // Verificar el estado del Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log('🔍 Verificando Payment Intent:', paymentIntentId, 'Estado:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      // Pago exitoso - preparar datos para Google Form
      const formData = {
        paraQuien: paymentIntent.metadata.para_quien || '',
        ocasion: paymentIntent.metadata.ocasion || '',
        relacion: paymentIntent.metadata.relacion || '',
        emociones: paymentIntent.metadata.emociones || '',
        detalles: paymentIntent.metadata.detalles || '',
        tono: paymentIntent.metadata.tono || '',
        tuNombre: paymentIntent.metadata.tu_nombre || '',
        email: paymentIntent.metadata.customer_email || '',
        planElegido: paymentIntent.metadata.plan_type || '',
        paymentIntentId: paymentIntentId,
        amount: (paymentIntent.amount / 100).toFixed(2),
        timestamp: new Date().toISOString(),
      };

      console.log('✅ Pago confirmado, datos preparados para Google Form:', formData);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          status: 'succeeded',
          formData: formData,
          message: 'Pago confirmado exitosamente',
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          status: paymentIntent.status,
          message: `Pago en estado: ${paymentIntent.status}`,
        }),
      };
    }

  } catch (error) {
    console.error('❌ Error confirmando pago:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error verificando el pago',
        details: error.message 
      }),
    };
  }
};