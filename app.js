// MySQL
const express = require('express');
const app = express();
const hostname = '192.168.1.107';
//'192.168.1.107';
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// const router =express.Router();


cloudinary.config({
    cloud_name: 'doyorigcq',
    api_key: '451532766918258',
    api_secret: '3IjooJAlCSOKwFIxB1SVz7vW8pE',
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const path = require('path');

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname,'publish-flutter')));

module.exports=app;

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
// const con = mysql.createConnection({
//     host: "192.168.1.107",
//     user: "root3",
//     password: "Ilove.240545",
//     database: "project_db",
//     port: 3307
// });

const con = mysql.createConnection({
    host: 'aws.connect.psdb.cloud',
    user: 'cf32oew6ci0d5avthps1',
    password: 'pscale_pw_AouXhub58keu9pkvAyJkNigMrRm6yEPxy9RWj8tObcC',
    database: 'project_db',
    port: 3306,
    // database: project_db
    // username: cf32oew6ci0d5avthps1
    // host: aws.connect.psdb.cloud
    // password: pscale_pw_AouXhub58keu9pkvAyJkNigMrRm6yEPxy9RWj8tObcC
      
    ssl: {
        ca: fs.readFileSync('cacert.pem'),
    }
});

// ตั้งค่า CORS

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});




con.connect(err => {
    if (err) throw (err);
    else {
        console.log("MySQL connected");
    }
})

let tablename = "user";

const queryDB = (sql) => {
    return new Promise((resolve, reject) => {
        // query method
        con.query(sql, (err, result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

const storage = multer.memoryStorage(); // ใช้ memory storage แทน disk storage

const upload = multer({ storage: storage });


app.get('/',(req,res)=>{
    res.send('This is my API running');
})

app.post('/saveimageproject', upload.single('file'), async (req, res) => {
    console.log("I'm in the backend of saveimageproject now");

    const imageBuffer = req.file.buffer; // ดึงข้อมูลไฟล์จาก buffer
    try {
        const result = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
            } else {
                console.log('Image uploaded successfully:', result.secure_url);
                const file = result.secure_url;
                // ทำสิ่งที่คุณต้องการกับ URL ของไฟล์ที่อัพโหลด
                updateImg('project', req.body.project_id, file).then(() => {
                    console.log("HI");
                    res.send("file:" + file);
                });
            }
        }).end(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
    }
});
const updateImg = async (tablename, project_id, fileimg) => {
    console.log("--------------------------");
    console.log("updateimg");
    console.log("id" + project_id);
    console.log("file" + fileimg);
    let sql = `UPDATE ${tablename} SET project_image='${fileimg}' WHERE project_id='${project_id}'`
    let result = await queryDB(sql);
    console.log("finish");
}


app.post('/saveimagegiver', upload.single('file'), async (req, res) => {
    console.log("I'm in the backend of saveimagegiver now");

    const imageBuffer = req.file.buffer; // ดึงข้อมูลไฟล์จาก buffer
    try {
        const result = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
            } else {
                console.log('Image uploaded successfully:', result.secure_url);
                const file = result.secure_url;
                // ทำสิ่งที่คุณต้องการกับ URL ของไฟล์ที่อัพโหลด
                updateImggiver('giverdetail', req.body.giver_detail_id, file).then(() => {
                    console.log("HI");
                    res.send("file:" + file);
                });
            }
        }).end(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
    }
});
const updateImggiver = async (tablename, giver_detail_id, fileimg) => {
    console.log("--------------------------");
    console.log("updateimg");
    console.log("id" + giver_detail_id);
    console.log("file" + fileimg);
    let sql = `UPDATE ${tablename} SET giver_picture='${fileimg}' WHERE giver_detail_id='${giver_detail_id}'`
    let result = await queryDB(sql);
    console.log("finish");
}

app.post('/updateimagegiver', upload.single('file'), async (req, res) => {
    console.log("I'm in the backend of updateimagegiver now");

    const imageBuffer = req.file.buffer; // ดึงข้อมูลไฟล์จาก buffer
    try {
        const result = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
            } else {
                console.log('Image uploaded successfully:', result.secure_url);
                const file = result.secure_url;
                // ทำสิ่งที่คุณต้องการกับ URL ของไฟล์ที่อัพโหลด
                updateImggiveredit('giverdetail', req.body.giver_detail_id, file).then(() => {
                    console.log("HI");
                    res.send("file:" + file);
                });
            }
        }).end(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
    }
});
const updateImggiveredit = async (tablename, giver_detail_id, fileimg) => {
    console.log("--------------------------");
    console.log("updateimg");
    console.log("id" + giver_detail_id);
    console.log("file" + fileimg);
    let sql = `UPDATE ${tablename} SET giver_picture='${fileimg}' WHERE giver_detail_id='${giver_detail_id}'`
    let result = await queryDB(sql);
    console.log("finish");
}
// create table and add data to database
app.post("/addDB", async (req, res) => {
    // let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP default CURRENT_TIMESTAMP, username VARCHAR(255),password VARCHAR(100),img VARCHAR(100))";
    // let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username, password) VALUES ("${req.body.username}", "${req.body.password}")`;
    result = await queryDB(sql);
    console.log("New record created successfully");
    res.end("New record created successfully");
})

