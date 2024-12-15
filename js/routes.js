import Mustache from "./mustache.js";
import processOpnFrmData from "./addOpinion.js";
import articleFormsHandler from "./articleFormsHendler.js";

export default [
    { hash: "welcome", target: "router-view", getTemplate: targetElm => document.getElementById(targetElm).innerHTML = document.getElementById("template-welcome").innerHTML },
    { hash: "articles", target: "router-view", getTemplate: fetchAndDisplayArticles },
    { hash: "opinions", target: "router-view", getTemplate: createHtml4opinions },
    { hash: "addOpinion",
        target: "router-view",
        getTemplate: targetElm => {
          
          document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML;
      
        
          const user = JSON.parse(localStorage.getItem("googleUser"));
          const authorField = document.getElementById("nameElm");
      
          if (user) {
            authorField.value = user.name; 
            authorField.disabled = true;  
          }
      
          
          document.getElementById("opnFrm").onsubmit = processOpnFrmData;
    }},
    { hash: "article", target: "router-view", getTemplate: fetchAndDisplayArticleDetail },
    { hash: "artEdit", target: "router-view", getTemplate: editArticle },
    { hash: "artDelete", target: "router-view", getTemplate: (targetElm, artIdFromHash, pageNumberFromHash, totalPagesFromHash) => deleteArticle(targetElm, artIdFromHash, pageNumberFromHash, totalPagesFromHash) },
    { hash: "artInsert", target: "router-view", getTemplate: insertArticle },
    { 
        hash: "artComment", 
        target: "comments-container", 
        getTemplate: fetchAndDisplayComments 
    }
    
];

const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const articlesPerPage = 20; 
function createHtml4opinions(targetElm){
    const opinionsFromStorage=localStorage.myTreesComments;
    let opinions=[];

    if(opinionsFromStorage){
        opinions=JSON.parse(opinionsFromStorage);
        opinions.forEach(opinion => {
            opinion.created = (new Date(opinion.created)).toDateString();
            opinion.willReturn = 
              opinion.willReturn?"I will return to this page.":"Sorry, one visit was enough.";
        });
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-opinions").innerHTML,
        opinions
        );
}   

// function fetchAndDisplayArticles(targetElm, offsetFromHash = 0, totalCountFromHash = 0) {
//     const articlesPerPage = 20;
//     const offset = Number(offsetFromHash);
//     const totalCount = Number(totalCountFromHash);

//     // Читаємо стан фільтра "мої статті"
//     const my = JSON.parse(localStorage.getItem("my")) || false;

//     // Формуємо URL із фільтром, якщо треба
//     const urlQuery = `?offset=${offset}&max=${articlesPerPage}`;
//     let url = `${urlBase}/article${urlQuery}`;
//     if (my) {
//         url += "&tag=volleyball";
//     }

//     const reqListener = function () {
//         if (this.status === 200) {
//             const responseJSON = JSON.parse(this.responseText);

//             const hasNext = offset + articlesPerPage < responseJSON.meta.totalCount;
//             const hasPrevious = offset > 0;

//             // Отримання повного змісту статей
//             const fetchFullContent = (article) => {
//                 return new Promise((resolve) => {
//                     const ajax = new XMLHttpRequest();
//                     ajax.addEventListener("load", function () {
//                         if (this.status === 200) {
//                             const fullArticle = JSON.parse(this.responseText);
//                             resolve({ ...article, content: fullArticle.content });
//                         } else {
//                             resolve(article); // Якщо не вдається отримати зміст, залишаємо статтю без змін
//                         }
//                     });
//                     ajax.open("GET", `${urlBase}/article/${article.id}`, true);
//                     ajax.send();
//                 });
//             };

//             // Завантаження повного контенту для всіх статей
//             const loadArticles = async () => {
//                 const articles = await Promise.all(
//                     responseJSON.articles.map(article => fetchFullContent(article))
//                 );

//                 const templateData = {
//                     articles: articles.map(article => ({
//                         ...article,
//                         detailLink: `#article/${article.id}/${offset}/${responseJSON.meta.totalCount}`,
//                     })),
//                     hasNext,
//                     hasPrevious,
//                     nextPage: hasNext ? offset + articlesPerPage : null,
//                     previousPage: hasPrevious ? Math.max(offset - articlesPerPage, 0) : null,
//                     isFiltered: my
//                 };

