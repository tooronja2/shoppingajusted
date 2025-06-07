
import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

// This is a generic template for static pages like FAQ, Shipping Policy, etc.
const StaticPage = () => {
  const { pageName } = useParams<{ pageName: string }>();
  const { config } = useStore();

  if (!config) return null;

  // Content based on the page name from the URL
  const getPageContent = () => {
    switch (pageName) {
      case 'faq':
        return {
          title: 'Preguntas Frecuentes',
          content: (
            <div className="prose max-w-none">
              <h2>Sobre los Pedidos</h2>
              
              <h3>¿Cómo realizo un pedido?</h3>
              <p>
                Navega por nuestra tienda, selecciona los productos que desees, agrégalos a tu carrito 
                y sigue el proceso de checkout. Una vez confirmado el pedido, te contactaremos por 
                WhatsApp para coordinar el pago y la entrega.
              </p>
              
              <h3>¿Cuáles son las formas de pago?</h3>
              <p>
                Aceptamos transferencias bancarias, efectivo en punto de entrega y todas las tarjetas 
                a través de nuestros procesadores de pago. Los detalles específicos se proporcionarán 
                cuando te contactemos para confirmar el pedido.
              </p>
              
              <h2>Sobre los Envíos</h2>
              
              <h3>¿Cuánto tarda en llegar mi pedido?</h3>
              <p>
                El tiempo de entrega varía según tu ubicación. Para envíos locales, generalmente entre 
                24 y 48 horas. Para envíos a otras provincias, entre 3 y 7 días hábiles.
              </p>
              
              <h3>¿Hay costos de envío?</h3>
              <p>
                Los envíos tienen un costo que varía según la ubicación. Para compras superiores a 
                cierto monto, el envío puede ser gratuito. Te informaremos el costo específico al 
                confirmar tu pedido.
              </p>
              
              <h2>Cambios y Devoluciones</h2>
              
              <h3>¿Puedo cambiar mi compra si no me queda bien?</h3>
              <p>
                Sí, aceptamos cambios por talle o color dentro de los 15 días posteriores a la recepción 
                del producto, siempre y cuando esté en perfecto estado, con etiquetas y el embalaje original.
              </p>
              
              <h3>¿Qué hago si recibo un producto dañado?</h3>
              <p>
                Por favor contáctanos inmediatamente a través de WhatsApp o email con fotos del producto. 
                Gestionaremos un cambio o devolución según corresponda.
              </p>
            </div>
          )
        };
        
      case 'politicas-envio':
        return {
          title: 'Políticas de Envío',
          content: (
            <div className="prose max-w-none">
              <h2>Información General de Envíos</h2>
              <p>
                Todos nuestros envíos se realizan a través de empresas de logística confiables para 
                asegurar que tu pedido llegue en perfecto estado y en el menor tiempo posible.
              </p>
              
              <h2>Tiempos de Entrega</h2>
              <p>
                Los tiempos estimados de entrega son:
              </p>
              <ul>
                <li>Ciudad Principal y alrededores: 24-48 horas hábiles</li>
                <li>Otras localidades: 3-5 días hábiles</li>
                <li>Provincias lejanas: 5-7 días hábiles</li>
              </ul>
              <p>
                Ten en cuenta que estos tiempos pueden variar por factores externos como clima, 
                días festivos o situaciones especiales.
              </p>
              
              <h2>Costos de Envío</h2>
              <p>
                El costo de envío se calcula en función del destino y del peso/volumen del paquete. 
                En el proceso de compra, antes de confirmar tu pedido, te mostraremos el costo exacto 
                de envío para tu ubicación.
              </p>
              <p>
                Para pedidos superiores a $50,000, el envío es GRATUITO a todo el país.
              </p>
              
              <h2>Seguimiento de Envíos</h2>
              <p>
                Una vez que tu pedido haya sido enviado, recibirás por WhatsApp o email el número 
                de seguimiento para que puedas monitorear el estado de entrega en tiempo real.
              </p>
              
              <h2>Recepción del Pedido</h2>
              <p>
                Al recibir tu pedido, te recomendamos revisar el estado del paquete antes de firmar 
                la conformidad. Si notas algún daño en el embalaje, detállalo en el documento de 
                entrega o rechaza el paquete y contáctanos inmediatamente.
              </p>
              
              <h2>Problemas con la Entrega</h2>
              <p>
                Si experimentas cualquier problema con la entrega de tu pedido, por favor contáctanos 
                inmediatamente y haremos todo lo posible para resolverlo lo antes posible.
              </p>
            </div>
          )
        };
        
      case 'cambios-devoluciones':
        return {
          title: 'Cambios y Devoluciones',
          content: (
            <div className="prose max-w-none">
              <h2>Política de Cambios</h2>
              <p>
                Entendemos que a veces el producto seleccionado puede no ser exactamente lo que buscabas. 
                Por eso, ofrecemos las siguientes opciones de cambio:
              </p>
              <ul>
                <li>Cambio por talla o color: disponible dentro de los 15 días posteriores a la recepción.</li>
                <li>El producto debe estar sin uso, con etiquetas originales y embalaje.</li>
                <li>El cliente cubre los gastos de envío para el cambio, salvo que haya sido un error nuestro.</li>
              </ul>
              
              <h2>Política de Devoluciones</h2>
              <p>
                Si no estás satisfecho con tu compra, puedes solicitar una devolución:
              </p>
              <ul>
                <li>Tienes 10 días desde la recepción para iniciar el proceso de devolución.</li>
                <li>El producto debe estar sin uso, con etiquetas originales y embalaje.</li>
                <li>Una vez recibido y verificado el producto, procesaremos el reembolso en la misma forma de pago original.</li>
              </ul>
              
              <h2>Productos con Fallas</h2>
              <p>
                Si recibes un producto con defectos de fabricación o dañado en el transporte:
              </p>
              <ul>
                <li>Notifícanos dentro de las 48 horas de recibido el producto.</li>
                <li>Envíanos fotos claras del problema a nuestro WhatsApp o email.</li>
                <li>Nos haremos cargo de los gastos de envío para el cambio.</li>
              </ul>
              
              <h2>Cómo Solicitar un Cambio o Devolución</h2>
              <ol>
                <li>Contáctanos por WhatsApp o email indicando tu número de pedido y el motivo del cambio/devolución.</li>
                <li>Nuestro equipo te guiará sobre cómo proceder y te proporcionará una dirección de envío si es necesario.</li>
                <li>Una vez recibido el producto, verificaremos su estado y procesaremos tu solicitud.</li>
              </ol>
              
              <h2>Excepciones</h2>
              <p>
                No aceptamos cambios o devoluciones en los siguientes casos:
              </p>
              <ul>
                <li>Productos con signos de uso o desgaste.</li>
                <li>Ropa interior, trajes de baño o artículos de higiene personal (por razones sanitarias).</li>
                <li>Productos personalizados o hechos a medida.</li>
                <li>Productos en oferta o liquidación (salvo defectos de fabricación).</li>
              </ul>
            </div>
          )
        };
        
      case 'guia-talles':
        return {
          title: 'Guía de Talles',
          content: (
            <div className="prose max-w-none">
              <p className="lead">
                Para ayudarte a encontrar tu talla perfecta, te dejamos esta guía de referencia.
                Recuerda que estas medidas son aproximadas y pueden variar según el diseño y material.
              </p>
              
              <h2>Cómo Tomarte las Medidas</h2>
              <p>
                Para obtener las medidas más precisas, te recomendamos usar una cinta métrica flexible:
              </p>
              <ul>
                <li><strong>Pecho/Busto:</strong> Mide alrededor de la parte más ancha de tu pecho/busto, manteniendo la cinta métrica horizontal.</li>
                <li><strong>Cintura:</strong> Mide alrededor de la parte más estrecha de tu cintura, generalmente a la altura del ombligo.</li>
                <li><strong>Caderas:</strong> Mide alrededor de la parte más ancha de tus caderas.</li>
              </ul>
              
              <h2>Tabla de Talles - Ropa de Mujer</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th>Talla</th>
                      <th>Busto (cm)</th>
                      <th>Cintura (cm)</th>
                      <th>Cadera (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>XS</td>
                      <td>82-86</td>
                      <td>62-66</td>
                      <td>88-92</td>
                    </tr>
                    <tr>
                      <td>S</td>
                      <td>86-90</td>
                      <td>66-70</td>
                      <td>92-96</td>
                    </tr>
                    <tr>
                      <td>M</td>
                      <td>90-94</td>
                      <td>70-74</td>
                      <td>96-100</td>
                    </tr>
                    <tr>
                      <td>L</td>
                      <td>94-100</td>
                      <td>74-80</td>
                      <td>100-106</td>
                    </tr>
                    <tr>
                      <td>XL</td>
                      <td>100-108</td>
                      <td>80-88</td>
                      <td>106-114</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h2>Tabla de Talles - Ropa de Hombre</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th>Talla</th>
                      <th>Pecho (cm)</th>
                      <th>Cintura (cm)</th>
                      <th>Cadera (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>S</td>
                      <td>88-94</td>
                      <td>76-82</td>
                      <td>90-96</td>
                    </tr>
                    <tr>
                      <td>M</td>
                      <td>94-100</td>
                      <td>82-88</td>
                      <td>96-102</td>
                    </tr>
                    <tr>
                      <td>L</td>
                      <td>100-106</td>
                      <td>88-94</td>
                      <td>102-108</td>
                    </tr>
                    <tr>
                      <td>XL</td>
                      <td>106-112</td>
                      <td>94-100</td>
                      <td>108-114</td>
                    </tr>
                    <tr>
                      <td>XXL</td>
                      <td>112-118</td>
                      <td>100-106</td>
                      <td>114-120</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h2>Conversión de Talles de Pantalones</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th>Talle ARG/EUR</th>
                      <th>Talle US</th>
                      <th>Cintura (cm)</th>
                      <th>Cintura (pulg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>38</td>
                      <td>28</td>
                      <td>72-74</td>
                      <td>28-29</td>
                    </tr>
                    <tr>
                      <td>40</td>
                      <td>30</td>
                      <td>76-78</td>
                      <td>30</td>
                    </tr>
                    <tr>
                      <td>42</td>
                      <td>32</td>
                      <td>80-82</td>
                      <td>32</td>
                    </tr>
                    <tr>
                      <td>44</td>
                      <td>34</td>
                      <td>84-86</td>
                      <td>34</td>
                    </tr>
                    <tr>
                      <td>46</td>
                      <td>36</td>
                      <td>88-90</td>
                      <td>36</td>
                    </tr>
                    <tr>
                      <td>48</td>
                      <td>38</td>
                      <td>92-94</td>
                      <td>38</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h2>¿Dudas sobre tu talla?</h2>
              <p>
                Si aún tienes dudas sobre qué talla elegir, no dudes en contactarnos por WhatsApp. 
                Estaremos encantados de ayudarte a encontrar tu talla perfecta.
              </p>
            </div>
          )
        };
        
      default:
        return {
          title: 'Página no encontrada',
          content: (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
              </p>
              <a href="/" className="text-black hover:underline font-medium">
                Volver al Inicio
              </a>
            </div>
          )
        };
    }
  };

  const pageData = getPageContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{pageData.title}</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          {pageData.content}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
