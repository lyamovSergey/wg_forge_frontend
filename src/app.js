
import './style.css'
export default (function () {
   
    let tableBody = document.getElementById("tableBody");
    let table = document.getElementById("table");
    let link = './data/';
    // let link = 'http://localhost:9000/api/';
    let users; //объект с пользователями
    let companies; //объект с компаниями
    let search = document.getElementById("search");
    let tableRows, tableRowsLen; //переменные для поиска
    let hideElements = 0;
    
    //функция ajax-запроса
    let request = obj => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(obj.method || "GET", link + obj.url);
            if (obj.headers) {
                Object.keys(obj.headers).forEach(key => {
                    xhr.setRequestHeader(key, obj.headers[key]);
                });
            }
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(obj.body);
        });
    };
    

    request({url: "users.json"}) //запрос информации пользователей
    .then(data =>{
        let req = JSON.parse(data);
        users = req;
        
    })
    .then(() =>{
        request({url: "companies.json"}) //запрос информации о компаниях
        .then(data => {
            let req = JSON.parse(data);
            companies = req;
        })
    })
    .then(()=>{
        request({url: "orders.json"}) //запрос информации о заказах
        .then(data => {
            let request = JSON.parse(data);  
            request.forEach((el, i) => {
                //создать строки и столбцы таблицы
                let transaction_id = document.createElement("td");
                let user = document.createElement("td");
                let date = document.createElement("td");
                let total = document.createElement("td");
                let card_number = document.createElement("td");
                let card_type = document.createElement("td");
                let location = document.createElement("td");
                let tr = document.createElement("tr");
                //добавить вспомогательные классы
                transaction_id.classList.add('transaction');
                user.classList.add('userInfo');
                total.classList.add('total');
                card_type.classList.add('card_type');
                location.classList.add('location');
                tr.id = 'order_' + i;
                tr.classList.add('tableRow');
                tr.classList.add('visible');
                //заполнить информацию
                transaction_id.innerHTML = el['transaction_id'];
                user.innerHTML = getUserInfo(el['user_id']);
                date.innerHTML = getDate(el['created_at'], 'long');
                total.innerHTML = `<span>$</span>  <span>${el['total']}</span>`;
                card_number.innerHTML = cardMask(el['card_number'])
                card_type.innerHTML = el['card_type'];
                location.innerHTML = el['order_country'] + '(' + el['order_ip'] + ')';
                //добавить в таблицу
                tr.appendChild(transaction_id);
                tr.appendChild(user);
                tr.appendChild(date);
                tr.appendChild(total);
                tr.appendChild(card_number);
                tr.appendChild(card_type);
                tr.appendChild(location);
                
                tableBody.appendChild(tr)
                tableRows = document.getElementsByClassName('tableRow')
                tableRowsLen = tableRows.length //сколько всего рядов в таблице(для поиска)
                
            })
            statistic();
            removePreloader();
        })
        .then(() => {
            table.addEventListener('click', function(e){
                let targetName = e.target;
                let actives = document.getElementsByClassName('active');
                let show = document.getElementsByClassName('show');
                let active = false;
                //вызов функции сортировки
                if(targetName.id == 'sortUser'){
                    removeArrows(targetName);
                    if(targetName.classList.contains('sortUP')){
                        sortTable(1, 'down', 'string')
                        targetName.classList.remove('sortUP')
                        targetName.classList.add('sortDown')
                    }else if(targetName.classList.contains('sortDown')){
                        sortTable(1, 'up', 'string')
                        targetName.classList.remove('sortDown')
                        targetName.classList.add('sortUP')
                    }else{
                        
                        sortTable(1, 'up', 'string')
                        targetName.classList.add('sortUP')
                    } 
                }
                if(targetName.id == 'sortTransaction'){
                    removeArrows(targetName);
                    if(targetName.classList.contains('sortUP')){
                        sortTable(0, 'down', 'string')
                        targetName.classList.remove('sortUP')
                        targetName.classList.add('sortDown')
                    }else if(targetName.classList.contains('sortDown')){
                        sortTable(0, 'up', 'string')
                        targetName.classList.remove('sortDown')
                        targetName.classList.add('sortUP')
                    }else{
                        sortTable(0, 'up', 'string')
                        targetName.classList.add('sortUP')
                    }
                }
                if(targetName.id == 'sortDate'){
                    removeArrows(targetName);
                    if(targetName.classList.contains('sortUP')){
                        sortTable(2, 'down', 'string')
                        targetName.classList.remove('sortUP')
                        targetName.classList.add('sortDown')
                    }else if(targetName.classList.contains('sortDown')){
                        sortTable(2, 'up', 'string')
                        targetName.classList.remove('sortDown')
                        targetName.classList.add('sortUP')
                    }else{
                        sortTable(2, 'up', 'string')
                        targetName.classList.add('sortUP')
                    }
                }
                if(targetName.id == 'sortOrder'){
                    removeArrows(targetName);
                    if(targetName.classList.contains('sortUP')){
                        sortTable(3, 'down', 'num')
                        targetName.classList.remove('sortUP')
                        targetName.classList.add('sortDown')
                    }else if(targetName.classList.contains('sortDown')){
                        sortTable(3, 'up', 'num')
                        targetName.classList.remove('sortDown')
                        targetName.classList.add('sortUP')
                    }else{
                        sortTable(3, 'up', 'num')
                        targetName.classList.add('sortUP')
                    }
                }
                if(targetName.id == 'sortType'){
                    removeArrows(targetName);
                    if(targetName.classList.contains('sortUP')){
                        sortTable(5, 'down', 'string')
                        targetName.classList.remove('sortUP')
                        targetName.classList.add('sortDown')
                    }else if(targetName.classList.contains('sortDown')){
                        sortTable(5, 'up', 'string')
                        targetName.classList.remove('sortDown')
                        targetName.classList.add('sortUP')
                    }else{
                        sortTable(5, 'up', 'string')
                        targetName.classList.add('sortUP')
                    }
                }
                if(targetName.id == 'sortLocation'){
                    removeArrows(targetName);
                    if(targetName.classList.contains('sortUP')){
                        sortTable(6, 'down', 'string')
                        targetName.classList.remove('sortUP')
                        targetName.classList.add('sortDown')
                    }else if(targetName.classList.contains('sortDown')){
                        sortTable(6, 'up', 'string')
                        targetName.classList.remove('sortDown')
                        targetName.classList.add('sortUP')
                    }else{
                        sortTable(6, 'up', 'string')
                        targetName.classList.add('sortUP')
                    }
                }

                if(targetName.classList.contains('active')){ //запомнить был ли активен элемент при клике
                    active = true;
                }else{
                    active = false;
                }
                
                if(targetName.classList.contains('user-link')){
                    e.preventDefault();


                    for(let i = 0; i < actives.length; i++){ //удалить все активные элементы
                        actives[i].classList.remove('active');
                        show[i].classList.remove('show');
                    }


                    if(active){ //добавить класс если элемент изначально был активен(для корректной работы toggle)
                        targetName.classList.add('active')
                    }


                    targetName.classList.toggle('active')

                    
                    if(targetName.classList.contains('active')){ //показать/скрыть подробную информацию
                        targetName.nextElementSibling.classList.add('show')
                    }else{
                        targetName.nextElementSibling.classList.remove('show')
                    }
                    
                }else{
                    return
                }
            })
            
           
        })
        .catch(error => {
            console.log(error);
        });
    })


    //поиск
    search.onkeyup = function(e){

        let that = this; 
        hideElements = 0; //количество скрытых элементов в которых не обнаружено совпадений
        let noResult = document.createElement("tr"); //элемент выводится если совпадения отсутствуют
        noResult.id = 'no_result'; 
        [].forEach.call(tableRows, function(el, i) {
            //если нет совпадений скрыть ряд
            if( el.children[0].textContent.indexOf(that.value) == -1 
                && el.children[1].textContent.indexOf(that.value) == -1 
                && el.children[3].textContent.indexOf(that.value) == -1
                && el.children[5].textContent.indexOf(that.value) == -1
                && el.children[6].textContent.indexOf(that.value) == -1){ 
                    el.classList.add('invisible')
                    el.classList.remove('visible')
                    el.style.display = 'none'

                if(el.style.display == 'none'){ //посчитать число скрытых элементов
                    hideElements++
                }else{
                    hideElements--
                }
                
            }else{
                el.classList.add('visible')
                el.classList.remove('invisible')
                el.style.display = 'flex'
            }
            
        })
        

        

        
        let noRes = document.getElementById('no_result')
        if(hideElements == tableRowsLen){ //если число скрытых рядов совпадает с числом рядов вывести "Nothing found"
            noResult.innerHTML = 'Nothing found';
            
            if(noRes == null){ //если элемента "Nothing found" нет на страницуе - добавить
                tableBody.appendChild(noResult);
            }
        }else{
            if(noRes != null){ //удалить элемент "Nothing found" если найдены совпадения
                tableBody.removeChild(noRes);
            } 
        }

        statistic();
    }

    //сортировка таблицы
    function sortTable(x, sortDirection, type){
        let table = document.querySelector('#tableBody');
        let trs = document.querySelectorAll('#tableBody tr');
        if(sortDirection == 'up'){  //сортировка вверх
            if(type == 'string'){ //сортировка строк

                if(x == 1){ //сортировка по второму столбцу


                    let sorted = [...trs].sort(function(a, b){
                        if(a.children[x].children[0].children[1].innerHTML >= b.children[x].children[0].children[1].innerHTML){
                            return 1;
                        }else{
                            return -1;
                        }
                    })
                    table.innerHTML = '';
                    for(let tr of sorted){
                        table.appendChild(tr);
                    }


                }else if( x == 0 || x == 2 || x == 5 || x == 6){ //сортировка по всем остальным


                    let sorted = [...trs].sort(function(a, b){
                        if(a.children[x].innerHTML >= b.children[x].innerHTML){
                            return 1;
                        }else{
                            return -1;
                        }
                    })
                    table.innerHTML = '';
                    for(let tr of sorted){
                        table.appendChild(tr);
                    }

                }
            }else if(type == 'num'){ //сортировка по числам


                let sorted = [...trs].sort(function(a, b){
                    return a.children[x].children[1].innerHTML - b.children[x].children[1].innerHTML
                })
                table.innerHTML = '';
                for(let tr of sorted){
                    table.appendChild(tr);
                }


            }  
        }else if(sortDirection == 'down'){  //сортировка вниз
            if(type == 'string'){ //сортировка строк
                if(x == 1){  //сортировка по второму столбцу


                    let sorted = [...trs].sort(function(a, b){
                        if(a.children[x].children[0].children[1].innerHTML >= b.children[x].children[0].children[1].innerHTML){
                            return -1;
                        }else{
                            return 1;
                        }
                    })
                    table.innerHTML = '';
                    for(let tr of sorted){
                        table.appendChild(tr);
                    } 

                }else if( x == 0 || x == 2 || x == 5 || x == 6){ //сортировка остальных


                    let sorted = [...trs].sort(function(a, b){
                        if(a.children[x].innerHTML >= b.children[x].innerHTML){
                            return -1;
                        }else{
                            return 1;
                        }
                    })
                    table.innerHTML = '';
                    for(let tr of sorted){
                        table.appendChild(tr);
                    }

                }
            }else if(type == 'num'){ //сортировка чисел
                let sorted = [...trs].sort(function(a, b){
                    return b.children[x].children[1].innerHTML - a.children[x].children[1].innerHTML
                })
                table.innerHTML = '';
                for(let tr of sorted){
                    table.appendChild(tr);
                }
            }
        }
    }

    //функция перевода даты в читабельный вид
    let getDate = (num, length) => {
        let options;
        if(length == 'long'){ //с секундами
            options = {
                year: 'numeric',
                month: '2-digit',
                day: 'numeric',
                timezone: 'UTC',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };
        }else if(length == 'small'){ //без секунд
            options = {
                year: 'numeric',
                month: '2-digit',
                day: 'numeric'
            };
        }
        
        let date = new Date(Number(num));
        
        return date.toLocaleString('ru-RU', options);
    }
    //функция маскировки номера карточки звездами
    let cardMask = card =>{
        let length = card.length - 6
        return card.replace(eval('/' + card.substr(2, length) + '/'),'********');
    }
    //получить информацию о компании в зависимости от id
    let companiInfo = id => {
        let company = companies.find(x => x.id == id);
        let info = {}
        for( var key in company){
            info[key] = company[key]
        }
        return info;
    }
    //получить подробную информацию о пользователе
    let getUserInfo = id => {
        
        let user = users.find(x => x.id == id); //найти пользователя по id в объекте с пользователями
        let male = users.find(x => x.id == id).gender; //пол текущего пользователя
        let company_id = user.company_id; //id компании текущего пользователя
        let name = '';
        let lastName = '';
        let avatar = '';
        let birthday = '';
        let namePrefix = '';
        let title = '';
        let industry = '';
       
        
        if(company_id != null){ //получить информацию о компании текущего пользователя
            var company = companiInfo(company_id);
            if(company.url != null && company.title != null){
                title = `<p>Company: <a href="${company.url}" target= _blank>${company.title}</a></p>`
            }
            if(company.industry != null && company.sector != null){
                industry = `<p>Industry: ${company.industry} / ${company.sector}</p>`
            }
        }
        
        if(male == "Male"){
            namePrefix = "Mr. "
        }else{
            namePrefix = "Ms. "
        }
        if(user.first_name && user.last_name){
            name = `<a class='user-link' href="#"><span>${namePrefix}</span> <span>${user.first_name} ${user.last_name}</span></a>`
        }
        if(user.avatar != null){
            avatar = `<p><img src="${user.avatar}" width="100px" alt='photo user'></p>`
        }
        if(user.birthday != null){
            birthday = `<p>Birthday: ${getDate(user.birthday, 'small')}</p>`
        }
        
        
        let user_detail = `<div class="user-details">${avatar} ${birthday} ${title} ${industry}</div>`
       
        return `${name} ${user_detail}`
        
   

    }

    //убрать лишние стрелочки
    function removeArrows(element){
        let header = document.querySelectorAll('#table thead tr th');


        for(let th of header){
            if(th.id != element.id){
                if(th.classList.contains('sortUP')){
                    th.classList.remove('sortUP')
                }else if(th.classList.contains('sortDown')){
                    th.classList.remove('sortDown')
                }
            }
        }
    }

    //статистика
    function statistic(){
        let tableRows = document.querySelectorAll('#statistic tr');
        let table = document.querySelectorAll('#tableBody tr');
        let total = document.querySelectorAll(".total");
        let order_counts = tableRows[0];
        let orders_total = tableRows[1];
        let median = tableRows[2];
        let average = tableRows[3];
        let average_female = tableRows[4];
        let average_male = tableRows[5];

        //всего заказов
        order_counts.children[1].innerHTML = tableRowsLen - hideElements;
        //общая сумма + средний чек
        let totalSumm = 0;
        let maleSum = 0;
        let maleLen = 0;
        let femaleSum = 0;
        let femaleLen = 0;
        let arr = [];
        let totalLengt = document.querySelectorAll('#tableBody tr.visible').length; //кол-во видимых элементов на странице
        [].forEach.call(table, function(el, i){
            arr.push(+el.children[3].children[1].innerHTML)
            if(el.classList.contains('visible')){
                totalSumm += +el.children[3].children[1].innerHTML
            }

            if(el.children[1].children[0].children[0].innerHTML == 'Mr. '){ //Средний чек мужской
                maleSum += +el.children[3].children[1].innerHTML;
                maleLen++
            }
            if(el.children[1].children[0].children[0].innerHTML == 'Ms. '){ //Средний чек женский
                femaleSum += +el.children[3].children[1].innerHTML;
                femaleLen++
            }
        });
        orders_total.children[1].innerHTML = '$ ' + Math.round((totalSumm)*100)/100;

        if(totalLengt != 0){
            average.children[1].innerHTML = '$ ' +  Math.round((totalSumm/totalLengt)*100)/100;
        }else{
            average.children[1].innerHTML = '$ ' + 0;
        }
        
        if(maleLen != 0){
            average_male.children[1].innerHTML = '$' +  Math.round((maleSum/maleLen)*100)/100;;
        }else{
            average_male.children[1].innerHTML = '$' + 0;
        }

        if(femaleLen != 0){
            average_female.children[1].innerHTML = '$' +  Math.round((femaleSum/femaleLen)*100)/100;;
        }else{
            average_female.children[1].innerHTML = '$' + 0;
        }

        //медиана
        median.children[1].innerHTML = "$ " + calcMedian(arr);
        
    }

    //Медиана
    function calcMedian(arr) {
        var half = Math.floor(arr.length / 2);
        arr.sort(function(a, b) { return a - b;});

        if (arr.length % 2) {
            return arr[half];
        } else {
            return (arr[half] + arr[half] + 1) / 2.0;
        }
    }

    //Прелоадер
    function removePreloader(){
        let body = document.querySelector('body');
        let preloader = document.querySelector('.preloader');
        body.style.overflow = 'auto';
        preloader.style.display = 'none';
    }
    

    
    
    
}());
