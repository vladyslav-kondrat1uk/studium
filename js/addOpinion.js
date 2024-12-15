/*
 * Created by Stefan Korecko, 2020-21
 * Opinions form processing functionality
 */

/*
This function works with the form:

<form id="opnFrm">
    <label for="nameElm">Your name:</label>
    <input type="text" name="login" id="nameElm" size="20" maxlength="50" placeholder="Enter your name here" required />
    <br><br>
    <label for="opnElm">Your opinion:</label>
    <textarea name="comment" id="opnElm" cols="50" rows="3" placeholder="Express your opinion here" required></textarea>
    <br><br>
    <input type="checkbox" id="willReturnElm" />
    <label for="willReturnElm">I will definitely return to this page.</label>
    <br><br>
    <button type="submit">Send</button>
</form>

 */
// export default function processOpnFrmData(event){
//     //1.prevent normal event (form sending) processing
//     event.preventDefault();

//     //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
//     const nopName = document.getElementById("nameElm").value.trim();
//     const nopOpn = document.getElementById("opnElm").value.trim();
//     const nopWillReturn = document.getElementById("willReturnElm").checked;

//     //3. Verify the data
//     if(nopName==="" || nopOpn===""){
//         window.alert("Please, enter both your name and opinion");
//         return;
//     }

//     //3. Add the data to the array opinions and local storage
//     const newOpinion =
//         {
//             name: nopName,
//             comment: nopOpn,
//             willReturn: nopWillReturn,
//             created: new Date()

//         };


//     let opinions = [];

//     if(localStorage.myTreesComments){
//         opinions=JSON.parse(localStorage.myTreesComments);
//     }

//     opinions.push(newOpinion);
//     localStorage.myTreesComments = JSON.stringify(opinions);


//     //5. Go to the opinions
//     window.location.hash="#opinions";

// }
// let feedBack = [];

// document.addEventListener("DOMContentLoaded", () => {
//   // Завантажуємо збережені дані з localStorage, якщо вони є
//   const storedData = localStorage.getItem("feedBack");
//   feedBack = storedData ? JSON.parse(storedData) : [];

//   renderData();
// });

// // Формуляр і кнопка скидання
// const form = document.getElementById("feedbackForm");
// const resetAllButton = document.getElementById("resetAll");

// form.addEventListener("submit", function (event) {
//   event.preventDefault(); // Перешкоджаємо стандартному відправленню форми

//   // Збираємо дані з форми
//   const name = document.getElementById("name").value.trim();
//   const email = document.getElementById("email").value.trim();
//   const imageUrl = document.getElementById("image-url").value.trim();
//   const opinion = document.getElementById("opinion").value.trim();
//   const keywords = document.getElementById("keywords").value.trim();
//   const contentType =
//     document.querySelector('select[name="content"]')?.value || "";
//   const moreOptions = Array.from(
//     document.querySelectorAll('input[name="more[]"]:checked')
//   ).map((checkbox) => checkbox.value);

//   const willReturn = document.getElementById("willReturnElm").checked;

//   // Перевіряємо, чи заповнені необхідні поля
//   if (name === "" || opinion === "") {
//     alert("Please, enter both your name and opinion.");
//     return;
//   }

//   // Створюємо об'єкт з новими даними
//   const feedbackData = {
//     name,
//     email,
//     imageUrl,
//     opinion,
//     contentType,
//     moreOptions,
//     keywords,
//     willReturn,
//     dateAdded: new Date().toLocaleDateString(), // Додаємо лише дату
//   };

//   // Додаємо нові дані в масив
//   feedBack.push(feedbackData);

//   // Якщо більше 3 елементів, видаляємо найстаріший
//   if (feedBack.length > 3) {
//     feedBack.shift();
//   }

//   // Оновлюємо localStorage
//   localStorage.setItem("feedBack", JSON.stringify(feedBack));

//   // Очищаємо форму після надсилання
//   form.reset();

//   // Оновлюємо відображення даних
//   renderData();

//   alert("Review successfully added!");
// });

// // Функція для рендерингу даних
// function renderData() {
//   const template = document.getElementById("template");
//   const target = document.getElementById("target");

//   if (!template || !target) {
//     console.error("Шаблон або цільовий елемент не знайдено!");
//     return;
//   }

//   // Використовуємо Mustache для рендерингу
//   const rendered = Mustache.render(template.innerHTML, { feedbacks: feedBack });
//   target.innerHTML = rendered;
// }

// // Кнопка для скидання всіх відгуків
// resetAllButton.addEventListener("click", function () {
//   if (confirm("Are you sure you want to delete all reviews?")) {
//     feedBack = []; // Очищаємо масив відгуків
//     localStorage.removeItem("feedBack"); // Видаляємо з localStorage
//     renderData(); // Оновлюємо відображення
//     alert("All reviews have been deleted!");
//   }
// });
// ---------------------------------------------------
// export default function processOpnFrmData(event) {
//   event.preventDefault();

