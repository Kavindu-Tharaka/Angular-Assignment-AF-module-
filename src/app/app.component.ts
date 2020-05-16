import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit{

  
  //properties of the class
  
  title = 'Event Organizer';
  inputEvent = '';
  btnText = 'Add';
  btnColor = 'btn-primary';
  nextEvent = '';
  nextEventCountDown = '';

  idCount = 0;

  Events = [];
  EventsTemp = [];

  date: NgbDateStruct;
  time = { hour: 0, minute: 0 };

  

  //functions of the class

  /*
  this method is a lifecycle method that is 
  called after Angular has initialized 
  all data-bound properties. I used it
  to invoke 'removeExpiredEvents()' method
  */
  ngOnInit(): void {
    this.removeExpiredEvents();
    this.calculateDaysToNextEvent();
  }


  /*
  this method is used to add an event
  */
  addEvent() {
    if (this.date === undefined || this.inputEvent === '') {
      Swal.fire('Enter Values First...');
    } else {
      const newEvent = {
        id: this.idCount++,
        date: this.date,
        event: this.inputEvent,
        time: this.time,
        isExpired: false,
        isDeleted: false,
        tryEdit: false,
        timeStamp : moment([this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute]).valueOf()
      };
      this.Events.push(newEvent);
      this.inputEvent = '';
      this.time = { hour: 0, minute: 0 };
    }
    this.EventsTemp = this.Events;
    this.btnText = 'Add';
    this.btnColor = 'btn-primary';
    this.nextEventReminder();
    this.filterEventsbyDate();
  }


  /*
  this method is used to delete an event
  */
  deleteEvent(event) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.Events = this.Events.filter(
          (eventItem) => eventItem.id !== event.id
        );
        Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
        this.EventsTemp = this.Events;
        this.filterEventsbyDate();
        this.nextEventReminder();
      }
    });
  }


  /*
  this method is used to edit an event
  */
  editEvent(event) {
    if (this.inputEvent === '') {
      this.btnText = 'Edit';
      this.btnColor = 'btn-success';

      this.date = {
        year: event.date.year,
        month: event.date.month,
        day: event.date.day,
      };
      this.time = { hour: event.time.hour, minute: event.time.minute };
      this.inputEvent = event.event;

      this.Events = this.Events.filter(
        (eventItem) => eventItem.id !== event.id
      );
    }
  }


  /* 
  this method will be invoked each time when we
  adding a new event and go through the array
  to identify which one is the nearest event to 
  current moment(current date and time). Then set
  that event as nearestEvent 
  */
  nextEventReminder() {
    let afterDates = [];
    
    for (let i = 0; i < this.Events.length; i++) {
      if ( moment(new Date(this.Events[i].date.year, this.Events[i].date.month - 1, this.Events[i].date.day, this.Events[i].time.hour, this.Events[i].time.minute)).isAfter(moment())) {
        afterDates.push(this.Events[i]);
      }
      else{
        console.log('');
      }
    }

    let nearestObj = afterDates[0];

    for(let i = 1; i < afterDates.length; i++) {
      if( moment(new Date(afterDates[i].date.year, afterDates[i].date.month, afterDates[i].date.day, afterDates[i].time.hour, afterDates[i].time.minute)).isBefore(new Date(nearestObj.date.year, nearestObj.date.month, nearestObj.date.day, nearestObj.time.hour, nearestObj.time.minute)) ){
        nearestObj = afterDates[i];
      }
    }
    try {
      this.nextEvent = nearestObj.date.year + '/' + nearestObj.date.month + '/' + nearestObj.date.day + '  ' +  nearestObj.time.hour + ':' + nearestObj.time.minute;
    } catch (error) {
      //console.log('not an error')
    }
  }


  /* 
  this method will be invoked each time when
  the datepicker selects a new date and 
  filter and display events that are related to 
  that particular date 
  */
  filterEventsbyDate(){
    this.EventsTemp = this.Events.filter(event => event.date.year === this.date.year && event.date.month === this.date.month && event.date.day === this.date.day);
  }


  /*
  this method will be invoked in 'ngOnInit()' method and 
  using 'setInterval()' method it will repeatedly check for
  how many time will remain to next event
  */
  calculateDaysToNextEvent(){

    setInterval(()=>{
      this.Events.forEach(event => {
        this.nextEventCountDown = moment([event.date.year , event.date.month , event.date.day , event.time.hour , event.time.minute , 0], "YYYYMMDDHHmmss").fromNow();
      });
    }, 1000);
  }


  /*
  this method will be invoked in 'ngOnInit()' method and 
  using 'setInterval()' method it will repeatedly check for 
  expired events and mark them as expired. expired events
  will be displayed with css style 'line-through'
  */
  removeExpiredEvents(){
    setInterval(()=>{
      this.Events.forEach(event => {
        if(event.timeStamp < Date.now()){
          event.isExpired = true;
          this.Events = this.Events.filter(
            (eventItem) => eventItem.id !== event.id
          );
        }
      });
    }, 1000);
  }
}