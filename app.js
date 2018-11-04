const scraper = require('table-scraper');
const fs = require('fs');
const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const app = express();


// const writeStream = fs.createWriteStream('problemData.csv');
//assigning url
// const url = 'http://ssipgujarat.in/gih/problem_statement.php';

const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.engine('.hbs', exhbs({defaultLayout: 'layout.hbs', extname: '.hbs'}));
app.set('view engine', 'hbs');




app.get('/', (req, res, next)=>{
    res.render('index');
});

app.get('/search',(req, res, next)=>{
    const raw = req.query.search;
    const url = 'http://ssipgujarat.in/gih/problem_statement.php';
    const rawData = [];
    scraper.get(url).then((tableData)=>{
        var problemData = tableData[0];
        for(var i=0;i<problemData.length;i++){
            var data = problemData[i];
            var discipline = data['Relevant Discipline'];
            discipline = discipline.toLowerCase();
            if(discipline == raw.toLowerCase()){
               rawData.push({'SrNo': data['Sr No.'], 'ProblemID':data['Problem ID'], 'ProblemStatement':data['Problem statement'],'TypeofIndustry':data['Type of Industry'],'RelevantDiscipline':data['Relevant Discipline'] });
            }
        }
        if(rawData.length>0){
            return res.render('index',{rawData, length: rawData.length > 0});
        }else{
            return res.render('index',{msg: 'No data found', alert: 1});
        }
    }).catch((err)=>{
        res.redirect('/');
    });
});



app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
})


// scraper.get(url).then((tableData)=>{
//     const ceData = [];
//     var problemData = tableData[0];
//     for(var i = 0;i< problemData.length; i++){
//         var data = problemData[i];
//         var discipline = data['Relevant Discipline'];
//         if(discipline == 'CE,IT' || discipline == 'CE' || discipline=='IT' || discipline=='IT,CE'){
//            writeStream.write(`${data['Sr No.']}, ${data['Problem ID']}, ${data['Problem statement']}, ${data['Type of Industry']} \n`);
//            count++;
//         }
//     }
//     console.log(count);
// });

// ID: rawData['Problem ID'], ps: rawData['Problem statement'],toi: rawData['Type of Industry']