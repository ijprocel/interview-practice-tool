import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import $ from 'jquery';

function Intro1(props){
    return([
            <p key="intro1P1">Welcome to the interview question practice tool!</p>,
            <p key="intro1P2">This will allow you to practice some common interview questions</p>
    ])
}

function Intro2(props) {
    return ([
        <p key="intro2P1">You will be shown a series of commmon interview questions. For each one, you will have  30 seconds to consider your response 
        and then you will have 3 minutes to give your response.</p>,

        <p key="intro2P2">After answering the question, you will be asked to self-evaluate your response as <span className='boldThis'>Excellent</span>, <span className='boldThis'>Good</span>, or <span className='boldThis'>Fair</span>. 
        <i>Tip: record your response on a microphone and play it back to yourself afterwards!</i></p>,

        <p key="intro2P3">If you rate your response as <span className='boldThis'>Excellent</span>, the question will not be shown to you again.</p>,

        <p key="intro2P4">If you rate your response as <span className='boldThis'>Good</span>, you will be less likely to see the question again.</p>,

        <p key="intro2P5">If you rate your response as <span className='boldThis'>Fair</span>, you will be more likely to see the question again.</p>,

        <p key="intro2P6">Click <span className='boldThis'>Continue</span> to try the first question!</p>
    ])
}

function DisplayQuestion(props){
    return [
        <p key="reviewP1">{props.prompt}</p>,
        <p key="question">
            <span className='boldThis'>{props.cq}</span>
        </p>
    ];
}

function ShowProgress(props) {
    return (
        [
            <p key="resultsP1"><span className='boldThis'>Fair:</span></p>,
            <ul key="fair">
                {props.fair.map((val, index) => {return <li key={index}>{val}</li>})}
            </ul>,

            <p key="resultsP2"><span className='boldThis'>Good:</span></p>,
            <ul key="good">
                {props.good.map((val, index) => {return <li key={index}>{val}</li>})}
            </ul>,

            <p key="resultsP3"><span className='boldThis'>Excellent:</span></p>,
            <ul key="excellent">
                {props.excellent.map((val, index) => {return <li key={index}>{val}</li>})}
            </ul>,
        ]
    );
}