app.post("/registerMySql", async (req, res) => {
    console.log("im in backend of regis now")
    //อย่างที่1สถานะประชาชน ให้บันทึกลงในตารางuser พร้อมบันทึกเลข userid ในตาราง giver และบันทึกdetail ใน giver detail
    //อย่างที่2สถานะหน่วยงานให้ขึ้นแจ้งเตือนใส่เลขหน่วยงานและ
    // let sql = `CREATE TABLE IF NOT EXISTS user(user_id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255),password VARCHAR(20),phone VARCHAR(45),address VARCHAR(500),mail VARCHAR(45),citizen VARCHAR(45),agencies VARCHAR(45))`;
    // let result = await queryDB(sql);

    //ประชาชน
    let username = req.body.username;
    let phone = req.body.phone;
    let address = req.body.address;
    let mail = req.body.mail;
    let status = req.body.status;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    //เพิ่มตัวแปรเลขหน่วยงาน

    // let obj = Object.keys(result);

    console.log(status);
    if (status == "ประชาชน") {
        console.log("ประชาชน");
        sql = `INSERT INTO user(username,phone,address,mail,citizen,agencies,password) VALUES ("${req.body.username}","${req.body.phone}","${req.body.address}","${req.body.mail}","1","0","${req.body.password}")`;
        result = await queryDB(sql);
        console.log("ประชาชนลงทะเบียนสำเร็จ");
        res.send("0,");
    }
    else {
        console.log("หน่วยงาน and im send 1 to frontend");
        res.send("1," + username + "," + phone + "," + address + "," + mail + "," + password);
    }
})


app.post("/registerAgencies", async (req, res) => {
    console.log("im in backend of regisAgencies now")

    // let sql = `CREATE TABLE IF NOT EXISTS user(user_id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255),password VARCHAR(20),phone VARCHAR(45),address VARCHAR(500),mail VARCHAR(45),citizen VARCHAR(45),agencies VARCHAR(45))`;
    // let result = await queryDB(sql);

    let username = req.body.username;
    let phone = req.body.phone;
    let address = req.body.address;
    let mail = req.body.mail;
    let password = req.body.password;
    let agencies_number = req.body.agencies_number;
    let agenciescheck = "1";
    //เพิ่มตัวแปรเลขหน่วยงาน

    // let obj = Object.keys(result);

    console.log("หน่วยงาน");
    sql = `INSERT INTO user(username,phone,address,mail,citizen,agencies,password,agenciescheck) VALUES ("${username}","${phone}","${address}","${mail}","0","${agencies_number}","${password}","${agenciescheck}")`;
    result = await queryDB(sql);
    console.log("หน่วยงานลงทะเบียนสำเร็จ");
    res.send();

})


