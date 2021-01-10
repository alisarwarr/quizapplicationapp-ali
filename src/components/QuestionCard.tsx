import React from 'react';
import { Button } from '@material-ui/core';
import { answerObj } from '../App';

type props = {
    thatQuestion    : string;
    thatAllOptions  : string[];
    userAllAnswers ?: answerObj;
    checkAns        : (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function QuestionCard({
    thatQuestion,
    thatAllOptions,
    userAllAnswers,
    checkAns,
}: props) {
    return (
        <div className="questionCard">
            <p dangerouslySetInnerHTML={{ __html: thatQuestion }} className="questionCard_question"/>
            <div>
                {
                    thatAllOptions.map((oneOpt, index) => {
                        return (
                            <div key={index} className="questionCard_option">
                                <Button
                                    variant="contained"
                                    disabled={!!userAllAnswers}        //!! for convert type to boolean
                                    value={oneOpt}
                                    onClick={checkAns}
                                >  <span dangerouslySetInnerHTML={{ __html: oneOpt }}/>
                                </Button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default QuestionCard;