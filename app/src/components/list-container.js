'use strict';

import {Component} from '@angular/core';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'docker-app-list-container',
    providers: [HTTP_PROVIDERS],
    template: `
    <table class="table">
        <tr><th>Id</th><th>Image</th><th>Commande</th><th>Statut</th><th>Actions</th><tr>
        <tr *ngFor="let container of containers">
            <td>{{ container.Id }}</td>
            <td>{{ container.Image }}</td>
            <td>{{ container.Command }}</td>
            <td>{{ container.Status }}</td>
            <td>
                <button class="btn btn-success btn-xs">Start</button>
                <button class="btn btn-primary btn-xs">Stop</button>
                <button class="btn btn-warning btn-xs">Kill</button>
                <button class="btn btn-danger btn-xs">Supprimer</button>
            </td>
        </tr>
    </table>
    <div class="alert alert-info" *ngIf="containers.length === 0" role="alert">Aucun container.</div>
    `
})
export class ListContainer {

    constructor (http: Http) {
        this.containers = [];

        http.get('http://92.222.88.16:8080/containers')
            .map(res => res.json())
            .subscribe(containers => this.containers = containers);
    }
}