app.post("/loginMySql", async (req, res) => {
    console.log("Im im backend of login");
    let sql = "SELECT mail,password FROM user";
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let checkmail = false;
    let checkpassword = false;

    let obj = Object.keys(result);
    for (var i = 0; i < obj.length; i++) {
        console.log(i);
        console.log(result[obj[i]].mail);

        if (result[obj[i]].mail == req.body.mail) {
            checkmail = true;
            console.log("HI: " + result[obj[i]].mail);
        }
        if (checkmail) {
            console.log("mail it true im going to check password");
            if (result[obj[i]].password == req.body.password) {
                checkpassword = true;
                console.log(result[obj[i]].password)
                break;
            }
            res.send("1," + "no");//password wrong
            console.log("i send 1 case password wrong.");
            break;
        }
    }
    if (checkmail == false) {
        console.log("im going to front with 0 case username wrong");
        res.send("0," + "no");
    }

    if (checkmail && checkpassword) {

        let sql = `SELECT user_id,username,citizen,agenciescheck FROM user WHERE mail='${req.body.mail}'`;
        let result = await queryDB(sql);
        result = Object.assign({}, result);
        for (var i = 0; i < obj.length; i++) {
            console.log(result[obj[i]]);
        }

        console.log("im going to front with 2 case all correct");
        console.log("2," + result[0].user_id + "," + result[0].username + "," + req.body.mail + "," + req.body.password + "," + result[0].citizen + "," + result[0].agenciescheck);
        res.send("2," + result[0].user_id + "," + result[0].username + "," + req.body.mail + "," + req.body.password + "," + result[0].citizen + "," + result[0].agenciescheck);
        console.log("LoginComplete");
    }
})

app.post("/ForgotPassword_addmail", async (req, res) => {
    console.log("Im im backend of ForgotPassword_addmail");
    let sql = "SELECT mail FROM user";
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let mail_exist = false;
    let obj = Object.keys(result);

    for (var i = 0; i < obj.length; i++) {
        console.log(i);
        console.log(req.body.mail + "=" + result[obj[i]].mail);

        if (result[obj[i]].mail == req.body.mail) {
            mail_exist = true;
            console.log("I found " + result[obj[i]].mail);
            break;
        }
        else {
            console.log("try next");
        }
    }
    if (mail_exist == false) {
        console.log("Im not found your mail");
        console.log("I send 1");
        res.send("1");
    }
    if (mail_exist) {
        console.log("I send 0");
        res.send("0");
    }
})

app.post("/ForgotPassword_newpassword", async (req, res) => {
    console.log("Im im backend of ForgotPassword_newpassword");
    let sql = "SELECT mail,password FROM user";
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    // let mail_exist = false;
    let obj = Object.keys(result);

    if (req.body.password == req.body.confirmpassword) {
        for (var i = 0; i < obj.length; i++) {
            console.log(i);
            console.log(result[obj[i]].mail);

            if (result[obj[i]].mail == req.body.mail) {
                console.log("I found " + result[obj[i]].mail);
                console.log("I will change password for you");
                sql = `UPDATE user SET password = '${req.body.password}' WHERE mail='${req.body.mail}'`;

                result = await queryDB(sql);
                console.log("เปลี่ยนรหัสสำเร็จ");
                break;
            }
            else {
                console.log("try next");
            }
        }
        res.send();
    }
})

app.post("/getprofile", async (req, res) => {
    console.log("Im im backend of Getprofile now");
    let sql = `SELECT username,phone,address,mail,password FROM user WHERE user_id ="${req.body.id}"`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    res.send(result[0].username + "!" + result[0].phone + "!" + result[0].address + "!" + result[0].mail + "!" + result[0].password);

})

app.post("/getprofileadmin", async (req, res) => {
    console.log("Im im backend of Getprofileadmin now");
    let sql = `SELECT username,mail,password FROM user WHERE user_id ="${req.body.id}"`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    res.send(result[0].username + "!" + result[0].mail + "!" + result[0].password);

})

app.get("/showRecomended", async (req, res) => {
    console.log("im in backend of showRecomended");
    let sql = `SELECT project_id, projectname, projectdetail,project_image FROM project WHERE recomended = '1'`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);
    for (var i = 0; i < obj.length; i++) {
        console.log(result[obj[i]].project_id + result[obj[i]].projectname + result[obj[i]].projectdetail + result[obj[i]].project_image);
    }
    console.log("im going to front of list");
    res.json(result);

})

