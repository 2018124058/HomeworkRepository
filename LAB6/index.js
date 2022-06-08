// npm으로 설치한 패키지 express 불러오기
// const로 선언하여 다른 값으로 덮어쓰는 것 방지
const express = require("express");

// ejs 생성 
// const ejs = require("ejs");
// const bodyParser = require('body-parser');

// express 인스턴스 생성 
const app = express();

// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({express:false}));
// app.use(bodyParser.json());
// app.use(express.static(__dirname + "/"));

// POST의 body에 사용자 입력을 받을 수 있도록 설정
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// static file을 서버에 전달하도록 설정
// public: 폴더 이름 
app.use(express.static("public"));


// 어떤 포트를 통해 서버를 접속하게 할 것인지 지정
// process.env.PORT: 서버의 환경 변수에 등록된 PORT 정보를 이용
// 만약 환경 변수에 PORT 정보가 등록되어 있지 않다면 8000번을 기본값으로 이용
const PORT = process.env.PORT || 8000;

// 서버가 PORT에 연결됐을 때 수행할 함수 정의
app.listen(PORT, () => {
    console.log("서버 실행");
    console.log(`서버 주소: http://localhost:${PORT}`);
})

// file IO를 다루기 위한 fs (기본 내장 모듈) 로드
const fs = require("fs");
// POST 요청을 처리하는 write-file 라우트 정의
// body에 저장된 사용자 입력을 받아 fs 모듈의 writeFile로 파일을 저장 
app.post("write-file", function(req, res){
    console.log(req.body);
    // POST body에 content 값이 없으면 400 BAD REQUEST 에러
    if (!req.body?.content){
        res.status(400).send("400 에러! content가 post body에 없습니다.");
        return;
    }

    fs.writeFile("test.txt", req.body.content, function(error, data){
        if (error){
            // 파일 저장 중 문제 발생 시 500 서버 에러 반환
            res.status(500).send("500 서버 에러");
        } else {
            res.status(201).send("파일 생성 성공");
        }
    });
});

// url 연결 
app.get('/login', function(req,res){
    res.sendFile(__dirname + "/public/login.html")
})

app.get('/signup', function(req,res){
    res.sendFile(__dirname + "/public/signup.html")
})

// db 불러오기
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function getDBConnection(){
    const db = await sqlite.open({
        filename: 'product.db',
        driver: sqlite3.Database       
    });
    return db;
}

app.get('/', async function(req, res){ // '/'위치에 get 요청을 받는 경우

    let db = await getDBConnection();
    let rows = await db.all('select * from images');
    await db.close();
    products = '';
    for (var i=0; i<rows.length; i++){
        products += '제품명: ' + rows[i]['product_id'] + ', 제품가격: ' + rows[i]['product_price']
        + ", 카테고리: " + rows[i]['product_category'] + ', 제품이미지: ' + rows[i].product_image + '<br>';
    }
})