//Tüm elementleri seçme
const firstCardBody = document.querySelectorAll(".card-body")[0]; //alert methodu için
const secondCardBody = document.querySelectorAll(".card-body")[1]; //alert methodu için
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

//Tüm event listenerlar burada atanıcak.
function eventListeners() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI); //sayfa yüklendiğinde çalışır.
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}
function clearAllTodos(e) {
  //tüm listeyi temizler
  if (confirm("Tümünü silmek istediğinize emin misiniz ?")) {
    //confirm bir bilgi kutusu açar ve ok cancel tuşları vardır. ok basıldığında true döner ve if için doğru olur. cancel basıldığında if ten çıkar sayfa aynı kalır
    // Arayüzden tüm todoları silme
    while (todoList.firstElementChild != null) {
      //to doList bizim ul miz.içerisinde çocuk kalmayana dek bu döngü döner
      todoList.removeChild(todoList.firstElementChild); //to dolist in ilk elementini siler,sildikçe diğer element first olur bir sonraki döngüde onu da siler böylece döngü bitiminde tüm çocuklar yani listemiz silinmiş olur
    }
    // to doList.innerHTML=""; //içerisindeki elementleri siler,while a göre yavaş
  }
  localStorage.removeItem("todos"); //her bir to do, todos array i içerisinde storage de kayıtlı. bu yüzden todos silersek tüm to do lar storageden silinir
}

function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase(); //inputa yazılan değeri alır ve her harfi küçük yapar
  const listItems = document.querySelectorAll(".list-group-item"); // listemizdeki li leri aldık

  listItems.forEach(function (listItem) {
    //li lerin üzerinde geziniyoruz
    const text = listItem.textContent.toLowerCase(); // li içerisindeki todo textini alıp küçük harf olacak şekilde değiştiriyoruz

    //indexOf : o array in içerisinde verdiğimiz değeri ilk nerede bulursa onun index ini döndürür. filterValue da yazdığımız değer olunca içerisinde arar ve bulamazsa -1 değeri döner.
    if (text.indexOf(filterValue) === -1) {
      //Bulamadı
      listItem.setAttribute("style", "display:none !important"); //bulamadığı li leri display none yaparak görünmemesini sağlar. important verme sebebimiz bootstrap özelliği olarak d-flex verdiğimiz için li lere. d-flex de important olarak display block vardır onu ezmek için yaptık.
    } else {
      listItem.setAttribute("style", "display:block");
    }
  });
}
function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove(); //parentElementine ulaşıp sildik
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo başarıyla silindi");
  }
}

function deleteTodoFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo, index) {
    if (todo === deleteTodo) {
      todos.splice(index, 1); //splice : indexten itibaren 1 eleman sil,array den eleman silme
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
  //sayfa yenilendiğinde storage alanında todolar kalsa bile önyüzde kayboluyordu onun için tekrar storage den bilgileri çekip önyüze aktardık
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function addTodo(e) {
  const newTodo = todoInput.value.trim();
  //string.trim() : input değerinde baştaki ve sondaki boşlukların silinmesi için trim methodu kullanılır.
  let todos = getTodosFromStorage();
  let sameTodo = false;
  todos.forEach(function (todo) {
    if (todo.indexOf(newTodo) != -1) {
      sameTodo = true;
    }
  });

  if (newTodo === "") {
    /* <div class="alert alert-danger" role="alert">
            This is a danger alert—check it out!
          </div> */
    showAlert("danger", "Lütfen bir todo girin!");
  } else if (sameTodo) {
    showAlert("danger", "Todo daha önce eklendi!");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo başarıyla eklendi!");
  }

  e.preventDefault();
}
//storage dan todoları alma
function getTodosFromStorage() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos")); //parse: string ifadeyi array e çevirir
  }
  return todos;
}
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//alert(bilgilendirme mesajı) dinamik olarak eklemek için aşağıdaki fonk kullanıcaz
//type : alert (success: başarılı ve yeşil, danger: hata ve kırmızı, info: sarı ve bilgilendirme gibi.Bootstrap alert message dan bak çeşitlerine)
//message: yazdırmak istediğimiz mesaj

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`; // alert-danger gibi type olan kısım dinamik olarak eklenerek sınıf eklenecek
  alert.textContent = message;
  firstCardBody.appendChild(alert);

  //setTimeOut : belirli bir saniye görünüp kaybolması için

  setTimeout(function () {
    alert.remove(); //alert sil
  }, 1000);
  //1 saniye sonra silinecek
}

// String değerini list item olarak UI(ÖN YÜZE) ya ekleyecek
function addTodoToUI(newTodo) {
  //List item oluşturma
  const listItem = document.createElement("li"); // li etiketi,elementi oluşturma
  listItem.className = "list-group-item d-flex justify-content-between";
  //Link oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class='fa fa-remove'></i>"; //a etiketinin içine i etiketi ekledik

  //Text Node ekleme
  listItem.appendChild(document.createTextNode(newTodo)); // li nin içine inputa girilecek todo yu text olarak ekledik.
  listItem.appendChild(link); //li nin içine a yı ekledik.

  // To do List'e List item'ı ekleme

  todoList.appendChild(listItem); //ul nin içine li ekledik
  todoInput.value = ""; // input değerini todo listesine ekledikten sonra inputun içini boşalttmak için

  // bu şekilde sadece arayüze eklemiş olduk herhangi veritabanı veya local storage eklemediğimizden sayfayı yenileyince tüm eklenenler gider çünkü değerleri biyerden çekmiyoruz.
}
