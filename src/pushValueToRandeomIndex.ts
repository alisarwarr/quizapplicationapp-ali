export const pushValueToRandomIndex = (value: string, array: string[]):string[] => {

    const randomIndex: number = Math.floor(Math.random() * array.length);   //if array 3 then ( 0 - 2 )

    array.splice(randomIndex, 0, value);                                    //add value at 'randomIndex' & del value at 0 index

    return array;
}