app.get("/showNews", async (req, res) => {
    console.log("im in backend of showNews");
    let sql = `SELECT idnews, name, detail,img FROM news`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    // let obj = Object.keys(result);
    // for (var i = 0; i < obj.length; i++) {
    //     console.log(result[obj[i]].project_id + result[obj[i]].projectname + result[obj[i]].projectdetail + result[obj[i]].project_image);
    // }
    console.log("im going to front of list");
    res.json(result);

})

app.post("/showNewsdetail", async (req, res) => {
    console.log("im in backend of showNewsdetail");
    let sql = `SELECT  name, detail,img FROM news WHERE idnews=${req.body.id}`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    // let obj = Object.keys(result);
    // for (var i = 0; i < obj.length; i++) {
    //     console.log(result[obj[i]].project_id + result[obj[i]].projectname + result[obj[i]].projectdetail + result[obj[i]].project_image);
    // }
    console.log("im going to front of list");
    res.send(result[0].name+","+result[0].detail+","+result[0].img);

})

app.post("/showolddata", async (req, res) => {
    console.log("im in backend of showoldData");
    let sql = `SELECT giver_name, giver_contact, donate,giver_picture,appointment,appointdate FROM giverdetail WHERE giver_detail_id = "${req.body.giver_detail_id}"`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);

    console.log(result[0].giver_name + result[0].giver_contact + result[0].donate + result[0].giver_picture + result[0].appointment + result[0].appointdate);

    console.log("im going to front of edit");
    res.send(result[0].giver_name + "!" + result[0].giver_contact + "!" + result[0].donate + "!" + result[0].giver_picture + "!" + result[0].appointment + "!" + result[0].appointdate);

})

app.get("/showallproject", async (req, res) => {
    console.log("im in backend of showAllproject");
    let sql = `SELECT project_id, projectname, projectdetail,project_image FROM project`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);
    for (var i = 0; i < obj.length; i++) {
        console.log(result[obj[i]].project_id + result[obj[i]].projectname + result[obj[i]].projectdetail + result[obj[i]].project_image);
    }
    console.log("im going to front of list");
    res.json(result);

})

app.post("/showprogress", async (req, res) => {
    console.log("im in backend of showProgress");
    var finish = "เสร็จสิ้น"
    let sql = `SELECT giver_detail_id, appointment, appointdate,approve,project_id,projectname,reason FROM giverdetail WHERE giver_id="${req.body.id}" AND approve !="${finish}" `;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);

    for (var i = 0; i < obj.length; i++) {
        console.log(result[obj[i]].giver_detail_id + result[obj[i]].appointment + result[obj[i]].appointdate + result[obj[i]].approve + result[obj[i]].projectname + result[obj[i]].reason);
    }

    console.log("im going to front of progresspage");
    res.json(result);
})

app.post("/showagencies", async (req, res) => {
    console.log("im in backend of showAgencies");
    var finish = "เสร็จสิ้น"
    let sql = `SELECT user_id, username, agencies,agenciescheck FROM user WHERE agenciescheck ="${req.body.status}" `;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);

    // for (var i = 0; i < obj.length; i++) {
    //     console.log(result[obj[i]].giver_detail_id + result[obj[i]].appointment + result[obj[i]].appointdate + result[obj[i]].approve + result[obj[i]].projectname + result[obj[i]].reason);
    // }

    console.log("im going to front of mainadmin");
    res.json(result);
})

app.post("/showallagencies", async (req, res) => {
    console.log("im in backend of showallAgencies");
    console.log(req.body.status);
    if (req.body.status == "ทั้งหมด") {
        let sql = `SELECT user_id, username, agencies,agenciescheck,reason FROM user WHERE agenciescheck ="อนุมัติ" OR agenciescheck="0" `;
        let result = await queryDB(sql);
        result = Object.assign({}, result);

        let obj = Object.keys(result);
        res.json(result);

    }
    else if (req.body.status == "อนุมัติ" || req.body.status == "0") {
        sql = `SELECT user_id, username, agencies,agenciescheck,reason FROM user WHERE agenciescheck ="${req.body.status}" `;
        result = await queryDB(sql);
        result = Object.assign({}, result);

        obj = Object.keys(result);

        console.log(result);
        res.json(result);

    }


    // console.log("im going to front of history");
    // res.json(result);
})

