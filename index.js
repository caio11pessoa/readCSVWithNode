// import neatCsv from 'neat-csv';
import fs from 'fs'
import { join } from 'path'

const filePath = './input.csv'
const encoding = 'utf-8'

fs.readFile(filePath, encoding, async (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    const file = data.split('\r\n')

    const keys = file[0].split(',')

    const archive = []

    const archiveFormated = []

    const values = file.filter((element, i) => {
        if (i != 0) {
            return element
        }
    })

    values.forEach((element, i) => {
        let listElement = element.split(',')
        keys.forEach((chave, i) => {
            let agora = {
                [chave]: listElement[i]
            }
            archive.push(agora)
        });
    })
    const addresses = []
    archive.forEach(element => {
        if (Object.keys(element)[0].includes("\"")) {
            let key = Object.keys(element)[0]
            let arrayKey = key.split(' ')
            let type = arrayKey[0]
            let tag = arrayKey.filter((element, i) => {
                if (i != 0) {
                    return element
                }
            })
            let address = element[key]
            addresses.push({
                type,
                tags: [tag],
                address
            })
        }
    })

    fs.writeFile("output.json", JSON.stringify(archive),
        err => {

            // Checking for errors
            if (err) throw err;

            console.log("Done writing"); // Success)

        })
})