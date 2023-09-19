const fs = require('fs');

const mainFolder = 'main_folder';
const mainPath = `${__dirname}/${mainFolder}`

function createFolders(){
    fs.mkdir(`${mainPath}`, (err) => {
        if (err) throw err;

        for (let i = 0; i < 5; i++) {
            fs.mkdir(`${mainPath}/sub_folder_${i}`, (err) => {
                if (err) throw err;
            });
        }

        for (let i = 0; i < 5; i++) {
            fs.writeFile(`${mainPath}/text_${i}.txt`, '', (err) => {
                if (err) throw err;
            });
        }

        fs.readdir(`${mainPath}`, (err, files) => {
            if (err) throw err;

            files.map(file => {

                fs.stat(`${mainPath}/${file}`, (err, stats) => {
                    if (err) throw err;

                    if (stats.isFile()) {
                        console.log(`FILE: ${file}`);
                    } else if(stats.isDirectory()) {
                        console.log(`FOLDER: ${file}`);
                    }else{
                        console.log('SOMETHING ELSE');
                    }
                });
            })
        })
    });
}

//Щоб не видаляти постійно папку вручну, написав таку перевірку
fs.access(`${mainPath}`, (err) => {
    if (err){
        //  якщо немає каталога то створюємо
        createFolders()
    }else{
        //  якщо є - то спочатку видаляєм, потім створюємо
        fs.rm(`${mainPath}`, { recursive: true, force: true }, (err) => {
            if (err) throw err;

            createFolders()
        })
    }
});