import {Component, OnInit} from '@angular/core';
import {AdditionEventModel} from "../../_models/additionEvent.model";
import {AlertService, EventService} from "../../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {EventDTOModel} from "../../_models/dto/eventDTOModel";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-event-notification',
  templateUrl: './event-notification.component.html',
  styleUrls: ['./event-notification.component.css']
})
export class EventNotificationComponent implements OnInit {
  eventDTO: EventDTOModel;
  isCreator: boolean;
  isParticipant: boolean;
  additionEventForm: FormGroup;
  isValidFormSubmitted: boolean;

  constructor(private eventService: EventService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.initAdditionEventForm();
    this.isCreator = false;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventService.getEventById(id).subscribe((eventDTO) => {
      this.eventDTO = eventDTO;
      let currentUserId = JSON.parse(sessionStorage.getItem('currentUser')).id;
      this.isCreator = currentUserId == this.eventDTO.event.creatorId;
      this.eventService.isParticipant(currentUserId, this.eventDTO.event.id).subscribe(() => {
        this.isParticipant = true
      }, () => {
        this.isParticipant = false
      })

    });
  }

  initAdditionEventForm(): FormGroup {
    return this.additionEventForm = this.formBuilder.group({
        startTimeNotification: new FormControl()
      }
      , {
        validator: [this.dateBeforeNow('startTimeNotification')
          , this.dateAfterEventStart('startTimeNotification')
        ]
      }
    );
  }

  changeNotStartTime(additionEvent: AdditionEventModel) {
    this.isValidFormSubmitted = false;
    if (this.additionEventForm.invalid) {
      this.alertService.error("You input is wrong. Please, check and try again", false);
      return;
    }
    this.isValidFormSubmitted = true;
    if (additionEvent.startTimeNotification != null) {
      this.eventDTO.additionEvent.startTimeNotification = (additionEvent.startTimeNotification).slice(0, 10) + ' ' + (additionEvent.startTimeNotification).slice(11, 16) + ':00';
    }
    this.eventService.updateEventNotif(this.eventDTO).subscribe(() => {
      this.alertService.info('Notification time successfully set!', true);
      return this.router.navigate(['eventlist', 'my'])
    });
  }

  dateBeforeNow(date: string) {
    return (group: FormGroup): {
      [key: string]: any
    } => {
      let notificationDate = group.controls[date].value;
      return Date.parse(notificationDate) < Date.now() ? {dateBeforeNow: "Notifications cannot start in the past"} : {}
    }
  }

  dateAfterEventStart(date: string) {
    return (group: FormGroup): {
      [key: string]: any
    } => {
      let notificationDate = group.controls[date].value;
      return this.eventDTO
        ? Date.parse(notificationDate) > Date.parse(this.eventDTO.event.startTime)
          ? {dateAfterEventStart: "Notifications cannot begin after event start"}
          : {}
        : {}
    }
  }
}