app.post("/showHistory", async (req, res) => {
    console.log("im in backend of showHistory Project");
    console.log(req.body.userid);
    let sql = `SELECT history_id,giver_username, projectname,datefinish,appointment FROM history WHERE giver_id='${req.body.userid}'`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result);
})

app.post("/showprofileagencies", async (req, res) => {
    console.log("im in backend of showprofileagencies Project");
    let sql = `SELECT username,phone,address,mail,agenciescheck,reason FROM user WHERE user_id='${req.body.id}'`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log(result[0].username + "!" + result[0].phone + "!" + result[0].address + "!" + result[0].mail + "!" + result[0].agenciescheck + "!" + result[0].reason)
    res.send(req.body.id + "!" + result[0].username + "!" + result[0].phone + "!" + result[0].address + "!" + result[0].mail + "!" + result[0].agenciescheck + "!" + result[0].reason);
})

app.post("/showprofileadmin", async (req, res) => {
    console.log("im in backend of showprofileagencies Project");
    let sql = `SELECT username,mail FROM user WHERE user_id='${req.body.id}'`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.send(req.body.id + "!" + result[0].username + "!" + result[0].mail);
})

app.post("/showgiverdetail", async (req, res) => {
    console.log("im in backend of Giverdetail");

    let sql = `SELECT donate,giver_picture,appointment,appointdate FROM giverdetail WHERE giver_detail_id='${req.body.id}'`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log(result[0].donate + "!" + result[0].giver_picture + "!" + result[0].appointment + "!" + result[0].appointdate);
    res.send(result[0].donate + "!" + result[0].giver_picture + "!" + result[0].appointment + "!" + result[0].appointdate);
})

app.post("/showallgiverdetail", async (req, res) => {
    console.log("im in backend of Giverdetail");

    let sql = `SELECT giver_name,giver_contact,donate,giver_picture,appointment,appointdate,reason FROM giverdetail WHERE giver_detail_id='${req.body.id}'`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log(result[0].giver_name + "!" + result[0].giver_contact + "!" + result[0].donate + "!" + result[0].giver_picture + "!" + result[0].appointment + "!" + result[0].appointdate + "!" + result[0].reason);
    res.send(result[0].giver_name + "!" + result[0].giver_contact + "!" + result[0].donate + "!" + result[0].giver_picture + "!" + result[0].appointment + "!" + result[0].appointdate + "!" + result[0].reason);
})

app.post("/saveproject", async (req, res) => {
    console.log("im in backend of saveproject now");
    // let sql = `CREATE TABLE IF NOT EXISTS project(project_id INT AUTO_INCREMENT PRIMARY KEY, projectname VARCHAR(200),projectdetail VARCHAR(200),object VARCHAR(200),project_image VARCHAR(5000),postoffice VARCHAR(200),agenciesplace VARCHAR(200),appointplace VARCHAR(200),contact VARCHAR(200),reccomended INT)`;
    // let result = await queryDB(sql);

    //ประชาชน

    // let obj = Object.keys(result);

    sql = `INSERT INTO project(projectname,projectdetail,object,postoffice,agenciesplace,appointplace,contact,agencies) VALUES ("${req.body.projectname}","${req.body.projectdetail}","${req.body.object}","${req.body.postoffice}","${req.body.agenciesplace}","${req.body.appointplace}","${req.body.contact}","${req.body.agencies}")`;
    result = await queryDB(sql);
    console.log("บันทึกโปรเจคสำเร็จ");

    sql = `SELECT project_id FROM project WHERE projectname="${req.body.projectname}" AND projectdetail="${req.body.projectdetail}" AND object="${req.body.object}" AND postoffice="${req.body.postoffice}" AND agenciesplace="${req.body.agenciesplace}" AND appointplace="${req.body.appointplace}" AND contact="${req.body.contact}"`;

    result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log("" + result[0].project_id);
    res.send("" + result[0].project_id);
})

