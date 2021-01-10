import React, { useState } from 'react';
import { QuestionCard } from './components';
import { Card, CardContent, Typography, Button, Chip, Switch, CardActionArea } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Brightness4SharpIcon from '@material-ui/icons/Brightness4Sharp';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useWebAnimations, { backInLeft, backInRight, fadeIn } from '@wellyshen/use-web-animations';
import { fetchQuestions, fetchDataTypes } from  './api';
import classnames from 'classnames';

export type answerObj = {
    question     : string;
    userAnswer   : string;
    correctOrNot : boolean;
    correctAns   : string;
}

const TOTAL_QUESTIONS = 10;

const useStyles = makeStyles({
    app: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        //for cover entire screen of any size
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        bottom: 0,
        overflow: "hidden"
        //for cover entire screen of any size
    },
    card: {
       width: "23.5rem",
       height: "33rem",
       display: "flex",
       justifyContent: "center",
       alignItems: "center"
    },
    themechip: {
        display: "flex",
        alignItems: "center"
    }
})

function App() {
    const [ loading, setLoading ] = useState(false);
    const [ gameover,  setGameover ] = useState(true);
    const [ score,  setScrore ] = useState(0);
    const [ allQuestion, setAllQuestion ] = useState<fetchDataTypes[]>([]);   //array contains objects
    const [ userAllAnswers, setUserAllAnswers ] = useState<answerObj[]>([]);  //array contains objects
    const [ currentQuesNo, setCurrentQuesNo ] = useState(10);

    //theme
    const [ darkMode, setDarkMode ] = useState(true);
    const theme = createMuiTheme({
        palette: {
            type: darkMode ? "dark" : "light",
            background: {        //black     //white
                paper: darkMode ? "#000000" : "#FFFFFF"
            }
        }
    })
  
    const cardAnimation = useWebAnimations({ ...backInLeft });
    const btnAnimation = useWebAnimations({ ...backInRight });
    const chipAnimation = useWebAnimations({ ...fadeIn });

    const startQuiz = async () => {
        setLoading(true);
        setGameover(false);
        setScrore(0);
        setAllQuestion(await fetchQuestions(10));
        setUserAllAnswers([]);
        setCurrentQuesNo(0);
        //all operations performed so, loading now false
        setLoading(false);
    }

    const checkAns = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(!gameover) {
            // user input
            const userInput = e.currentTarget.value;
            // correct one
            const correctOne = allQuestion[currentQuesNo].correct_answer;
            // correct or not
            const correctOrNot = userInput === correctOne;
            // if correct then increase score
            if(correctOrNot) {
                setScrore(x => x + 1);
            }
            // push object to userAllAnswers array
            const ansObj = {
                question     : allQuestion[currentQuesNo].question,
                userAnswer   : userInput,
                correctOrNot : correctOrNot,
                correctAns   : correctOne
            }
            setUserAllAnswers(x => [...x, ansObj]);
        }
    }

    const nextQues = () => {
        if(currentQuesNo + 1 !== TOTAL_QUESTIONS) {
            setCurrentQuesNo(x => x + 1);
        }
        else {
            setGameover(true);
        }
    }

    const classes = useStyles();
    const screen400 = useMediaQuery('(max-width: 400px)');

    return (
        <ThemeProvider theme={theme}>
            <div
                className={classes.app}
                style={darkMode ?
                    { backgroundColor: "rgba(214, 69, 65, 1)" } : { backgroundColor: "rgba(83, 51, 237, 1)" }
                }
            >
                {
                    (!loading && !gameover)
                    &&
                    <>
                        <Typography
                            variant="h5"
                            className="score"
                            style={darkMode ?
                                { backgroundColor: "#FFFFFF", color: "#000000" } : { backgroundColor: "#000000", color: "#FFFFFF" }
                            }
                        > 
                           Score: {score}
                        </Typography>
                        <Typography
                            variant="h5"
                            className="quesNo"
                            style={darkMode ?
                                { backgroundColor: "#FFFFFF", color: "#000000" } : { backgroundColor: "#000000", color: "#FFFFFF" }
                            }
                        > 
                           Question: {currentQuesNo + 1} / {TOTAL_QUESTIONS}
                        </Typography>
                    </>
                }

                <Card
                    className={classnames(classes.card, "card")}
                    ref={cardAnimation.ref}
                    raised
                >
                    <CardContent>
                        <Typography variant="h2" className={(loading || !gameover) ? "hidetitle" : "title"} align="center">
                            Quiz Application
                        </Typography>

                        {
                            (gameover) && 
                            <Button
                                className="startBtn"
                                variant="contained"
                                color= {darkMode ? "secondary" : "primary"}
                                onClick={startQuiz}
                                style={darkMode ? { color : "#000000" } : { color : "#FFFFFF" }}
                            > Start
                            </Button>
                        }
                        
                        {
                            (loading && !gameover)
                            &&
                            <Typography
                                variant="h6"
                                className="loading"
                            >   <span> Loading. . . </span>
                                <div className={`spinner-border spinner-border-sm text-${darkMode ? `danger`: `primary`}`} role="status"> <span className="sr-only">Loading...</span> </div>
                                <div className={`spinner-border spinner-border-sm text-${darkMode ? `danger`: `primary`}`} role="status"> <span className="sr-only">Loading...</span> </div>
                                <div className={`spinner-border spinner-border-sm text-${darkMode ? `danger`: `primary`}`} role="status"> <span className="sr-only">Loading...</span> </div>
                            </Typography>
                        }
                        
                        {
                            (!loading && !gameover)
                            &&
                            <QuestionCard
                                thatQuestion={allQuestion[currentQuesNo].question}
                                thatAllOptions={allQuestion[currentQuesNo].allOptions}
                                userAllAnswers={userAllAnswers ? userAllAnswers[currentQuesNo] : undefined}
                                checkAns={checkAns}
                            /> 
                        }
                        
                        {
                            (!loading && !gameover && (userAllAnswers.length === currentQuesNo + 1) && (currentQuesNo !== TOTAL_QUESTIONS - 1))
                            &&
                            <Button
                                className="nextBtn"
                                variant="contained"
                                color= {darkMode ? "secondary" : "primary"}
                                onClick={nextQues}
                            > Next
                            </Button>
                        }
                    </CardContent>
                </Card>

                <div
                    onClick={() => setDarkMode(x => !x)}
                    ref={btnAnimation.ref as React.RefObject<HTMLDivElement>}
               >
                    <CardActionArea
                        className="chip"
                        ref={chipAnimation.ref as React.RefObject<HTMLButtonElement>}
                        onClick={() => chipAnimation?.getAnimation()?.play()}
                    >
                        <Chip
                            icon={
                                <Switch
                                    checked={!darkMode}
                                    style={{ color : darkMode ? "#000000" : "#FFFFFF" }}
                                    size={screen400 ? "small" : "medium"}
                                    className="hideon335"
                                />
                            }
                            label={
                                <Typography className={classes.themechip} style={{ color : darkMode ? "#000000" : "#FFFFFF" }}>
                                    <Brightness4SharpIcon id="icon"/>
                                    <span
                                        style={{ marginLeft: 7, fontWeight: "bold", fontStyle: "italic" }}
                                        className="hideon275"
                                    > theme </span>
                                </Typography>
                            }
                            className="fade_effect"
                            color= {darkMode ? "secondary" : "primary"}
                        />
                    </CardActionArea>
                    <span className="hideabove275"style={{ color : darkMode ? "#000000" : "#FFFFFF" }}> theme </span>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App;