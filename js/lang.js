// /js/lang.js
(function(){
  const strings = {
    en:{
      common:{ start:"Start Recording", stories:"My Stories", view:"View My Stories", record:"Record" },
      home:{
        appLabel:"Memoir App",
        heroA:"Preserve Your",
        heroB:"Memories Forever",
        heroBlurb:"Record once, keep for generations.",
        startBlurb:"One tap to begin. Add a title and “when it happened” later.",
        viewBlurb:"Browse, rewrite with AI, export, and share with your family."
      },
      features:{
        f1Title:"Smart Transcription", f1Text:"AI-powered voice-to-text conversion.",
        f2Title:"Multi-language Support", f2Text:"Record and transcribe in multiple languages.",
        f3Title:"Private Library", f3Text:"Organize and share securely with your family."
      },
      pricing:{
        title:"Pricing", premium:"Premium", premiumPrice:"€4.99/month",
        family:"Family", familyPrice:"€7.99/month", familyNote:"up to 4 read-only family members",
        upgrade:"Upgrade"
      },
      faq:{
        title:"FAQ",
        q1:"Is there a free plan?", a1:"Yes, you can try the app for free before upgrading.",
        q2:"Which languages are supported?", a2:"English, Français, Nederlands, Español (more coming).",
        q3:"How is transcription done?", a3:"Server-side Whisper for high accuracy; works offline then syncs later."
      },
      record:{
        title:"Record",
        suggested:"Today's suggested prompts",
        refresh:"Suggest other prompts",
        notes:"Notes (optional)",
        titleLabel:"Title", titlePh:"Story title",
        when:"When did this happen?", whenPh:'e.g. "summer 1945", "early 2018", "15 Feb 1972"',
        photo:"Add photo (optional)",
        transcript:"Transcript",
        placeholder:"Your words will appear here…",
        save:"Save story"
      },
      stories:{
        title:"My Stories",
        blurb:"Record once, keep for generations.",
        storiesLabel:"Stories",
        familyLabel:"Family Members",
        inviteLabel:"Invite Family Member",
        invitePh:"email@example.com",
        inviteBtn:"Invite",
        listHeader:"My Stories",
        listEmpty:"No stories yet."
      }
    },

    fr:{
      common:{ start:"Commencer l’enregistrement", stories:"Mes histoires", view:"Voir mes histoires", record:"Enregistrer" },
      home:{
        appLabel:"Mémoire",
        heroA:"Conservez vos",
        heroB:"souvenirs pour toujours",
        heroBlurb:"Enregistrez une fois, gardez pour des générations.",
        startBlurb:"Un seul geste pour commencer. Ajoutez un titre et “quand c’était”.",
        viewBlurb:"Parcourez, réécrivez avec l’IA, exportez et partagez en famille."
      },
      features:{
        f1Title:"Transcription intelligente", f1Text:"Reconnaissance vocale avec IA.",
        f2Title:"Multi-langue", f2Text:"Enregistrez et transcrivez dans plusieurs langues.",
        f3Title:"Bibliothèque privée", f3Text:"Organisez et partagez en toute sécurité."
      },
      pricing:{
        title:"Tarifs", premium:"Premium", premiumPrice:"4,99 € / mois",
        family:"Famille", familyPrice:"7,99 € / mois", familyNote:"jusqu’à 4 membres en lecture seule",
        upgrade:"Passer à l’offre"
      },
      faq:{
        title:"FAQ",
        q1:"Y a-t-il une formule gratuite ?", a1:"Oui, vous pouvez essayer gratuitement avant d’abonner.",
        q2:"Quelles langues sont prises en charge ?", a2:"Anglais, Français, Néerlandais, Espagnol (bientôt plus).",
        q3:"Comment est faite la transcription ?", a3:"Whisper côté serveur ; fonctionne hors-ligne puis se synchronise."
      },
      record:{
        title:"Enregistrer",
        suggested:"Suggestions du jour",
        refresh:"Suggérer d’autres invites",
        notes:"Notes (optionnel)",
        titleLabel:"Titre", titlePh:"Titre de l’histoire",
        when:"Quand cela s’est-il produit ?", whenPh:'ex. "été 1945", "début 2018", "15 fév 1972"',
        photo:"Ajouter une photo (optionnel)",
        transcript:"Transcription",
        placeholder:"Vos mots apparaîtront ici…",
        save:"Enregistrer l’histoire"
      },
      stories:{
        title:"Mes histoires",
        blurb:"Enregistrez une fois, gardez pour des générations.",
        storiesLabel:"Histoires",
        familyLabel:"Membres de la famille",
        inviteLabel:"Inviter un membre de la famille",
        invitePh:"email@exemple.com",
        inviteBtn:"Inviter",
        listHeader:"Mes histoires",
        listEmpty:"Pas encore d’histoires."
      }
    },

    nl:{
      common:{ start:"Opname starten", stories:"Mijn verhalen", view:"Bekijk mijn verhalen", record:"Opnemen" },
      home:{
        appLabel:"Memoir App",
        heroA:"Bewaar je",
        heroB:"herinneringen voor altijd",
        heroBlurb:"Neem één keer op en bewaar het voor generaties.",
        startBlurb:"Met één tik start je. Titel en ‘wanneer het gebeurde’ kan later.",
        viewBlurb:"Blader, herschrijf met AI, exporteer en deel met familie."
      },
      features:{
        f1Title:"Slimme transcriptie", f1Text:"Stem-naar-tekst met AI.",
        f2Title:"Meertalige ondersteuning", f2Text:"Opnemen en transcriberen in meerdere talen.",
        f3Title:"Privébibliotheek", f3Text:"Organiseer en deel veilig met familie."
      },
      pricing:{
        title:"Prijzen", premium:"Premium", premiumPrice:"€4,99/maand",
        family:"Familie", familyPrice:"€7,99/maand", familyNote:"tot 4 alleen-lezen familieleden",
        upgrade:"Upgrade"
      },
      faq:{
        title:"FAQ",
        q1:"Is er een gratis plan?", a1:"Ja, je kunt de app gratis proberen voordat je upgrade.",
        q2:"Welke talen worden ondersteund?", a2:"Engels, Frans, Nederlands, Spaans (meer volgt).",
        q3:"Hoe gebeurt de transcriptie?", a3:"Whisper op de server; werkt offline en synchroniseert later."
      },
      record:{
        title:"Opnemen",
        suggested:"Suggesties van vandaag",
        refresh:"Andere suggesties",
        notes:"Notities (optioneel)",
        titleLabel:"Titel", titlePh:"Titel van het verhaal",
        when:"Wanneer gebeurde dit?", whenPh:'bijv. "zomer 1945", "begin 2018", "15 feb 1972"',
        photo:"Foto toevoegen (optioneel)",
        transcript:"Transcriptie",
        placeholder:"Je woorden verschijnen hier…",
        save:"Verhaal opslaan"
      },
      stories:{
        title:"Mijn verhalen",
        blurb:"Neem één keer op en bewaar het voor generaties.",
        storiesLabel:"Verhalen",
        familyLabel:"Familieleden",
        inviteLabel:"Familielid uitnodigen",
        invitePh:"email@voorbeeld.com",
        inviteBtn:"Uitnodigen",
        listHeader:"Mijn verhalen",
        listEmpty:"Nog geen verhalen."
      }
    },

    es:{
      common:{ start:"Comenzar a grabar", stories:"Mis historias", view:"Ver mis historias", record:"Grabar" },
      home:{
        appLabel:"Memoir",
        heroA:"Conserva tus",
        heroB:"recuerdos para siempre",
        heroBlurb:"Graba una vez y guárdalo para generaciones.",
        startBlurb:"Un toque para empezar. Añade título y “cuándo ocurrió” después.",
        viewBlurb:"Explora, reescribe con IA, exporta y comparte con tu familia."
      },
      features:{
        f1Title:"Transcripción inteligente", f1Text:"De voz a texto con IA.",
        f2Title:"Soporte multilingüe", f2Text:"Graba y transcribe en varios idiomas.",
        f3Title:"Biblioteca privada", f3Text:"Organiza y comparte de forma segura con tu familia."
      },
      pricing:{
        title:"Precios", premium:"Premium", premiumPrice:"4,99 €/mes",
        family:"Familiar", familyPrice:"7,99 €/mes", familyNote:"hasta 4 familiares de solo lectura",
        upgrade:"Mejorar"
      },
      faq:{
        title:"FAQ",
        q1:"¿Hay un plan gratuito?", a1:"Sí, puedes probar la app gratis antes de mejorar el plan.",
        q2:"¿Qué idiomas están soportados?", a2:"Inglés, Francés, Neerlandés, Español (más en camino).",
        q3:"¿Cómo se hace la transcripción?", a3:"Whisper en el servidor; funciona sin conexión y sincroniza luego."
      },
      record:{
        title:"Grabar",
        suggested:"Sugerencias de hoy",
        refresh:"Sugerir otras",
        notes:"Notas (opcional)",
        titleLabel:"Título", titlePh:"Título de la historia",
        when:"¿Cuándo ocurrió?", whenPh:'p. ej. "verano de 1945", "inicios de 2018", "15 feb 1972"',
        photo:"Añadir foto (opcional)",
        transcript:"Transcripción",
        placeholder:"Tus palabras aparecerán aquí…",
        save:"Guardar historia"
      },
      stories:{
        title:"Mis historias",
        blurb:"Graba una vez y guárdalo para generaciones.",
        storiesLabel:"Historias",
        familyLabel:"Miembros de la familia",
        inviteLabel:"Invitar a un familiar",
        invitePh:"email@ejemplo.com",
        inviteBtn:"Invitar",
        listHeader:"Mis historias",
        listEmpty:"Aún no hay historias."
      }
    }
  };

  // Public API
  window.MEMOIR_I18N = window.MEMOIR_I18N || {};
  window.MEMOIR_I18N.strings = strings;

  // get/set language (persist + broadcast)
  window.MEMOIR_I18N.getLang = function(){
    return localStorage.getItem('memoir_lang') || 'en';
  };
  window.MEMOIR_I18N.setLang = function(code){
    localStorage.setItem('memoir_lang', code);
    // Notify all pages (they listen to this)
    window.dispatchEvent(new CustomEvent('memoir:lang',{ detail:{ code } }));
  };
})();
