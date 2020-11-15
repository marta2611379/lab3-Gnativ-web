$(document).ready(function() {

    $('.user-update').hide();

    function addUser(firstname, lastname, age, login, password) {
        if (!firstname || !lastname || !age || !login || !password) return;
        let obj = {
            firstname: firstname,
            lastname: lastname,
            age: age,
            login: login,
            password: password
        }
        $.post('/adduser', obj, function(data) {
            console.log(data);
            getUsers();
        })
    }

    $('.add').click(function() {
        let firstname = $('.firstname').val();
        let lastname = $('.lastname').val();
        let age = $('.age').val();
        let login = $('.login').val();
        let password = $('.password').val();
        $('.firstname').val("");
        $('.lastname').val("");
        $('.age').val("");
        $('.login').val("");
        $('.password').val("");
        addUser(firstname, lastname, age, login, password);
    })

    // let updateUserId;

    // function findUser(id) {
    //     var obj = { id: id };
    //     updateUserId = id;
    //     $.post('/finduser', obj, function(data) {
    //         console.log(data);
    //         $('.name').val(data.username);
    //         $('.age').val(data.age);
    //         $('.password').val(data.password);
    //         getUsers();
    //     })
    // };



})