//                 // Рендеримо статті
//                 document.getElementById(targetElm).innerHTML = Mustache.render(
//                     document.getElementById("template-articles").innerHTML,
//                     templateData
//                 );

//                 // Додаємо обробник для чекбокса
//                 const filterCheckbox = document.getElementById("my");
//                 if (filterCheckbox) {
//                     filterCheckbox.checked = my;
//                     filterCheckbox.addEventListener("change", () => {
//                         const isChecked = filterCheckbox.checked;
//                         localStorage.setItem("my", JSON.stringify(isChecked));
//                         fetchAndDisplayArticles(targetElm, 0, totalCountFromHash); // Перезавантажуємо список
//                     });
//                 }
//             };

//             loadArticles();
//         } else {
//             document.getElementById(targetElm).innerHTML = Mustache.render(
//                 document.getElementById("template-articles-error").innerHTML,
//                 { errMessage: this.responseText }
//             );
//         }
//     };

//     const ajax = new XMLHttpRequest();
//     ajax.addEventListener("load", reqListener);
//     ajax.open("GET", url, true);
//     ajax.send();
// }


function fetchAndDisplayArticles(targetElm, offsetFromHash = 0, totalCountFromHash = 0) {
    const articlesPerPage = 20;
    const offset = Number(offsetFromHash);
    const totalCount = Number(totalCountFromHash);

    // Читаємо стан фільтра "мої статті"
    const my = JSON.parse(localStorage.getItem("my")) || false;

    // Формуємо URL із фільтром, якщо треба
    const urlQuery = `?offset=${offset}&max=${articlesPerPage}`;
    let url = `${urlBase}/article${urlQuery}`;
    if (my) {
        url += "&tag=volleyball";
    }

    const reqListener = function () {
        if (this.status === 200) {
            const responseJSON = JSON.parse(this.responseText);

            const hasNext = offset + articlesPerPage < responseJSON.meta.totalCount;
            const hasPrevious = offset > 0;

            
            const articles = responseJSON.articles.map(article => ({
                ...article,
                tags: article.tags.filter(tag => tag !== "volleyball") 
            }));

            const templateData = {
                articles: articles.map(article => ({
                    ...article,
                    detailLink: `#article/${article.id}/${offset}/${responseJSON.meta.totalCount}`,
                })),
                hasNext,
                hasPrevious,
                nextPage: hasNext ? offset + articlesPerPage : null,
                previousPage: hasPrevious ? Math.max(offset - articlesPerPage, 0) : null,
                isFiltered: my
            };

            document.getElementById(targetElm).innerHTML = Mustache.render(
                document.getElementById("template-articles").innerHTML,
                templateData
            );

           
            const filterCheckbox = document.getElementById("my");
            if (filterCheckbox) {
                filterCheckbox.checked = my;
                filterCheckbox.addEventListener("change", () => {
                    const isChecked = filterCheckbox.checked;
                    localStorage.setItem("my", JSON.stringify(isChecked));
                    fetchAndDisplayArticles(targetElm, 0, totalCountFromHash); 
                });
            }
        } else {
            document.getElementById(targetElm).innerHTML = Mustache.render(
                document.getElementById("template-articles-error").innerHTML,
                { errMessage: this.responseText }
            );
        }
    };

    const ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
}


