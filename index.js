import { group } from 'console'
import fs from 'fs'

//TODO:: Falta organizar o Grupo
//TODO:: Sugestão:
// Fazer uma forma de identificar por índice o tratamento dos valores

const filePath = './input.csv'
const encoding = 'utf-8'

const fillValue = (value, i) => {
    if (i != 0) {
        return value
    }
}

const joinKeyValue = (values, keys) => {
    let csvKeyValue = []

    values.forEach((element, i) => {
        let listElement = element.split(',')

        keys.forEach((chave, i) => {
            let keyValue = {
                [chave]: listElement[i]
            }
            csvKeyValue.push(keyValue)

        });
    })
    return csvKeyValue
}

const getAdress = key => {
    if (key.includes('\"')) {
        return key
    }
}

const getAdressIndex = (key, i) => {
    if (key.includes('\"')) {
        return i
    }
}

const eraseCharacter = (quotations, characterToErase = "\"", exception = true) => {

    let noQuotations = quotations.map(key => {
        let newKey = key.replace(characterToErase, "")
        if (exception) {
            newKey = newKey.replace(characterToErase, "")
        }

        return newKey
    })

    return noQuotations
}

const arrangeList = adrNoQuotations => {
    let objeto = {}
    let adresses = adrNoQuotations.map((element, i) => {
        objeto = {
            type: "",
            tags: [],
            adress: ""
        }
        element = element.split(" ")
        objeto.type = element[0]
        objeto.tags = element.filter((e, i) => {
            if (i != 0) {
                return e
            }
        })

        return objeto
    })

    return adresses
}

const associateValueWithId = value => {

    const arrayWithValues = []
    let initQuotationMarks = false
    let init = 0

    for (let i = 0; i < value.length; i++) {
        const letter = value[i];
        if (letter == '\"') {
            initQuotationMarks = initQuotationMarks ? false : true
        }
        if (letter == ',' && !initQuotationMarks) {
            let newValue = value.slice(init, i)
            arrayWithValues.push(newValue)
            init = i
        }
    }

    return arrayWithValues
}


const arrangeGroups = (key, i) => {
    if (key == "group") {
        return i
    }
}

const eraseVoids = e => {
    if (e) {
        return e
    }
}

//list.splice(1, 0, "baz")

const arrangeKeys = (keys, groups, addresses) => {

    const organizedKeys = keys.filter(key => {
        if (key != 'group' && !key.includes('\"')) {
            return key
        }
    })

    organizedKeys.splice(2, 0, { groups })
    organizedKeys.splice(3, 0, { addresses })

    console.log(organizedKeys)

    return organizedKeys
}

fs.readFile(filePath, encoding, async (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    const file = data.split('\r\n')

    const keys = file[0].split(',')
    // console.log({ keys })

    let addressesIndex = keys.map(getAdressIndex)
    addressesIndex = addressesIndex.filter(eraseVoids)
    console.log({ addressesIndex })

    const adr = keys.filter(getAdress)
    // console.log({ adr })

    const adrNoQuotations = eraseCharacter(adr)
    // console.log({ adrNoQuotations })

    //TODO:: Valores a serem preenchidos pelos addresses
    const addresses = arrangeList(adrNoQuotations)
    console.log("\"addresses\": ", addresses)

    let groups = keys.map(arrangeGroups)
    groups = groups.filter(eraseVoids)
    console.log({ groups })

    const values = file.filter(fillValue)
    // console.log({ values })

    const valuesPerIdWithComma = values.map(associateValueWithId)
    // console.log({ valuesPerIdWithComma })

    const valuesPerId = valuesPerIdWithComma.map(element => eraseCharacter(element, ",", false))
    console.log({ valuesPerId })

    const organizedKeys = arrangeKeys(keys, groups, addresses)

    const csvKeyValue = joinKeyValue(values, keys)
    // console.log({ csvKeyValue })

    const archiveFormated = []


    // csvKeyValue.forEach(element => {
    //     if (Object.keys(element)[0].includes("\"")) {
    //         let key = Object.keys(element)[0]
    //         let arrayKey = key.split(' ')
    //         let type = arrayKey[0]
    //         let tag = arrayKey.filter((element, i) => {
    //             if (i != 0) {
    //                 return element
    //             }
    //         })
    //         let address = element[key]
    //         addresses.push({
    //             type,
    //             tags: [tag],
    //             address
    //         })
    //     }
    // })

    fs.writeFile("output.json", JSON.stringify(csvKeyValue),
        err => {

            // Checking for errors
            if (err) throw err;

            console.log("Done writing"); // Success)

        })
})