app.post("/savegiverdetail", async (req, res) => {
    console.log("im in backend of savegiverdetail now");
    let result1
    let sql1 = `SELECT projectname FROM project WHERE project_id="${req.body.agencies}"`;
    result1 = await queryDB(sql1);
    result1 = result1[0];
    console.log(result1.projectname);

    let sql = `INSERT INTO giverdetail(giver_id,giver_name,donate,appointment,giver_contact,project_id,appointdate,projectname,approve) VALUES ("${req.body.giver_id}","${req.body.name}","${req.body.object}","${req.body.address}","${req.body.contact}","${req.body.agencies}","${req.body.date}","${result1.projectname}","รอหน่วยงานยืนยัน")`;
    let result = await queryDB(sql);
    console.log("บันทึกการบริจาคสำเร็จ");

    sql = `SELECT giver_detail_id FROM giverdetail WHERE giver_id="${req.body.giver_id}" AND giver_name="${req.body.name}" AND donate="${req.body.object}" AND appointment="${req.body.address}" AND giver_contact="${req.body.contact}" AND project_id="${req.body.agencies}" AND appointdate="${req.body.date}" AND projectname="${result1.projectname}"`;

    result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log("" + result[0].giver_detail_id);
    res.send("" + result[0].giver_detail_id);
})

app.post("/showprojectdetail", async (req, res) => {
    console.log("im in backend of showprojectdetail now");

    var owner;
    let sql1 = `SELECT agencies FROM project WHERE project_id=${req.body.id}`;//ไปเอา primarykey ของหน่วยงานมาก่อน
    let result1 = await queryDB(sql1);
    result1 = Object.assign({}, result1);
    owner = result1[0].agencies;
    console.log(owner);

    sql1 = `SELECT username,address FROM user WHERE user_id=${owner}`;
    result1 = await queryDB(sql1);
    result1 = Object.assign({}, result1);

    let sql = `SELECT projectname, projectdetail,object,project_image,postoffice,agenciesplace,appointplace,contact,agencies FROM project WHERE project_id=${req.body.id}`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);
    let obj1 = Object.keys(result1);
    res.send(result[obj].projectname + "!" + result[obj].projectdetail + "!" + result[obj].object + "!" + result[obj].project_image + "!" + result[obj].postoffice + "!" + result[obj].agenciesplace + "!" + result[obj].appointplace + "!" + result[obj].contact + "!" + result1[obj1].username + "!" + result1[obj1].address);

    // res.json(result);
})

app.post("/showagenciesproject", async (req, res) => {
    console.log("im in backend of showagenciesproject now");


    let sql = `SELECT projectname, projectdetail,project_id FROM project WHERE agencies=${req.body.id}`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);

    for (var i = 0; i < obj.length; i++) {
        console.log(result[obj[i]]);
    }

    if (!result || Object.keys(result).length === 0) {
        console.log("No data found");
        res.json({ message: null });
        return;
    }

    res.json(result);

    // res.json(result);
})

app.post("/showgiverproject", async (req, res) => {
    console.log("im in backend of showgiverproject now");


    let sql = `SELECT giver_name, approve,giver_detail_id FROM giverdetail WHERE project_id=${req.body.id}`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);

    for (var i = 0; i < obj.length; i++) {
        console.log(result[obj[i]]);
    }

    if (!result || Object.keys(result).length === 0) {
        console.log("No data found");
        res.json({ message: null });
        return;
    }

    res.json(result);

    // res.json(result);
})

app.post("/deletecanclegiver", async (req, res) => {
    console.log("delete");
    let sql = `DELETE FROM giverdetail WHERE giver_detail_id = '${req.body.id}'`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record deleted successfully");
})

app.post("/finish", async (req, res) => {
    console.log("delete");

    const selectSql = `SELECT giver_id,giver_name, projectname, appointdate FROM giverdetail WHERE giver_detail_id="${req.body.id}"`;
    const selectResult = await queryDB(selectSql);
    console.log(selectResult);

    const giverID = selectResult[0].giver_id;
    const giverName = selectResult[0].giver_name;
    const projectName = selectResult[0].projectname;
    const appointDate = selectResult[0].appointdate;
    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // จัดรูปแบบใหม่
    const datefinish = `${day}/${month}/${year}`;

    // ทำ UPDATE โดยใช้ค่าที่ได้จาก SELECT
    let sql = `INSERT INTO history (giver_id,giver_username,projectname,datefinish,appointment) VALUES ("${giverID}","${giverName}","${projectName}","${datefinish}","${appointDate}")`;
    result = await queryDB(sql);

    var finish = "เสร็จสิ้น"
    sql = `UPDATE giverdetail SET approve="${finish}" WHERE giver_detail_id=${req.body.id}`
    result = await queryDB(sql);


    res.end("Update history okk successfully");
})