function fetchAndDisplayArticleDetail(
    targetElm,
    artIdFromHash,
    offsetFromHash,
    totalCountFromHash
  ) {
    const url = `${urlBase}/article/${artIdFromHash}`;
  
    const reqListener = function () {
      if (this.status === 200) {
        const articleData = JSON.parse(this.responseText);
        articleData.tags = articleData.tags.filter(tag => tag !== "volleyball");
  
        const templateData = {
          ...articleData,
          backLink: `#articles/${offsetFromHash}/${totalCountFromHash}`,
          editLink: `#artEdit/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`,
          deleteLink: `#artDelete/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`,
        };
  
        document.getElementById(targetElm).innerHTML = Mustache.render(
          document.getElementById("template-article").innerHTML,
          templateData
        );
  
       
        fetchAndDisplayComments("comments-container", artIdFromHash, 0);
  
        const user = JSON.parse(localStorage.getItem("googleUser"));
        const authorField = document.getElementById("author");
  
        if (user) {
          authorField.value = user.name; 
          authorField.disabled = true;  
        }
  
     
        document.getElementById("comment-form").onsubmit = (event) =>
          processCommentForm(event, artIdFromHash);
      } else {
        document.getElementById(
          targetElm
        ).innerHTML = `<p>Error loading article.</p>`;
      }
    };
  
    const ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
  }
  
  function processCommentForm(event, articleId) {
    event.preventDefault();
  
    const user = JSON.parse(localStorage.getItem("googleUser"));
    const author = user ? user.name : document.getElementById("author").value.trim();
    const commentContent = document.getElementById("comment").value.trim();
  
    if (!author || !commentContent) {
      alert("Both author and comment are required!");
      return;
    }
  
    const newComment = {
      author,
      comment: commentContent,
      created: new Date().toLocaleString(),
    };
  
    // Додаємо новий коментар до localStorage
    const comments = JSON.parse(localStorage.getItem(`comments-${articleId}`) || "[]");
    comments.push(newComment);
    localStorage.setItem(`comments-${articleId}`, JSON.stringify(comments));
  
    // Перехід на останню сторінку
    const offset = Math.floor((comments.length - 1) / 10) * 10; // Обчислюємо офсет останньої сторінки
    fetchAndDisplayComments("comments-container", articleId, offset);
  
    document.getElementById("comment-form").reset();
  }
  
  function renderComments(articleId) {
    const comments = JSON.parse(localStorage.getItem(`comments-${articleId}`) || "[]");

    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = comments
        .map(comment => `
            <li>
                <p><strong>${comment.author}</strong> wrote:</p>
                <p>${comment.comment}</p>
                <p><em>${comment.created}</em></p>
            </li>
        `)
        .join("");
}



        

/**
 * Gets an article record from a server and processes it to html according to 
 * the value of the forEdit parameter. Assumes existence of the urlBase global variable
 * with the base of the server url (e.g. "https://wt.kpi.fei.tuke.sk/api"),
 * availability of the Mustache.render() function and Mustache templates )
 * with id="template-article" (if forEdit=false) and id="template-article-form" (if forEdit=true).
 * @param targetElm - id of the element to which the acquired article record 
 *                    will be rendered using the corresponding template
 * @param artIdFromHash - id of the article to be acquired
 * @param offsetFromHash - current offset of the article list display to which the user should return
 * @param totalCountFromHash - total number of articles on the server
 * @param forEdit - if false, the function renders the article to HTML using 
 *                            the template-article for display.
 *                  If true, it renders using template-article-form for editing.
 */

// function fetchAndProcessArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash, forEdit) {
//     const url = `${urlBase}/article/${artIdFromHash}`;

//     const reqListener = function () {
//         if (this.status === 200) {
//             const responseJSON = JSON.parse(this.responseText);

//             if (forEdit) {
//                 // isMyVolleyball зміна яка каже чи наш чланок
//                 responseJSON.isMyVolleyball = false;
//                 responseJSON.formTitle = "Article Edit";
//                 responseJSON.submitBtTitle = "Save article";
//                 responseJSON.backLink = `#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;

//                 // Видаляємо тег "volleyball" з полів редагування, щоб юзер не впливав на схований тег
//                 if (responseJSON.tags.find(element => element == "volleyball")) {
//                     responseJSON.isMyVolleyball = true;
//                     responseJSON.tags = responseJSON.tags.filter(tag => tag !== "volleyball").join(", ");
//                 }

//                 // Відображаємо статтю на сторінці
//                 document.getElementById(targetElm).innerHTML = Mustache.render(
//                     document.getElementById("template-article-form").innerHTML,
//                     responseJSON
//                 );
                
//                 // Вертаємо раніше видалений таг якщо він існував
//                 if(responseJSON.isMyVolleyball) {
//                     tags.push("volleyball");
//                 }

//                 if (!window.artFrmHandler) {
//                     window.artFrmHandler = new articleFormsHandler("https://wt.kpi.fei.tuke.sk/api");
//                 }
//                 window.artFrmHandler.assignFormAndArticle("articleForm", "hiddenElm", artIdFromHash, offsetFromHash, totalCountFromHash);
//             } else {
//                 responseJSON.backLink = `#articles/${offsetFromHash}/${totalCountFromHash}`;
//                 responseJSON.editLink = `#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
//                 responseJSON.deleteLink = `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;

