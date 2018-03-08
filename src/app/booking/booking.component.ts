import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl} from '@angular/forms';

import { TdMediaService, TdDialogService } from '@covalent/core';
import { BookingService } from '../_services/booking.service';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDatepickerInputEvent} from '@angular/material/datepicker';

import { BookingRoom } from '../_model/core.model';

import * as _moment from 'moment';
const moment = _moment;

const DMY = 'DD-MM-YYYY';
const YMD = 'YYYY-MM-DD';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y'
  }
};

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  providers:[
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class BookingComponent implements OnInit {
  options: FormGroup;
  bookingCheckin : any;
  bookingCheckout : any;
  bookingNumGuest : number = 0;
  bookingNumOfDays : number = 1;

  //Used to define minDate of datepicker
  minCheckinDate : Date;
  minCheckoutDate : Date;
  currency:string = 'usd';

  listRooms: BookingRoom[] = Array();

  constructor(private bookSvc : BookingService, fb: FormBuilder, public media: TdMediaService, private _dialogService: TdDialogService) {
      this.options = fb.group({
        hideRequired: false,
        floatLabel: 'auto',
      });
  }

  ngOnInit() {
      this.bookingCheckin = moment();
      this.bookingCheckout = moment().add(1,'day');
      this.bookingNumGuest = 1;

      this.minCheckinDate = new Date(this.bookingCheckin.format(YMD));

      let startDate = moment();
      this.minCheckoutDate = new Date(startDate.add(1,'day').format(YMD));

      this.calcNumDays();
      this.doFind();
  }

  onDateChanged(type: string, event: any){
    //console.log(type + ' - ' + event.value);
    if(type == 'checkin'){
      let startDate = moment(this.bookingCheckin.format(YMD));
      this.minCheckoutDate = new Date(startDate.add(1,'day').format(YMD));
      
      if(this.bookingCheckout.format(YMD) <= this.bookingCheckin.format(YMD)){
        this.bookingCheckout = startDate;
      }     
    }

    this.calcNumDays();
  }

  private calcNumDays(){
    let endDate = moment(this.bookingCheckout.format(YMD));
    let beginDate = moment(this.bookingCheckin.format(YMD));
    let diff = endDate.diff(moment(beginDate.format(YMD)), 'days');
    this.bookingNumOfDays = diff;
  }

  changeCurrency(curr:string='usd'){
    this.currency = curr;
  }

  displayNameByCurrency(room:BookingRoom){
    let data = Array({value : 0, prefix : '' });
    
    if(room != null){
      if(this.currency == 'idr'){
        data['value'] = room.rateIDR;
        data['prefix'] = 'IDR';
      }else if(this.currency == 'yen'){
        data['value'] = room.rateYEN;
        data['prefix'] = 'JPY';
      }else{
        data['value'] = room.rateUSD;
        data['prefix'] = 'USD';
      }
    }

    return data;
  }

  doFind(){
    this.bookSvc.getBookingRooms(this.bookingCheckin.format(DMY),this.bookingCheckout.format(DMY),this.bookingNumGuest).then((result) => {
      this.listRooms = this.bookSvc.listRooms;
      
      this.listRooms.forEach(function (value){
        //console.log(value);
      });
    }, (err) => {
      console.log('Error ' + err);    
    });
  }
}