app.post("/deleteuseragencies", async (req, res) => {
    console.log("delete");
    let sqlSelect = `SELECT project_id FROM project WHERE agencies="${req.body.id}"`;
    let resultSelect = await queryDB(sqlSelect);

    // Check if resultSelect is an array and has elements
    if (Array.isArray(resultSelect) && resultSelect.length > 0) {
        for (var i = 0; i < resultSelect.length; i++) {
            let sqlDelete = `DELETE FROM giverdetail WHERE project_id = '${resultSelect[i].project_id}'`;
            let resultDelete = await queryDB(sqlDelete);
            console.log(resultDelete);
        }
    } else {
        console.log('No projects found for the given agencies');
    }


    sql = `DELETE FROM project WHERE agencies = '${req.body.id}'`;
    result = await queryDB(sql);
    console.log(result);

    sql = `DELETE FROM user WHERE user_id = '${req.body.id}'`;
    result = await queryDB(sql);
    console.log(result);



    res.end("Record deleted successfully");
})

app.post("/deleteuser", async (req, res) => {
    console.log("delete");


    sql = `DELETE FROM giverdetail WHERE giver_id = '${req.body.id}'`;
    result = await queryDB(sql);
    console.log(result);

    sql = `DELETE FROM user WHERE user_id = '${req.body.id}'`;
    result = await queryDB(sql);
    console.log(result);



    res.end("Record deleted successfully");
})

app.get("/showData", async (req, res) => {
    console.log("im in backend of showData Project");
    let sql = `SELECT id,img, projectname, projectdetail FROM project`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);

    let obj = Object.keys(result);
    for (var i = 0; i < obj.length; i++) {
        console.log(result[obj[i]].img + result[obj[i]].projectname + result[obj[i]].projectdetail);
    }
    res.json(result);
})


app.post("/SaveHistory", async (req, res) => {
    // let sql = `CREATE TABLE IF NOT EXISTS History (id INT AUTO_INCREMENT PRIMARY KEY, time TIMESTAMP default CURRENT_TIMESTAMP, username VARCHAR(255),products VARCHAR(255),price VARCHAR(100))`;
    // let result = queryDB(sql);

    sql = `INSERT INTO History (username,products, price) VALUES ("${req.body.username}","${req.body.products}","${req.body.price}")`;
    result = queryDB(sql)
    console.log("Save");
    res.send("Save");
})

app.post("/gethistory", async (req, res) => {
    // let sql = `SELECT * FROM ${tablename}`;
    let sql = `SELECT products,price FROM History WHERE username = '${req.body.username}'`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result);
    JSON.stringify(result);
    console.log(result);
})

app.post("/updategiverdetail", async (req, res) => {
    console.log("im in backend of updategiverdetail now");
    let sql = `UPDATE giverdetail SET giver_id="${req.body.giver_id}",giver_name="${req.body.name}",donate="${req.body.object}",appointment="${req.body.address}",giver_contact="${req.body.contact}",appointdate="${req.body.date}",approve="${req.body.status}",reason="" WHERE giver_detail_id = '${req.body.giver_detail_id}'`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record updated successfully");
})

app.post("/addreason", async (req, res) => {
    console.log("im in backend of Reason now");
    var status = "หน่วยงานปฏิเสธ";
    let sql = `UPDATE giverdetail SET reason="${req.body.reason}",approve="${status}" WHERE giver_detail_id = '${req.body.id}'`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record updated successfully");
})

app.post("/updateagenciescheck", async (req, res) => {
    console.log("im in backend of updateagenciescheck now");

    let sql = `UPDATE user SET reason="${req.body.reason}",agenciescheck="${req.body.status}" WHERE  user_id = '${req.body.user_id}'`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record updated successfully");
})