//                 document.getElementById(targetElm).innerHTML = Mustache.render(
//                     document.getElementById("template-article").innerHTML,
//                     responseJSON
//                 );
//             }
//         } else {
//             document.getElementById(targetElm).innerHTML = Mustache.render(
//                 document.getElementById("template-articles-error").innerHTML,
//                 { errMessage: this.responseText }
//             );
//         }
//     };

//     const ajax = new XMLHttpRequest();
//     ajax.addEventListener("load", reqListener);
//     ajax.open("GET", url, true);
//     ajax.send();
// }
function fetchAndProcessArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash, forEdit) {
    const url = `${urlBase}/article/${artIdFromHash}`;

    const reqListener = function () {
        if (this.status === 200) {
            const responseJSON = JSON.parse(this.responseText);

            if (forEdit) {
                responseJSON.formTitle = "Article Edit";
                responseJSON.submitBtTitle = "Save article";
                responseJSON.backLink = `#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;

                // Видаляємо теги, щоб користувач не бачив прихований ключ
                responseJSON.tags = responseJSON.tags.filter(tag => tag !== "volleyball").join(", ");

                // Рендеримо форму редагування
                document.getElementById(targetElm).innerHTML = Mustache.render(
                    document.getElementById("template-article-form").innerHTML,
                    responseJSON
                );

                // Додаємо автоматичне завантаження зображення після вибору файлу
                document.getElementById("flElm").addEventListener("change", function () {
                    const file = this.files[0]; // Отримуємо вибраний файл

                    if (!file) {
                        alert("Please select a file to upload.");
                        return;
                    }

                    const formData = new FormData();
                    formData.append("file", file);

                    const ajax = new XMLHttpRequest();
                    ajax.open("POST", `${urlBase}/fileUpload`, true);

                    ajax.onload = function () {
                        if (ajax.status === 200) {
                            const response = JSON.parse(ajax.responseText);

                            // Оновлюємо поле "Image Link" в формі URL-ом завантаженого зображення
                            document.getElementById("imageLink").value = response.fullFileUrl;

                            // Інформування у консоль
                            console.log("Image uploaded successfully!");
                        } else {
                            alert(`Error uploading image: ${ajax.responseText}`);
                        }
                    };

                    ajax.onerror = function () {
                        alert("An error occurred during the upload.");
                    };

                    ajax.send(formData);
                });

                // Обробка форми редагування
                const form = document.getElementById("articleForm");
                form.onsubmit = function (event) {
                    event.preventDefault();

                    // Обробка форми редагування
                    const updatedTags = document.getElementById("tags").value.trim();
                    const tags = updatedTags
                        ? [...new Set(updatedTags.split(",").map(tag => tag.trim()))]
                        : [];

                    // Додаємо прихований ключ назад
                    if (!tags.includes("volleyball")) {
                        tags.push("volleyball");
                    }

                    const updatedData = {
                        author: document.getElementById("author").value.trim(),
                        title: document.getElementById("title").value.trim(),
                        imageLink: document.getElementById("imageLink").value.trim(),
                        content: document.getElementById("content").value.trim(),
                        tags: tags
                    };

                    const ajax = new XMLHttpRequest();
                    ajax.open("PUT", url, true);
                    ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    ajax.onload = function () {
                        if (ajax.status === 200) {
                            alert("Article updated successfully!");
                            window.location.hash = `#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;
                        } else {
                            alert(`Error updating article: ${ajax.responseText}`);
                        }
                    };
                    ajax.send(JSON.stringify(updatedData));
                };
            } else {
                // Відображення статті без редагування
                responseJSON.backLink = `#articles/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.editLink = `#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.deleteLink = `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;

                document.getElementById(targetElm).innerHTML = Mustache.render(
                    document.getElementById("template-article").innerHTML,
                    responseJSON
                );
            }
        } else {
            document.getElementById(targetElm).innerHTML = Mustache.render(
                document.getElementById("template-articles-error").innerHTML,
                { errMessage: this.responseText }
            );
        }
    };

    const ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
}



function editArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash, true);
}
function deleteArticle(targetElm, artIdFromHash, pageNumberFromHash, totalPagesFromHash) {
    const articleId = artIdFromHash;
    const pageNumber = parseInt(pageNumberFromHash);
    const totalPages = parseInt(totalPagesFromHash);

    const url = `${urlBase}/article/${articleId}`;

    const ajax = new XMLHttpRequest();
    ajax.open("DELETE", url, true);

    ajax.onload = function () {
        if (this.status === 200 || this.status === 204) {
            alert("Article will be deleted!");
            window.location.hash = `#articles/${pageNumber}/${totalPages}`;
        } else {
            const errMsgObj = { errMessage: this.responseText };
            const errorTemplate = document.getElementById("template-articles-error").innerHTML;
            const rendered = Mustache.render(errorTemplate, errMsgObj);
            document.getElementById(targetElm).innerHTML = rendered;
        }
    };

    ajax.onerror = function () {
        alert("Server eror(");
    };

    ajax.send();
}

function insertArticle(targetElm) {
    const user = JSON.parse(localStorage.getItem("googleUser"));
    const formData = {
        formTitle: "Add New Article",
        submitBtTitle: "Save article",
        backLink: "#articles/1/0",
        author: user ? user.name : "", // Якщо залогінений, підставляємо ім'я
        title: "",
        imageLink: "",
        content: "",
        tags: "" // Поле для тегів
    };

    // Рендеримо шаблон форми
    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-article-form").innerHTML,
        formData
    );

    // Якщо користувач залогінений, блокуємо поле для автора
    if (user) {
        const authorField = document.getElementById("author");
        authorField.disabled = true; // Забороняємо редагування
    }

    const form = document.getElementById("articleForm");
    form.onsubmit = function (e) {
        e.preventDefault();

        // Збираємо дані з форми
        const tagsFromForm = document.getElementById("tags").value.trim();
        const tags = tagsFromForm 
            ? [...new Set(tagsFromForm.split(",").map(tag => tag.trim()).filter(Boolean))]
            : [];
        
        // Додаємо прихований тег "volleyball"
        if (!tags.includes("volleyball")) {
            tags.push("volleyball");
        }

        const data = {
            author: user ? user.name : document.getElementById("author").value.trim(),
            title: document.getElementById("title").value.trim(),
            imageLink: document.getElementById("imageLink").value.trim(),
            content: document.getElementById("content").value.trim(),
            tags: tags // Відправляємо теги з доданим "volleyball"
        };

        // Виконуємо POST-запит
        fetch("https://wt.kpi.fei.tuke.sk/api/article", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.ok ? response.json() : Promise.reject(response.text()))
        .then(() => {
            alert("Article created successfully!");
            window.location.hash = "#articles/1/0"; // Перенаправляємо на список статей
        })
        .catch(error => alert(`Error: ${error}`));
    };
}


function fetchAndDisplayComments(targetElm, articleId, offset = 0) {
    const max = 10; // Кількість коментарів на сторінку
  
    // Отримуємо всі коментарі з localStorage
    const comments = JSON.parse(localStorage.getItem(`comments-${articleId}`) || "[]");
  
    // Розраховуємо коментарі для поточної сторінки
    const paginatedComments = comments.slice(offset, offset + max);
  
    // Логіка для кнопок "Next" і "Previous"
    const hasNext = offset + max < comments.length;
    const hasPrevious = offset > 0;
  
    const templateData = {
      comments: paginatedComments,
      hasNext,
      hasPrevious,
    };
  
    // Рендеримо шаблон
    document.getElementById(targetElm).innerHTML = Mustache.render(
      document.getElementById("template-comments").innerHTML,
      templateData
    );
  
    // Обробка кнопок "Next" і "Previous"
    const nextButton = document.getElementById("next-page");
    const previousButton = document.getElementById("previous-page");
  
    if (nextButton) {
      nextButton.addEventListener("click", () =>
        fetchAndDisplayComments(targetElm, articleId, offset + max)
      );
    }
  
    if (previousButton) {
      previousButton.addEventListener("click", () =>
        fetchAndDisplayComments(targetElm, articleId, offset - max)
      );
    }
  }
  
  


document.getElementById("menuTitle").addEventListener("click", function () {
    const menu = document.getElementById("menuIts");
    const button = document.getElementById("menuTitle");

    // Отримуємо позицію кнопки
    const buttonRect = button.getBoundingClientRect();

    // Встановлюємо позицію меню
    menu.style.top = `${buttonRect.bottom}px`; // Відступ від нижньої частини кнопки
    menu.style.left = `${buttonRect.left}px`; // Відступ від лівого краю кнопки

    // Перемикаємо видимість меню
    menu.classList.toggle("mnShow");
    menu.classList.toggle("mnHide");
});


