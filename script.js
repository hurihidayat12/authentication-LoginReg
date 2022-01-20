//take data from Id


let blogs = [];

function addBlog(event){

    event.preventDefault();

    //atau menggunakan 
    //a.preventDefault();

    //atau ini juga bisa
    //e.preventDefault();

    //console.log("selamat datang");
    let title = document.getElementById("input-blog-title").value
    let content = document.getElementById("input-blog-content").value
    let image = document.getElementById("input-blog-image").files

    image = URL.createObjectURL(image[0]);

    // console.log(image);
    let blog = {
        title: title,
        content: content,
        image: image,
        author: 'huri',
        postAt: new Date()
    }

    blogs.push(blog);

    console.log(blog);

    console.log(blogs);

//     for(let i = 0; i < blogs.length; i++){
//         console.log(blogs[i]);
// }

  renderBlog()
}
 
//html manipulation / DOM


function renderBlog() {
    let konten = document.getElementById("contents");

    konten.innerHTML = ""

    for (let i = 0; i < blogs.length; i++) {

    konten.innerHTML +=  `
      <div class="blog-list-item">
        <div class="blog-image">
            <img src="${blogs[i].image}" alt=""/>
          </div>
          <div class="blog-content">
          <div class="btn-group">
            <button class="btn-edit">Edit Post</button>
            <button class="btn-post">Post Blog</button>
          </div>
          <h1>
            <a href="blog-detail.html" target="_blank"> 
              ${blogs[i].title}</a>
          </h1>
          <div class="detail-blog-content">
              ${blogs[i].postAt} | ${blogs[i].author}
          </div>
            <p>
              ${blogs[i].content}
            </p>
          <div class ="update-time">
            <span>
              ${getDistanceTime(blogs[i].postAt)}
            </span>
            </div>
      </div>`
    }
}


// let time = new Date()

// console.log(time);
// console.log(time.getDate());
// console.log(time.getMonth());
// console.log(time.getFullYear());


// console.log(time.getHours());
// console.log(time.getMinutes());

let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
"Juli", "Agustus", "September", "Oktobebr", "November", "Desember"];

function getfullTime(time) {

  let date = time.getDate();

  let monthIndex = time.getMonth();
  
  let year = time.getFullYear();
 
  let hours = time.getHours();

  let minutes = time.getMinutes();

  let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`

  console.log(fullTime)
  return getfullTime;
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

setInterval(() => {
  renderBlog();
 },3600);

//finish blog sourcode

//SourCode Contact

 function submitData() {
  let name = document.getElementById("input-username").value;
  let email = document.getElementById("input-gmail").value;
  let phone = document.getElementById("input-phone").value;
  let fullDev = document.getElementById("Full").checked;
  let frontDev = document.getElementById("front").checked
  let backDev = document.getElementById("back").checked;
  let subject = document.getElementById("input-subject").value;
  let text = document.getElementById("input-text").value;

  if (fullDev){
      fullDev = (document.getElementById("Full").value);
  } 
  else {
      fullDev = ""
  }

  if (frontDev){
      frontDev = (document.getElementById("front").value);
  }
  else {
      frontDev = ""
  }

  if (backDev){
      backDev = (document.getElementById("back").value)
  }
  else {
      backDev = ""
  }

  console.info(name);
  console.info(email);
  console.info(phone);
  console.info(fullDev);
  console.info(frontDev);
  console.info(backDev);
  console.info(subject);
  console.info(text);

//form condition
  if (name == ""){
      return alert ("Plese Enter Your Name in the Input Form !!");
  }
  else if (email == ""){
      return alert("the email section Must be Filled in!!");
  }
  else if (phone == ""){
      return alert("Please Input Your Number Phone !!");
  }
  else if (subject == ""){
      return alert("Please Select Subject !!");
  }
  else if(text == ""){
      return alert("I am Sory, Please Input Your Message Before Send !!");
  }

  let emailSend = 'loper@gmail.com'
  let a = document.createElement('a');

  a.href= `mailto: ${emailSend}?subject=${subject}&body=Assalamualaikum Hallo ${name} 
  nomor telephone  : ${phone} send task project ke ${email} tugas nya ${text} khusus 
  bagian ${fullDev} ${backDev} ${frontDev}`
  a.click();

  let grup = {
      name: name, 
      email: email,
      telphone: phone,
      subject: subject,
      text: text,
      options: frontDev, backDev, fullDev,
  }
  console.log(grup);

}