app.post("/employdata", async (req, res) => {
    console.log("im in backend of Employdata now");
    var approve = "หน่วยงานตอบรับ"
    let sql = `UPDATE giverdetail SET employ_name="${req.body.employname}",employ_contact="${req.body.employ_contact}",approve="${approve}" WHERE giver_detail_id="${req.body.id}"`;
    let result = await queryDB(sql);

    console.log("Record updated successfully");

    sql = `SELECT employ_name,employ_contact FROM giverdetail WHERE giver_detail_id = '${req.body.id}'`;
    result = await queryDB(sql);
    result = Object.assign({}, result);
    res.send(result[0].employ_name + "," + result[0].employ_contact);
})

app.post("/showemploydata", async (req, res) => {
    console.log("im in backend of showEmploydata now");

    let sql = `SELECT employ_name,employ_contact FROM giverdetail WHERE giver_detail_id = '${req.body.id}'`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.send(result[0].employ_name + "," + result[0].employ_contact);
})

app.post("/editagenciescheck", async (req, res) => {
    console.log("im in backend of editagenciescheck now");
    var reason = "";
    let sql = `UPDATE user SET username="${req.body.name}",agencies="${req.body.number}",agenciescheck="${req.body.status}",reason="${reason}" WHERE user_id="${req.body.id}"`;
    let result = await queryDB(sql);

    sql = `SELECT agenciescheck FROM user WHERE user_id = '${req.body.id}'`;
    result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log("" + result[0].agenciescheck);
    res.json(result[0].agenciescheck);
})


app.post("/editprofile", async (req, res) => {
    console.log("im in backend of editprofile now");
    let sql = `UPDATE user SET username="${req.body.name}",phone="${req.body.phone}",address="${req.body.address}",mail="${req.body.mail}",password="${req.body.password}" WHERE user_id="${req.body.id}"`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record updated successfully");
})

app.post("/editprofileadmin", async (req, res) => {
    console.log("im in backend of editprofileadmin now");
    let sql = `UPDATE user SET username="${req.body.name}" ,mail="${req.body.mail}",password="${req.body.password}" WHERE user_id="${req.body.id}"`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record updated successfully");
})

app.post("/search", async (req, res) => {
    // สมมติว่า searchTerm คือข้อความที่ผู้ใช้ป้อนเข้ามา
    let searchTerm = req.body.searchtext;
    let sql = `SELECT project_id, projectname, projectdetail,project_image FROM project WHERE object LIKE '%${searchTerm}%'`;

    let result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log(result);
    res.json(result);

})

app.post("/deleteproject", async (req, res) => {
    console.log("delete");

    let sql = `DELETE FROM giverdetail WHERE project_id = '${req.body.id}'`;
    let result = await queryDB(sql);
    sql = `DELETE FROM project WHERE project_id= '${req.body.id}'`;
    result = await queryDB(sql);
    console.log(result);
    console.log("Record deleted project successfully");
})

// update data
app.post("/updateDB", async (req, res) => {
    let sql = `UPDATE ${tablename} SET giver_id=${req.body.giver_id},giver_name=${req.body.name},donate=${req.body.object},appointment=${req.body.address},giver_contact=${req.body.contact},appointdate=${req.body.date},approve=${req.body.status} WHERE giver_detail_id = '${req.body.giver_detail_id}'`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record updated successfully");
})

// delete data
app.post("/deleteDB", async (req, res) => {
    console.log("delete");
    let sql = `DELETE FROM ${tablename} WHERE username = '${req.body.username}'`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record deleted successfully");
})

// show data
app.get("/showDB", async (req, res) => {
    // let sql = `SELECT * FROM ${tablename}`;
    let sql = `SELECT id, username, password FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log(result);
    res.json(result);
})

// const PORT = process.env.PORT|| 3000; // ให้เป็นตัวเลขเท่านั้น
// app.listen(PORT,  () => {
//     console.log(`Server running at ${PORT}`);
// });


const PORT = 3000; // ให้เป็นตัวเลขเท่านั้น
// app.listen(port, hostname, () => {
//     console.log(`Server running at   http://${hostname}:${port}/`);
// });

// const PORT = 9000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

