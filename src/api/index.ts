import axios from 'axios';
import { pushValueToRandomIndex } from '../pushValueToRandeomIndex';

export type fetchDataTypes = {
    category          : string;
    correct_answer    : string;
    difficulty        : string;
    incorrect_answers : string[];
    question          : string;
    type              : string;
    //we updated the data of API before sending and create 'allOptions'for thats why
    allOptions        : string[];
}

export const fetchQuestions = async (amount: number) => {
    const API = `https://opentdb.com/api.php?amount=${amount}`;

    const { data: { results } } = await axios.get(API);            //returns array of multiple objects

    const modifiedData = results.map((obj: fetchDataTypes) => (    //updating each of object of an array
                            { 
                                ...obj,                            //string          //array
                                allOptions: pushValueToRandomIndex(obj.correct_answer, obj.incorrect_answers)
                            }
                          )
                        )

    return modifiedData;
}