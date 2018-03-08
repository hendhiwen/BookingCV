import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

import { BookingRoom } from '../_model/core.model';

@Injectable()
export class BookingService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private baseUrl = `https://app.monstera.co/dwijaya_booking`;

    listRooms:BookingRoom[] = Array();

    constructor(private http: Http) {
        //set token if saved in local storage        
    }

    searchUnit(checkinDate: string, checkoutDate: string, guestNumber: Number){
        return new Promise((resolve, reject) => {
            this.http.post(`${this.baseUrl}/restfull/search_reservation`,
            JSON.stringify({ checkinDate: checkinDate, checkoutDate: checkoutDate, guestNumber: guestNumber}), { headers: this.headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });

        });
    }

    getBookingRooms(checkinDate: string, checkoutDate: string, guestNumber: Number) {
        let promise = new Promise((resolve, reject) => {
            let apiURL = `${this.baseUrl}/rest/bookingrooms/${checkinDate}/${checkoutDate}/` + guestNumber.toString();
            //console.log('[getRooms] ' + apiURL);
            this.http.get(apiURL)
                .timeout(2000)
                .toPromise()
                .then(
                res => { // Success
                    //console.log(res.json());
                    if (res.json().valid == 1) {
                        this.listRooms = res.json().data.map(item => {
                            return new BookingRoom(
                                item.unit_type_id,
                                item.unit_type_name,
                                item.unit_type_desc,
                                item.pic_url,
                                item.rate_usd,
                                item.rate_yen,
                                item.rate_idr,
                                item.total_rate,
                                1
                            );
                        });
                    }

                    resolve();
                },
                msg => { // Error
                    reject(msg);
                }
                );
        });
        return promise;
    }
    
}