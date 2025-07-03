const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // ──────────────────── CORS ────────────────────
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Pre-flight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Solo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { amount, planType, customerEmail, formData } = JSON.parse(event.body);

    // Validación básica
    if (!amount || !planType || !customerEmail || !formData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Faltan datos requeridos: amount, planType, customerEmail, formData',
        }),
      };
    }

    // ─────────────── Crear Payment Intent ───────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),       // céntimos
      currency: 'eur',
      receipt_email: customerEmail,           // ← CAMBIADO
      description: `LoQueCallas - ${
        planType === 'premium' ? 'Carta Premium' : 'Carta Básica'
      }`,
      metadata: {
        plan_type: planType,
        para_quien: formData.paraQuien || '',
        ocasion: formData.ocasion || '',
        relacion: formData.relacion || '',
        emociones: Array.isArray(formData.emociones)
          ? formData.emociones.join(', ')
          : '',
        tono: formData.tono || '',
        tu_nombre: formData.tuNombre || '',
      },
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
        details: error.message,
      }),
    };
  }
};
