import { Country, DialogueResultType, NPC, VocabularyItem, DialogueOption } from "../types";
import { resolveSprite } from "./spriteMapping";

/**
 * 6-Stage Journey Structure per Country:
 * 0: The Bar — Barkeeper (first NPC, food/drink, getting oriented)
 * 1: Transport — Bus/Taxi/Gondola (navigating to next area)
 * 2: The Market — Vendor/Street (buying supplies, local culture)
 * 3: Authority — Police/Border (identity check, papers)
 * 4: Airport — Check-in desk (navigating terminal)
 * 5: Boarding — Gate agent (final boarding, getting on plane)
 */

const buildNPC = (
  country: Country,
  id: string,
  name: string,
  role: string,
  introLocal: string,
  introEnglish: string,
  options: DialogueOption[]
): NPC => ({
  id,
  name,
  role,
  image: resolveSprite(country, role),
  introLocal,
  introEnglish,
  initialOptions: options,
});

// Helper for creating branching dialogue
const opt = (
  textLocal: string,
  textEnglish: string,
  type: DialogueResultType,
  feedback: string = "",
  followUp?: DialogueOption["followUp"]
): DialogueOption => ({
  textLocal,
  textEnglish,
  type,
  feedback,
  followUp,
});

// ============================================================
// SPAIN — 6 STAGES
// ============================================================
const SPAIN_NPCS: NPC[] = [
  // Stage 0: The Bar
  buildNPC(Country.SPAIN, 'es_1', 'Raul', 'Barkeep',
    '¡Hola! ¿Qué te pongo? Te ves perdido, gringo.',
    'Hi! What can I get you? You look lost, gringo.',
    [
      opt('Una cerveza, por favor.', 'A beer, please.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: '¡Buena elección! Aquí tienes. ¿Buscas el aeropuerto?',
        npcResponseEnglish: 'Good choice! Here you go. Looking for the airport?',
        options: [
          opt('Sí, ¿cómo llego?', 'Yes, how do I get there?', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Toma el autobús en la plaza. Cuesta dos euros. ¡Buena suerte!',
            npcResponseEnglish: 'Take the bus at the plaza. It costs two euros. Good luck!',
            options: [
              opt('Muchas gracias, adiós.', 'Thank you very much, goodbye.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('No, solo quiero beber.', 'No, I just want to drink.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Vale, pero no te quedes toda la noche aquí, gringo.',
            npcResponseEnglish: 'OK, but don\'t stay here all night, gringo.',
            options: [
              opt('Hasta luego.', 'See you later.', DialogueResultType.POSITIVE, ''),
              opt('Dame otra cerveza.', 'Give me another beer.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¿Dónde está el aeropuerto?', 'Where is the airport?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Está muy lejos de aquí. Necesitas transporte. ¿Quieres algo primero?',
        npcResponseEnglish: 'It\'s very far from here. You need transport. Want something first?',
        options: [
          opt('Un café solo, gracias.', 'A black coffee, thanks.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Aquí tienes. El autobús sale de la plaza cada hora.',
            npcResponseEnglish: 'Here you go. The bus leaves from the plaza every hour.',
            options: [
              opt('Gracias, adiós.', 'Thanks, goodbye.', DialogueResultType.POSITIVE, ''),
              opt('Vale, chao.', 'OK, bye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('No tengo dinero.', 'I don\'t have money.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Ay, pobre gringo. Toma un vaso de agua gratis. El autobús está en la plaza.',
            npcResponseEnglish: 'Oh, poor gringo. Take a free glass of water. The bus is at the plaza.',
            options: [
              opt('Muchas gracias.', 'Thank you very much.', DialogueResultType.POSITIVE, ''),
              opt('Agua... OK.', 'Water... OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¡Dáme dinero!', 'Give me money!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: '¡¿Qué?! ¿Estás loco? ¡Fuera de mi bar! ¡Policía!',
        npcResponseEnglish: 'What?! Are you crazy? Get out of my bar! Police!',
        options: [
          opt('Lo siento, lo siento...', 'I\'m sorry, I\'m sorry...', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Hmm. Vale, siéntate y cálmate. ¿Quieres agua?',
            npcResponseEnglish: 'Hmm. OK, sit down and calm down. Want water?',
            options: [
              opt('Sí, por favor.', 'Yes, please.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¡No me molestes!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', {
            npcResponseLocal: '¡FUERA! ¡Y no vuelvas, gringo loco!',
            npcResponseEnglish: 'OUT! And don\'t come back, crazy gringo!',
            options: [
              opt('Lo siento.', 'I\'m sorry.', DialogueResultType.POSITIVE, ''),
              opt('Bye.', 'Bye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('Soy Steve de Idaho.', 'I\'m Steve from Idaho.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: '¡Idaho! ¿Eso es en México? Ja ja. ¿Quieres un café?',
        npcResponseEnglish: 'Idaho! Is that in Mexico? Ha ha. Want a coffee?',
        options: [
          opt('Sí, un café, por favor.', 'Yes, a coffee, please.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Aquí tienes, amigo. El autobús a la ciudad sale de la plaza.',
            npcResponseEnglish: 'Here you go, friend. The bus to the city leaves from the plaza.',
            options: [
              opt('Gracias, Raul.', 'Thanks, Raul.', DialogueResultType.POSITIVE, ''),
              opt('Chao.', 'Bye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('No, ¿dónde está la plaza?', 'No, where is the plaza?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Sal por la puerta y gira a la izquierda. Está a 100 metros.',
            npcResponseEnglish: 'Go out the door and turn left. It\'s 100 meters away.',
            options: [
              opt('Muchas gracias.', 'Thank you very much.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
    ]
  ),
  // Stage 1: Transport
  buildNPC(Country.SPAIN, 'es_2', 'Jorge', 'Bus Driver',
    '¡Rápido! El autobús no espera a nadie. ¿A dónde vas?',
    'Quick! The bus waits for no one. Where are you going?',
    [
      opt('Al aeropuerto, por favor.', 'To the airport, please.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Son cinco euros. ¿Tienes billete o pagas aquí?',
        npcResponseEnglish: 'It\'s five euros. Do you have a ticket or paying here?',
        options: [
          opt('Pago aquí, gracias.', 'I\'ll pay here, thanks.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Perfecto. Siéntate y agárrate. ¡Próxima parada, centro!',
            npcResponseEnglish: 'Perfect. Sit down and hold on. Next stop, city center!',
            options: [
              opt('Gracias, conductor.', 'Thanks, driver.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¿Puedo pagar con dólares?', 'Can I pay with dollars?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: '¡Dólares! Esto es España, amigo. Solo euros. Pero sube, te llevaré.',
            npcResponseEnglish: 'Dollars! This is Spain, friend. Only euros. But get on, I\'ll take you.',
            options: [
              opt('Gracias, eres amable.', 'Thanks, you\'re kind.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¿A dónde va este autobús?', 'Where does this bus go?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Este va al centro de la ciudad. De ahí puedes tomar un tren al aeropuerto.',
        npcResponseEnglish: 'This one goes to the city center. From there you can take a train to the airport.',
        options: [
          opt('Perfecto, subo.', 'Perfect, I\'m getting on.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¡Muy bien! Siéntate atrás. El viaje dura 20 minutos.',
            npcResponseEnglish: 'Very good! Sit in the back. The trip takes 20 minutes.',
            options: [
              opt('Gracias.', 'Thanks.', DialogueResultType.POSITIVE, ''),
              opt('Vale.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¿Cuánto cuesta?', 'How much does it cost?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Cinco euros. ¿Subes o no? ¡No tengo todo el día!',
            npcResponseEnglish: 'Five euros. Are you getting on or not? I don\'t have all day!',
            options: [
              opt('Sí, sí, subo.', 'Yes, yes, I\'m getting on.', DialogueResultType.POSITIVE, ''),
              opt('OK, OK.', 'OK, OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¡Eres muy lento!', 'You\'re very slow!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: '¡¿Lento?! ¡Yo conduzco este autobús desde hace 20 años! ¡Baja ahora mismo!',
        npcResponseEnglish: 'Slow?! I\'ve been driving this bus for 20 years! Get off right now!',
        options: [
          opt('Perdón, perdón, no quise...', 'Sorry, sorry, I didn\'t mean...', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Hmm. Siéntate y cállate. Próxima parada en 10 minutos.',
            npcResponseEnglish: 'Hmm. Sit down and shut up. Next stop in 10 minutes.',
            options: [
              opt('Gracias.', 'Thanks.', DialogueResultType.POSITIVE, ''),
              opt('...', '...', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¡Tu autobús es horrible!', 'Your bus is terrible!', DialogueResultType.OFFENSIVE, '', {
            npcResponseLocal: '¡FUERA DEL AUTOBÚS! ¡Camina, gringo!',
            npcResponseEnglish: 'OFF THE BUS! Walk, gringo!',
            options: [
              opt('Lo siento...', 'I\'m sorry...', DialogueResultType.POSITIVE, ''),
              opt('OK...', 'OK...', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('Hola, me llamo Steve.', 'Hello, my name is Steve.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Hola Steve. Soy Jorge. ¿Americano? El aeropuerto está al norte. ¿Subes?',
        npcResponseEnglish: 'Hello Steve. I\'m Jorge. American? The airport is to the north. Getting on?',
        options: [
          opt('Sí, por favor, Jorge.', 'Yes, please, Jorge.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¡Vamos! Agárrate, amigo. Conduzco rápido.',
            npcResponseEnglish: 'Let\'s go! Hold on, friend. I drive fast.',
            options: [
              opt('¡Vamos!', 'Let\'s go!', DialogueResultType.POSITIVE, ''),
              opt('Vale...', 'OK...', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¿Cuánto tiempo al aeropuerto?', 'How long to the airport?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Primero al centro, luego tren al aeropuerto. Total, una hora.',
            npcResponseEnglish: 'First to the center, then train to airport. Total, one hour.',
            options: [
              opt('Perfecto, gracias.', 'Perfect, thanks.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
    ]
  ),
  // Stage 2: The Market
  buildNPC(Country.SPAIN, 'es_3', 'Sofia', 'Churros Vendor',
    '¡Churros calientes! Recién hechos. ¿Quieres comprar?',
    'Hot churros! Freshly made. Do you want to buy some?',
    [
      opt('¡Sí! Churros, por favor.', 'Yes! Churros, please.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Aquí tienes, dos euros. ¿Con chocolate o sin chocolate?',
        npcResponseEnglish: 'Here you go, two euros. With chocolate or without?',
        options: [
          opt('Con chocolate, por favor.', 'With chocolate, please.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¡Muy bien! Están deliciosos. ¿Buscas la estación de tren?',
            npcResponseEnglish: 'Very good! They\'re delicious. Looking for the train station?',
            options: [
              opt('Sí, ¿dónde está?', 'Yes, where is it?', DialogueResultType.POSITIVE, ''),
              opt('Gracias, adiós.', 'Thanks, goodbye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('Sin chocolate.', 'Without chocolate.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Vale, aquí tienes. La estación de tren está dos calles más abajo.',
            npcResponseEnglish: 'OK, here you go. The train station is two streets down.',
            options: [
              opt('Muchas gracias.', 'Thank you very much.', DialogueResultType.POSITIVE, ''),
              opt('OK, gracias.', 'OK, thanks.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¿Cuánto cuestan?', 'How much do they cost?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Dos euros la bolsa. ¡Son los mejores de toda España!',
        npcResponseEnglish: 'Two euros a bag. They\'re the best in all of Spain!',
        options: [
          opt('Vale, una bolsa por favor.', 'OK, one bag please.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¡Buen provecho! Por cierto, ¿vas a la estación? Está por ahí.',
            npcResponseEnglish: 'Enjoy! By the way, going to the station? It\'s that way.',
            options: [
              opt('Sí, gracias por la ayuda.', 'Yes, thanks for the help.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('Es muy caro.', 'That\'s too expensive.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: '¿Caro? ¡En Idaho seguro que no hay churros! Te los dejo en 1 euro.',
            npcResponseEnglish: 'Expensive? I bet there are no churros in Idaho! I\'ll give you them for 1 euro.',
            options: [
              opt('¡Trato hecho!', 'Deal!', DialogueResultType.POSITIVE, ''),
              opt('No gracias.', 'No thanks.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¡No hablo español!', 'I don\'t speak Spanish!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: '¡Pues estás en España! ¡Aprende rápido! ¿Churros sí o no?',
        npcResponseEnglish: 'Well, you\'re in Spain! Learn quickly! Churros yes or no?',
        options: [
          opt('Sí... por favor.', 'Yes... please.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Así me gusta. Aquí tienes. La estación está por allá.',
            npcResponseEnglish: 'That\'s what I like. Here you go. The station is over there.',
            options: [
              opt('Gracias.', 'Thanks.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('No, adiós.', 'No, goodbye.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: '¡Tu pérdida! Los mejores churros del país.',
            npcResponseEnglish: 'Your loss! The best churros in the country.',
            options: [
              opt('Quizás otro día.', 'Maybe another day.', DialogueResultType.NEUTRAL, ''),
              opt('Chao.', 'Bye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('Hola, soy Steve.', 'Hi, I\'m Steve.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: '¡Hola Steve! Soy Sofía. ¿Americano perdido? Toma unos churros gratis.',
        npcResponseEnglish: 'Hello Steve! I\'m Sofia. A lost American? Have some free churros.',
        options: [
          opt('¡Muchas gracias, Sofía!', 'Thank you very much, Sofia!', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¡De nada! La estación de tren está al final de esta calle. ¡Suerte!',
            npcResponseEnglish: 'You\'re welcome! The train station is at the end of this street. Good luck!',
            options: [
              opt('Eres muy amable, adiós.', 'You\'re very kind, goodbye.', DialogueResultType.POSITIVE, ''),
              opt('Gracias, chao.', 'Thanks, bye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¿Dónde está la estación?', 'Where is the station?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Al final de esta calle. ¡Come los churros por el camino!',
            npcResponseEnglish: 'At the end of this street. Eat the churros on the way!',
            options: [
              opt('Perfecto, gracias.', 'Perfect, thanks.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
    ]
  ),
  // Stage 3: Checkpoint
  buildNPC(Country.SPAIN, 'es_4', 'Javier', 'Local Cop',
    'Buenas tardes. Sus papeles. ¿Tiene pasaporte?',
    'Good afternoon. Your papers. Do you have a passport?',
    [
      opt('Sí, aquí tiene mi pasaporte.', 'Yes, here is my passport.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Steve... de Idaho, Estados Unidos. Todo en orden. ¿Va al aeropuerto?',
        npcResponseEnglish: 'Steve... from Idaho, United States. Everything is in order. Going to the airport?',
        options: [
          opt('Sí, señor. Quiero ir a casa.', 'Yes, sir. I want to go home.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'El tren al aeropuerto sale del andén tres. Buen viaje.',
            npcResponseEnglish: 'The train to the airport leaves from platform three. Have a good trip.',
            options: [
              opt('Muchas gracias, oficial.', 'Thank you very much, officer.', DialogueResultType.POSITIVE, ''),
              opt('Gracias.', 'Thanks.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('Solo estoy de paso.', 'I\'m just passing through.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'De acuerdo. No se meta en problemas, gringo. Circular.',
            npcResponseEnglish: 'Alright. Don\'t get into trouble, gringo. Move along.',
            options: [
              opt('Sí, señor. Adiós.', 'Yes, sir. Goodbye.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('No tengo pasaporte.', 'I don\'t have a passport.', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: '¿Sin pasaporte? Eso es un problema. ¿Tiene algún documento de identidad?',
        npcResponseEnglish: 'No passport? That\'s a problem. Do you have any identification?',
        options: [
          opt('Tengo mi carnet de conducir.', 'I have my driver\'s license.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Hmm, no es ideal pero servirá. Vaya directamente al aeropuerto y hable con el consulado.',
            npcResponseEnglish: 'Hmm, not ideal but it will do. Go directly to the airport and talk to the consulate.',
            options: [
              opt('Gracias, oficial.', 'Thanks, officer.', DialogueResultType.POSITIVE, ''),
              opt('De acuerdo.', 'Alright.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('No tengo nada...', 'I have nothing...', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Ay, gringo. Vaya al consulado americano en el aeropuerto. Ellos le ayudarán.',
            npcResponseEnglish: 'Oh, gringo. Go to the American consulate at the airport. They\'ll help you.',
            options: [
              opt('Muchas gracias.', 'Thank you very much.', DialogueResultType.POSITIVE, ''),
              opt('OK, gracias.', 'OK, thanks.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¡No me molestes!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: '¡¿Perdona?! Identificación. AHORA. O le detengo aquí mismo.',
        npcResponseEnglish: 'Excuse me?! Identification. NOW. Or I arrest you right here.',
        options: [
          opt('¡Lo siento, lo siento! Aquí está.', 'I\'m sorry, I\'m sorry! Here it is.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Así mejor. Todo en orden. Vaya al aeropuerto y no vuelva.',
            npcResponseEnglish: 'That\'s better. Everything is in order. Go to the airport and don\'t come back.',
            options: [
              opt('Sí, señor. Lo siento.', 'Yes, sir. I\'m sorry.', DialogueResultType.POSITIVE, ''),
              opt('OK...', 'OK...', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¡No hablo español!', 'I don\'t speak Spanish!', DialogueResultType.OFFENSIVE, '', {
            npcResponseLocal: '¡Está en España, amigo! Documentos o a la comisaría. ¡Última oportunidad!',
            npcResponseEnglish: 'You\'re in Spain, buddy! Documents or to the station. Last chance!',
            options: [
              opt('OK, OK, aquí tiene...', 'OK, OK, here you go...', DialogueResultType.POSITIVE, ''),
              opt('Lo siento.', 'I\'m sorry.', DialogueResultType.POSITIVE, ''),
            ]
          }),
        ]
      }),
      opt('Buenas tardes, soy Steve.', 'Good afternoon, I\'m Steve.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Buenas tardes, Steve. Oficial Javier. ¿De dónde viene?',
        npcResponseEnglish: 'Good afternoon, Steve. Officer Javier. Where are you from?',
        options: [
          opt('De Idaho, Estados Unidos.', 'From Idaho, United States.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¿Idaho? Muy bien. Todo en orden. El aeropuerto está en esa dirección.',
            npcResponseEnglish: 'Idaho? Very good. Everything in order. The airport is in that direction.',
            options: [
              opt('Gracias, oficial Javier.', 'Thanks, Officer Javier.', DialogueResultType.POSITIVE, ''),
              opt('Adiós.', 'Goodbye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('Estoy perdido.', 'I\'m lost.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Le entiendo. El tren al aeropuerto está en la estación, andén tres.',
            npcResponseEnglish: 'I understand. The train to the airport is at the station, platform three.',
            options: [
              opt('Muchas gracias.', 'Thank you very much.', DialogueResultType.POSITIVE, ''),
              opt('Gracias.', 'Thanks.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
    ]
  ),
  // Stage 4: Airport
  buildNPC(Country.SPAIN, 'es_5', 'Isabel', 'Airport Info Desk',
    'Hola. ¿En qué puedo ayudarte en el aeropuerto?',
    'Hello. How can I help you in the airport?',
    [
      opt('Necesito un vuelo a Idaho.', 'I need a flight to Idaho.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Idaho... vamos a ver. Hay un vuelo con escala en Nueva York. Sale en 2 horas. ¿Lo quiere?',
        npcResponseEnglish: 'Idaho... let me see. There\'s a flight with a layover in New York. It leaves in 2 hours. Do you want it?',
        options: [
          opt('¡Sí, por favor!', 'Yes, please!', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Perfecto. Su puerta de embarque es la B7. ¡Que tenga buen vuelo!',
            npcResponseEnglish: 'Perfect. Your boarding gate is B7. Have a nice flight!',
            options: [
              opt('¡Muchas gracias!', 'Thank you very much!', DialogueResultType.POSITIVE, ''),
              opt('Gracias.', 'Thanks.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¿Cuánto cuesta?', 'How much does it cost?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'El billete de emergencia cuesta 500 euros. Pero para un americano perdido, el consulado puede ayudar.',
            npcResponseEnglish: 'The emergency ticket costs 500 euros. But for a lost American, the consulate can help.',
            options: [
              opt('Gracias por la información.', 'Thanks for the info.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¿Dónde está la puerta B7?', 'Where is gate B7?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Siga recto, pase el control de seguridad. La puerta B7 está a la izquierda.',
        npcResponseEnglish: 'Go straight, pass security control. Gate B7 is on the left.',
        options: [
          opt('Perfecto, gracias.', 'Perfect, thanks.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¡De nada! ¡Buen viaje de vuelta a Idaho!',
            npcResponseEnglish: 'You\'re welcome! Have a good trip back to Idaho!',
            options: [
              opt('¡Gracias!', 'Thanks!', DialogueResultType.POSITIVE, ''),
              opt('Adiós.', 'Goodbye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¿Hay wifi gratis?', 'Is there free wifi?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Sí, la red se llama "AeropuertoFree". Pero date prisa, tu vuelo sale pronto.',
            npcResponseEnglish: 'Yes, the network is called "AeropuertoFree". But hurry, your flight leaves soon.',
            options: [
              opt('OK, gracias.', 'OK, thanks.', DialogueResultType.POSITIVE, ''),
              opt('Vale.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('¡Quiero hablar con el jefe!', 'I want to speak with the manager!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: 'Yo soy la responsable aquí. ¿Cuál es su problema exactamente?',
        npcResponseEnglish: 'I am the person in charge here. What is your problem exactly?',
        options: [
          opt('Perdón, necesito ayuda.', 'Sorry, I need help.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Entiendo, estás estresado. Su vuelo sale de la puerta B7. Vaya ahora.',
            npcResponseEnglish: 'I understand, you\'re stressed. Your flight leaves from gate B7. Go now.',
            options: [
              opt('Gracias, lo siento.', 'Thanks, I\'m sorry.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¡Todo es horrible aquí!', 'Everything is horrible here!', DialogueResultType.OFFENSIVE, '', {
            npcResponseLocal: '¡Seguridad! Tenemos un pasajero problemático. Puerta B7, señor. AHORA.',
            npcResponseEnglish: 'Security! We have a problem passenger. Gate B7, sir. NOW.',
            options: [
              opt('OK, OK, ya voy...', 'OK, OK, I\'m going...', DialogueResultType.POSITIVE, ''),
              opt('Lo siento...', 'I\'m sorry...', DialogueResultType.POSITIVE, ''),
            ]
          }),
        ]
      }),
      opt('Soy Steve, estoy perdido.', 'I\'m Steve, I\'m lost.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: '¡Hola Steve! No te preocupes. Hay un vuelo a Estados Unidos en 2 horas. Puerta B7.',
        npcResponseEnglish: 'Hi Steve! Don\'t worry. There\'s a flight to the US in 2 hours. Gate B7.',
        options: [
          opt('¡Eso es fantástico!', 'That\'s fantastic!', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¡Sí! Pasa por seguridad y ve directamente a la puerta. ¡Buen viaje!',
            npcResponseEnglish: 'Yes! Go through security and go directly to the gate. Have a good trip!',
            options: [
              opt('Gracias, Isabel.', 'Thanks, Isabel.', DialogueResultType.POSITIVE, ''),
              opt('¡Genial!', 'Great!', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('¿Me ayudas a llegar?', 'Can you help me get there?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Claro. Sigue las señales azules. Verás la puerta B7 a la izquierda.',
            npcResponseEnglish: 'Of course. Follow the blue signs. You\'ll see gate B7 on the left.',
            options: [
              opt('Muchas gracias.', 'Thank you very much.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
    ]
  ),
  // Stage 5: Boarding
  buildNPC(Country.SPAIN, 'es_6', 'Luisa', 'Gate Agent',
    'Última llamada para el vuelo a Idaho. ¿Embarca?',
    'Last call for the flight to Idaho. Are you boarding?',
    [
      opt('¡Sí! ¡Aquí está mi billete!', 'Yes! Here is my ticket!', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Perfecto, señor Steve. Asiento 14A, ventana. ¡Bienvenido a bordo!',
        npcResponseEnglish: 'Perfect, Mr. Steve. Seat 14A, window. Welcome aboard!',
        options: [
          opt('¡Muchas gracias! ¡Me voy a casa!', 'Thank you very much! I\'m going home!', DialogueResultType.POSITIVE, ''),
          opt('¡Por fin!', 'Finally!', DialogueResultType.NEUTRAL, ''),
        ]
      }),
      opt('¿Este vuelo va a Idaho?', 'Does this flight go to Idaho?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Sí, con escala en Nueva York. Es el último vuelo del día. ¿Sube?',
        npcResponseEnglish: 'Yes, with a layover in New York. It\'s the last flight today. Getting on?',
        options: [
          opt('¡Sí, sí, subo!', 'Yes, yes, I\'m getting on!', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: '¡Rápido! Le asigno el asiento 14A. ¡Buen viaje, Steve!',
            npcResponseEnglish: 'Quick! I\'ll assign you seat 14A. Good trip, Steve!',
            options: [
              opt('¡Gracias, Luisa!', 'Thanks, Luisa!', DialogueResultType.POSITIVE, ''),
              opt('¡Adiós, España!', 'Goodbye, Spain!', DialogueResultType.POSITIVE, ''),
            ]
          }),
          opt('¿Cuántas horas de vuelo?', 'How many hours of flight?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Nueve horas a Nueva York, luego cuatro a Idaho. ¡Suba ya!',
            npcResponseEnglish: 'Nine hours to New York, then four to Idaho. Get on now!',
            options: [
              opt('OK, ¡voy!', 'OK, I\'m going!', DialogueResultType.POSITIVE, ''),
              opt('¡Vamos!', 'Let\'s go!', DialogueResultType.POSITIVE, ''),
            ]
          }),
        ]
      }),
      opt('¡No quiero irme!', 'I don\'t want to leave!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: '¿Cómo? Es el último vuelo. Si no sube ahora, se queda en España para siempre.',
        npcResponseEnglish: 'What? It\'s the last flight. If you don\'t get on now, you stay in Spain forever.',
        options: [
          opt('OK, OK, subo.', 'OK, OK, I\'m getting on.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Bien decidido. Asiento 14A. ¡Corra!',
            npcResponseEnglish: 'Good decision. Seat 14A. Run!',
            options: [
              opt('¡Gracias!', 'Thanks!', DialogueResultType.POSITIVE, ''),
              opt('¡Voy, voy!', 'I\'m going, I\'m going!', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('España no está mal...', 'Spain isn\'t bad...', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Ja ja. Le gusta España. Pero suba al avión, Steve. Idaho le espera.',
            npcResponseEnglish: 'Ha ha. You like Spain. But get on the plane, Steve. Idaho awaits.',
            options: [
              opt('Adiós, España. Hola, Idaho.', 'Goodbye, Spain. Hello, Idaho.', DialogueResultType.POSITIVE, ''),
              opt('OK...', 'OK...', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('Gracias por todo, España.', 'Thank you for everything, Spain.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: '¡Qué bonito! España te desea buen viaje. Asiento 14A, Steve. ¡Embarca!',
        npcResponseEnglish: 'How beautiful! Spain wishes you a good trip. Seat 14A, Steve. Board!',
        options: [
          opt('¡Adiós, España! ¡Me voy a casa!', 'Goodbye, Spain! I\'m going home!', DialogueResultType.POSITIVE, ''),
          opt('Hasta pronto.', 'See you soon.', DialogueResultType.NEUTRAL, ''),
        ]
      }),
    ]
  ),
];

// ============================================================
// ITALY — 6 STAGES (Same structure, Italian language)
// ============================================================
const ITALY_NPCS: NPC[] = [
  buildNPC(Country.ITALY, 'it_1', 'Marco', 'Barista',
    'Buongiorno! Un espresso? Ti vedo stressato.',
    'Good morning! An espresso? You look stressed.',
    [
      opt('Un espresso, per favore.', 'An espresso, please.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Subito! Il migliore di Firenze. Cerchi l\'aeroporto?',
        npcResponseEnglish: 'Coming right up! The best in Florence. Looking for the airport?',
        options: [
          opt('Sì, come ci arrivo?', 'Yes, how do I get there?', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Prendi il bus in piazza. Costa tre euro. In bocca al lupo!',
            npcResponseEnglish: 'Take the bus at the square. It costs three euros. Good luck!',
            options: [
              opt('Grazie mille, ciao!', 'Thank you very much, bye!', DialogueResultType.POSITIVE, ''),
              opt('Grazie.', 'Thanks.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('No, solo un caffè.', 'No, just a coffee.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Va bene! Ma sbrigati, il prossimo bus parte tra 30 minuti.',
            npcResponseEnglish: 'Alright! But hurry, the next bus leaves in 30 minutes.',
            options: [
              opt('Grazie per l\'avviso!', 'Thanks for the warning!', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('Dov\'è l\'aeroporto?', 'Where is the airport?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'È lontano da qui. Serve un bus o un treno. Vuoi un caffè prima?',
        npcResponseEnglish: 'It\'s far from here. You need a bus or train. Want a coffee first?',
        options: [
          opt('Sì, un cappuccino.', 'Yes, a cappuccino.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Ecco a te! Il bus parte dalla piazza centrale ogni ora.',
            npcResponseEnglish: 'Here you go! The bus leaves from the main square every hour.',
            options: [
              opt('Grazie, Marco!', 'Thanks, Marco!', DialogueResultType.POSITIVE, ''),
              opt('Ciao.', 'Bye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('No, devo andare subito.', 'No, I need to go right away.', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'OK, la piazza è a destra. Il bus costa tre euro.',
            npcResponseEnglish: 'OK, the square is to the right. The bus costs three euros.',
            options: [
              opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('Voglio i miei soldi!', 'I want my money!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: 'Ma che dici?! Questo è un bar, non una banca! Fuori!',
        npcResponseEnglish: 'What are you saying?! This is a bar, not a bank! Get out!',
        options: [
          opt('Scusa, scusa...', 'Sorry, sorry...', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Hmm. Va bene. Siediti e calmati. Ecco un bicchiere d\'acqua.',
            npcResponseEnglish: 'Hmm. OK. Sit down and calm down. Here\'s a glass of water.',
            options: [
              opt('Grazie, mi dispiace.', 'Thanks, I\'m sorry.', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('Non disturbarmi!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', {
            npcResponseLocal: 'FUORI DAL MIO BAR! Mamma mia!',
            npcResponseEnglish: 'OUT OF MY BAR! Mama mia!',
            options: [
              opt('Scusa.', 'Sorry.', DialogueResultType.POSITIVE, ''),
              opt('Ciao.', 'Bye.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
      opt('Ciao, io sono Steve.', 'Hi, I\'m Steve.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Ciao Steve! Americano? Benvenuto in Italia! Un espresso offre la casa.',
        npcResponseEnglish: 'Hi Steve! American? Welcome to Italy! An espresso is on the house.',
        options: [
          opt('Grazie! Sei molto gentile.', 'Thanks! You\'re very kind.', DialogueResultType.POSITIVE, '', {
            npcResponseLocal: 'Prego! Il bus per la città parte dalla piazza. Buon viaggio!',
            npcResponseEnglish: 'You\'re welcome! The bus to the city leaves from the square. Good trip!',
            options: [
              opt('Arrivederci, Marco!', 'Goodbye, Marco!', DialogueResultType.POSITIVE, ''),
              opt('Ciao ciao!', 'Bye bye!', DialogueResultType.NEUTRAL, ''),
            ]
          }),
          opt('Dove posso prendere il bus?', 'Where can I take the bus?', DialogueResultType.NEUTRAL, '', {
            npcResponseLocal: 'Esci, gira a destra. La piazza è a 50 metri.',
            npcResponseEnglish: 'Go out, turn right. The square is 50 meters away.',
            options: [
              opt('Perfetto, grazie!', 'Perfect, thanks!', DialogueResultType.POSITIVE, ''),
              opt('OK.', 'OK.', DialogueResultType.NEUTRAL, ''),
            ]
          }),
        ]
      }),
    ]
  ),
  buildNPC(Country.ITALY, 'it_2', 'Giovanni', 'Gondolier',
    'Gondola, gondola! Vuoi fare un giro sui canali?',
    'Gondola, gondola! Want to take a ride on the canals?',
    [
      opt('Sì! Quanto costa?', 'Yes! How much does it cost?', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Dieci euro! Ti porto fino alla stazione dei treni. Affare!',
        npcResponseEnglish: 'Ten euros! I\'ll take you to the train station. A deal!',
        options: [
          opt('Affare fatto!', 'Deal!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Sali a bordo! Prossima fermata, stazione centrale!', npcResponseEnglish: 'Get on board! Next stop, central station!', options: [opt('Andiamo!', 'Let\'s go!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
          opt('Troppo caro.', 'Too expensive.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Va bene, cinque euro. Ultimo prezzo!', npcResponseEnglish: 'OK, five euros. Final price!', options: [opt('D\'accordo!', 'Agreed!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Dove va questa gondola?', 'Where does this gondola go?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Fino alla stazione dei treni! Da lì prendi il treno per l\'aeroporto.',
        npcResponseEnglish: 'To the train station! From there you take the train to the airport.',
        options: [
          opt('Perfetto, salgo!', 'Perfect, I\'m getting on!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bravo! Siediti e goditi il panorama!', npcResponseEnglish: 'Good! Sit down and enjoy the view!', options: [opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('Bello!', 'Beautiful!', DialogueResultType.NEUTRAL, '')] }),
          opt('Quanto tempo?', 'How long?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Venti minuti. È la via più veloce con tutto questo traffico.', npcResponseEnglish: 'Twenty minutes. It\'s the fastest way with all this traffic.', options: [opt('Andiamo!', 'Let\'s go!', DialogueResultType.POSITIVE, ''), opt('Va bene.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Sei troppo lento!', 'You\'re too slow!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: 'Lento?! Io remo da 30 anni! Scendi dalla mia gondola!',
        npcResponseEnglish: 'Slow?! I\'ve been rowing for 30 years! Get off my gondola!',
        options: [
          opt('Scusa, scusa...', 'Sorry, sorry...', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hmm. Siediti e stai zitto. Arriviamo tra 15 minuti.', npcResponseEnglish: 'Hmm. Sit down and be quiet. We arrive in 15 minutes.', options: [opt('Grazie.', 'Thanks.', DialogueResultType.POSITIVE, ''), opt('...', '...', DialogueResultType.NEUTRAL, '')] }),
          opt('La tua gondola fa schifo!', 'Your gondola sucks!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'FUORI! Nuota fino alla stazione, americano!', npcResponseEnglish: 'OUT! Swim to the station, American!', options: [opt('Mi dispiace!', 'I\'m sorry!', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Ciao, sono Steve dall\'Idaho.', 'Hi, I\'m Steve from Idaho.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Idaho! Non so dove sia, ma benvenuto! Ti porto alla stazione gratis!',
        npcResponseEnglish: 'Idaho! I don\'t know where that is, but welcome! I\'ll take you to the station for free!',
        options: [
          opt('Sei fantastico, Giovanni!', 'You\'re fantastic, Giovanni!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Grazie! Andiamo, amico mio!', npcResponseEnglish: 'Thanks! Let\'s go, my friend!', options: [opt('Andiamo!', 'Let\'s go!', DialogueResultType.POSITIVE, ''), opt('Grazie!', 'Thanks!', DialogueResultType.NEUTRAL, '')] }),
          opt('Grazie mille!', 'Thank you very much!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Prego! Goditi il viaggio!', npcResponseEnglish: 'You\'re welcome! Enjoy the ride!', options: [opt('Bellissimo!', 'Beautiful!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
    ]
  ),
  buildNPC(Country.ITALY, 'it_3', 'Giuseppe', 'Gelato Vendor',
    'Gelato fresco! Pistacchio, limone, fragola. Quale gusto?',
    'Fresh gelato! Pistachio, lemon, strawberry. Which flavor?',
    [
      opt('Pistacchio, per favore!', 'Pistachio, please!', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Ottima scelta! Due euro. Il treno per l\'aeroporto parte tra un\'ora.',
        npcResponseEnglish: 'Great choice! Two euros. The train to the airport leaves in an hour.',
        options: [
          opt('Grazie! Dov\'è la stazione?', 'Thanks! Where is the station?', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'In fondo a questa strada. Non puoi perderla!', npcResponseEnglish: 'At the end of this street. You can\'t miss it!', options: [opt('Perfetto, grazie!', 'Perfect, thanks!', DialogueResultType.POSITIVE, ''), opt('Grazie.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }),
          opt('Il gelato è buonissimo!', 'The gelato is delicious!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Grazie! Fatto in casa ogni mattina. La stazione è laggiù!', npcResponseEnglish: 'Thanks! Homemade every morning. The station is down there!', options: [opt('Grazie, Giuseppe!', 'Thanks, Giuseppe!', DialogueResultType.POSITIVE, ''), opt('Ciao!', 'Bye!', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Quanto costa?', 'How much does it cost?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Due euro il cono. Il migliore d\'Italia!',
        npcResponseEnglish: 'Two euros a cone. The best in Italy!',
        options: [
          opt('Va bene, uno!', 'Alright, one!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Ecco! La stazione dei treni è in fondo alla strada.', npcResponseEnglish: 'Here! The train station is at the end of the street.', options: [opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
          opt('No grazie.', 'No thanks.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Come vuoi. La stazione è laggiù, comunque.', npcResponseEnglish: 'As you wish. The station is down there, anyway.', options: [opt('Grazie per l\'informazione.', 'Thanks for the info.', DialogueResultType.POSITIVE, ''), opt('Ciao.', 'Bye.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Non parlo italiano!', 'I don\'t speak Italian!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: 'Beh, sei in Italia! Gelato? Si dice uguale in tutte le lingue!',
        npcResponseEnglish: 'Well, you\'re in Italy! Gelato? It\'s the same in every language!',
        options: [
          opt('Ha ha, hai ragione. Uno!', 'Ha ha, you\'re right. One!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bravo! Ecco a te. La stazione è in fondo.', npcResponseEnglish: 'Good! Here you go. The station is at the bottom.', options: [opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
          opt('No.', 'No.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Peccato. Vai dritto per la stazione.', npcResponseEnglish: 'Too bad. Go straight for the station.', options: [opt('Grazie.', 'Thanks.', DialogueResultType.NEUTRAL, ''), opt('Ciao.', 'Bye.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Ciao! Sono Steve.', 'Hi! I\'m Steve.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Ciao Steve! Giuseppe! Un gelato gratis per il turista americano!',
        npcResponseEnglish: 'Hi Steve! Giuseppe! A free gelato for the American tourist!',
        options: [
          opt('Che gentile! Grazie!', 'How kind! Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Di niente! La stazione è a destra. Buon viaggio!', npcResponseEnglish: 'Don\'t mention it! The station is to the right. Good trip!', options: [opt('Arrivederci!', 'Goodbye!', DialogueResultType.POSITIVE, ''), opt('Ciao!', 'Bye!', DialogueResultType.NEUTRAL, '')] }),
          opt('Dove la stazione?', 'Where\'s the station?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'A destra, 200 metri. Mangia il gelato per strada!', npcResponseEnglish: 'To the right, 200 meters. Eat the gelato on the way!', options: [opt('Perfetto!', 'Perfect!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
    ]
  ),
  buildNPC(Country.ITALY, 'it_4', 'Chiara', 'Local Cop',
    'Documenti prego. Cosa ci fa in questa piazza?',
    'ID please. What are you doing in this square?',
    [
      opt('Ecco il mio passaporto.', 'Here is my passport.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Steve, Idaho... Americano. Tutto a posto. L\'aeroporto è a nord.',
        npcResponseEnglish: 'Steve, Idaho... American. Everything is fine. The airport is to the north.',
        options: [
          opt('Grazie, agente.', 'Thanks, officer.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Prego. Buon viaggio!', npcResponseEnglish: 'You\'re welcome. Have a good trip!', options: [opt('Arrivederci!', 'Goodbye!', DialogueResultType.POSITIVE, ''), opt('Ciao.', 'Bye.', DialogueResultType.NEUTRAL, '')] }),
          opt('Come arrivo all\'aeroporto?', 'How do I get to the airport?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Il treno dal binario due. Parte ogni 30 minuti.', npcResponseEnglish: 'The train from platform two. Leaves every 30 minutes.', options: [opt('Grazie mille!', 'Thank you very much!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Non ho documenti...', 'I don\'t have documents...', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Nessun documento? Problematico. Ha qualcosa con una foto?',
        npcResponseEnglish: 'No documents? Problematic. Do you have anything with a photo?',
        options: [
          opt('Ho la patente americana.', 'I have my American license.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'OK, va bene per ora. Vada subito all\'aeroporto, al consolato.', npcResponseEnglish: 'OK, fine for now. Go immediately to the airport, to the consulate.', options: [opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
          opt('Non ho niente.', 'I have nothing.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Mamma mia. Il consolato americano è all\'aeroporto. Vada subito.', npcResponseEnglish: 'Mama mia. The American consulate is at the airport. Go immediately.', options: [opt('Grazie, agente.', 'Thanks, officer.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Non disturbarmi!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: 'Come?! Documenti. SUBITO. O la porto in commissariato.',
        npcResponseEnglish: 'Excuse me?! Documents. NOW. Or I take you to the station.',
        options: [
          opt('Scusa! Ecco il passaporto!', 'Sorry! Here\'s the passport!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Così va meglio. Tutto a posto. Vada via.', npcResponseEnglish: 'That\'s better. Everything in order. Move along.', options: [opt('Sì, agente. Scusa.', 'Yes, officer. Sorry.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
          opt('Lasciami in pace!', 'Leave me alone!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'BASTA! Documenti o vieni in commissariato!', npcResponseEnglish: 'ENOUGH! Documents or you come to the station!', options: [opt('OK, OK, ecco...', 'OK, OK, here...', DialogueResultType.POSITIVE, ''), opt('Mi dispiace.', 'I\'m sorry.', DialogueResultType.POSITIVE, '')] }),
        ]
      }),
      opt('Buongiorno, sono Steve.', 'Good morning, I\'m Steve.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Buongiorno Steve. Agente Chiara. Da dove vieni?',
        npcResponseEnglish: 'Good morning Steve. Officer Chiara. Where are you from?',
        options: [
          opt('Dall\'Idaho, USA.', 'From Idaho, USA.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Idaho? Benvenuto! Il treno per l\'aeroporto parte dal binario due.', npcResponseEnglish: 'Idaho? Welcome! The train to the airport leaves from platform two.', options: [opt('Grazie, agente!', 'Thanks, officer!', DialogueResultType.POSITIVE, ''), opt('Ciao!', 'Bye!', DialogueResultType.NEUTRAL, '')] }),
          opt('Sono perso.', 'I\'m lost.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Capisco. L\'aeroporto è raggiungibile dal binario due.', npcResponseEnglish: 'I understand. The airport is reachable from platform two.', options: [opt('Grazie mille.', 'Thank you very much.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
    ]
  ),
  buildNPC(Country.ITALY, 'it_5', 'Paola', 'Airport Desk Clerk',
    'Benvenuto all\'aeroporto. Deve spedire bagagli?',
    'Welcome to the airport. Do you need to check bags?',
    [
      opt('Ho bisogno di un volo per Idaho.', 'I need a flight to Idaho.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'C\'è un volo con scalo a New York fra 2 ore. Cancello C3.',
        npcResponseEnglish: 'There\'s a flight with a layover in New York in 2 hours. Gate C3.',
        options: [
          opt('Perfetto! Grazie!', 'Perfect! Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Prego! Passi il controllo sicurezza e vada al cancello C3. Buon volo!', npcResponseEnglish: 'You\'re welcome! Pass security and go to gate C3. Have a nice flight!', options: [opt('Grazie mille!', 'Thank you very much!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }),
          opt('Quanto costa?', 'How much does it cost?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Il consolato americano può aiutarla. È al piano di sopra.', npcResponseEnglish: 'The American consulate can help you. It\'s upstairs.', options: [opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Dov\'è il cancello C3?', 'Where is gate C3?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Dritto, poi a sinistra dopo la sicurezza.',
        npcResponseEnglish: 'Straight, then left after security.',
        options: [
          opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Prego! Buon viaggio!', npcResponseEnglish: 'You\'re welcome! Good trip!', options: [opt('Arrivederci!', 'Goodbye!', DialogueResultType.POSITIVE, ''), opt('Ciao!', 'Bye!', DialogueResultType.NEUTRAL, '')] }),
          opt('C\'è il wifi?', 'Is there wifi?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Sì, rete "AeroportoFree". Ma sbrigati per il volo!', npcResponseEnglish: 'Yes, network "AeroportoFree". But hurry for the flight!', options: [opt('OK, grazie!', 'OK, thanks!', DialogueResultType.POSITIVE, ''), opt('Va bene.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Questo aeroporto è terribile!', 'This airport is terrible!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: 'Signore, per favore. Come posso aiutarla?',
        npcResponseEnglish: 'Sir, please. How can I help you?',
        options: [
          opt('Scusa, sono stressato.', 'Sorry, I\'m stressed.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Capisco. Il suo volo è al cancello C3. Vada subito.', npcResponseEnglish: 'I understand. Your flight is at gate C3. Go now.', options: [opt('Grazie, mi dispiace.', 'Thanks, I\'m sorry.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
          opt('Voglio parlare col direttore!', 'I want to speak with the director!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Sicurezza! Passeggero problematico. Cancello C3, signore. ORA.', npcResponseEnglish: 'Security! Problem passenger. Gate C3, sir. NOW.', options: [opt('OK, vado, vado...', 'OK, I\'m going, I\'m going...', DialogueResultType.POSITIVE, ''), opt('Scusa.', 'Sorry.', DialogueResultType.POSITIVE, '')] }),
        ]
      }),
      opt('Ciao, sono Steve. Sono perso.', 'Hi, I\'m Steve. I\'m lost.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Ciao Steve! Non preoccuparti. C\'è un volo tra 2 ore. Cancello C3.',
        npcResponseEnglish: 'Hi Steve! Don\'t worry. There\'s a flight in 2 hours. Gate C3.',
        options: [
          opt('Fantastico! Grazie!', 'Fantastic! Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Prego! Vai dritto e poi a sinistra. Buon volo!', npcResponseEnglish: 'You\'re welcome! Go straight then left. Good flight!', options: [opt('Grazie, Paola!', 'Thanks, Paola!', DialogueResultType.POSITIVE, ''), opt('Ciao!', 'Bye!', DialogueResultType.NEUTRAL, '')] }),
          opt('Mi aiuti ad arrivare?', 'Can you help me get there?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Segui le frecce blu. Cancello C3 a sinistra.', npcResponseEnglish: 'Follow the blue arrows. Gate C3 on the left.', options: [opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
    ]
  ),
  buildNPC(Country.ITALY, 'it_6', 'Roberto', 'Gate Agent',
    'Siamo all\'imbarco finale per il volo a Idaho. Biglietto?',
    'We are at final boarding for the flight to Idaho. Ticket?',
    [
      opt('Sì! Ecco il mio biglietto!', 'Yes! Here is my ticket!', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Perfetto, signor Steve. Posto 12B. Benvenuto a bordo!',
        npcResponseEnglish: 'Perfect, Mr. Steve. Seat 12B. Welcome aboard!',
        options: [
          opt('Grazie! Finalmente si torna a casa!', 'Thanks! Finally going home!', DialogueResultType.POSITIVE, ''),
          opt('Evviva!', 'Hooray!', DialogueResultType.NEUTRAL, ''),
        ]
      }),
      opt('Questo volo va all\'Idaho?', 'Does this flight go to Idaho?', DialogueResultType.NEUTRAL, '', {
        npcResponseLocal: 'Sì, con scalo a New York. È l\'ultimo volo. Sale?',
        npcResponseEnglish: 'Yes, with a stop in New York. It\'s the last flight. Getting on?',
        options: [
          opt('Sì, salgo!', 'Yes, I\'m getting on!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Veloce! Posto 12B. Buon volo, Steve!', npcResponseEnglish: 'Quick! Seat 12B. Good flight, Steve!', options: [opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('Addio, Italia!', 'Goodbye, Italy!', DialogueResultType.POSITIVE, '')] }),
          opt('Quante ore?', 'How many hours?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Otto ore. Sali ora!', npcResponseEnglish: 'Eight hours. Get on now!', options: [opt('OK, vado!', 'OK, I\'m going!', DialogueResultType.POSITIVE, ''), opt('Andiamo!', 'Let\'s go!', DialogueResultType.POSITIVE, '')] }),
        ]
      }),
      opt('Non voglio andare via!', 'I don\'t want to leave!', DialogueResultType.OFFENSIVE, '', {
        npcResponseLocal: 'Ultimo volo. Se non sale, resta in Italia per sempre.',
        npcResponseEnglish: 'Last flight. If you don\'t get on, you stay in Italy forever.',
        options: [
          opt('OK, OK, salgo.', 'OK, OK, I\'m getting on.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Buona decisione. Posto 12B. Corri!', npcResponseEnglish: 'Good decision. Seat 12B. Run!', options: [opt('Grazie!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('Vado!', 'I\'m going!', DialogueResultType.NEUTRAL, '')] }),
          opt('L\'Italia mi piace...', 'I like Italy...', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Bello! Ma sali sull\'aereo. L\'Idaho ti aspetta.', npcResponseEnglish: 'Nice! But get on the plane. Idaho awaits.', options: [opt('Addio Italia, ciao Idaho!', 'Goodbye Italy, hello Idaho!', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] }),
        ]
      }),
      opt('Grazie per tutto, Italia.', 'Thank you for everything, Italy.', DialogueResultType.POSITIVE, '', {
        npcResponseLocal: 'Che bello! L\'Italia ti saluta. Posto 12B, Steve. Imbarca!',
        npcResponseEnglish: 'How nice! Italy says goodbye. Seat 12B, Steve. Board!',
        options: [
          opt('Addio, Italia! Torno a casa!', 'Goodbye, Italy! I\'m going home!', DialogueResultType.POSITIVE, ''),
          opt('Arrivederci!', 'Goodbye!', DialogueResultType.NEUTRAL, ''),
        ]
      }),
    ]
  ),
];

// ============================================================
// GERMANY — 6 STAGES
// ============================================================
const GERMANY_NPCS: NPC[] = [
  buildNPC(Country.GERMANY, 'de_1', 'Hans', 'Barkeep', 'Guten Tag. Ein Bier? Sie wirken unorganisiert.', 'Good day. A beer? You seem disorganized.',
    [
      opt('Ein Bier, bitte.', 'A beer, please.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hier bitte. Suchen Sie den Flughafen?', npcResponseEnglish: 'Here you go. Looking for the airport?', options: [opt('Ja, wie komme ich dahin?', 'Yes, how do I get there?', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Nehmen Sie den Bus am Marktplatz. Gute Reise!', npcResponseEnglish: 'Take the bus at the market square. Good trip!', options: [opt('Vielen Dank!', 'Thank you!', DialogueResultType.POSITIVE, ''), opt('Danke.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }), opt('Nein, nur trinken.', 'No, just drinking.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'OK. Aber der letzte Bus fährt um 22 Uhr.', npcResponseEnglish: 'OK. But the last bus leaves at 10 PM.', options: [opt('Gut zu wissen!', 'Good to know!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Wo ist der Flughafen?', 'Where is the airport?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Weit weg. Sie brauchen einen Bus. Möchten Sie erst etwas essen?', npcResponseEnglish: 'Far away. You need a bus. Would you like to eat something first?', options: [opt('Eine Brezel, bitte.', 'A pretzel, please.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hier bitte. Der Bus fährt vom Marktplatz.', npcResponseEnglish: 'Here you go. The bus leaves from the market square.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Nein danke.', 'No thanks.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Gut. Der Marktplatz ist links raus.', npcResponseEnglish: 'Good. The market square is out to the left.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Das dauert zu lange!', 'This takes too long!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Ordnung muss sein! Benehmen Sie sich oder gehen Sie!', npcResponseEnglish: 'Order must be kept! Behave yourself or leave!', options: [opt('Entschuldigung...', 'Sorry...', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Schon gut. Hier, ein Wasser. Der Bus fährt vom Marktplatz.', npcResponseEnglish: 'It\'s fine. Here, water. The bus leaves from the market square.', options: [opt('Danke.', 'Thanks.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Ihr Bier ist schlecht!', 'Your beer is bad!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'RAUS! Und kommen Sie nie wieder!', npcResponseEnglish: 'OUT! And never come back!', options: [opt('Tut mir leid.', 'I\'m sorry.', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Ich bin Steve aus Idaho.', 'I\'m Steve from Idaho.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Idaho? Interessant. Willkommen! Ein Bier auf Kosten des Hauses.', npcResponseEnglish: 'Idaho? Interesting. Welcome! A beer on the house.', options: [opt('Sehr freundlich, danke!', 'Very kind, thank you!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bitte! Der Bus zum Zentrum fährt vom Marktplatz.', npcResponseEnglish: 'You\'re welcome! The bus to the center leaves from the market square.', options: [opt('Auf Wiedersehen, Hans!', 'Goodbye, Hans!', DialogueResultType.POSITIVE, ''), opt('Tschüss!', 'Bye!', DialogueResultType.NEUTRAL, '')] }), opt('Wo ist der Marktplatz?', 'Where is the market square?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Raus und links. 100 Meter.', npcResponseEnglish: 'Out and left. 100 meters.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.GERMANY, 'de_2', 'Dieter', 'Train Conductor', 'Fahrkarten bitte. Sind Sie schwarzgefahren?', 'Tickets please. Did you ride without a ticket?',
    [
      opt('Hier ist meine Fahrkarte.', 'Here is my ticket.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Alles in Ordnung. Nächster Halt: Frankfurt Hauptbahnhof.', npcResponseEnglish: 'Everything in order. Next stop: Frankfurt Central Station.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Gerne. Vom Bahnhof können Sie zum Flughafen weiterfahren.', npcResponseEnglish: 'Gladly. From the station you can continue to the airport.', options: [opt('Perfekt!', 'Perfect!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Wie weit ist der Flughafen?', 'How far is the airport?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: '20 Minuten mit der S-Bahn vom Hauptbahnhof.', npcResponseEnglish: '20 minutes by S-Bahn from the main station.', options: [opt('Gut, danke!', 'Good, thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Ich habe keine Fahrkarte...', 'I don\'t have a ticket...', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ohne Fahrkarte? Das kostet 60 Euro Strafe! Aber... Sie sehen sehr verwirrt aus.', npcResponseEnglish: 'No ticket? That\'s a 60 euro fine! But... you look very confused.', options: [opt('Ich bin verloren, bitte helfen Sie mir.', 'I\'m lost, please help me.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hmm. Ausnahmsweise. Bleiben Sie sitzen. Nächster Halt, Hauptbahnhof.', npcResponseEnglish: 'Hmm. Exceptionally. Stay seated. Next stop, main station.', options: [opt('Vielen Dank!', 'Thank you!', DialogueResultType.POSITIVE, ''), opt('Danke.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }), opt('Kann ich mit Dollar bezahlen?', 'Can I pay with dollars?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Dollar?! Das ist Deutschland! Aber OK, behalten Sie Ihr Geld. Sitzen bleiben.', npcResponseEnglish: 'Dollars?! This is Germany! But OK, keep your money. Stay seated.', options: [opt('Danke, Sie sind nett!', 'Thanks, you\'re kind!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Stör mich nicht!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'FAHRKARTE! SOFORT! Oder Sie steigen an der nächsten Haltestelle aus!', npcResponseEnglish: 'TICKET! NOW! Or you get off at the next stop!', options: [opt('Entschuldigung! Hier...', 'Sorry! Here...', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'So ist es besser. Nächster Halt: Hauptbahnhof.', npcResponseEnglish: 'That\'s better. Next stop: Main station.', options: [opt('Danke.', 'Thanks.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Ihr Zug ist schrecklich!', 'Your train is terrible!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'RAUS beim nächsten Halt! Deutsche Züge sind die besten!', npcResponseEnglish: 'OUT at the next stop! German trains are the best!', options: [opt('Entschuldigung...', 'Sorry...', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Hallo, ich heiße Steve.', 'Hello, my name is Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hallo Steve. Dieter. Amerikaner? Der Flughafen ist 3 Stationen weiter.', npcResponseEnglish: 'Hello Steve. Dieter. American? The airport is 3 stations away.', options: [opt('Super, danke Dieter!', 'Great, thanks Dieter!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Gerne! Gute Heimreise!', npcResponseEnglish: 'Gladly! Good trip home!', options: [opt('Auf Wiedersehen!', 'Goodbye!', DialogueResultType.POSITIVE, ''), opt('Tschüss!', 'Bye!', DialogueResultType.NEUTRAL, '')] }), opt('Wie lange dauert es?', 'How long does it take?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: '15 Minuten. Pünktlich wie immer.', npcResponseEnglish: '15 minutes. On time as always.', options: [opt('Typisch deutsch!', 'Typically German!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.GERMANY, 'de_3', 'Greta', 'Pretzel Baker', 'Heiße Brezeln frisch aus dem Ofen. Möchten Sie zwei?', 'Hot pretzels fresh from the oven. Would you like two?',
    [
      opt('Ja bitte, zwei Brezeln!', 'Yes please, two pretzels!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Drei Euro. Mit Senf oder ohne?', npcResponseEnglish: 'Three euros. With mustard or without?', options: [opt('Mit Senf, bitte!', 'With mustard, please!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Sehr gut! Der Bahnhof ist am Ende der Straße.', npcResponseEnglish: 'Very good! The train station is at the end of the street.', options: [opt('Danke, Greta!', 'Thanks, Greta!', DialogueResultType.POSITIVE, ''), opt('Danke.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }), opt('Ohne, danke.', 'Without, thanks.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'OK! Der Bahnhof ist dort drüben.', npcResponseEnglish: 'OK! The train station is over there.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Was kostet das?', 'How much does it cost?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Drei Euro für zwei. Die besten in ganz Deutschland!', npcResponseEnglish: 'Three euros for two. The best in all of Germany!', options: [opt('OK, zwei bitte!', 'OK, two please!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Guten Appetit! Der Bahnhof ist geradeaus.', npcResponseEnglish: 'Enjoy your meal! The train station is straight ahead.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Zu teuer.', 'Too expensive.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Zu teuer?! In Idaho gibt es keine Brezeln! OK, ein Euro für eine.', npcResponseEnglish: 'Too expensive?! There are no pretzels in Idaho! OK, one euro for one.', options: [opt('Abgemacht!', 'Deal!', DialogueResultType.POSITIVE, ''), opt('Nein danke.', 'No thanks.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Ich spreche kein Deutsch!', 'I don\'t speak German!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Sie sind in Deutschland! Brezel - das versteht jeder! Ja oder nein?', npcResponseEnglish: 'You\'re in Germany! Pretzel - everyone understands that! Yes or no?', options: [opt('Ja... bitte.', 'Yes... please.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'So ist es richtig. Hier, eine Brezel. Der Bahnhof ist links.', npcResponseEnglish: 'That\'s right. Here, a pretzel. The station is to the left.', options: [opt('Danke.', 'Thanks.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Nein!', 'No!', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ihr Pech! Der Bahnhof ist dort drüben.', npcResponseEnglish: 'Your loss! The station is over there.', options: [opt('Danke.', 'Thanks.', DialogueResultType.NEUTRAL, ''), opt('Tschüss.', 'Bye.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Hallo, ich bin Steve.', 'Hi, I\'m Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hallo Steve! Greta. Hier, eine Brezel kostenlos für den verlorenen Amerikaner!', npcResponseEnglish: 'Hello Steve! Greta. Here, a free pretzel for the lost American!', options: [opt('Das ist sehr nett! Danke!', 'That\'s very nice! Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bitte! Der Bahnhof ist am Ende dieser Straße. Gute Reise!', npcResponseEnglish: 'You\'re welcome! The station is at the end of this street. Good trip!', options: [opt('Auf Wiedersehen, Greta!', 'Goodbye, Greta!', DialogueResultType.POSITIVE, ''), opt('Tschüss!', 'Bye!', DialogueResultType.NEUTRAL, '')] }), opt('Wo ist der Bahnhof?', 'Where is the station?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Am Ende der Straße. Essen Sie die Brezel unterwegs!', npcResponseEnglish: 'At the end of the street. Eat the pretzel on the way!', options: [opt('Perfekt!', 'Perfect!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.GERMANY, 'de_4', 'Karl', 'Local Cop', 'Hallo! Sie stehen auf dem Fahrradweg. Bitte ausweisen.', 'Hello! You are standing in the bike lane. Please identify yourself.',
    [
      opt('Hier ist mein Reisepass.', 'Here is my passport.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Steve, Idaho... Alles in Ordnung. Der Flughafen ist nördlich.', npcResponseEnglish: 'Steve, Idaho... Everything in order. The airport is to the north.', options: [opt('Vielen Dank, Herr Wachtmeister.', 'Thank you very much, officer.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Gerne. Gute Heimreise!', npcResponseEnglish: 'Gladly. Good trip home!', options: [opt('Auf Wiedersehen!', 'Goodbye!', DialogueResultType.POSITIVE, ''), opt('Danke.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }), opt('Wie komme ich zum Flughafen?', 'How do I get to the airport?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Die S-Bahn, Gleis 4. Fährt alle 20 Minuten.', npcResponseEnglish: 'The S-Bahn, platform 4. Runs every 20 minutes.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Ich habe keinen Ausweis.', 'I don\'t have ID.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Kein Ausweis? Das ist problematisch. Haben Sie einen Führerschein?', npcResponseEnglish: 'No ID? That\'s problematic. Do you have a driver\'s license?', options: [opt('Ja, hier.', 'Yes, here.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Hmm, reicht erstmal. Gehen Sie direkt zum Flughafen.', npcResponseEnglish: 'Hmm, sufficient for now. Go directly to the airport.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Nein, gar nichts.', 'No, nothing at all.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Das amerikanische Konsulat ist am Flughafen. Gehen Sie sofort hin.', npcResponseEnglish: 'The American consulate is at the airport. Go there immediately.', options: [opt('Vielen Dank.', 'Thank you.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Stör mich nicht!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Wie bitte?! Ausweis. SOFORT. Oder ich nehme Sie mit auf die Wache.', npcResponseEnglish: 'Excuse me?! ID. NOW. Or I take you to the station.', options: [opt('Entschuldigung! Hier ist mein Pass!', 'Sorry! Here is my passport!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'So. Alles in Ordnung. Gehen Sie zum Flughafen. Sofort.', npcResponseEnglish: 'So. Everything in order. Go to the airport. Immediately.', options: [opt('Ja, Herr Wachtmeister.', 'Yes, officer.', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] }), opt('Gib mir mein Geld!', 'Give me my money!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'LETZTE WARNUNG. Ausweis oder Arrest!', npcResponseEnglish: 'LAST WARNING. ID or arrest!', options: [opt('OK, OK, hier...', 'OK, OK, here...', DialogueResultType.POSITIVE, ''), opt('Tut mir leid.', 'I\'m sorry.', DialogueResultType.POSITIVE, '')] })] }),
      opt('Guten Tag, ich bin Steve.', 'Good day, I\'m Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Guten Tag Steve. Polizist Karl. Woher kommen Sie?', npcResponseEnglish: 'Good day Steve. Officer Karl. Where are you from?', options: [opt('Aus Idaho, USA.', 'From Idaho, USA.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Idaho! Willkommen. Der Flughafen ist Richtung Norden, S-Bahn Gleis 4.', npcResponseEnglish: 'Idaho! Welcome. The airport is to the north, S-Bahn platform 4.', options: [opt('Danke, Karl!', 'Thanks, Karl!', DialogueResultType.POSITIVE, ''), opt('Tschüss!', 'Bye!', DialogueResultType.NEUTRAL, '')] }), opt('Ich bin verloren.', 'I\'m lost.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Verstehe. S-Bahn zum Flughafen, Gleis 4.', npcResponseEnglish: 'I understand. S-Bahn to airport, platform 4.', options: [opt('Vielen Dank!', 'Thank you!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.GERMANY, 'de_5', 'Brigitte', 'Info Clerk', 'Willkommen am Flughafen München. Kann ich helfen?', 'Welcome to Munich Airport. Can I help you?',
    [
      opt('Ich brauche einen Flug nach Idaho.', 'I need a flight to Idaho.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Idaho... Es gibt einen Flug über New York in 2 Stunden. Gate D5.', npcResponseEnglish: 'Idaho... There\'s a flight via New York in 2 hours. Gate D5.', options: [opt('Perfekt! Danke!', 'Perfect! Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bitte! Gehen Sie durch die Sicherheitskontrolle zum Gate D5. Guten Flug!', npcResponseEnglish: 'You\'re welcome! Go through security to gate D5. Good flight!', options: [opt('Vielen Dank!', 'Thank you!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }), opt('Was kostet das?', 'How much does it cost?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Das Konsulat kann helfen. Stockwerk oben.', npcResponseEnglish: 'The consulate can help. Upstairs.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Wo ist Gate D5?', 'Where is Gate D5?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Geradeaus, durch die Sicherheitskontrolle, dann rechts.', npcResponseEnglish: 'Straight ahead, through security, then right.', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Gern geschehen! Guten Flug!', npcResponseEnglish: 'You\'re welcome! Good flight!', options: [opt('Auf Wiedersehen!', 'Goodbye!', DialogueResultType.POSITIVE, ''), opt('Tschüss!', 'Bye!', DialogueResultType.NEUTRAL, '')] }), opt('Gibt es WLAN?', 'Is there WiFi?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ja, Netzwerk "FlughafenFrei". Aber beeilen Sie sich!', npcResponseEnglish: 'Yes, network "FlughafenFrei". But hurry up!', options: [opt('OK, danke!', 'OK, thanks!', DialogueResultType.POSITIVE, ''), opt('Gut.', 'Good.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Ich will den Chef sprechen!', 'I want to speak with the boss!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Ich bin die Verantwortliche. Was ist Ihr Problem genau?', npcResponseEnglish: 'I am the person in charge. What is your problem exactly?', options: [opt('Entschuldigung, ich brauche Hilfe.', 'Sorry, I need help.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Verstanden. Ihr Flug, Gate D5. Gehen Sie jetzt.', npcResponseEnglish: 'Understood. Your flight, Gate D5. Go now.', options: [opt('Danke, tut mir leid.', 'Thanks, I\'m sorry.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Alles ist schlecht hier!', 'Everything is bad here!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Sicherheit! Problempassagier. Gate D5, mein Herr. JETZT.', npcResponseEnglish: 'Security! Problem passenger. Gate D5, sir. NOW.', options: [opt('OK, OK, ich gehe...', 'OK, OK, I\'m going...', DialogueResultType.POSITIVE, ''), opt('Tut mir leid...', 'I\'m sorry...', DialogueResultType.POSITIVE, '')] })] }),
      opt('Ich bin Steve, ich bin verloren.', 'I\'m Steve, I\'m lost.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hallo Steve! Keine Sorge. Es gibt einen Flug in 2 Stunden. Gate D5.', npcResponseEnglish: 'Hello Steve! Don\'t worry. There\'s a flight in 2 hours. Gate D5.', options: [opt('Fantastisch! Danke!', 'Fantastic! Thanks!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Gern! Folgen Sie den Schildern. Guten Flug!', npcResponseEnglish: 'Gladly! Follow the signs. Good flight!', options: [opt('Danke, Brigitte!', 'Thanks, Brigitte!', DialogueResultType.POSITIVE, ''), opt('Super!', 'Great!', DialogueResultType.NEUTRAL, '')] }), opt('Können Sie mir helfen?', 'Can you help me?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Natürlich. Folgen Sie den blauen Schildern zu Gate D5.', npcResponseEnglish: 'Of course. Follow the blue signs to Gate D5.', options: [opt('Vielen Dank!', 'Thank you!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.GERMANY, 'de_6', 'Gunter', 'Gate Agent', 'Boarding abgeschlossen. Zeigen Sie mir Ihren Reisepass.', 'Boarding closed. Show me your passport.',
    [
      opt('Hier ist mein Reisepass!', 'Here is my passport!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Herr Steve. Sitz 16C. Willkommen an Bord!', npcResponseEnglish: 'Mr. Steve. Seat 16C. Welcome aboard!', options: [opt('Endlich nach Hause! Danke!', 'Finally going home! Thanks!', DialogueResultType.POSITIVE, ''), opt('Danke!', 'Thanks!', DialogueResultType.NEUTRAL, '')] }),
      opt('Fliegt dieses Flugzeug nach Idaho?', 'Does this plane fly to Idaho?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ja, über New York. Letzter Flug heute. Steigen Sie ein?', npcResponseEnglish: 'Yes, via New York. Last flight today. Are you getting on?', options: [opt('Ja! Sofort!', 'Yes! Right away!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Schnell! Sitz 16C. Guten Flug!', npcResponseEnglish: 'Quick! Seat 16C. Good flight!', options: [opt('Danke, Gunter!', 'Thanks, Gunter!', DialogueResultType.POSITIVE, ''), opt('Auf Wiedersehen, Deutschland!', 'Goodbye, Germany!', DialogueResultType.POSITIVE, '')] }), opt('Wie viele Stunden?', 'How many hours?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Zehn Stunden. Steigen Sie jetzt ein!', npcResponseEnglish: 'Ten hours. Get on now!', options: [opt('Los geht\'s!', 'Here we go!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.POSITIVE, '')] })] }),
      opt('Ich will nicht weg!', 'I don\'t want to leave!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Letzter Flug. Wenn Sie nicht einsteigen, bleiben Sie für immer in Deutschland.', npcResponseEnglish: 'Last flight. If you don\'t get on, you stay in Germany forever.', options: [opt('OK, OK, ich steige ein.', 'OK, OK, I\'m getting on.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Gute Entscheidung. Sitz 16C. Laufen Sie!', npcResponseEnglish: 'Good decision. Seat 16C. Run!', options: [opt('Danke!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('Ich laufe!', 'I\'m running!', DialogueResultType.NEUTRAL, '')] }), opt('Deutschland ist nicht schlecht...', 'Germany isn\'t bad...', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Schön. Aber steigen Sie ein. Idaho wartet.', npcResponseEnglish: 'Nice. But get on. Idaho awaits.', options: [opt('Auf Wiedersehen, Deutschland!', 'Goodbye, Germany!', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Danke für alles, Deutschland.', 'Thank you for everything, Germany.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Sehr schön! Deutschland wünscht gute Reise. Sitz 16C. Einsteigen!', npcResponseEnglish: 'Very nice! Germany wishes a good trip. Seat 16C. Board!', options: [opt('Auf Wiedersehen, Deutschland! Hallo, Idaho!', 'Goodbye, Germany! Hello, Idaho!', DialogueResultType.POSITIVE, ''), opt('Tschüss!', 'Bye!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
];

// ============================================================
// SHORT-FORM COUNTRIES (Sweden, Romania, Jersey Shore)
// Using the same helper approach with 6 stages each
// ============================================================

const SWEDEN_NPCS: NPC[] = [
  buildNPC(Country.SWEDEN, 'se_1', 'Bjorn', 'Barista', 'Hej! En kaffe? Du ser lite förvirrad ut.', 'Hi! A coffee? You look a bit confused.',
    [
      opt('En kaffe, tack.', 'A coffee, please.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Varsågod! Söker du flygplatsen?', npcResponseEnglish: 'Here you go! Looking for the airport?', options: [opt('Ja, hur kommer jag dit?', 'Yes, how do I get there?', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Ta bussen vid torget. Lycka till!', npcResponseEnglish: 'Take the bus at the square. Good luck!', options: [opt('Tack så mycket!', 'Thank you very much!', DialogueResultType.POSITIVE, ''), opt('Tack.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }), opt('Nej, bara kaffe.', 'No, just coffee.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'OK! Men sista bussen går klockan tio.', npcResponseEnglish: 'OK! But the last bus leaves at ten.', options: [opt('Bra att veta!', 'Good to know!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Var är flygplatsen?', 'Where is the airport?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Långt härifrån. Du behöver buss. Vill du ha kaffe först?', npcResponseEnglish: 'Far from here. You need a bus. Want coffee first?', options: [opt('Ja tack, en kaffe.', 'Yes please, a coffee.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Varsågod! Bussen avgår från torget.', npcResponseEnglish: 'Here you go! The bus departs from the square.', options: [opt('Tack, Bjorn!', 'Thanks, Bjorn!', DialogueResultType.POSITIVE, ''), opt('Hejdå.', 'Goodbye.', DialogueResultType.NEUTRAL, '')] }), opt('Nej, jag måste gå nu.', 'No, I need to go now.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'OK, torget är till höger.', npcResponseEnglish: 'OK, the square is to the right.', options: [opt('Tack!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Du är alldeles för långsam!', 'You\'re way too slow!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Lugn! Det här är Sverige, vi tar det lugnt. Vill du ha kaffe eller inte?', npcResponseEnglish: 'Calm down! This is Sweden, we take it easy. Want coffee or not?', options: [opt('Förlåt... ja tack.', 'Sorry... yes please.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bra. Varsågod. Bussen är vid torget.', npcResponseEnglish: 'Good. Here you go. The bus is at the square.', options: [opt('Tack.', 'Thanks.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Nej!', 'No!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Hejdå då. Torget är till höger.', npcResponseEnglish: 'Goodbye then. The square is to the right.', options: [opt('Förlåt.', 'Sorry.', DialogueResultType.POSITIVE, ''), opt('Hejdå.', 'Bye.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Hej, jag heter Steve.', 'Hi, my name is Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hej Steve! Bjorn. Amerikan? Välkommen! En gratis kaffe!', npcResponseEnglish: 'Hi Steve! Bjorn. American? Welcome! A free coffee!', options: [opt('Tack, du är jättesnäll!', 'Thanks, you\'re very kind!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Ingen orsak! Bussen till stan avgår från torget.', npcResponseEnglish: 'No problem! The bus to town departs from the square.', options: [opt('Hejdå, Bjorn!', 'Goodbye, Bjorn!', DialogueResultType.POSITIVE, ''), opt('Tack!', 'Thanks!', DialogueResultType.NEUTRAL, '')] }), opt('Var är torget?', 'Where is the square?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ut och till höger. 50 meter.', npcResponseEnglish: 'Out and to the right. 50 meters.', options: [opt('Tack!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.SWEDEN, 'se_2', 'Sven', 'Bus Driver', 'Bussen åker till flygplatsen nu. Har du biljett?', 'The bus is leaving for the airport now. Do you have a ticket?',
    [
      opt('Ja, här är min biljett.', 'Yes, here is my ticket.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bra! Sätt dig. Nästa stopp: centrum.', npcResponseEnglish: 'Good! Sit down. Next stop: city center.', options: [opt('Tack!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Jag har ingen biljett...', 'I don\'t have a ticket...', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ingen biljett? Det kostar 50 kronor. Men... sätt dig, du ser vilsen ut.', npcResponseEnglish: 'No ticket? That costs 50 kronor. But... sit down, you look lost.', options: [opt('Tack så mycket!', 'Thank you very much!', DialogueResultType.POSITIVE, ''), opt('Tack.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }),
      opt('Stör mig inte!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Lugna ner dig! Biljett eller kliv av.', npcResponseEnglish: 'Calm down! Ticket or get off.', options: [opt('Förlåt, jag är stressad.', 'Sorry, I\'m stressed.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'OK. Sätt dig. Vi kör.', npcResponseEnglish: 'OK. Sit down. We\'re going.', options: [opt('Tack.', 'Thanks.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Din buss är dålig!', 'Your bus is bad!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'AV! Gå till nästa hållplats!', npcResponseEnglish: 'OFF! Walk to the next stop!', options: [opt('Förlåt...', 'Sorry...', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Hej, jag heter Steve.', 'Hi, my name is Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hej Steve! Sven. Amerikan? Flygplatsen är 30 minuter härifrån. Stig på!', npcResponseEnglish: 'Hi Steve! Sven. American? The airport is 30 minutes from here. Get on!', options: [opt('Tack, Sven!', 'Thanks, Sven!', DialogueResultType.POSITIVE, ''), opt('Toppen!', 'Great!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.SWEDEN, 'se_3', 'Astrid', 'Cinnamon Bun Baker', 'Nygräddade kanelbullar! Är du hungrig?', 'Freshly baked cinnamon buns! Are you hungry?',
    [
      opt('Ja! En kanelbulle, tack!', 'Yes! A cinnamon bun, please!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Varsågod! 20 kronor. Stationen är runt hörnet.', npcResponseEnglish: 'Here you go! 20 kronor. The station is around the corner.', options: [opt('Tack, Astrid!', 'Thanks, Astrid!', DialogueResultType.POSITIVE, ''), opt('Tack.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }),
      opt('Vad kostar de?', 'How much are they?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: '20 kronor styck. De bästa i hela Sverige!', npcResponseEnglish: '20 kronor each. The best in all of Sweden!', options: [opt('En, tack!', 'One, please!', DialogueResultType.POSITIVE, ''), opt('Nej tack.', 'No thanks.', DialogueResultType.NEUTRAL, '')] }),
      opt('Jag pratar inte svenska!', 'I don\'t speak Swedish!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Du är i Sverige! Kanelbulle förstår alla! Vill du ha en?', npcResponseEnglish: 'You\'re in Sweden! Everyone understands cinnamon bun! Want one?', options: [opt('Ja... tack.', 'Yes... please.', DialogueResultType.POSITIVE, ''), opt('Nej.', 'No.', DialogueResultType.NEUTRAL, '')] }),
      opt('Hej! Jag heter Steve.', 'Hi! My name is Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hej Steve! En gratis kanelbulle! Stationen är runt hörnet!', npcResponseEnglish: 'Hi Steve! A free cinnamon bun! The station is around the corner!', options: [opt('Tack så jättemycket!', 'Thank you so very much!', DialogueResultType.POSITIVE, ''), opt('Tack!', 'Thanks!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.SWEDEN, 'se_4', 'Lars', 'Local Cop', 'Hej ho! Allt under kontroll här? Visa legitimation.', 'Hello there! Everything under control here? Show ID.',
    [
      opt('Här är mitt pass.', 'Here is my passport.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Steve, Idaho. Allt OK. Flygplatsen är norrut.', npcResponseEnglish: 'Steve, Idaho. All OK. Airport is to the north.', options: [opt('Tack!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Jag har inget ID.', 'I don\'t have ID.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Hmm. Har du körkort? Det fungerar tillfälligt.', npcResponseEnglish: 'Hmm. Do you have a driver\'s license? That works temporarily.', options: [opt('Ja, här.', 'Yes, here.', DialogueResultType.NEUTRAL, ''), opt('Nej, inget.', 'No, nothing.', DialogueResultType.NEUTRAL, '')] }),
      opt('Stör mig inte!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Ursäkta?! Legitimation. NU. Annars följer du med till stationen.', npcResponseEnglish: 'Excuse me?! ID. NOW. Otherwise you come to the station.', options: [opt('Förlåt! Här är mitt pass!', 'Sorry! Here is my passport!', DialogueResultType.POSITIVE, ''), opt('OK, OK...', 'OK, OK...', DialogueResultType.POSITIVE, '')] }),
      opt('Hej, jag är Steve.', 'Hi, I\'m Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hej Steve! Lars. Amerikan? Flygplatsen är den vägen. Tåget från perong 2.', npcResponseEnglish: 'Hi Steve! Lars. American? Airport is that way. Train from platform 2.', options: [opt('Tack, Lars!', 'Thanks, Lars!', DialogueResultType.POSITIVE, ''), opt('Hejdå!', 'Goodbye!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.SWEDEN, 'se_5', 'Ingrid', 'Airport Information', 'Välkommen till terminal 5. Kan jag hjälpa dig?', 'Welcome to terminal 5. Can I help you navigate?',
    [
      opt('Jag behöver ett flyg till Idaho.', 'I need a flight to Idaho.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Det finns ett flyg via New York om 2 timmar. Gate E4.', npcResponseEnglish: 'There\'s a flight via New York in 2 hours. Gate E4.', options: [opt('Perfekt! Tack!', 'Perfect! Thanks!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }),
      opt('Var är gate E4?', 'Where is gate E4?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Rakt fram, förbi säkerhetskontrollen, sen till vänster.', npcResponseEnglish: 'Straight ahead, past security, then to the left.', options: [opt('Tack!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Den här flygplatsen är hemsk!', 'This airport is terrible!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Det var inte trevligt. Men jag hjälper dig ändå. Gate E4, snabba på.', npcResponseEnglish: 'That wasn\'t nice. But I\'ll help you anyway. Gate E4, hurry up.', options: [opt('Förlåt. Tack.', 'Sorry. Thanks.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Hej, jag är Steve och jag är vilse.', 'Hi, I\'m Steve and I\'m lost.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Hej Steve! Ingen fara. Flyg om 2 timmar. Gate E4!', npcResponseEnglish: 'Hi Steve! No worries. Flight in 2 hours. Gate E4!', options: [opt('Fantastiskt! Tack!', 'Fantastic! Thanks!', DialogueResultType.POSITIVE, ''), opt('Toppen!', 'Great!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.SWEDEN, 'se_6', 'Sofia', 'Gate Agent', 'Sista utropet för flyg till Idaho. Boardingpass, tack.', 'Last call for flight to Idaho. Boarding pass, please.',
    [
      opt('Här! Jag åker hem!', 'Here! I\'m going home!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Herr Steve. Plats 10A. Välkommen ombord!', npcResponseEnglish: 'Mr. Steve. Seat 10A. Welcome aboard!', options: [opt('Tack! Äntligen hem!', 'Thanks! Finally home!', DialogueResultType.POSITIVE, ''), opt('Hejdå, Sverige!', 'Goodbye, Sweden!', DialogueResultType.POSITIVE, '')] }),
      opt('Går det här flyget till Idaho?', 'Does this flight go to Idaho?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ja, via New York. Sista flygningen. Kliver du på?', npcResponseEnglish: 'Yes, via New York. Last flight. Getting on?', options: [opt('Ja! Nu!', 'Yes! Now!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }),
      opt('Jag vill inte åka!', 'I don\'t want to go!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Sista flyget. Om du inte kliver på, stannar du i Sverige för alltid.', npcResponseEnglish: 'Last flight. If you don\'t get on, you stay in Sweden forever.', options: [opt('OK, jag kliver på.', 'OK, I\'m getting on.', DialogueResultType.POSITIVE, ''), opt('Sverige är fint men... OK.', 'Sweden is nice but... OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Tack för allt, Sverige.', 'Thank you for everything, Sweden.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Vad vackert! Sverige hälsar lycka till. Plats 10A, Steve!', npcResponseEnglish: 'How beautiful! Sweden wishes good luck. Seat 10A, Steve!', options: [opt('Hejdå, Sverige! Hej, Idaho!', 'Goodbye, Sweden! Hi, Idaho!', DialogueResultType.POSITIVE, ''), opt('Hejdå!', 'Goodbye!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
];

const ROMANIA_NPCS: NPC[] = [
  buildNPC(Country.ROMANIA, 'ro_1', 'Andrei', 'Barkeep', 'Bună! O bere? Pari un pic pierdut.', 'Hi! A beer? You look a bit lost.',
    [
      opt('O bere, vă rog.', 'A beer, please.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Poftim! Cauți aeroportul?', npcResponseEnglish: 'Here! Looking for the airport?', options: [opt('Da, cum ajung?', 'Yes, how do I get there?', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Ia microbuzul din piață. Drum bun!', npcResponseEnglish: 'Take the minibus from the square. Good trip!', options: [opt('Mulțumesc mult!', 'Thank you very much!', DialogueResultType.POSITIVE, ''), opt('Mersi.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }), opt('Nu, doar o bere.', 'No, just a beer.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'OK! Dar ultimul microbuz pleacă la 9 seara.', npcResponseEnglish: 'OK! But the last minibus leaves at 9 PM.', options: [opt('Bine de știut!', 'Good to know!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Unde este aeroportul?', 'Where is the airport?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Departe. Ai nevoie de microbuz. Vrei ceva de mâncare mai întâi?', npcResponseEnglish: 'Far away. You need a minibus. Want something to eat first?', options: [opt('Da, niște sarmale!', 'Yes, some cabbage rolls!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Poftim! Microbuzul pleacă din piață.', npcResponseEnglish: 'Here! The minibus leaves from the square.', options: [opt('Mulțumesc!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Nu, mersi.', 'No, thanks.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'OK. Piața este la stânga.', npcResponseEnglish: 'OK. The square is to the left.', options: [opt('Mulțumesc!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Nu mă deranja!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Ce?! Ești în România, prietene! Comportă-te sau pleacă!', npcResponseEnglish: 'What?! You\'re in Romania, friend! Behave or leave!', options: [opt('Scuze, scuze...', 'Sorry, sorry...', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bine. Stai jos. Poftim, o apă.', npcResponseEnglish: 'Fine. Sit down. Here, water.', options: [opt('Mulțumesc.', 'Thanks.', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }), opt('Barul tău e groaznic!', 'Your bar is terrible!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'AFARĂ! Și nu te mai întoarce!', npcResponseEnglish: 'OUT! And don\'t come back!', options: [opt('Scuze.', 'Sorry.', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Salut, mă cheamă Steve.', 'Hi, my name is Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Salut Steve! Andrei. American? Bine ai venit! O bere din partea casei!', npcResponseEnglish: 'Hi Steve! Andrei. American? Welcome! A beer on the house!', options: [opt('Mulțumesc, ești super!', 'Thanks, you\'re great!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Cu plăcere! Microbuzul spre oraș pleacă din piață.', npcResponseEnglish: 'With pleasure! The minibus to town leaves from the square.', options: [opt('La revedere, Andrei!', 'Goodbye, Andrei!', DialogueResultType.POSITIVE, ''), opt('Pa!', 'Bye!', DialogueResultType.NEUTRAL, '')] }), opt('Unde e piața?', 'Where is the square?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ieși și la stânga. 100 de metri.', npcResponseEnglish: 'Go out and left. 100 meters.', options: [opt('Mersi!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.ROMANIA, 'ro_2', 'Dragos', 'Coach Driver', 'Microbuzul pleacă spre Otopeni acum. Te urci?', 'The coach is leaving for Otopeni now. Jumping in?',
    [
      opt('Da! Spre aeroport!', 'Yes! To the airport!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Cinci lei. Ține-te bine, drumul e cu gropi!', npcResponseEnglish: 'Five lei. Hold on tight, the road has potholes!', options: [opt('Mulțumesc!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Unde merge microbuzul?', 'Where does the minibus go?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'La Otopeni. De acolo, zbori acasă. Te urci?', npcResponseEnglish: 'To Otopeni. From there, you fly home. Getting on?', options: [opt('Da, sigur!', 'Yes, sure!', DialogueResultType.POSITIVE, ''), opt('Cât costă?', 'How much?', DialogueResultType.NEUTRAL, '')] }),
      opt('Ești prea încet!', 'You\'re too slow!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Încet?! Eu conduc de 25 de ani! Coboară!', npcResponseEnglish: 'Slow?! I\'ve been driving for 25 years! Get off!', options: [opt('Scuze, nu am vrut...', 'Sorry, I didn\'t mean...', DialogueResultType.POSITIVE, ''), opt('OK, OK...', 'OK, OK...', DialogueResultType.NEUTRAL, '')] }),
      opt('Salut, sunt Steve.', 'Hi, I\'m Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Salut Steve! Dragoș. American? Aeroportul e la 30 de minute. Urcă!', npcResponseEnglish: 'Hi Steve! Dragos. American? Airport is 30 minutes away. Get on!', options: [opt('Mersi, Dragoș!', 'Thanks, Dragos!', DialogueResultType.POSITIVE, ''), opt('Hai!', 'Let\'s go!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.ROMANIA, 'ro_3', 'Mihai', 'Pretzel Hawker', 'Covrigi calzi cu susan! Doar doi lei. Vrei?', 'Warm sesame pretzels! Only two lei. Want some?',
    [
      opt('Da! Doi covrigi, te rog!', 'Yes! Two pretzels, please!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Poftim! Gara este după colț.', npcResponseEnglish: 'Here! The station is around the corner.', options: [opt('Mulțumesc!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('Mersi.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }),
      opt('Cât costă?', 'How much are they?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Doi lei bucata. Cei mai buni din toată România!', npcResponseEnglish: 'Two lei each. The best in all of Romania!', options: [opt('Unul, te rog!', 'One, please!', DialogueResultType.POSITIVE, ''), opt('Nu, mersi.', 'No, thanks.', DialogueResultType.NEUTRAL, '')] }),
      opt('Nu vorbesc română!', 'I don\'t speak Romanian!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Ești în România! Covrig înseamnă covrig! Da sau nu?', npcResponseEnglish: 'You\'re in Romania! Pretzel means pretzel! Yes or no?', options: [opt('Da... te rog.', 'Yes... please.', DialogueResultType.POSITIVE, ''), opt('Nu.', 'No.', DialogueResultType.NEUTRAL, '')] }),
      opt('Salut! Sunt Steve.', 'Hi! I\'m Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Salut Steve! Mihai! Un covrig gratis pentru americanul pierdut!', npcResponseEnglish: 'Hi Steve! Mihai! A free pretzel for the lost American!', options: [opt('Mulțumesc, Mihai!', 'Thanks, Mihai!', DialogueResultType.POSITIVE, ''), opt('Mersi!', 'Thanks!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.ROMANIA, 'ro_4', 'Vasile', 'Local Cop', 'Bună ziua. Buletinul sau pașaportul la control.', 'Good day. ID or passport for checking.',
    [
      opt('Poftim pașaportul meu.', 'Here is my passport.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Steve, Idaho. Totul în ordine. Aeroportul e spre nord.', npcResponseEnglish: 'Steve, Idaho. Everything in order. Airport is to the north.', options: [opt('Mulțumesc, domnule agent!', 'Thank you, officer!', DialogueResultType.POSITIVE, ''), opt('Mersi.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }),
      opt('Nu am pașaport...', 'I don\'t have a passport...', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Fără pașaport? Asta-i problemă. Ai ceva cu poză?', npcResponseEnglish: 'No passport? That\'s a problem. Have anything with a photo?', options: [opt('Am permisul american.', 'I have my American license.', DialogueResultType.NEUTRAL, ''), opt('Nu am nimic.', 'I have nothing.', DialogueResultType.NEUTRAL, '')] }),
      opt('Nu mă deranja!', 'Don\'t bother me!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Poftim?! Actele. ACUM. Sau te iau la secție.', npcResponseEnglish: 'Excuse me?! Documents. NOW. Or I take you to the station.', options: [opt('Scuze! Poftim pașaportul!', 'Sorry! Here\'s the passport!', DialogueResultType.POSITIVE, ''), opt('OK, OK...', 'OK, OK...', DialogueResultType.POSITIVE, '')] }),
      opt('Bună ziua, sunt Steve.', 'Good day, I\'m Steve.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Bună ziua, Steve. Agent Vasile. De unde ești?', npcResponseEnglish: 'Good day, Steve. Officer Vasile. Where are you from?', options: [opt('Din Idaho, SUA.', 'From Idaho, USA.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Idaho? Bine ai venit! Aeroportul e spre nord, trenul de la peronul 1.', npcResponseEnglish: 'Idaho? Welcome! Airport is north, train from platform 1.', options: [opt('Mulțumesc, Vasile!', 'Thanks, Vasile!', DialogueResultType.POSITIVE, ''), opt('La revedere!', 'Goodbye!', DialogueResultType.NEUTRAL, '')] }), opt('Sunt pierdut.', 'I\'m lost.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Înțeleg. Trenul spre aeroport, peronul 1.', npcResponseEnglish: 'I understand. Train to airport, platform 1.', options: [opt('Mulțumesc!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.ROMANIA, 'ro_5', 'Alina', 'Airport Desk Clerk', 'Zborul spre Idaho este la poarta șapte. Predați bagajul?', 'The flight to Idaho is at gate seven. Handing over bag?',
    [
      opt('Am nevoie de un zbor spre Idaho!', 'I need a flight to Idaho!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'E un zbor cu escală la New York în 2 ore. Poarta 7.', npcResponseEnglish: 'There\'s a flight with a stop in New York in 2 hours. Gate 7.', options: [opt('Perfect! Mulțumesc!', 'Perfect! Thanks!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }),
      opt('Unde e poarta 7?', 'Where is gate 7?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Drept înainte, după control. La stânga.', npcResponseEnglish: 'Straight ahead, past control. On the left.', options: [opt('Mulțumesc!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Aeroportul ăsta e groaznic!', 'This airport is terrible!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Domnule, vă rog. Cum vă pot ajuta?', npcResponseEnglish: 'Sir, please. How can I help you?', options: [opt('Scuze, sunt stresat.', 'Sorry, I\'m stressed.', DialogueResultType.POSITIVE, ''), opt('OK, scuze.', 'OK, sorry.', DialogueResultType.NEUTRAL, '')] }),
      opt('Salut, sunt Steve, sunt pierdut.', 'Hi, I\'m Steve, I\'m lost.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Salut Steve! Fără griji. Zbor în 2 ore. Poarta 7!', npcResponseEnglish: 'Hi Steve! No worries. Flight in 2 hours. Gate 7!', options: [opt('Fantastic! Mulțumesc!', 'Fantastic! Thanks!', DialogueResultType.POSITIVE, ''), opt('Super!', 'Great!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.ROMANIA, 'ro_6', 'Cornel', 'Gate Agent', 'Îmbarcare finală către SUA. Pașaportul și viza, vă rog.', 'Final boarding to USA. Passport and visa, please.',
    [
      opt('Poftim! Merg acasă!', 'Here! I\'m going home!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Domnul Steve. Loc 8B. Bine ați venit la bord!', npcResponseEnglish: 'Mr. Steve. Seat 8B. Welcome aboard!', options: [opt('Mulțumesc! În sfârșit acasă!', 'Thanks! Finally home!', DialogueResultType.POSITIVE, ''), opt('La revedere, România!', 'Goodbye, Romania!', DialogueResultType.POSITIVE, '')] }),
      opt('Zborul ăsta merge la Idaho?', 'Does this flight go to Idaho?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Da, cu escală la New York. Ultimul zbor. Urcați?', npcResponseEnglish: 'Yes, with a stop in New York. Last flight. Getting on?', options: [opt('Da! Acum!', 'Yes! Now!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }),
      opt('Nu vreau să plec!', 'I don\'t want to leave!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Ultimul zbor. Dacă nu urcați, rămâneți în România pentru totdeauna.', npcResponseEnglish: 'Last flight. If you don\'t get on, you stay in Romania forever.', options: [opt('OK, urc.', 'OK, I\'m getting on.', DialogueResultType.POSITIVE, ''), opt('România e frumoasă dar... OK.', 'Romania is beautiful but... OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Mulțumesc pentru tot, România.', 'Thank you for everything, Romania.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Ce frumos! România vă urează drum bun. Loc 8B, Steve!', npcResponseEnglish: 'How beautiful! Romania wishes you a good trip. Seat 8B, Steve!', options: [opt('La revedere, România! Salut, Idaho!', 'Goodbye, Romania! Hello, Idaho!', DialogueResultType.POSITIVE, ''), opt('Pa!', 'Bye!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
];

const JERSEY_SHORE_NPCS: NPC[] = [
  buildNPC(Country.JERSEY_SHORE, 'js_1', 'Vinny', 'Door Guy', 'Yo! You look like a total jabroni. Where\'s your gel?', 'Yo! You look like a total jabroni. Where\'s your gel?',
    [
      opt('Hey bro, just looking for a drink.', 'Hey bro, just looking for a drink.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Alright, come in! First round\'s on the house for lost souls.', npcResponseEnglish: 'Alright, come in! First round\'s on the house for lost souls.', options: [opt('Thanks, man! Where\'s the bus stop?', 'Thanks, man! Where\'s the bus stop?', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Down the boardwalk, can\'t miss it. Peace out!', npcResponseEnglish: 'Down the boardwalk, can\'t miss it. Peace out!', options: [opt('Thanks bro!', 'Thanks bro!', DialogueResultType.POSITIVE, ''), opt('Later!', 'Later!', DialogueResultType.NEUTRAL, '')] }), opt('Just vibing.', 'Just vibing.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Ha, respect. Bus stop\'s at the boardwalk end.', npcResponseEnglish: 'Ha, respect. Bus stop\'s at the boardwalk end.', options: [opt('Cool, thanks!', 'Cool, thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('Where\'s the airport, bro?', 'Where\'s the airport, bro?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Newark? Take the bus from the boardwalk end. Want a drink first?', npcResponseEnglish: 'Newark? Take the bus from the boardwalk end. Want a drink first?', options: [opt('Sure, one for the road!', 'Sure, one for the road!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'That\'s the spirit! Bus leaves every hour.', npcResponseEnglish: 'That\'s the spirit! Bus leaves every hour.', options: [opt('Thanks, Vinny!', 'Thanks, Vinny!', DialogueResultType.POSITIVE, ''), opt('Later!', 'Later!', DialogueResultType.NEUTRAL, '')] }), opt('No, gotta bounce.', 'No, gotta bounce.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Alright, boardwalk end, can\'t miss it.', npcResponseEnglish: 'Alright, boardwalk end, can\'t miss it.', options: [opt('Thanks!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('Peace.', 'Peace.', DialogueResultType.NEUTRAL, '')] })] }),
      opt('You look like a total jabroni!', 'You look like a total jabroni!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'WHAT?! Bro, I\'m the DOOR GUY! Nobody calls ME a jabroni! Get out!', npcResponseEnglish: 'WHAT?! Bro, I\'m the DOOR GUY! Nobody calls ME a jabroni! Get out!', options: [opt('Sorry man, I\'m just stressed.', 'Sorry man, I\'m just stressed.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Alright, alright. Chill. Bus is at the boardwalk.', npcResponseEnglish: 'Alright, alright. Chill. Bus is at the boardwalk.', options: [opt('Thanks, sorry.', 'Thanks, sorry.', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] }), opt('Your club sucks!', 'Your club sucks!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'GET OUT! And don\'t come back, meathead!', npcResponseEnglish: 'GET OUT! And don\'t come back, meathead!', options: [opt('Sorry...', 'Sorry...', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] })] }),
      opt('What\'s up, I\'m Steve from Idaho.', 'What\'s up, I\'m Steve from Idaho.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Idaho! Never met anyone from Idaho! Welcome to the Shore! Free drink!', npcResponseEnglish: 'Idaho! Never met anyone from Idaho! Welcome to the Shore! Free drink!', options: [opt('Awesome, thanks Vinny!', 'Awesome, thanks Vinny!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'No problem! Bus is down the boardwalk. Get home safe!', npcResponseEnglish: 'No problem! Bus is down the boardwalk. Get home safe!', options: [opt('Later, Vinny!', 'Later, Vinny!', DialogueResultType.POSITIVE, ''), opt('Peace!', 'Peace!', DialogueResultType.NEUTRAL, '')] }), opt('Where do I catch a bus?', 'Where do I catch a bus?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'End of the boardwalk. Every hour. Can\'t miss it.', npcResponseEnglish: 'End of the boardwalk. Every hour. Can\'t miss it.', options: [opt('Thanks!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] })] }),
    ]
  ),
  buildNPC(Country.JERSEY_SHORE, 'js_2', 'DJ Pauly', 'Club DJ', 'Yo! The beat is bumping! Fist pump time! Where you headed?', 'Yo! The beat is bumping! Fist pump time! Where you headed?',
    [
      opt('I need to get to Newark Airport!', 'I need to get to Newark Airport!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'My cousin Tony drives a cab! He\'s outside! Tell him Pauly sent you!', npcResponseEnglish: 'My cousin Tony drives a cab! He\'s outside! Tell him Pauly sent you!', options: [opt('Thanks, Pauly!', 'Thanks, Pauly!', DialogueResultType.POSITIVE, ''), opt('Cool!', 'Cool!', DialogueResultType.NEUTRAL, '')] }),
      opt('Where\'s the bus stop?', 'Where\'s the bus stop?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Bus? Forget the bus! My cousin Tony has a cab outside. He\'ll hook you up!', npcResponseEnglish: 'Bus? Forget the bus! My cousin Tony has a cab outside. He\'ll hook you up!', options: [opt('Sweet, thanks!', 'Sweet, thanks!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Your music sucks!', 'Your music sucks!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'WHAT?! My beats are FIRE! Ronnie, throw this guy out!', npcResponseEnglish: 'WHAT?! My beats are FIRE! Ronnie, throw this guy out!', options: [opt('Sorry man, I\'m having a bad day.', 'Sorry man, I\'m having a bad day.', DialogueResultType.POSITIVE, ''), opt('OK, OK...', 'OK, OK...', DialogueResultType.NEUTRAL, '')] }),
      opt('Hey, I\'m Steve!', 'Hey, I\'m Steve!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'STEVE! DJ Pauly D! Fist bump! My cousin has a cab outside. Tell him I sent you!', npcResponseEnglish: 'STEVE! DJ Pauly D! Fist bump! My cousin has a cab outside. Tell him I sent you!', options: [opt('You\'re the best, Pauly!', 'You\'re the best, Pauly!', DialogueResultType.POSITIVE, ''), opt('Thanks!', 'Thanks!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.JERSEY_SHORE, 'js_3', 'Big Jerry', 'Pizza Maker', 'Yo! Fresh sausage pie, hot out of the brick oven. Buying a slice?', 'Yo! Fresh sausage pie, hot out of the brick oven. Buying a slice?',
    [
      opt('Yeah! Give me two slices!', 'Yeah! Give me two slices!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Coming right up! Five bucks. Train station\'s two blocks down.', npcResponseEnglish: 'Coming right up! Five bucks. Train station\'s two blocks down.', options: [opt('Thanks, Jerry!', 'Thanks, Jerry!', DialogueResultType.POSITIVE, ''), opt('Thanks.', 'Thanks.', DialogueResultType.NEUTRAL, '')] }),
      opt('How much for a slice?', 'How much for a slice?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Three bucks a slice! Best in Jersey!', npcResponseEnglish: 'Three bucks a slice! Best in Jersey!', options: [opt('Deal! One slice!', 'Deal! One slice!', DialogueResultType.POSITIVE, ''), opt('Nah, I\'m good.', 'Nah, I\'m good.', DialogueResultType.NEUTRAL, '')] }),
      opt('This pizza looks terrible!', 'This pizza looks terrible!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'TERRIBLE?! My family\'s been making pizza for 40 years! Get outta here!', npcResponseEnglish: 'TERRIBLE?! My family\'s been making pizza for 40 years! Get outta here!', options: [opt('Sorry, sorry! I\'ll take a slice.', 'Sorry, sorry! I\'ll take a slice.', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] }),
      opt('Hey, I\'m Steve!', 'Hey, I\'m Steve!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'STEVE! Big Jerry! Have a free slice, you look hungry! Station\'s two blocks down.', npcResponseEnglish: 'STEVE! Big Jerry! Have a free slice, you look hungry! Station\'s two blocks down.', options: [opt('You\'re awesome, Jerry!', 'You\'re awesome, Jerry!', DialogueResultType.POSITIVE, ''), opt('Thanks!', 'Thanks!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.JERSEY_SHORE, 'js_4', 'Joey', 'Beach Patrol', 'No coolers on the beach, pal. Let me see some ID.', 'No coolers on the beach, pal. Let me see some ID.',
    [
      opt('Here\'s my ID, officer.', 'Here\'s my ID, officer.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Steve, Idaho. You\'re a long way from home. Airport\'s that way.', npcResponseEnglish: 'Steve, Idaho. You\'re a long way from home. Airport\'s that way.', options: [opt('Thanks, officer!', 'Thanks, officer!', DialogueResultType.POSITIVE, ''), opt('OK.', 'OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('I don\'t have ID on me.', 'I don\'t have ID on me.', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'No ID? That\'s a problem. Got anything with a photo?', npcResponseEnglish: 'No ID? That\'s a problem. Got anything with a photo?', options: [opt('I have my license in my pocket.', 'I have my license in my pocket.', DialogueResultType.NEUTRAL, ''), opt('No, nothing.', 'No, nothing.', DialogueResultType.NEUTRAL, '')] }),
      opt('Get out of my face!', 'Get out of my face!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Excuse me?! ID. NOW. Or you\'re spending the night in the tank.', npcResponseEnglish: 'Excuse me?! ID. NOW. Or you\'re spending the night in the tank.', options: [opt('Sorry! Here\'s my ID!', 'Sorry! Here\'s my ID!', DialogueResultType.POSITIVE, ''), opt('OK, OK...', 'OK, OK...', DialogueResultType.POSITIVE, '')] }),
      opt('Hey, I\'m Steve from Idaho.', 'Hey, I\'m Steve from Idaho.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Idaho? You\'re definitely lost. Train to Newark Airport is at the station.', npcResponseEnglish: 'Idaho? You\'re definitely lost. Train to Newark Airport is at the station.', options: [opt('Thanks, Joey!', 'Thanks, Joey!', DialogueResultType.POSITIVE, ''), opt('Got it.', 'Got it.', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.JERSEY_SHORE, 'js_5', 'Sal', 'Airport Skycap', 'Bags checked curbside! Show me your flight ticket.', 'Bags checked curbside! Show me your flight ticket.',
    [
      opt('I need a flight to Idaho!', 'I need a flight to Idaho!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Idaho? There\'s one via Denver in 2 hours. Gate 12. Move it!', npcResponseEnglish: 'Idaho? There\'s one via Denver in 2 hours. Gate 12. Move it!', options: [opt('Thanks, Sal!', 'Thanks, Sal!', DialogueResultType.POSITIVE, ''), opt('OK!', 'OK!', DialogueResultType.NEUTRAL, '')] }),
      opt('Where\'s gate 12?', 'Where\'s gate 12?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Through security, turn left. Can\'t miss it.', npcResponseEnglish: 'Through security, turn left. Can\'t miss it.', options: [opt('Thanks!', 'Thanks!', DialogueResultType.POSITIVE, ''), opt('Got it.', 'Got it.', DialogueResultType.NEUTRAL, '')] }),
      opt('This airport is a dump!', 'This airport is a dump!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Hey! This is Newark! Show some respect! Gate 12, pal. MOVE.', npcResponseEnglish: 'Hey! This is Newark! Show some respect! Gate 12, pal. MOVE.', options: [opt('Sorry, I\'m stressed.', 'Sorry, I\'m stressed.', DialogueResultType.POSITIVE, ''), opt('OK...', 'OK...', DialogueResultType.NEUTRAL, '')] }),
      opt('Hey Sal, I\'m Steve. I\'m lost.', 'Hey Sal, I\'m Steve. I\'m lost.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Steve! Don\'t worry. Flight to Idaho in 2 hours. Gate 12. I got you!', npcResponseEnglish: 'Steve! Don\'t worry. Flight to Idaho in 2 hours. Gate 12. I got you!', options: [opt('You\'re a lifesaver, Sal!', 'You\'re a lifesaver, Sal!', DialogueResultType.POSITIVE, ''), opt('Thanks!', 'Thanks!', DialogueResultType.NEUTRAL, '')] }),
    ]
  ),
  buildNPC(Country.JERSEY_SHORE, 'js_6', 'Captain Dave', 'Pilot', 'We\'re cleared for takeoff back to Boise, Idaho. Seatbelt time.', 'We\'re cleared for takeoff back to Boise, Idaho. Seatbelt time.',
    [
      opt('Finally! Let\'s go home!', 'Finally! Let\'s go home!', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Welcome aboard, Steve! Seat 7A. Next stop: IDAHO!', npcResponseEnglish: 'Welcome aboard, Steve! Seat 7A. Next stop: IDAHO!', options: [opt('IDAHO HERE I COME!', 'IDAHO HERE I COME!', DialogueResultType.POSITIVE, ''), opt('Finally!', 'Finally!', DialogueResultType.POSITIVE, '')] }),
      opt('Is this the flight to Idaho?', 'Is this the flight to Idaho?', DialogueResultType.NEUTRAL, '', { npcResponseLocal: 'Boise, Idaho. Last flight today. You getting on or what?', npcResponseEnglish: 'Boise, Idaho. Last flight today. You getting on or what?', options: [opt('YES! Let\'s go!', 'YES! Let\'s go!', DialogueResultType.POSITIVE, ''), opt('How long is the flight?', 'How long is the flight?', DialogueResultType.NEUTRAL, '')] }),
      opt('I don\'t wanna leave!', 'I don\'t wanna leave!', DialogueResultType.OFFENSIVE, '', { npcResponseLocal: 'Last flight, buddy. Get on or live on the Jersey Shore forever.', npcResponseEnglish: 'Last flight, buddy. Get on or live on the Jersey Shore forever.', options: [opt('OK, OK, I\'m getting on.', 'OK, OK, I\'m getting on.', DialogueResultType.POSITIVE, ''), opt('Jersey\'s not bad but... OK.', 'Jersey\'s not bad but... OK.', DialogueResultType.NEUTRAL, '')] }),
      opt('Thanks for everything, Jersey Shore.', 'Thanks for everything, Jersey Shore.', DialogueResultType.POSITIVE, '', { npcResponseLocal: 'Aw man, that\'s beautiful! Seat 7A, Steve. Let\'s get you home!', npcResponseEnglish: 'Aw man, that\'s beautiful! Seat 7A, Steve. Let\'s get you home!', options: [opt('Goodbye Jersey! Hello Idaho!', 'Goodbye Jersey! Hello Idaho!', DialogueResultType.POSITIVE, ''), opt('Peace out!', 'Peace out!', DialogueResultType.POSITIVE, '')] }),
    ]
  ),
];

// ============================================================
// EXPORT: Complete game data
// ============================================================
export const GAME_DATA: Record<string, NPC[]> = {
  [Country.SPAIN]: SPAIN_NPCS,
  [Country.ITALY]: ITALY_NPCS,
  [Country.GERMANY]: GERMANY_NPCS,
  [Country.SWEDEN]: SWEDEN_NPCS,
  [Country.ROMANIA]: ROMANIA_NPCS,
  [Country.JERSEY_SHORE]: JERSEY_SHORE_NPCS,
};

export const COUNTRY_VOCAB_POOLS: Record<Country, VocabularyItem[]> = {
  [Country.SPAIN]: [
    {word: "Cerveza", translation: "Beer"}, {word: "Baño", translation: "Bathroom"}, {word: "Ayuda", translation: "Help"},
    {word: "Gracias", translation: "Thanks"}, {word: "Perdón", translation: "Sorry"}, {word: "Pollo", translation: "Chicken"},
    {word: "Agua", translation: "Water"}, {word: "Maleta", translation: "Suitcase"}, {word: "Avión", translation: "Plane"},
    {word: "Tren", translation: "Train"}, {word: "Hola", translation: "Hello"}, {word: "Estación", translation: "Station"},
    {word: "Churros", translation: "Deep-Fried Dough"}, {word: "Dinero", translation: "Money"}, {word: "Playa", translation: "Beach"},
    {word: "Vuelo", translation: "Flight"}, {word: "Aeropuerto", translation: "Airport"}, {word: "Pasaporte", translation: "Passport"},
    {word: "Billete", translation: "Ticket"}, {word: "Comida", translation: "Food"}, {word: "Mañana", translation: "Morning / Tomorrow"}
  ],
  [Country.ITALY]: [
    {word: "Caffè", translation: "Coffee"}, {word: "Bagno", translation: "Bathroom"}, {word: "Aiuto", translation: "Help"},
    {word: "Grazie", translation: "Thanks"}, {word: "Prego", translation: "You're welcome"}, {word: "Pasta", translation: "Pasta"},
    {word: "Acqua", translation: "Water"}, {word: "Aeroporto", translation: "Airport"}, {word: "Gondola", translation: "Canal Boat"},
    {word: "Buongiorno", translation: "Good Morning"}, {word: "Stazione", translation: "Station"}, {word: "Gelato", translation: "Ice Cream"},
    {word: "Pizza", translation: "Pizza"}, {word: "Biglietto", translation: "Ticket"}, {word: "Passaporto", translation: "Passport"},
    {word: "Soldi", translation: "Money"}, {word: "Volo", translation: "Flight"}, {word: "A presto", translation: "See you soon"}
  ],
  [Country.GERMANY]: [
    {word: "Bier", translation: "Beer"}, {word: "Danke", translation: "Thanks"}, {word: "Bitte", translation: "Please / Welcome"},
    {word: "Flughafen", translation: "Airport"}, {word: "Brezel", translation: "Pretzel"}, {word: "Bahnhof", translation: "Station"},
    {word: "Geld", translation: "Money"}, {word: "Fahrkarte", translation: "Ticket"}, {word: "Ausweis", translation: "ID"},
    {word: "Wurst", translation: "Sausage"}, {word: "Flug", translation: "Flight"}, {word: "Ordnung", translation: "Order"},
    {word: "Wasser", translation: "Water"}, {word: "Guten Tag", translation: "Good Day"}, {word: "Auf Wiedersehen", translation: "Goodbye"}
  ],
  [Country.SWEDEN]: [
    {word: "Kaffe", translation: "Coffee"}, {word: "Tack", translation: "Thanks"}, {word: "Hej", translation: "Hi"},
    {word: "Flygplats", translation: "Airport"}, {word: "Kanelbulle", translation: "Cinnamon Bun"}, {word: "Tåg", translation: "Train"},
    {word: "Pengar", translation: "Money"}, {word: "Biljett", translation: "Ticket"}, {word: "Älg", translation: "Moose"},
    {word: "Fika", translation: "Coffee Break"}, {word: "Vatten", translation: "Water"}, {word: "Hejdå", translation: "Goodbye"},
    {word: "Öl", translation: "Beer"}
  ],
  [Country.ROMANIA]: [
    {word: "Bere", translation: "Beer"}, {word: "Mersi", translation: "Thanks"}, {word: "Salut", translation: "Hi"},
    {word: "Aeroport", translation: "Airport"}, {word: "Covrig", translation: "Pretzel"}, {word: "Gară", translation: "Station"},
    {word: "Bani", translation: "Money"}, {word: "Bilet", translation: "Ticket"}, {word: "Apă", translation: "Water"},
    {word: "Bună ziua", translation: "Good Day"}, {word: "La revedere", translation: "Goodbye"}, {word: "Zbor", translation: "Flight"}
  ],
  [Country.JERSEY_SHORE]: [
    {word: "Gabbagoul", translation: "Cured Meat"}, {word: "GTL", translation: "Gym Tan Laundry"}, {word: "Jabroni", translation: "Loser"},
    {word: "Smush", translation: "Hook Up"}, {word: "Snooki", translation: "A State of Mind"}, {word: "Meathead", translation: "Strong Person"},
    {word: "Pizza", translation: "Pizza Slice"}, {word: "Fist pump", translation: "Dance move"}, {word: "Fries", translation: "Greasy Fries"},
    {word: "Moolah", translation: "Money"}, {word: "Gate", translation: "Airport Gate"}, {word: "Boardwalk", translation: "Walkway"}
  ]
};
