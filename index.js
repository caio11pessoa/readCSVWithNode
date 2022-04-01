import { group } from 'console'
import fs from 'fs'

//TODO:: Falta organizar o Grupo
//TODO:: Sugestão:
// Fazer uma forma de identificar por índice o tratamento dos valores

class Sample {
    constructor(fullname, eid, groups, addresses, invisible, see_all) {
        this.fullname = fullname;
        this.eid = eid;
        this.groups = groups;
        this.addresses = addresses;
        this.invisible = invisible;
        this.see_all = see_all;
    }
}

const objectBase = {
    fullname: "",
    eid: "",
    groups: [],
    addresses: [
        {
            type: "",
            tags: [],
            adress: ""
        }
    ],
    invisible: "",
    see_all: ""
}

const filePath = './input.csv'
const encoding = 'utf-8'

const fillValue = (value, i) => {
    if (i != 0) {
        return value
    }
}

const getAdress = (key, i, all) => {
    if (i > 1 && key != "group" && i < all.length - 2) {
        return key
    }
}

const getAdressIndex = (key, i, all) => {
    if (i > 1 && key != "group" && i < all.length - 2) {
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

const arrangeList = (adrNoQuotations, indexes) => {
    let objeto = {}
    let addresses = adrNoQuotations.map((element, i) => {
        objeto = {
            type: "",
            tags: [],
            adress: indexes[i]
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

    return addresses
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

    let newValue = value.slice(init, value.length)
    arrayWithValues.push(newValue)
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

const arrangeKeys = (keys, groups, addresses) => {

    objectBase.groups = groups
    objectBase.addresses = addresses


    return objectBase
}

const joinValueWithKeyGroup = (value, i, all) => {
    const allObj = value.map((value, i, all) => {
        if (i == 0) {
            objectBase.fullname = value
        } else if (i == 1) {
            objectBase.eid = value
        } else if (objectBase.groups.includes(i)) {

            objectBase.groups = objectBase.groups.map(element => {
                if (element === i) {
                    return value
                } else {
                    return element
                }
            })
        }
        return objectBase
    })
    return allObj

}

// const joinAdress = (element, i, all, joinAdress, values) => {
//     values.map((element, i, all) => {

//     })
// }

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

    const addresses = arrangeList(adrNoQuotations, addressesIndex)
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

    const arrangedKeys = arrangeKeys(keys, groups, addresses)
    // console.log({ arrangedKeys })
    const final = []
    valuesPerId.forEach((element, i) => {
        final.push(new Sample())
        element.forEach((e, indice, all) => {
            if (indice == 0) final[i].fullname = e
            if (indice == 1) final[i].eid = e
            if (indice == all.length - 2) final[i].invisible = e
            if (indice == all.length - 1) final[i].see_all = e
            console.log(final[i], e)
        })
    })


    const verificaIgual = (groups, addressesIndex, i) => {
        let iguality = groups.filter(element => {
            if (element == i) {
                return { element, type: "group" }
            }
        })
        if (!iguality[0]) {
            iguality = addressesIndex.filter(element => {
                if (element.adress == i) {
                    return element.adress
                }
            })
        }
        return iguality
    }

    // let existe = {}
    // valuesPerId.forEach((element, i) => {
    //     element.forEach((e, indice, all) => {
    //         if(indice > 1 && indice < all.length -2){
    //             existe = verificaIgual(groups, addresses, indice)
    //             final[i]
    //         }
    //     })
    // })

    final.forEach(element => {
        element.groups = groups
        element.addresses = addresses
    })
    console.log(final, "fina")
    final.forEach((element, i) => {
        element.groups = element.groups.map(e => {
            return valuesPerId[i][e]
        })
        element.addresses = element.addresses.map((e, is) => {
            return {
                type: e.type,
                tags: e.tags,
                adress: valuesPerId[i][e.adress]
            }
        })
    })

    console.log("final", final)
    // const keysValue = valuesPerId.map(joinValueWithKeyGroup)
    // console.log(keysValue[0] )


    fs.writeFile("output.json", JSON.stringify(final),
        err => {

            // Checking for errors
            if (err) throw err;

            console.log("Done writing"); // Success)

        })
})