const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { formData, planType } = JSON.parse(event.body);

    if (!formData || !planType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'formData y planType son requeridos' }),
      };
    }

    // Configuración de precios según el plan
    const planConfig = {
      basica: {
        amount: 99, // 0.99€ en centavos
        name: 'Carta Básica LoQueCallas',
        description: 'Carta personalizada de 140-160 palabras'
      },
      premium: {
        amount: 399, // 3.99€ en centavos  
        name: 'Carta Premium LoQueCallas',
        description: 'Carta profunda y detallada de 250-300 palabras'
      }
    };

    const config = planConfig[planType];
    if (!config) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Tipo de plan inválido' }),
      };
    }

    // Crear checkout session con los datos del formulario como metadatos
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: config.name,
              description: config.description,
            },
            unit_amount: config.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL || 'https://loquecallas.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://loquecallas.com'}`,
      customer_email: formData.email,
      metadata: {
        // Pasar todos los datos del formulario como metadatos
        paraQuien: formData.paraQuien,
        ocasion: formData.ocasion,
        relacion: formData.relacion,
        emociones: formData.emociones.join(', '),
        detalles: formData.detalles,
        tono: formData.tono,
        tuNombre: formData.tuNombre,
        email: formData.email,
        planElegido: formData.planElegido,
        timestamp: new Date().toISOString()
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: session.url,
        sessionId: session.id
      }),
    };

  } catch (error) {
    console.error('Error creando checkout session:', error);
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
