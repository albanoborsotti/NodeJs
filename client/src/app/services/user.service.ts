import{Injectable} from '@angular/core';
//import{Http, Response, Headers, Jsonp} from '@angular/http';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import{delay, catchError} from "rxjs/operators";
import { map } from "rxjs/operators";
import {Observable} from 'rxjs';
import{GLOBAL} from './global';

@Injectable()
export class UserService{
    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    signUp(userToLogin, getHash = null){
        if(getHash!=null){
            userToLogin.getHash = getHash;
        }

        let json = JSON.stringify(userToLogin);
        let params = json;
        
        let headers = new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url + 'login', params,{headers:headers}).pipe(map(res => res));
    }

}