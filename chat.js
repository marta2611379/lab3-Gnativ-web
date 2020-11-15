$(document).ready(function() {
    // під'єднуємось до сервера -створюєм новий сокет
    var socket = io.connect('http://localhost:3000');
    socket.emit('joinclient', "is connected!");

    // function getUsers() {
    //     $.get('/getusers', function(data) {
    //         console.log(data);
    //     });
    // }
    // getUsers();

    $('#send-message').click(function() {
        if ($('.message').val() === '') {
            $('.message').addClass('mesinput')
        } else {
            $('.message').removeClass('mesinput ')
            socket.emit('newmessage', {
                message: $('.message').val()
            })
        }
    });

    socket.on('newmessage', (data) => {
        $('.message').val('');
        $('.chat-box')
            .append(`<div class="one-mess d-block ${data.color}" >` + `<span class="font-weight-bold">${data.login}:  </span>` + data.message + "</div>");
    })

    socket.on('joinserverforusers', function(data) {
        $('.user-info').append(`<div>${data.message}</div>`);
        usersOnline(data.users)
    })

    socket.on('joinserverforclient', function(data1) {
        $('.user-info').append(`<div>${data1.message}</div>`);
    })

    socket.on('usersonline', function(data) {
        usersOnline(data.users);
    });



    socket.on('disconnectThatSoc', function(data) {
        // socket.disconnect();
        $('.user-info').append(`<div>${data.message}</div>`);
        usersOnline(data.users);
        // socket.disconnect();
    });


    function usersOnline(data) {
        $('.online').html('');
        console.log(data);
        data.forEach(element => {
            $('.online').append(`<div>${element}</div>`);
        });
    }

    // $("#logout").click(function() {
    //     $.get('/logout', function(data) {
    //         console.log(data);
    //     });
    // })


})