const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Manejar preflight OPTIONS request
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
    const { amount, planType, customerEmail, formData } = JSON.parse(event.body);

    // Validar datos requeridos
    if (!amount || !planType || !customerEmail || !formData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Faltan datos requeridos: amount, planType, customerEmail, formData' 
        }),
      };
    }

    // Crear Payment Intent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: 'eur',
      customer_email: customerEmail,
      metadata: {
        plan_type: planType,
        customer_email: customerEmail,
        para_quien: formData.paraQuien || '',
        ocasion: formData.ocasion || '',
        relacion: formData.relacion || '',
        emociones: Array.isArray(formData.emociones) ? formData.emociones.join(', ') : '',
        tono: formData.tono || '',
        tu_nombre: formData.tuNombre || '',
      },
      description: `LoQueCallas - ${planType === 'premium' ? 'Carta Premium' : 'Carta Básica'}`,
    });

    console.log('✅ Payment Intent creado:', paymentIntent.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };

  } catch (error) {
    console.error('❌ Error creando Payment Intent:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message 
      }),
    };
  }
};