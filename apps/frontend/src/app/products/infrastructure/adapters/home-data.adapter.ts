import type { FaqItem } from '../../domain/models/product.model';

export const FAQS: FaqItem[] = [
  {
    question: '¿Cuánto tarda el envío?',
    answer:
      'En Lima entregamos en 24 horas hábiles y a provincias en 48 a 72 horas. El envío es gratis en pedidos desde S/ 99.',
  },
  {
    question: '¿Puedo devolver un producto si a mi mascota no le gusta?',
    answer:
      'Sí. Tienes 15 días para cambios y devoluciones en productos sellados, y 7 días en alimento abierto si tu mascota lo rechaza.',
  },
  {
    question: '¿Cómo elijo la talla correcta de ropa o arnés?',
    answer:
      'Cada producto incluye una guía de medidas por peso y contorno. Si dudas entre dos tallas, escríbenos y te ayuda una persona real.',
  },
  {
    question: '¿El alimento es original y está vigente?',
    answer:
      'Trabajamos directo con las marcas y distribuidores autorizados. Todo llega sellado, con fecha de vencimiento mayor a 6 meses.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Tarjetas de crédito y débito, Yape, Plin y transferencia. El pago es 100% seguro y puedes pagar contra entrega en Lima.',
  },
  {
    question: '¿Tienen asesoría veterinaria?',
    answer:
      'Sí. Nuestro equipo incluye médicos veterinarios que te orientan gratis por chat sobre nutrición y cuidado básico.',
  },
];

export const TRUST_STATS = [
  { value: '+500', suffix: '', label: 'Productos en catálogo' },
  { value: '+40', suffix: '', label: 'Marcas aliadas' },
  { value: '24/48h', suffix: '', label: 'Envío a todo el país' },
  { value: '4.9', suffix: '★', label: 'Calificación promedio' },
] as const;
