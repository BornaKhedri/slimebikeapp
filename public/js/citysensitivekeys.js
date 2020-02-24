var operatorToCity = {
  Lyft:['Chicago', 'DC','Seattle'],
  Lime:['Seattle','Los Angeles'],
  'Seattle Operator':['Seattle']

};

var infractionToCity = {
    'Blocking Sidewalk Seattle':['Seattle','Miami'],
    'Seattle Infraction 1':['Seattle'],
    'Seattle Infraction 2':['Seattle'],
    'Blocking Pathway':['San Fransisco', 'Los Angeles']
};

var cityToOperator = {

}

for (const operator in operatorToCity) {
    operatorToCity[operator].forEach(city=>{
        if (!(city in cityToOperator)) { 
            cityToOperator[city]=[]
        }
        cityToOperator[city].push(operator)
    })
}
console.log(cityToOperator)

var cityToInfraction = {

}

for (const infraction in infractionToCity) {
    infractionToCity[infraction].forEach(city=>{
        if (!(city in cityToInfraction)) { 
            cityToInfraction[city]=[]
        }
        cityToInfraction[city].push(infraction)
    })
}
console.log(cityToInfraction)