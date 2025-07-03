const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { amount, planType, customerEmail, formData } = JSON.parse(event.body);
    if (!amount || !planType || !customerEmail || !formData) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Datos faltantes' }) };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      payment_method_types: ['card'],            // ← SOLO TARJETA
      receipt_email: customerEmail,
      description: `LoQueCallas – ${planType === 'premium' ? 'Carta Premium' : 'Carta Básica'}`,
      metadata: {
        plan_type: planType,
        para_quien: formData.paraQuien || '',
        ocasion: formData.ocasion || '',
        relacion: formData.relacion || '',
        emociones: Array.isArray(formData.emociones) ? formData.emociones.join(', ') : '',
        tono: formData.tono || '',
        tu_nombre: formData.tuNombre || '',
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { amount, planType, customerEmail, formData } = JSON.parse(event.body);
    if (!amount || !planType || !customerEmail || !formData) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Datos faltantes' }) };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      payment_method_types: ['card'],            // ← SOLO TARJETA
      receipt_email: customerEmail,
      description: `LoQueCallas – ${planType === 'premium' ? 'Carta Premium' : 'Carta Básica'}`,
      metadata: {
        plan_type: planType,
        para_quien: formData.paraQuien || '',
        ocasion: formData.ocasion || '',
        relacion: formData.relacion || '',
        emociones: Array.isArray(formData.emociones) ? formData.emociones.join(', ') : '',
        tono: formData.tono || '',
        tu_nombre: formData.tuNombre || '',
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
