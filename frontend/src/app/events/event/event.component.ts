import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {EventDTOModel} from "../../_models/dto/eventDTOModel";
import {AlertService} from "../../_services/alert.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @Input('eventId') eventId: string;

  eventDTO: EventDTOModel;
  isCreator: boolean;
  isParticipant: boolean = false;
  additionEventForm: FormGroup;
  priority: string;

  constructor(private eventService: EventService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    console.log('isParticipant = ' + this.isParticipant);
    this.initAdditionEventForm();
    this.isCreator = false;
    const id = this.eventId;
    this.eventService.getEventById(id).subscribe((eventDTO: EventDTOModel) => {
      this.eventDTO = eventDTO;
      let currentUserId = JSON.parse(sessionStorage.getItem('currentUser')).id;
      let currentUserLogin = JSON.parse(sessionStorage.getItem('currentUser')).login;
      this.isCreator = currentUserId == this.eventDTO.event.creatorId;
      let isCurrentParticipant = this.eventDTO.additionEvent.people.find(x => x.valueOf() == currentUserLogin);
      this.isParticipant = isCurrentParticipant != undefined;
    });
  }

  initAdditionEventForm(): FormGroup {
    return this.additionEventForm = this.formBuilder.group({
      startTimeNotification: new FormControl()
    });
  }

  addParticipant() {
    this.eventService.addParticipant(this.eventDTO.event.id).subscribe(() => {
      this.isParticipant = true;
      this.eventDTO.additionEvent.people.push(JSON.parse(sessionStorage.getItem('currentUser')).id);
      this.router.navigate(['/eventlist','my']);
    });
  }

  removeParticipant() {
    this.eventService.removeParticipant(this.eventDTO.event.id).subscribe(() => {
      this.isParticipant = false;
      const indexOfId = this.eventDTO.additionEvent.people.indexOf(JSON.parse(sessionStorage.getItem('currentUser')).id);
      if (indexOfId > -1) {
        this.eventDTO.additionEvent.people.slice(indexOfId);
      }
      const indexOfLogin = this.eventDTO.additionEvent.people.indexOf(JSON.parse(sessionStorage.getItem('currentUser')).login);
      if (indexOfLogin > -1) {
        this.eventDTO.additionEvent.people.slice(indexOfLogin);
      }
    });
  }

  delete() {
    this.eventService.deleteEvent(this.eventDTO.event.id).subscribe(() => {
      this.alertService.info('Event successfully deleted!', true);
      this.router.navigate(['../home']);
    });
  }

  changePriority() {
    this.eventService.updatePriority(this.eventId, this.priority).subscribe(
      () => this.eventDTO.additionEvent.priority = this.priority,
      () => this.alertService.error('Something went wrong while updating priority', false)
    );
  }


}
