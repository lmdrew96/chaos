// scripts/seed-content-questions-es.ts
// ChaosLengua — per-content comprehension questions for ser/estar,
// preterite/imperfect, and object pronoun content_items.
//
// 2 multiple-choice questions per content item (38 items × 2 = 76 questions),
// in Spanish, testing factual recall + light inference. These run in the
// content player after a learner finishes a passage; correct/incorrect
// answers feed the Error Garden via grammar feature joins on the parent
// content item.
//
// PREREQUISITE: All content_items must already be seeded (run the three
// seed-*-content-es scripts first).
//
// Usage: npx tsx scripts/seed-content-questions-es.ts

import { db } from '@/lib/db';
import { contentItems, contentQuestions } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { eq } from 'drizzle-orm';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

type DraftQuestion = {
  contentTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  sortOrder: number;
};

const QUESTIONS: DraftQuestion[] = [
  // ───────────────────── ser/estar — core (12 items) ─────────────────────

  // Mi rutina diaria
  { contentTitle: 'Mi rutina diaria', question: '¿De dónde es Elena?', options: ['Monterrey', 'Guadalajara', 'Ciudad de México', 'Madrid'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Mi rutina diaria', question: '¿Cómo se siente Elena por las mañanas?', options: ['Cansada', 'Aburrida', 'Enojada', 'Confundida'], correctIndex: 0, sortOrder: 2 },

  // ¿Dónde estás?
  { contentTitle: '¿Dónde estás?', question: '¿Dónde está Marta cuando habla por teléfono?', options: ['En su casa', 'En la oficina', 'En un café', 'En una reunión'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: '¿Dónde estás?', question: '¿Sobre qué es el proyecto del otro hablante?', options: ['Sobre arquitectura sostenible', 'Sobre plantas', 'Sobre cafés', 'Sobre reuniones'], correctIndex: 0, sortOrder: 2 },

  // La familia de Ana
  { contentTitle: 'La familia de Ana', question: '¿Cuál es la profesión de los padres de Ana?', options: ['Profesores', 'Médicos', 'Arquitectos', 'Estudiantes'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La familia de Ana', question: '¿Dónde están los abuelos de Ana en verano?', options: ['En Buenos Aires', 'En Argentina', 'En Mar del Plata', 'En la casa de Ana'], correctIndex: 2, sortOrder: 2 },

  // Un mal día
  { contentTitle: 'Un mal día', question: '¿Por qué el médico dice que el narrador necesita vacaciones?', options: ['Porque tiene fiebre', 'Porque está agotado', 'Porque su esposa está preocupada', 'Porque no le gusta su trabajo'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Un mal día', question: '¿A dónde van a viajar?', options: ['A la montaña', 'Al mar', 'A otro país', 'Al campo'], correctIndex: 1, sortOrder: 2 },

  // La oficina nueva
  { contentTitle: 'La oficina nueva', question: '¿En qué piso está la oficina nueva?', options: ['Piso dos', 'Piso doce', 'Piso veinte', 'Piso cinco'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La oficina nueva', question: '¿Por qué hay un problema con el escritorio del narrador?', options: ['Porque es muy pequeño', 'Porque está al lado de la sala de reuniones y hay ruido', 'Porque está lejos de la ventana', 'Porque el café es malo'], correctIndex: 1, sortOrder: 2 },

  // El viaje de Carlos
  { contentTitle: 'El viaje de Carlos', question: '¿Qué hizo Carlos antes de viajar a Sudamérica?', options: ['Aprendió español', 'Ahorró durante años', 'Buscó un trabajo en Lima', 'Vivió con sus padres'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'El viaje de Carlos', question: '¿Por qué Carlos estaba muy cansado los primeros días en Cusco?', options: ['Por el viaje largo', 'Por la altura', 'Por la comida', 'Por las ruinas'], correctIndex: 1, sortOrder: 2 },

  // La hora del té
  { contentTitle: 'La hora del té', question: '¿De dónde es la tía?', options: ['De Madrid', 'De Inglaterra', 'De Italia', 'De Francia'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La hora del té', question: '¿Qué hora es en el texto?', options: ['Las tres de la tarde', 'Las cinco de la tarde', 'Las siete de la noche', 'Las nueve de la mañana'], correctIndex: 1, sortOrder: 2 },

  // La mesa de cristal
  { contentTitle: 'La mesa de cristal', question: '¿De qué materiales es la mesa?', options: ['Madera y metal', 'Cristal y madera', 'Cristal y plástico', 'Solo madera'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La mesa de cristal', question: '¿Por qué la madre está emocionada hoy?', options: ['Porque la mesa es nueva', 'Porque vienen visitas importantes', 'Porque viene su hija de Buenos Aires', 'Porque compró copas nuevas'], correctIndex: 2, sortOrder: 2 },

  // La puerta abierta
  { contentTitle: 'La puerta abierta', question: '¿Dónde está realmente el compañero del narrador?', options: ['En su casa', 'De vacaciones', 'En una reunión en el piso cinco', 'Enfermo'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: 'La puerta abierta', question: '¿Por qué le parece extraño al narrador?', options: ['Porque la puerta está cerrada', 'Porque su compañero siempre está a las nueve', 'Porque hay luces apagadas', 'Porque no hay nadie en el edificio'], correctIndex: 1, sortOrder: 2 },

  // En el parque
  { contentTitle: 'En el parque', question: '¿Por qué el hijo mayor está cansado?', options: ['Porque es pequeño', 'Porque jugó al fútbol toda la mañana', 'Porque tiene hambre', 'Porque hace calor'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'En el parque', question: '¿De dónde es la manzana que come el hijo?', options: ['Del supermercado', 'De la huerta de su abuela', 'Del parque', 'De su casa'], correctIndex: 1, sortOrder: 2 },

  // Mi mejor amiga
  { contentTitle: 'Mi mejor amiga', question: '¿De dónde es Lucía?', options: ['De Lima, Perú', 'De Chile', 'De Argentina', 'De Colombia'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Mi mejor amiga', question: '¿Por qué Lucía está triste esta semana?', options: ['Porque cambió de trabajo', 'Porque su abuela está enferma', 'Porque vive lejos de su familia', 'Porque tiene mucho trabajo'], correctIndex: 1, sortOrder: 2 },

  // La cena de Navidad
  { contentTitle: 'La cena de Navidad', question: '¿Qué hora es cuando empieza la cena?', options: ['Las siete de la noche', 'Las ocho de la noche', 'Las nueve de la noche', 'La medianoche'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: 'La cena de Navidad', question: '¿Cómo describe la familia del padre?', options: ['Rica', 'De un pueblo pequeño', 'De la ciudad', 'Internacional'], correctIndex: 1, sortOrder: 2 },

  // ───────────────────── ser/estar — contrast (8 items) ─────────────────────

  // ¡Qué aburrido!
  { contentTitle: '¡Qué aburrido!', question: '¿Sobre qué fue la película que vieron?', options: ['Sobre la Revolución Francesa', 'Sobre la Revolución Mexicana', 'Sobre una historia de amor', 'Sobre el cine moderno'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: '¡Qué aburrido!', question: '¿Por qué el narrador dice que el problema es Javier, no la película?', options: ['Porque Javier no entiende español', 'Porque cuando una persona es aburrida, todo le parece aburrido', 'Porque Javier no le gusta el cine', 'Porque Javier es joven'], correctIndex: 1, sortOrder: 2 },

  // Listo para todo
  { contentTitle: 'Listo para todo', question: '¿Por qué el tío Pablo siempre llega tarde?', options: ['Porque vive lejos', 'Porque nunca está listo a tiempo', 'Porque no tiene auto', 'Porque trabaja mucho'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Listo para todo', question: 'Según el texto, ¿cuál es la diferencia entre "ser listo" y "estar listo"?', options: ['Son sinónimos', 'Ser listo es ser inteligente; estar listo es estar preparado', 'Ser listo es estar preparado; estar listo es ser inteligente', 'Solo se usa con personas'], correctIndex: 1, sortOrder: 2 },

  // Las uvas están verdes
  { contentTitle: 'Las uvas están verdes', question: '¿Por qué Don Pedro no estaba en el jardín un día?', options: ['Porque viajó', 'Porque estaba enfermo con gripe', 'Porque ya no le gustaban las uvas', 'Porque era invierno'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Las uvas están verdes', question: 'Al final de la historia, ¿cómo estaban las uvas?', options: ['Todavía verdes', 'Estropeadas', 'Dulces y perfectas', 'No las pudieron comer'], correctIndex: 2, sortOrder: 2 },

  // En el restaurante
  { contentTitle: 'En el restaurante', question: '¿Por qué hoy el restaurante está lleno?', options: ['Porque es famoso', 'Porque hay una boda', 'Porque es viernes', 'Porque la comida es buena'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'En el restaurante', question: 'Según el padre, ¿cuál es la diferencia entre "eres aburrido" y "estoy aburrido"?', options: ['Son lo mismo', 'Ser aburrido es un trato, estar aburrido es un estado momentáneo', 'Solo se dicen en bodas', 'Es una cuestión de edad'], correctIndex: 1, sortOrder: 2 },

  // La carta de mi abuelo
  { contentTitle: 'La carta de mi abuelo', question: '¿De dónde es originalmente el abuelo?', options: ['De Buenos Aires', 'De un pueblo en Galicia', 'De Madrid', 'De América Latina'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La carta de mi abuelo', question: 'Según el narrador, ¿qué significa que su abuelo "es muy vivo"?', options: ['Que está vivo, no muerto', 'Que tiene mucha energía y curiosidad', 'Que es joven', 'Que no está enfermo'], correctIndex: 1, sortOrder: 2 },

  // La nueva profesora
  { contentTitle: 'La nueva profesora', question: '¿De dónde es la nueva profesora?', options: ['De España', 'De México', 'De Colombia', 'De Argentina'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: 'La nueva profesora', question: 'Según el hermano, ¿por qué el otro profesor parecía aburrido?', options: ['Porque no le gustaba la materia', 'Porque estaba aburrido de enseñar después de cuarenta años', 'Porque era una persona aburrida', 'Porque sus estudiantes lo aburrían'], correctIndex: 1, sortOrder: 2 },

  // El concierto
  { contentTitle: 'El concierto', question: '¿A qué hora es el concierto?', options: ['A las siete', 'A las ocho', 'A las nueve', 'A las diez'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: 'El concierto', question: '¿Qué tipo de música es?', options: ['Rock', 'Jazz', 'Música clásica', 'Pop'], correctIndex: 1, sortOrder: 2 },

  // El bus tarde
  { contentTitle: 'El bus tarde', question: '¿Por qué llega tarde el chofer del bus?', options: ['Porque está enfermo', 'Porque había mucho tráfico', 'Porque se levantó tarde', 'Porque cambió de ruta'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'El bus tarde', question: '¿Cuántos años tiene Tomás?', options: ['Cinco', 'Siete', 'Ocho', 'Diez'], correctIndex: 2, sortOrder: 2 },

  // ───────────────────── preterite/imperfect (9 items) ─────────────────────

  // Cuando era niño
  { contentTitle: 'Cuando era niño', question: '¿Qué encontró el narrador en la playa?', options: ['Un pez', 'Una caracola enorme', 'Un cangrejo', 'Una botella'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Cuando era niño', question: '¿Cómo era el perro Lito?', options: ['Grande y serio', 'Pequeño y alegre', 'Viejo y cansado', 'Joven y agresivo'], correctIndex: 1, sortOrder: 2 },

  // El día que conocí a mi esposa
  { contentTitle: 'El día que conocí a mi esposa', question: '¿Cómo era el clima ese día?', options: ['Hacía sol', 'Llovía mucho', 'Nevaba', 'Hacía frío pero estaba seco'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'El día que conocí a mi esposa', question: '¿Cuál era la profesión de Carmen?', options: ['Profesora', 'Doctora', 'Arquitecta', 'Estudiante'], correctIndex: 2, sortOrder: 2 },

  // Una tarde en el parque
  { contentTitle: 'Una tarde en el parque', question: '¿Qué quería hacer el narrador en el parque?', options: ['Correr', 'Escribir', 'Comer un helado', 'Ver a sus amigos'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Una tarde en el parque', question: '¿Qué hizo el perro al final?', options: ['Atacó al narrador', 'Se fue corriendo', 'Puso la cabeza en su rodilla', 'Ladró mucho'], correctIndex: 2, sortOrder: 2 },

  // Mi abuela cocinaba
  { contentTitle: 'Mi abuela cocinaba', question: '¿A qué hora se levantaba la abuela los domingos?', options: ['A las cinco', 'A las seis', 'A las siete', 'A las ocho'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Mi abuela cocinaba', question: '¿Cuántos años tenía la narradora cuando ayudó a su abuela por primera vez?', options: ['Seis', 'Siete', 'Ocho', 'Diez'], correctIndex: 2, sortOrder: 2 },

  // La historia del accidente
  { contentTitle: 'La historia del accidente', question: '¿Quién llamó por teléfono?', options: ['La hermana', 'Un policía', 'La madre', 'El hermano'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La historia del accidente', question: '¿Qué tenía la madre cuando llegaron al hospital?', options: ['Un brazo roto y moretones, pero no era grave', 'Heridas muy graves', 'Estaba inconsciente', 'No tenía heridas'], correctIndex: 0, sortOrder: 2 },

  // Mi cumpleaños número dieciocho
  { contentTitle: 'Mi cumpleaños número dieciocho', question: '¿Quién llamó al narrador por la tarde?', options: ['Su madre', 'Su mejor amigo', 'Su hermana mayor desde Madrid', 'Su novia'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: 'Mi cumpleaños número dieciocho', question: 'Según la hermana, ¿cómo se aprende a ser adulto?', options: ['En la universidad', 'En un día específico', 'Durante muchos años, no en un día', 'Cuando uno se casa'], correctIndex: 2, sortOrder: 2 },

  // Ya lo sabía
  { contentTitle: 'Ya lo sabía', question: '¿Quién llamó al narrador a las ocho de la noche?', options: ['Su mejor amiga Laura', 'Su hermana', 'Su madre', 'Su novio'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Ya lo sabía', question: 'Según el narrador, ¿cuál es la diferencia entre "saber" (imperfecto) y "saber" (pretérito)?', options: ['No hay diferencia', 'Una cosa es tener una sospecha; otra es tener una confirmación', 'El imperfecto es para el pasado lejano', 'El pretérito es solo para hechos importantes'], correctIndex: 1, sortOrder: 2 },

  // Conocer y conocer
  { contentTitle: 'Conocer y conocer', question: 'Antes de viajar a Sevilla, ¿qué conocía el narrador de España?', options: ['Solo el idioma', 'La literatura y la historia', 'A varios amigos españoles', 'Madrid y Barcelona'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Conocer y conocer', question: '¿Qué descubrió el narrador en la fiesta de Sevilla?', options: ['Una nueva canción', 'La alegría de la gente cuando canta junta', 'Cómo bailar flamenco', 'Una receta tradicional'], correctIndex: 1, sortOrder: 2 },

  // No pude hacerlo
  { contentTitle: 'No pude hacerlo', question: '¿Por qué no pudo correr la maratón la primera vez?', options: ['No estaba en forma', 'Se enfermó el día de la carrera', 'Se perdió en el camino', 'No tenía el equipo correcto'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'No pude hacerlo', question: '¿Cuánto tiempo tardó en terminar la maratón la segunda vez?', options: ['Dos horas y media', 'Tres horas y diez minutos', 'Cuatro horas', 'No la terminó'], correctIndex: 1, sortOrder: 2 },

  // ───────────────────── object pronouns (9 items) ─────────────────────

  // Las llaves perdidas
  { contentTitle: 'Las llaves perdidas', question: '¿Quién pierde las llaves frecuentemente?', options: ['El narrador', 'Laura, la hermana', 'La madre', 'Nadie'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Las llaves perdidas', question: 'En esta historia, ¿dónde estaban las llaves al final?', options: ['Debajo de la cama', 'En la cocina', 'Sobre la mesa del comedor', 'En el bolso'], correctIndex: 2, sortOrder: 2 },

  // Mi mejor amigo Pablo
  { contentTitle: 'Mi mejor amigo Pablo', question: '¿Desde cuándo conoce el narrador a Pablo?', options: ['Desde el año pasado', 'Desde la universidad', 'Desde la escuela primaria', 'Desde su trabajo'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: 'Mi mejor amigo Pablo', question: '¿Cómo es Marina, la novia de Pablo?', options: ['Antipática', 'Tímida', 'Muy simpática', 'Aburrida'], correctIndex: 2, sortOrder: 2 },

  // La frase de mi abuelo
  { contentTitle: 'La frase de mi abuelo', question: '¿Qué decía siempre el abuelo del narrador?', options: ['Que la vida es fácil', 'Que la vida es complicada, pero hay que aceptarla como es', 'Que solo importa la familia', 'Que el trabajo es lo más importante'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La frase de mi abuelo', question: '¿Qué hizo el narrador cuando su jefe lo criticó injustamente?', options: ['Renunció a su trabajo', 'Le gritó al jefe', 'No respondió, lo pensó bien, y después le explicó con calma', 'Se quejó con sus compañeros'], correctIndex: 2, sortOrder: 2 },

  // Las mañanas con mi madre
  { contentTitle: 'Las mañanas con mi madre', question: '¿Qué hace la madre todos los días por la mañana?', options: ['Le visita al narrador', 'Le habla por teléfono', 'Le envía mensajes', 'Le prepara el desayuno'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'Las mañanas con mi madre', question: '¿Por qué la madre le da menos queso al narrador?', options: ['Porque no hay suficiente queso', 'Porque sabe que prefiere el picante', 'Porque al narrador no le gusta el queso', 'Porque Samuel come mucho'], correctIndex: 1, sortOrder: 2 },

  // El cumpleaños de Cristina
  { contentTitle: 'El cumpleaños de Cristina', question: '¿Qué le compraron a Cristina?', options: ['Una torta', 'Un libro de arte', 'Flores', 'Un vino'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'El cumpleaños de Cristina', question: '¿Quién trajo la torta?', options: ['El jefe', 'María', 'El narrador', 'Cristina misma'], correctIndex: 1, sortOrder: 2 },

  // Lo que nos gusta
  { contentTitle: 'Lo que nos gusta', question: '¿Qué le encanta a Fernando, el hermano del narrador?', options: ['La política', 'Los libros', 'Los deportes extremos', 'Cocinar'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: 'Lo que nos gusta', question: 'Según el narrador, ¿qué une a la familia?', options: ['Que tienen los mismos gustos', 'Que se respetan, aunque les gusten cosas diferentes', 'Que viven juntos', 'Que nadie discute'], correctIndex: 1, sortOrder: 2 },

  // La historia del pescador
  { contentTitle: 'La historia del pescador', question: '¿Qué encontró el pescador?', options: ['Un pez especial', 'Una botella con un mensaje', 'Un tesoro', 'Una red rota'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La historia del pescador', question: 'Según el padre, ¿sobre qué era el mensaje?', options: ['Sobre el amor', 'Sobre paciencia', 'Sobre el mar', 'Sobre la familia'], correctIndex: 1, sortOrder: 2 },

  // La regla del "se lo"
  { contentTitle: 'La regla del "se lo"', question: '¿Cómo es la tía Isabel?', options: ['Egoísta', 'Generosa', 'Tímida', 'Estricta'], correctIndex: 1, sortOrder: 1 },
  { contentTitle: 'La regla del "se lo"', question: '¿Cuándo cambia "le" a "se" en español?', options: ['Cuando hablamos en formal', 'Cuando "le" combina con "lo/la/los/las"', 'Cuando es plural', 'Cuando hay un nombre masculino'], correctIndex: 1, sortOrder: 2 },

  // El libro de Julieta
  { contentTitle: 'El libro de Julieta', question: '¿Cuándo le devolvió Julieta el libro al narrador?', options: ['Al día siguiente', 'A los dos días', 'Cuando el narrador fue a su casa', 'Nunca'], correctIndex: 2, sortOrder: 1 },
  { contentTitle: 'El libro de Julieta', question: '¿Qué descubrió el narrador sobre la amistad ese día?', options: ['Que Julieta no es su amiga', 'Que él y Julieta son diferentes en su puntualidad', 'Que no debe prestar libros', 'Que Julieta es desastrosa con todo'], correctIndex: 1, sortOrder: 2 },
];

async function seedContentQuestions() {
  console.log('📚 Seeding content comprehension questions...');
  console.log(`   ${QUESTIONS.length} questions across ${new Set(QUESTIONS.map(q => q.contentTitle)).size} content items\n`);

  // Build a title → id lookup so the seed is robust to UUID re-generation.
  const allItems = await db.select({ id: contentItems.id, title: contentItems.title }).from(contentItems);
  const titleToId = new Map(allItems.map(i => [i.title, i.id]));

  const missing = QUESTIONS.filter(q => !titleToId.has(q.contentTitle));
  if (missing.length > 0) {
    console.error(`❌ ${missing.length} questions reference content_items that don't exist:`);
    for (const m of missing) console.error(`   - "${m.contentTitle}"`);
    console.error('   Run the content seed scripts first.');
    process.exit(1);
  }

  // Skip questions whose content already has questions seeded (idempotency).
  const seededContentIds = new Set(
    (await db.selectDistinct({ contentId: contentQuestions.contentId }).from(contentQuestions)).map(r => r.contentId),
  );

  const rows = QUESTIONS
    .map(q => ({
      contentId: titleToId.get(q.contentTitle)!,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      sortOrder: q.sortOrder,
    }))
    .filter(r => !seededContentIds.has(r.contentId));

  if (rows.length === 0) {
    console.log('✅ All content already has questions seeded — nothing to do.');
    process.exit(0);
  }

  try {
    const inserted = await db.insert(contentQuestions).values(rows).returning();
    console.log(`✅ Seeded ${inserted.length} comprehension questions.`);
    if (inserted.length < QUESTIONS.length) {
      console.log(`   (${QUESTIONS.length - inserted.length} skipped — already had questions seeded.)`);
    }
  } catch (error) {
    console.error('❌ Failed to seed content questions:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedContentQuestions();
