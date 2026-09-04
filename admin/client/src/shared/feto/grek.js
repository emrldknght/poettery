/** @param state {FetoState} */
export function grek(state)
// сравнение выявленного размера с классическими
// _TemplateAccent - скорректированный шаблон гласных в формате О:. по нему можно определить соответствие ямбу и хорею, найти строки, которые не соответствуют им. Эталонный ямб это .О.О.О.О

{


//идеальный ритм
  let yamb = "1313131313131313131313131313131313131313131313131313131313131313";
  let horey = "313131313131313131313131313131313131313131313131313131313131313";
  let anapest = "113113113113113113113113113113113113113113113113113113113113113";
  let amfibrahy = "131131131131131131131131131131131131131131131131131131131131131";
  let daktil = "311311311311311311311311311311311311311311311311311311311311311311";


//измеряемый ритм
  let ritmstroka = state.Ritm.join(''); // базовый ритм в виде строки

  console.log("ritmstroka=" + ritmstroka);

// переводим TemplateAccent из О:. в шаблон 123
  let grekTemplateAccent = state.TemplateAccent;
  grekTemplateAccent = grekTemplateAccent.replace(/[О]/g, '3');
  grekTemplateAccent = grekTemplateAccent.replace(/[:]/g, '2');
  grekTemplateAccent = grekTemplateAccent.replace(/[.]/g, '1');

  console.log("grekTemplateAccent=" + "\n" + grekTemplateAccent);

// массив ритмов ------------------
  let grekTemplateAccentMas = grekTemplateAccent.split("\n");

  console.log("grekTemplateAccentMas=" + "\n" + grekTemplateAccentMas);

// реальный стих ------------------
  let grekStih = state.OriginalTextInput + "\n";
  let grekStihMas = grekStih.split("\n");

// сравниваем реальный ритм с идеальным ------------------
  let dlinaritma = ritmstroka.length;

// шаблон ритма
  let yambritm = yamb.substring(0, dlinaritma);
  let horeyritm = horey.substring(0, dlinaritma);
  let anapestritm = anapest.substring(0, dlinaritma);
  let amfibrahyritm = amfibrahy.substring(0, dlinaritma);
  let daktilritm = daktil.substring(0, dlinaritma);

  let grektext0 = "";
  let grektext1 = "";
  let grektext2 = "";
  let grektext3 = "";
  let grektext4 = "";
  let grektext5 = "";
  let grektext6 = "";
  let grektext7 = "";
  let grektext8 = "";
  let grektext9 = "";
  let grektext10 = "";
  let grektext11 = "";
  let grektext12 = "";
  let grektext13 = "";
  let grektext14 = "";
  let grektext15 = "";
  let nogrek = 0;
  let grekStihstroka = "";

  if (ritmstroka == yambritm) {
    grektext1 = "По древнегреческой классификации размер этого стихотворения  — классический " + Math.floor(dlinaritma / 2) + "-стопный ямб. В чистом виде такие размеры встречаются редко. ";
    console.log(grektext1);
    return grektext1;
  }
  if (ritmstroka == horeyritm) {
    grektext2 = "По древнегреческой классификации размер этого стихотворения — классический " + Math.floor(dlinaritma / 2) + "-стопный хорей. В чистом виде такие размеры встречаются редко. ";
    console.log(grektext2);
    return grektext2;
  }
  if (ritmstroka == anapestritm) {
    grektext3 = "По древнегреческой классификации размер этого стихотворения — классический " + Math.floor(dlinaritma / 3) + "-стопный анапест. В чистом виде такие размеры встречаются редко. ";
    console.log(grektext3);
    return grektext3;
  }
  if (ritmstroka == amfibrahyritm) {
    grektext4 = "По древнегреческой классификации размер этого стихотворения — классический " + Math.floor(dlinaritma / 3) + "-стопный амфибрахий. В чистом виде такие размеры встречаются редко. ";
    console.log(grektext4);
    return grektext4;
  }
  if (ritmstroka == daktilritm) {
    grektext5 = "По древнегреческой классификации размер этого стихотворения — классический " + Math.floor(dlinaritma / 3) + "-стопный дактиль. В чистом виде такие размеры встречаются редко. ";
    console.log(grektext5);
    return grektext5;
  }


// ищем не классические строки (пиррихий)
  let nogrektext1 = "";
  let nogrektext3 = "";
  let accentgrek3 = "|";
  let accentgrek2 = "|";
  let accentgrek1 = "|";
  let CountGrekNoaccent = 0;
  let CountGrekaccent = 0;

  for (let i = 0; i < dlinaritma; i = i + 1) {
    let ritmgrek = ritmstroka.substring(i, i + 1);
//console.log ("ritmgrek="+ritmgrek);

    if (ritmgrek == 3) {
      accentgrek3 = accentgrek3 + (i + 1) + "|";
    }
    if (ritmgrek == 2) {
      accentgrek2 = accentgrek2 + (i + 1) + "|";
    }
    if (ritmgrek == 1) {
      accentgrek1 = accentgrek1 + (i + 1) + "|";
    }

// если гласная по базовому ритму смешанная
    if (ritmgrek == 2) {

// то ищем строки в которых указанная позиция безударная
      CountGrekNoaccent = 0;
      CountGrekaccent = 0;
      nogrektext1 = "";
      nogrektext3 = "";
      for (let n = 0; n < grekTemplateAccentMas.length; n = n + 1) {
        let grekstroka = grekTemplateAccentMas[n];

        let glasngrek = grekstroka.substring(i, i + 1);

        grekStihstroka = grekStihMas[n].replace(/[.,:!?()-;]+$/gm, '');    // удалить знаки препинания в конце строки

        if (glasngrek == 1) {
          nogrektext1 = nogrektext1 + "\n" + "«" + grekStihstroka + "»" + "; ";
          CountGrekNoaccent = CountGrekNoaccent + 1;
        }

        if (glasngrek == 3) {
          nogrektext3 = nogrektext3 + "\n" + "«" + grekStihstroka + "»" + "; ";
          CountGrekaccent = CountGrekaccent + 1;
          console.log("nogrektext3=" + nogrektext3);
        }

      }

      if (CountGrekNoaccent > 1) {
        grektext12 = grektext12 + "\n" + "Сразу в " + CountGrekNoaccent + " строках " + (i + 1) + "-я гласная оказывается безударной: " + "\n" + nogrektext1 + ". " + "\n";
        console.log(grektext12);
      }

      if (CountGrekaccent > 1) {
        grektext12 = grektext12 + "\n" + "Однако в " + CountGrekaccent + " строках " + (i + 1) + "-я гласная оказывается ударной: " + "\n" + nogrektext3 + ". " + "\n";
        console.log(grektext12);
      }

    }

  }


  if (CountGrekNoaccent > 1 || CountGrekaccent > 1) {
    grektext11 = "Но в этом стихотворении есть целый ряд исключений. " + "\n";
    console.log(grektext11);

    grektext13 = "В некоторых учебниках такие исключения называют «пиррихий» (пропуск ударения) или «спондей» " +
      "(лишнее ударение). Но здесь таких исключений много, а значит — это уже не исключение, а тенденция. " +
      "Не случайность, а закономерность. Получается, что " + accentgrek2 + " слог не ударный и не безударный, " +
      "а скорее «слабоударный». А как же тогда называется этот стихотворный размер по-гречески? " +
      "Скорее всего — никак. Не у каждого размера есть русское или древнегреческое название. " +
      "Да это и не нужно. \n\n Размер стихотворения можно записать и цифрами, где 0-безударный, 1-слабоударный, " +
      "2- ударный слог. В данном случае: " + state.TriCodRitm + ".\n\n";

    grektext14 = "Но как же читать  стихотворение, размер которого даже названия не имеет? " +
      "Читать стихотворение следует, опираясь не на кем-то придуманный размер, а на ритм, заданный самими словами." +
      " Если в каждой строке стихотворения полноценно ударная " + accentgrek3 + " гласная, значит в этих гласных" +
      " и нужно делать сильный акцент. А на " + accentgrek2 + " слоге делать слабое ударение, или не делать совсем." +
      " Если ударения делать чаще, то это приведёт к искажённому произношению некоторых слов. " +
      "Так происходит потому, что в русском языке много длинных слов. " +
      "А в одном русском слове не может быть два ударения. На слово «длинношеее» приходится три «е», и только одно " +
      "из них — ударное.  Вот и получается, что в русской речи от одной ударной гласной до другой — " +
      "большой промежуток. Гораздо больше, чем в классическом ямбе и хорее. " +
      "\n\nСтоит ли коверкать русский язык, пытаясь втиснуть его в чужую схему? " +
      "Стоит ли долдонить стихотворение, выделяя в нём интонационно каждый второй слог? " +
      "Попробуйте прочитать это стихотворение с учётом реальных ударений. " +
      "Вы убедитесь, что без лишних ударений на " + accentgrek2 + " слог стихотворение звучит более плавно и " +
      "естественно. Да что там говорить, стихотворение теперь звучит музыкально! \n\nА может в этом стихотворении " +
      "вообще нет ритма и размера, или в размере и ритме допущена ошибка? Никакой ошибки нет! И ритм здесь очень " +
      "даже чёткий. Исключительно безударными являются " + accentgrek1 + " гласные в каждой строке. В каждой! " +
      "Именно безударные гласные задают базовый ритм стихотворения. Русский классический стих ритмичен, " +
      "как вдох и выдох. Безударная позиция в стихотворении — это как вдох, ударная — как выдох. И вся русская речь " +
      "естественна, как само дыхание.";
  }


//идеальный ритм безударных
  let byamb = "|1|3|5|";
  let bhorey = "|2|4|6|";
  let banapest = "|1|2|4|";
  let bamfibrahy = "|1|3|4|";
  let bdaktil = "|2|3|5|";

//ищем идеальный ритм безударных
  let britm = accentgrek1.substring(0, 7); // трёхсложные
  console.log("britm=" + britm);

//идеальный ритм ударных
  let uyamb = "|2|4|6|";
  let uhorey = "|1|3|5|";
  let uanapest = "|3|6|9|";
  let uamfibrahy = "|2|5|8|";
  let udaktil = "|1|4|7|";

//ищем идеальный ритм ударных
  let uritm = accentgrek3.substring(0, 7); // трёхсложные
  console.log("uritm=" + uritm);


  if (bhorey == britm || uhorey == uritm) {
    grektext6 = "Размер этого стихотворения — не классический хорей. В классическом хорее ударной должна быть первая, третья, пятая, седьмая, девятая гласная в строке. Остальные должны быть безударными. ";
    console.log(grektext6);
  }
  if (byamb == britm || uyamb == uritm) {
    grektext7 = "Размер этого стихотворения —  не классический ямб. В классическом ямбе ударной должна быть вторая, четвёртая, шестая, восьмая, десятая гласная в строке. Остальные должны быть безударными. ";
    console.log(grektext7);
  }

  if (bdaktil == britm || udaktil == uritm) {
    grektext8 = "Размер этого стихотворения —  не классический дактиль. В классическом дактиле ударной должна быть первая, четвёртая, седьмая гласная в строке. Остальные должны быть безударными. ";
    console.log(grektext8);
  }
  if (bamfibrahy == britm || uamfibrahy == uritm) {
    grektext9 = "Размер этого стихотворения — не классический амфибрахий. В классическом амфибрахии ударной должна быть вторая, пятая, восьмая гласная в строке. Остальные должны быть безударными. ";
    console.log(grektext9);
  }
  if (banapest == britm || uanapest == uritm) {
    grektext10 = "Размер этого стихотворения — не классический анапест. В классическом анапесте ударной должна быть третья, шестая, девятая гласная в строке. Остальные должны быть безударными. ";
    console.log(grektext10);
  }


  grektext0 = "\n" + grektext1 + grektext2 + grektext3 + grektext4 + grektext5 + grektext6 + grektext7 + grektext8 + grektext9 + grektext10 + grektext11 + grektext12 + "\n" + grektext13 + grektext14 + "\n";

  grektext0 = grektext0.replace(/; ./ig, '. ');

  console.log(grektext0);
// document.getElementById("ContainerAnaliz1f").innerHTML=grektext0;
  return grektext0;
}
