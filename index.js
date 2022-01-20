const express = require('express');

const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');

const app = express();
const PORT = 8080;

const db = require('./connection/db');  //import connection db  

app.set('view engine', 'hbs');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended : false}));

app.use(flash())
app.use(
    session({
        cookie: {
            maxAge: 2 * 60 * 60 * 1000, //menyimpan data dalam sesion selama 2 hours
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'

 }))


// let isLogin = true;


function getfullTime(time) {
    let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktobebr", "November", "Desember"];

    let date = time.getDate();
  
    let monthIndex = time.getMonth();
    
    let year = time.getFullYear();
   
    let hours = time.getHours();
  
    let minutes = time.getMinutes();
  
    return `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
  }


function getDistanceTime(time) {

    let timePost = time;
    let timeNow = new Date();
    
    let distance = timeNow - timePost;
  
    let miliSecond =  1000; // = 1 detik
    let secondinHours = 3600; //1jam = 3600 mili second
    let hoursinDay = 23; //23 jam dalam 1 hari
    let minutes = 60;
    let seconds = 60;
  
    let distanceDay = Math.floor(distance / (miliSecond * secondinHours * hoursinDay)); //untuk mendapakatkan hari
    let distanceHours  = Math.floor(distance / (miliSecond * seconds  * minutes )); //untuk mendapatkan jam
    let distanceMinutes = Math.floor(distance / (miliSecond * seconds))
    let distanceSecond = Math.floor(distance / miliSecond)
    
    //distanceDay = Math.floor(distanceDay);
    //console.log(distanceDay+' day ago');
  
    if (distanceDay >= 1) {
      return `${distanceDay} day ago`
    } 
      else if (distanceHours >= 1) {
        return `${distanceHours}  hours ago`
    } 
      else if (distanceMinutes >= 1){  
        return`${distanceMinutes} Minutes Ago`
    } 
      else {
        return`${distanceSecond} Second Ago`
      }
    }


// funtion memiliki2 parameter
app.get('/', function(request, response){
    response.render("index")
});

app.get('/blog', function(request, response){

    db.connect(function(err, client, done){
        if(err) throw err;

        client.query(`SELECT * FROM tb_blog`, function(err, result){
            if(err) throw err;

            // console.log(rows);
            let data = result.rows

            data = data.map(function(blog) {
                return {
                    ...blog, 
                    isLogin: request.session.isLogin,
                    postAt: getfullTime(blog.postAt),
                    distance: getDistanceTime(blog.postAt),   
           }
        });

            response.render("blog", {isLogin : request.session.isLogin, user: request.session.user, blogs: data })

        } )

    })
});

app.get('/blog-detail/:id', function(request, response){
    // console.log(request.params);
    let id = request.params.id;

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(`SELECT * FROM tb_blog WHERE id = ${id}`, function(err, result){
            if(err) throw err;

            let data = result.rows[0];

            response.render('blog-detail', {blog: data})
        })
    })

});


app.get('/add-blog', function(request, response){
    response.render('add-blog');
});

app.post('/blog', function(request, response){
    
    let data = request.body;
    let query = `INSERT INTO tb_blog(title, content, image) VALUES ('${data.inputTitle}', '${data.inputContent}', 'image.jpg')`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err, result){
            if(err) throw err
      
           response.redirect('/blog')
        })
    })
});

app.get('/delete-blog/:id', function(request, response){

        let id = request.params.id;
        
        let query = `DELETE FROM tb_blog WHERE id = ${id}`
        db.connect(function(err, client, done){
            if (err) throw err
    
            client.query(query, function(err, result){
                if(err) throw err
          
               response.redirect('/blog')
            })
        })
})

app.get('/contact', function(request, response){
    response.render("contact");
});

app.get('/register', function(request, response){
    response.render("register");
});

app.post('/register', function(request, response){
    
    // console.log(request.body.inputName)

    const {inputName, inputEmail, inputPassword} = request.body
    
    const hashedPassword = bcrypt.hashSync(inputPassword, 10)

    // console.log(hashedPassword);
    // console.log(inputPassword);
    
    // return;
    
    let query = `INSERT INTO tb_user(name, email, password) VALUES ('${inputName}', '${inputEmail}', '${hashedPassword}')`

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(query, function(err, result){
            if (err) throw err;

            // console.log(rows);
            response.redirect('/login')
        });
    });
});


app.get('/login', function(request, response){
    response.render("login");
});

app.post('/login', function(request, response){
    
    const {inputEmail, inputPassword} = request.body;

    let query = `SELECT * FROM tb_user WHERE email = '${inputEmail}'`

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(query, function(err, result){
            if(err) throw err;

            //console.log(result.rows.length);

            if(result.rows.length == 0){

                request.flash('danger', 'Maaf Email Anda Belum Terdaftar')
        
                return response.redirect('/login')
            }   

            let isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password)

                // console.log(isMatch);

                if (isMatch) {
                    request.session.isLogin = true;
                    request.session.user = {
                        id: result.rows[0].id,
                        name: result.rows[0].name,
                        email: result.rows[0].email
                    }

                    request.flash('success', 'Login Success')
                    response.redirect('/blog')
                } else {
                    request.flash('danger', ' sorry, tidak berhasil password salah')
                    response.redirect('/login')
                }
        });
    });
});

app.get('/logout', function(request, response){
    request.session.destroy();

    response.redirect('/blog')
})

app.listen(PORT, function(){
    console.log(`server starting in port ${PORT}`);
});