export default class InterviewSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {        
            sceneIndex: 0,
        };

        this.status = {
            questions: [
                "Tell me about yourself/give an elevator pitch.", 
                "Tell me about a time that you failed and how you learned from it.", 
                "Tell me about your favorite classes and how they'll prepare you for this position.", 
                "Tell me about a great success that you had.", 
                "Tell me about some challenges you faced while working on a team and how you overcame them.", 
                "What would you like your job title to be? What responsibilities would you like to have?",
                "Why do you want to work for (insert company)?"
            ],
            currentQuestion: 2,

            fair: [],
            good: [],
            excellent: [],
        }

        this.renderCallback = this.shuffleQuestions.bind(this);
        this.continue = this.continue.bind(this);
        this.countdown = this.countdown.bind(this);
        this.decProgBar = this.decProgBar.bind(this);
        this.rateQuestion = this.rateQuestion.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);

        this.sceneInfo = [
            {
                textBoxFunction: (() => {return <Intro1 />}), 
                timerStartVal: null, pbVisible: false, 
                buttons: ["Continue"],
                buttonFuncs: [this.continue],
                rc: () => {}
            },

            {
                textBoxFunction: (() => {return <Intro2 />}), 
                timerStartVal: null, pbVisible: false, 
                buttons: ["Continue"],
                buttonFuncs: [this.continue],
                rc: () => {this.countdown(30);}
            },

            {
                textBoxFunction: ((status) => {return <DisplayQuestion prompt="Your question is:" questions={status.questions} cq={status.currentQuestion} />}), 
                timerStartVal: "0:30", pbVisible: true, 
                buttons: ["Answer Question"],
                buttonFuncs: [this.continue],
                rc: () => {this.countdown(180);}
            },

            {
                textBoxFunction: ((status) => {return <DisplayQuestion prompt="Answering..." questions={status.questions} cq={status.currentQuestion} />}), 
                timerStartVal: "3:00", pbVisible: true, 
                buttons: ["Finished Answering"],
                buttonFuncs: [this.continue],
                rc: () => {}
            },

            {
                textBoxFunction: (() => {return [ <p key="rateP1">How would you rate your response to this question?</p> ];}), 
                timerStartVal: null, pbVisible: false, 
                buttons: ["Fair", "Good", "Excellent"],
                buttonFuncs: [() => {this.rateQuestion(1)}, () => {this.rateQuestion(2)}, () => {this.rateQuestion(3)}],
                rc: this.nextQuestion
            },

            {
                textBoxFunction: ((status) => {return <ShowProgress fair={status.fair} good={status.good} excellent={status.excellent} />}), 
                timerStartVal: null, pbVisible: false, 
                buttons: ["Next Question"],
                buttonFuncs: [this.continue],
                rc: () => {this.countdown(30);}
            },
        ];
    }

    componentDidMount(){
        this.renderCallback();
        this.renderCallback = this.sceneInfo[this.state.sceneIndex].rc;

        this.nextQuestion();
    }

    componentDidUpdate(){
        this.renderCallback();
        this.renderCallback = this.sceneInfo[this.state.sceneIndex].rc;
    }

    shuffleQuestions(){
        let arr = this.status.questions;
        for (let i = arr.length-1; i > 0; i--){
            let j = Math.floor(Math.random() * (i+1));
            let temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
        this.status.questions = arr;
    }

    continue() {
        clearInterval(this.onInterval);
        if (this.state.sceneIndex === 5){
            this.setState({sceneIndex: 2});
        }
        else {
            this.setState({sceneIndex: this.state.sceneIndex + 1});
        }
    }

    countdown(time) {
        const pb = $("#progressBar")[0];
        pb.style.width = "100%";
        pb.setAttribute("widthInPercent", "100%");

        var dpb = this.decProgBar;
        var cont = this.continue;

        this.onInterval = setInterval(function(){
            dpb(time, cont);
        }, 1000);
    }

    rateQuestion(rating) {
        let stat = this.status;
        let cq = stat.currentQuestion;
        switch(rating) {
            case 1:
                stat.fair.push(cq); break;
            case 2:
                stat.good.push(cq); break;
            case 3:
                stat.excellent.push(cq); break;
        }
        this.continue();    
    }

    nextQuestion() {
        let stat = this.status;
        if (stat.questions.length !== 0) {
            stat.currentQuestion = stat.questions.pop();
        }
        else if (stat.fair.length !== 0 || stat.good.length !== 0){
            let randInt = Math.floor(Math.random() * 3);
            if (randInt === 2){
                    if (stat.good.length !== 0){
                            stat.currentQuestion = stat.good.shift();
                            return;
                    }
                    stat.currentQuestion = stat.fair.shift();
            }
            else {
                    if (stat.fair.length != 0){
                            stat.currentQuestion = stat.fair.shift();
                            return;
                    }
                    stat.currentQuestion = stat.good.shift();
            }
        }
        else {
            window.alert("Congratulations! You've given an excellent response to every question and you're ready for the interview!");
            $('#buttons').remove();
        }
    }

    decProgBar(numSeconds, func){
        const pb = $("#progressBar")[0];
        
        const currentWidth = pb.getAttribute("widthinpercent");
        const increment = 100.0 / numSeconds;
        const newWidth = parseFloat(currentWidth) - increment;
        
        pb.style.width = newWidth + "%";
        pb.setAttribute("widthinpercent", newWidth);
        
        const timer = $("#timer")[0];
        const timeString = timer.innerText.split(":");
        let min = parseInt(timeString[0]);
        let sec = parseInt(timeString[1]);
        sec -=1;

        if (sec == -1){
            min -=1;
            sec = 59;
        }

        sec = sec.toString().padStart(2, '0');
        if (min != -1){
            timer.innerText = min + ":" + sec;
        }

        if (newWidth <= 0){
            clearInterval(this.onInterval);
            pb.style.width = "0%";
            func();
        }
    }

    render () {
        const scene = this.sceneInfo[this.state.sceneIndex];
        return (
            <Container id='questionEnclosure'>
                <Row id="STARreminder">
                    <span className="STAR">Situation</span>
                    <span className="STAR">></span>
                    <span className="STAR">Task</span>
                    <span className="STAR">></span>
                    <span className="STAR">Action</span>
                    <span className="STAR">></span>
                    <span className="STAR">Result</span>
                </Row>
                <Row key="textbox" id="textbox" style={{height: (scene.pbVisible ? '200px' : '265px')}}>
                    <Col>
                        {scene.textBoxFunction(this.status)}
                    </Col>
                </Row>
                <Row key="timer" id="timer" style={{height: (scene.pbVisible ? '25px' : '0px')}}>
                    {scene.timerStartVal}
                </Row>
                <Row style={{height: (scene.pbVisible ? '40px' : '0px')}}>
                    <div key="PBbackground" id="PBbackground" style={{height: (scene.pbVisible ? '40px' : '0px')}}>
                        <div id="progressBar" style={{height: '100%'}}></div>
                    </div>
                </Row>
                <Row key="buttons" id="buttons" style={{marginTop: '5px'}}>
                    {scene.buttons.map((btn, index) => {return <button key={index} onClick={scene.buttonFuncs[index]}>{btn}</button>})}
                </Row>
            </Container>
        );
    }
}