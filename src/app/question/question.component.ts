import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted: boolean = false;

  constructor(private qService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.qService.getQuestionJson().subscribe(res => {
      this.questionList = res.questions;
    })
  }

  nextQuestion(){
    this.currentQuestion++;
    this.resetCounter();
  }

  previousQuestion(){
    this.currentQuestion--;
    this.resetCounter();
  }

  answer(currentQno:number, option:any){

    // to display result container
    if (currentQno === this.questionList.length) {
      this.isQuizCompleted = true;
      this.startCounter();
    }

    // for process after submitting the answer on each page
    if(option.correct){
      this.points += 10;           // increase points by 10
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;      // load next question
      this.resetCounter();
      this.getProgressPercent();
      }, 1000);

    }else{
      setTimeout(() => {
      this.currentQuestion++;     // load next question
      this.inCorrectAnswer++;
      this.resetCounter();
      this.getProgressPercent();
      }, 1000);
      this.points-=10;            // decrease points by 10
    }

  }

  startCounter(){
    this.interval$ = interval(1000).subscribe(val => {
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter = 60;
        this.points -= 10;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter(){
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = "0";
    this.startCounter();
  }

  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

}
