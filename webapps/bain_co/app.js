// Nodejs BMI Calculator Coding Challenge - Devendra Prasad - devendraprasad1984@gmail.com
/*
NAME: Devendra Prasad
Coding Assessment for Bain and Co
Problem Statement
1) Calculate the BMI (Body Mass Index) using Formula 1, BMI Category and Health risk from Table 1 of the person and add them as 3 new columns
2) Count the total number of overweight people using ranges in the column BMI Category of Table 1, check this is consistent programmatically and add any other observations in the documentation
3) Create build, tests to make sure the code is working as expected and this can be added to an automation build / test / deployment pipeline

BMI Formula = BMI(kg/m ) = mass(kg) / height(m)
For example, if you are 175cm = (1.75m) in height and 75kg in weight, you can calculate your BMI as follows: 75kg / (1.75m2) = 24.49kg/m2

BMI Category=['Underweight', 'Normal weight', 'Overweight', 'Moderately obese', 'Severely obese', 'Very severely obese']
BMI Range (kg/m2)
    0=18.4 and below
    1=18.5 - 24.9
    2=25 - 29.9
    3=30 - 34.9
    4=35 - 39.9
    5=40 and above
Health risk: Malnutrition risk, Low risk, Enhanced risk, Medium risk, High risk, Very high risk
 */

import data from "./data/bmi_data.js";
import {getPeopleByCategory} from './utils/calculations.js'
import {print, printRecords} from "./utils/print.js"
import {cat_enums} from "./utils/consts.js"
import {updateDatasetWithCalculations} from "./app/update.js";


function main() {
    const updateDataset = updateDatasetWithCalculations(data)
    print('printing BMI calculation results for ' + updateDataset.length + ' patients')

    const overWeightPeople = getPeopleByCategory(updateDataset, cat_enums.OVERWEIGHT)
    const ModObesPeople = getPeopleByCategory(updateDataset, cat_enums.MODERATELY_OBESE)
    print(`found ${overWeightPeople.length} ${cat_enums.OVERWEIGHT} patients`)
    print(`found ${ModObesPeople.length} ${cat_enums.MODERATELY_OBESE} patients`)

    let printTop = 5 //put a number if want to top N records or leave undefined to print all
    printRecords(updateDataset, printTop)
}


main()