//   const nopName = document.getElementById("nameElm").value.trim();
//   const nopEmail = document.getElementById("emailElm").value.trim();
//   const nopImageUrl = document.getElementById("imageUrlElm").value.trim();
//   const nopFeedbackType = document.querySelector("input[name='feedbackType']:checked")?.value || "";
//   const nopSubscribe = document.getElementById("subscribeElm").checked;
//   const nopWillReturn = document.getElementById("willReturnElm").checked;
//   const nopOpn = document.getElementById("opnElm").value.trim();
//   const nopKeywords = document.getElementById("keywordsElm").value.trim();

//   if (!nopName || !nopOpn || !nopFeedbackType) {
//       window.alert("Please, complete all required fields (name, opinion, feedback type).");
//       return;
//   }
//   const newOpinion = {
//       name: nopName,
//       email: nopEmail,
//       imageUrl: nopImageUrl,
//       feedbackType: nopFeedbackType,
//       subscribe: nopSubscribe,
//       willReturn: nopWillReturn,
//       comment: nopOpn,
//       keywords: nopKeywords,
//       created: new Date(),
//   };

//   let opinions = [];
//   if (localStorage.myTreesComments) {
//       opinions = JSON.parse(localStorage.myTreesComments);
//   }
//   opinions.push(newOpinion);
//   localStorage.myTreesComments = JSON.stringify(opinions);

//   window.location.hash = "#opinions";
// }

import Mustache from "./mustache.js";
export default function processOpnFrmData(event) {
  event.preventDefault();

  
  const nopName = document.getElementById("nameElm").value.trim();
  const nopEmail = document.getElementById("emailElm").value.trim();
  const nopImageUrl = document.getElementById("imageUrlElm").value.trim();
  const nopFeedbackType = document.querySelector("input[name='feedbackType']:checked")?.value || "";
  const nopSubscribe = document.getElementById("subscribeElm").checked;
  const nopWillReturn = document.getElementById("willReturnElm").checked;
  const nopOpn = document.getElementById("opnElm").value.trim();
  const nopKeywords = document.getElementById("keywordsElm").value.trim();

  if (!nopName || !nopOpn || !nopFeedbackType) {
      window.alert("Please, complete all required fields (name, opinion, feedback type).");
      return;
  }


  
  const newOpinion = {
      name: nopName,
      email: nopEmail,
      imageUrl: nopImageUrl,
      feedbackType: nopFeedbackType,
      subscribe: nopSubscribe,
      willReturn: nopWillReturn,
      comment: nopOpn,
      keywords: nopKeywords,
      created: new Date().toISOString(),
  };

  let opinions = [];
  if (localStorage.myTreesComments) {
      opinions = JSON.parse(localStorage.myTreesComments);
  }
  opinions.push(newOpinion);
  localStorage.myTreesComments = JSON.stringify(opinions);

  window.location.hash = "#opinions";
}

// Завантаження відгуків з localStorage та рендеринг
// export function renderOpinions() {
//   const opinionsContainer = document.getElementById("opinionsContainer");
//   const template = document.getElementById("template-opinions").innerHTML;
  
//   let opinions = [];
//   if (localStorage.myTreesComments) {
//       opinions = JSON.parse(localStorage.myTreesComments);
//   }

//   const renderedOpinions = opinions.map(opinion => {
//     return Mustache.render(template, {
//       feedbacks: opinions
//     });
//   }).join('');

//   if (opinionsContainer) {
//     opinionsContainer.innerHTML = renderedOpinions;
//   }
// }

export function renderOpinions() {
  const opinionsContainer = document.getElementById("opinionsContainer");
  const template = document.getElementById("template-opinions").innerHTML;

  let opinions = [];
  if (localStorage.myTreesComments) {
      opinions = JSON.parse(localStorage.myTreesComments);
  }

  const renderedOpinions = opinions.map(opinion => {
    return Mustache.render(template, {
      feedbacks: opinions
    });
  }).join('');

  if (opinionsContainer) {
    opinionsContainer.innerHTML = renderedOpinions;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  renderOpinions(); // Завантажити і відобразити відгуки після завантаження сторінки
});

document.addEventListener("DOMContentLoaded", () => {
  // Перевіряємо чи є кнопка для видалення коментарів
  const clearButton = document.getElementById("clearAllComments");
  
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      // Підтвердження видалення всіх коментарів
      if (confirm("Are you sure you want to delete all comments?")) {
        // Видаляємо всі коментарі з localStorage
        localStorage.removeItem("myTreesComments");
        
        // Оновлюємо відображення коментарів
        renderOpinions(); // Оновлення відображення списку коментарів
      }
    });
  }
});


